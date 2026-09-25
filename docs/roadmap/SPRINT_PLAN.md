# Sprint Plan: Phase 2 to v1

How Resumora gets from today's state to a documented, integrable v1. The scope, stack and phase exit gates come from [`prompts/PHASE_2_BUILD_PROMPT.md`](../../prompts/PHASE_2_BUILD_PROMPT.md), which governs. This file sequences that scope into sprints. Phase summaries are in [`ROADMAP.md`](./ROADMAP.md).

**Last re-planned:** 2026-09-25 · **Next re-forecast:** end of Sprint 2

---

## 1. Verified baseline (2026-09-25)

| Item                          | State                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                   | 6 / 6 pass (`node:test`)                                                                                                           |
| Working code                  | `packages/core` (JS, about 290 lines) and `packages/storage-memory` (JS, about 95 lines)                                           |
| Stubs                         | `protocol`, `web`, `react`, `devtools`, `storage-indexeddb` (2-line files); `apps/*` (package.json + README)                       |
| Build / typecheck / lint      | None exist; `pnpm build` and `pnpm lint` do nothing                                                                                |
| CI                            | format check, secretlint, tests, gitleaks (full history)                                                                           |
| **Defect: cross-tenant read** | IDs may contain `::`. Tenant `acme::alice` reads tenant `acme`'s checkpoint. Reproduced.                                           |
| **Defect: orphaned intents**  | `restoreLatestCheckpoint()` returns `null` when intents exist but no checkpoint does, so recorded work is unreachable. Reproduced. |
| Unused policy fields          | `maxAgeMs`, `autoCheckpointFrequency` and `onLogout` are declared in `Workspace` but never read.                                   |

## 2. Planning assumptions

- **Team:** one developer with AI agents. One integrator merges and verifies everything, so agent output counts as done only when its gate passes in CI.
- **Sprint length:** one week, Monday to Friday. Sprint 1 starts **2026-09-28**.
- **Estimation:** Fibonacci points (1, 2, 3, 5); anything larger gets split. **No velocity has been measured yet.** Sprints 1–2 are calibration sprints, and the forecast below is a range to be re-forecast after Sprint 2.
- **Capacity:** plan about 70% of what feels possible. Each sprint lists _Committed_ items and one _Stretch_ item.
- **Definition of done:** the checklist in `PHASE_2_BUILD_PROMPT.md` §6 applies to every item, including failure-path tests and stated security and performance considerations. "Done except tests" is not done.
- **Workflow:** one branch per item (`<type>/<kebab-name>`), a PR to `main`, and a merge commit (never squash or rebase). Items that touch storage keys, the lock cycle, authorization or serialization need an explicit security review.

## 3. Phase map and forecast

Phases run strictly in sequence, and each ends at a binary, runnable exit gate.

