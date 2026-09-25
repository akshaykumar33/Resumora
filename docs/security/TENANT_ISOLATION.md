# Tenant & Workspace Isolation

Every record Resumora persists belongs to exactly one tenant, user and workspace. One tenant must never be able to read, overwrite or purge another tenant's records.

## How isolation is enforced

Isolation is enforced by the storage key. Every key is built by `buildStorageKey` or `buildPrefix` in `packages/core/src/storage.js`:

```
resumora::{tenantId}::{userId}::{workspaceId}::{recordType}::{recordId}
```

Reads, writes and purges all address records through these keys or their prefixes. The runtime's in-memory workspace cache uses the same prefix, so the cache can't hand one tenant's `Workspace` to another.

## Identity segments are allowlisted

The three identity segments are joined with `::`. If a segment could contain `:`, two different identities could produce the same key. For example, tenant `acme::alice` with user `w1` and workspace `x` would share keys with tenant `acme`, user `alice` and workspace `w1::x`, so one tenant could read or purge the other's data.

To prevent this, `assertValidIdentity` rejects any `tenantId`, `userId` or `workspaceId` that isn't 1–128 characters from this set:

```
A-Z  a-z  0-9  .  _  @  +  -
```

UUIDs, ULIDs, slugs, numeric IDs and most email addresses fit. A rejected identity throws `InvalidIdentityError` (code `INVALID_IDENTITY`) before any storage access. The error names the field but never echoes the rejected value, which is caller-supplied and may reach logs.

Hosts whose identifiers fall outside this set should map them to a stable allowed form, such as a hash or an internal ID, before calling the runtime. The rule is deliberately strict while the API is pre-1.0: loosening it later is backwards compatible, but tightening it would not be.

## What this does not cover

- **Authorization.** A valid identity is not proof of entitlement. Stored data never grants access; see the lock cycle in `AGENTS.md`.
- **Hostile code on the same origin.** Script running on the page can read browser storage directly, whatever the key scheme.
