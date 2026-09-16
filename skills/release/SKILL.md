---
name: release
description: Runbook for semantic versioning, changeset creation, and package publication.
---

# Release Skill

## WHEN TO USE
Use when preparing a release across monorepo packages.

## INPUTS
- Git diff since last release tag.
- Changesets configuration.

## PROCESS
1. Generate changeset describing patch, minor, or major updates.
2. Run monorepo build, lint, and test validation.
3. Bump versions and generate `CHANGELOG.md`.

## CHECKS
- [ ] All packages build cleanly.
- [ ] No breaking changes in minor/patch releases.

## OUTPUTS
- Version bump commit and GitHub release draft.

## FAILURE CONDITIONS
- Publishing broken or uncompiled TypeScript definitions.
