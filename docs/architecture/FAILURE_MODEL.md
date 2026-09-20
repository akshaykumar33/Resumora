# Failure Model & Resilience Invariants

| Failure Mode                    | Impact Without Resumora      | Resumora Resilience Guarantee                                                   |
| :------------------------------ | :--------------------------- | :------------------------------------------------------------------------------ |
| **Tab Crash / Out of Memory**   | Entire form state lost       | Restores latest checkpoint + uncommitted intent journal                         |
| **Accidental Page Refresh**     | User starts over from step 1 | Restores exact step, input focus, and unsaved draft                             |
| **Authentication Token Expiry** | 401 error erases filled data | State locks securely; unlocks & re-submits upon re-auth                         |
| **Sudden Network Drop**         | Save fails, input lost       | Intents continue appending to local store; queues sync                          |
| **Storage Quota Exceeded**      | Uncaught DOMException        | Gracefully falls back to in-memory cache and triggers storage warning           |
| **Corrupted Local Record**      | Application crash on parse   | Checksum validation detects corrupt state, falls back to prior valid checkpoint |
