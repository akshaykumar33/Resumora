# Recovery Architecture & Lifecycle

## The Continuity Restoration Flow
When an application mounts or recovers from an interruption:

1. **Identification**: Identify the active identity context `{ tenantId, userId, workspaceId }`.
2. **Integrity Verification**: Check storage checksums and namespace ownership.
3. **Checkpoint Loading**: Retrieve the most recent verified `Checkpoint`.
4. **Intent Replay**: Fetch all intents recorded *after* the checkpoint's sequence ID and replay them deterministically.
5. **Reconciliation**: If network is healthy, compare local state vector with server baseline and present any divergence to the user.
6. **Continuity Ready**: Emit `onRecovered` event with restored state and target navigation route.
