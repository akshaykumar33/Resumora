'use client';

import { useEffect, useRef, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { ArrowUpRight, Cpu, Layers, RefreshCw, ShieldCheck } from 'lucide-react';

const REPO = 'https://github.com/akshaykumar33/Resumora';

const STATS = [
  {
    id: 'deps',
    tag: 'Core Invariant',
    icon: Cpu,
    value: 0,
    suffix: '',
    title: 'Zero dependencies in core',
    desc: '@resumora/core has zero external dependencies and remains fully decoupled from browser APIs.',
    proof: 'core/package.json',
    href: `${REPO}/blob/main/packages/core/package.json`,
  },
  {
    id: 'crashes',
    tag: 'CI Verification',
    icon: RefreshCw,
    value: 3,
    suffix: ' topologies',
    title: 'Crash topologies in CI',
    desc: 'Simulates tab kill (SIGKILL), unexpected page reload, and whole-browser crash on every pull request.',
    proof: 'e2e/crash-recovery.spec.js',
    href: `${REPO}/blob/main/e2e/crash-recovery.spec.js`,
  },
  {
    id: 'tests',
    tag: 'Formal Invariants',
    icon: ShieldCheck,
    value: 40,
    suffix: ' tests',
    title: 'Automated invariant tests',
    desc: 'Guarantees checkpoint isolation, intent ordering, and deterministic state restoration.',
    proof: 'tests/invariants',
    href: `${REPO}/tree/main/tests`,
  },
  {
    id: 'auth',
    tag: 'Security Model',
    icon: Layers,
    value: 6,
    suffix: ' steps',
    title: 'Strict auth lifecycle',
    desc: 'Persistence never confers auth. Strictly enforces Lock → Reauth → Reauthz → Unlock → Revalidate → Reconcile.',
    proof: 'Recovery architecture',
    href: '/docs/concepts/recovery-model',
  },
];

/**
 * High-craft architectural verification strip: four telemetry cards with NumberFlow counters,
 * contextual invariants, and direct links to CI and code proofs.
 */
export function ProofStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="mx-auto w-full max-w-6xl px-gutter py-8 md:py-10">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-fd-border/70 bg-gradient-to-b from-fd-card/90 via-fd-card/75 to-fd-card/45 p-4.5 sm:p-5 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-fd-primary/50 hover:shadow-[0_0_24px_-4px_color-mix(in_oklch,var(--color-fd-primary)_22%,transparent)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-fd-primary/35 before:to-transparent"
            >
              {/* Card top: category badge & icon */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-medium uppercase tracking-wider text-fd-muted-foreground">
                    <span className="size-1.5 rounded-full bg-fd-primary/80" />
                    {s.tag}
                  </span>
                  <span className="grid size-6.5 place-items-center rounded-lg border border-fd-border/60 bg-fd-muted/30 text-fd-muted-foreground transition-colors group-hover:border-fd-primary/40 group-hover:text-fd-primary">
                    <Icon className="size-3.5" />
                  </span>
                </div>

                {/* Number counter */}
                <div className="mt-3.5 flex items-baseline gap-1 font-display text-3xl font-semibold tracking-tight text-fd-foreground sm:text-4xl">
                  <NumberFlow
                    value={seen ? s.value : 0}
                    transformTiming={{ duration: 1100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                    spinTiming={{ duration: 1100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                  {s.suffix && (
                    <span className="font-sans text-xs font-normal text-fd-muted-foreground">
                      {s.suffix}
                    </span>
                  )}
                </div>

                <h3 className="mt-1.5 text-xs font-semibold tracking-tight text-fd-foreground">
                  {s.title}
                </h3>

                <p className="mt-1 text-[11.5px] leading-relaxed text-fd-muted-foreground">
                  {s.desc}
                </p>
              </div>

              {/* Bottom verification link */}
              <div className="mt-4 border-t border-fd-border/50 pt-2.5">
                <a
                  href={s.href}
                  className="inline-flex items-center gap-1 rounded-md border border-fd-border/50 bg-fd-muted/30 px-2 py-0.5 text-[10.5px] font-mono font-medium text-fd-muted-foreground transition-colors hover:border-fd-primary/40 hover:text-fd-primary"
                >
                  <span className="truncate">{s.proof}</span>
                  <ArrowUpRight className="size-3 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
