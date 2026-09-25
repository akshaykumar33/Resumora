// IndexedDB Storage Adapter for Resumora (native API, no dependencies: see ADR-007)
import type { StorageAdapter, StorageOperation } from '@resumora/core';

const STORE = 'records';

export type IndexedDbDurability = 'strict' | 'relaxed' | 'default';

export interface IndexedDbStorageOptions {
  /** Database name. Use one per application; tenants are separated by key prefixes. */
  readonly databaseName?: string;
  /**
   * Transaction durability for writes. `strict` (the default) waits for the data to reach
   * durable storage, so a committed intent survives an OS crash as well as a browser crash.
   */
  readonly durability?: IndexedDbDurability;
  /** The IndexedDB factory to use. Defaults to the global `indexedDB`; inject one in tests. */
  readonly indexedDB?: IDBFactory;
}

// Resolves when the transaction commits: only then is the write durable (SPIKE-001).
function completion(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
  });
}

// The highest UTF-16 code unit. Spelled out rather than as an escape, so no tool rewrites it
// into an invisible character.
const HIGHEST_CODE_UNIT = String.fromCharCode(0xffff);

function prefixRange(prefix: string): IDBKeyRange {
  // Every string starting with `prefix` sorts between the prefix and prefix + U+FFFF.
  return IDBKeyRange.bound(prefix, prefix + HIGHEST_CODE_UNIT);
}

export class IndexedDbStorageAdapter implements StorageAdapter {
  readonly name = 'storage-indexeddb';
  readonly durability: IndexedDbDurability;
  readonly #db: IDBDatabase;

  private constructor(db: IDBDatabase, durability: IndexedDbDurability) {
    this.#db = db;
    this.durability = durability;
    // Another tab upgrading the schema must not be blocked by this connection.
    db.onversionchange = () => db.close();
  }

  /** Opens (creating on first use) the database and returns a ready adapter. */
  static open(options: IndexedDbStorageOptions = {}): Promise<IndexedDbStorageAdapter> {
    const factory = options.indexedDB ?? globalThis.indexedDB;
    if (!factory) {
      return Promise.reject(new Error('IndexedDB is not available in this environment'));
    }
    const durability = options.durability ?? 'strict';
    return new Promise((resolve, reject) => {
      const request = factory.open(options.databaseName ?? 'resumora', 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) {
          request.result.createObjectStore(STORE);
        }
      };
      request.onsuccess = () => resolve(new IndexedDbStorageAdapter(request.result, durability));
      request.onerror = () => reject(request.error ?? new Error('Could not open IndexedDB'));
      request.onblocked = () =>
        reject(new Error('Opening IndexedDB is blocked by another open connection'));
    });
  }

  /** Closes the connection. The adapter can't be used afterwards. */
  close(): void {
    this.#db.close();
  }

  async get(key: string): Promise<Uint8Array | null> {
    const tx = this.#db.transaction(STORE, 'readonly');
    const request = tx.objectStore(STORE).get(key) as IDBRequest<Uint8Array | undefined>;
    await completion(tx);
    return request.result ? new Uint8Array(request.result) : null;
  }

  set(key: string, value: Uint8Array): Promise<void> {
    return this.#write((store) => store.put(new Uint8Array(value), key));
  }

  delete(key: string): Promise<void> {
    return this.#write((store) => store.delete(key));
  }

  async listKeys(prefix = ''): Promise<string[]> {
    const tx = this.#db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const request = prefix ? store.getAllKeys(prefixRange(prefix)) : store.getAllKeys();
    await completion(tx);
    return request.result.map(String);
  }

  /** Applies every operation in one transaction: all of them commit, or none do. */
  batch(operations: readonly StorageOperation[]): Promise<void> {
    return this.#write((store) => {
      for (const op of operations) {
        if (op.type === 'set') store.put(new Uint8Array(op.value), op.key);
        else store.delete(op.key);
      }
    });
  }

  clear(prefix = ''): Promise<void> {
    return this.#write((store) => (prefix ? store.delete(prefixRange(prefix)) : store.clear()));
  }

  async #write(run: (store: IDBObjectStore) => void): Promise<void> {
    const tx = this.#db.transaction(STORE, 'readwrite', { durability: this.durability });
    const committed = completion(tx);
    try {
      run(tx.objectStore(STORE));
    } catch (error) {
      // A synchronous failure (for example an invalid key) must roll back the whole write.
      committed.catch(() => undefined);
      tx.abort();
      throw error;
    }
    await committed;
  }
}
