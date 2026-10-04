export const PALETTE_STORAGE_KEY = 'resumora-palette';

export const PALETTES = [
  {
    id: 'cobalt',
    label: 'Cobalt',
    base: 'oklch(0.14 0.018 255)',
    accent: 'oklch(0.68 0.19 250)',
  },
  {
    id: 'onyx',
    label: 'Onyx',
    base: 'oklch(0.11 0 0)',
    accent: 'oklch(0.92 0 0)',
  },
  {
    id: 'emerald',
    label: 'Emerald',
    base: 'oklch(0.135 0.018 160)',
    accent: 'oklch(0.75 0.17 155)',
  },
  {
    id: 'titanium',
    label: 'Titanium',
    base: 'oklch(0.14 0.008 55)',
    accent: 'oklch(0.78 0.14 55)',
  },
] as const;

export type PaletteId = (typeof PALETTES)[number]['id'];

/** Applies a palette to <html> and remembers it on this device. Cobalt is the default. */
export function applyPalette(id: PaletteId) {
  if (id === 'cobalt') delete document.documentElement.dataset.palette;
  else document.documentElement.dataset.palette = id;
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, id);
  } catch {
    // Storage blocked: the palette lasts for this page only.
  }
  window.dispatchEvent(new CustomEvent('resumora:palette', { detail: id }));
}

/** Sets the palette before first paint, so a returning visitor never sees the default flash. */
export const paletteBootScript = `try{var p=localStorage.getItem('${PALETTE_STORAGE_KEY}');if(p&&p!=='cobalt')document.documentElement.dataset.palette=p}catch(e){}`;
