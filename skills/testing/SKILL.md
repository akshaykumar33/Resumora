---
name: testing
description: Protocol for authoring fast, deterministic unit, integration, and chaos test suites.
---

# Testing Skill

## WHEN TO USE

Use when writing tests for any Resumora package.

## INPUTS

- Target component or state machine.
- Vitest test runner.

## PROCESS

1. Write unit tests testing happy path and boundary conditions.
2. Simulate failure modes (crash mid-write, token expiry, corrupt disk).
3. Ensure sub-second execution speed.

## CHECKS

- [ ] 100% test pass rate.
- [ ] Zero flaky asynchronous timing dependencies.

## OUTPUTS

- Vitest test files (`*.test.ts`).

## FAILURE CONDITIONS

- Blind assertions that pass on unhandled errors.
