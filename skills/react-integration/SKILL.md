---
name: react-integration
description: Patterns for creating idiomatic, performant React hooks and context providers.
---

# React Integration Skill

## WHEN TO USE

Use when creating or updating `@resumora/react` hooks and components.

## INPUTS

- Resumora Core Runtime instance.
- React 18 / 19 concurrent mode requirements.

## PROCESS

1. Provide `ContinuityProvider` wrapping context.
2. Use `useSyncExternalStore` for tear-free subscription to runtime state.
3. Expose high-level hooks (`useContinuity`, `useCheckpoint`, `useWorkflowRecovery`).

## CHECKS

- [ ] Zero unnecessary re-renders on background intent appends.
- [ ] SSR-safe (no window/document access during server render).

## OUTPUTS

- Typed React hooks and Storybook examples.

## FAILURE CONDITIONS

- Hydration mismatches or infinite re-render loops.
