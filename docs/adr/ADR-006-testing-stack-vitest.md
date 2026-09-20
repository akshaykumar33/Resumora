# ADR-006: Fast Deterministic Testing with Vitest

## Status: Accepted

## Context

Verifying state machines, sequential intent replays, and fault injection requires a testing framework with instant start-up, native TypeScript execution, and modern mocking capabilities.

## Decision

Standardize on **Vitest** for all unit, integration, and state machine simulation testing.

## Consequences

- Instant test feedback loops (< 500ms).
- Native ESM and TypeScript support without compilation overhead.
