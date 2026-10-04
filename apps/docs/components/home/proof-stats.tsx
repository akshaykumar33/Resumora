'use client';

import { useEffect, useRef, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { ArrowUpRight } from 'lucide-react';

const REPO = 'https://github.com/akshaykumar33/Resumora';

// Real numbers only, and each one links to the thing that proves it.
const STATS = [
  {
    value: 0,
    label: 'runtime dependencies in core',
    proof: 'package.json',
    href: `${REPO}/blob/main/packages/core/package.json`,
  },
  {
    value: 3,
    label: 'crash scenarios run in Chromium on every PR',
    proof: 'e2e spec',
    href: `${REPO}/blob/main/e2e/crash-recovery.spec.js`,
  },
  {
    value: 40,
    label: 'unit tests guarding the invariants',
    proof: 'tests',
    href: `${REPO}/tree/main/tests`,
  },
  {
    value: 6,
    label: 'methods to plug in any storage',
    proof: 'adapter guide',
    href: '/docs/guides/write-a-storage-adapter',
  },
];

/**
 * The proof strip: four numbers that roll up digit by digit (NumberFlow) when the strip scrolls
 * into view, each with a link to its evidence. Reduced motion is handled by NumberFlow itself.
 */
export function ProofStats() {
  const ref = useRef<HTMLDListElement>(null);
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
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <dl ref={ref} className="mx-auto grid w-full max-w-6xl grid-cols-2 px-gutter lg:grid-cols-4">
      {STATS.map((s, i) => (
        <div
          key={s.label}
          className={`group flex flex-col gap-2 py-10 pr-4 ${i % 2 ? 'border-l border-fd-border pl-5' : ''} ${
            i > 0 ? 'lg:border-l lg:border-fd-border lg:pl-8' : ''
          } ${i > 1 ? 'border-t border-fd-border lg:border-t-0' : ''}`}
        >
          <dt className="order-2 max-w-[22ch] text-sm text-fd-muted-foreground">{s.label}</dt>
          <dd className="order-1 font-display text-5xl font-semibold tracking-[-0.04em] text-fd-foreground md:text-6xl">
            <NumberFlow
              value={seen ? s.value : 0}
              transformTiming={{ duration: 1100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              spinTiming={{ duration: 1100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
          </dd>
          <a
            href={s.href}
            className="order-3 inline-flex w-fit items-center gap-1 text-xs font-medium text-fd-primary opacity-80 transition-opacity hover:opacity-100"
          >
            {s.proof}
            <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          </a>
        </div>
      ))}
    </dl>
  );
}
