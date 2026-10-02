'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ContinuityRuntime, type Workspace } from '@resumora/core';
import { IndexedDbStorageAdapter } from '@resumora/storage-indexeddb';
import { KeyRound, LockKeyhole, RefreshCw, RotateCcw, Save, Trash2 } from 'lucide-react';

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

  const recover = useCallback(async (reason: string) => {
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
    if (result) {
      const n = result.unappliedIntents.length;
      setMessage({
        tone: 'ok',
        text: `Recovered after ${reason}: ${result.checkpoint ? 'the checkpoint, plus ' : ''}${n} edit${n === 1 ? '' : 's'} replayed.`,
      });
    }
  }, []);

  const open = useCallback(async () => {
    if (!storage.current) return;
    workspace.current = await new ContinuityRuntime({ storage: storage.current }).openWorkspace(
      IDENTITY,
    );
    if (readLockFlag()) {
      workspace.current.lock();
      setForm(EMPTY);
      setState('locked');
      return false;
    }
    setState('active');
    return true;
  }, []);

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
      if (await open()) await recover('reloading the page');
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
    }, 300);
  };

  const actions = {
    reload: () => location.reload(),
    restart: async () => {
      setMessage({
        tone: 'warn',
        text: 'Runtime restarted. Everything in memory was thrown away.',
      });
      setForm(EMPTY);
      if (await open()) await recover('a runtime restart');
    },
    checkpoint: async () => {
      const cp = await workspace.current?.saveCheckpoint(form);
      setSaved(0);
      if (cp)
        setMessage({
          tone: 'info',
          text: `Checkpoint #${cp.sequence} saved. The edits it covers were pruned.`,
        });
    },
    expire: () => {
      workspace.current?.lock();
      writeLockFlag(true);
      setForm(EMPTY);
      setState('locked');
      setMessage({
        tone: 'warn',
        text: 'Session expired. The work is still on this device, but locked.',
      });
    },
    signIn: async () => {
      workspace.current?.unlock({ isValid: true });
      writeLockFlag(false);
      setState('active');
      await recover('signing in again');
    },
    reset: async () => {
      await workspace.current?.purge();
      writeLockFlag(false);
      setForm(EMPTY);
      setSaved(0);
      await open();
      setMessage({ tone: 'info', text: 'Demo reset. Every stored record was deleted.' });
    },
  };

  if (state === 'unsupported') {
    return (
      <p className="rounded-2xl border p-6 text-fd-muted-foreground">
        This browser has IndexedDB turned off, so the live demo can’t store anything here.
      </p>
    );
  }

  const locked = state === 'locked';
  const busy = state === 'loading';
  const toneClass: Record<Tone, string> = {
    ok: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200',
    warn: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200',
    info: 'border-fd-primary/30 bg-fd-primary/10 text-fd-foreground',
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="relative overflow-hidden rounded-2xl border bg-fd-card p-6 shadow-[0_12px_40px_-16px_color-mix(in_oklch,var(--color-fd-primary)_30%,transparent)]">
        <div className="mb-5 flex items-center justify-between">
          <span className="font-medium">Insurance claim</span>
          <span className="font-mono text-xs text-fd-muted-foreground">
            {busy ? 'opening…' : `${saved} unsaved edit${saved === 1 ? '' : 's'} journaled`}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Claimant
            <input
              id="demo-claimant"
              value={form.claimant}
              disabled={locked || busy}
              onChange={(e) => edit('claimant', e.target.value)}
              placeholder="Mira Okafor"
              className="rounded-lg border bg-fd-background px-3 py-2 text-base font-normal outline-none transition-shadow focus:ring-2 focus:ring-fd-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Amount claimed (EUR)
            <input
              id="demo-amount"
              inputMode="decimal"
              value={form.amount}
              disabled={locked || busy}
              onChange={(e) => edit('amount', e.target.value)}
              placeholder="4,250"
              className="rounded-lg border bg-fd-background px-3 py-2 text-base font-normal outline-none transition-shadow focus:ring-2 focus:ring-fd-primary"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            What happened
            <textarea
              id="demo-notes"
              rows={3}
              value={form.notes}
              disabled={locked || busy}
              onChange={(e) => edit('notes', e.target.value)}
              placeholder="Water damage in the kitchen after a pipe burst."
              className="resize-none rounded-lg border bg-fd-background px-3 py-2 text-base font-normal outline-none transition-shadow focus:ring-2 focus:ring-fd-primary"
            />
          </label>
        </div>

        <AnimatePresence>
          {locked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 grid place-items-center bg-fd-card/90 p-6 text-center backdrop-blur-sm"
            >
              <div className="flex max-w-xs flex-col items-center gap-3">
                <LockKeyhole
                  className="size-6 text-amber-600 dark:text-amber-300"
                  strokeWidth={1.75}
                />
                <p className="font-medium">Your session expired</p>
                <p className="text-sm text-fd-muted-foreground">
                  The claim is safe on this device, but nothing can read it until you sign in.
                  Reloading won’t unlock it either.
                </p>
                <button
                  type="button"
                  onClick={actions.signIn}
                  className="inline-flex items-center gap-2 rounded-full bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground active:scale-[0.98]"
                >
                  <KeyRound className="size-4" /> Sign in again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-fd-muted-foreground">
          Type into the claim, then try to lose it. Every button is a real interruption, and
          everything stays in your browser.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Reload the page', icon: RefreshCw, run: actions.reload },
            { label: 'Restart runtime', icon: RotateCcw, run: actions.restart },
            { label: 'Save checkpoint', icon: Save, run: actions.checkpoint },
            { label: 'Expire session', icon: LockKeyhole, run: actions.expire },
          ].map(({ label, icon: Icon, run }) => (
            <button
              key={label}
              type="button"
              disabled={busy || (locked && label !== 'Reload the page')}
              onClick={run}
              className="flex items-center gap-2 rounded-xl border bg-fd-card px-4 py-3 text-left text-sm font-medium transition-colors hover:border-fd-primary/50 hover:bg-fd-accent active:scale-[0.99] disabled:opacity-40"
            >
              <Icon className="size-4 shrink-0 text-fd-primary" strokeWidth={1.75} />
              {label}
            </button>
          ))}
        </div>
        <div aria-live="polite" className="min-h-[3.5rem]">
          <AnimatePresence mode="wait">
            {message && (
              <motion.p
                key={message.text}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
                className={`rounded-xl border px-4 py-3 text-sm ${toneClass[message.tone]}`}
              >
                {message.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={actions.reset}
          disabled={busy}
          className="inline-flex w-fit items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground disabled:opacity-40"
        >
          <Trash2 className="size-3.5" /> Reset the demo
        </button>
      </div>
    </div>
  );
}
