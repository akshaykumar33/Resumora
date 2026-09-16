# Core Runtime Architecture

## 1. Runtime State Machine
The core runtime orchestrates workspaces across three distinct states:

```
[ UNINITIALIZED ]
       |
       | initialize(config)
       v
   [ ACTIVE ] <-----------------+
     |      |                   |
     |      | lock() / logout() | unlock(authCredential)
     |      v                   |
     |   [ LOCKED ] ------------+
     |      |
     |      | revoke() / purge()
     v      v
   [ PURGED ]
```

- **ACTIVE**: Workspace is authorized, permits intent append, checkpoint writes, and reads.
- **LOCKED**: Device is offline or user session suspended. Data remains persisted in encrypted/namespaced local store but is inaccessible to UI.
- **PURGED**: Workspace credentials revoked or user explicitly cleared data. All stored records, journals, and checkpoints are irrecoverably deleted.
