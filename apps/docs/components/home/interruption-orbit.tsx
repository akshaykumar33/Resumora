'use client';

import { useEffect, useState, type ComponentType } from 'react';
import {
  BatteryLow,
  CloudOff,
  KeyRound,
  Layers,
  RefreshCw,
  Rocket,
  WifiOff,
  Zap,
} from 'lucide-react';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import { LogoMark } from '@/components/logo';

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

const INNER: [Icon, string][] = [
  [Zap, 'Tab crash'],
  [KeyRound, 'Token expired'],
  [WifiOff, 'Offline'],
  [RefreshCw, 'Accidental refresh'],
];
const OUTER: [Icon, string][] = [
  [Rocket, 'New deploy'],
  [BatteryLow, 'Dead battery'],
  [Layers, 'Discarded tab'],
  [CloudOff, 'Server error'],
];

/** One interruption: an icon chip that names itself on hover or keyboard focus. */
function Chip({ icon: I, label }: { icon: Icon; label: string }) {
  return (
    <span
      tabIndex={0}
      aria-label={label}
      className="group/chip relative grid size-full cursor-default place-items-center rounded-full border border-fd-border bg-fd-card text-fd-primary shadow-md outline-none transition-[border-color,box-shadow] hover:border-fd-primary/60 hover:shadow-[0_0_24px_-4px_var(--color-fd-primary)] focus-visible:border-fd-primary"
    >
      <I className="size-4 sm:size-5" strokeWidth={1.75} />
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full border border-fd-border bg-fd-popover px-2.5 py-1 text-xs font-medium text-fd-foreground opacity-0 shadow-lg transition-[opacity,transform] duration-200 group-hover/chip:translate-y-0 group-hover/chip:opacity-100 group-focus-visible/chip:translate-y-0 group-focus-visible/chip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

/** The interruptions Resumora absorbs, orbiting the runtime at its centre. */
export function InterruptionOrbit() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const innerRadius = isMobile ? 80 : 120;
  const outerRadius = isMobile ? 135 : 190;
  const innerSize = isMobile ? 36 : 44;
  const outerSize = isMobile ? 40 : 48;

  return (
    <div className="relative flex h-[340px] sm:h-[440px] w-full items-center justify-center overflow-hidden [&:has(:hover)_.animate-orbit]:[animation-play-state:paused] [&:has(:focus-visible)_.animate-orbit]:[animation-play-state:paused]">
      <div className="grid size-16 sm:size-24 place-items-center rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-fd-primary)_30%,transparent),transparent_70%)]">
        <LogoMark className="size-9 sm:size-14 text-fd-primary" />
      </div>
      <OrbitingCircles iconSize={innerSize} radius={innerRadius} duration={22}>
        {INNER.map(([icon, label]) => (
          <Chip key={label} icon={icon} label={label} />
        ))}
      </OrbitingCircles>
      <OrbitingCircles iconSize={outerSize} radius={outerRadius} reverse duration={30}>
        {OUTER.map(([icon, label]) => (
          <Chip key={label} icon={icon} label={label} />
        ))}
      </OrbitingCircles>
    </div>
  );
}
