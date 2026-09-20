// In-Memory Storage Adapter for Resumora
export class MemoryStorageAdapter {
  constructor(options = {}) {
    this.name = 'storage-memory';
    this.store = new Map();
    this.options = {
      simulatedLatencyMs: 0,
      faultOnWrite: false,
      quotaLimitBytes: Infinity,
      ...options,
    };
    this.currentSizeBytes = 0;
  }

  async _delay() {
    if (this.options.simulatedLatencyMs > 0) {
      await new Promise((r) => setTimeout(r, this.options.simulatedLatencyMs));
    }
  }

  async get(key) {
    await this._delay();
    const val = this.store.get(key);
    if (!val) return null;
    // Return copy to preserve immutability
    return new Uint8Array(val);
  }

  async set(key, value) {
    await this._delay();
    if (this.options.faultOnWrite) {
      throw new Error('Simulated storage write fault: disk I/O failure');
    }
    const valBytes = new Uint8Array(value);
    if (this.currentSizeBytes + valBytes.byteLength > this.options.quotaLimitBytes) {
      throw new Error('Simulated QuotaExceededError: storage capacity reached');
    }

    const existing = this.store.get(key);
    if (existing) {
      this.currentSizeBytes -= existing.byteLength;
    }
    this.store.set(key, valBytes);
    this.currentSizeBytes += valBytes.byteLength;
  }

  async delete(key) {
    await this._delay();
    const existing = this.store.get(key);
    if (existing) {
      this.currentSizeBytes -= existing.byteLength;
      this.store.delete(key);
    }
  }

  async listKeys(prefix = '') {
    await this._delay();
    const matching = [];
    for (const key of this.store.keys()) {
      if (!prefix || key.startsWith(prefix)) {
        matching.push(key);
      }
    }
    return matching;
  }

  async batch(operations) {
    await this._delay();
    for (const op of operations) {
      if (op.type === 'set') {
        await this.set(op.key, op.value);
      } else if (op.type === 'delete') {
        await this.delete(op.key);
      }
    }
  }

  async clear(prefix = '') {
    await this._delay();
    if (!prefix) {
      this.store.clear();
      this.currentSizeBytes = 0;
      return;
    }
    for (const key of Array.from(this.store.keys())) {
      if (key.startsWith(prefix)) {
        const existing = this.store.get(key);
        if (existing) {
          this.currentSizeBytes -= existing.byteLength;
        }
        this.store.delete(key);
      }
    }
  }
}
