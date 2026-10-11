'use client';

import { useEffect, useState } from 'react';
import { Camera, CheckCircle2, Pause, Play, PenLine, RotateCcw, Zap } from 'lucide-react';

type Kind = 'intent' | 'checkpoint' | 'crash' | 'recover';

interface EventItem {
  kind: Kind;
  title: string;
  detail: string;
  badge: string;
}

const EVENTS: EventItem[] = [
  { kind: 'intent', title: 'Intent #1 journaled', detail: 'amount = 1,200 EUR', badge: 'RECORDED' },
  {
    kind: 'intent',
    title: 'Intent #2 journaled',
    detail: "note = 'Roof damage'",
    badge: 'RECORDED',
  },
  {
    kind: 'checkpoint',
    title: 'Checkpoint #2 saved',
    detail: 'Checksum 7c1e09a4 · Intents #1 & #2 pruned',
    badge: 'PERSISTED',
  },
  { kind: 'intent', title: 'Intent #3 journaled', detail: 'photos = 4 files', badge: 'RECORDED' },
  {
    kind: 'crash',
    title: 'Tab crashed / discard',
    detail: 'In-memory state destroyed',
    badge: 'INTERRUPTION',
  },
  {
    kind: 'recover',
    title: 'Deterministic restore',
    detail: 'Checkpoint #2 loaded + Intent #3 replayed',
    badge: 'RECOVERED',
  },
];

const ICON = { intent: PenLine, checkpoint: Camera, crash: Zap, recover: RotateCcw } as const;

export function ContinuityTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % EVENTS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = EVENTS[activeStep]!;
  const isCrashed = current.kind === 'crash';

  return (
    <figure
      aria-label="Interactive continuity timeline: intent journaling, checkpoint pruning, crash handling and deterministic restore"
      className="relative overflow-hidden rounded-2xl border border-fd-border/80 bg-fd-card/95 text-left backdrop-blur-xl shadow-[0_12px_44px_-16px_color-mix(in_oklch,var(--color-fd-primary)_25%,transparent)] transition-all duration-300"
    >
      {/* Terminal window header */}
      <div className="flex items-center justify-between border-b border-fd-border/70 bg-fd-muted/30 px-3.5 sm:px-5 py-2.5 sm:py-3">
        <div className="flex items-center gap-2">
          <span className="size-2 sm:size-2.5 rounded-full bg-danger/80" />
          <span className="size-2 sm:size-2.5 rounded-full bg-warning/80" />
          <span className="size-2 sm:size-2.5 rounded-full bg-success/80" />
          <span className="ml-1 sm:ml-2 font-mono text-[11px] sm:text-xs font-medium text-fd-foreground/80">
            resumora::claim-4471
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border/60 bg-fd-background/70 px-2 sm:px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] text-fd-muted-foreground">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            <span className="hidden xs:inline">storage-</span>indexeddb
          </span>
        </div>
      </div>

      {/* Timeline list */}
      <div className="p-3.5 sm:p-5">
        <ol className="relative flex flex-col gap-2">
          {/* Vertical progress spine */}
          <div
            aria-hidden
            className="absolute bottom-5 left-[1.35rem] top-4 w-px bg-fd-border/70"
          />

          {EVENTS.map((event, i) => {
            const Icon = ICON[event.kind];
            const isActive = i === activeStep;
            const isPassed = i < activeStep;

            return (
              <li
                key={event.title}
                onClick={() => {
                  setActiveStep(i);
                  setIsPaused(true);
                }}
                className={`group relative flex cursor-pointer items-center justify-between gap-3.5 rounded-xl px-2 py-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-fd-muted/60 ring-1 ring-fd-border shadow-xs'
                    : 'hover:bg-fd-muted/30 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`relative z-10 grid size-7 shrink-0 place-items-center rounded-lg border transition-all duration-300 ${
                      isActive
                        ? event.kind === 'crash'
                          ? 'border-warning bg-warning/20 text-warning dark:text-warning ring-2 ring-warning/30'
                          : event.kind === 'recover'
                            ? 'border-success bg-success/20 text-success dark:text-success ring-2 ring-success/30'
                            : 'border-fd-primary bg-fd-primary text-fd-primary-foreground ring-2 ring-fd-primary/30'
                        : isPassed
                          ? 'border-fd-border bg-fd-muted text-fd-muted-foreground'
                          : 'border-fd-border/50 bg-fd-background text-fd-muted-foreground/60'
                    }`}
                  >
                    {isPassed && event.kind !== 'crash' ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <Icon className="size-3.5" strokeWidth={1.75} />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-col">
                    <span
                      className={`truncate text-xs font-semibold ${
                        isActive ? 'text-fd-foreground font-medium' : 'text-fd-foreground/80'
                      }`}
                    >
                      {event.title}
                    </span>
                    <span className="truncate font-mono text-[11px] text-fd-muted-foreground">
                      {event.detail}
                    </span>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold transition-colors ${
                    event.kind === 'crash'
                      ? 'bg-warning/15 text-warning dark:text-warning'
                      : event.kind === 'recover'
                        ? 'bg-success/15 text-success dark:text-success'
                        : isActive
                          ? 'bg-fd-primary/15 text-fd-primary'
                          : 'bg-fd-muted text-fd-muted-foreground/80'
                  }`}
                >
                  {event.badge}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Footer bar with scrub controls */}
      <div className="flex items-center justify-between border-t border-fd-border/70 bg-fd-muted/20 px-5 py-2.5 text-xs text-fd-muted-foreground">
        <span className="font-mono text-[11px]">
          Step {activeStep + 1} of {EVENTS.length}
        </span>
        <button
          type="button"
          onClick={() => setIsPaused((p) => !p)}
          className="inline-flex items-center gap-1.5 rounded-md border border-fd-border/60 bg-fd-background px-2.5 py-1 text-[11px] font-medium text-fd-foreground transition-colors hover:bg-fd-muted"
        >
          {isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
          {isPaused ? 'Resume cycle' : 'Pause'}
        </button>
      </div>

      {/* Crash flash overlay */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-warning/10 transition-opacity duration-300 ${
          isCrashed ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </figure>
  );
}
