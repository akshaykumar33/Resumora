'use client';

import { useEffect, useState } from 'react';
import { PALETTES, applyPalette, type PaletteId } from '@/lib/palette';

/** Reads the active palette and follows changes made anywhere (nav, palette, command palette). */
export function usePalette(): PaletteId {
  const [palette, setPalette] = useState<PaletteId>('claude');
  useEffect(() => {
    setPalette((document.documentElement.dataset.palette as PaletteId | undefined) ?? 'claude');
    const onChange = (e: Event) => setPalette((e as CustomEvent<PaletteId>).detail);
    window.addEventListener('resumora:palette', onChange);
    return () => window.removeEventListener('resumora:palette', onChange);
  }, []);
  return palette;
}

/** Four palette swatches: each shows its background with its accent inset. */
export function PaletteSwitcher({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const active = usePalette();
  const dim = size === 'lg' ? 'size-9' : 'size-6';

  return (
    <div role="radiogroup" aria-label="Colour theme" className="flex items-center gap-1.5">
      {PALETTES.map((p) => (
        <button
          key={p.id}
          type="button"
          role="radio"
          aria-checked={active === p.id}
          aria-label={`${p.label} theme`}
          title={p.label}
          onClick={() => applyPalette(p.id)}
          className="grid place-items-center rounded-full p-0.5 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
        >
          <span
            className={`relative grid ${dim} place-items-center overflow-hidden rounded-full border border-fd-border transition-shadow ${
              active === p.id
                ? 'ring-2 ring-fd-primary ring-offset-2 ring-offset-fd-background'
                : ''
            }`}
            style={{ background: p.base }}
          >
            <span className="size-1/2 rounded-full" style={{ background: p.accent }} />
          </span>
        </button>
      ))}
    </div>
  );
}
