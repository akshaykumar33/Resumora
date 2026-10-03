'use client';

import type { COBEOptions } from 'cobe';
import { Globe } from '@/components/ui/globe';

// The Magic UI globe, tuned for Resumora's dark-first look: slate land dots, a teal glow and
// teal markers on cities where users fill in long forms.
const CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.25,
  dark: 1,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 5,
  baseColor: [0.32, 0.38, 0.4],
  markerColor: [0.45, 0.88, 0.78],
  glowColor: [0.2, 0.45, 0.42],
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

export function ResumoraGlobe() {
  return <Globe className="top-0" config={CONFIG} />;
}
