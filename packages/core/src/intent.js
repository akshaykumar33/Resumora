// Intent Journal implementation
import { buildStorageKey, buildPrefix, serializePayload, deserializePayload } from './storage.js';

export class IntentJournal {
  constructor(context, storage) {
    this.context = context;
    this.storage = storage;
    this.currentSequence = 0;
  }

  async initialize() {
    const prefix = buildPrefix(this.context, 'intent');
    const keys = await this.storage.listKeys(prefix);
    if (keys.length > 0) {
      // Find highest sequence
      for (const key of keys) {
        const parts = key.split('::');
        const seq = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(seq) && seq > this.currentSequence) {
          this.currentSequence = seq;
        }
      }
    }
  }

  async append(action, payload) {
    this.currentSequence += 1;
    const seqStr = String(this.currentSequence).padStart(8, '0');
    const intent = {
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

  async getPendingIntents(sinceSequence = 0) {
    const prefix = buildPrefix(this.context, 'intent');
    const keys = await this.storage.listKeys(prefix);
    keys.sort();

    const intents = [];
    for (const key of keys) {
      const parts = key.split('::');
      const seq = parseInt(parts[parts.length - 1], 10);
      if (seq > sinceSequence) {
        const bytes = await this.storage.get(key);
        if (bytes) {
          intents.push(deserializePayload(bytes));
        }
      }
    }
    return intents;
  }

  async pruneBefore(sequence) {
    const prefix = buildPrefix(this.context, 'intent');
    const keys = await this.storage.listKeys(prefix);
    for (const key of keys) {
      const parts = key.split('::');
      const seq = parseInt(parts[parts.length - 1], 10);
      if (seq <= sequence) {
        await this.storage.delete(key);
      }
    }
  }
}
