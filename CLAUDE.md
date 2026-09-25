# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Resumora is an Application Continuity & Workflow Recovery Runtime: it persists user _intent_ and workflow progress (not API responses) so work survives refresh, crash, tab discard, token expiry and network loss. pnpm + Turborepo monorepo, Node >= 22.12, ESM throughout (`"type": "module"`).

<!-- CODEGRAPH_START -->

## CodeGraph & Graphify Architecture Sync

This repository is indexed by CodeGraph (.codegraph/).
To minimize token consumption, prevent hallucinations, and preserve context:

- **ALWAYS reach for CodeGraph FIRST** before using grep, glob, or reading raw source files.
- Use the MCP tool codegraph_explore or run codegraph explore "<symbol or question>" to understand code, relationships, and call paths in one call.
- Use codegraph node <symbol> to view exact symbol implementations and caller/callee trails.
- Never dump or read full large files into context unless actively modifying them.

<!-- CODEGRAPH_END -->

## Read before trusting the docs

- `STATUS.md` and `prompts/PHASE_2_BUILD_PROMPT.md` describe what actually exists. The Phase 2 prompt is the current governing plan and supersedes `prompts/starter_prompt.md`. Its §2 "Resolved decisions" are closed: changing one needs a new ADR.
- `docs/roadmap/SPRINT_PLAN.md` sequences that plan into one-week sprints, with the phase exit gates, the forecast and the RAID log. Pick the next work from the current sprint there, and update its RAID log when a risk or issue changes.
- Most of `docs/` (about 62 files, averaging about 10 lines each) is placeholder. Prefer deleting or consolidating a stub over padding it.
- The README Quick Start shows an object-argument API that the code doesn't implement. The real signatures are `recordIntent(action, payload)` and `saveCheckpoint(state, metadata)`.
- Only `packages/core` and `packages/storage-memory` contain code. `protocol`, `web`, `react`, `devtools` and `storage-indexeddb` are 2-line stubs, and `apps/*` contain only a `package.json` and README. `storage-sqlite`, which `AGENTS.md` mentions, doesn't exist.
- **Honesty rule (from STATUS.md):** don't mark a phase complete while its exit criteria are unmet, and don't describe planned work in the past tense.

## Commands

```bash
pnpm install
pnpm test                                    # vitest run (tests/**/*.test.js)
pnpm vitest run -t "Tenant"                  # single test by name; `pnpm vitest` to watch
pnpm format                                  # prettier --write .
pnpm format:check                            # CI gate
pnpm secrets:scan                            # secretlint over the repo (CI gate)
pnpm check:paths                             # forbidden-path guard on staged files
```

`pnpm build` and `pnpm typecheck` run through turbo. Today only `packages/core` defines them: tsup emits ESM only (Node 22.12+ can `require()` it), with bundled `.d.ts`, into `dist/`. Dual ESM+CJS was dropped to avoid the dual-package hazard: two loaded copies break `instanceof` on the error classes. There is no lint yet (Sprint 2 item 2.2), so `pnpm lint` runs nothing.

TypeScript is pinned to 6.x on purpose. TypeScript 7 (the native compiler) has no JavaScript API, and tsup's declaration build needs one; see RAID R6 in `docs/roadmap/SPRINT_PLAN.md`.

CI (`.github/workflows/ci.yml`) runs format:check, secrets:scan and tests, and a separate job runs gitleaks over the full history. `.github/workflow-templates/ci.yml` and `tooling/ci/` are dead templates.

## Architecture

```
ContinuityRuntime (runtime.ts)          one Workspace per tenant::user::workspace, cached in a Map
  └─ Workspace (workspace.ts)           state machine: active | locked | purged; assertAccessible() gates every op
       ├─ IntentJournal (intent.ts)     append-only, monotonically sequenced intents
       └─ CheckpointManager (checkpoint.ts)  single "latest" snapshot + FNV-1a checksum
            └─ StorageAdapter           injected; key/value over Uint8Array
```

