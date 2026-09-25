# Commit Guide

Conventional Commits, enforced by commitlint via the `commit-msg` hook.
Configuration: [`commitlint.config.js`](../../commitlint.config.js) · Workflow: [`GIT_WORKFLOW.md`](./GIT_WORKFLOW.md)

```
<type>(<scope>): <summary>
```

## Types

| Type       | Use for                          |
| ---------- | -------------------------------- |
| `feat`     | New capability                   |
| `fix`      | Bug fix                          |
| `docs`     | Documentation only               |
| `refactor` | Behaviour-preserving restructure |
| `perf`     | Performance improvement          |
| `test`     | Tests only                       |
| `chore`    | Tooling, config, maintenance     |
| `ci`       | Pipeline changes                 |
| `build`    | Build system or packaging        |
| `revert`   | Reverts a previous commit        |
| `security` | Security fix or hardening        |

`security` is not part of the conventional default set. Resumora adds it deliberately: security changes must be greppable in history, and burying them under `fix` defeats that.

## Scopes

Scopes track the package graph and are enforced as an allowlist:

`core` · `protocol` · `web` · `react` · `storage-memory` · `storage-indexeddb` · `devtools` · `reference-app` · `api` · `docs` · `repo` · `ci` · `deps` · `release`

An empty scope is permitted for genuinely repo-wide changes. Adding a scope means editing `commitlint.config.js` in the same PR that creates the package.

## Examples

```
feat(core): add workspace lock state machine
fix(sync): prevent duplicate mutation replay on reconnect
security(auth): purge revoked workspace keys on logout
test(recovery): cover tab crash mid-checkpoint
perf(web): reduce checkpoint serialization cost by 40%
docs(protocol): define checkpoint versioning semantics
chore(repo): migrate test runner to vitest
```

## Rules

- One logical change per commit.
- Imperative mood, lowercase summary. Not `changes`, not `fix stuff`, not `wip`.
- Subject is not Start-Case, PascalCase, or UPPER-CASE — commitlint rejects these.
- Tests travel in the same commit as the behaviour they verify.
- Docs travel in the same commit as the public API they describe.
- Every commit lands on `main` unchanged (PRs merge as merge commits, never squash or rebase). Tidy your own `wip` commits into meaningful ones before the first push.

## Breaking changes

Append `!` after the scope and add a `BREAKING CHANGE:` footer explaining the migration:

```
feat(core)!: rename Workspace.purge to Workspace.revoke

BREAKING CHANGE: Workspace.purge() is now Workspace.revoke(). The behaviour is
unchanged; the name now matches the LOGOUT_REVOCATION lifecycle vocabulary.
```

While on `0.x` the protocol is explicitly unstable, but any change to the persisted wire format or storage key shape still needs a compatibility note — users have half-finished work sitting in IndexedDB in the old format.
