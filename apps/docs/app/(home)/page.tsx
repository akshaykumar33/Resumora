import Link from 'next/link';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { ContinuityTimeline } from '@/components/home/continuity-timeline';
import { MeshGradient } from '@/components/home/mesh-gradient';
import { FeatureBento } from '@/components/home/bento';
import { HeroParallax, StaggerReveal } from '@/components/home/gsap-scenes';
import { InterruptionsMarquee } from '@/components/home/interruptions-marquee';
import { LiveDemo } from '@/components/home/live-demo';
import { HeroTitle, Reveal } from '@/components/home/motion';
import { ScrollStory } from '@/components/home/scroll-story';
import { LogoMark } from '@/components/logo';
import { SmoothScroll } from '@/components/smooth-scroll';

const recoveryCode = `import { ContinuityRuntime } from '@resumora/core';
import { IndexedDbStorageAdapter } from '@resumora/storage-indexeddb';

const storage = await IndexedDbStorageAdapter.open();
const workspace = await new ContinuityRuntime({ storage }).openWorkspace(identity);

await workspace.recordIntent('SET_AMOUNT', { value: 4250 });
await workspace.saveCheckpoint(form);

// After any reload, crash or restart:
const recovered = await workspace.restoreLatestCheckpoint();`;

const packages = [
  { name: '@resumora/core', body: 'The runtime. No dependencies, no browser APIs.' },
  { name: '@resumora/storage-indexeddb', body: 'Persistent browser storage on native IndexedDB.' },
  { name: '@resumora/storage-memory', body: 'In-memory storage with fault injection, for tests.' },
];

const githubUrl = 'https://github.com/akshaykumar33/Resumora';

const primaryCta =
  'group inline-flex items-center gap-2 rounded-full bg-fd-primary px-6 py-3 text-sm font-semibold text-fd-primary-foreground shadow-[0_10px_30px_-10px_color-mix(in_oklch,var(--color-fd-primary)_70%,transparent)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]';