| Phase | Name                   | Sprints | Exit gate (run it, don't assert it)                                            | Forecast  |
| ----- | ---------------------- | ------- | ------------------------------------------------------------------------------ | --------- |
| 2     | Foundation repair      | 1–2     | `pnpm build && pnpm test && pnpm typecheck && pnpm lint` green in CI on a PR   | 2–3 weeks |
| 3     | Web persistence        | 3–5     | Survives a real browser refresh **and** a real tab crash in Playwright, in CI  | 3–4 weeks |
| 4     | Recovery UX            | 6–8     | A viewer kills the tab mid-workflow and resumes with no lost input             | 3–4 weeks |
| 5     | Mutations and sync     | 9–11    | Correct recovery after a genuine JWT expiry; replay is provably idempotent     | 3–5 weeks |
| 6     | Conflicts and devtools | 12–14   | A conflict is created, seen and resolved entirely through the UI               | 3–4 weeks |
| 7     | Documentation site     | 15–16   | A developer integrates Resumora into a fresh app using only the published docs | 2–3 weeks |

**Total forecast: 16–23 weeks, so v1 lands between mid-January and early March 2027.** This is an unmeasured estimate until Sprint 2 ends.

**Critical path:** identity fix → TypeScript core and `StorageAdapter` type → IndexedDB adapter → React hooks → reference app → `apps/api` + JWT → mutation queue → full lock cycle → conflict detection → Continuity Timeline → docs. A slip anywhere on this chain moves v1.

---

## 4. Sprints

Point values are in brackets. Items are vertical slices, each demoable on its own.

### Phase 2: Foundation repair

**Sprint 1 (2026-09-28): "The core is safe, and typed"**

| #       | Item                                                                                                                                                                                                                                  | Pts |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 1.1     | `security(core)`: reject empty IDs and IDs containing `::` in `buildStorageKey`, `buildPrefix` and `openWorkspace`. Start with a failing test that reproduces the cross-tenant read.                                                  | 3   |
| 1.2     | `fix(core)`: restoring with no checkpoint returns the pending intents instead of `null`. Test: record intents, then restore, and nothing is lost.                                                                                     | 2   |
| 1.3     | `test`: port the 6 tests to Vitest, keeping every assertion; `pnpm test` runs Vitest                                                                                                                                                  | 2   |
| 1.4     | `refactor(core)`: migrate to TypeScript (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) with a tsup build and a real `.d.ts`; export the `StorageAdapter` interface                                              | 5   |
| 1.5     | **Spike, 1 day max.** Question: can Playwright in CI reload the page **and** crash the tab (for example via CDP `Page.crash`) in Chromium, with IndexedDB data readable afterwards? Output: a yes or no, plus a 20-line proof script. | 2   |
| Stretch | `refactor(storage-memory)`: TypeScript, implementing the core `StorageAdapter` type                                                                                                                                                   | 3   |

The owner also decides this sprint whether the repository goes public, which unlocks branch protection. Run gitleaks clean over the full history first.

**Sprint 2 (2026-10-05): "The gate is enforced by CI"**

| #    | Item                                                                                                                                                      | Pts |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| 2.1  | `storage-memory` in TypeScript (if Sprint 1 didn't reach it)                                                                                              | 3   |
| 2.2  | `ci`: add ESLint with a rule that fails on `window`, `document`, `localStorage` and `indexedDB` in `packages/core`, turning invariant 3 into a lint error | 3   |
| 2.3  | `ci`: add build, typecheck and lint jobs, and delete the dead `.github/workflow-templates/` and `tooling/ci/`                                             | 2   |
| 2.4  | `refactor(core)`: implement `autoCheckpointFrequency` and `maxAgeMs` expiry, or delete them. Unused policy is a false promise.                            | 3   |
| 2.5  | `docs`: fix the README Quick Start to the real API, rewrite `STATUS.md`, and delete stub docs whose subject isn't built                                   | 2   |
| Gate | Open a PR and show all four commands green in CI. Record velocity from Sprints 1–2 and re-forecast §3.                                                    | –   |

### Phase 3: Web persistence

Sprint 3 (below) also starts the Neon account and project setup; it's needed in Sprint 9.

**Sprint 3: "It survives a refresh"**

- 3.1 `feat(storage-indexeddb)`: Dexie-backed adapter covering get, set, delete, `listKeys` and clear [5]
- 3.2 `test`: a shared adapter conformance suite run against both the memory and IndexedDB adapters (`fake-indexeddb` under Vitest) [3]
- 3.3 `test`: a Playwright harness page (type, reload, state restored) running in CI [3]
- Stretch: atomic `batch()` using one IndexedDB transaction [2]

**Sprint 4: "It survives a crash, a full disk and bad bytes"**

- 4.1 Tab-crash test in Playwright, using the method proven by spike 1.5 [3]
- 4.2 Keep the last N checkpoints instead of only `latest`, so a checksum mismatch falls back to the previous good checkpoint plus its intents [5]
- 4.3 Quota exceeded: surface a typed error, evict by policy, and never corrupt existing records [3]
- 4.4 Schema version on stored records, with a migration hook [2]

**Sprint 5: "Two tabs, one truth"**

- 5.1 `feat(web)`: Web Locks leader election, where one tab owns writes to a workspace [5]
- 5.2 `feat(web)`: a BroadcastChannel bus so follower tabs see updates live [3]
- 5.3 **Spike, 1 day.** Design the lock-cycle flow against a real expiring JWT and write it up as the ADR draft for Phase 5 [2]
- Gate: the refresh and crash Playwright tests are green in CI

### Phase 4: Recovery UX

Load the `ui-design`, `accessibility`, `ux-research` and `motion-design` skills for this phase.

**Sprint 6: "The first five steps come back"**

- 6.1 Scaffold `reference-app` (Vite, React 19, TanStack Router, Tailwind v4, shadcn/ui), light and dark [3]
- 6.2 `feat(react)`: `useContinuity` and `useCheckpoint`; steps 1–5 of the inspection workflow persist [5]
- 6.3 The resume prompt: on return, show what was recovered and offer to resume or discard [3]

**Sprint 7: "All 25 steps, every field type"**

Sliced by field type rather than by step:

- 7.1 Text, numeric and select fields [3]
- 7.2 Rich text [3]
- 7.3 Entity selection and derived fields [3]
- 7.4 `useWorkflowRecovery`: step position and nested sections [3]

**Sprint 8: "Break it on purpose"**

- 8.1 Fault Lab, client side: Go Offline, Restart Runtime, Simulate App Restart, Corrupt Local Record, Exceed Storage Quota. All faults are deterministic. [5]
- 8.2 Resumable partial file upload [3]
- 8.3 Accessibility pass: WCAG 2.2 AA contrast, keyboard, focus and reduced motion, at 360px [2]
- Gate: live demo of killing the tab mid-workflow and resuming with no lost input

### Phase 5: Mutations and sync

**Sprint 9: "A real server says no"**

- 9.1 `apps/api` on Hono, Drizzle and Neon (local Postgres in CI), with one endpoint that saves a step [5]
- 9.2 `jose` JWTs with short expiry, and a 401 on an expired token [2]
- 9.3 `feat(protocol)`: Zod schemas for the mutation envelope and the intent [3]

**Sprint 10: "Nothing is sent twice"**

- 10.1 Mutation queue with idempotency keys and server-side dedupe [5]
- 10.2 Retry with backoff, plus network quality detection (`OFFLINE`, `DEGRADED` and the other states) [3]
- 10.3 Fault Lab, server side: Crash API (500), API Timeout, Simulate 2G, Duplicate Delivery, Out-of-Order Events [3]

**Sprint 11: "Persistence never implies authorization"**

- 11.1 The full LOCK → REAUTHENTICATE → REAUTHORIZE → UNLOCK → REVALIDATE → RECONCILE cycle. This replaces the trust-the-caller `unlock(credential.isValid)` stub with server-verified reauthorization. **Needs security review.** [5]
- 11.2 Idempotency proof: a randomized replay test (duplicates and reordering give identical server state) [3]
- 11.3 Expire Session fault, wired into the Fault Lab [2]
- Gate: a recovery after genuine expiry, with the idempotency test in CI

### Phase 6: Conflicts and devtools

**Sprint 12: "Conflicts are detected and resolved"**

- 12.1 Detect conflicts using server revisions, plus the Create Conflict fault [5]
- 12.2 One resolution strategy end to end (manual merge UI), with server-wins and client-wins as policy [5]

**Sprint 13: "See inside the runtime"**

- 13.1 `@resumora/devtools` panel covering workspace state, intent journal, mutation queue with age, and checkpoints with sizes and checksums [5]
- 13.2 Storage usage, active policies and network quality [3]

**Sprint 14: "The Continuity Timeline"**

- 14.1 A scrubbable timeline showing interruption, recovery and reconciliation as distinct events [5]
- 14.2 Resolve conflicts from inside the devtools [3]
- Gate: create, see and resolve a conflict through the UI only

### Phase 7: Documentation site

**Sprint 15:** Fumadocs site · getting started · API reference generated from the TypeScript types · Changesets for versioning

**Sprint 16:** guides (adapters, lock cycle, Fault Lab) · every remaining stub doc rewritten or deleted · gate test: someone who didn't build Resumora integrates it into a fresh app using only the docs, with their friction points recorded and fixed

---

## 5. RAID log

Review this every Friday and close entries as they resolve.

| ID  | Type       | Entry                                                                                                                                    | Mitigation / next action                                                                                                         | Owner | By         |
| --- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----- | ---------- |
| I1  | Issue      | Cross-tenant read through `::` in IDs (reproduced)                                                                                       | **Closed 2026-09-25**: fixed in #5 (item 1.1)                                                                                    | Dev   | 2026-10-02 |
| I2  | Issue      | Intents unreachable when no checkpoint exists (reproduced)                                                                               | **Closed 2026-09-25**: fixed in #6 (item 1.2)                                                                                    | Dev   | 2026-10-02 |
| I3  | Issue      | No server-side branch protection (private repo on GitHub Free)                                                                           | Decide whether to go public after a clean gitleaks run                                                                           | Owner | 2026-10-02 |
| I4  | Issue      | `Workspace.state` is publicly writable: `ws.state = 'active'` after `lock()` reads locked data with no credential (reproduced)           | **Closed 2026-09-25**: fixed in #10; the same PR also closed reads through `ws.checkpoints` and reopening a purged workspace     | Dev   | 2026-10-02 |
| R1  | Risk       | Playwright can't faithfully simulate a tab crash, which blocks the Phase 3 gate                                                          | **Closed 2026-09-25**: spike #12 answered yes (reload, tab crash and browser crash, 3/3 runs in CI); see `docs/spikes/SPIKE-001` | Dev   | 2026-10-02 |
| R2  | Risk       | Keeping only the latest checkpoint means one corrupt write loses everything                                                              | Sprint 4, item 4.2                                                                                                               | Dev   | Sprint 4   |
| R3  | Risk       | Unmeasured velocity; agent output may look finished without being verified                                                               | Calibration sprints; done = gate green in CI                                                                                     | Dev   | Sprint 2   |
| R4  | Risk       | The high UI quality bar pulls effort away from the critical path                                                                         | Polish only inside a sprint's committed items; the rest is backlog                                                               | Dev   | Ongoing    |
| R5  | Risk       | Neon free-tier cold starts make tests flaky                                                                                              | CI runs against local Postgres; Neon only for the deployed demo                                                                  | Dev   | Sprint 9   |
| R6  | Risk       | tsup looks unmaintained (last published November 2025), and its declaration build can't use TypeScript 7, so TypeScript is pinned to 6.x | Stay on 6.x for now; evaluate tsdown in an ADR before Phase 7 publishing                                                         | Dev   | Sprint 12  |
| A1  | Assumption | The Phase 2 prompt's §2 stack decisions stand                                                                                            | Change only through a new ADR                                                                                                    | Owner | –          |
| A2  | Assumption | Chromium-first browser testing is enough for v1                                                                                          | Check against `docs/testing/COMPATIBILITY_MATRIX.md` in Phase 7                                                                  | Dev   | Sprint 15  |
| D1  | Dependency | A Neon project and a CI secret for the deployed demo                                                                                     | Create it in Sprint 3                                                                                                            | Owner | Sprint 3   |
| D2  | Dependency | Whether the `@resumora` npm scope is free (unverified)                                                                                   | Check the npm registry before Phase 7; don't claim it's free until then                                                          | Owner | Sprint 12  |

## 6. Cadence

- **Monday:** commit sprint scope. Anything new that comes up mid-sprint displaces something, or it waits.
- **Daily:** answer "what's blocked?". A blocker older than one day gets escalated.
- **Friday:**
  - Demo the sprint goal.
  - Update the RAID log.
  - Post a one-paragraph status in the `project-manager` skill's format: overall RAG, gate progress, forecast.
  - Hold a retro and pick at most two changes, each with an owner.
- **After each phase gate:**
  - Update `STATUS.md`, but only with gates that actually passed.
  - Re-forecast §3.
