'use client';

import { useEffect, useState } from 'react';
import { Camera, PenLine, RotateCcw, Zap } from 'lucide-react';

type Kind = 'intent' | 'checkpoint' | 'crash' | 'recover';

const EVENTS: { kind: Kind; title: string; detail: string }[] = [
  { kind: 'intent', title: 'Intent #1', detail: 'amount = 1200' },
  { kind: 'intent', title: 'Intent #2', detail: "note = 'Roof damage'" },
  { kind: 'checkpoint', title: 'Checkpoint at #2', detail: 'step 3 of 5 saved, intents pruned' },
  { kind: 'intent', title: 'Intent #3', detail: 'photos = 4' },
  { kind: 'crash', title: 'Tab crashed', detail: 'everything in memory is gone' },
  { kind: 'recover', title: 'Work restored', detail: 'checkpoint #2, then 1 intent replayed' },
];

const ICON = { intent: PenLine, checkpoint: Camera, crash: Zap, recover: RotateCcw } as const;

const TONE: Record<Kind, string> = {
  intent: 'text-fd-primary border-fd-primary/40 bg-fd-primary/10',
  checkpoint: 'text-fd-primary-foreground border-fd-primary bg-fd-primary',
  crash: 'text-amber-700 border-amber-500/50 bg-amber-500/15 dark:text-amber-300',
  recover: 'text-emerald-700 border-emerald-500/50 bg-emerald-500/15 dark:text-emerald-300',
};

// Plays the recovery story on a loop: each step shows how Resumora records, survives and
// restores. Under reduced motion every event is shown at once.
export function ContinuityTimeline() {
  const [shown, setShown] = useState(EVENTS.length);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setShown(1);
    const timer = setInterval(() => {
      setShown((n) => (n >= EVENTS.length + 2 ? 1 : n + 1));
    }, 1100);
    return () => clearInterval(timer);
  }, []);

  const crashed = shown >= 5 && shown < 6;

  return (
    <figure
      aria-label="Example continuity timeline: two edits, a checkpoint, another edit, a tab crash, then recovery"
      className="relative overflow-hidden rounded-2xl border bg-fd-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_40px_-12px_rgb(15_80_75/0.25)]"
    >
      <div className="flex items-center justify-between border-b px-5 py-3">
        <span className="text-sm font-medium">Continuity Timeline</span>
        <span className="font-mono text-xs text-fd-muted-foreground">inspection-4471</span>
      </div>

      <ol className="relative flex flex-col gap-1 p-5">
        <span aria-hidden className="absolute bottom-8 left-[2.15rem] top-8 w-px bg-fd-border" />
        {EVENTS.map((event, i) => {
          const Icon = ICON[event.kind];
          const visible = i < shown;
          return (
            <li
              key={event.title}
              className={`relative flex items-center gap-4 rounded-lg px-1 py-2 transition-all duration-500 ease-out ${
                visible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
              }`}
            >
              <span
                className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border ${TONE[event.kind]}`}
              >
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-medium">{event.title}</span>
                <span className="truncate font-mono text-xs text-fd-muted-foreground">
                  {event.detail}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-amber-500/10 transition-opacity duration-300 ${
          crashed ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </figure>
  );
}
