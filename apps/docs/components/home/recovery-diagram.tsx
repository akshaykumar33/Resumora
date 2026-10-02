'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Camera, RotateCcw, Zap } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The recovery mechanism, drawn as it happens: five intents arrive, a checkpoint covers the
 * first three (which are pruned), the tab crashes, and restore returns the checkpoint plus
 * the two intents after it. Plays once when scrolled into view.
 */
export function RecoveryDiagram() {
  const reduce = useReducedMotion();
  const at = (seconds: number) => (reduce ? 0 : seconds);
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 10 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.5, delay: at(delay), ease: EASE },
  });

  return (
    <figure
      aria-label="Five intents are recorded. A checkpoint covers the first three, which are pruned. The tab crashes. Restore returns the checkpoint plus intents four and five."
      className="rounded-2xl border bg-fd-card p-6 md:p-8"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-end gap-2 md:gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.div
              key={n}
              {...enter(n * 0.18)}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <motion.div
                initial={{ opacity: 1 }}
                whileInView={{ opacity: n <= 3 ? 0.3 : 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: at(1.6) }}
                className="grid h-12 w-full place-items-center rounded-lg border border-fd-primary/40 bg-fd-primary/10 font-mono text-sm text-fd-primary"
              >
                #{n}
              </motion.div>
              <span className="text-xs text-fd-muted-foreground">intent</span>
            </motion.div>
          ))}
        </div>

        <motion.div {...enter(1.2)} className="flex items-center gap-3">
          <div className="flex w-[calc(60%-0.25rem)] items-center gap-2 rounded-lg bg-fd-primary px-3 py-2 text-sm font-medium text-fd-primary-foreground">
            <Camera className="size-4" strokeWidth={1.75} /> Checkpoint at #3, intents pruned
          </div>
        </motion.div>

        <motion.div
          {...enter(2.1)}
          className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-800 dark:text-amber-200"
        >
          <Zap className="size-4" strokeWidth={1.75} /> Tab crashes. Memory is gone, storage isn’t.
        </motion.div>

        <motion.div
          {...enter(2.8)}
          className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-800 dark:text-emerald-200"
        >
          <RotateCcw className="size-4" strokeWidth={1.75} /> Restore: checkpoint state, then replay
          #4 and #5
        </motion.div>
      </div>
    </figure>
  );
}
