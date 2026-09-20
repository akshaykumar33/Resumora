# @resumora/core

Core, platform-independent runtime engine for Resumora.

Guarantees application continuity and workflow recovery across network flaps, browser crashes, session expirations, and unexpected interruptions.

## Features

- **Zero Runtime Dependencies**: Ultra-lean, embeddable anywhere.
- **Strict Invariants**: `Persistence != Authorization` enforced via state machine.
- **Pluggable Storage**: Completely decoupled async storage interface.
- **Deterministic Recovery**: Checkpoint snapshots + monotonic intent journaling.
