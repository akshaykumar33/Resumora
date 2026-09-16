---
name: performance-review
description: Procedures for measuring latency budgets, memory overhead, and serialization efficiency.
---

# Performance Review Skill

## WHEN TO USE
Use when auditing performance, optimizing serialization, or reducing bundle size.

## INPUTS
- Benchmark scripts and bundle analyzer outputs.

## PROCESS
1. Benchmark intent append rate (target > 5,000 ops/sec).
2. Profile heap allocation during sustained continuous editing.
3. Verify core bundle size remains < 15KB gzipped.

## CHECKS
- [ ] No memory leaks in listener subscriptions.
- [ ] Checkpoint serialization does not block main thread (> 16ms).

## OUTPUTS
- Performance benchmark report.

## FAILURE CONDITIONS
- Main-thread jank during background snapshotting.
