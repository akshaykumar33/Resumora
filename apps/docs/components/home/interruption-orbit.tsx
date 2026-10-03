'use client';

import {
  BatteryLow,
  KeyRound,
  Layers,
  RefreshCw,
  Rocket,
  WifiOff,
  Zap,
  CloudOff,
} from 'lucide-react';
import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import { LogoMark } from '@/components/logo';

const chip =
  'grid size-full place-items-center rounded-full border border-fd-border/80 bg-fd-card/90 text-fd-primary shadow-sm backdrop-blur-xs transition-all duration-300 hover:scale-110 hover:border-fd-primary/60 hover:shadow-md';

/** The interruptions Resumora absorbs, orbiting the runtime at its centre. */
export function InterruptionOrbit() {
  return (
    <div className="relative flex h-[380px] sm:h-[440px] w-full items-center justify-center overflow-hidden">
      <div className="grid size-20 sm:size-24 place-items-center rounded-full border border-fd-primary/20 bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-fd-primary)_25%,transparent),transparent_70%)] shadow-lg shadow-fd-primary/10">
        <LogoMark className="size-10 sm:size-14 text-fd-primary" />
      </div>
      <OrbitingCircles iconSize={44} radius={120} duration={22}>
        <span className={chip} title="Tab crash">
          <Zap className="size-5" strokeWidth={1.75} />
        </span>
        <span className={chip} title="Token expired">
          <KeyRound className="size-5" strokeWidth={1.75} />
        </span>
        <span className={chip} title="Offline">
          <WifiOff className="size-5" strokeWidth={1.75} />
        </span>
        <span className={chip} title="Accidental refresh">
          <RefreshCw className="size-5" strokeWidth={1.75} />
        </span>
      </OrbitingCircles>
      <OrbitingCircles iconSize={48} radius={190} reverse duration={30}>
        <span className={chip} title="New deploy">
          <Rocket className="size-5" strokeWidth={1.75} />
        </span>
        <span className={chip} title="Dead battery">
          <BatteryLow className="size-5" strokeWidth={1.75} />
        </span>
        <span className={chip} title="Discarded tab">
          <Layers className="size-5" strokeWidth={1.75} />
        </span>
        <span className={chip} title="Server 500">
          <CloudOff className="size-5" strokeWidth={1.75} />
        </span>
      </OrbitingCircles>
    </div>
  );
}
