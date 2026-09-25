// Checkpoint Manager implementation
import {
  buildStorageKey,
  serializePayload,
  deserializePayload,
  computeChecksum,
} from './storage.js';
import { ChecksumMismatchError } from './types.js';
import type { Checkpoint, IdentityContext, StorageAdapter } from './types.js';

export class CheckpointManager {
  readonly context: IdentityContext;
  readonly storage: StorageAdapter;

  constructor(context: IdentityContext, storage: StorageAdapter) {
    this.context = context;
    this.storage = storage;
  }

  async save<TState>(
    sequence: number,
    state: TState,
    metadata: Readonly<Record<string, unknown>> = {},
  ): Promise<Checkpoint<TState>> {
    const checksum = computeChecksum(state);
    const checkpoint: Checkpoint<TState> = {
      id: `chk_${Date.now()}_${sequence}`,
      workspaceId: this.context.workspaceId,
      sequence,
      state,
      metadata: {
        ...metadata,
        clientTimestamp: Date.now(),
      },
      checksum,
    };

    const latestKey = buildStorageKey(this.context, 'checkpoint', 'latest');
    await this.storage.set(latestKey, serializePayload(checkpoint));
    return checkpoint;
  }

  async getLatest(): Promise<Checkpoint | null> {
    const latestKey = buildStorageKey(this.context, 'checkpoint', 'latest');
    const bytes = await this.storage.get(latestKey);
    if (!bytes) return null;

    // The shape is trusted here; the checksum below detects tampering with the state.
    const checkpoint = deserializePayload(bytes) as Checkpoint;
    const expectedChecksum = computeChecksum(checkpoint.state);
    if (checkpoint.checksum !== expectedChecksum) {
      throw new ChecksumMismatchError(checkpoint.id);
    }

    return checkpoint;
  }
}
