# Git Workflow

How change reaches `main` in Resumora. Binding for humans and AI agents alike.

Companion documents: [`COMMIT_GUIDE.md`](./COMMIT_GUIDE.md) · [`../security/PRE_COMMIT_VERIFICATION.md`](../security/PRE_COMMIT_VERIFICATION.md)

---

## 1. The rule

**Nothing is committed directly to `main`. Ever.**

Every change — including a one-character typo fix, including documentation, including work done by an AI agent — arrives through a branch and a pull request.

The reason is not ceremony. Resumora is infrastructure that other teams will trust with their users' unfinished work. A defect in the lock cycle or the tenant namespace is a cross-tenant data leak. The pull request is where that gets caught.

---

## 2. Current enforcement reality

> **Verified 2026-09-20:** `GET /repos/akshaykumar33/Resumora/rulesets` returns
> `403 — "Upgrade to GitHub Pro or make this repository public to enable this feature."`
>
> **Server-side branch protection is not available on this repository today.** It is private on a Free plan.

This matters: until it is resolved, every rule below is enforced only by local hooks and discipline. Local hooks are bypassable with `--no-verify`. Treat the current state as _convention_, not _enforcement_.

### Resolving it — three options

| Option                         | Cost      | Assessment                                                                                                                                                                                                                                                                                         |
| ------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Make the repository public** | Free      | **Recommended.** Resumora is Apache-2.0 and explicitly designed as open-source-first. Going public unlocks rulesets, required status checks, and free Actions minutes, and aligns the repository with the product's stated model. Do this once §3 secret scanning has run clean over full history. |
| Upgrade to GitHub Pro          | ~$4/month | Keeps the repository private and unlocks protection immediately. Correct if there is a reason to stay closed through Phase 2.                                                                                                                                                                      |
| Stay as-is                     | Free      | Local hooks only. Acceptable for a solo developer for a short period. Not acceptable once a second contributor has write access.                                                                                                                                                                   |

**Do not add collaborators until server-side protection is active.** Right now any collaborator with write access can push straight to `main`, and nothing will stop them.

---

## 3. Branches

### Naming

```
<type>/<short-kebab-description>
```

`<type>` matches the Conventional Commit types, so the branch name and the eventual commit agree:

| Prefix      | Use for                          | Example                                |
| ----------- | -------------------------------- | -------------------------------------- |
| `feat/`     | New capability                   | `feat/indexeddb-adapter`               |
| `fix/`      | Bug fix                          | `fix/checkpoint-prune-off-by-one`      |
| `docs/`     | Documentation only               | `docs/rewrite-threat-model`            |
| `refactor/` | Behaviour-preserving restructure | `refactor/extract-storage-interface`   |
| `perf/`     | Performance work                 | `perf/reduce-checkpoint-serialization` |
| `test/`     | Tests only                       | `test/multi-tab-recovery`              |
| `chore/`    | Tooling, deps, config            | `chore/migrate-to-vitest`              |
| `ci/`       | Pipeline changes                 | `ci/add-secret-scanning`               |
| `security/` | Security fix or hardening        | `security/purge-revoked-keys`          |
| `release/`  | Release preparation              | `release/0.2.0`                        |

> The original starter prompt suggested `feature/*`. We use `feat/*` instead so the branch prefix is identical to the commit type. One vocabulary, not two.

Rules: lowercase kebab-case · describe the change, not the ticket (`feat/resumable-upload`, not `feat/ticket-42`) · no personal prefixes (`akshay/...`).

### Lifetime

Short. A branch open longer than **three days** is a design problem — it means the change is too large. Split it.

One branch carries **one concern**. If you find yourself writing "and" in the PR title, open a second branch.

### Keeping current

**Rebase onto `main`. Do not merge `main` into your branch.**

```bash
git fetch origin
git rebase origin/main
```

Merge commits from `main` into a feature branch produce a history that is genuinely painful to bisect — and bisecting is how you find the commit that broke recovery.

Force-push after rebasing is expected and fine on your own branch:

