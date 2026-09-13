"""One-shot, paper-only Longbridge source adapter for AI Agents W4.

The program intentionally has no command-line options. It reads the fixed
three-line API credential block from the system clipboard, clears the current
clipboard, fetches one frozen daily-candle query, writes a course envelope
outside the repository, and exits. It never imports a trading context.
"""

from __future__ import annotations

import json
import os
import re
import shutil
import subprocess
import sys
from collections.abc import Mapping, Sequence
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Protocol
from zoneinfo import ZoneInfo


SCHEMA_VERSION = "course.market-bars.v1"
SYMBOL = "AAPL.US"
PERIOD = "day"
ADJUSTMENT = "none"
START_DATE = date(2025, 1, 2)
END_DATE = date(2025, 1, 10)
MARKET_TIMEZONE = "America/New_York"
EXPECTED_SESSION_DATES = (
    "2025-01-02",
    "2025-01-03",
    "2025-01-06",
    "2025-01-07",
    "2025-01-08",
    "2025-01-10",
)
OUTPUT = Path("/tmp/course-w4-longbridge-source.json")
MAX_CLIPBOARD_BYTES = 64 * 1024

EXPECTED_CREDENTIAL_NAMES = (
    "LONGBRIDGE_APP_KEY",
    "LONGBRIDGE_APP_SECRET",
    "LONGBRIDGE_ACCESS_TOKEN",
)
LEGACY_CREDENTIAL_NAMES = (
    "LONGPORT_APP_KEY",
    "LONGPORT_APP_SECRET",
    "LONGPORT_ACCESS_TOKEN",
)
SENSITIVE_PREFIXES = ("LONGBRIDGE_", "LONGPORT_")


class CredentialInputError(ValueError):
    """A safe-to-display credential-input failure."""


class SourceContractError(ValueError):
    """A safe-to-display source-envelope failure."""


class ConfigFactory(Protocol):
    @staticmethod
    def from_apikey(
        app_key: str,
        app_secret: str,
        access_token: str,
        **kwargs: object,
    ) -> object: ...


def _run_clipboard_command(
    arguments: Sequence[str],
    *,
    input_bytes: bytes | None = None,
) -> bytes:
    completed = subprocess.run(
        list(arguments),
        input=input_bytes,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=False,
    )
    return completed.stdout


def _read_wsl_clipboard() -> str:
    powershell = r"""
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
Add-Type -AssemblyName System.Windows.Forms
$value = Get-Clipboard -Raw
[System.Windows.Forms.Clipboard]::Clear()
[Console]::Out.Write($value)
"""
    raw = _run_clipboard_command(
        [
            "powershell.exe",
            "-NoLogo",
            "-NoProfile",
            "-NonInteractive",
            "-STA",
            "-Command",
            powershell,
        ]
    )
    return raw.decode("utf-8").replace("\r\n", "\n")


def _read_macos_clipboard() -> str:
    raw = _run_clipboard_command(["pbpaste"])
    _run_clipboard_command(["pbcopy"], input_bytes=b"")
    return raw.decode("utf-8").replace("\r\n", "\n")


def read_and_clear_current_clipboard() -> str:
    """Read once from a supported clipboard and clear its current value."""
    try:
        if shutil.which("powershell.exe"):
            return _read_wsl_clipboard()
        if (
            sys.platform == "darwin"
            and shutil.which("pbpaste")
            and shutil.which("pbcopy")
        ):
            return _read_macos_clipboard()
    except (OSError, subprocess.SubprocessError, UnicodeError) as error:
        raise CredentialInputError("could not read and clear current clipboard") from error
    raise CredentialInputError("unsupported clipboard; use WSL or macOS")


def _unquote(value: str) -> str:
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def parse_credentials(raw: str) -> dict[str, str]:
    """Parse exactly one complete Longbridge credential namespace."""
    if len(raw.encode("utf-8")) > MAX_CLIPBOARD_BYTES:
        raise CredentialInputError("clipboard content is too large")

    pairs: dict[str, str] = {}
    for line in raw.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith("export "):
            stripped = stripped[7:].lstrip()
        if "=" not in stripped:
            raise CredentialInputError("clipboard must contain only three KEY=VALUE lines")
        name, value = stripped.split("=", 1)
        name = name.strip()
        value = _unquote(value.strip())
        if not re.fullmatch(r"[A-Z][A-Z0-9_]*", name):
            raise CredentialInputError("credential key name is invalid")
        if name in pairs:
            raise CredentialInputError("credential key is duplicated")
        if not value:
            raise CredentialInputError("credential value is empty")
        pairs[name] = value

    names = tuple(pairs)
    allowed_sets = {frozenset(EXPECTED_CREDENTIAL_NAMES), frozenset(LEGACY_CREDENTIAL_NAMES)}
    if frozenset(names) not in allowed_sets or len(pairs) != 3:
        raise CredentialInputError("clipboard must contain exactly one complete credential set")

    if frozenset(names) == frozenset(LEGACY_CREDENTIAL_NAMES):
        return {
            new_name: pairs[old_name]
            for new_name, old_name in zip(
                EXPECTED_CREDENTIAL_NAMES, LEGACY_CREDENTIAL_NAMES, strict=True
            )
        }
    return {name: pairs[name] for name in EXPECTED_CREDENTIAL_NAMES}


