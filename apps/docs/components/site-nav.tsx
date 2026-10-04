'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react';
import { useTheme } from 'next-themes';
import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { ArrowRight, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { GithubMark } from '@/components/github-mark';
import { AccentSwitcher } from '@/components/accent-switcher';
import { Logo } from '@/components/logo';

const LINKS = [
  { label: 'Docs', href: '/docs/getting-started' },
  { label: 'Concepts', href: '/docs/concepts/recovery-model' },
  { label: 'Guides', href: '/docs/guides/persist-in-the-browser' },
  { label: 'API', href: '/docs/reference/api' },
];
const GITHUB = 'https://github.com/akshaykumar33/Resumora';

const iconButton =
  'grid size-9 place-items-center rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring';

/**
 * The landing page's floating navigation: a matte pill that tightens once the page scrolls,
 * with a hover highlight that slides between links, the ⌘K palette trigger, and a full-screen
 * sheet on small screens.
 */
export function SiteNav() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOpenSearch } = useSearchContext();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-3 md:pt-4">
        <motion.nav
          aria-label="Main"
          initial={false}
          animate={{ maxWidth: scrolled ? 920 : 1152 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 32 }}
          className={`pointer-events-auto flex h-14 w-full items-center gap-2 rounded-full border pl-4 pr-2 transition-[background-color,border-color,box-shadow] duration-300 ${
            scrolled
              ? 'border-fd-border bg-fd-card/80 shadow-[0_12px_40px_-16px_var(--resumora-shadow),inset_0_1px_0_color-mix(in_oklch,var(--color-fd-foreground)_6%,transparent)] backdrop-blur-xl'
              : 'border-transparent bg-transparent'
          }`}
        >
          <Link href="/" aria-label="Resumora home" className="mr-2 shrink-0 rounded-full">
            <Logo />
          </Link>

          <ul className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
            {LINKS.map((l) => (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  onMouseEnter={() => setHovered(l.href)}
                  onFocus={() => setHovered(l.href)}
                  className="relative z-10 block rounded-full px-3.5 py-2 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
                >
                  {l.label}
                </Link>
                {hovered === l.href && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-fd-accent"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOpenSearch(true)}
              className="hidden h-9 items-center gap-2 rounded-full border border-fd-border bg-fd-background/60 pl-3 pr-1.5 text-sm text-fd-muted-foreground transition-colors hover:border-fd-primary/40 hover:text-fd-foreground lg:flex"
            >
              <Search className="size-3.5" strokeWidth={2} />
              Search
              <kbd className="ml-4 rounded-full border border-fd-border bg-fd-card px-2 py-0.5 font-mono text-[11px]">
                Ctrl K
              </kbd>
            </button>
            <button
              type="button"
              aria-label="Search"
              onClick={() => setOpenSearch(true)}
              className={`${iconButton} lg:hidden`}
            >
              <Search className="size-4" strokeWidth={1.75} />
            </button>
            <ThemeToggle />
            <a href={GITHUB} aria-label="GitHub" className={`${iconButton} hidden sm:grid`}>
              <GithubMark className="size-4" />
            </a>
            <Link
              href="/docs/getting-started"
              className="ml-1 hidden h-9 items-center gap-1.5 rounded-full bg-fd-primary px-4 text-sm font-medium text-fd-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.25),0_6px_20px_-8px_var(--color-fd-primary)] transition-transform hover:-translate-y-px active:translate-y-0 active:scale-[0.98] sm:inline-flex"
            >
              Get started
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className={`${iconButton} md:hidden`}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </motion.nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="fixed inset-0 z-30 bg-fd-background/95 px-6 pt-24 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between border-b border-fd-border py-4 font-display text-3xl font-medium tracking-tight"
                  >
                    {l.label}
                    <ArrowRight className="size-5 text-fd-primary" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8 flex items-center justify-between">
              <AccentSwitcher />
              <a href={GITHUB} className="text-sm text-fd-muted-foreground">
                GitHub
              </a>
            </div>
            <Link
              href="/docs/getting-started"
              onClick={() => setMenuOpen(false)}
              className="mt-8 flex h-12 items-center justify-center rounded-full bg-fd-primary font-medium text-fd-primary-foreground"
            >
              Get started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = !mounted || resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className={iconButton}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {dark ? (
            <Moon className="size-4" strokeWidth={1.75} />
          ) : (
            <Sun className="size-4" strokeWidth={1.75} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
