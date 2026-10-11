'use client';

import type { COBEOptions } from 'cobe';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';
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
const COLORS: Record<string, { baseColor: Rgb; markerColor: Rgb; glowColor: Rgb }> = {
  claude: {
    baseColor: [0.2, 0.18, 0.16],
    markerColor: [0.95, 0.55, 0.3],
    glowColor: [0.85, 0.45, 0.18],
  },
  neon: {
    baseColor: [0.08, 0.16, 0.1],
    markerColor: [0.25, 1.0, 0.45],
    glowColor: [0.15, 0.9, 0.35],
  },
  chocolate: {
    baseColor: [0.22, 0.16, 0.12],
    markerColor: [0.92, 0.62, 0.38],
    glowColor: [0.65, 0.38, 0.18],
  },
  onyx: {
    baseColor: [0.18, 0.18, 0.2],
    markerColor: [0.92, 0.94, 0.98],
    glowColor: [0.4, 0.42, 0.46],
  },
  indigo: {
    baseColor: [0.14, 0.12, 0.26],
    markerColor: [0.65, 0.45, 1.0],
    glowColor: [0.45, 0.25, 0.95],
  },
  cobalt: {
    baseColor: [0.12, 0.18, 0.28],
    markerColor: [0.35, 0.65, 1.0],
    glowColor: [0.2, 0.45, 0.9],
  },
  emerald: {
    baseColor: [0.08, 0.16, 0.1],
    markerColor: [0.25, 1.0, 0.45],
    glowColor: [0.15, 0.9, 0.35],
  },
  titanium: {
    baseColor: [0.22, 0.16, 0.12],
    markerColor: [0.92, 0.62, 0.38],
    glowColor: [0.65, 0.38, 0.18],
  },
  cocoa: {
    baseColor: [0.22, 0.16, 0.12],
    markerColor: [0.92, 0.62, 0.38],
    glowColor: [0.65, 0.38, 0.18],
  },
};

export function ResumoraGlobe() {
  const palette = usePalette();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const themeColors = COLORS[palette] ?? COLORS.claude;
  const config = useMemo(
    () => ({
      ...CONFIG,
      dark: isDark ? 1 : 0,
      baseColor: isDark ? themeColors.baseColor : ([0.92, 0.92, 0.95] as Rgb),
      markerColor: themeColors.markerColor,
      glowColor: isDark ? themeColors.glowColor : ([1, 0.94, 0.88] as Rgb),
      mapBrightness: isDark ? 4.2 : 1.2,
      diffuse: isDark ? 1.2 : 1.5,
    }),
    [themeColors, isDark],
  );
  return <Globe className="relative inset-auto max-w-none" config={config} />;
}
