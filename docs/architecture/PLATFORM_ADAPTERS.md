# Platform Adapters & Target Environments

1. **Browser / Web**:
   - Primary persistence: IndexedDB (Dexie / native idb)
   - Multi-tab coordination: BroadcastChannel + Web Locks API (`navigator.locks`)
   - Network sensing: Network Information API + active health-check probes
2. **React / Next.js**:
   - Hooks: `useContinuity`, `useWorkflowRecovery`, `useCheckpoint`, `useIntent`
   - SSR-safe hydration guards
3. **Testing / Node**:
   - Pure in-memory adapter with zero external dependencies and deterministic time stepping.
4. **Mobile (Future Phase 7)**:
   - React Native + SQLite storage adapter.
