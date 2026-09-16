# System Architecture Overview

```
+-------------------------------------------------------------+
|                      Application UI                         |
|            (React Hooks / Vanilla JS / Components)          |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                     Resumora Core Runtime                   |
|  +---------------------+  +-------------------------------+ |
|  |  Workspace Manager  |  |      Policy Engine            | |
|  +---------------------+  +-------------------------------+ |
|  |  Intent Journal     |  |      Checkpoint Engine        | |
|  +---------------------+  +-------------------------------+ |
|  |  Recovery State Mach|  |      Security Guard           | |
|  +---------------------+  +-------------------------------+ |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
|                 Storage Adapter Interface                   |
+-------------------------------------------------------------+
         |                        |                    |
         v                        v                    v
+------------------+    +-------------------+   +-------------+
|  Memory Adapter  |    | IndexedDB Adapter |   |   SQLite    |
|  (Testing / SSR) |    |     (Browser)     |   |  (Mobile)   |
+------------------+    +-------------------+   +-------------+
```

## Core Architectural Responsibilities
1. **Core Runtime**: Manages active workspaces, registers intent handlers, and executes state transitions.
2. **Intent Journal**: Append-only log capturing fine-grained user operations with timestamps and sequence numbers.
3. **Checkpoint Engine**: Periodically snapshots full domain state, pruning superseded intent logs.
4. **Security Guard**: Enforces identity boundary checks before any read, write, or recovery action.
5. **Storage Abstraction**: Universal asynchronous key-value and range-scan persistence contract.
