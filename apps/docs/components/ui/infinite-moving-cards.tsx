'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

export interface ScenarioCardItem {
  quote: string;
  name: string;
  title: string;
  badge?: string;
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
              className="relative w-[340px] md:w-[420px] max-w-full shrink-0 rounded-2xl border border-fd-border/80 bg-fd-card/75 p-6 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-fd-primary/50 hover:shadow-md"
              key={`${item.name}-${idx}`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/60 px-3 py-1 text-xs font-semibold text-fd-foreground">
                    {Icon && <Icon className="size-3.5 text-fd-primary" />}
                    {item.name}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-fd-muted-foreground">
                    absorbed
                  </span>
                </div>
                <p className="text-sm font-normal leading-relaxed text-fd-foreground/90 text-pretty">
                  "{item.quote}"
                </p>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-800 dark:text-emerald-200">
                  <span className="size-1.5 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="truncate">{item.title}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
