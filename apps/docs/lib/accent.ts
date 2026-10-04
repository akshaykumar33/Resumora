export const ACCENT_STORAGE_KEY = 'resumora-accent';

/** Sets the accent before first paint, so a returning visitor never sees the default flash. */
export const accentBootScript = `try{var a=localStorage.getItem('${ACCENT_STORAGE_KEY}');if(a&&a!=='caramel')document.documentElement.dataset.accent=a}catch(e){}`;
