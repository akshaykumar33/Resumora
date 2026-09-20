# Pre-Commit Verification

Preventing secrets, credentials, and real user data from entering the Resumora repository.

Companion documents: [`../engineering/GIT_WORKFLOW.md`](../engineering/GIT_WORKFLOW.md) · [`DATA_CLASSIFICATION.md`](./DATA_CLASSIFICATION.md) · [`THREAT_MODEL.md`](./THREAT_MODEL.md)

---

## 1. Why this is stricter here than elsewhere

Two reasons specific to this project.

**Resumora's entire purpose is persisting user work.** Test fixtures, recovery snapshots, devtools exports, and bug reports all naturally contain _state that looked like real user data at the time it was captured_. A checkpoint fixture pasted from a live session is the most likely way real PII lands in this repository — far likelier than a leaked API key.

**Git never forgets.** A secret pushed to a public repository is scraped by automated crawlers within minutes. Removing the commit does not help; the credential must be rotated. Prevention is the only control that actually works. Everything downstream is damage limitation.

---

## 2. Four layers

No single layer is sufficient. Each one is bypassable; the combination is not.

| Layer                    | Mechanism                        | Catches                             | Bypassable by                   |
| ------------------------ | -------------------------------- | ----------------------------------- | ------------------------------- |
| 1. Ignore                | `.gitignore`                     | Files never staged at all           | Explicit `git add -f`           |
| 2a. Local hook — path    | `scripts/check-staged-paths.mjs` | Forbidden _filenames_               | `git commit --no-verify`        |
| 2b. Local hook — content | Secretlint                       | Secret _content_ in scannable files | `git commit --no-verify`        |
| 3. CI                    | Gitleaks over full history       | Anything that reached a PR          | Nothing — this is the real gate |
| 4. Platform              | GitHub push protection           | Known provider token formats        | Repo plan (see §5)              |

**`--no-verify` is not permitted in this repository.** If a hook is wrong, fix the hook in its own PR.

### 2.1 Verified limitations — read before trusting any of this

These were established by testing the hooks against planted fake credentials, not by reading documentation. They are the reason the model has four layers instead of one.

**Secretlint gates on file extension, not content.** The identical string
`postgresql://USER:PW@host.neon.tech/db` (with a real lowercase password) is flagged in `probe.txt` and **silently passes in `.env.production`**. Secretlint resolves a content type from the extension and skips what it cannot classify. A scanner that returns green on an unrecognised extension is worse than no scanner if you trust it blindly.

> This is precisely why layer 2a exists. `check-staged-paths.mjs` blocks env files, key material, and captured runtime state **by path**, so the extension gap cannot be reached for the file types most likely to carry credentials. Gitleaks in CI (layer 3) is extension-agnostic and closes the remainder.

**Secretlint must not be pointed at `.gitignore`.** An earlier configuration used `--secretlintignore .gitignore`. Because `.env.*` is gitignored, a force-added env file was excluded from scanning — the blind spot sat exactly where `git add -f` is used, which is the only way such a file gets staged in the first place. The dedicated [`.secretlintignore`](../../.secretlintignore) lists build artefacts only.

**The hook runner's staged-file list is not git's.** The secretlint job uses
`files: git diff --cached --name-only --diff-filter=ACMR` rather than lefthook's `{staged_files}`, so what gets scanned is exactly what gets committed, including force-added paths.

**Hooks are not active until synced.** After changing `lefthook.yml`, run `pnpm hooks:install`. A config change alone does not take effect on the next commit — during testing, a commit slipped through while lefthook was still self-syncing. Verify with a planted fake secret after any hook change; do not assume.

### 2.2 Placeholder convention

Documentation about credentials will otherwise be blocked by the scanner that reads it — this very file was refused on first commit for containing example connection strings.

**Write placeholder credentials in ALL CAPS.** `postgresql://USER:PASSWORD@HOST.neon.tech/DB` — never the same URL with a lowercase `user:password` pair, which is indistinguishable from a real one. The Postgres pattern in [`.secretlintrc.json`](../../.secretlintrc.json) carries a negative lookahead exempting all-caps user/password pairs, so placeholders pass while anything resembling a real credential does not.

