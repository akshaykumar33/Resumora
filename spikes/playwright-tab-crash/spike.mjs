// Spike 1.5 (docs/roadmap/SPRINT_PLAN.md): can Playwright reload a page, crash the tab, and crash
// the whole browser, with IndexedDB data readable afterwards? Prints one line per check and exits
// non-zero if any check fails. Findings: docs/spikes/SPIKE-001-playwright-crash-recovery.md
import { chromium } from '@playwright/test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ORIGIN = 'http://resumora.spike'; // served by request interception: a real origin, no server
const PAGE = `<!doctype html><script>
  const open = () => new Promise((ok, fail) => {
    const req = indexedDB.open('spike', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('work');
    req.onsuccess = () => ok(req.result); req.onerror = () => fail(req.error);
  });
  window.put = async (key, value, durability) => {
    const tx = (await open()).transaction('work', 'readwrite', { durability });
    tx.objectStore('work').put(value, key);
    await new Promise((ok, fail) => { tx.oncomplete = ok; tx.onerror = () => fail(tx.error); });
  };
  // Control case: chained requests keep the transaction from ever committing.
  window.putNeverCommit = async (key, value) => {
    const store = (await open()).transaction('work', 'readwrite').objectStore('work');
    store.put(value, key);
    const spin = () => { store.get(key).onsuccess = spin; };
    spin();
  };
  window.get = async (key) => {
    const req = (await open()).transaction('work').objectStore('work').get(key);
    return new Promise((ok, fail) => { req.onsuccess = () => ok(req.result ?? null); req.onerror = () => fail(req.error); });
  };
</script>`;

const profile = mkdtempSync(join(tmpdir(), 'resumora-spike-'));
const results = [];
const check = (name, expected, actual) => {
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  results.push(ok);
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${name}  expected=${JSON.stringify(expected)} actual=${JSON.stringify(actual)}`,
  );
};

const launch = async () => {
  const context = await chromium.launchPersistentContext(profile, { headless: true });
  await context.route(`${ORIGIN}/**`, (route) =>
    route.fulfill({ contentType: 'text/html', body: PAGE }),
  );
  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto(`${ORIGIN}/`);
  return { context, page };
};

// Crashes the whole browser, then relaunches on the same profile. The context must close by
// itself: a graceful close() would flush storage and turn the check into a false pass.
const crashAndRelaunch = async (label, context, page) => {
  const died = new Promise((resolve) => context.once('close', () => resolve(true)));
  const cdp = await context.newCDPSession(page);
  cdp.send('Browser.crash').catch(() => {}); // the browser dies, so this never resolves cleanly
  check(
    `browser really crashed (${label})`,
    true,
    await Promise.race([died, new Promise((r) => setTimeout(() => r(false), 5000))]),
  );
  await context.close().catch(() => {}); // no-op after a real crash
  return launch();
};

try {
  let { context, page } = await launch();

  // 1. Reload
  await page.evaluate(() => window.put('reload', { step: 3 }, 'relaxed'));
  await page.reload();
  check('reload', { step: 3 }, await page.evaluate(() => window.get('reload')));

  // 2. Tab (renderer) crash: the page dies; the browser and its storage process survive
  await page.evaluate(() => window.put('tab-crash', { step: 4 }, 'relaxed'));
  const tabCrashed = new Promise((resolve) => page.once('crash', resolve));
  (await context.newCDPSession(page)).send('Page.crash').catch(() => {});
  await tabCrashed;
  page = await context.newPage();
  await page.goto(`${ORIGIN}/`);
  check('tab crash -> new tab', { step: 4 }, await page.evaluate(() => window.get('tab-crash')));

  // 3. Whole-browser crash immediately after a commit, once per durability mode
  for (const durability of ['relaxed', 'strict']) {
    await page.evaluate((d) => window.put(`browser-${d}`, { step: 5, d }, d), durability);
    ({ context, page } = await crashAndRelaunch(durability, context, page));
    check(
      `browser crash (${durability}) -> relaunch`,
      { step: 5, d: durability },
      await page.evaluate((d) => window.get(`browser-${d}`), durability),
    );
  }
  check(
    'earlier records survive both crashes',
    { step: 3 },
    await page.evaluate(() => window.get('reload')),
  );

  // 4. Control: a write whose transaction never committed must be gone after a crash. If this
  //    record survived, the checks above could not detect loss at all.
  await page.evaluate(() => window.putNeverCommit('uncommitted', { step: 6 }));
  ({ context, page } = await crashAndRelaunch('uncommitted control', context, page));
  check(
    'uncommitted write is absent after crash',
    null,
    await page.evaluate(() => window.get('uncommitted')),
  );

  await context.close();
} finally {
  // Best effort: on Windows a crashed browser can hold profile files briefly. Never mask the result.
  try {
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    // Leftover temp files are harmless; the result must not depend on cleanup.
  }
}

const failed = results.filter((ok) => !ok).length;
console.log(failed ? `${failed} check(s) failed` : `all ${results.length} checks passed`);
process.exit(failed ? 1 : 0);
