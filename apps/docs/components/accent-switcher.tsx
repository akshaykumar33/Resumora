'use client';

import { useEffect, useState } from 'react';
import { ACCENT_STORAGE_KEY } from '@/lib/accent';

export const ACCENTS = [
  { id: 'teal', label: 'Teal', swatch: 'oklch(0.55 0.1 185)' },
  { id: 'emerald', label: 'Emerald', swatch: 'oklch(0.6 0.16 155)' },
  { id: 'cyan', label: 'Cyan', swatch: 'oklch(0.6 0.15 205)' },
  { id: 'iris', label: 'Iris', swatch: 'oklch(0.55 0.17 275)' },
  { id: 'ember', label: 'Ember', swatch: 'oklch(0.62 0.16 42)' },
] as const;

/** Five accent swatches in the header. The choice is remembered on this device. */
export function AccentSwitcher() {
  const [accent, setAccent] = useState<string>('teal');

  useEffect(() => {
    setAccent(document.documentElement.dataset.accent ?? 'teal');
  }, []);

  const choose = (id: string) => {
    setAccent(id);
    if (id === 'teal') delete document.documentElement.dataset.accent;
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
