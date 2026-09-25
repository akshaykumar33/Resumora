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
  readonly policy: WorkspacePolicy;
  uncheckpointedIntents: number;

  // Private (#) rather than TypeScript-private: these must be unreachable from JavaScript too.
  // The journal, checkpoint store and adapter read storage without checking the lock, so
  // exposing any of them, or letting callers assign the state, would bypass lock and purge.
  #state: WorkspaceState = 'active';
  readonly #storage: StorageAdapter;
  readonly #intents: IntentJournal;
  readonly #checkpoints: CheckpointManager;

  constructor(
    context: IdentityContext,
    storage: StorageAdapter,
    policy: Partial<WorkspacePolicy> = {},
  ) {
    this.context = context;
    this.#storage = storage;
    this.policy = {
      maxAgeMs: 7 * 24 * 60 * 60 * 1000,
      autoCheckpointFrequency: 10,
      onLogout: 'lock',
      ...policy,
    };
    this.#intents = new IntentJournal(context, storage);
    this.#checkpoints = new CheckpointManager(context, storage);
    this.uncheckpointedIntents = 0;
  }

  /** Read-only: only lock(), unlock() and purge() change it. */
  get state(): WorkspaceState {
    return this.#state;
  }

  async initialize(): Promise<void> {
    await this.#intents.initialize();
  }

  assertAccessible(): void {
    if (this.#state === 'locked') {
      throw new WorkspaceLockedError(this.context.workspaceId);
    }
    if (this.#state === 'purged') {
      throw new WorkspacePurgedError(this.context.workspaceId);
    }
  }

  async recordIntent(action: string, payload: unknown): Promise<Intent> {
    this.assertAccessible();
    const intent = await this.#intents.append(action, payload);
    this.uncheckpointedIntents++;
    return intent;
  }

  async saveCheckpoint<TState>(
    state: TState,
    metadata: Readonly<Record<string, unknown>> = {},
  ): Promise<Checkpoint<TState>> {
    this.assertAccessible();
    const currentSeq = this.#intents.currentSequence;
    const checkpoint = await this.#checkpoints.save(currentSeq, state, metadata);
    this.uncheckpointedIntents = 0;
    // Safely prune intents captured by this checkpoint
    await this.#intents.pruneBefore(currentSeq);
    return checkpoint;
  }

  async restoreLatestCheckpoint(): Promise<RestoreResult | null> {
    this.assertAccessible();
    const latest = await this.#checkpoints.getLatest();

    // Fetch any intents that occurred AFTER this checkpoint. With no checkpoint yet, every
    // recorded intent is unapplied: the caller replays them from its initial state.
    const unappliedIntents = await this.#intents.getPendingIntents(latest ? latest.sequence : 0);
    if (!latest && unappliedIntents.length === 0) return null;

    return {
      checkpoint: latest,
      unappliedIntents,
      state: latest ? latest.state : null,
    };
  }

  lock(): void {
    // Purge is terminal: locking must not turn a purged workspace back into an unlockable one.
    if (this.#state === 'purged') return;
    this.#state = 'locked';
  }

  unlock(credential?: UnlockCredential | null): boolean {
    if (this.#state === 'purged') {
      throw new WorkspacePurgedError(this.context.workspaceId);
    }
    if (credential && credential.isValid) {
      this.#state = 'active';
      return true;
    }
    return false;
  }

  async purge(): Promise<void> {
    this.#state = 'purged';
    const prefix = buildPrefix(this.context);
    await this.#storage.clear(prefix);
  }
}
