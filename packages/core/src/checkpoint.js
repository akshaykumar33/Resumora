// Checkpoint Manager implementation
import { buildStorageKey, serializePayload, deserializePayload, computeChecksum } from './storage.js';
import { ChecksumMismatchError } from './types.js';

export class CheckpointManager {
  constructor(context, storage) {
    this.context = context;
    this.storage = storage;
  }

  async save(sequence, state, metadata = {}) {
    const checksum = computeChecksum(state);
    const checkpoint = {
      id: `chk_${Date.now()}_${sequence}`,
      workspaceId: this.context.workspaceId,
      sequence,
      state,
      metadata: {
        ...metadata,
        clientTimestamp: Date.now()
      },
      checksum
    };

    const latestKey = buildStorageKey(this.context, 'checkpoint', 'latest');
    await this.storage.set(latestKey, serializePayload(checkpoint));
    return checkpoint;
  }

  async getLatest() {
    const latestKey = buildStorageKey(this.context, 'checkpoint', 'latest');
    const bytes = await this.storage.get(latestKey);
    if (!bytes) return null;

    const checkpoint = deserializePayload(bytes);
    const expectedChecksum = computeChecksum(checkpoint.state);
    if (checkpoint.checksum !== expectedChecksum) {
      throw new ChecksumMismatchError(checkpoint.id);
    }

    return checkpoint;
  }
}
