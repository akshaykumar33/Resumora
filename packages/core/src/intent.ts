// Intent Journal implementation
import { buildStorageKey, buildPrefix, serializePayload, deserializePayload } from './storage.js';
import type { IdentityContext, Intent, StorageAdapter } from './types.js';

// Intent keys end in their zero-padded sequence number: `...::intent::00000042`.
function sequenceFromKey(key: string): number {
  return parseInt(key.slice(key.lastIndexOf('::') + 2), 10);
}

export class IntentJournal {
  readonly context: IdentityContext;
  readonly storage: StorageAdapter;
  currentSequence = 0;

  constructor(context: IdentityContext, storage: StorageAdapter) {
    this.context = context;
    this.storage = storage;
  }

  async initialize(): Promise<void> {
    const prefix = buildPrefix(this.context, 'intent');
    const keys = await this.storage.listKeys(prefix);
    if (keys.length > 0) {
      // Find highest sequence
      for (const key of keys) {
        const seq = sequenceFromKey(key);
        if (!isNaN(seq) && seq > this.currentSequence) {
          this.currentSequence = seq;
        }
      }
    }
  }

  async append(action: string, payload: unknown): Promise<Intent> {
    this.currentSequence += 1;
    const seqStr = String(this.currentSequence).padStart(8, '0');
    const intent: Intent = {
      id: `intent_${Date.now()}_${seqStr}`,
      sequence: this.currentSequence,
      workspaceId: this.context.workspaceId,
      action,
      payload,
      timestamp: Date.now(),
      status: 'pending',
    };

    const key = buildStorageKey(this.context, 'intent', seqStr);
    await this.storage.set(key, serializePayload(intent));
    return intent;
  }

  async getPendingIntents(sinceSequence = 0): Promise<Intent[]> {
    const prefix = buildPrefix(this.context, 'intent');
    const keys = await this.storage.listKeys(prefix);
    keys.sort();

    const intents: Intent[] = [];
    for (const key of keys) {
      const seq = sequenceFromKey(key);
      if (seq > sinceSequence) {
        const bytes = await this.storage.get(key);
        if (bytes) {
          // Stored records are trusted to match their shape until schema versioning lands.
          intents.push(deserializePayload(bytes) as Intent);
        }
      }
    }
    return intents;
  }

  async pruneBefore(sequence: number): Promise<void> {
    const prefix = buildPrefix(this.context, 'intent');
    const keys = await this.storage.listKeys(prefix);
    for (const key of keys) {
      const seq = sequenceFromKey(key);
      if (seq <= sequence) {
        await this.storage.delete(key);
      }
    }
  }
}
