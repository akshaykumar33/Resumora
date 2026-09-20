# ADR-001: Monorepo Tooling: pnpm + Turborepo

## Status: Accepted

## Context

Resumora consists of a core runtime, protocol schemas, multiple storage adapters (Memory, IndexedDB, SQLite), web/react bindings, devtools, and reference demo applications. We require fast workspace management, strict dependency isolation, and optimized incremental caching.

## Decision

Adopt **pnpm workspaces** combined with **Turborepo**:

- pnpm provides content-addressable storage, symlink isolation preventing phantom dependencies, and lightning-fast package resolution.
- Turborepo orchestrates pipelines (build, test, lint) with high-efficiency topological task execution.

## Consequences

- Clean package boundaries across `@resumora/*`.
- Fast local CI cycles.
