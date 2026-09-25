// Shared StorageAdapter conformance suite. Every adapter runs it with a factory that returns a
// fresh, empty adapter, so behaviour the runtime relies on is identical across backends.
import { describe, test } from 'vitest';
import assert from 'node:assert/strict';

const bytes = (text) => new TextEncoder().encode(text);
const text = (value) => (value === null ? null : new TextDecoder().decode(value));

export function describeStorageAdapter(name, createAdapter) {
  describe(`StorageAdapter conformance: ${name}`, () => {
    test('get returns null for a missing key', async () => {
      const storage = await createAdapter();
      assert.equal(await storage.get('missing'), null);
    });

    test('set then get round-trips bytes, and overwrite replaces them', async () => {
      const storage = await createAdapter();
      await storage.set('k', bytes('one'));
      assert.equal(text(await storage.get('k')), 'one');
      await storage.set('k', bytes('two'));
      assert.equal(text(await storage.get('k')), 'two');
    });

    test('stored bytes are isolated from later mutation of the caller buffer and the result', async () => {
      const storage = await createAdapter();
      const input = bytes('abc');
      await storage.set('k', input);
      input[0] = 0x7a;
      const first = await storage.get('k');
      first[1] = 0x7a;
      assert.equal(text(await storage.get('k')), 'abc');
    });

    test('delete removes a key, and deleting a missing key is a no-op', async () => {
      const storage = await createAdapter();
      await storage.set('k', bytes('v'));
      await storage.delete('k');
      await storage.delete('never-existed');
      assert.equal(await storage.get('k'), null);
    });

    test('listKeys filters by prefix, and lists everything without one', async () => {
      const storage = await createAdapter();
      for (const key of ['a::1', 'a::2', 'b::1']) await storage.set(key, bytes(key));
      assert.deepEqual((await storage.listKeys('a::')).sort(), ['a::1', 'a::2']);
      assert.deepEqual((await storage.listKeys()).sort(), ['a::1', 'a::2', 'b::1']);
      assert.deepEqual(await storage.listKeys('zzz'), []);
    });

    test('clear with a prefix removes only matching keys; clear without one removes all', async () => {
      const storage = await createAdapter();
      for (const key of ['a::1', 'a::2', 'b::1']) await storage.set(key, bytes(key));
      await storage.clear('a::');
      assert.deepEqual(await storage.listKeys(), ['b::1']);
      await storage.clear();
      assert.deepEqual(await storage.listKeys(), []);
    });

    test('batch applies sets and deletes in order', async () => {
      const storage = await createAdapter();
      await storage.set('gone', bytes('x'));
      await storage.batch([
        { type: 'set', key: 'k', value: bytes('first') },
        { type: 'set', key: 'k', value: bytes('second') },
        { type: 'delete', key: 'gone' },
      ]);
      assert.equal(text(await storage.get('k')), 'second');
      assert.equal(await storage.get('gone'), null);
    });
  });
}
