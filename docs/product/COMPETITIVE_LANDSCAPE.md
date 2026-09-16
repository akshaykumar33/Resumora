# Competitive Landscape Analysis

## 1. Dexie.js
- **What it does**: Clean, performant indexedDB wrapper.
- **What we learn**: Battle-tested indexedDB indexing and transaction semantics.
- **Where Resumora differs**: Dexie is raw storage. Resumora is a workflow continuity runtime with intent logging, checkpointing, and authentication boundary enforcement.

## 2. TanStack Query (React Query) Persistence
- **What it does**: Persists query cache to localStorage/indexedDB.
- **What we learn**: Client cache serialization conventions.
- **Where Resumora differs**: Query cache persistence only caches server GET responses. It does not model draft user actions, multi-step wizards, or idempotent mutation recovery.

## 3. ElectricSQL / PowerSync
- **What it does**: Postgres replication to client SQLite via sync services.
- **Where Resumora differs**: ElectricSQL requires architectural overhaul of Postgres write pipelines. Resumora sits non-invasively on the client and integrates with existing REST or GraphQL endpoints.
