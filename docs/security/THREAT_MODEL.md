# Security Threat Model & Invariants

## Core Invariant: Persistence != Authorization
Under no circumstances may locally stored data grant read or write access to an unauthenticated identity.

## Threat Vectors & Mitigations
1. **Shared Workstation User Switch**:
   - *Threat*: User A logs out; User B logs in and reads User A's cached drafts.
   - *Mitigation*: Workspace keys are strictly prefixed with `tenantId::userId`. On logout, the runtime executes a forced purge or cryptographic lock.
2. **Cross-Site Scripting (XSS)**:
   - *Threat*: Malicious script accesses IndexedDB keys.
   - *Mitigation*: Zero plaintext sensitive token storage. Defense-in-depth data classification and selective field-level redaction.
3. **Physical Device Theft / Compromise**:
   - *Mitigation*: Configurable idle auto-lock timers and remote tenant revocation signals.
