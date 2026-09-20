---
name: architecture-review
description: Guidelines for evaluating architectural proposals, package boundaries, and ADR compliance.
---

# Architecture Review Skill

## WHEN TO USE

Use this skill when proposing new packages, modifying core interfaces, introducing third-party dependencies, or drafting new ADRs.

## INPUTS

- Proposed change description or PR diff.
- Relevant existing ADRs in `docs/adr/`.
- Target package boundary definition.

## PROCESS

1. Check alignment with Resumora North Star: "Work Recovered > Rows Stored".
2. Verify package independence: `@resumora/core` must not acquire external dependencies.
3. Review storage abstraction: ensure persistence operations strictly use `StorageAdapter`.
4. Validate tenant namespace isolation.

## CHECKS

- [ ] Does this maintain the `Persistence != Authorization` invariant?
- [ ] Does this create circular dependencies across monorepo packages?
- [ ] Is an ADR required for this architectural modification?

## OUTPUTS

- Architecture Review Assessment (Approved / Changes Requested).
- Draft ADR if a foundational decision was reached.

## FAILURE CONDITIONS

- Direct coupling of browser-specific APIs into `@resumora/core`.
- Leakage of sensitive tokens or un-namespaced storage keys.
