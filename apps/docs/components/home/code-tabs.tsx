'use client';

import { useState } from 'react';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Check, Copy, FileCode2, KeyRound, Plug } from 'lucide-react';

const SNIPPETS = [
  {
    id: 'core',
    label: 'TypeScript Core',
    icon: FileCode2,
    desc: 'Record intent, checkpoint state, and recover after any crash.',
    code: `import { ContinuityRuntime } from '@resumora/core';
import { IndexedDbStorageAdapter } from '@resumora/storage-indexeddb';

const storage = await IndexedDbStorageAdapter.open();
const runtime = new ContinuityRuntime({ storage });
const workspace = await runtime.openWorkspace({
  tenantId: 'acme',
  userId: 'user_44',
  workspaceId: 'claim_902',
});

// 1. Record user actions as they happen
await workspace.recordIntent('SET_AMOUNT', { value: 4250 });

// 2. Snapshot milestones and prune journaled intents
await workspace.saveCheckpoint({ claimant: 'Mira', amount: 4250 });

// 3. Restore on reload or crash: returns checkpoint + unapplied intents
const recovered = await workspace.restoreLatestCheckpoint();`,
  },
  {
    id: 'auth',
    label: 'Session Expiry Re-Auth',
    icon: KeyRound,
    desc: 'Preserves the LOCK -> REAUTHENTICATE -> UNLOCK invariant.',
    code: `// Invariant #1: Stored data NEVER confers authorization.
// When session token expires, lock the workspace:
workspace.lock();

// All reads and writes are blocked while locked:
try {
  await workspace.recordIntent('EDIT_NOTE', { note: 'Restricted' });
} catch (err) {
  // Throws WorkspaceLockedError: state remains safe on disk
}

// Server re-authenticates and verifies entitlement:
const authResult = await verifyTokenWithServer(token);

if (authResult.ok) {
  await workspace.unlock({ isValid: true });
  const restored = await workspace.restoreLatestCheckpoint();
}`,
  },
  {
    id: 'adapter',
    label: 'Custom Storage Adapter',
    icon: Plug,
    desc: 'Pluggable storage: implement 6 methods to target any disk engine.',
    code: `import type { StorageAdapter, StorageBatchOp } from '@resumora/core';

// Core is decoupled from browser APIs.
// Implement 6 methods to target SQLite, OPFS, or Cloudflare:
export class CustomStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<Uint8Array | null> {
    return this.driver.read(key);
  }
  async set(key: string, value: Uint8Array): Promise<void> {
    await this.driver.write(key, value);
  }
  async delete(key: string): Promise<void> {
    await this.driver.remove(key);
  }
  async listKeys(prefix: string): Promise<string[]> {
    return this.driver.scanPrefix(prefix);
  }
  async batch(ops: StorageBatchOp[]): Promise<void> {
    await this.driver.transaction(ops);
  }
  async clear(prefix?: string): Promise<void> {
    await this.driver.purge(prefix);
  }
}`,
  },
];

export function CodeShowcaseTabs() {
  const [activeTab, setActiveTab] = useState(SNIPPETS[0]!.id);
  const [copied, setCopied] = useState(false);

  const current = SNIPPETS.find((s) => s.id === activeTab) ?? SNIPPETS[0]!;

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-fd-border/80 bg-fd-card/90 shadow-xl backdrop-blur-xl">
      {/* Tab bar header */}
      <div className="flex flex-wrap items-center justify-between border-b border-fd-border/70 bg-fd-muted/30 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {SNIPPETS.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isCurrent
                    ? 'bg-fd-background text-fd-foreground shadow-xs ring-1 ring-fd-border'
                    : 'text-fd-muted-foreground hover:bg-fd-muted/50 hover:text-fd-foreground'
                }`}
              >
                <Icon className="size-3.5 text-fd-primary" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 rounded-md border border-fd-border/60 bg-fd-background px-2.5 py-1 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-muted hover:text-fd-foreground"
        >
          {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code body */}
      <div className="p-0 [&_figure]:my-0 [&_pre]:rounded-none [&_pre]:border-none">
        <DynamicCodeBlock lang="ts" code={current.code} />
      </div>

      {/* Footer bar */}
      <div className="border-t border-fd-border/60 bg-fd-muted/20 px-4 py-2 text-xs text-fd-muted-foreground">
        {current.desc}
      </div>
    </div>
  );
}
