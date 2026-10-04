'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isSoundMuted, playClick, setSoundMuted } from '@/lib/sound';

export function SoundToggle() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    setMuted(isSoundMuted());
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ muted: boolean }>;
      if (custom.detail) setMuted(custom.detail.muted);
    };
    window.addEventListener('resumora:sound-toggle', handler);
    return () => window.removeEventListener('resumora:sound-toggle', handler);
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
    if (!next) {
      setTimeout(() => playClick(), 50);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={muted ? 'Enable polite UI micro-sounds' : 'Mute UI micro-sounds'}
      aria-label="Toggle UI micro-sounds"
      className="inline-flex items-center gap-1.5 rounded-full border border-fd-border/70 bg-fd-card/80 px-2.5 py-1 text-xs text-fd-muted-foreground transition-all hover:bg-fd-muted hover:text-fd-foreground active:scale-95"
    >
      {muted ? (
        <VolumeX className="size-3.5 text-fd-muted-foreground" />
      ) : (
        <Volume2 className="size-3.5 text-fd-primary animate-pulse" />
      )}
      <span className="font-mono text-[11px]">{muted ? 'Sound Off' : 'Sound On'}</span>
    </button>
  );
}