```bash
git push --force-with-lease
```

Always `--force-with-lease`, never `--force`. The lease is what stops you destroying a collaborator's work if they pushed while you were rebasing.

---

## 4. Commits

Conventional Commits, enforced by commitlint:

```
<type>(<scope>): <summary>
```

Scopes match packages and apps: `core`, `protocol`, `web`, `react`, `storage-memory`, `storage-indexeddb`, `devtools`, `reference-app`, `docs`, `api`, `repo`, `ci`.

```
feat(core): add workspace lock state machine
fix(sync): prevent duplicate mutation replay on reconnect
security(auth): purge revoked workspace keys on logout
test(recovery): cover tab crash mid-checkpoint
perf(web): reduce checkpoint serialization cost by 40%
docs(protocol): define checkpoint versioning semantics
```

**Rules**

- One logical change per commit.
- The summary says what changed, in the imperative. Not `changes`, not `fix stuff`, not `wip`.
- Tests travel in the same commit as the behaviour they verify.
- Docs travel in the same commit as the public API they describe.
- A breaking change gets `!` after the scope — `feat(core)!: rename Workspace.purge to Workspace.revoke` — and a `BREAKING CHANGE:` footer explaining the migration.

Every commit on a branch lands on `main` unchanged (merges are merge commits, §7). Tidy your own `wip` commits into meaningful ones **before the first push**, while that history is still yours alone.

---

## 5. Before you commit

Non-negotiable, and covered in full in [`PRE_COMMIT_VERIFICATION.md`](../security/PRE_COMMIT_VERIFICATION.md):

1. **Read your own diff.** `git diff --staged`, every line. Most secrets are committed by people who ran `git add -A` without looking.
2. **Never stage with `git add -A` or `git add .`** in this repository. Stage deliberately, by path.
3. **The hooks run automatically.** If one flags something, do not bypass it — investigate.

What runs today, via `lefthook.yml`:

| Hook         | Job                                                                 | Blocking       |
| ------------ | ------------------------------------------------------------------- | -------------- |
| `pre-commit` | `forbidden-paths` — env files, key material, captured runtime state | yes            |
| `pre-commit` | `secretlint` — secret content in staged files                       | yes            |
| `pre-commit` | `prettier` — formats and re-stages                                  | no, auto-fixes |
| `commit-msg` | `commitlint` — Conventional Commits                                 | yes            |
| `pre-push`   | `pnpm test`                                                         | yes            |

Typecheck and lint join `pre-commit` with the TypeScript migration, once there is a `tsc` and an ESLint config for them to run. They are deliberately absent rather than stubbed — a hook that runs nothing is worse than no hook, because it reads as coverage.

After editing `lefthook.yml`, run `pnpm hooks:install`. Config changes do not take effect until hooks are re-synced.

`--no-verify` is not permitted. If a hook is wrong, fix the hook in its own PR.

---

## 6. Pull requests

### Opening

```bash
git push -u origin feat/your-branch
gh pr create --fill
```

Fill in the template properly. `.github/PULL_REQUEST_TEMPLATE.md` asks for: description, motivation, changes, verification, and the security/architecture checklist. The checklist is not decoration — the `Persistence != Authorization` and namespace-scoping boxes are the two invariants most likely to be quietly broken.

**Keep PRs small.** Under ~400 changed lines where possible. Review quality falls off a cliff past that point, and this is a codebase where review quality is the thing standing between a bug and a cross-tenant leak.

Open as a **draft** if work is ongoing. Mark ready only when you believe it is mergeable.

### Required checks

Every PR must be green on all of these before merge:

| Check                | Command                    |
| -------------------- | -------------------------- |
| Typecheck            | `pnpm typecheck`           |
| Lint                 | `pnpm lint`                |
| Format               | `pnpm format:check`        |
| Unit tests           | `pnpm test`                |
| Build                | `pnpm build`               |
| Secret scan          | `gitleaks detect --redact` |
| E2E _(from Phase 3)_ | `pnpm test:e2e`            |

