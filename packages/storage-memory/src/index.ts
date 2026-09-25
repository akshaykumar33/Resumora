// In-Memory Storage Adapter for Resumora
import type { StorageAdapter, StorageOperation } from '@resumora/core';

export interface MemoryStorageOptions {
  /** Delay every operation by this many milliseconds, to simulate slow storage. */
  readonly simulatedLatencyMs?: number;
  /** Make every write throw, to simulate disk I/O failure. */
  readonly faultOnWrite?: boolean;
  /** Reject writes past this many stored bytes, to simulate a full quota. */
  readonly quotaLimitBytes?: number;
}

export class MemoryStorageAdapter implements StorageAdapter {
  readonly name = 'storage-memory';
  readonly options: Required<MemoryStorageOptions>;
  readonly #store = new Map<string, Uint8Array>();
  #currentSizeBytes = 0;

  constructor(options: MemoryStorageOptions = {}) {
    this.options = {
      simulatedLatencyMs: 0,
      faultOnWrite: false,
      quotaLimitBytes: Infinity,
      ...options,
    };
  }

  /** Bytes currently stored, as counted against `quotaLimitBytes`. */
  get currentSizeBytes(): number {
    return this.#currentSizeBytes;
  }

  async #delay(): Promise<void> {
    if (this.options.simulatedLatencyMs > 0) {
      await new Promise<void>((r) => setTimeout(r, this.options.simulatedLatencyMs));
    }
  }

  async get(key: string): Promise<Uint8Array | null> {
    await this.#delay();
    const val = this.#store.get(key);
    if (!val) return null;
    // Return copy to preserve immutability
    return new Uint8Array(val);
  }

  async set(key: string, value: Uint8Array): Promise<void> {
    await this.#delay();
    if (this.options.faultOnWrite) {
      throw new Error('Simulated storage write fault: disk I/O failure');
    }
    const valBytes = new Uint8Array(value);
    const existing = this.#store.get(key);
    // An overwrite replaces the existing bytes, so only the difference counts against the quota.
    const nextSize = this.#currentSizeBytes - (existing?.byteLength ?? 0) + valBytes.byteLength;
    if (nextSize > this.options.quotaLimitBytes) {
      throw new Error('Simulated QuotaExceededError: storage capacity reached');
    }
    this.#store.set(key, valBytes);
    this.#currentSizeBytes = nextSize;
  }

  async delete(key: string): Promise<void> {
    await this.#delay();
    const existing = this.#store.get(key);
    if (existing) {
      this.#currentSizeBytes -= existing.byteLength;
      this.#store.delete(key);
    }
  }

  async listKeys(prefix = ''): Promise<string[]> {
    await this.#delay();
    const matching: string[] = [];
    for (const key of this.#store.keys()) {
      if (!prefix || key.startsWith(prefix)) {
        matching.push(key);
      }
    }
    return matching;
  }

  async batch(operations: readonly StorageOperation[]): Promise<void> {
    await this.#delay();
    for (const op of operations) {
      if (op.type === 'set') {
        await this.set(op.key, op.value);
      } else if (op.type === 'delete') {
        await this.delete(op.key);
      }
    }
  }

  async clear(prefix = ''): Promise<void> {
    await this.#delay();
    if (!prefix) {
      this.#store.clear();
      this.#currentSizeBytes = 0;
      return;
    }
    for (const [key, value] of Array.from(this.#store)) {
      if (key.startsWith(prefix)) {
        this.#currentSizeBytes -= value.byteLength;
        this.#store.delete(key);
      }
    }
  }
}
