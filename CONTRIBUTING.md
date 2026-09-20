# Contributing to Resumora

Resumora is infrastructure that other teams will trust with their users' unfinished work. A defect in the lock cycle or the tenant namespace is a cross-tenant data leak, not a cosmetic bug. The process below exists for that reason.

## Before you start

Read these. They are short and they are binding:

- [`docs/engineering/GIT_WORKFLOW.md`](docs/engineering/GIT_WORKFLOW.md) — branching, PRs, merging
- [`docs/engineering/COMMIT_GUIDE.md`](docs/engineering/COMMIT_GUIDE.md) — Conventional Commits, enforced
- [`docs/security/PRE_COMMIT_VERIFICATION.md`](docs/security/PRE_COMMIT_VERIFICATION.md) — secrets and sensitive data
- [`AGENTS.md`](AGENTS.md) — architectural invariants, for humans and AI agents alike

## Setup

```bash
pnpm install        # also installs git hooks via `prepare`
pnpm test
```

If hooks do not fire, run `pnpm hooks:install`.

## The rules that matter most

1. **Never commit to `main`.** Branch, PR, squash merge.
2. **`Persistence != Authorization`.** Any change touching storage must preserve strict tenant and user namespace isolation, and the `LOCK → REAUTHENTICATE → REAUTHORIZE → UNLOCK → REVALIDATE → RECONCILE` lifecycle.
3. **Tests travel with behaviour.** Including failure-path tests — in a recovery runtime, the failure paths _are_ the product.
4. **Stage by path.** Never `git add -A` or `git add .`. Read your staged diff before every commit.
5. **`--no-verify` is not permitted.** If a hook is wrong, fix the hook in its own PR.
6. **Do not claim a test passed without running it.** Paste the output.

## Security-sensitive changes

Anything touching storage key construction, the lock cycle, authorization boundaries, or serialization of persisted state requires an explicit security review, stated in the PR description. Say what you considered and what you concluded.

Vulnerabilities go to the address in [`SECURITY.md`](SECURITY.md), never to a public issue.

## AI-assisted contributions

Welcome, and reviewed exactly as strictly as human ones. Label the PR `ai-assisted`. An agent asserting that tests pass is not evidence; the CI run is.
