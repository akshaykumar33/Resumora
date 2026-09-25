# Recovery Architecture & Lifecycle

## The Continuity Restoration Flow

When an application mounts or recovers from an interruption:

1. **Identification**: Identify the active identity context `{ tenantId, userId, workspaceId }`.
2. **Integrity Verification**: Check storage checksums and namespace ownership.
3. **Checkpoint Loading**: Retrieve the most recent verified `Checkpoint`.
4. **Intent Replay**: Fetch all intents recorded _after_ the checkpoint's sequence ID and replay them deterministically. If no checkpoint exists yet, every recorded intent is replayed from the initial state.
5. **Reconciliation**: If network is healthy, compare local state vector with server baseline and present any divergence to the user.
6. **Continuity Ready**: Emit `onRecovered` event with restored state and target navigation route.

## What `Workspace.restoreLatestCheckpoint()` returns

| Stored work                          | Result                                                                           |
| ------------------------------------ | -------------------------------------------------------------------------------- |
| Nothing recorded                     | `null`                                                                           |
| Intents, but no checkpoint yet       | `{ checkpoint: null, state: null, unappliedIntents }`: replay from initial state |
| A checkpoint, plus any later intents | `{ checkpoint, state, unappliedIntents }`: replay onto `state`                   |

The runtime never applies intents itself: replay belongs to the caller, which owns the state shape. A `null` result is the only signal that there is nothing to recover. Work recorded before the first checkpoint is never reported as absent.
