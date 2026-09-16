# Primary Use Cases

## 1. Multi-Step Enterprise Application Workflow
- 25-step enterprise workflow with conditional branching, file uploads, and calculations.
- **Interruption**: Browser tab crashes at step 19; token expires simultaneously.
- **Recovery**: User reopens app, logs in via SSO, and is greeted with: *"We restored your application from 2 minutes ago."* Inputs, attachments, and step 19 active focus are restored.

## 2. Multi-Tab Conflict & Session Switching
- User opens the same draft in two browser tabs or switches user accounts on a shared workstation.
- **Protection**: Resumora uses Web Locks / BroadcastChannel to coordinate multi-tab writes, and instantly locks the workspace when tenant/user ID changes, preventing data cross-contamination.

## 3. Flaky Network Field Inspections
- Technicians collecting inspection logs underground without reliable cellular reception.
- **Execution**: Intents and checkpoints are journaled to local IndexedDB storage. As connectivity restores, Resumora replays mutations idempotently in sequence.
