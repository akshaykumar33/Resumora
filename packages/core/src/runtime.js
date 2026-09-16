// ContinuityRuntime: Coordinates Workspaces and Pluggable Storage
import { Workspace } from './workspace.js';

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
    const key = `${context.tenantId}::${context.userId}::${context.workspaceId}`;
    let workspace = this.workspaces.get(key);
    if (!workspace) {
      workspace = new Workspace(context, this.storage, this.policy);
      await workspace.initialize();
      this.workspaces.set(key, workspace);
    }
    return workspace;
  }

  getWorkspace(context) {
    const key = `${context.tenantId}::${context.userId}::${context.workspaceId}`;
    return this.workspaces.get(key) || null;
  }

  async closeWorkspace(context) {
    const key = `${context.tenantId}::${context.userId}::${context.workspaceId}`;
    this.workspaces.delete(key);
  }

  async purgeAll() {
    this.workspaces.clear();
    await this.storage.clear();
  }
}
