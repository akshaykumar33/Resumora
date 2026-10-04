import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { PaletteSwitcher } from '@/components/palette-switcher';
import { Logo } from '@/components/logo';

// The page tree already lists every section, so the docs sidebar carries no duplicate top links:
// only the logo, search, the palette swatches and the GitHub link.
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [{ type: 'custom', secondary: true, children: <PaletteSwitcher /> }],
  };
}