def clear_inherited_longbridge_environment(
    environment: dict[str, str] | os._Environ[str] | None = None,
) -> tuple[str, ...]:
    """Remove SDK-affecting variables before the SDK is imported."""
    target = os.environ if environment is None else environment
    removed = tuple(
        sorted(name for name in tuple(target) if name.startswith(SENSITIVE_PREFIXES))
    )
    for name in removed:
        target.pop(name, None)
    return removed


def build_paper_config(
    credentials: Mapping[str, str],
    config_factory: type[ConfigFactory],
) -> object:
    """Construct only an explicitly paper-restricted SDK configuration."""
    return config_factory.from_apikey(
        credentials["LONGBRIDGE_APP_KEY"],
        credentials["LONGBRIDGE_APP_SECRET"],
        credentials["LONGBRIDGE_ACCESS_TOKEN"],
        enable_papertrading=True,
        enable_print_quote_packages=False,
        log_path=None,
    )


def _utc_rfc3339(value: datetime) -> str:
    # Longbridge currently exposes SDK timestamps as local-naive datetimes.
    # timestamp() recovers the underlying epoch using the machine timezone.
    if value.tzinfo is None:
        value = datetime.fromtimestamp(value.timestamp(), timezone.utc)
    else:
        value = value.astimezone(timezone.utc)
    return value.isoformat(timespec="seconds").replace("+00:00", "Z")


def normalize_candlestick(candle: Any, *, observed_at: str) -> dict[str, object]:
    event_time = _utc_rfc3339(candle.timestamp)
    utc_value = datetime.fromisoformat(event_time.replace("Z", "+00:00"))
    session_date = utc_value.astimezone(ZoneInfo(MARKET_TIMEZONE)).date().isoformat()
    return {
        "symbol": SYMBOL,
        "session_date": session_date,
        "market_timezone": MARKET_TIMEZONE,
        "event_time": event_time,
        "available_at": observed_at,
        "open": str(candle.open),
        "high": str(candle.high),
        "low": str(candle.low),
        "close": str(candle.close),
        "volume": int(candle.volume),
    }


def build_source_envelope(
    candles: Sequence[Any],
    *,
    observed_at: datetime | None = None,
) -> dict[str, object]:
    if not candles:
        raise SourceContractError("fixed quote query returned no rows")

    observed = observed_at or datetime.now(timezone.utc)
    if observed.tzinfo is None:
        raise SourceContractError("observation time must include a timezone")
    as_of = _utc_rfc3339(observed)
    bars = sorted(
        (normalize_candlestick(candle, observed_at=as_of) for candle in candles),
        key=lambda row: str(row["event_time"]),
    )
    sessions = tuple(str(row["session_date"]) for row in bars)
    if sessions != EXPECTED_SESSION_DATES:
        raise SourceContractError("fixed quote query returned unexpected trading sessions")

    return {
        "schema_version": SCHEMA_VERSION,
        "execution_mode": "longbridge_readonly",
        "platform_called": True,
        "source": "longbridge",
        "account_mode": "paper",
        "query": {
            "symbol": SYMBOL,
            "period": PERIOD,
            "adjustment": ADJUSTMENT,
            "start_date": START_DATE.isoformat(),
            "end_date": END_DATE.isoformat(),
            "market_timezone": MARKET_TIMEZONE,
        },
        "as_of": as_of,
        "bars": bars,
    }


def write_private_json(payload: Mapping[str, object], output: Path = OUTPUT) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    descriptor = os.open(output, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as stream:
            json.dump(payload, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
    finally:
        # fdopen closes on success; this branch handles an error before wrapping.
        try:
            os.close(descriptor)
        except OSError:
            pass
    output.chmod(0o600)


def run(argv: Sequence[str] = ()) -> int:
    try:
        # A failed retry must never leave a previous successful snapshot looking
        # current. The path is fixed and dedicated to this one-shot tool.
        OUTPUT.unlink(missing_ok=True)
    except OSError:
        print("SOURCE_OUTPUT=FAIL")
        print("reason=cannot-clear-stale-output")
        return 1
    if argv:
        print("INVOCATION=FAIL")
        print("reason=fixed-command-only")
        return 2
    try:
        raw = read_and_clear_current_clipboard()
        credentials = parse_credentials(raw)
        raw = ""
        print("CREDENTIAL_INPUT=PASS")

        clear_inherited_longbridge_environment()
        from longbridge.openapi import AdjustType, Config, Period, QuoteContext

        config = build_paper_config(credentials, Config)
        credentials.clear()
        print("PAPER_GUARD=PASS")

        quote = QuoteContext(config)
        candles = quote.history_candlesticks_by_date(
            SYMBOL,
            Period.Day,
            AdjustType.NoAdjust,
            START_DATE,
            END_DATE,
        )
        payload = build_source_envelope(candles)
        write_private_json(payload)
        print("QUOTE_CHECK=PASS")
        print(f"SOURCE_CONTRACT=PASS rows={len(payload['bars'])} output={OUTPUT}")
        return 0
    except CredentialInputError as error:
        print("CREDENTIAL_INPUT=FAIL")
        print(f"reason={error}")
    except SourceContractError as error:
        print("SOURCE_CONTRACT=FAIL")
        print(f"reason={error}")
    except Exception:
        # SDK exception messages may contain request details. Keep public output
        # deliberately coarse; classify account/network state in the dashboard.
        print("QUOTE_CHECK=FAIL")
        print("reason=authentication-or-network")
    return 1


def main() -> None:
    raise SystemExit(run(sys.argv[1:]))


if __name__ == "__main__":
    main()
