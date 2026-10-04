'use client';

import { Fragment } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Segment = { text: string; em?: boolean };

/**
 * The hero headline: each word rises out of a soft blur in sequence, and the emphasised words
 * carry the italic caramel sheen. Static under reduced motion. The full sentence stays in the
 * DOM as text, so it reads correctly to screen readers and search engines.
 */
export function DisplayHeadline({
  segments,
  className,
}: {
  segments: Segment[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  let index = 0;

  return (
    <h1 className={className}>
      {segments.map((seg, s) =>
        seg.text.split(' ').map((word, w) => {
          const i = index++;
          return (
            <Fragment key={`${s}-${w}`}>
              <motion.span
                className={`inline-block ${seg.em ? 'display-em' : ''}`}
                initial={reduce ? false : { opacity: 0, y: '0.4em', filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>{' '}
            </Fragment>
          );
        }),
      )}
    </h1>
  );
}
