# Differentiation & Value Proposition

| Dimension | Generic Cache (React Query / SWR) | Local-First DB (RxDB, PowerSync) | Resumora Runtime |
| :--- | :--- | :--- | :--- |
| **Primary Focus** | Server GET response caching | Full client-side DB replication | Workflow continuity & Intent recovery |
| **Recovery Unit** | Stale API cache | Synchronized database rows | Bounded Checkpoints + Intent journal |
| **Security Model** | In-memory / browser default | Full local table storage | Multi-tenant namespace isolation & lock lifecycle |
| **Backend Coupling** | Any REST/GraphQL API | Requires specific DB sync backend | Zero backend lock-in; works with any API |
| **Interruption Model** | Stale responses shown | Local queries work | Step position, form state, and unsaved intent restored |
| **Footprint** | Lightweight (<15kb) | Heavy (>100kb + wasm/sqlite) | Ultra-lightweight modular core (<12kb) |
