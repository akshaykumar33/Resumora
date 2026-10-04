'use client';

import { useEffect, useState } from 'react';
import { ACCENT_STORAGE_KEY } from '@/lib/accent';

export const ACCENTS = [
  { id: 'caramel', label: 'Caramel', swatch: 'oklch(0.72 0.11 62)' },
  { id: 'teal', label: 'Teal', swatch: 'oklch(0.62 0.1 185)' },
  { id: 'emerald', label: 'Emerald', swatch: 'oklch(0.64 0.14 155)' },
  { id: 'iris', label: 'Iris', swatch: 'oklch(0.62 0.13 285)' },
  { id: 'rose', label: 'Rose', swatch: 'oklch(0.64 0.13 15)' },
] as const;

/** Five accent swatches in the header. The choice is remembered on this device. */
export function AccentSwitcher() {
  const [accent, setAccent] = useState<string>('caramel');

  useEffect(() => {
    setAccent(document.documentElement.dataset.accent ?? 'caramel');
  }, []);

  const choose = (id: string) => {
    setAccent(id);
    if (id === 'caramel') delete document.documentElement.dataset.accent;
    else document.documentElement.dataset.accent = id;
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, id);
    } catch {
      // Storage blocked: the choice lasts for this page only.
    }
  };

  return (
    <div role="radiogroup" aria-label="Accent colour" className="flex items-center gap-1.5 px-1">
      {ACCENTS.map((a) => (
        <button
          key={a.id}
          type="button"
          role="radio"
          aria-checked={accent === a.id}
          aria-label={`${a.label} accent`}
          title={a.label}
          onClick={() => choose(a.id)}
          className="grid size-6 place-items-center rounded-full transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
        >
          <span
            className={`size-3.5 rounded-full transition-shadow ${
              accent === a.id
                ? 'ring-2 ring-fd-foreground/70 ring-offset-2 ring-offset-fd-background'
                : ''
            }`}
            style={{ background: a.swatch }}
          />
        </button>
      ))}
    </div>
  );
}
