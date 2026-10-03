'use client';

import type { HTMLAttributes, ReactNode } from 'react';

/**
 * A card with a soft light that follows the pointer. The position is written straight to CSS
 * variables, so moving the mouse never re-renders React.
 */
export function SpotlightCard({
  children,
  className = '',
  beam = false,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
  beam?: boolean;
}) {
  return (
    <div
      {...rest}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
      }}
      className={`spotlight ${beam ? 'border-beam' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
