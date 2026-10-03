import Link from 'next/link';
import { ArrowRight, CheckCircle2, Cpu, Layers, Plug, ShieldCheck } from 'lucide-react';
import { ArchitectureBeams } from '@/components/home/architecture-beams';
import { FeatureBento } from '@/components/home/bento';
import { CodeShowcaseTabs } from '@/components/home/code-tabs';
import { ContinuityTimeline } from '@/components/home/continuity-timeline';
import { StaggerReveal } from '@/components/home/gsap-scenes';
import { InterruptionOrbit } from '@/components/home/interruption-orbit';
import { LiveDemo } from '@/components/home/live-demo';
import { HeroTitle, Reveal } from '@/components/home/motion';
import { ResumoraGlobe } from '@/components/home/resumora-globe';
import { ScenarioScroller } from '@/components/home/scenario-scroller';
import { ScrollStory } from '@/components/home/scroll-story';
import { LogoMark } from '@/components/logo';
import { SmoothScroll } from '@/components/smooth-scroll';
import { NumberTicker } from '@/components/ui/number-ticker';

// Verified metrics
const stats = [
  {
    value: 0,
    label: 'Runtime dependencies',
    caption: 'Zero external bloat in core',
    icon: Cpu,
  },
  {
    value: 3,
    label: 'Crash scenarios tested',
    caption: 'Proven in Chromium on PRs',
    icon: ShieldCheck,
  },
  {
    value: 40,
    label: 'Invariant unit tests',
    caption: 'Strict determinism guarantee',
    icon: CheckCircle2,
  },
  {
    value: 6,
    label: 'Storage adapter methods',
    caption: 'Plug any browser or native disk',
    icon: Plug,
  },
];

const githubUrl = 'https://github.com/akshaykumar33/Resumora';

const sectionTitle =
  'bg-gradient-to-b from-fd-foreground via-fd-foreground to-fd-foreground/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent text-balance md:text-5xl';