Do not solve this by adding files to `.secretlintignore`. An ignored file is one where a genuine secret would pass unnoticed, and documentation about secrets is a place people paste real values by accident.

---

## 3. What counts as sensitive

### Always forbidden

- **Credentials of any kind** — API keys, access tokens, refresh tokens, session cookies, passwords, `gho_*` / `ghp_*` GitHub tokens.
- **Private keys and certificates** — `*.pem`, `*.key`, `*.p12`, `*.pfx`, `id_rsa`, `id_ed25519`, and anything containing `BEGIN * PRIVATE KEY`.
- **Database connection strings.** Specifically for this project: **Neon Postgres URLs** in the form `postgresql://USER:PASSWORD@HOST.neon.tech/DB`. These embed the password. They belong in `.env.local` and in the deployment platform's secret store — never in a commit, a test file, a README example, or a code comment.
- **JWT signing secrets** — anything feeding `jose` in `apps/api`. A leaked signing secret means anyone can mint a valid token for any tenant, which defeats every authorization boundary in the product.
- **Cloud provider credentials** — AWS, GCP, Azure keys, service-account JSON.
- **`.env` files of every variety.** `.env.example` with placeholder values is the only permitted form, and every value in it must be obviously fake.
- **Local AI-agent and editor configuration** — `.claude/settings.local.json`, `.cursor/mcp.json`, `.vscode/settings.json`. MCP server definitions routinely embed live database connection strings. This repository's own `.claude/settings.local.json` contains Neon credentials; it has never been committed, but it was protected only by a personal global gitignore, which does not travel to anyone else's clone. Repository-level `.gitignore` entries now cover it.

### Forbidden, and specific to Resumora

- **Real user data in checkpoint or intent fixtures.** Test workspaces use synthetic data. Names, addresses, financial figures, and uploaded files in `tests/` and in reference-app seed data must be invented.
- **Real tenant or organization identifiers.** Use `tenant_alpha`, `org_test`, not the name of an actual company you are piloting with.
- **Production device identifiers** from the device registry.
- **Devtools timeline exports from a live session.** These are a full serialized record of a user's work. If one is needed to reproduce a bug, scrub it first and say in the PR that you did.
- **Internal customer or pilot-partner names** in documentation, tests, or commit messages.

### Also worth catching

Internal hostnames and private IP ranges · personal email addresses beyond the maintainer contact already published in `SECURITY.md` · verbatim error dumps containing stack traces with local filesystem paths and usernames.

---

## 4. Layer 1 — `.gitignore` hardening

The current `.gitignore` covers `.env` but **not** `.env.local`, `.env.production`, or any key material. Required additions:

```gitignore
# Secrets and environment
.env
.env.*
!.env.example
*.local

# Key material
*.pem
*.key
*.p12
*.pfx
id_rsa
id_ed25519

# Cloud credentials
.aws/
gcp-service-account*.json
*-credentials.json

# Resumora-specific: captured runtime state
*.checkpoint.json
*.timeline-export.json
tests/**/fixtures/*.real.json
.fault-lab-recordings/
```

`.gitignore` prevents accidents, not intent — `git add -f` overrides it. It is the cheapest layer, not a control you can rely on.

---

## 5. Layer 4 — GitHub push protection

GitHub scans pushes for known provider token formats and blocks them at the remote. It is the only layer that works even when someone bypasses every local hook.

**Availability:** free and automatic on **public** repositories. On **private** repositories it requires GitHub Advanced Security, which is not on the Free plan.

