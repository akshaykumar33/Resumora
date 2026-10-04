export const PALETTE_STORAGE_KEY = 'resumora-palette';

export const PALETTES = [
  { id: 'cocoa', label: 'Cocoa', base: 'oklch(0.2 0.024 52)', accent: 'oklch(0.8 0.115 62)' },
  {
    id: 'espresso',
    label: 'Espresso',
    base: 'oklch(0.15 0.008 55)',
    accent: 'oklch(0.75 0.13 45)',
  },
  { id: 'matcha', label: 'Matcha', base: 'oklch(0.2 0.02 158)', accent: 'oklch(0.83 0.12 130)' },
  {
    id: 'berry',
    label: 'Midnight Berry',
    base: 'oklch(0.2 0.034 272)',
    accent: 'oklch(0.76 0.15 5)',
  },
] as const;

export type PaletteId = (typeof PALETTES)[number]['id'];

/** Applies a palette to <html> and remembers it on this device. Cocoa is the default. */
export function applyPalette(id: PaletteId) {
  if (id === 'cocoa') delete document.documentElement.dataset.palette;
  else document.documentElement.dataset.palette = id;
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, id);
  } catch {
    // Storage blocked: the palette lasts for this page only.
  }
  window.dispatchEvent(new CustomEvent('resumora:palette', { detail: id }));
}

/** Sets the palette before first paint, so a returning visitor never sees the default flash. */
export const paletteBootScript = `try{var p=localStorage.getItem('${PALETTE_STORAGE_KEY}');if(p&&p!=='cocoa')document.documentElement.dataset.palette=p}catch(e){}`;
