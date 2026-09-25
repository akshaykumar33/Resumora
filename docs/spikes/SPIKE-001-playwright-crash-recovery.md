# SPIKE-001: Can Playwright prove crash recovery?

**Question** (Sprint 1, item 1.5): can Playwright, in CI, reload a page and crash the tab in Chromium, with IndexedDB data readable afterwards? The Phase 3 exit gate depends on the answer.

**Answer: yes.** It works for a reload, a tab crash, and a whole-browser crash, both locally and in CI. This closes RAID R1.

- **Script:** [`spikes/playwright-tab-crash/spike.mjs`](../../spikes/playwright-tab-crash/spike.mjs)
- **CI:** [`.github/workflows/spike-playwright.yml`](../../.github/workflows/spike-playwright.yml)
- **Date:** 2026-09-25 · **Timebox:** 1 day, finished inside it

## Results

| Environment                                           | Runs | Result                       |
| ----------------------------------------------------- | ---- | ---------------------------- |
| Windows 11, Node 24, Chromium headless shell 153      | 3    | 9 / 9 checks passed each run |
| GitHub Actions `ubuntu-latest`, Node 22, Chromium 153 | 3    | 9 / 9 checks passed each run |

| Check                                                                          | Outcome |
| ------------------------------------------------------------------------------ | ------- |
| Committed record survives a page reload                                        | ✅      |
| Committed record readable from a new tab after a renderer crash (`Page.crash`) | ✅      |
| Whole-browser crash (`Browser.crash`) closed the browser by itself             | ✅ ×3   |
| Record committed with `relaxed` durability survives a browser crash            | ✅      |
| Record committed with `strict` durability survives a browser crash             | ✅      |
| Earlier records survive both browser crashes                                   | ✅      |
| **Control:** a transaction that never committed is absent after a crash        | ✅      |

## How the harness works

These patterns carry into the Phase 3 harness:

- **A persistent profile** (`launchPersistentContext` on a temp directory), relaunched on the same directory after a crash. The profile on disk is what a real user's browser keeps.
- **A real origin without a server.** Request interception serves the page at `http://resumora.spike/`. IndexedDB needs a real origin: `about:blank` and `data:` URLs don't give one.
- **Proof that the crash happened.** The context has to close _by itself_ within 5 s of `Browser.crash`. A graceful `close()` would flush storage and make every check a false pass, so a browser that survives the crash command fails the spike.
- **A negative control.** A transaction kept open forever, by chaining requests, is crashed mid-flight and must be absent afterwards. Without this, the checks couldn't show that they're able to detect loss.

## What this means for the design

1. **An intent is durable only once its IndexedDB transaction's `complete` event fires.** Data from an uncommitted transaction is lost on crash, which is correct and atomic, but lost. The IndexedDB adapter must resolve `set()` only on `complete`. The runtime must not report an intent as recorded before that.
2. **Browser and tab crashes don't lose committed data, in either durability mode.** Both modes passed immediately after commit.
3. **Default the intent journal to `strict` durability until Phase 3 measures the cost** (see the next section).

## What this spike did not cover

- **An operating-system crash or power loss.** A process crash leaves the OS file cache intact, so these tests can't tell `relaxed` from `strict`. The IndexedDB specification allows `relaxed` commits to be lost when the OS crashes or loses power. Playwright can't simulate that, so the difference is unverified here.
- **Firefox and WebKit.** Both crash commands use the Chrome DevTools Protocol, which is Chromium-only. For other engines, the fallback is killing the browser process, which is untested. Chromium-first is RAID assumption A2.
- **Quota exhaustion, corrupted records and schema migration.** These are Sprint 4 items.
- **Timing.** One run takes about 25 s locally. The whole CI job took 54 s, including the Chromium install and all three runs. It's fine for a gate test, not for the unit suite.