export default function HomePage() {
  return (
    <main id="top" className="flex flex-1 flex-col overflow-x-clip">
      <SmoothScroll />

      {/* Hero: Focused, authoritative, uncluttered */}
      <section className="relative isolate overflow-hidden">
        {/* Subtle atmospheric ambient glow */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="resumora-grid absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--color-fd-primary)_18%,transparent),transparent_70%)] blur-3xl" />
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-7 px-6 pb-20 pt-16 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-fd-border/80 bg-fd-card/75 px-3.5 py-1.5 text-xs font-medium text-fd-foreground shadow-xs backdrop-blur-md">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Resumora Runtime v0.1.0</span>
              <span className="text-fd-border">·</span>
              <span className="text-fd-muted-foreground">
                Application Continuity & Workflow Recovery
              </span>
            </div>
          </Reveal>

          <HeroTitle
            text="Your users never lose the work they’ve done."
            className="max-w-4xl bg-gradient-to-b from-fd-foreground via-fd-foreground to-fd-foreground/65 bg-clip-text pb-2 text-[clamp(2.5rem,1.8rem+4vw,5rem)] font-bold leading-[1.08] tracking-[-0.035em] text-transparent text-balance"
          />

          <Reveal delay={0.2}>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-fd-muted-foreground md:text-lg text-balance">
              Resumora guarantees workflows survive tab discards, unexpected crashes, token
              expirations, and network flaps — without ever trusting stored data as authorization.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-1">
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center gap-2 rounded-xl bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground shadow-lg shadow-fd-primary/20 transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get started <ArrowRight className="size-4" />
              </Link>
              <a
                href="#try-it"
                className="inline-flex items-center gap-2 rounded-xl border border-fd-border/80 bg-fd-card/80 px-6 py-3 text-sm font-semibold text-fd-foreground backdrop-blur-md transition-all hover:bg-fd-muted active:scale-[0.98]"
              >
                Try the live demo
              </a>
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-fd-border/80 bg-fd-background/50 px-4 py-3 text-sm font-medium text-fd-muted-foreground transition-all hover:bg-fd-muted hover:text-fd-foreground"
              >
                GitHub
              </a>
            </div>
          </Reveal>

          {/* Interactive Continuity Console */}
          <Reveal delay={0.4} className="mt-4 w-full max-w-2xl">
            <ContinuityTimeline />
          </Reveal>
        </div>
      </section>

      {/* Metrics & Proof Points */}
      <section className="border-y border-fd-border/70 bg-fd-muted/20 py-14">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="group relative overflow-hidden rounded-2xl border border-fd-border/80 bg-fd-card/85 p-6 backdrop-blur-md shadow-xs transition-all duration-300 hover:border-fd-primary/50 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl font-bold tracking-tight text-fd-foreground">
                    <NumberTicker value={s.value} />
                  </span>
                  <div className="grid size-10 place-items-center rounded-xl bg-fd-muted text-fd-primary transition-colors group-hover:bg-fd-primary group-hover:text-fd-primary-foreground">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="mt-3 font-semibold text-sm text-fd-foreground">{s.label}</div>
                <div className="mt-1 font-mono text-xs text-fd-muted-foreground">{s.caption}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture Section */}
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-24 text-center">
        <Reveal className="flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/50 px-3 py-1 font-mono text-xs text-fd-primary">
            Universal Decoupled Core
          </div>
          <h2 className={sectionTitle}>One runtime between your app and its storage.</h2>
          <p className="max-w-[54ch] text-base leading-relaxed text-fd-muted-foreground">
            Every screen journals edits into Resumora, which persists them deterministically through
            whichever storage adapter you choose.
          </p>
        </Reveal>
        <Reveal delay={0.1} className="w-full">
          <ArchitectureBeams />
        </Reveal>
      </section>

      {/* Interruptions absorbed */}
      <section className="border-y border-fd-border/70 bg-fd-muted/20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/50 px-3 py-1 font-mono text-xs text-fd-primary">
              Air-Gapped Client Resilience
            </div>
            <h2 className={sectionTitle}>Every interruption, absorbed.</h2>
            <p className="max-w-[46ch] text-base leading-relaxed text-fd-muted-foreground">
              Browser crashes, expired auth tokens, zero-downtime deploys, dead batteries, discarded
              tabs. Whatever stops your user, their state is safe on their machine.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <InterruptionOrbit />
          </Reveal>
        </div>
        <div className="pb-14">
          <ScenarioScroller />
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <div className="mb-10 flex flex-col items-start gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-fd-primary">
              Core Invariants
            </span>
            <h2 className={`max-w-[24ch] ${sectionTitle}`}>
              Engineered for the moment things go wrong.
            </h2>
          </div>
        </Reveal>
        <StaggerReveal>
          <FeatureBento />
        </StaggerReveal>
      </section>

      {/* Step-by-step Scroll Story */}
      <ScrollStory />

      {/* Interactive Live Demo */}
      <section id="try-it" className="scroll-mt-20 border-t border-fd-border/70 bg-fd-muted/10">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <Reveal>
            <div className="mb-10 flex flex-col items-start gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-fd-primary">
                Live Interactive Proof
              </span>
              <h2 className={sectionTitle}>Now try to lose yours.</h2>
              <p className="max-w-2xl text-base text-fd-muted-foreground">
                This is the real <code className="font-mono text-xs">@resumora/core</code> runtime
                persisting to local IndexedDB right now. Type in data, trigger failures, and watch
                it recover deterministically.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <LiveDemo />
          </Reveal>
        </div>
      </section>

      {/* Tabbed Code Showcase */}
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/50 px-3 py-1 font-mono text-xs text-fd-primary">
            Clean Minimal Public API
          </div>
          <h2 className={sectionTitle}>Three calls. Zero lost progress.</h2>
          <p className="max-w-[44ch] text-base leading-relaxed text-fd-muted-foreground">
            Record intent, snapshot milestones, restore deterministically. Your application replays
            unapplied intents and retains total ownership over its domain state.
          </p>
          <div className="flex flex-col gap-2.5 pt-2 text-sm text-fd-foreground/90">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
              <span>Zero external runtime dependencies in core</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
              <span>Strict identity namespacing across tenants</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
              <span>Fully decoupled from browser APIs for universal tests</span>
            </div>
          </div>
          <Link
            href="/docs/concepts/recovery-model"
            className="group inline-flex w-fit items-center gap-1.5 pt-2 text-sm font-semibold text-fd-primary"
          >
            Read the complete recovery specification
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="min-w-0">
          <CodeShowcaseTabs />
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="relative isolate overflow-hidden border-t border-fd-border/70 bg-fd-card/25">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <Reveal className="flex flex-col items-start gap-5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-muted/50 px-3 py-1 font-mono text-xs text-fd-primary">
              Ready for Production
            </div>
            <h2 className={`max-w-xl ${sectionTitle}`}>
              Recover your first workspace in five minutes.
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-fd-muted-foreground">
              Work stays safely on each user’s device until they submit. No lost form entries, no
              lost drafted claims, no frustrated customers.
            </p>
            <div className="flex flex-wrap gap-3.5 pt-1">
              <Link
                href="/docs/getting-started"
                className="inline-flex items-center gap-2 rounded-xl bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground shadow-md transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get started <ArrowRight className="size-4" />
              </Link>
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-fd-border/80 bg-fd-card px-6 py-3 text-sm font-semibold text-fd-foreground backdrop-blur-md transition-colors hover:bg-fd-muted"
              >
                View on GitHub
              </a>
            </div>
          </Reveal>
          <div className="relative flex h-[380px] w-full items-center justify-center">
            <ResumoraGlobe />
          </div>
        </div>
      </section>

      {/* Multi-Column Developer Footer */}
      <footer className="border-t border-fd-border/70 bg-fd-card/40">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
              <div className="flex items-center gap-2 text-base font-semibold text-fd-foreground">
                <LogoMark className="size-5 text-fd-primary" />
                <span>Resumora</span>
              </div>
              <p className="text-xs leading-relaxed text-fd-muted-foreground">
                Application Continuity & Workflow Recovery Runtime. Built for zero data loss in
                modern client web applications.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-fd-border/60 bg-fd-muted/30 px-2.5 py-0.5 font-mono text-[11px] text-fd-muted-foreground">
                  Apache-2.0 License
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-fd-foreground">
                Documentation
              </span>
              <Link
                href="/docs/getting-started"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Getting Started
              </Link>
              <Link
                href="/docs/concepts/recovery-model"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Recovery Model
              </Link>
              <Link
                href="/docs/concepts/security-model"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Security & Invariants
              </Link>
              <Link
                href="/docs/reference/api"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                API Reference
              </Link>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-fd-foreground">
                Guides
              </span>
              <Link
                href="/docs/guides/persist-in-the-browser"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Persist in Browser
              </Link>
              <Link
                href="/docs/guides/handle-session-expiry"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Handle Session Expiry
              </Link>
              <Link
                href="/docs/guides/write-a-storage-adapter"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Write Storage Adapter
              </Link>
              <Link
                href="/docs/reference/errors"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Error Directory
              </Link>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-fd-foreground">
                Project
              </span>
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                GitHub Repository
              </a>
              <a
                href={`${githubUrl}/issues`}
                target="_blank"
                rel="noreferrer"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Issue Tracker
              </a>
              <a
                href={`${githubUrl}/blob/main/CHANGELOG.md`}
                target="_blank"
                rel="noreferrer"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Changelog
              </a>
              <a
                href={`${githubUrl}/blob/main/LICENSE`}
                target="_blank"
                rel="noreferrer"
                className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                Apache 2.0 License
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-fd-border/60 pt-6 text-xs text-fd-muted-foreground">
            <span>
              © {new Date().getFullYear()} Resumora Contributors. Open source under Apache-2.0.
            </span>
            <div className="flex items-center gap-4">
              <a href="#top" className="transition-colors hover:text-fd-foreground">
                Back to top ↑
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
