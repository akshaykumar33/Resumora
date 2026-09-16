// Workspace Class: Identity Boundary & State Machine
import { IntentJournal } from './intent.js';
import { CheckpointManager } from './checkpoint.js';
import { buildPrefix } from './storage.js';
import { WorkspaceLockedError, WorkspacePurgedError } from './types.js';

export class Workspace {
  constructor(context, storage, policy = {}) {
    this.context = context;
    this.storage = storage;
    this.policy = {
      maxAgeMs: 7 * 24 * 60 * 60 * 1000,
      autoCheckpointFrequency: 10,
      onLogout: 'lock',
      ...policy
    };
    this.state = 'active'; // 'active' | 'locked' | 'purged'
    this.intents = new IntentJournal(context, storage);
    this.checkpoints = new CheckpointManager(context, storage);
    this.uncheckpointedIntents = 0;
  }

  async initialize() {
    await this.intents.initialize();
  }

  assertAccessible() {
    if (this.state === 'locked') {
      throw new WorkspaceLockedError(this.context.workspaceId);
    }
    if (this.state === 'purged') {
      throw new WorkspacePurgedError(this.context.workspaceId);
    }
  }

  async recordIntent(action, payload) {
    this.assertAccessible();
    const intent = await this.intents.append(action, payload);
    this.uncheckpointedIntents++;
    return intent;
  }

  async saveCheckpoint(state, metadata = {}) {
    this.assertAccessible();
    const currentSeq = this.intents.currentSequence;
    const checkpoint = await this.checkpoints.save(currentSeq, state, metadata);
    this.uncheckpointedIntents = 0;
    // Safely prune intents captured by this checkpoint
    await this.intents.pruneBefore(currentSeq);
    return checkpoint;
  }

  async restoreLatestCheckpoint() {
    this.assertAccessible();
    const latest = await this.checkpoints.getLatest();
    if (!latest) return null;

    // Fetch any intents that occurred AFTER this checkpoint
    const unappliedIntents = await this.intents.getPendingIntents(latest.sequence);

    return {
      checkpoint: latest,
      unappliedIntents,
      state: latest.state
    };
  }

  lock() {
    this.state = 'locked';
  }

  unlock(credential) {
    if (this.state === 'purged') {
      throw new WorkspacePurgedError(this.context.workspaceId);
    }
    if (credential && credential.isValid) {
      this.state = 'active';
      return true;
    }
    return false;
  }

  async purge() {
    this.state = 'purged';
    const prefix = buildPrefix(this.context);
    await this.storage.clear(prefix);
  }
}
