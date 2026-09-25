# Resumora Roadmap

Phases follow [`prompts/PHASE_2_BUILD_PROMPT.md`](../../prompts/PHASE_2_BUILD_PROMPT.md) §4. They run in sequence, and a phase is complete only when its exit gate has been run and passed. Sprint-level sequencing, forecast and the RAID log are in [`SPRINT_PLAN.md`](./SPRINT_PLAN.md).

| Phase | Name                   | Exit gate                                                                      | Status      |
| ----- | ---------------------- | ------------------------------------------------------------------------------ | ----------- |
| 0     | Research and blueprint | Monorepo skeleton, ADRs 001–006                                                | Done        |
| 1     | Core starter           | `core` + `storage-memory` with the 6 invariant tests passing                   | Done        |
| 2     | Foundation repair      | `pnpm build && pnpm test && pnpm typecheck && pnpm lint` green in CI on a PR   | Not started |
| 3     | Web persistence        | Survives a real browser refresh and a real tab crash in Playwright             | Not started |
| 4     | Recovery UX            | A viewer kills the tab mid-workflow and resumes with no lost input             | Not started |
| 5     | Mutations and sync     | Correct recovery after a genuine token expiry; replay provably idempotent      | Not started |
| 6     | Conflicts and devtools | A conflict is created, seen and resolved entirely through the UI               | Not started |
| 7     | Documentation site     | A developer integrates Resumora into a fresh app using only the published docs | Not started |

## After v1 (not planned or scheduled)

- **Mobile and embedded:** a `storage-sqlite` adapter, React Native, and background-suspension triggers on iOS and Android.
- **Managed cloud:** multi-device checkpoint sync and session handoff between devices.
