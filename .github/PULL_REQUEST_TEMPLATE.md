## Description

<!-- Provide a brief description of the changes introduced by this PR. -->

## Motivation & Context

<!-- Why is this change needed? Link relevant issues using #ISSUE_ID. -->

## Changes Made

-

## Verification & Testing

- [ ] Unit tests added / updated
- [ ] State machine invariants verified
- [ ] Sub-second Vitest execution confirmed locally

## Security & Architectural Checklist

- [ ] Preserves `Persistence != Authorization` invariant
- [ ] All keys scoped to `resumora::{tenantId}::{userId}::{workspaceId}`
- [ ] Zero sensitive tokens stored in plaintext local storage
- [ ] Backward compatibility considered
