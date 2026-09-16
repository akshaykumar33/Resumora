---
name: storage-adapter
description: Implementation standard for building and verifying custom storage adapters.
---

# Storage Adapter Skill

## WHEN TO USE
Use when implementing or optimizing a `StorageAdapter` (e.g. IndexedDB, SQLite, Redis, OPFS).

## INPUTS
- `StorageAdapter` interface from `@resumora/core`.
- Target platform driver/API.

## PROCESS
1. Implement `get`, `set`, `delete`, `listKeys`, `batch`, and `clear`.
2. Run standard adapter compliance test suite.
3. Measure performance against latency budgets (< 4ms write).

## CHECKS
- [ ] Handles batch transactions atomically.
- [ ] Gracefully handles quota exceeded errors.
- [ ] Correctly handles prefix-based key listing and range queries.

## OUTPUTS
- Verified adapter package.

## FAILURE CONDITIONS
- Unhandled storage quota exceptions that crash the application runtime.
