import Link from 'next/link';
import { IconArrowUp } from '@tabler/icons-react';
import { GithubMark } from '@/components/github-mark';
import { Logo } from '@/components/logo';

const GITHUB = 'https://github.com/akshaykumar33/Resumora';

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Learn',
    links: [
      { label: 'Getting started', href: '/docs/getting-started' },
      { label: 'Recovery model', href: '/docs/concepts/recovery-model' },
      { label: 'Security model', href: '/docs/concepts/security-model' },
    ],
  },
  {
    title: 'Guides',
    links: [
      { label: 'Persist in the browser', href: '/docs/guides/persist-in-the-browser' },
      { label: 'Handle session expiry', href: '/docs/guides/handle-session-expiry' },
      { label: 'Write a storage adapter', href: '/docs/guides/write-a-storage-adapter' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { label: 'API', href: '/docs/reference/api' },
      { label: 'Errors', href: '/docs/reference/errors' },
      { label: 'Issues', href: `${GITHUB}/issues` },
    ],
  },
];

/** The site footer: brand on the left, three short link columns, and a plain legal line. */
export function SiteFooter() {
  return (
    <footer className="border-t border-fd-border bg-sunken">
      <div className="mx-auto w-full max-w-6xl px-gutter pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex max-w-xs flex-col gap-4">
            <Logo />
            <p className="text-sm leading-relaxed text-fd-muted-foreground">
              Brings unfinished work back after crashes, reloads and expired sessions.
            </p>
            <a
              href={GITHUB}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-fd-border px-3 py-1.5 text-sm text-fd-muted-foreground transition-colors hover:border-fd-primary/45 hover:text-fd-foreground"
            >
              <GithubMark className="size-3.5" />
              Star on GitHub
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-3">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title} className="flex flex-col gap-3">
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-fd-foreground">
                  {col.title}
                </span>
                {col.links.map((l) =>
                  l.href.startsWith('/') ? (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="w-fit text-sm text-fd-muted-foreground transition-colors hover:text-fd-primary"
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      key={l.href}
                      href={l.href}
                      className="w-fit text-sm text-fd-muted-foreground transition-colors hover:text-fd-primary"
                    >
                      {l.label}
                    </a>
                  ),
                )}
              </nav>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-fd-border pt-6 text-sm text-fd-muted-foreground">
          <span>Open source under the Apache 2.0 licence.</span>
          <a href="#top" className="inline-flex items-center gap-1.5 hover:text-fd-foreground">
            Back to top <IconArrowUp className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
