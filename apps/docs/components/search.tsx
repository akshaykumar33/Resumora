'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { staticClient } from 'fumadocs-core/search/client/orama-static';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import {
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Copy,
  Cpu,
  Database,
  Flame,
  KeyRound,
  Layers,
  Palette,
  ShieldCheck,
  Terminal,
  Zap,
} from 'lucide-react';
import { ACCENT_STORAGE_KEY } from '@/lib/accent';
import { playClick, playCopy, playCrash } from '@/lib/sound';

interface CommandAction {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: typeof Zap;
  shortcut?: string;
  badge?: string;
  onSelect: () => void;
}

export default function DefaultSearchDialog(props: SharedProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { locale } = useI18n();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { search, setSearch, query } = useDocsSearch({
    client: staticClient({
      locale,
    }),
  });

  const setAccent = (accent: string) => {
    playClick();
    if (accent === 'teal') {
      delete document.documentElement.dataset.accent;
    } else {
      document.documentElement.dataset.accent = accent;
    }
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, accent);
    } catch {}
    props.onOpenChange(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    playCopy();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
      props.onOpenChange(false);
    }, 600);
  };

  const triggerLiveCrash = () => {
    playCrash();
    props.onOpenChange(false);
    const target = document.getElementById('try-it');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    window.dispatchEvent(new CustomEvent('resumora:trigger-crash'));
  };

  const navigateTo = (href: string) => {
    playClick();
    props.onOpenChange(false);
    startTransition(() => {
      router.push(href);
    });
  };

  const commands: CommandAction[] = [
    // Quick Actions
    {
      id: 'sim-crash',
      category: 'Interactive Simulator',
      title: 'Simulate Tab Crash & Recover',
      description: 'Triggers in-memory heap crash and tests deterministic state rebuild',
      icon: Zap,
      shortcut: '↵ Run',
      badge: 'Interactive',
      onSelect: triggerLiveCrash,
    },
    {
      id: 'wasm-lab',
      category: 'Interactive Simulator',
      title: 'Launch Deterministic Replay Laboratory',
      description: 'Simulate 10,000 state mutations and benchmark recovery times',
      icon: Cpu,
      badge: 'Lab',
      onSelect: () => {
        props.onOpenChange(false);
        const el = document.getElementById('wasm-lab');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'copy-install',
      category: 'Package Installation',
      title: 'Copy Install Command (pnpm add @resumora/core)',
      description: 'Installs zero-dependency runtime into current project',
      icon: Copy,
      shortcut: 'Copy',
      onSelect: () => copyToClipboard('pnpm add @resumora/core', 'copy-install'),
    },
    {
      id: 'copy-cli',
      category: 'Package Installation',
      title: 'Copy Interactive CLI (npx @resumora/cli demo)',
      description: 'Run interactive terminal recovery demo in your shell',
      icon: Terminal,
      shortcut: 'Copy',
      onSelect: () => copyToClipboard('npx @resumora/cli demo', 'copy-cli'),
    },
    // Documentation
    {
      id: 'docs-quickstart',
      category: 'Documentation',
      title: 'Quickstart Guide: First 5 Minutes',
      description: 'Initialize ContinuityRuntime and recover your first form',
      icon: BookOpen,
      shortcut: 'Docs',
      onSelect: () => navigateTo('/docs/getting-started'),
    },
    {
      id: 'docs-security',
      category: 'Architecture Invariants',
      title: 'Security Model: Persistence != Authorization',
      description:
        'Learn why stored state never unlocks sensitive operations without server re-auth',
      icon: ShieldCheck,
      shortcut: 'Invariant',
      onSelect: () => navigateTo('/docs/concepts/security-model'),
    },
    {
      id: 'docs-recovery',
      category: 'Architecture Invariants',
      title: 'Recovery Model: Deterministic Intent Replay',
      description: 'Checkpoints, write-ahead journaling, and state reconstruction algorithm',
      icon: Layers,
      shortcut: 'Spec',
      onSelect: () => navigateTo('/docs/concepts/recovery-model'),
    },
    {
      id: 'docs-idb',
      category: 'Storage Adapters',
      title: 'IndexedDB Adapter (@resumora/storage-indexeddb)',
      description: 'Transactional browser on-device persistence',
      icon: Database,
      shortcut: 'Adapter',
      onSelect: () => navigateTo('/docs/getting-started'),
    },
    // Palette Accents
    {
      id: 'accent-emerald',
      category: 'Theme & Accent',
      title: 'Set Accent: Emerald (Deep Mint)',
      description: 'High-contrast Nordic emerald green palette',
      icon: Palette,
      badge: 'Accent',
      onSelect: () => setAccent('emerald'),
    },
    {
      id: 'accent-cyan',
      category: 'Theme & Accent',
      title: 'Set Accent: Cyan (Nordic Ocean)',
      description: 'Vibrant technical cyan palette',
      icon: Palette,
      badge: 'Accent',
      onSelect: () => setAccent('cyan'),
    },
    {
      id: 'accent-iris',
      category: 'Theme & Accent',
      title: 'Set Accent: Iris (Electric Violet)',
      description: 'Deep royal purple and iris indigo accents',
      icon: Palette,
      badge: 'Accent',
      onSelect: () => setAccent('iris'),
    },
    {
      id: 'accent-ember',
      category: 'Theme & Accent',
      title: 'Set Accent: Ember (Warm Amber)',
      description: 'Warm sunset amber and copper highlights',
      icon: Flame,
      badge: 'Accent',
      onSelect: () => setAccent('ember'),
    },
    {
      id: 'accent-teal',
      category: 'Theme & Accent',
      title: 'Set Accent: Teal (Default Classic)',
      description: 'Resumora original signature teal aesthetic',
      icon: Palette,
      badge: 'Accent',
      onSelect: () => setAccent('teal'),
    },
  ];

  // Group commands by category
  const categories = Array.from(new Set(commands.map((c) => c.category)));

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay className="backdrop-blur-md bg-black/40" />
      <SearchDialogContent className="overflow-hidden rounded-2xl border border-fd-border/80 bg-fd-card/95 shadow-2xl backdrop-blur-xl">
        <SearchDialogHeader className="border-b border-fd-border/70 px-4 py-3">
          <SearchDialogIcon />
          <SearchDialogInput placeholder="Type a command, query, or search docs..." />
          <SearchDialogClose />
        </SearchDialogHeader>

        {search ? (
          <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
        ) : (
          <div className="max-h-[62vh] overflow-y-auto p-3 space-y-4 text-xs">
            {categories.map((category) => {
              const items = commands.filter((c) => c.category === category);
              return (
                <div key={category} className="space-y-1">
                  <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-fd-muted-foreground/80">
                    {category}
                  </div>
                  <div className="space-y-0.5">
                    {items.map((cmd) => {
                      const Icon = cmd.icon;
                      const isCopied = copiedId === cmd.id;
                      return (
                        <button
                          key={cmd.id}
                          type="button"
                          onClick={cmd.onSelect}
                          className="group flex w-full items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-fd-muted/80 active:scale-[0.99]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="grid size-7 shrink-0 place-items-center rounded-lg border border-fd-border/70 bg-fd-background/80 text-fd-primary transition-colors group-hover:bg-fd-primary group-hover:text-fd-primary-foreground">
                              {isCopied ? (
                                <Check className="size-3.5 text-emerald-500 group-hover:text-white" />
                              ) : (
                                <Icon className="size-3.5" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-fd-foreground truncate">
                                {isCopied ? 'Copied to clipboard!' : cmd.title}
                              </div>
                              <div className="text-[11px] text-fd-muted-foreground truncate">
                                {cmd.description}
                              </div>
                            </div>
                          </div>
                          {cmd.shortcut && (
                            <span className="shrink-0 rounded border border-fd-border/60 bg-fd-background px-1.5 py-0.5 font-mono text-[10px] text-fd-muted-foreground">
                              {cmd.shortcut}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Command palette keyboard footer */}
        <div className="flex items-center justify-between border-t border-fd-border/70 bg-fd-muted/30 px-4 py-2 text-[11px] text-fd-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono">
              <kbd className="rounded border border-fd-border/70 bg-fd-card px-1.5 py-0.5 shadow-2xs">
                ↑↓
              </kbd>{' '}
              navigate
            </span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="rounded border border-fd-border/70 bg-fd-card px-1.5 py-0.5 shadow-2xs">
                ↵
              </kbd>{' '}
              select
            </span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="rounded border border-fd-border/70 bg-fd-card px-1.5 py-0.5 shadow-2xs">
                esc
              </kbd>{' '}
              close
            </span>
          </div>
          <span className="font-mono text-[10px] text-fd-primary">Resumora Runtime v0.1.0</span>
        </div>
      </SearchDialogContent>
    </SearchDialog>
  );
}
