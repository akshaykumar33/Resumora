'use client';

import type { COBEOptions } from 'cobe';
import { useMemo } from 'react';
import { Globe } from '@/components/ui/globe';
import { usePalette } from '@/components/palette-switcher';
import type { PaletteId } from '@/lib/palette';

// The Magic UI globe in the active palette: land dots in the palette's neutral, its accent for the
// glow and the markers on cities where users fill in long forms.
const CONFIG: Omit<COBEOptions, 'baseColor' | 'markerColor' | 'glowColor'> = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.25,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 4.2,
  markers: [
    { location: [19.076, 72.8777], size: 0.08 },
    { location: [51.5072, -0.1276], size: 0.07 },
    { location: [40.7128, -74.006], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.07 },
    { location: [35.6762, 139.6503], size: 0.07 },
    { location: [52.52, 13.405], size: 0.05 },
    { location: [-33.8688, 151.2093], size: 0.06 },
    { location: [1.3521, 103.8198], size: 0.05 },
    { location: [37.7749, -122.4194], size: 0.07 },
  ],
};

type Rgb = [number, number, number];
const COLORS: Record<PaletteId, { baseColor: Rgb; markerColor: Rgb; glowColor: Rgb }> = {
  cocoa: {
    baseColor: [0.34, 0.24, 0.17],
    markerColor: [0.96, 0.72, 0.46],
    glowColor: [0.5, 0.32, 0.18],
  },
  espresso: {
    baseColor: [0.28, 0.25, 0.23],
    markerColor: [0.93, 0.58, 0.38],
    glowColor: [0.45, 0.28, 0.18],
  },
  matcha: {
    baseColor: [0.2, 0.3, 0.22],
    markerColor: [0.72, 0.9, 0.55],
    glowColor: [0.25, 0.45, 0.25],
  },
  berry: {
    baseColor: [0.24, 0.24, 0.4],
    markerColor: [0.98, 0.5, 0.6],
    glowColor: [0.4, 0.22, 0.42],
  },
};

export function ResumoraGlobe() {
  const palette = usePalette();
  const config = useMemo(() => ({ ...CONFIG, ...COLORS[palette] }), [palette]);
  return <Globe className="relative inset-auto max-w-none" config={config} />;
}
