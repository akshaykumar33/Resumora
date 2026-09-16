# ADR-003: Pluggable Asynchronous Storage Engine

## Status: Accepted

## Context
Browsers offer IndexedDB, Node/SSR environments have no browser storage, and mobile apps use SQLite. Tight coupling to any single storage API would destroy portability and make unit testing painfully slow.

## Decision
Define an abstract `StorageAdapter` interface in `@resumora/core` providing asynchronous `get`, `set`, `delete`, `listKeys`, and `batch` operations. All domain logic communicates strictly through this interface.

## Consequences
- In-memory adapter enables lightning-fast unit and CI testing.
- Platform adapters can be swapped seamlessly without modifying application code.