- **Storage keys** (`storage.ts`): `resumora::{tenantId}::{userId}::{workspaceId}::{recordType}::{recordId}`. `buildStorageKey` throws unless all three identity parts are present. Tenant isolation depends on every read and write going through this key or through `buildPrefix`.
- **Intents** are stored under zero-padded 8-digit sequence ids so they sort lexically. On `initialize()`, the journal recovers `currentSequence` by scanning keys.
- **Checkpoint then prune:** `saveCheckpoint` stores the snapshot at the current sequence and then deletes every intent `<=` that sequence. `restoreLatestCheckpoint` returns `{ checkpoint, state, unappliedIntents }`, and the _caller_ replays the unapplied intents. `checkpoint` and `state` are `null` when intents exist but no checkpoint has been written yet. The whole result is `null` only when nothing was recorded. `getLatest` throws `ChecksumMismatchError` when the stored state has been tampered with.
- **Lock and purge:** `lock()` blocks all access until `unlock(credential)` receives `credential.isValid`. `purge()` clears the workspace's key prefix and is irreversible.
- **StorageAdapter contract** (implemented by `MemoryStorageAdapter`): `get`, `set`, `delete`, `listKeys(prefix)`, `batch(ops)`, `clear(prefix?)`. The memory adapter takes `simulatedLatencyMs`, `faultOnWrite` and `quotaLimitBytes` for fault injection.
- Errors are subclasses of `ResumoraError` with a `code` (`types.ts`, which also holds the public interfaces: `StorageAdapter`, `IdentityContext`, `Intent`, `Checkpoint`, `RestoreResult`).
- Tests import the TypeScript source directly (`../packages/core/src/index.ts`), which Vitest compiles, so `pnpm test` needs no build first. `storage-memory` is still JavaScript.
- Core compiles against the ES library only, with no DOM or Node types. A browser global in `packages/core` is therefore a type error. `src/env.d.ts` declares the one allowed host API, `TextEncoder`/`TextDecoder`. Source imports use `.js` extensions (NodeNext).

## Invariants (see AGENTS.md)

1. **Persistence never implies authorization.** Preserve the `LOCK -> REAUTHENTICATE -> REAUTHORIZE -> UNLOCK -> REVALIDATE -> RECONCILE` cycle. Treat persisted state as evidence of work, never as proof of entitlement.
2. Every persisted record is namespaced by tenant, user and workspace. Cross-tenant reads and writes are forbidden.
3. `@resumora/core` has zero runtime dependencies and zero browser API references (`window`, `document`, `localStorage`, `indexedDB`).
4. Recovery is deterministic: the same checkpoint plus the same intents always yields the same state.
5. Never persist raw authentication tokens. Don't add stub files without tests. Don't claim tests pass without running them.

The 6 tests in `tests/runtime.test.js` encode these invariants and must not regress. Keep every assertion when porting them to Vitest.

## Planned direction (Phase 2, not yet done)

- `core` is TypeScript (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`; `any` is banned). `storage-memory` still has to migrate, and Playwright is still to be added.
- Planned stack: Zod for `protocol`, Dexie inside `storage-indexeddb` only, MSW, and Changesets.
- Planned apps: `reference-app` (Vite + React 19 + TanStack + Tailwind v4 + shadcn), `api` (Hono + Drizzle + Neon + jose), and `docs` (Next.js 15 + Fumadocs).

## Git workflow

- Never commit directly to `main`, and merge PRs only as merge commits (`gh pr merge <n> --merge`), never squash or rebase. Use branches named `<type>/<kebab-description>`, where the prefix matches the commit type (`feat/`, not `feature/`). Rebase onto `origin/main`; don't merge `main` in. Branch protection isn't active yet (private repo on GitHub Free), so these rules rely on discipline.
- Commits follow Conventional Commits, enforced by commitlint. The allowed types add `security` to the conventional set. Scopes are limited to `core, protocol, web, react, storage-memory, storage-indexeddb, devtools, reference-app, api, docs, repo, ci, deps, release` or empty.
- Lefthook runs on `pnpm install`:
  - pre-commit runs the forbidden-path guard (`scripts/check-staged-paths.mjs`), secretlint on staged files, and prettier (which re-stages its fixes).
  - pre-push runs `pnpm test`.
  - `--no-verify` is not permitted. If a hook is wrong, fix it in its own PR.
- The forbidden-path guard blocks `.env*` (except `.env.example`), key material, `*-credentials.json`, any `.claude/`, `.cursor/` or `.vscode/` `*.json`, `*.checkpoint.json` and `*.timeline-export.json`, and `fixtures/*.real.json`.
- `skills/` holds repository-specific playbooks (storage-adapter, protocol-change, recovery-feature, sync-engine and others). Read the matching one before doing that kind of work.
- `scripts/autopilot/` and `.vscode/` are untracked local tooling for driving Claude sessions and aren't part of the product.
