import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';
import { AccentSwitcher } from '@/components/accent-switcher';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: (
        <span className="font-display text-[1.05rem] font-semibold tracking-tight">{appName}</span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [{ type: 'custom', secondary: true, children: <AccentSwitcher /> }],
  };
}
