# Resumora

> **Application Continuity & Workflow Recovery Runtime**  
> _"Your user should never lose meaningful work because the application environment became unreliable."_

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Status](https://img.shields.io/badge/Status-Phase_1_Core_Starter-green.svg)](STATUS.md)

---

## What is Resumora?

Modern web applications demand that users execute complex, high-stakes tasks: multi-stage applications, compliance forms, rich markdown authoring, insurance claims, and multi-tenant configurations. Yet browsers are fundamentally transient environments prone to Wi-Fi drops, tab discarding, memory pressure terminations, token expiries, accidental refreshes, and unannounced deployments.

Generic caching solutions (IndexedDB wrappers, TanStack Query persistence, local-first replicated databases) focus exclusively on **data storage** or **row caching**. They do not capture **workflow continuity**, **user intent**, or **authorization-gated state restoration**.

**Resumora** is a purpose-built runtime that bridges client volatility and server authority. It guarantees zero lost work by treating user actions as recoverable intents and bounded checkpoints governed by strict tenant security invariants.

## Architecture

```
Application UI (React / Hooks / Web)
       |
       v
Resumora Core Runtime (@resumora/core)
  ├── Workspace Manager (Active, Locked, Purged)
  ├── Intent Journal (Append-only monotonic action log)
  ├── Checkpoint Engine (Periodic bounded snapshots)
  └── Security Guard (Persistence != Authorization)
       |
       v
Storage Adapter Interface (Pluggable)
  ├── Memory Adapter (@resumora/storage-memory)
  ├── IndexedDB Adapter (@resumora/storage-indexeddb)
  └── SQLite Adapter (@resumora/storage-sqlite)
```

## Monorepo Packages

- [`@resumora/core`](./packages/core): Platform-independent continuity runtime, workspace management, intent journal, checkpoint manager, policy engine.
- [`@resumora/protocol`](./packages/protocol): Strongly-typed schemas, envelope specs, and serialization contracts.
- [`@resumora/storage-memory`](./packages/storage-memory): Reference in-memory storage adapter with fault injection for sub-second testing.
- [`@resumora/storage-indexeddb`](./packages/storage-indexeddb): Persistent browser IndexedDB storage adapter.
- [`@resumora/web`](./packages/web): Browser utilities, Web Locks multi-tab leader election, and BroadcastChannel event bus.
- [`@resumora/react`](./packages/react): React hooks (`useContinuity`, `useWorkflowRecovery`, `useCheckpoint`).
- [`@resumora/devtools`](./packages/devtools): Developer tools and timeline inspector.

## Quick Start

```typescript
import { ContinuityRuntime } from '@resumora/core';
import { MemoryStorageAdapter } from '@resumora/storage-memory';

// 1. Initialize runtime with pluggable storage
const storage = new MemoryStorageAdapter();
const runtime = new ContinuityRuntime({ storage });

// 2. Open an authenticated workspace
const workspace = await runtime.openWorkspace({
  tenantId: 'tenant_enterprise',
  userId: 'user_42',
  workspaceId: 'workflow_mortgage_app',
});

// 3. Record fine-grained user intents
await workspace.recordIntent({
  action: 'UPDATE_FIELD',
  payload: { field: 'annualIncome', value: 125000 },
});

// 4. Create a stable milestone checkpoint
await workspace.saveCheckpoint({
  state: { annualIncome: 125000, step: 3 },
  metadata: { step: 3, totalSteps: 25, route: '/application/financials' },
});

// 5. Seamlessly restore state after unexpected restart
const restored = await workspace.restoreLatestCheckpoint();
console.log(restored.state); // { annualIncome: 125000, step: 3 }
```

## Documentation

Full architectural documentation is available in the [`docs/`](./docs) directory:

- [System Vision & Architecture](./docs/product/VISION.md)
- [Architecture Decision Records (ADRs)](./docs/adr/README.md)
- [Security Model & Invariants](./docs/security/THREAT_MODEL.md)
- [Phased Engineering Roadmap](./docs/roadmap/ROADMAP.md)

## License

Apache License 2.0. See [LICENSE](./LICENSE) for details.
