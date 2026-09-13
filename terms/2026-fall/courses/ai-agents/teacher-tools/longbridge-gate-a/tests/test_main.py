from __future__ import annotations

import io
import json
import stat
import subprocess
import tempfile
import unittest
from contextlib import redirect_stdout
from datetime import datetime, timezone
from decimal import Decimal
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, call, patch

import main


SECRET = "secret-value-that-must-not-be-printed"


def credential_block(*, legacy: bool = False, token: str = "token==") -> str:
    prefix = "LONGPORT" if legacy else "LONGBRIDGE"
    return "\n".join(
        (
            f'export {prefix}_APP_KEY="app-key"',
            f"{prefix}_APP_SECRET='app-secret'",
            f"{prefix}_ACCESS_TOKEN={token}",
        )
    )


def candle(day: int):
    return SimpleNamespace(
        timestamp=datetime(2025, 1, day, 5, tzinfo=timezone.utc),
        open=Decimal("100.00"),
        high=Decimal("103.00"),
        low=Decimal("99.00"),
        close=Decimal("102.00"),
        volume=1000 + day,
    )


class CredentialParsingTest(unittest.TestCase):
    def test_accepts_export_quotes_and_equals_inside_token(self) -> None:
        parsed = main.parse_credentials(credential_block())
        self.assertEqual(parsed["LONGBRIDGE_APP_KEY"], "app-key")
        self.assertEqual(parsed["LONGBRIDGE_APP_SECRET"], "app-secret")
        self.assertEqual(parsed["LONGBRIDGE_ACCESS_TOKEN"], "token==")

    def test_normalizes_legacy_namespace(self) -> None:
        parsed = main.parse_credentials(credential_block(legacy=True))
        self.assertEqual(set(parsed), set(main.EXPECTED_CREDENTIAL_NAMES))

    def test_rejects_missing_duplicate_extra_empty_and_mixed_sets(self) -> None:
        bad_inputs = (
            "LONGBRIDGE_APP_KEY=a\nLONGBRIDGE_APP_SECRET=b",
            "LONGBRIDGE_APP_KEY=a\nLONGBRIDGE_APP_KEY=b\nLONGBRIDGE_ACCESS_TOKEN=c",
            credential_block() + "\nEXTRA=value",
            "LONGBRIDGE_APP_KEY=a\nLONGBRIDGE_APP_SECRET=\nLONGBRIDGE_ACCESS_TOKEN=c",
            "LONGBRIDGE_APP_KEY=a\nLONGPORT_APP_SECRET=b\nLONGBRIDGE_ACCESS_TOKEN=c",
        )
        for raw in bad_inputs:
            with self.subTest(first_line=raw.splitlines()[0]):
                with self.assertRaises(main.CredentialInputError) as caught:
                    main.parse_credentials(raw)
                self.assertNotIn(SECRET, str(caught.exception))

    def test_error_never_echoes_unknown_secret(self) -> None:
        with self.assertRaises(main.CredentialInputError) as caught:
            main.parse_credentials(f"NOT_A_KEY={SECRET}")
        self.assertNotIn(SECRET, str(caught.exception))


class ClipboardTest(unittest.TestCase):
    @patch("main._run_clipboard_command")
    def test_macos_reads_then_clears_current_clipboard(self, runner: Mock) -> None:
        runner.side_effect = [credential_block().encode(), b""]
        self.assertEqual(main._read_macos_clipboard(), credential_block())
        self.assertEqual(
            runner.call_args_list,
            [call(["pbpaste"]), call(["pbcopy"], input_bytes=b"")],
        )

    @patch("main._run_clipboard_command")
    def test_wsl_command_uses_no_profile_and_clears_clipboard(self, runner: Mock) -> None:
        runner.return_value = credential_block().replace("\n", "\r\n").encode()
        self.assertEqual(main._read_wsl_clipboard(), credential_block())
        arguments = runner.call_args.args[0]
        self.assertIn("-NoProfile", arguments)
        self.assertIn("-NonInteractive", arguments)
        self.assertIn("-STA", arguments)
        script = arguments[-1]
        self.assertIn("OutputEncoding", script)
        self.assertIn("Clipboard]::Clear()", script)
        self.assertNotIn("app-key", script)

    @patch("main._read_macos_clipboard")
    @patch("main.shutil.which")
    def test_clipboard_process_failure_becomes_safe_input_error(
        self, which: Mock, reader: Mock
    ) -> None:
        which.side_effect = lambda name: "/usr/bin/" + name if name in {"pbpaste", "pbcopy"} else None
        reader.side_effect = subprocess.CalledProcessError(1, ["pbpaste"], stderr=SECRET.encode())
        with patch.object(main.sys, "platform", "darwin"):
            with self.assertRaises(main.CredentialInputError) as caught:
                main.read_and_clear_current_clipboard()
        self.assertNotIn(SECRET, str(caught.exception))


