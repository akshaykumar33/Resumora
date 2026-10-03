import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { AccentSwitcher } from '@/components/accent-switcher';
import { Logo } from '@/components/logo';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: <Logo />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      { text: 'Docs', url: '/docs/getting-started', active: 'nested-url' },
      { text: 'Concepts', url: '/docs/concepts/recovery-model', active: 'nested-url' },
      { text: 'Guides', url: '/docs/guides/persist-in-the-browser', active: 'nested-url' },
      { text: 'API Reference', url: '/docs/reference/api', active: 'nested-url' },
      { type: 'custom', secondary: true, children: <AccentSwitcher /> },
    ],
  };
}
