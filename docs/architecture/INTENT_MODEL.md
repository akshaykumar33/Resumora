# Intent Model & Journaling

An **Intent** represents a discrete, atomic user action that has occurred locally and is awaiting either checkpoint snapshotting or remote synchronization.

```typescript
export interface Intent<TPayload = unknown> {
  id: string;
  sequence: number;
  workspaceId: string;
  action: string;
  payload: TPayload;
  timestamp: number;
  status: 'pending' | 'reconciled' | 'rejected';
}
```

Intents are immutable once written. They provide a transparent audit log of local user edits between discrete checkpoints.
