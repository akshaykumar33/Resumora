# ADR-002: Runtime Language: Strict TypeScript

## Status: Accepted

## Context

The core runtime must be ultra-lightweight, embeddable in any web, node, or mobile environment, and provide flawless type safety for user workflow states and action payloads.

## Decision

Implement the core runtime in modern TypeScript in `strict` mode with zero runtime dependencies. Compile to clean, tree-shakeable ESM and CJS bundles.

## Consequences

- High developer confidence and type inference when registering workflow schemas.
- Negligible bundle footprint (< 15KB gzipped).
