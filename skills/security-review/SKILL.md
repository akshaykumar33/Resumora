---
name: security-review
description: Verification protocol for multi-tenant isolation, logout purge policies, and credential security.
---

# Security Review Skill

## WHEN TO USE

Use whenever modifying authentication, storage keys, serialization, or token handling code.

## INPUTS

- Target file diff.
- `docs/security/THREAT_MODEL.md`.
- `docs/security/DATA_CLASSIFICATION.md`.

## PROCESS

1. Inspect all storage key generation functions to ensure mandatory inclusion of `tenantId` and `userId`.
2. Verify that workspace lock triggers immediately wipe unencrypted memory representations.
3. Ensure no authorization headers, API keys, or raw JWTs are written to local storage.

## CHECKS

- [ ] All keys follow `resumora::{tenantId}::{userId}::{workspaceId}`.
- [ ] Logout forces workspace into `Locked` or `Purged` state.
- [ ] Checksums protect checkpoints against local tampering.

## OUTPUTS

- Security Audit Checklist results.

## FAILURE CONDITIONS

- Storing unencrypted sensitive credentials.
- Bypassing workspace authentication gates.
