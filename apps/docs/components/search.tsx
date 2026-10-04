'use client';

import { useEffect, useState, useTransition, type ComponentType, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { useTheme } from 'next-themes';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { staticClient } from 'fumadocs-core/search/client/orama-static';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Cpu,
  FileText,
  Hash,
  KeyRound,
  Layers,
  Moon,
  Palette,
  Plug,
  Search,
  ShieldCheck,
  Sun,
  Zap,
} from 'lucide-react';
import { ACCENTS } from '@/components/accent-switcher';
import { GithubMark } from '@/components/github-mark';
import { ACCENT_STORAGE_KEY } from '@/lib/accent';
import { playClick, playCopy, playCrash } from '@/lib/sound';

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

const DOCS: { title: string; href: string; icon: Icon; keywords: string }[] = [
  {
    title: 'Getting started',
    href: '/docs/getting-started',
    icon: BookOpen,
    keywords: 'install quickstart',
  },
  {
    title: 'Recovery model',
    href: '/docs/concepts/recovery-model',
    icon: Layers,
    keywords: 'checkpoint intent replay',
  },
  {
    title: 'Security model',
    href: '/docs/concepts/security-model',
    icon: ShieldCheck,
    keywords: 'lock unlock authorization',
  },
  {
    title: 'Persist in the browser',
    href: '/docs/guides/persist-in-the-browser',
    icon: Cpu,
    keywords: 'indexeddb',
  },
  {
    title: 'Handle session expiry',
    href: '/docs/guides/handle-session-expiry',
    icon: KeyRound,
    keywords: 'token lock',
  },
  {
    title: 'Write a storage adapter',
    href: '/docs/guides/write-a-storage-adapter',
    icon: Plug,
    keywords: 'adapter contract',
  },
  {
    title: 'API reference',
    href: '/docs/reference/api',
    icon: FileText,
    keywords: 'recordIntent saveCheckpoint',
  },
  { title: 'Errors', href: '/docs/reference/errors', icon: Hash, keywords: 'ResumoraError codes' },
];

const GITHUB = 'https://github.com/akshaykumar33/Resumora';

