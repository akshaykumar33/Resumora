// ContinuityRuntime: Coordinates Workspaces and Pluggable Storage
import { Workspace } from './workspace.js';
import { buildPrefix } from './storage.js';
import type { IdentityContext, RuntimeConfig, StorageAdapter, WorkspacePolicy } from './types.js';

export class ContinuityRuntime {
  readonly storage: StorageAdapter;
  readonly policy: Partial<WorkspacePolicy>;
  readonly workspaces = new Map<string, Workspace>();

  constructor(config: RuntimeConfig) {
    // Checked at runtime too: JavaScript callers bypass the type system.
    if (!config || !config.storage) {
      throw new Error('ContinuityRuntime requires a valid StorageAdapter instance.');
    }
    this.storage = config.storage;
    this.policy = config.policy || {};
  }

  async openWorkspace(context: IdentityContext): Promise<Workspace> {
    const key = buildPrefix(context);
    let workspace = this.workspaces.get(key);
    if (!workspace) {
      workspace = new Workspace(context, this.storage, this.policy);
      await workspace.initialize();
      this.workspaces.set(key, workspace);
    }
    return workspace;
  }

  getWorkspace(context: IdentityContext): Workspace | null {
    const key = buildPrefix(context);
    return this.workspaces.get(key) || null;
  }

  async closeWorkspace(context: IdentityContext): Promise<void> {
    const key = buildPrefix(context);
    this.workspaces.delete(key);
  }

  async purgeAll(): Promise<void> {
    this.workspaces.clear();
    await this.storage.clear();
  }
}
