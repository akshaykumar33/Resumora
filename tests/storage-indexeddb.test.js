import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
import { describe, test } from 'vitest';
import assert from 'node:assert/strict';

import { ContinuityRuntime } from '../packages/core/src/index.ts';
import { IndexedDbStorageAdapter } from '../packages/storage-indexeddb/src/index.ts';
import { describeStorageAdapter } from './storage-adapter-conformance.js';

// A fresh factory per adapter isolates every test's database.
describeStorageAdapter('IndexedDbStorageAdapter', () =>
  IndexedDbStorageAdapter.open({ indexedDB: new IDBFactory() }),
);

describe('IndexedDbStorageAdapter', () => {
  const bytes = (text) => new TextEncoder().encode(text);

  test('defaults to strict durability, and accepts relaxed', async () => {
    const factory = new IDBFactory();
    assert.equal((await IndexedDbStorageAdapter.open({ indexedDB: factory })).durability, 'strict');
    const relaxed = await IndexedDbStorageAdapter.open({
      indexedDB: factory,
      databaseName: 'other',
      durability: 'relaxed',
    });
    assert.equal(relaxed.durability, 'relaxed');
  });

  test('data persists across connections to the same database', async () => {
    const factory = new IDBFactory();
    const first = await IndexedDbStorageAdapter.open({ indexedDB: factory });
    await first.set('k', bytes('kept'));
    first.close();
    const second = await IndexedDbStorageAdapter.open({ indexedDB: factory });
    assert.equal(new TextDecoder().decode(await second.get('k')), 'kept');
  });

  test('a batch with an invalid operation commits nothing', async () => {
    const storage = await IndexedDbStorageAdapter.open({ indexedDB: new IDBFactory() });
    await assert.rejects(
      storage.batch([
        { type: 'set', key: 'a', value: bytes('1') },
        { type: 'set', key: undefined, value: bytes('2') }, // not a valid IndexedDB key
      ]),
    );
    assert.equal(await storage.get('a'), null);
  });

  test('prefix ranges do not leak into neighbouring prefixes', async () => {
    const storage = await IndexedDbStorageAdapter.open({ indexedDB: new IDBFactory() });
    for (const key of ['resumora::t::u::w::a', 'resumora::t::u::w2::a', 'resumora::t::u::w']) {
      await storage.set(key, bytes(key));
    }
    assert.deepEqual(await storage.listKeys('resumora::t::u::w::'), ['resumora::t::u::w::a']);
    await storage.clear('resumora::t::u::w::');
    assert.deepEqual((await storage.listKeys()).sort(), [
      'resumora::t::u::w',
      'resumora::t::u::w2::a',
    ]);
  });

  test('rejects clearly where IndexedDB is unavailable', async () => {
    const original = globalThis.indexedDB;
    try {
      globalThis.indexedDB = undefined;
      await assert.rejects(IndexedDbStorageAdapter.open(), /IndexedDB is not available/);
    } finally {
      globalThis.indexedDB = original;
    }
  });

  test('the runtime recovers intents and checkpoints across a reopened database', async () => {
    const factory = new IDBFactory();
    const identity = { tenantId: 'acme', userId: 'maya', workspaceId: 'inspection-1' };

    const before = await IndexedDbStorageAdapter.open({ indexedDB: factory });
    const ws = await new ContinuityRuntime({ storage: before }).openWorkspace(identity);
    await ws.recordIntent('SET_FIELD', { field: 'address', value: '14 Harbour Quay' });
    await ws.saveCheckpoint({ address: '14 Harbour Quay' });
    await ws.recordIntent('SET_FIELD', { field: 'floors', value: 3 });
    before.close();

    // A new connection and a new runtime: nothing survives in memory.
    const after = await IndexedDbStorageAdapter.open({ indexedDB: factory });
    const reopened = await new ContinuityRuntime({ storage: after }).openWorkspace(identity);
    const recovered = await reopened.restoreLatestCheckpoint();
    assert.deepEqual(recovered.state, { address: '14 Harbour Quay' });
    assert.deepEqual(
      recovered.unappliedIntents.map((i) => i.payload),
      [{ field: 'floors', value: 3 }],
    );
    assert.equal((await reopened.recordIntent('X', {})).sequence, 3);
  });
});
