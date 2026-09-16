# ADR-004: Dual Intent Journal & Checkpoint Recovery Model

## Status: Accepted

## Context
Saving full state snapshots on every keystroke incurs severe performance and disk I/O penalties. Conversely, replaying an unbounded log of micro-actions on page load causes sluggish recovery times.

## Decision
Adopt a hybrid recovery architecture:
1. **Intents**: Micro-actions are appended as lightweight sequential log entries.
2. **Checkpoints**: Periodic or step-transition snapshots capture full domain state.
3. **Recovery**: Loads the latest checkpoint and replays only subsequent un-compacted intents.

## Consequences
- Sub-4ms intent recording overhead.
- Instantaneous recovery times upon browser restart.
