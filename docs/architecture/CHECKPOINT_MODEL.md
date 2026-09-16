# Checkpoint Model & Snapshotting

A **Checkpoint** captures a stable, recoverable representation of a workflow at a specific milestone.

```typescript
export interface Checkpoint<TState = unknown> {
  id: string;
  workspaceId: string;
  sequence: number;
  state: TState;
  metadata: {
    step: number;
    totalSteps: number;
    route: string;
    clientTimestamp: number;
  };
  checksum: string;
}
```

Checkpoints compress history: once a checkpoint is verified and saved, historical intents prior to the checkpoint sequence ID may be safely pruned.
