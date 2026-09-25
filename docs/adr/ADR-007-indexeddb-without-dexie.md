# ADR-007: IndexedDB adapter on the native API, not Dexie

## Status

Accepted, 2026-09-25, by the owner when merging #15.

## Context

`prompts/PHASE_2_BUILD_PROMPT.md` §2.3 chose Dexie inside `@resumora/storage-indexeddb`, "an implementation detail of one adapter". Changing a §2 decision requires an ADR.

The `StorageAdapter` contract needs exactly one object store holding opaque bytes under string keys, plus six operations. All of them map directly onto the native API:

| Operation          | Native IndexedDB                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------- |
| `get`              | `store.get(key)`                                                                         |
| `set` / `delete`   | `store.put` / `store.delete` in one transaction                                          |
| `listKeys(prefix)` | `store.getAllKeys(range)`, where `range` spans from the prefix to the prefix plus U+FFFF |
| `clear(prefix)`    | `store.delete(range)`, or `store.clear()`                                                |
| `batch`            | every operation in one transaction (atomic)                                              |

SPIKE-001 established that a write is durable only once its transaction's `complete` event fires, and that the journal should default to `strict` durability. Both are one-line concerns with the native API: resolve on `complete`, and pass `{ durability }` to `transaction()`.

Dexie is also an adjacent product in Resumora's competitive landscape (`docs/product/COMPETITIVE_LANDSCAPE.md`). The owner prefers that Resumora's storage layer not depend on it.

## Decision

Implement `@resumora/storage-indexeddb` on the native IndexedDB API, with no runtime dependencies.

## Consequences

- **Positive:** consumers download no extra library, since every runtime dependency ships to every user. Transaction boundaries, durability and the `complete` event are explicit in about 150 lines, not hidden behind an ORM.
- **Positive:** the adapter stays auditable for the security review that storage changes require.
- **Negative:** we own IndexedDB's edge cases that Dexie would have smoothed. These include `versionchange` from another tab, blocked upgrades, Safari transaction lifetimes, and `QuotaExceededError` surfacing.
- **Mitigation:** the shared conformance suite runs against the adapter (via `fake-indexeddb`), and Playwright covers reload, tab-crash and browser-crash recovery against real Chromium. Revisit this ADR if a query need appears that one key-value store can't serve, such as secondary indexes.