> **Partially wired.** `.github/workflows/ci.yml` runs `format:check`, the secretlint content scan, the test suite, and gitleaks over full history. `typecheck` and `lint` arrive with the TypeScript migration; `test:e2e` with Phase 3. They are deliberately absent rather than stubbed as always-passing steps.

Once server-side protection is available (§2), these become **required status checks** and merge is blocked until they pass. Until then they run in CI and you are on your honour to respect a red build.

### Review

- **Solo phase:** self-review the full diff in the GitHub UI before merging. Reviewing your own diff in a different medium than the one you wrote it in genuinely catches things. Let the PR sit overnight where it touches security.
- **With collaborators:** one approval minimum. Two for anything touching `packages/core`, the lock cycle, storage key construction, or serialization.
- **Security review is mandatory** — and must be stated explicitly in the PR — for changes to: storage key namespacing · the `LOCK → REAUTHENTICATE → REAUTHORIZE → UNLOCK → REVALIDATE → RECONCILE` cycle · authorization boundaries · serialization or deserialization of persisted state · anything that writes to disk or IndexedDB · dependency additions.
- **AI-authored PRs are reviewed exactly as strictly as human ones**, and are labelled `ai-assisted`. An agent claiming tests pass is not evidence tests pass; the CI run is.

---

## 7. Merging

**Merge with a merge commit.** Always: `gh pr merge <n> --merge`.

**Never squash-merge and never rebase-merge.**

- Squashing collapses the branch's commits into one new commit, so the history that was reviewed and tested disappears from `main`.
- Rebase-merging rewrites every commit with new SHAs.

A merge commit keeps every commit exactly as it was pushed, reviewed and run through CI.

- **Every commit on the branch lands on `main` as-is.** So each one must be a valid Conventional Commit that builds and passes tests on its own (§5). Tidy your own unpushed `wip` commits before the first push.
- **The merge commit body carries the PR description.**
- **Keep the branch after merging.** Don't delete it.

Merge commits keep `git bisect` and `git revert` reliable:

- `git bisect --first-parent` walks one PR at a time.
- `git revert -m 1 <merge-sha>` undoes a whole PR in one step.
- Plain `git bisect` can still descend into a PR's individual commits to find the exact one.

**Never merge a red build.** If CI is broken for an unrelated reason, fix CI first, in its own PR.

### Releases

Versioning runs on **Changesets**.

1. Add a changeset in the PR that makes the change: `pnpm changeset`. Pick the affected packages and the semver bump.
2. Changesets accumulates them and opens a release PR.
3. Merging the release PR bumps versions, writes `CHANGELOG.md`, tags, and publishes.

While on `0.x`, the protocol is explicitly unstable. Any change to the persisted wire format or the storage key shape needs a compatibility note in the changeset — someone's users have half-finished work sitting in IndexedDB in the old format.

---

## 8. If something goes wrong

**Committed to `main` locally, not yet pushed**

```bash
git branch feat/rescue          # save the work
git reset --hard origin/main    # rewind main
git switch feat/rescue          # continue properly
```

**Pushed a bad commit to `main`**

```bash
git revert <sha>
```

Revert, then open a PR with the fix. Do not force-push `main` — it rewrites history other clones depend on.

**Committed a secret**

Stop. Go to [`PRE_COMMIT_VERIFICATION.md` §6](../security/PRE_COMMIT_VERIFICATION.md#6-if-a-secret-was-committed) and follow it exactly. **Rotate the credential before doing anything about git history** — the moment it was pushed, assume it is compromised.

---

## 9. Quick reference

```bash
# start
git switch main && git pull
git switch -c feat/your-change

# work — stage deliberately, never `git add -A`
git add packages/core/src/workspace.ts
git diff --staged                       # read every line
git commit -m "feat(core): add lock state machine"

# stay current
git fetch origin && git rebase origin/main
git push --force-with-lease

# ship
gh pr create --fill
gh pr checks --watch
gh pr merge --merge                     # merge commit only; keep the branch
```
