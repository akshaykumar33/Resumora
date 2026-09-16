# Security Policy

## Reporting Vulnerabilities
If you identify a security vulnerability or potential cross-tenant leakage vulnerability in Resumora, please email akshaykumarpatil33@gmail.com directly rather than opening a public GitHub issue.

## Core Invariant
**Persistence must never confer authorization.** All local data must be strictly isolated by `tenantId` and `userId` and locked upon session expiration.
