// Workspace Class: Identity Boundary & State Machine
import { IntentJournal } from './intent.js';
import { CheckpointManager } from './checkpoint.js';
import { buildPrefix } from './storage.js';
import { WorkspaceLockedError, WorkspacePurgedError } from './types.js';
import type {
  Checkpoint,
  IdentityContext,
  Intent,
  RestoreResult,
  StorageAdapter,
  UnlockCredential,
  WorkspacePolicy,
  WorkspaceState,
} from './types.js';

export class Workspace {
  readonly context: IdentityContext;
  readonly storage: StorageAdapter;
  readonly policy: WorkspacePolicy;
  state: WorkspaceState;
  readonly intents: IntentJournal;
  readonly checkpoints: CheckpointManager;
  uncheckpointedIntents: number;

  constructor(
    context: IdentityContext,
    storage: StorageAdapter,
    policy: Partial<WorkspacePolicy> = {},
  ) {
    this.context = context;
    this.storage = storage;
    this.policy = {
      maxAgeMs: 7 * 24 * 60 * 60 * 1000,
      autoCheckpointFrequency: 10,
      onLogout: 'lock',
      ...policy,
    };
    this.state = 'active';
    this.intents = new IntentJournal(context, storage);
    this.checkpoints = new CheckpointManager(context, storage);
    this.uncheckpointedIntents = 0;
  }

  async initialize(): Promise<void> {
    await this.intents.initialize();
  }

  assertAccessible(): void {
    if (this.state === 'locked') {
      throw new WorkspaceLockedError(this.context.workspaceId);
    }
    if (this.state === 'purged') {
      throw new WorkspacePurgedError(this.context.workspaceId);
    }
  }

  async recordIntent(action: string, payload: unknown): Promise<Intent> {
    this.assertAccessible();
    const intent = await this.intents.append(action, payload);
    this.uncheckpointedIntents++;
    return intent;
  }

  async saveCheckpoint<TState>(
    state: TState,
    metadata: Readonly<Record<string, unknown>> = {},
  ): Promise<Checkpoint<TState>> {
    this.assertAccessible();
    const currentSeq = this.intents.currentSequence;
    const checkpoint = await this.checkpoints.save(currentSeq, state, metadata);
    this.uncheckpointedIntents = 0;
    // Safely prune intents captured by this checkpoint
    await this.intents.pruneBefore(currentSeq);
    return checkpoint;
  }

  async restoreLatestCheckpoint(): Promise<RestoreResult | null> {
    this.assertAccessible();
    const latest = await this.checkpoints.getLatest();

    // Fetch any intents that occurred AFTER this checkpoint. With no checkpoint yet, every
    // recorded intent is unapplied: the caller replays them from its initial state.
    const unappliedIntents = await this.intents.getPendingIntents(latest ? latest.sequence : 0);
    if (!latest && unappliedIntents.length === 0) return null;

    return {
      checkpoint: latest,
      unappliedIntents,
      state: latest ? latest.state : null,
    };
  }

  lock(): void {
    this.state = 'locked';
  }

  unlock(credential?: UnlockCredential | null): boolean {
    if (this.state === 'purged') {
      throw new WorkspacePurgedError(this.context.workspaceId);
    }
    if (credential && credential.isValid) {
      this.state = 'active';
      return true;
    }
    return false;
  }

  async purge(): Promise<void> {
    this.state = 'purged';
    const prefix = buildPrefix(this.context);
    await this.storage.clear(prefix);
  }
}
