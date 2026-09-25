import { describe, test } from 'vitest';
import assert from 'node:assert/strict';

import { MemoryStorageAdapter } from '../packages/storage-memory/src/index.ts';
import { describeStorageAdapter } from './storage-adapter-conformance.js';

describeStorageAdapter('MemoryStorageAdapter', () => new MemoryStorageAdapter());

describe('MemoryStorageAdapter fault injection', () => {
  const bytes = (n) => new Uint8Array(n);

  test('faultOnWrite makes every write throw and stores nothing', async () => {
    const storage = new MemoryStorageAdapter({ faultOnWrite: true });
    await assert.rejects(storage.set('k', bytes(1)), /Simulated storage write fault/);
    assert.equal(await storage.get('k'), null);
  });

  test('quotaLimitBytes rejects a write that would exceed the quota', async () => {
    const storage = new MemoryStorageAdapter({ quotaLimitBytes: 10 });
    await storage.set('a', bytes(6));
    await assert.rejects(storage.set('b', bytes(5)), /QuotaExceededError/);
    assert.equal(storage.currentSizeBytes, 6);
  });

  test('overwriting a key counts only the size difference against the quota', async () => {
    // Previously the old and new bytes were both counted, so this overwrite failed wrongly.
    const storage = new MemoryStorageAdapter({ quotaLimitBytes: 10 });
    await storage.set('a', bytes(8));
    await storage.set('a', bytes(9));
    assert.equal(storage.currentSizeBytes, 9);
  });

  test('delete and clear release quota', async () => {
    const storage = new MemoryStorageAdapter({ quotaLimitBytes: 10 });
    await storage.set('a::1', bytes(4));
    await storage.set('b::1', bytes(4));
    await storage.delete('b::1');
    await storage.clear('a::');
    assert.equal(storage.currentSizeBytes, 0);
  });

  test('simulatedLatencyMs delays operations', async () => {
    const storage = new MemoryStorageAdapter({ simulatedLatencyMs: 30 });
    const started = Date.now();
    await storage.get('k');
    assert.ok(Date.now() - started >= 25);
  });
});