> Resumora is currently private on a Free plan, so **push protection is not active**. This is the same constraint documented in [`GIT_WORKFLOW.md` §2](../engineering/GIT_WORKFLOW.md#2-current-enforcement-reality) that also blocks branch protection.
>
> Making the repository public activates push protection and branch rulesets at no cost, and matches the project's stated open-source-first model. **Before going public, run a full-history secret scan (§7) and treat anything it finds as already compromised** — history becomes world-readable the instant visibility changes.

---

## 6. If a secret was committed

Order matters. Do these in sequence.

### Step 1 — Rotate. Immediately.

**Before touching git history.** Revoke the credential and issue a new one.

Assume compromise from the moment of the push, not the moment of discovery. For a public repository, assume compromise within seconds — crawlers monitor the GitHub events firehose continuously.

| Credential             | Action                                                                          |
| ---------------------- | ------------------------------------------------------------------------------- |
| Neon connection string | Reset the role password in the Neon console, update the deployment secret store |
| JWT signing secret     | Rotate the key; this invalidates all live sessions, which is correct            |
| GitHub token           | `gh auth refresh`, or revoke at github.com/settings/tokens                      |
| Cloud key              | Revoke in the provider console, issue a replacement                             |

### Step 2 — Assess exposure

```bash
git log --all --oneline -S '<fragment-of-the-secret>'
```

Was it pushed? Is the repo public? Did anyone fork or clone it? Is it in a PR diff, a CI log, or an issue comment? Forks and CI logs retain the value independently of your history rewrite.

### Step 3 — Remove from history

Only after rotation, and only once you accept that this does not undo the exposure.

```bash
# Preferred — purge a path across all history
git filter-repo --path path/to/file --invert-paths

# Or redact a literal value wherever it appears
git filter-repo --replace-text secrets.txt
```

Then coordinate: `git filter-repo` rewrites every SHA. Everyone with a clone must re-clone. Open PRs will need rebasing.

If the commit is the most recent one and **has not been pushed**, it is far simpler:

```bash
git reset --soft HEAD~1    # unstage, keep the work
# remove the secret, then re-commit
```

### Step 4 — Record it

Note the incident, the rotation, and the timeline in the security log. Not for blame — for the pattern. Three near-misses in the same area means the tooling needs fixing, not the person.

---

## 7. Auditing full history

Run before making the repository public, and before any release.

Gitleaks is a Go binary and is **not** installed by `pnpm install` — it is intentionally separate from the npm toolchain so CI can run it on a clean runner. Install locally with `winget install gitleaks` (Windows), `brew install gitleaks` (macOS), or download a release binary.

```bash
# Full history, every commit — extension-agnostic, unlike secretlint
gitleaks detect --source . --redact --verbose

# Staged changes only
gitleaks protect --staged --redact
```

The npm-based scanner covers the everyday path:

```bash
pnpm secrets:scan     # secretlint across the working tree
pnpm check:paths      # forbidden-path guard against the current index
```

`--redact` keeps the found values out of your terminal scrollback and CI logs. Use it. A scanner that prints the secret it found into a public CI log has made the problem worse.

---

## 8. The habit that matters most

Tooling catches known patterns. It does not catch a customer's name in a test fixture, or a real address in seed data, or a plausible-looking connection string in a code comment.

**Read your own diff before every commit.**

```bash
git diff --staged
```

Every line. And in this repository specifically:

- **Never `git add -A` or `git add .`.** Stage by path. The overwhelming majority of committed secrets arrive via a bulk `add` from someone who did not look.
- Be deliberate about `git commit -am`, which has the same failure mode.
- When pasting anything from a real session — logs, fixtures, timeline exports, error output — scrub it _before_ it reaches the editor, not after.

---

## 9. Checklist

Before every commit:

- [ ] I read the complete staged diff
- [ ] I staged by path, not with `-A` or `.`
- [ ] No credentials, tokens, keys, or connection strings
- [ ] No `.env` file other than `.env.example` with fake values
- [ ] No real user data, names, addresses, or financial figures in fixtures
- [ ] No real tenant, organization, or customer identifiers
- [ ] No devtools export or checkpoint captured from a live session
- [ ] The pre-commit hook passed without `--no-verify`

Before making the repository public:

- [ ] `gitleaks detect --source . --redact` is clean over full history
- [ ] Every credential ever committed has been rotated, whether or not it looked live
- [ ] Docs, issues, and PR descriptions reviewed for internal names and hostnames
- [ ] `.env.example` contains only obvious placeholders
- [ ] Test fixtures reviewed for anything resembling real data
