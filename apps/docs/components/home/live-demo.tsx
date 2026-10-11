'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ContinuityRuntime, type Workspace } from '@resumora/core';
import { IndexedDbStorageAdapter } from '@resumora/storage-indexeddb';
import confetti from 'canvas-confetti';
import {
  IconDatabase,
  IconDeviceFloppy,
  IconFlame,
  IconKey,
  IconLock,
  IconRefresh,
  IconShieldLock,
  IconTrash,
} from '@tabler/icons-react';
import { playClick, playCrash, playRecover } from '@/lib/sound';
import { Badge, Surface, buttonClass } from '@/components/ui/kit';

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
        if (result.checkpoint || n > 0) {
          try {
            confetti({
              particleCount: 42,
              spread: 60,
              origin: { y: 0.68 },
              colors: ['#f97316', '#38bdf8', '#4ade80', '#a855f7'],
              disableForReducedMotion: true,
            });
          } catch {
            // confetti gracefully degraded
          }
        }
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
    ok: 'border-success/30 bg-success/10 text-success',
    warn: 'border-warning/30 bg-warning/10 text-warning',
    info: 'border-fd-primary/30 bg-fd-primary/10 text-fd-foreground',
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      {/* The form: the work a user would lose */}
      <Surface className="relative overflow-hidden lg:col-span-7">
        <div className="flex items-center justify-between gap-3 border-b border-fd-border/70 bg-fd-muted/30 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-danger/80" />
            <span className="size-2.5 rounded-full bg-warning/80" />
            <span className="size-2.5 rounded-full bg-success/80" />
            <span className="ml-2 font-mono text-xs font-semibold text-fd-foreground/80">
              resumora::claim-demo
            </span>
          </div>
          <Badge tone={locked ? 'warning' : saved > 0 ? 'accent' : 'neutral'}>
            {busy
              ? 'Opening…'
              : locked
                ? 'Locked'
                : `${saved} unsaved edit${saved === 1 ? '' : 's'}`}
          </Badge>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <Field label="Claimant">
            <input
              id="demo-claimant"
              value={form.claimant}
              disabled={locked || busy}
              onChange={(e) => edit('claimant', e.target.value)}
              placeholder="Mira Okafor"
              className={inputClass}
            />
          </Field>
          <Field label="Amount (EUR)">
            <input
              id="demo-amount"
              inputMode="decimal"
              value={form.amount}
              disabled={locked || busy}
              onChange={(e) => edit('amount', e.target.value)}
              placeholder="4,250"
              className={`${inputClass} tabular`}
            />
          </Field>
          <Field label="What happened">
            <textarea
              id="demo-notes"
              rows={3}
              value={form.notes}
              disabled={locked || busy}
              onChange={(e) => edit('notes', e.target.value)}
              placeholder="Water came through the kitchen ceiling after heavy rain."
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        <AnimatePresence>
          {locked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-30 grid place-items-center bg-fd-card/95 p-6 text-center backdrop-blur-md"
            >
              <div className="flex max-w-xs flex-col items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-warning/15 text-warning ring-4 ring-warning/10">
                  <IconLock className="size-6" strokeWidth={1.75} />
                </div>
                <p className="font-display text-heading font-semibold">Workspace locked</p>
                <p className="text-sm leading-relaxed text-fd-muted-foreground">
                  The session expired. The work is still on this device, but nothing can be read or
                  written until you sign back in.
                </p>
                <button
                  type="button"
                  onClick={actions.signIn}
                  className={`${buttonClass('primary', 'sm')} mt-2`}
                >
                  <IconKey className="size-3.5" /> Sign back in
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Surface>

      {/* The interruptions, the outcome, and what is on disk */}
      <div className="flex flex-col gap-4 lg:col-span-5">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              {
                label: 'Reload',
                note: 'Refresh the page',
                icon: IconRefresh,
                tone: 'text-fd-primary bg-fd-primary/10 border-fd-primary/20 group-hover:bg-fd-primary/15 group-hover:border-fd-primary/40',
                onClick: actions.reload,
                disabled: busy,
              },
              {
                label: 'Crash',
                note: 'Wipe memory',
                icon: IconFlame,
                tone: 'text-warning bg-warning/10 border-warning/20 group-hover:bg-warning/15 group-hover:border-warning/40',
                onClick: actions.restart,
                disabled: busy || locked,
              },
              {
                label: 'Checkpoint',
                note: 'Save a snapshot',
                icon: IconDeviceFloppy,
                tone: 'text-success bg-success/10 border-success/20 group-hover:bg-success/15 group-hover:border-success/40',
                onClick: actions.checkpoint,
                disabled: busy || locked,
              },
              {
                label: 'Expire token',
                note: 'Lock the workspace',
                icon: IconShieldLock,
                tone: 'text-danger bg-danger/10 border-danger/20 group-hover:bg-danger/15 group-hover:border-danger/40',
                onClick: actions.expire,
                disabled: busy || locked,
              },
            ] as const
          ).map((a) => (
            <button
              key={a.label}
              type="button"
              disabled={a.disabled}
              onClick={a.onClick}
              className="group flex flex-col items-start gap-2.5 sm:gap-3 rounded-2xl border border-fd-border/80 bg-gradient-to-b from-fd-card to-fd-card/70 p-3 sm:p-4 text-left shadow-2xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-fd-primary/45 hover:shadow-xs active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
            >
              <span
                className={`grid size-8 sm:size-9 place-items-center rounded-xl border transition-all duration-200 ${a.tone}`}
              >
                <a.icon className="size-4 sm:size-4.5" strokeWidth={1.8} />
              </span>
              <span className="flex flex-col">
                <span className="text-sm sm:text-[15px] font-semibold text-fd-foreground">
                  {a.label}
                </span>
                <span className="text-[11px] sm:text-xs text-fd-muted-foreground">{a.note}</span>
              </span>
            </button>
          ))}
        </div>

        <div aria-live="polite" className="min-h-12">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                key={message.text}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium ${toneClass[message.tone]}`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Surface inset className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-fd-border px-4 py-3">
            <span className="flex items-center gap-2 text-sm font-medium text-fd-foreground">
              <IconDatabase className="size-4 text-fd-primary" strokeWidth={1.75} /> On this device
            </span>
            <span className="tabular text-xs text-fd-muted-foreground">
              {storedKeys.length} record{storedKeys.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto p-3">
            {storedKeys.length === 0 ? (
              <span className="px-1 py-2 text-sm text-fd-muted-foreground">
                Nothing stored yet. Type in the form and each edit appears here.
              </span>
            ) : (
              storedKeys.map((key) => {
                const isCheckpoint = key.includes('checkpoint');
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 rounded-xl bg-fd-card px-3 py-2"
                  >
                    <span className="truncate font-mono text-xs text-fd-foreground/90">
                      {key.split('::').slice(-2).join('::')}
                    </span>
                    <Badge tone={isCheckpoint ? 'success' : 'accent'}>
                      {isCheckpoint ? 'Checkpoint' : 'Intent'}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </Surface>

        <button
          type="button"
          onClick={actions.reset}
          disabled={busy}
          className={`${buttonClass('ghost', 'sm')} -ml-3 w-fit`}
        >
          <IconTrash className="size-3.5" /> Clear the demo’s records
        </button>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-fd-border bg-fd-background px-4 py-3 text-[15px] text-fd-foreground outline-none transition-[border-color,box-shadow] placeholder:text-fd-muted-foreground/70 focus:border-fd-primary focus:ring-4 focus:ring-fd-primary/15 disabled:opacity-50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-fd-foreground">
      {label}
      {children}
    </label>
  );
}