class PaperConfigurationTest(unittest.TestCase):
    def test_removes_all_inherited_sdk_variables(self) -> None:
        environment = {
            "LONGBRIDGE_HTTP_URL": "https://untrusted.invalid",
            "LONGBRIDGE_APP_KEY": SECRET,
            "LONGPORT_LOG_PATH": "/tmp/leak.log",
            "UNRELATED": "keep",
        }
        removed = main.clear_inherited_longbridge_environment(environment)
        self.assertEqual(environment, {"UNRELATED": "keep"})
        self.assertEqual(
            removed,
            ("LONGBRIDGE_APP_KEY", "LONGBRIDGE_HTTP_URL", "LONGPORT_LOG_PATH"),
        )

    def test_config_is_always_paper_only_and_log_free(self) -> None:
        factory = Mock()
        credentials = main.parse_credentials(credential_block())
        main.build_paper_config(credentials, factory)
        factory.from_apikey.assert_called_once_with(
            "app-key",
            "app-secret",
            "token==",
            enable_papertrading=True,
            enable_print_quote_packages=False,
            log_path=None,
        )


class SourceEnvelopeTest(unittest.TestCase):
    def test_builds_frozen_course_schema(self) -> None:
        candles = [candle(day) for day in (10, 2, 8, 3, 7, 6)]
        observed = datetime(2026, 9, 8, 4, 5, 6, tzinfo=timezone.utc)
        payload = main.build_source_envelope(candles, observed_at=observed)
        self.assertEqual(payload["schema_version"], "course.market-bars.v1")
        self.assertEqual(payload["execution_mode"], "longbridge_readonly")
        self.assertIs(payload["platform_called"], True)
        self.assertEqual(payload["account_mode"], "paper")
        self.assertEqual(payload["as_of"], "2026-09-08T04:05:06Z")
        self.assertEqual(
            [row["session_date"] for row in payload["bars"]],
            list(main.EXPECTED_SESSION_DATES),
        )
        self.assertTrue(
            all(row["available_at"] == payload["as_of"] for row in payload["bars"])
        )

    def test_rejects_unexpected_sessions(self) -> None:
        with self.assertRaises(main.SourceContractError):
            main.build_source_envelope([candle(2)])

    @patch("main.datetime")
    def test_local_naive_sdk_timestamp_converts_through_epoch(self, fake_datetime: Mock) -> None:
        local_naive = datetime(2025, 1, 2, 13, 0, 0)
        fake_datetime.fromtimestamp.return_value = datetime(
            2025, 1, 2, 5, 0, 0, tzinfo=timezone.utc
        )
        result = main._utc_rfc3339(local_naive)
        self.assertEqual(result, "2025-01-02T05:00:00Z")
        fake_datetime.fromtimestamp.assert_called_once_with(
            local_naive.timestamp(), timezone.utc
        )

    def test_output_file_is_private_and_json(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "source.json"
            main.write_private_json({"safe": True}, output)
            self.assertEqual(json.loads(output.read_text()), {"safe": True})
            self.assertEqual(stat.S_IMODE(output.stat().st_mode), 0o600)


class SafeFailureTest(unittest.TestCase):
    @patch("main.read_and_clear_current_clipboard")
    def test_rejects_all_command_line_options_before_reading_clipboard(
        self, reader: Mock
    ) -> None:
        output = io.StringIO()
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "source.json"
            with patch.object(main, "OUTPUT", target), redirect_stdout(output):
                status = main.run(("--symbol", SECRET))
        self.assertEqual(status, 2)
        self.assertEqual(
            output.getvalue().splitlines(),
            ["INVOCATION=FAIL", "reason=fixed-command-only"],
        )
        self.assertNotIn(SECRET, output.getvalue())
        reader.assert_not_called()

    @patch("main.read_and_clear_current_clipboard")
    def test_bad_clipboard_does_not_echo_credential_value(self, reader: Mock) -> None:
        reader.return_value = f"NOT_A_KEY={SECRET}"
        output = io.StringIO()
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "source.json"
            with patch.object(main, "OUTPUT", target), redirect_stdout(output):
                status = main.run()
        self.assertEqual(status, 1)
        self.assertIn("CREDENTIAL_INPUT=FAIL", output.getvalue())
        self.assertNotIn(SECRET, output.getvalue())

    @patch("main.read_and_clear_current_clipboard")
    def test_failed_retry_removes_previous_snapshot(self, reader: Mock) -> None:
        reader.return_value = "invalid"
        with tempfile.TemporaryDirectory() as directory:
            stale = Path(directory) / "source.json"
            stale.write_text("old snapshot")
            with patch.object(main, "OUTPUT", stale), redirect_stdout(io.StringIO()):
                status = main.run()
            self.assertFalse(stale.exists())
        self.assertEqual(status, 1)

    @patch("main.write_private_json")
    @patch("main.build_source_envelope")
    @patch("main.build_paper_config")
    @patch("main.clear_inherited_longbridge_environment")
    @patch("main.read_and_clear_current_clipboard")
    def test_sdk_error_is_coarse_and_does_not_leak(
        self,
        reader: Mock,
        clear_environment: Mock,
        build_config: Mock,
        build_envelope: Mock,
        write_json: Mock,
    ) -> None:
        reader.return_value = credential_block(token=SECRET)
        build_config.side_effect = RuntimeError(SECRET)
        output = io.StringIO()
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "source.json"
            with patch.object(main, "OUTPUT", target), redirect_stdout(output):
                status = main.run()
        self.assertEqual(status, 1)
        self.assertIn("QUOTE_CHECK=FAIL", output.getvalue())
        self.assertNotIn(SECRET, output.getvalue())
        build_envelope.assert_not_called()
        write_json.assert_not_called()


if __name__ == "__main__":
    unittest.main()
