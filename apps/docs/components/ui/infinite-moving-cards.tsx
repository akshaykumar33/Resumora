'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

export interface ScenarioCardItem {
  name: string;
  category?: string;
  scenario: string;
  recovery: string;
  latency?: string;
  status?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const InfiniteMovingCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}: {
  items: ScenarioCardItem[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty('--animation-direction', 'forwards');
      } else {
        containerRef.current.style.setProperty('--animation-direction', 'reverse');
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '24s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '44s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s');
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        'scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]',
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          'flex w-max min-w-full shrink-0 flex-nowrap gap-5 py-4',
          start && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
        )}
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <li
              className="group relative w-[280px] xs:w-[320px] sm:w-[360px] md:w-[380px] max-w-[85vw] shrink-0 overflow-hidden rounded-2xl border border-fd-border/70 bg-gradient-to-b from-fd-card/95 via-fd-card/80 to-fd-card/50 p-4 sm:p-5 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-fd-primary/50 hover:shadow-[0_0_28px_-6px_color-mix(in_oklch,var(--color-fd-primary)_24%,transparent)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-fd-primary/35 before:to-transparent"
              key={`${item.name}-${idx}`}
            >
              <div className="flex flex-col gap-3">
                {/* Header: Event Type & Status Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-fd-border/50 pb-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border/60 bg-fd-muted/40 px-2 py-0.5 text-[11px] font-semibold text-fd-foreground">
                    {Icon && <Icon className="size-3 text-fd-primary" />}
                    {item.name}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10.5px] font-medium text-success">
                    <span className="size-1.5 rounded-full bg-success animate-pulse" />
                    {item.status ?? 'Zero data loss'}
                  </span>
                </div>

                {/* Scenario details */}
                <p className="text-[12px] leading-relaxed text-fd-foreground/85 font-medium">
                  {item.scenario}
                </p>

                {/* Technical recovery resolution banner */}
                <div className="flex items-center justify-between gap-2 rounded-xl border border-fd-primary/20 bg-fd-primary/5 px-2.5 py-1.5 font-mono text-[11px] text-fd-foreground/90">
                  <span className="truncate text-fd-primary font-sans font-medium text-[11.5px]">
                    {item.recovery}
                  </span>
                  {item.latency && (
                    <span className="shrink-0 rounded bg-fd-primary/10 px-1.5 py-0.5 text-[10px] text-fd-primary font-mono">
                      {item.latency}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
