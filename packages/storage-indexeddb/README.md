# @resumora/storage-indexeddb

The persistent browser `StorageAdapter` for [`@resumora/core`](../core). It's built on native IndexedDB with no dependencies, so users' unfinished work survives reloads, tab crashes and browser crashes.

> **Status:** pre-1.0 and **not yet published to npm**.

## Install

```sh
npm install @resumora/core @resumora/storage-indexeddb
```

## Use

```ts
import { ContinuityRuntime } from '@resumora/core';
import { IndexedDbStorageAdapter } from '@resumora/storage-indexeddb';

const storage = await IndexedDbStorageAdapter.open();
const runtime = new ContinuityRuntime({ storage });
```

| Option         | Default            | Meaning                                                                 |
| -------------- | ------------------ | ----------------------------------------------------------------------- |
| `databaseName` | `'resumora'`       | One database per application. Tenants are separated by key prefixes.    |
| `durability`   | `'strict'`         | Write durability: `'strict'`, `'relaxed'` or `'default'`. See below.    |
| `indexedDB`    | global `indexedDB` | The factory to use. Inject one in tests (for example `fake-indexeddb`). |

## Guarantees

- **A write resolves only when its transaction commits.** Data in a transaction that never committed is lost on a crash, so the runtime only treats an intent as recorded once `set()` resolves.
- **`strict` durability by default.** Committed data survives a tab crash and a browser crash in either mode, as verified in [SPIKE-001](../../docs/spikes/SPIKE-001-playwright-crash-recovery.md). Only `strict` also waits for the data to reach disk, which matters on an OS crash or power loss.
- **`batch()` is atomic.** Every operation runs in one transaction, and an invalid one rolls back all of them.
- **Other tabs aren't blocked.** The connection closes itself when another tab upgrades the database.
- **Conformance:** it passes the shared `StorageAdapter` conformance suite, plus persistence-across-connections and runtime recovery tests.

## Runtimes

Modern browsers, and any environment that provides IndexedDB. The package is ESM only.

## License

[Apache-2.0](./LICENSE)
