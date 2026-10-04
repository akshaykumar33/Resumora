export const PALETTE_STORAGE_KEY = 'resumora-palette';

export const PALETTES = [
  {
    id: 'claude',
    label: 'Claude Code',
    base: 'oklch(0.135 0.012 55)',
    accent: 'oklch(0.69 0.175 45)',
  },
  {
    id: 'neon',
    label: 'Neon Cyber',
    base: 'oklch(0.11 0.01 150)',
    accent: 'oklch(0.86 0.26 142)',
  },
  {
    id: 'chocolate',
    label: 'Chocolate',
    base: 'oklch(0.125 0.018 35)',
    accent: 'oklch(0.72 0.14 52)',
  },
  {
    id: 'onyx',
    label: 'Onyx',
    base: 'oklch(0.11 0 0)',
    accent: 'oklch(0.92 0 0)',
  },
] as const;

export type PaletteId = (typeof PALETTES)[number]['id'];

/** Applies a palette to <html> and remembers it on this device. Claude Code is the default. */
export function applyPalette(id: PaletteId) {
  if (id === 'claude') delete document.documentElement.dataset.palette;
  else document.documentElement.dataset.palette = id;
  try {
    localStorage.setItem(PALETTE_STORAGE_KEY, id);
  } catch {
    // Storage blocked: the palette lasts for this page only.
  }
  window.dispatchEvent(new CustomEvent('resumora:palette', { detail: id }));
}

/** Sets the palette before first paint, so a returning visitor never sees the default flash. */
export const paletteBootScript = `try{var p=localStorage.getItem('${PALETTE_STORAGE_KEY}');if(p&&p!=='claude')document.documentElement.dataset.palette=p}catch(e){}`;
