// Phase 3 exit gate: work survives a real browser refresh and a real tab crash, in Playwright, in
// CI. These run the built @resumora/core and @resumora/storage-indexeddb in real Chromium, on a
// persistent profile, and recover through the public API only. Method: SPIKE-001.
import { test, expect, chromium } from '@playwright/test';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ORIGIN = 'http://resumora.test';
const FILES = {
  '/core.js': readFileSync('packages/core/dist/index.js', 'utf8'),
  '/storage-indexeddb.js': readFileSync('packages/storage-indexeddb/dist/index.js', 'utf8'),
  '/': `<!doctype html>
<script type="importmap">{ "imports": { "@resumora/core": "/core.js" } }</script>
<script type="module">
  import { ContinuityRuntime } from '@resumora/core';
  import { IndexedDbStorageAdapter } from '/storage-indexeddb.js';
  const identity = { tenantId: 'northwind', userId: 'maya', workspaceId: 'inspection-7' };
  const open = async () => {
    const storage = await IndexedDbStorageAdapter.open({ databaseName: 'resumora-e2e' });
    return new ContinuityRuntime({ storage }).openWorkspace(identity);
  };
  window.app = {
    record: async (field, value) => (await open()).recordIntent('SET_FIELD', { field, value }).then((i) => i.sequence),
    checkpoint: async (state) => (await open()).saveCheckpoint(state).then((c) => c.sequence),
    // Rebuilds the form exactly as the reference app will: checkpoint state, then replay.
    restore: async () => {
      const result = await (await open()).restoreLatestCheckpoint();
      if (!result) return null;
      const form = { ...(result.state || {}) };
      for (const intent of result.unappliedIntents) form[intent.payload.field] = intent.payload.value;
      return { form, checkpoint: result.checkpoint ? result.checkpoint.sequence : null, replayed: result.unappliedIntents.length };
    },
  };
  window.appReady = true;
</script>`,
};

function useProfile() {
  const dir = mkdtempSync(join(tmpdir(), 'resumora-e2e-'));
  const launch = async () => {
    const context = await chromium.launchPersistentContext(dir, { headless: true });
    await context.route(`${ORIGIN}/**`, (route) => {
      const path = new URL(route.request().url()).pathname;
      const body = FILES[path];
      if (body === undefined) return route.fulfill({ status: 404, body: 'not found' });
      return route.fulfill({ contentType: path === '/' ? 'text/html' : 'text/javascript', body });
    });
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(`${ORIGIN}/`);
    await page.waitForFunction(() => window.appReady === true);
    return { context, page };
  };
  const cleanup = () => {
    try {
      rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch {
      // A crashed browser can hold profile files briefly on Windows; leftovers are harmless.
    }
  };
  return { launch, cleanup };
}

// Records work the way a user produces it: some fields, a checkpoint, then unsaved edits.
async function recordWork(page) {
  await page.evaluate(async () => {
    await window.app.record('address', '14 Harbour Quay');
    await window.app.record('propertyType', 'Warehouse');
    await window.app.checkpoint({ address: '14 Harbour Quay', propertyType: 'Warehouse' });
    await window.app.record('roofCondition', 'Fair');
    await window.app.record('leaks', true);
  });
}

const EXPECTED = {
  form: {
    address: '14 Harbour Quay',
    propertyType: 'Warehouse',
    roofCondition: 'Fair',
    leaks: true,
  },
  checkpoint: 2,
  replayed: 2,
};

test('work survives a page reload', async () => {
  const { launch, cleanup } = useProfile();
  try {
    const { context, page } = await launch();
    await recordWork(page);
    await page.reload();
    await page.waitForFunction(() => window.appReady === true);
    expect(await page.evaluate(() => window.app.restore())).toEqual(EXPECTED);
    await context.close();
  } finally {
    cleanup();
  }
});

test('work survives a tab crash', async () => {
  const { launch, cleanup } = useProfile();
  try {
    const { context, page } = await launch();
    await recordWork(page);
    const crashed = new Promise((resolve) => page.once('crash', resolve));
    (await context.newCDPSession(page)).send('Page.crash').catch(() => {});
    await crashed;

    const tab = await context.newPage();
    await tab.goto(`${ORIGIN}/`);
    await tab.waitForFunction(() => window.appReady === true);
    expect(await tab.evaluate(() => window.app.restore())).toEqual(EXPECTED);
    await context.close();
  } finally {
    cleanup();
  }
});

test('work survives a whole-browser crash', async () => {
  const { launch, cleanup } = useProfile();
  try {
    let { context, page } = await launch();
    await recordWork(page);

    // The browser must die by itself: a graceful close would flush storage (false pass).
    const died = new Promise((resolve) => context.once('close', () => resolve(true)));
    (await context.newCDPSession(page)).send('Browser.crash').catch(() => {});
    const crashedByItself = await Promise.race([
      died,
      new Promise((resolve) => setTimeout(() => resolve(false), 5000)),
    ]);
    expect(crashedByItself).toBe(true);

    ({ context, page } = await launch());
    expect(await page.evaluate(() => window.app.restore())).toEqual(EXPECTED);
    await context.close();
  } finally {
    cleanup();
  }
});

test('a fresh profile has nothing to restore', async () => {
  const { launch, cleanup } = useProfile();
  try {
    const { context, page } = await launch();
    expect(await page.evaluate(() => window.app.restore())).toBeNull();
    await context.close();
  } finally {
    cleanup();
  }
});
