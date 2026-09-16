# Policy Engine

The Policy Engine allows developers to declare behavioral policies per resource or workflow:

```typescript
export interface ContinuityPolicy {
  maxAgeMs: number;               // Expiration TTL
  checkpointFrequency: number;    // Checkpoint every N intents
  offlineAccess: 'read-write' | 'read-only' | 'none';
  onLogout: 'lock' | 'purge';     // Invariant action on session termination
  conflictStrategy: 'client-wins' | 'server-wins' | 'manual';
}
```
