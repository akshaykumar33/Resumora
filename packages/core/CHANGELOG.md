# @resumora/core

## 0.2.0

### Minor Changes

- f929be5: First public release. The continuity runtime records a workspace's intents and checkpoints and restores them after a reload, a tab crash or a browser crash. The lock cycle never treats stored data as authorization, and storage keys are validated per tenant. It ships with an in-memory adapter for tests and a persistent IndexedDB adapter for browsers.
