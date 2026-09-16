---
name: protocol-change
description: Procedures for evolving wire protocols, envelope schemas, and backwards compatibility.
---

# Protocol Change Skill

## WHEN TO USE
Use when adding or modifying fields on `Intent`, `Checkpoint`, `Mutation`, or `Envelope` contracts.

## INPUTS
- Existing protocol definitions in `@resumora/protocol`.
- Proposed schema modification.

## PROCESS
1. Ensure changes are additive (optional fields with defaults).
2. Increment schema version if breaking serialization changes occur.
3. Update `docs/protocols/` specifications.

## CHECKS
- [ ] Backwards compatibility test written for historical stored payloads.
- [ ] Protocol version bump recorded.

## OUTPUTS
- Updated protocol definitions and migration notes.

## FAILURE CONDITIONS
- Incompatible field deletion causing client recovery crashes on existing drafts.
