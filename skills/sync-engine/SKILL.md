---
name: sync-engine
description: Guidelines for mutation queue processing, retry backoff, and idempotent server reconciliation.
---

# Sync Engine Skill

## WHEN TO USE

Use when developing or refactoring mutation synchronization, offline outbox queuing, or retry mechanics.

## INPUTS

- Mutation queue specifications.
- Network transport contracts.

## PROCESS

1. Enqueue mutations with UUIDv4 idempotency keys and client timestamps.
2. Execute outbound requests in FIFO sequence or priority order.
3. Apply exponential backoff with jitter on network failures.

## CHECKS

- [ ] Guaranteed at-least-once delivery with server-side idempotency.
- [ ] Offline status halts network dispatch without throwing unhandled rejections.

## OUTPUTS

- Verified synchronization state machine.

## FAILURE CONDITIONS

- Duplicate mutation execution on server due to missing idempotency tokens.
