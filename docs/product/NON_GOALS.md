# Non-Goals

To maintain tight architectural focus, Resumora explicitly avoids:

1. **NOT an IndexedDB Wrapper**: Resumora is not Dexie, localForage, or idb-keyval. Storage is an abstract swappable adapter.
2. **NOT a Generic Local-First Database**: Resumora is not RxDB, ElectricSQL, or CouchDB. We do not mirror your entire server database locally.
3. **NOT a Collaborative Real-Time CRDT Engine**: We do not compete with Yjs or Automerge for multi-cursor real-time Google Docs collaboration.
4. **NOT an HTTP Response Cache**: We do not replace React Query, SWR, or Apollo Client for caching server GET queries.
5. **NOT an Auto-Save Form Library**: Resumora operates at the workflow, intent, and checkpoint runtime layer—UI libraries bind to Resumora via lightweight adapters.
