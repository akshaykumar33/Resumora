# Pluggable Storage Architecture

## 1. The `StorageAdapter` Contract
Resumora never couples domain logic to a specific browser API. All persistence conforms to a standard async contract:

```typescript
export interface StorageAdapter {
  name: string;
  get(key: string): Promise<Uint8Array | null>;
  set(key: string, value: Uint8Array): Promise<void>;
  delete(key: string): Promise<void>;
  listKeys(prefix: string): Promise<string[]>;
  batch(operations: StorageBatchOperation[]): Promise<void>;
  clear(prefix?: string): Promise<void>;
}
```

## 2. Key Namespacing Standard
Keys are strictly structured to guarantee tenant isolation:
```
resumora::{tenantId}::{userId}::{workspaceId}::{recordType}::{recordId}
```
Examples:
- `resumora::tenant_acme::user_42::wf_claim_99::intent::000001`
- `resumora::tenant_acme::user_42::wf_claim_99::checkpoint::latest`
