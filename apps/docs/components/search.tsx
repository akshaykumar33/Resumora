'use client';

import { useEffect, useState, useTransition, type ComponentType, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion } from 'motion/react';
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
import { LogoMark } from '@/components/logo';
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
  const [selected, setSelected] = useState('');
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

  const quick: { id: string; title: string; caption: string; icon: Icon; onSelect: () => void }[] =
    [
      {
        id: 'quick crash demo',
        title: 'Crash the demo',
        caption: 'Watch it recover',
        icon: Zap,
        onSelect: run(() => {
          playCrash();
          close();
          document.getElementById('try-it')?.scrollIntoView({ behavior: 'smooth' });
          window.dispatchEvent(new CustomEvent('resumora:trigger-crash'));
        }),
      },
      {
        id: 'quick copy install',
        title: copied ? 'Copied' : 'Copy install',
        caption: 'pnpm add @resumora/core',
        icon: copied ? Check : Copy,
        onSelect: () => {
          playCopy();
          void navigator.clipboard.writeText('pnpm add @resumora/core');
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
            close();
          }, 700);
        },
      },
      {
        id: 'quick getting started',
        title: 'Start reading',
        caption: 'Five-minute guide',
        icon: BookOpen,
        onSelect: go('/docs/getting-started'),
      },
    ];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      loop
      value={selected}
      onValueChange={setSelected}
      overlayClassName="fixed inset-0 z-50 bg-[oklch(0.1_0.02_52/0.6)] backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0"
      contentClassName="glow-frame fixed left-1/2 top-[11vh] z-50 w-[min(680px,calc(100vw-1.5rem))] -translate-x-1/2 shadow-[0_40px_120px_-30px_var(--resumora-shadow)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-3 data-[state=open]:duration-300"
      className="relative overflow-hidden rounded-[calc(1.25rem-1px)] bg-fd-popover text-fd-popover-foreground"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(50%_60%_at_50%_100%,color-mix(in_oklch,var(--color-fd-primary)_16%,transparent),transparent)]"
      />

      <div className="relative flex items-center gap-3 border-b border-fd-border px-5">
        <Search className="size-[18px] shrink-0 text-fd-primary" strokeWidth={2} />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="What do you need?"
          className="h-16 w-full bg-transparent font-display text-[19px] tracking-[-0.01em] outline-none placeholder:italic placeholder:text-fd-muted-foreground/70"
        />
        <Kbd>esc</Kbd>
      </div>

      <Command.List className="relative max-h-[min(62vh,480px)] scroll-py-3 overflow-y-auto overscroll-contain p-2.5 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-3.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.12em] [&_[cmdk-group-heading]]:text-fd-muted-foreground/80">
        <Command.Empty className="flex flex-col items-center gap-2 px-3 py-12 text-center">
          <span className="font-display text-lg italic text-fd-foreground">
            {query.isLoading ? 'Searching the docs…' : 'Nothing by that name.'}
          </span>
          {!query.isLoading && (
            <span className="text-sm text-fd-muted-foreground">
              Try “checkpoint”, “lock” or “adapter”.
            </span>
          )}
        </Command.Empty>

        {!search && (
          <Command.Group heading="Quick actions">
            <div className="grid grid-cols-1 gap-2 px-1 pb-1 sm:grid-cols-3">
              {quick.map((q) => (
                <Command.Item
                  key={q.id}
                  value={q.id}
                  onSelect={q.onSelect}
                  className="group relative flex cursor-pointer items-center gap-3 rounded-2xl border border-fd-border bg-fd-card/60 p-3 outline-none transition-colors data-[selected=true]:border-fd-primary/50 sm:flex-col sm:items-start sm:gap-6 sm:p-4"
                >
                  {selected === q.id && <Highlight />}
                  <span className="relative grid size-9 place-items-center rounded-xl bg-fd-primary/15 text-fd-primary">
                    <q.icon className="size-[18px]" strokeWidth={1.75} />
                  </span>
                  <span className="relative flex min-w-0 flex-col">
                    <span className="font-display text-[15px] font-semibold tracking-tight">
                      {q.title}
                    </span>
                    <span className="truncate text-xs text-fd-muted-foreground">{q.caption}</span>
                  </span>
                </Command.Item>
              ))}
            </div>
          </Command.Group>
        )}

        {results.length > 0 && (
          <Command.Group heading="In the docs" forceMount>
            {results.slice(0, 8).map((r) => (
              <Item
                key={r.id}
                forceMount
                value={`result ${r.id} ${search}`}
                selected={selected}
                icon={r.type === 'page' ? FileText : Hash}
                onSelect={go(r.url)}
                hint={r.type === 'page' ? 'Page' : 'Section'}
              >
                {plain(r.content)}
              </Item>
            ))}
          </Command.Group>
        )}

        <Command.Group heading="Documentation">
          {DOCS.map((d) => (
            <Item
              key={d.href}
              icon={d.icon}
              value={`${d.title} ${d.keywords}`}
              selected={selected}
              onSelect={go(d.href)}
            >
              {d.title}
            </Item>
          ))}
        </Command.Group>

        <Command.Group heading="Elsewhere">
          <Item
            icon={GithubMark}
            value="github repository source"
            selected={selected}
            onSelect={run(() => window.open(GITHUB, '_blank', 'noopener'))}
            hint="GitHub"
          >
            Source on GitHub
          </Item>
        </Command.Group>

        <Command.Group heading="Appearance">
          <Item
            icon={resolvedTheme === 'dark' ? Sun : Moon}
            value="theme toggle light dark"
            selected={selected}
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
              selected={selected}
              onSelect={setAccent(a.id)}
              swatch={a.swatch}
              hint="Accent"
            >
              {a.label}
            </Item>
          ))}
        </Command.Group>
      </Command.List>

      <div className="relative flex items-center gap-4 border-t border-fd-border bg-fd-card/40 px-5 py-3 text-xs text-fd-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> move
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>↵</Kbd> open
        </span>
        <span className="ml-auto hidden items-center gap-2 sm:flex">
          <LogoMark className="size-3.5 text-fd-primary" />
          <span className="font-display italic">Resumora</span>
        </span>
      </div>
    </Command.Dialog>
  );
}