const secondaryCta =
  'inline-flex items-center gap-2 rounded-full border bg-fd-background/70 px-6 py-3 text-sm font-semibold backdrop-blur transition-colors hover:bg-fd-accent active:scale-[0.98]';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <SmoothScroll />

      {/* Hero: vivid colour mesh on a diagonal band, product card floating over its edge */}
      <HeroParallax className="relative isolate overflow-x-clip overflow-y-hidden">
        <section className="relative">
          <div className="absolute inset-0 -z-10 [clip-path:polygon(0_0,100%_0,100%_72%,0_100%)]">
            <div data-parallax="back" className="absolute inset-0">
              <MeshGradient />
            </div>
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pb-28 pt-16 md:pt-24 lg:grid-cols-[1.3fr_1fr]">
            <div className="flex min-w-0 flex-col gap-7">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/55 px-3 py-1 text-xs font-semibold text-[oklch(0.25_0.04_265)] shadow-sm ring-1 ring-white/60 backdrop-blur dark:bg-white/10 dark:text-white dark:ring-white/15">
                  <LogoMark className="size-3.5" />
                  Application continuity runtime
                </span>
              </Reveal>
              <HeroTitle
                text="Your users never lose the work they’ve done."
                className="max-w-[15ch] text-[clamp(2.6rem,1.4rem+4.6vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-[oklch(0.17_0.04_265)] text-balance dark:text-white"
              />
              <Reveal delay={0.4}>
                <p className="max-w-[42ch] text-lg leading-relaxed text-[oklch(0.25_0.04_265)]/85 md:text-xl dark:text-white/80">
                  Resumora brings unfinished work back after crashes, reloads and expired sessions,
                  without trusting stored data as permission.
                </p>
              </Reveal>
              <Reveal delay={0.5}>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/docs/getting-started"
                    className="shimmer group inline-flex items-center gap-2 rounded-full bg-[oklch(0.17_0.04_265)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_oklch(0.17_0.04_265/0.6)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] dark:bg-white dark:text-[oklch(0.17_0.04_265)]"
                  >
                    Get started
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <a
                    href="#try-it"
                    className="inline-flex items-center gap-2 rounded-full bg-white/60 px-6 py-3 text-sm font-semibold text-[oklch(0.17_0.04_265)] ring-1 ring-white/70 backdrop-blur transition-colors hover:bg-white/80 active:scale-[0.98] dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white/15"
                  >
                    Try the live demo
                  </a>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.25} className="relative min-w-0 [perspective:1400px]">
              <div data-parallax="front">
                <div className="transition-transform duration-700 ease-out lg:[transform:rotateY(-10deg)_rotateX(5deg)] lg:hover:[transform:rotateY(-4deg)_rotateX(2deg)]">
                  <div className="border-beam rounded-2xl">
                    <ContinuityTimeline />
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-2xl border bg-fd-card/95 px-4 py-3 shadow-[0_20px_50px_-20px_oklch(0.2_0.05_265/0.45)] backdrop-blur sm:flex">
                  <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.15_175)] to-[oklch(0.74_0.14_235)] text-white">
                    <RotateCcw className="size-4" strokeWidth={2} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">Work restored</span>
                    <span className="font-mono text-xs text-fd-muted-foreground">0 edits lost</span>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </HeroParallax>

      {/* Every interruption Resumora recovers from */}
      <InterruptionsMarquee />

      {/* The feature board */}
      <section className="mx-auto w-full max-w-6xl px-6 py-28">
        <Reveal>
          <h2 className="mb-12 max-w-[20ch] text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Built for the moment things go wrong.
          </h2>
        </Reveal>
        <StaggerReveal>
          <FeatureBento />
        </StaggerReveal>
      </section>

      {/* The story, told by scrolling */}
      <ScrollStory />

      {/* Live demo */}
      <section id="try-it" className="scroll-mt-20 border-t bg-fd-card/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-28">
          <Reveal>
            <h2 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Now try to lose yours.
            </h2>
            <p className="mb-12 max-w-[56ch] text-lg text-fd-muted-foreground">
              This is the real runtime, storing to IndexedDB in your browser right now.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <LiveDemo />
          </Reveal>
        </div>
      </section>

      {/* Code */}
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-28 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal className="flex flex-col gap-5">
          <h2 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Three calls. Nothing lost.
          </h2>
          <p className="max-w-[44ch] text-lg leading-relaxed text-fd-muted-foreground">
            Record, checkpoint, restore. Your app replays what comes back, so it always owns its
            state.
          </p>
          <Link
            href="/docs/concepts/recovery-model"
            className="group inline-flex w-fit items-center gap-1.5 font-medium text-fd-primary"
          >
            How recovery works
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <Reveal delay={0.1} className="min-w-0 [&_figure]:my-0">
          <DynamicCodeBlock lang="ts" code={recoveryCode} />
        </Reveal>
      </section>

      {/* Packages */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-28">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-col gap-1 border-b px-7 py-6 transition-colors last:border-b-0 hover:bg-fd-accent/40 md:flex-row md:items-center md:justify-between"
              >
                <code className="font-mono text-sm font-medium">{pkg.name}</code>
                <span className="text-sm text-fd-muted-foreground">{pkg.body}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Closing call to action */}
      <section className="relative isolate overflow-hidden border-t">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="resumora-aurora resumora-aurora-a" />
          <div className="resumora-aurora resumora-aurora-b" />
        </div>
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 py-28">
          <h2 className="max-w-[18ch] text-4xl font-semibold tracking-tight text-balance md:text-6xl">
            Recover your first workspace in five minutes.
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/docs/getting-started" className={primaryCta}>
              Get started
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href={githubUrl} className={secondaryCta}>
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-10 text-sm text-fd-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <LogoMark className="size-4 text-fd-primary" />
            Resumora is open source under the Apache-2.0 license.
          </span>
          <a href={githubUrl} className="hover:text-fd-foreground">
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
