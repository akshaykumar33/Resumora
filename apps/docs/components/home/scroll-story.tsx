'use client';

import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react';
import { Camera, PenLine, RotateCcw, Zap } from 'lucide-react';

const STEPS = [
  {
    icon: PenLine,
    title: 'Every edit is recorded',
    body: 'Each change becomes a small, numbered intent, saved the moment the browser confirms the write.',
  },
  {
    icon: Camera,
    title: 'Milestones become checkpoints',
    body: 'At the end of a step, the state is snapshotted with a checksum, and the intents it covers are pruned.',
  },
  {
    icon: Zap,
    title: 'Then the tab crashes',
    body: 'A deploy, a dead battery, a discarded tab. Everything in memory is gone. Storage is not.',
  },
  {
    icon: RotateCcw,
    title: 'And the work comes back',
    body: 'Restore returns the checkpoint plus every intent after it. Your app replays them, exactly where the user left off.',
  },
] as const;

type Field = { label: string; value: string };
const FRAMES: {
  status: string;
  tone: 'ok' | 'warn' | 'neutral';
  fields: Field[];
  caption: string;
}[] = [
  {
    status: 'Recording',
    tone: 'neutral',
    caption: '3 intents journaled',
    fields: [
      { label: 'Claimant', value: 'Mira Okafor' },
      { label: 'Amount', value: '4,250 EUR' },
      { label: 'What happened', value: 'Pipe burst in the kitchen' },
    ],
  },
  {
    status: 'Checkpoint #3 saved',
    tone: 'ok',
    caption: 'checksum 7c1e09a4, intents pruned',
    fields: [
      { label: 'Claimant', value: 'Mira Okafor' },
      { label: 'Amount', value: '4,250 EUR' },
      { label: 'What happened', value: 'Pipe burst in the kitchen' },
    ],
  },
  {
    status: 'Tab crashed',
    tone: 'warn',
    caption: 'memory lost',
    fields: [
      { label: 'Claimant', value: '' },
      { label: 'Amount', value: '' },
      { label: 'What happened', value: '' },
    ],
  },
  {
    status: 'Restored',
    tone: 'ok',
    caption: 'checkpoint #3, then 1 intent replayed',
    fields: [
      { label: 'Claimant', value: 'Mira Okafor' },
      { label: 'Amount', value: '4,250 EUR' },
      { label: 'What happened', value: 'Pipe burst in the kitchen. Two rooms affected.' },
    ],
  },
];

const TONE = {
  ok: 'border border-success/25 bg-success/10 text-success dark:text-success',
  warn: 'border border-warning/25 bg-warning/10 text-warning dark:text-warning',
  neutral: 'border border-fd-primary/25 bg-fd-primary/10 text-fd-primary',
};

/**
 * A pinned section that tells the recovery story as you scroll: four steps on the left, and a
 * claim form on the right that records, checkpoints, crashes and recovers in step with them.
 * Scrolling drives the progress, so it can be scrubbed both ways.
 */
export function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const [step, setStep] = useState(0);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setStep(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length))));
  });

  const frame = FRAMES[step]!;

  return (
    <section ref={ref} className="relative" style={{ height: `${STEPS.length * 70}vh` }}>
      <div className="sticky top-0 flex min-h-[100dvh] items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Watch a crash happen. Lose nothing.
            </h2>
            <ol className="relative flex flex-col gap-2.5 pl-6">
              <span aria-hidden className="absolute inset-y-1 left-0 w-px bg-fd-border/70" />
              <motion.span
                aria-hidden
                className="absolute left-0 top-1 w-px origin-top bg-fd-primary"
                style={{ height: bar }}
              />
              {STEPS.map((s, i) => {
                const active = i === step;
                const Icon = s.icon;
                return (
                  <li
                    key={s.title}
                    className={`flex flex-col gap-1.5 rounded-2xl p-4 transition-all duration-300 ${
                      active
                        ? 'border border-fd-border/80 bg-fd-card/90 shadow-sm'
                        : 'opacity-65 hover:opacity-90'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 font-medium text-fd-foreground">
                      <Icon className="size-4 text-fd-primary" strokeWidth={1.75} />
                      {s.title}
                    </span>
                    <span
                      className={`text-sm leading-relaxed text-fd-muted-foreground transition-all duration-300 ${
                        active ? 'max-h-24 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                      }`}
                    >
                      {s.body}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--color-fd-primary)_18%,transparent),transparent)] blur-2xl"
            />
            <motion.div
              animate={
                step === 2
                  ? { x: [0, -8, 7, -5, 3, 0], rotate: [0, -0.6, 0.5, 0] }
                  : { x: 0, rotate: 0 }
              }
              transition={{ duration: 0.5 }}
              className="overflow-hidden rounded-3xl border border-fd-border/80 bg-fd-card/95 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between border-b border-fd-border/70 px-6 py-4">
                <span className="text-sm font-semibold text-fd-foreground">Insurance claim</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={frame.status}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${TONE[frame.tone]}`}
                  >
                    {frame.status}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex flex-col gap-4 p-6">
                {frame.fields.map((f) => (
                  <div key={f.label} className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-fd-muted-foreground">{f.label}</span>
                    <div className="flex h-11 items-center overflow-hidden rounded-xl border border-fd-border/70 bg-fd-background/70 px-3.5 text-sm">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={f.value || 'empty'}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="truncate text-fd-foreground"
                        >
                          {f.value || ' '}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-fd-border/60 bg-fd-muted/20 px-6 py-3 font-mono text-xs text-fd-muted-foreground">
                {frame.caption}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
