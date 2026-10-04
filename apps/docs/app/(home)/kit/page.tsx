import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { PaletteSwitcher } from '@/components/palette-switcher';
import {
  Badge,
  ButtonLink,
  Em,
  Eyebrow,
  Heading,
  Kbd,
  Section,
  Surface,
} from '@/components/ui/kit';

export const metadata: Metadata = {
  title: 'Design kit',
  description: 'The tokens and components the Resumora site is built from.',
  robots: { index: false },
};

const SURFACES = [
  { name: 'background', note: 'var(--color-fd-background)', className: 'bg-fd-background' },
  { name: 'sunken', note: 'var(--sunken)', className: 'bg-sunken' },
  { name: 'card', note: 'var(--color-fd-card)', className: 'bg-fd-card' },
  { name: 'raised', note: 'var(--raised)', className: 'bg-raised' },
  { name: 'muted', note: 'var(--color-fd-muted)', className: 'bg-fd-muted' },
  { name: 'accent', note: 'var(--color-fd-accent)', className: 'bg-fd-accent' },
];

const INKS = [
  { name: 'foreground', note: 'var(--color-fd-foreground)', className: 'bg-fd-foreground' },
  {
    name: 'muted text',
    note: 'var(--color-fd-muted-foreground)',
    className: 'bg-fd-muted-foreground',
  },
  { name: 'primary', note: 'var(--color-fd-primary)', className: 'bg-fd-primary' },
  { name: 'border', note: 'var(--color-fd-border)', className: 'bg-fd-border' },
];

const TONES = [
  { name: 'success', note: 'pistachio', className: 'bg-success' },
  { name: 'warning', note: 'honey', className: 'bg-warning' },
  { name: 'danger', note: 'raspberry', className: 'bg-danger' },
  { name: 'info', note: 'blueberry', className: 'bg-info' },
];

const TYPE = [
  { name: 'display', className: 'font-display text-display font-semibold', sample: 'Never lose' },
  {
    name: 'title',
    className: 'font-display text-title font-semibold',
    sample: 'Every interruption',
  },
  {
    name: 'heading',
    className: 'font-display text-heading font-semibold',
    sample: 'Survives the crash',
  },
  {
    name: 'lead',
    className: 'text-lead text-fd-muted-foreground',
    sample: 'Unfinished work comes back.',
  },
  { name: 'body', className: 'text-base', sample: 'Each change becomes a small, numbered intent.' },
  {
    name: 'small',
    className: 'text-sm text-fd-muted-foreground',
    sample: 'Saved the moment the write lands.',
  },
  { name: 'mono', className: 'font-mono text-sm', sample: 'workspace.recordIntent()' },
];

function Swatch({ name, note, className }: { name: string; note?: string; className: string }) {
  return (
    <div className="group flex flex-col gap-2">
      <div
        className={`h-20 rounded-2xl border border-fd-border shadow-xs transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md ${className}`}
      />
      <div className="text-sm font-medium text-fd-foreground">{name}</div>
      {note && <div className="-mt-1.5 font-mono text-[11px] text-fd-muted-foreground">{note}</div>}
    </div>
  );
}

export default function KitPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Section containerClassName="pt-32">
        <Heading
          as="h1"
          eyebrow="Design kit"
          title={
            <>
              Precision, continuity and <Em>resilience.</Em>
            </>
          }
          lead="The tokens and components every page here is built from. Switch between professional developer themes to see them adapt in real time."
        />
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-fd-border/80 bg-fd-card/70 p-4 backdrop-blur-md shadow-xs">
          <span className="font-mono text-xs font-medium text-fd-muted-foreground">
            Active Palette:
          </span>
          <PaletteSwitcher size="lg" />
          <span className="text-xs text-fd-muted-foreground">
            Choose Claude Code (signature terracotta & warm amber), Neon Cyber (high-voltage
            electric lime), Chocolate (rich velvety cocoa), or Onyx (monolith zinc).
          </span>
        </div>
      </Section>

      <Section tone="sunken" bordered>
        <div className="flex flex-col gap-14">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-heading font-semibold">Surfaces</h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
              {SURFACES.map((s) => (
                <Swatch key={s.name} {...s} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-heading font-semibold">Ink and accent</h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {INKS.map((s) => (
                <Swatch key={s.name} {...s} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-heading font-semibold">Status tones</h2>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {TONES.map((s) => (
                <Swatch key={s.name} {...s} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="mb-8 font-display text-heading font-semibold">Type scale</h2>
        <div className="flex flex-col">
          {TYPE.map((t) => (
            <div
              key={t.name}
              className="grid items-baseline gap-2 border-t border-fd-border py-6 sm:grid-cols-[140px_1fr]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-fd-muted-foreground">
                {t.name}
              </span>
              <span className={`min-w-0 ${t.className}`}>{t.sample}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="sunken" bordered>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-heading font-semibold">Buttons</h2>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/docs/getting-started" size="lg">
                Primary <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/docs/getting-started" variant="secondary" size="lg">
                Secondary
              </ButtonLink>
              <ButtonLink href="/docs/getting-started" variant="ghost" size="lg">
                Ghost
              </ButtonLink>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/docs/getting-started" size="sm">
                Small
              </ButtonLink>
              <ButtonLink href="/docs/getting-started" variant="secondary" size="sm">
                Small
              </ButtonLink>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-heading font-semibold">Badges and keys</h2>
            <div className="flex flex-wrap gap-2">
              <Badge>Neutral</Badge>
              <Badge tone="accent">Recording</Badge>
              <Badge tone="success">Restored</Badge>
              <Badge tone="warning">Interrupted</Badge>
              <Badge tone="danger">Locked</Badge>
              <Badge tone="info">Persisted</Badge>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-fd-muted-foreground">
              <Kbd>Ctrl</Kbd>
              <Kbd>K</Kbd>
              <span className="ml-1">opens the command palette</span>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="mb-8 font-display text-heading font-semibold">Surfaces and headings</h2>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Surface className="flex flex-col gap-6 p-8">
            <Eyebrow>Eyebrow</Eyebrow>
            <Heading
              title={
                <>
                  A heading with <Em>emphasis.</Em>
                </>
              }
              lead="Stacked: title, then a lead of at most 52 characters per line."
            />
          </Surface>
          <Surface className="flex flex-col gap-4 p-8">
            <h3 className="font-display text-heading font-semibold">Raised surface</h3>
            <p className="text-fd-muted-foreground">
              24px corners, a hairline border, a tinted shadow.
            </p>
            <Surface inset className="p-5 font-mono text-sm">
              Inset surface, 16px corners
            </Surface>
          </Surface>
        </div>
      </Section>

      <SiteFooter />
    </main>
  );
}
