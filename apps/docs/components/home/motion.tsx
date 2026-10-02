'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Fades content up as it scrolls into view. Reduced motion keeps the fade and drops the travel. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Reveals a headline word by word, 45ms apart, so the promise lands as one sentence. */
export function HeroTitle({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: reduce ? 0 : '105%', opacity: reduce ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.045, ease: EASE_OUT }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
