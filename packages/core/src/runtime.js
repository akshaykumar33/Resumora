// ContinuityRuntime: Coordinates Workspaces and Pluggable Storage
import { Workspace } from './workspace.js';
import { buildPrefix } from './storage.js';

export class ContinuityRuntime {
  constructor(config) {
    if (!config || !config.storage) {
      throw new Error('ContinuityRuntime requires a valid StorageAdapter instance.');
    }
    this.storage = config.storage;
    this.policy = config.policy || {};
    this.workspaces = new Map();
  }

  async openWorkspace(context) {
    const key = buildPrefix(context);
    let workspace = this.workspaces.get(key);
    if (!workspace) {
      workspace = new Workspace(context, this.storage, this.policy);
      await workspace.initialize();
      this.workspaces.set(key, workspace);
    }
    return workspace;
  }

  getWorkspace(context) {
    const key = buildPrefix(context);
    return this.workspaces.get(key) || null;
  }

  async closeWorkspace(context) {
    const key = buildPrefix(context);
    this.workspaces.delete(key);
  }

  async purgeAll() {
    this.workspaces.clear();
    await this.storage.clear();
  }
}
