# Product Requirements Document (PRD)

## 1. Functional Requirements (FR)

- **FR-01 (Workspace Scoping)**: Every persisted entity belongs to a strict `{ tenantId, userId, deviceId, workspaceId }` tuple.
- **FR-02 (Intent Journaling)**: Continuous recording of user operations with monotonically increasing sequence IDs.
- **FR-03 (Checkpoint Snapshots)**: Periodic or trigger-based snapshotting of application state.
- **FR-04 (Recovery Engine)**: Deterministic reconstruction of workspace state combining the latest valid checkpoint + uncommitted intent replay.
- **FR-05 (Authentication Gate)**: Workspace state locks automatically upon session logout, token revocation, or user identity switch.
- **FR-06 (Pluggable Storage)**: Storage interface decoupled from runtime, supporting Memory (test/SSR), IndexedDB (browser), and SQLite (mobile).

## 2. Non-Functional Requirements (NFR)

- **NFR-01 (Bundle Size)**: Core runtime bundle must be < 15KB gzipped.
- **NFR-02 (Performance Budget)**: Intent append latency < 4ms; Checkpoint restore latency < 25ms for 1MB state.
- **NFR-03 (Security)**: Zero unauthenticated local data exposure; automatic purge on session revocation.
- **NFR-04 (Reliability)**: Zero data corruption on simulated sudden power loss / tab kill during write.
