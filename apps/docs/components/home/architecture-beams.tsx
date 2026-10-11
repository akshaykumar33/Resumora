'use client';

import { forwardRef, useRef, type ReactNode } from 'react';
import {
  IconDatabase,
  IconFileDescription,
  IconPlugConnected,
  IconServer2,
  IconShoppingCart,
  IconWriting,
} from '@tabler/icons-react';
import { AnimatedBeam } from '@/components/ui/animated-beam';
import { LogoMark } from '@/components/logo';

const Node = forwardRef<HTMLDivElement, { children: ReactNode; label: string; big?: boolean }>(
  ({ children, label, big }, ref) => (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div
        ref={ref}
        className={`z-10 grid place-items-center rounded-xl sm:rounded-2xl border border-fd-border/80 bg-gradient-to-b from-fd-card to-fd-card/85 backdrop-blur-md shadow-xs transition-all duration-300 hover:scale-105 hover:border-fd-primary/50 hover:shadow-[0_0_20px_-4px_color-mix(in_oklch,var(--color-fd-primary)_25%,transparent)] ${
          big
            ? 'size-13 xs:size-16 sm:size-20 text-fd-primary shadow-lg shadow-fd-primary/15'
            : 'size-10 xs:size-12 sm:size-14 text-fd-foreground'
        }`}
      >
        {children}
      </div>
      <span className="max-w-[76px] sm:max-w-none text-center text-[10px] sm:text-xs font-medium leading-tight text-fd-muted-foreground">
        {label}
      </span>
    </div>
  ),
);
Node.displayName = 'Node';

/**
 * How Resumora sits in an app, drawn with animated beams: your app's screens send intents into
 * the runtime, and the runtime persists them through whichever storage adapter you choose.
 */
export function ArchitectureBeams() {
  const container = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLDivElement>(null);
  const checkout = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const idb = useRef<HTMLDivElement>(null);
  const memory = useRef<HTMLDivElement>(null);
  const custom = useRef<HTMLDivElement>(null);
  const icon = 'size-4 xs:size-5 sm:size-6';
  const beam = {
    containerRef: container,
    duration: 3.5,
    pathColor: 'var(--color-fd-border)',
    pathOpacity: 0.85,
    gradientStartColor: 'var(--color-fd-primary)',
    gradientStopColor: 'var(--accent-2)',
  };

  return (
    <div
      ref={container}
      className="relative mx-auto flex w-full max-w-3xl items-center justify-between gap-2 xs:gap-4 sm:gap-6 overflow-hidden rounded-2xl sm:rounded-3xl border border-fd-border/80 bg-fd-card/75 px-3 xs:px-6 sm:px-8 md:px-14 py-8 sm:py-12 backdrop-blur-md shadow-xs"
    >
      <div className="flex flex-col gap-5 sm:gap-8">
        <Node ref={form} label="Claim form">
          <IconFileDescription className={icon} strokeWidth={1.75} />
        </Node>
        <Node ref={editor} label="Editor">
          <IconWriting className={icon} strokeWidth={1.75} />
        </Node>
        <Node ref={checkout} label="Checkout">
          <IconShoppingCart className={icon} strokeWidth={1.75} />
        </Node>
      </div>

      <Node ref={core} label="@resumora/core" big>
        <LogoMark className="size-6 xs:size-8 sm:size-10" />
      </Node>

      <div className="flex flex-col gap-6 sm:gap-8">
        <Node ref={idb} label="IndexedDB">
          <IconDatabase className={icon} strokeWidth={1.75} />
        </Node>
        <Node ref={memory} label="Memory">
          <IconServer2 className={icon} strokeWidth={1.75} />
        </Node>
        <Node ref={custom} label="Your adapter">
          <IconPlugConnected className={icon} strokeWidth={1.75} />
        </Node>
      </div>

      <AnimatedBeam {...beam} fromRef={form} toRef={core} curvature={-40} />
      <AnimatedBeam {...beam} fromRef={editor} toRef={core} />
      <AnimatedBeam {...beam} fromRef={checkout} toRef={core} curvature={40} />
      <AnimatedBeam {...beam} fromRef={core} toRef={idb} curvature={-40} delay={1} />
      <AnimatedBeam {...beam} fromRef={core} toRef={memory} delay={1} />
      <AnimatedBeam {...beam} fromRef={core} toRef={custom} curvature={40} delay={1} />
    </div>
  );
}
