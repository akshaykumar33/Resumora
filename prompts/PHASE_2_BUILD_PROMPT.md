# Resumora — Phase 2 Build Prompt

> **Supersedes** `prompts/starter_prompt.md` for all work from this point forward.
> The starter prompt covered Phase 0 (research) and Phase 1 (core starter). It has been executed.
> This prompt governs the transition from _documented intent_ to _working product_.

---

## 0. READ THIS FIRST — THE HONEST STARTING STATE

Do not trust `STATUS.md` or `README.md`. They overstate what exists. Verified state as of this prompt:

**What is real:**

- `packages/core` (291 lines, JavaScript) — `ContinuityRuntime`, `Workspace`, `IntentJournal`, `CheckpointManager`, storage key namespacing, checksum computation.
- `packages/storage-memory` (95 lines, JavaScript) — in-memory adapter with write-fault injection.
- `tests/runtime.test.js` — 6 tests, all passing under `node:test`. They cover the right invariants: tenant isolation, lock-on-logout, purge-on-revoke, checksum tamper detection, storage fault handling.

**What is theater and must be fixed, not extended:**

- **62 documentation files totalling 610 lines.** Average ~10 lines each. `docs/brand/DESIGN_PRINCIPLES.md` is a single sentence. `docs/security/SECURITY_CHECKLIST.md` is two. These are placeholders masquerading as a documentation suite. The original prompt explicitly forbade this ("Do not create hundreds of meaningless Markdown files"). **Deleting or consolidating a stub doc is preferred over padding it.**
- **ADR-002 declares TypeScript. All runtime code is `.js`.** `tsconfig.base.json` is referenced by nothing. This contradiction is resolved in favour of the ADR — see §2.
- **ADR-006 declares Vitest. Tests run on `node:test`.** Resolved in favour of the ADR.
- **Five of seven packages are 2-line stubs**: `protocol`, `react`, `web`, `devtools`, `storage-indexeddb`.
- **CI was absent** and is now being added. `.github/workflow-templates/ci.yml` remains as a dead template: it runs `npm test` against a pnpm workspace with no install step and would fail if enabled. Delete it.
- **There is no UI of any kind.** `apps/docs` and `apps/reference-app` contain a `package.json` and a `README.md` each.

