# @resumora/core

Recover your users' unfinished work after a crash, a refresh or an expired session, without ever treating stored data as permission to see it.

> **Status:** pre-1.0 and **not yet published to npm**. Minor versions may contain breaking changes until 1.0, and every one is recorded in the changelog.

## Install

```sh
npm install @resumora/core @resumora/storage-memory
```

`@resumora/core` has no runtime dependencies. Storage is pluggable: `@resumora/storage-memory` is the reference adapter, and a browser (IndexedDB) adapter is planned.

## Example

```ts
import { ContinuityRuntime } from '@resumora/core';
import { MemoryStorageAdapter } from '@resumora/storage-memory';

const storage = new MemoryStorageAdapter();
const identity = {
  tenantId: 'acme',
  userId: 'user_42',
  workspaceId: 'claim_7',
};

const workspace = await new ContinuityRuntime({ storage }).openWorkspace(
  identity,
);
await workspace.recordIntent('UPDATE_FIELD', { field: 'amount', value: 1200 });
await workspace.saveCheckpoint({ amount: 1200, step: 3 });
await workspace.recordIntent('UPDATE_FIELD', {
  field: 'note',
  value: 'Roof damage',
});

// After a reload: a fresh runtime over the same storage
const reopened = await new ContinuityRuntime({ storage }).openWorkspace(
  identity,
);
const recovered = await reopened.restoreLatestCheckpoint();

console.log(recovered?.state); // { amount: 1200, step: 3 }
console.log(recovered?.unappliedIntents.map((i) => i.payload)); // [{ field: 'note', value: 'Roof damage' }]
```

## What restore returns

| Stored work                          | `restoreLatestCheckpoint()`                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------- |
| Nothing recorded                     | `null`                                                                                |
| Intents, but no checkpoint yet       | `{ checkpoint: null, state: null, unappliedIntents }`: replay from your initial state |
| A checkpoint, plus any later intents | `{ checkpoint, state, unappliedIntents }`: replay the intents onto `state`            |

The runtime never applies intents itself. Your app owns the state shape, so it replays them.

## Security model

- **Stored data is evidence of work, never proof of access.** `workspace.lock()` blocks every read and write until `unlock(credential)` succeeds. Call it on logout or token expiry, and reauthorize with your server before unlocking.
- **`purge()` deletes the workspace's records and is final.** A purged workspace can't be locked or unlocked back into use.
- **Every record is namespaced by tenant, user and workspace.** IDs must be 1–128 characters of `A-Z a-z 0-9 . _ @ + -`, so one tenant's IDs can never build another tenant's storage keys. Map other ID formats to an allowed form, such as a hash, first.
- **What this doesn't cover:** code running on the same page can read browser storage directly. Encryption at rest is a separate concern.

## Errors

Every error extends `ResumoraError` and carries a stable `code` to branch on:

| Class                   | `code`              | When                                                                                                |
| ----------------------- | ------------------- | --------------------------------------------------------------------------------------------------- |
| `WorkspaceLockedError`  | `WORKSPACE_LOCKED`  | Read or write on a locked workspace                                                                 |
| `WorkspacePurgedError`  | `WORKSPACE_PURGED`  | Any use of a purged workspace                                                                       |
| `InvalidIdentityError`  | `INVALID_IDENTITY`  | A tenant, user or workspace ID outside the allowlist (the message names the field, never the value) |
| `ChecksumMismatchError` | `CHECKSUM_MISMATCH` | A stored checkpoint no longer matches its checksum                                                  |

## Storage adapters

Implement the exported `StorageAdapter` interface to store records anywhere. Values are opaque bytes, and the runtime owns serialization:

```ts
interface StorageAdapter {
  get(key: string): Promise<Uint8Array | null>;
  set(key: string, value: Uint8Array): Promise<void>;
  delete(key: string): Promise<void>;
  listKeys(prefix?: string): Promise<string[]>;
  batch(operations: readonly StorageOperation[]): Promise<void>;
  clear(prefix?: string): Promise<void>;
}
```

## Runtimes

- **Module format:** ESM only, with bundled TypeScript declarations. Node 22.12 and later can also `require()` it.
- **Supported runtimes:** Node 22.12 or later, and modern browsers through any bundler.
- **Host APIs:** core uses no DOM or Node APIs, only `TextEncoder` and `TextDecoder`.

## License

[Apache-2.0](./LICENSE)
