'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Staggers every child marked `data-reveal` up into place as the group scrolls into view, so a
 * board of cards arrives as one sequence instead of popping in together.
 */
export function StaggerReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from('[data-reveal]', {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: scope.current, start: 'top 85%' },
      });
    },
    { scope },
  );
  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}

/**
 * Hero depth: the colour mesh drifts down and the product card lifts as the page scrolls away,
 * so the hero reads as layered space rather than a flat picture.
 */
export function HeroParallax({ children, className }: { children: ReactNode; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced()) return;
      const trigger = { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-parallax="back"]', { yPercent: 18, ease: 'none', scrollTrigger: trigger });
      gsap.to('[data-parallax="front"]', { yPercent: -12, ease: 'none', scrollTrigger: trigger });
    },
    { scope },
  );
  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
