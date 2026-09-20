# ADR-005: Persistence != Authorization Security Model

## Status: Accepted

## Context

Standard client-side persistence blindly reads from localStorage or IndexedDB upon initialization, potentially exposing private enterprise data if a device is shared or a user logs out.

## Decision

Enforce the fundamental invariant: **Persistence != Authorization**.
Workspaces exist within a state machine (`Active`, `Locked`, `Purged`). Logging out or token expiry immediately triggers the `Locked` state. Locally stored data cannot be inspected until re-authentication occurs.

## Consequences

- Eliminates cross-user draft leakage on shared enterprise workstations.
- Aligns with SOC2 and HIPAA compliance requirements.
