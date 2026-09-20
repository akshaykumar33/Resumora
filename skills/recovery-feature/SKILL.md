---
name: recovery-feature
description: Standard workflow for implementing and testing user state recovery flows.
---

# Recovery Feature Skill

## WHEN TO USE

Use when adding recovery support to new UI components, forms, or workflow steps.

## INPUTS

- UI component state structure.
- Target recovery triggers (on-mount, on-reconnect).

## PROCESS

1. Define step checkpoint schema and serializable state slice.
2. Bind input changes to lightweight intent dispatches.
3. Implement recovery prompt ("Restore draft from X minutes ago?").

## CHECKS

- [ ] Restores complete input state and route navigation step.
- [ ] Validates state checksum before restoring.

## OUTPUTS

- Integrated component with automated recovery tests.

## FAILURE CONDITIONS

- Restoring corrupted or outdated state without user confirmation.
