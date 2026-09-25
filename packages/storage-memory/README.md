# @resumora/storage-memory

The in-memory reference `StorageAdapter` for [`@resumora/core`](../core), with fault injection for testing recovery paths.

> **Status:** pre-1.0 and **not yet published to npm**.

## Install

```sh
npm install @resumora/core @resumora/storage-memory
```

`@resumora/core` is a peer dependency.

## Use

```ts
import { ContinuityRuntime } from '@resumora/core';
import { MemoryStorageAdapter } from '@resumora/storage-memory';

const runtime = new ContinuityRuntime({ storage: new MemoryStorageAdapter() });
```

Data lives only as long as the adapter object, so this adapter is for tests, demos and server-side scratch work, not for persistence across reloads.

## Fault injection

| Option               | Default    | Effect                                                                    |
| -------------------- | ---------- | ------------------------------------------------------------------------- |
| `simulatedLatencyMs` | `0`        | Delays every operation by this many milliseconds                          |
| `faultOnWrite`       | `false`    | Every write throws `Simulated storage write fault`                        |
| `quotaLimitBytes`    | `Infinity` | A write that would exceed the quota throws `Simulated QuotaExceededError` |

```ts
const flaky = new MemoryStorageAdapter({
  quotaLimitBytes: 1024,
  simulatedLatencyMs: 50,
});
```

`currentSizeBytes` reports the bytes counted against the quota. Overwriting a key counts only the size difference.

## Guarantees

It passes the shared `StorageAdapter` conformance suite (`tests/storage-adapter-conformance.js`). The suite checks that bytes round-trip, and that stored bytes are isolated from later mutation of both the input and the returned buffer. It also covers prefix listing and clearing, and ordered batches.

## License

[Apache-2.0](./LICENSE)