/** The selection light: one element that glides from row to row instead of blinking. */
function Highlight() {
  return (
    <motion.span
      layoutId="cmdk-highlight"
      aria-hidden
      transition={{ type: 'spring', stiffness: 520, damping: 40, mass: 0.7 }}
      className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(90deg,color-mix(in_oklch,var(--color-fd-primary)_14%,transparent),color-mix(in_oklch,var(--color-fd-primary)_4%,transparent))] shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--color-fd-primary)_28%,transparent)]"
    />
  );
}

function Item({
  icon: IconCmp,
  children,
  onSelect,
  value,
  selected,
  hint,
  swatch,
  forceMount,
}: {
  icon: Icon;
  children: ReactNode;
  onSelect: () => void;
  value: string;
  selected: string;
  hint?: string;
  swatch?: string;
  forceMount?: boolean;
}) {
  return (
    <Command.Item
      value={value}
      {...(forceMount ? { forceMount } : {})}
      onSelect={onSelect}
      className="group relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] text-fd-foreground outline-none"
    >
      {selected === value && <Highlight />}
      <span className="relative grid size-8 shrink-0 place-items-center rounded-lg border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors group-data-[selected=true]:border-fd-primary/40 group-data-[selected=true]:text-fd-primary">
        {swatch ? (
          <span
            className="size-3.5 rounded-full shadow-[inset_0_1px_1px_oklch(1_0_0/0.35)]"
            style={{ background: swatch }}
          />
        ) : (
          <IconCmp className="size-4" strokeWidth={1.75} />
        )}
      </span>
      <span className="relative min-w-0 flex-1 truncate">{children}</span>
      {hint && (
        <span className="relative shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-fd-muted-foreground/70">
          {hint}
        </span>
      )}
      <ArrowRight
        className="relative size-3.5 shrink-0 -translate-x-1 text-fd-primary opacity-0 transition-all group-data-[selected=true]:translate-x-0 group-data-[selected=true]:opacity-100"
        strokeWidth={2}
      />
    </Command.Item>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="grid h-6 min-w-6 place-items-center rounded-md border border-b-2 border-fd-border bg-fd-card px-1.5 font-mono text-[11px] text-fd-muted-foreground">
      {children}
    </kbd>
  );
}