**Known environment constraint:** branch protection and rulesets return `403 — Upgrade to GitHub Pro or make this repository public`. Until the repository goes public or upgrades, the workflow rules are convention rather than enforcement. See [`docs/engineering/GIT_WORKFLOW.md` §2](../docs/engineering/GIT_WORKFLOW.md#2-current-enforcement-reality).

---

## 1. MISSION

Resumora is an **Application Continuity & Workflow Recovery Runtime**.

> Your user should never lose meaningful work because the application environment became unreliable.

It persists **user intent and workflow progress**, not API responses. It is not an IndexedDB wrapper, not a cache, not a sync database. The differentiator is recovering _work in flight_ across refresh, crash, token expiry, and network loss — under authorization rules that are re-verified on every resume.

**The single non-negotiable security invariant:**

```
Persistence NEVER implies authorization.

LOCK → REAUTHENTICATE → REAUTHORIZE → UNLOCK → REVALIDATE → RECONCILE
```

Locally persisted state is _evidence of work_, never _proof of entitlement_. Every resume path re-authorizes against the server before exposing data.

---

## 2. RESOLVED DECISIONS — DO NOT RELITIGATE

These were open in the starter prompt. They are now closed. Changing any of them requires a new ADR with stated reasoning.

### 2.1 Language: TypeScript, strict

Migrate `packages/core` and `packages/storage-memory` from JavaScript to TypeScript with `strict: true`, `noUncheckedIndexedAccess: true`, and `exactOptionalPropertyTypes: true`. Ship real `.d.ts`. Build with **tsup**.

`any` is banned. `unknown` plus a narrowing guard is the answer. A `// @ts-expect-error` requires an adjacent comment explaining why, and never appears in `packages/core`.

**Rationale:** ADR-002 already said this. A runtime that other teams `npm install` and trust with unfinished user work cannot ship untyped. The types _are_ the contract.

### 2.2 Test runner: Vitest

Port `tests/runtime.test.js` to Vitest. Keep every existing assertion — those 6 tests encode the security invariants and must not regress. Add **Playwright** for browser-level chaos tests, which is the only way to genuinely prove refresh/crash/offline recovery.

### 2.3 Application stack

| App                  | Stack                                                                                         | Why                                                                                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apps/reference-app` | Vite + React 19 + TanStack Router + TanStack Query + Tailwind v4 + shadcn/ui (Radix) + Motion | Deliberately client-only. The entire product thesis is surviving refresh, tab discard, and offline. SSR actively fights that demo.                                                   |
| `apps/api`           | Hono + Drizzle ORM + Neon Postgres + `jose` (JWT)                                             | A **real** authoritative backend. Tokens that genuinely expire, endpoints that genuinely 500. Reconciliation and conflict resolution cannot be honestly demonstrated against a mock. |
| `apps/docs`          | Next.js 15 App Router + Fumadocs (MDX)                                                        | Best-in-class typed MDX docs with search. Separate deploy from the demo.                                                                                                             |

Supporting choices: **Zod** for `@resumora/protocol` schemas · **Dexie** inside `storage-indexeddb` (an implementation detail of one adapter, never a core dependency) · **MSW** for deterministic fault injection in tests · **Changesets** for versioning · **Storybook** for devtools component development.

### 2.4 Package dependency rules (unchanged, enforced)

- `@resumora/core` has **zero runtime dependencies** and **zero browser API references**. No `window`, no `localStorage`, no `indexedDB`, no `document`. This is enforced by lint rule, not by good intentions.
- Adapters implement the `StorageAdapter` interface from core.
- Framework bindings (`react`, `web`) wrap core without leaking persistence internals.

---

## 3. UI/UX IS A FIRST-CLASS REQUIREMENT

Treat the interface as product surface, not a demo harness. A continuity runtime that looks unfinished will not be trusted with unfinished work.

### 3.1 Quality bar

Conceptual inspiration: Linear, Stripe, Vercel, Raycast. **Do not copy their layouts, branding, or assets.** Take the _discipline_ — restraint, typographic hierarchy, purposeful motion — not the visuals.

Required:

- **Typography as the primary design tool.** A real scale, deliberate line-heights, tabular numerals for all metrics and counters. Geist or Inter for UI; JetBrains Mono for code and IDs.
- **Dark and light themes**, both fully designed. Not a filter applied to one.
- **Motion that communicates state**, never decoration. A checkpoint being written, a mutation draining from the queue, a workspace locking — these are state transitions the user should _feel_. Everything else is still.
- **Accessibility is a gate, not a pass:** WCAG 2.2 AA contrast, full keyboard navigation, visible focus rings, correct ARIA on every custom control, `prefers-reduced-motion` honoured throughout.
- **Responsive from 360px.** The devtools panel collapses gracefully; it does not horizontally scroll the page.

Forbidden: glassmorphism as a default surface, gratuitous gradients, animations without semantic meaning, and the flat purple-gradient-plus-generic-sans look that reads as machine-generated.

### 3.2 The reference application

A **25-step enterprise workflow** (recommended vertical: commercial property inspection — it justifies text, structured fields, photo upload, and nested sections without needing domain expertise to understand).

It must exercise: multi-step navigation with nested sections · text, numeric, and select fields · rich text authoring · file upload with resumable partial state · entity selection · derived/computed fields.

**The demo's job is to make a developer understand the value in five minutes.** It fails if recovery is merely described rather than visibly demonstrated.

### 3.3 The Fault Lab

A visible control surface — not a hidden debug flag — that lets a viewer deliberately break things:

`Go Offline` · `Simulate 2G` · `Expire Session` · `Crash API (500)` · `API Timeout` · `Create Conflict` · `Corrupt Local Record` · `Exceed Storage Quota` · `Restart Runtime` · `Simulate App Restart` · `Duplicate Delivery` · `Out-of-Order Events`

Every fault must be **deterministic and reproducible**. A chaos tool that behaves differently each run cannot be used to prove anything.

### 3.4 Devtools panel

Conceptually adjacent to React Query Devtools, embeddable in any host app via `@resumora/devtools`.

Surfaces: Workspace state · Network quality (`OFFLINE | DEGRADED | HIGH_LATENCY | METERED | STABLE`) · Intent journal · Mutation queue with age · Checkpoint list with sizes and checksums · Sync cursor · Conflicts · Recovery events · **Continuity Timeline** · Storage usage · Active policies · Known devices.

The **Continuity Timeline** is the signature view. Make it genuinely good: a scrubable chronological track where a viewer can see the interruption, the recovery, and the reconciliation as distinct, legible events. If one screenshot has to sell this product, it is this one.

---

## 4. FUNCTIONAL SCOPE, IN ORDER

Do not build these in parallel. Each phase has an exit gate.

**Phase 2 — Foundation repair.** TS migration · Vitest port · tsup builds · real CI · lint/format/typecheck enforcement · governance tooling from §5. _Exit: `pnpm build && pnpm test && pnpm typecheck && pnpm lint` all green in CI on a pull request._

**Phase 3 — Web persistence.** `storage-indexeddb` on Dexie · quota handling · corruption detection and recovery · schema migration · multi-tab coordination via Web Locks and BroadcastChannel. _Exit: survives a real browser refresh and a real tab crash in Playwright._

**Phase 4 — Recovery UX.** `@resumora/react` hooks (`useContinuity`, `useWorkflowRecovery`, `useCheckpoint`) · the resume prompt · reference app reaching all 25 steps · Fault Lab operational. _Exit: a viewer can kill the tab mid-workflow and resume with no lost input._

**Phase 5 — Mutations and sync.** Mutation queue · idempotency keys · retry with backoff · network quality detection · `apps/api` as the authoritative backend · full LOCK→RECONCILE cycle against real expiring JWTs. _Exit: recovery works correctly after a genuine token expiry, and replay is provably idempotent._

**Phase 6 — Conflicts and devtools.** Conflict detection and resolution strategies · the devtools package · the Continuity Timeline. _Exit: a conflict can be created, seen, and resolved entirely through the UI._

**Phase 7 — Documentation site.** Fumadocs build · genuine guides · API reference generated from TypeScript. _Exit: a developer integrates Resumora into a fresh app using only the published docs._

**Documentation rule for every phase:** rewrite the relevant stub docs to real depth as the feature lands. Never write documentation for something that does not exist yet. If a stub doc's subject is not yet built, **delete it** — a missing file is honest, a 10-line placeholder is not.

---

## 5. ENGINEERING GOVERNANCE — BINDING

Full detail in [`docs/engineering/GIT_WORKFLOW.md`](../docs/engineering/GIT_WORKFLOW.md) and [`docs/security/PRE_COMMIT_VERIFICATION.md`](../docs/security/PRE_COMMIT_VERIFICATION.md). Summary of the hard rules:

1. **Never commit directly to `main`.** Every change arrives via pull request.
2. **Branch names follow `<type>/<short-kebab-description>`**, where `<type>` matches the Conventional Commit types.
3. **Every commit is scanned for secrets before it is created.** Local hook, then CI, then GitHub push protection. Three layers, because any one of them can be bypassed.
4. **Conventional Commits, enforced by commitlint.** One logical change per commit.
5. **Every PR must pass** typecheck, lint, format, unit tests, secret scan, and build before merge.
6. **Squash merge to `main`**, with the squash title itself a valid Conventional Commit.
7. **Security-relevant changes require explicit security review** — anything touching storage keys, the lock cycle, authorization boundaries, or serialization.

---

## 6. DEFINITION OF DONE

A change is complete only when all of the following are true. "It compiles" is not on the list.

- [ ] Implementation
- [ ] Full TypeScript types, no `any`
- [ ] Unit tests for the happy path
- [ ] **Failure-path tests** — the interesting cases live here
- [ ] Security consideration explicitly stated in the PR
- [ ] Performance consideration explicitly stated in the PR
- [ ] Documentation updated in the same PR
- [ ] A working example, where a public API changed
- [ ] Telemetry events, where appropriate
- [ ] Migration and backwards-compatibility assessed
- [ ] Clean Conventional Commit history
- [ ] No secrets, tokens, credentials, or real user data introduced

---

## 7. HONESTY REQUIREMENTS

These are non-negotiable and apply to every agent and human working in this repository.

- **Never claim a test passed without executing it.** Paste the actual output.
- **Never claim a feature works without running it.**
- **Never mark a phase complete in `STATUS.md` while its exit criteria are unmet.** The current `STATUS.md` is a cautionary example — it claims a comprehensive documentation suite that does not exist.
- **Never state that a name, domain, or package is legally available** without citing the evidence and its limitations.
- **Never describe browser-side encryption as secure** when JavaScript on the page can obtain the key. Say plainly what the threat model does and does not cover.
- **Never manufacture competitive weaknesses.** If Dexie, RxDB, ElectricSQL, PowerSync, or Replicache does something well, say so and integrate or learn from it.

---

## 8. PRINCIPLES, IN PRIORITY ORDER

```
Architecture        > code volume
Correctness         > cleverness
Recovery            > caching
Authorization       > persistence
Developer experience> unnecessary complexity
Real problem        > artificial uniqueness
Working software    > documentation about software
```

That last line is the correction this phase exists to make. The repository currently has 610 lines of documentation and 434 lines of code. Invert that ratio by building, not by deleting docs — though deleting the empty ones is a fine place to start.
