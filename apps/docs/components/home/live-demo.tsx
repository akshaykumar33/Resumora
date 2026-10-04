'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ContinuityRuntime, type Workspace } from '@resumora/core';
import { IndexedDbStorageAdapter } from '@resumora/storage-indexeddb';
import {
  Database,
  KeyRound,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { playClick, playCrash, playRecover } from '@/lib/sound';

const IDENTITY = { tenantId: 'resumora-docs', userId: 'visitor', workspaceId: 'demo-claim' };
const LOCK_FLAG = 'resumora-demo-session-expired';

type Form = { claimant: string; amount: string; notes: string };
const EMPTY: Form = { claimant: '', amount: '', notes: '' };
type Tone = 'ok' | 'warn' | 'info';

function readLockFlag() {
  try {
    return sessionStorage.getItem(LOCK_FLAG) === '1';
  } catch {
    return false;
  }
}
function writeLockFlag(on: boolean) {
  try {
    if (on) sessionStorage.setItem(LOCK_FLAG, '1');
    else sessionStorage.removeItem(LOCK_FLAG);
  } catch {
    // Storage blocked: the lock simply won't survive a reload.
  }
}

/**
 * A real Resumora workspace running in the visitor's browser: every keystroke is recorded to
 * IndexedDB through @resumora/core, and every button is a genuine interruption.
 */
export function LiveDemo() {
  const storage = useRef<IndexedDbStorageAdapter | null>(null);
  const workspace = useRef<Workspace | null>(null);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [form, setForm] = useState<Form>(EMPTY);
  const [state, setState] = useState<'loading' | 'active' | 'locked' | 'unsupported'>('loading');
  const [message, setMessage] = useState<{ tone: Tone; text: string } | null>(null);
  const [saved, setSaved] = useState(0);
  const [storedKeys, setStoredKeys] = useState<string[]>([]);

  const refreshKeys = useCallback(async () => {
    if (!storage.current) return;
    try {
      const prefix = `resumora::${IDENTITY.tenantId}::${IDENTITY.userId}::${IDENTITY.workspaceId}`;
      const keys = await storage.current.listKeys(prefix);
      setStoredKeys(keys);
    } catch {
      // storage unavailable
    }
  }, []);

  const recover = useCallback(
    async (reason: string) => {
      const ws = workspace.current;
      if (!ws) return;
      const result = await ws.restoreLatestCheckpoint();
      const next: Form = { ...EMPTY, ...((result?.state as Partial<Form> | null) ?? {}) };
      for (const intent of result?.unappliedIntents ?? []) {
        const { field, value } = intent.payload as { field: keyof Form; value: string };
        next[field] = value;
      }
      setForm(next);
      setSaved(result?.unappliedIntents.length ?? 0);
      await refreshKeys();
      if (result) {
        playRecover();
        const n = result.unappliedIntents.length;
        setMessage({
          tone: 'ok',
          text: `Recovered after ${reason}: ${result.checkpoint ? 'checkpoint restored + ' : ''}${n} intent${n === 1 ? '' : 's'} replayed.`,
        });
      }
    },
    [refreshKeys],
  );

  const open = useCallback(async () => {
    if (!storage.current) return false;
    workspace.current = await new ContinuityRuntime({ storage: storage.current }).openWorkspace(
      IDENTITY,
    );
    if (readLockFlag()) {
      workspace.current.lock();
      setForm(EMPTY);
      setState('locked');
      await refreshKeys();
      return false;
    }
    setState('active');
    await refreshKeys();
    return true;
  }, [refreshKeys]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        storage.current = await IndexedDbStorageAdapter.open({
          databaseName: 'resumora-docs-demo',
        });
      } catch {
        if (!cancelled) setState('unsupported');
        return;
      }
      if (cancelled) return;
      if (await open()) await recover('page reload');
    })();
    return () => {
      cancelled = true;
    };
  }, [open, recover]);

  const edit = (field: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    clearTimeout(timers.current[field]);
    timers.current[field] = setTimeout(async () => {
      await workspace.current?.recordIntent('SET', { field, value });
      setSaved((n) => n + 1);
      await refreshKeys();
    }, 250);
  };

  const actions = {
    reload: () => {
      playClick();
      location.reload();
    },
    restart: async () => {
      playCrash();
      setMessage({
        tone: 'warn',
        text: 'Runtime restarted. In-memory state cleared to null.',
      });
      setForm(EMPTY);
      if (await open()) await recover('runtime restart');
    },
    checkpoint: async () => {
      playClick();
      const cp = await workspace.current?.saveCheckpoint(form);
      setSaved(0);
      await refreshKeys();
      if (cp) {
        setMessage({
          tone: 'info',
          text: `Checkpoint #${cp.sequence} saved. Earlier intents were pruned from storage.`,
        });
      }
    },
    expire: () => {
      playCrash();
      workspace.current?.lock();
      writeLockFlag(true);
      setForm(EMPTY);
      setState('locked');
      refreshKeys();
      setMessage({
        tone: 'warn',
        text: 'Session expired. Workspace is locked on-device until reauthorized.',
      });
    },
    signIn: async () => {
      playClick();
      workspace.current?.unlock({ isValid: true });
      writeLockFlag(false);
      setState('active');
      await recover('re-authenticating credentials');
    },
    reset: async () => {
      playClick();
      await workspace.current?.purge();
      writeLockFlag(false);
      setForm(EMPTY);
      setSaved(0);
      await open();
      await refreshKeys();
      setMessage({ tone: 'info', text: 'Demo reset. All records cleared from local IndexedDB.' });
    },
  };

  useEffect(() => {
    const handleRemoteCrash = () => {
      actions.restart();
    };
    window.addEventListener('resumora:trigger-crash', handleRemoteCrash);
    return () => window.removeEventListener('resumora:trigger-crash', handleRemoteCrash);
  }, [actions.restart]);

  if (state === 'unsupported') {
    return (
      <p className="rounded-2xl border border-fd-border/70 p-6 text-fd-muted-foreground">
        This browser environment has IndexedDB disabled, so the local recovery demo cannot run.
      </p>
    );
  }

  const locked = state === 'locked';
  const busy = state === 'loading';
  const toneClass: Record<Tone, string> = {
    ok: 'border-success/40 bg-success/10 text-success dark:text-success',
    warn: 'border-warning/40 bg-warning/10 text-warning dark:text-warning',
    info: 'border-fd-primary/40 bg-fd-primary/10 text-fd-foreground',
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
      {/* Left Column: Form Simulator */}
      <div className="relative overflow-hidden rounded-2xl border border-fd-border/80 bg-fd-card/90 p-6 shadow-xl backdrop-blur-xl lg:col-span-7">
        <div className="mb-5 flex items-center justify-between border-b border-fd-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            <span className="font-semibold text-sm">Interactive Claim Form</span>
          </div>
          <span className="font-mono text-xs text-fd-muted-foreground">
            {busy ? 'Opening…' : `${saved} uncommitted edit${saved === 1 ? '' : 's'}`}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Claimant Name
            <input
              id="demo-claimant"
              value={form.claimant}
              disabled={locked || busy}
              onChange={(e) => edit('claimant', e.target.value)}
              placeholder="e.g. Mira Okafor"
              className="rounded-xl border border-fd-border bg-fd-background/80 px-3.5 py-2.5 text-sm font-normal text-fd-foreground outline-none transition-all focus:border-fd-primary focus:ring-2 focus:ring-fd-primary/20 disabled:opacity-50"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Amount (EUR)
            <input
              id="demo-amount"
              inputMode="decimal"
              value={form.amount}
              disabled={locked || busy}
              onChange={(e) => edit('amount', e.target.value)}
              placeholder="4,250"
              className="rounded-xl border border-fd-border bg-fd-background/80 px-3.5 py-2.5 text-sm font-normal text-fd-foreground outline-none transition-all focus:border-fd-primary focus:ring-2 focus:ring-fd-primary/20 disabled:opacity-50"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground">
            Incident Notes
            <textarea
              id="demo-notes"
              rows={3}
              value={form.notes}
              disabled={locked || busy}
              onChange={(e) => edit('notes', e.target.value)}
              placeholder="Water damage in the warehouse after heavy rain..."
              className="resize-none rounded-xl border border-fd-border bg-fd-background/80 px-3.5 py-2.5 text-sm font-normal text-fd-foreground outline-none transition-all focus:border-fd-primary focus:ring-2 focus:ring-fd-primary/20 disabled:opacity-50"
            />
          </label>
        </div>

        {/* Lock Overlay Modal */}
        <AnimatePresence>
          {locked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-30 grid place-items-center bg-fd-card/95 p-6 text-center backdrop-blur-md"
            >
              <div className="flex max-w-xs flex-col items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-warning/15 text-warning dark:text-warning ring-4 ring-warning/10">
                  <LockKeyhole className="size-6" strokeWidth={2} />
                </div>
                <p className="font-semibold text-base text-fd-foreground">Workspace Locked</p>
                <p className="text-xs leading-relaxed text-fd-muted-foreground">
                  Session token expired. Work remains safely stored in local IndexedDB, but all
                  reads and writes are blocked until re-authenticated.
                </p>
                <button
                  type="button"
                  onClick={actions.signIn}
                  className="mt-1 inline-flex items-center gap-2 rounded-xl bg-fd-primary px-4 py-2 text-xs font-semibold text-fd-primary-foreground shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <KeyRound className="size-3.5" /> Re-authenticate & Unlock
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Column: Chaos Engine & Live Storage Journal */}
      <div className="flex flex-col gap-5 lg:col-span-5">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-fd-foreground">
            Test Interruption Recovery
          </h3>
          <p className="mt-1 text-xs text-fd-muted-foreground">
            Trigger real failure modes. Everything stays strictly inside your browser's IndexedDB.
          </p>
        </div>

        {/* 4 Interruption Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={actions.reload}
            className="flex flex-col items-start gap-1 rounded-xl border border-fd-border/70 bg-fd-card p-3 text-left transition-all hover:border-fd-primary/50 hover:bg-fd-muted/50 active:scale-[0.99] disabled:opacity-40"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-fd-foreground">
              <RefreshCw className="size-3.5 text-fd-primary" /> Reload Tab
            </div>
            <span className="text-[11px] text-fd-muted-foreground">Tests page reload</span>
          </button>

          <button
            type="button"
            disabled={busy || locked}
            onClick={actions.restart}
            className="flex flex-col items-start gap-1 rounded-xl border border-fd-border/70 bg-fd-card p-3 text-left transition-all hover:border-fd-primary/50 hover:bg-fd-muted/50 active:scale-[0.99] disabled:opacity-40"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-fd-foreground">
              <RotateCcw className="size-3.5 text-warning" /> Crash Memory
            </div>
            <span className="text-[11px] text-fd-muted-foreground">Clears JS heap</span>
          </button>

          <button
            type="button"
            disabled={busy || locked}
            onClick={actions.checkpoint}
            className="flex flex-col items-start gap-1 rounded-xl border border-fd-border/70 bg-fd-card p-3 text-left transition-all hover:border-fd-primary/50 hover:bg-fd-muted/50 active:scale-[0.99] disabled:opacity-40"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-fd-foreground">
              <Save className="size-3.5 text-success" /> Save Checkpoint
            </div>
            <span className="text-[11px] text-fd-muted-foreground">Prunes intents</span>
          </button>

          <button
            type="button"
            disabled={busy || locked}
            onClick={actions.expire}
            className="flex flex-col items-start gap-1 rounded-xl border border-fd-border/70 bg-fd-card p-3 text-left transition-all hover:border-fd-primary/50 hover:bg-fd-muted/50 active:scale-[0.99] disabled:opacity-40"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-fd-foreground">
              <ShieldAlert className="size-3.5 text-danger" /> Expire Token
            </div>
            <span className="text-[11px] text-fd-muted-foreground">Locks storage</span>
          </button>
        </div>

        {/* Status Notification Message */}
        <div aria-live="polite" className="min-h-[2.75rem]">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                key={message.text}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className={`rounded-xl border px-3.5 py-2.5 text-xs font-medium ${toneClass[message.tone]}`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live On-Device IndexedDB Journal Inspector */}
        <div className="overflow-hidden rounded-xl border border-fd-border/70 bg-fd-card/80 p-3.5 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-fd-foreground">
              <Database className="size-3.5 text-fd-primary" /> Live On-Device Storage
            </span>
            <span className="font-mono text-[10px] text-fd-muted-foreground">
              {storedKeys.length} record{storedKeys.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="flex max-h-32 flex-col gap-1 overflow-y-auto font-mono text-[11px]">
            {storedKeys.length === 0 ? (
              <span className="text-fd-muted-foreground/70 italic py-1">
                No records yet. Type into the form to journal intents.
              </span>
            ) : (
              storedKeys.map((key) => {
                const isCheckpoint = key.includes('checkpoint');
                const label = key.split('::').slice(-2).join('::');
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-md bg-fd-background/70 px-2 py-1 border border-fd-border/40"
                  >
                    <span className="truncate text-fd-foreground/90 font-mono text-[10.5px]">
                      {label}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                        isCheckpoint
                          ? 'bg-success/20 text-success dark:text-success'
                          : 'bg-fd-primary/20 text-fd-primary'
                      }`}
                    >
                      {isCheckpoint ? 'CHECKPOINT' : 'INTENT'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={actions.reset}
          disabled={busy}
          className="inline-flex w-fit items-center gap-1.5 text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground disabled:opacity-40"
        >
          <Trash2 className="size-3.5" /> Purge demo records from IndexedDB
        </button>
      </div>
    </div>
  );
}