/** Search results arrive as Markdown with <mark> highlights; the palette shows plain text. */
function plain(content: unknown): string {
  return typeof content === 'string' ? content.replace(/<\/?mark>|`/g, '') : '';
}

/**
 * The ⌘K command palette, built on cmdk: fuzzy-filtered commands, live docs search, keyboard
 * navigation and theme control. Replaces the Fumadocs search dialog through RootProvider.
 */
export default function CommandPalette({ open, onOpenChange }: SharedProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { locale } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const { search, setSearch, query } = useDocsSearch({ client: staticClient({ locale }) });

  useEffect(() => {
    if (!open) setSearch('');
  }, [open, setSearch]);

  const close = () => onOpenChange(false);
  const run = (fn: () => void) => () => {
    playClick();
    fn();
  };
  const go = (href: string) =>
    run(() => {
      close();
      startTransition(() => router.push(href));
    });

  const setAccent = (id: string) =>
    run(() => {
      if (id === 'caramel') delete document.documentElement.dataset.accent;
      else document.documentElement.dataset.accent = id;
      try {
        localStorage.setItem(ACCENT_STORAGE_KEY, id);
      } catch {
        // Storage blocked: the accent lasts for this page only.
      }
    });

  const results = search && query.data !== 'empty' ? (query.data ?? []) : [];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      loop
      overlayClassName="fixed inset-0 z-50 bg-[oklch(0.12_0.02_52/0.55)] backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0"
      contentClassName="fixed left-1/2 top-[12vh] z-50 w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]"
      className="overflow-hidden rounded-2xl border border-fd-border bg-fd-popover text-fd-popover-foreground shadow-[0_30px_80px_-20px_var(--resumora-shadow),inset_0_1px_0_color-mix(in_oklch,var(--color-fd-foreground)_6%,transparent)]"
    >
      <div className="flex items-center gap-3 border-b border-fd-border px-4">
        <Search className="size-4 shrink-0 text-fd-muted-foreground" strokeWidth={1.75} />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Search the docs or run a command"
          className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-fd-muted-foreground"
        />
        <kbd className="hidden rounded-md border border-fd-border px-1.5 py-0.5 font-mono text-[11px] text-fd-muted-foreground sm:block">
          esc
        </kbd>
      </div>

      <Command.List className="max-h-[min(60vh,440px)] scroll-py-2 overflow-y-auto overscroll-contain p-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-fd-muted-foreground">
        <Command.Empty className="px-3 py-10 text-center text-sm text-fd-muted-foreground">
          {query.isLoading ? 'Searching…' : 'Nothing matches that. Try “checkpoint” or “lock”.'}
        </Command.Empty>

        {results.length > 0 && (
          <Command.Group heading="Docs results" forceMount>
            {results.slice(0, 8).map((r) => (
              <Item
                key={r.id}
                value={`result ${r.id} ${search}`}
                forceMount
                icon={r.type === 'page' ? FileText : Hash}
                onSelect={go(r.url)}
                hint={r.type === 'page' ? 'Page' : undefined}
              >
                {plain(r.content)}
              </Item>
            ))}
          </Command.Group>
        )}

        <Command.Group heading="Actions">
          <Item
            icon={Zap}
            onSelect={run(() => {
              playCrash();
              close();
              document.getElementById('try-it')?.scrollIntoView({ behavior: 'smooth' });
              window.dispatchEvent(new CustomEvent('resumora:trigger-crash'));
            })}
            hint="Live demo"
          >
            Crash the demo and watch it recover
          </Item>
          <Item
            icon={copied ? Check : Copy}
            onSelect={() => {
              playCopy();
              void navigator.clipboard.writeText('pnpm add @resumora/core');
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
                close();
              }, 700);
            }}
            hint={copied ? 'Copied' : 'Copy'}
          >
            pnpm add @resumora/core
          </Item>
          <Item icon={GithubMark} onSelect={run(() => window.open(GITHUB, '_blank', 'noopener'))}>
            Open the GitHub repository
          </Item>
        </Command.Group>

        <Command.Group heading="Documentation">
          {DOCS.map((d) => (
            <Item
              key={d.href}
              icon={d.icon}
              value={`${d.title} ${d.keywords}`}
              onSelect={go(d.href)}
            >
              {d.title}
            </Item>
          ))}
        </Command.Group>

        <Command.Group heading="Appearance">
          <Item
            icon={resolvedTheme === 'dark' ? Sun : Moon}
            onSelect={run(() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'))}
            hint="Theme"
          >
            {resolvedTheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </Item>
          {ACCENTS.map((a) => (
            <Item
              key={a.id}
              icon={Palette}
              value={`accent ${a.label}`}
              onSelect={setAccent(a.id)}
              swatch={a.swatch}
            >
              {a.label} accent
            </Item>
          ))}
        </Command.Group>
      </Command.List>

      <div className="flex items-center gap-4 border-t border-fd-border px-4 py-2.5 text-xs text-fd-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> to move
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd> to open
        </span>
        <span className="ml-auto hidden items-center gap-1.5 sm:flex">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd> anywhere
        </span>
      </div>
    </Command.Dialog>
  );
}

function Item({
  icon: IconCmp,
  children,
  onSelect,
  value,
  hint,
  swatch,
  forceMount,
}: {
  icon: Icon;
  children: ReactNode;
  onSelect: () => void;
  value?: string;
  hint?: string | undefined;
  swatch?: string;
  forceMount?: boolean;
}) {
  return (
    <Command.Item
      {...(value ? { value } : {})}
      {...(forceMount ? { forceMount } : {})}
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fd-foreground transition-colors data-[selected=true]:bg-fd-accent"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors group-data-[selected=true]:border-fd-primary/40 group-data-[selected=true]:text-fd-primary">
        {swatch ? (
          <span className="size-3 rounded-full" style={{ background: swatch }} />
        ) : (
          <IconCmp className="size-4" strokeWidth={1.75} />
        )}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint && <span className="shrink-0 text-xs text-fd-muted-foreground">{hint}</span>}
      <ArrowRight
        className="size-3.5 shrink-0 -translate-x-1 text-fd-primary opacity-0 transition-all group-data-[selected=true]:translate-x-0 group-data-[selected=true]:opacity-100"
        strokeWidth={2}
      />
    </Command.Item>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-fd-border bg-fd-card px-1.5 py-0.5 font-mono text-[11px]">
      {children}
    </kbd>
  );
}
