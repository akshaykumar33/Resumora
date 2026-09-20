# AI Agent Operational Instructions & Repository Guidelines

Welcome, AI Agent. You are operating in **Resumora**, an open-source Application Continuity & Workflow Recovery Runtime.

## 1. Product Mission

Resumora guarantees that users never lose meaningful work when web/mobile environments experience crashes, tab discards, token expirations, network flaps, or accidental refreshes.

## 2. Core Architectural Invariants (DO NOT VIOLATE)

1. **Persistence != Authorization**: Stored data must NEVER confer authorization. You must preserve the `LOCK -> REAUTHENTICATE -> REAUTHORIZE -> UNLOCK -> REVALIDATE -> RECONCILE` lifecycle.
2. **Strict Identity Namespacing**: All persisted records must be prefixed with `resumora::{tenantId}::{userId}::{workspaceId}`. Cross-tenant reads/writes are forbidden.
3. **Pluggable Storage**: The core runtime (`@resumora/core`) must remain completely decoupled from browser APIs (no direct calls to `window`, `localStorage`, or `indexedDB` in core).
4. **Deterministic Recovery**: Checkpoint + Intent replay must produce identical state on identical input.

## 3. Package Dependency Rules

- `@resumora/core` has ZERO external runtime dependencies.
- `@resumora/protocol` defines shared data types and envelopes.
- Adapters (`storage-memory`, `storage-indexeddb`, `storage-sqlite`) implement `StorageAdapter` from core.
- Framework bindings (`react`, `web`) wrap core without exposing internal persistence plumbing.

## 4. Prohibited Shortcuts

- ❌ Do NOT store raw unhashed authentication tokens in local persistence.
- ❌ Do NOT make `any` type assertions to bypass TypeScript strict checks.
- ❌ Do NOT create "empty directory theater" or stub files without tests.
- ❌ Do NOT claim tests passed without executing them via test commands.

## 5. Commit & PR Rules

- Strictly adhere to Conventional Commits: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `ci`, `security`.
- Atomic commits: 1 logical change per commit.
