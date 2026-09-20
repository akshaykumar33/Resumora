# Resumora Protocol Overview

The Resumora Protocol defines standard serialization formats, schema versions, and exchange contracts across runtime components.

All protocol messages are versioned via a numeric envelope:

```typescript
export interface ProtocolEnvelope<T> {
  protocolVersion: 1;
  kind: 'intent' | 'checkpoint' | 'mutation' | 'sync' | 'conflict';
  tenantId: string;
  userId: string;
  workspaceId: string;
  payload: T;
}
```
