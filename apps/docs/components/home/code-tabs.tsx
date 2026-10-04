'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { toast } from 'sonner';
import { Check, Copy } from 'lucide-react';

// Each snippet is checked against @resumora/core's real signatures.
const SNIPPETS = [
  {
    id: 'core',
    file: 'app.ts',
    caption: 'Record each edit, checkpoint at milestones, restore after any crash.',
    code: `import { ContinuityRuntime } from '@resumora/core';
import { IndexedDbStorageAdapter } from '@resumora/storage-indexeddb';

const storage = await IndexedDbStorageAdapter.open();
const runtime = new ContinuityRuntime({ storage });
const workspace = await runtime.openWorkspace({
  tenantId: 'acme',
  userId: 'user_44',
  workspaceId: 'claim_902',
});

// 1. Record each edit as it happens
await workspace.recordIntent('SET_AMOUNT', { value: 4250 });

// 2. Checkpoint at a milestone (covered intents are pruned)
await workspace.saveCheckpoint({ claimant: 'Mira', amount: 4250 });

// 3. After a reload or crash: the checkpoint plus later intents
const recovered = await workspace.restoreLatestCheckpoint();`,
  },
  {
    id: 'auth',
    file: 'session.ts',
    caption:
      'Stored work is never permission: lock on expiry, unlock only after the server agrees.',
    code: `import { WorkspaceLockedError } from '@resumora/core';

// The session expired: lock the workspace.
workspace.lock();

try {
  await workspace.recordIntent('EDIT_NOTE', { note: 'Draft' });
} catch (error) {
  // WorkspaceLockedError: the work stays on disk, unreadable
  if (!(error instanceof WorkspaceLockedError)) throw error;
}

// Your server re-authenticates and re-authorizes the user.
const { ok } = await verifySessionWithServer();

if (workspace.unlock({ isValid: ok })) {
  const restored = await workspace.restoreLatestCheckpoint();
}`,
  },
  {
    id: 'adapter',
    file: 'my-adapter.ts',
    caption: 'Six methods put Resumora on any key-value store you can reach.',
    code: `import type { StorageAdapter, StorageOperation } from '@resumora/core';

export class MyStorageAdapter implements StorageAdapter {
  constructor(private readonly driver: KeyValueDriver) {}

  get(key: string) {
    return this.driver.read(key);
  }
  set(key: string, value: Uint8Array) {
    return this.driver.write(key, value);
  }
  delete(key: string) {
    return this.driver.remove(key);
  }
  listKeys(prefix: string) {
    return this.driver.scan(prefix);
  }
  batch(operations: readonly StorageOperation[]) {
    return this.driver.transaction(operations);
  }
  clear(prefix?: string) {
    return this.driver.purge(prefix);
  }
}`,
  },
];

/**
 * The API in three files: filename tabs with a sliding highlight, one copy button that confirms
 * with a toast, and a one-line caption under the code.
 */
export function CodeShowcaseTabs() {
  const [active, setActive] = useState(SNIPPETS[0]!.id);
  const [copied, setCopied] = useState(false);
  const current = SNIPPETS.find((s) => s.id === active) ?? SNIPPETS[0]!;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      toast.success(`Copied ${current.file}`);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error('Copy was blocked by the browser');
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-fd-border bg-fd-card shadow-[0_30px_70px_-36px_var(--resumora-shadow)]">
      <div className="flex items-center gap-2 border-b border-fd-border bg-sunken/60 px-3 py-2.5">
        <div
          role="tablist"
          aria-label="Examples"
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none]"
        >
          {SNIPPETS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === active}
              onClick={() => setActive(s.id)}
              className={`relative shrink-0 rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors ${
                s.id === active
                  ? 'text-fd-foreground'
                  : 'text-fd-muted-foreground hover:text-fd-foreground'
              }`}
            >
              {s.id === active && (
                <motion.span
                  layoutId="code-tab"
                  className="absolute inset-0 rounded-full border border-fd-border bg-fd-card shadow-sm"
                  transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                />
              )}
              <span className="relative">{s.file}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${current.file}`}
          className="grid size-8 shrink-0 place-items-center rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
        >
          {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="[&_figure]:my-0 [&_figure]:rounded-none [&_figure]:border-0 [&_figure]:shadow-none [&_figure>div:first-child:has(button)]:hidden [&_pre]:max-h-[26rem] [&_pre]:text-[13px] [&_pre]:leading-relaxed"
        >
          <DynamicCodeBlock lang="ts" code={current.code} />
        </motion.div>
      </AnimatePresence>

      <p className="border-t border-fd-border px-5 py-3 text-sm text-fd-muted-foreground">
        {current.caption}
      </p>
    </div>
  );
}
