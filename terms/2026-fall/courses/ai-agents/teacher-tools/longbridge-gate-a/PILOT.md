# Longbridge pilot record (former W4 plan)

> Historical pilot evidence; not a current W4 assignment or automatic approval for W10.

## 2026-09-08 · macOS teacher baseline

Result: **PASS as a teacher-side feasibility test; NOT READY as a student route.**

- account path: SG Demo A/C, compatible API Keys;
- SDK: locked `longbridge==4.5.0`, Python 3.12;
- fixed request: `AAPL.US / day / no adjustment / 2025-01-02..2025-01-10`;
- response: 6 sessions (`02, 03, 06, 07, 08, 10` January 2025);
- output: `course.market-bars.v1`, `longbridge_readonly`, paper, 6 bars;
- time normalization: daily event times became `05:00:00Z`, corresponding to midnight in `America/New_York` for this January window;
- local artifact: `/tmp/course-w4-longbridge-source.json`, mode `0600`, no credential fields;
- current clipboard after the run: 0 bytes;
- trusted fetcher checks: 17 unit tests passed;
- student-side contract checks: 24 cumulative W3 + W4 tests passed in a clean temporary checkout;
- end-to-end hand-off: the fresh private Longbridge envelope passed the same `market-observe` entry point as replay, with `MARKET_CONTRACT=PASS`;
- OAuth paper flow was not reliable in this pilot; it is not a second classroom route.

No price values, account identifier, credential value, or raw SDK response are recorded here.

## Why this is not yet the student baseline

The clipboard tool shortens credential exposure and prevents persistence in the project, but it runs as the same OS user as the local Agent. Closing the Agent is an operating rule, not a technical proof that the Agent cannot access the credential. The existing course safety contract therefore keeps the student route on replay for now.

## Freeze gate for a real student route

All items below must be demonstrated before the Guide may contain a real-route command:

1. 2–4 near-student users complete SG registration, paper activation, compatible API Keys, and the fixed request on clean WSL and the campus network;
2. task timing is recorded, including completion rate and p50/p80;
3. the credential holder is technically unreadable and uninvokable by the ordinary Agent session, rather than merely outside the Git working tree;
4. missing, duplicate, extra and empty credentials, inherited SDK variables, `.env`, custom endpoints and log paths all fail closed without echo;
5. the WSL output passes the same `course.market-bars.v1` contract as replay;
6. the data-use terms permit the chosen private hand-off; otherwise only the teacher displays sanitized evidence;
7. a real-route failure switches to replay by minute 8 without affecting W4 eligibility.

Until every item is green, `longbridge_readonly` is a teacher demonstration or explicitly approved pilot, while `replay` is the supported student route.

## 2026-09-08 · Agent Auth Code minimum-scope pilot

Result: **PASS on the teacher Mac for registration → minimum authorization → one explicit API call → remote revoke → local cleanup. NOT YET A WSL OR WHOLE-CLASS RESULT.**

- The already registered SG account opened its `Demo A/C` on `open.longbridge.com/connect`.
- The official CLI was installed from the Longbridge Homebrew tap at version `0.28.5`.
- The authorization retained only the mandatory **Basic data access** permission. The page had **Watchlist selected by default**, so it was explicitly deselected; Account & Positions, Trade Order Lookup, and Trade Execution remained off.
- A code generated on `.com` failed when the CLI used its automatic mainland route (`Authorization code does not carry a client_id`). A fresh `.com` code succeeded when redemption explicitly used `LONGBRIDGE_REGION=global`.
- The local session then reported a valid token in the `ap` data center. Both access points were reachable in this one observation; `.cn` was materially faster, but one latency sample is not a course decision.
- The frozen call `AAPL.US / day / none / 2025-01-02..2025-01-10` returned exactly 6 rows and the expected six UTC event times. No OHLCV values were retained in this record.
- A read-only asset request and a read-only order-history request both failed for insufficient permission. This is direct evidence that the grant did not include account or trade lookup scopes; no mutation command was attempted.
- The authorization was removed from **OAuth Authorized Apps**. `longbridge check` still described the locally cached token as valid, so it was not accepted as revocation evidence; the same real market API call was then rejected by the server.
- `longbridge auth logout` cleared the local token, and the current clipboard contained 0 bytes afterward.

One discarded, unredeemed code appeared in a diagnostic screenshot during the first attempt. It was never exchanged and had a 10-minute expiry. The successful authorization used a fresh code, was not printed or screenshotted, and was revoked as described above. The classroom flow must therefore prohibit screenshots on the code page and copy the code only through the intended button.

This pilot proves that `.com + LONGBRIDGE_REGION=global` is technically viable on the teacher Mac and that minimum market-data authorization is enforceable. It does not yet prove fresh student registration, WSL installation, campus-network behavior, p80 completion time, accessibility of the permission UI, or reliable cleanup by novices.
