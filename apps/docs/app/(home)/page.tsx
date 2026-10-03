import Link from 'next/link';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { ArrowRight, LockKeyhole, ShieldCheck, Zap } from 'lucide-react';
import { IntentField } from '@/components/home/intent-field';
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

const stats = [
  { value: '0', label: 'runtime dependencies in core' },
  { value: '3', label: 'crash scenarios proven in real Chromium on every PR' },
  { value: '6', label: 'methods to plug in any storage' },
];

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

      {/* Hero: the canvas tells the story behind the promise */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="resumora-grid absolute inset-0 opacity-70" />
          <div className="absolute inset-0 opacity-35 md:opacity-100">
            <IntentField />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-fd-background)_28%,transparent_62%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-fd-background" />
        </div>
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl flex-col justify-center gap-8 px-6 py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border bg-fd-background/70 px-3 py-1 text-xs font-medium text-fd-muted-foreground backdrop-blur">
              <LogoMark className="size-3.5 text-fd-primary" />
              Application continuity runtime
            </span>
          </Reveal>
          <HeroTitle
            text="Your users never lose the work they’ve done."
            className="max-w-[13ch] text-[clamp(2.75rem,1.6rem+5vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-balance"
          />
          <Reveal delay={0.4}>
            <p className="max-w-[44ch] text-lg leading-relaxed text-fd-muted-foreground md:text-xl">
              Resumora brings unfinished work back after crashes, reloads and expired sessions,
              without trusting stored data as permission.
            </p>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="flex flex-wrap gap-3">
              <Link href="/docs/getting-started" className={primaryCta}>
                Get started
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href="#try-it" className={secondaryCta}>
                Try to break it
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats: real numbers only */}
      <section className="border-y">
        <div className="mx-auto grid w-full max-w-6xl gap-px bg-fd-border sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="bg-fd-background px-6 py-12">
              <div className="font-display text-6xl font-semibold tracking-tighter tabular-nums">
                {s.value}
              </div>
              <div className="mt-3 max-w-[24ch] text-sm text-fd-muted-foreground">{s.label}</div>
            </Reveal>
          ))}
        </div>
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

      {/* Guarantees */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-28">
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Reveal className="md:col-span-2 md:row-span-2">
            <div className="relative flex h-full min-h-80 flex-col justify-between gap-10 overflow-hidden rounded-3xl bg-[var(--resumora-deep)] p-10 text-white">
              <div
                aria-hidden
                className="absolute -right-28 -top-28 size-96 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--resumora-glow-a)_55%,transparent),transparent_70%)]"
              />
              <Zap className="relative size-8" strokeWidth={1.5} />
              <div className="relative flex flex-col gap-3">
                <h3 className="text-3xl font-semibold tracking-tight">Survives the crash</h3>
                <p className="max-w-[46ch] text-lg leading-relaxed opacity-85">
                  Every pull request runs real Chromium through a page reload, a tab crash and a
                  whole-browser crash, and checks the work comes back intact.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col gap-3 rounded-3xl border bg-fd-card p-7">
              <LockKeyhole className="size-6 text-fd-primary" strokeWidth={1.75} />
              <h3 className="text-lg font-semibold">Never trusts the disk</h3>
              <p className="leading-relaxed text-fd-muted-foreground">
                A locked workspace reveals nothing until your server reauthorizes the user.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="flex h-full flex-col gap-3 rounded-3xl border bg-fd-accent/60 p-7">
              <ShieldCheck className="size-6 text-fd-primary" strokeWidth={1.75} />
              <h3 className="text-lg font-semibold">Strict about tenants</h3>
              <p className="leading-relaxed text-fd-muted-foreground">
                Every record is namespaced, and IDs that could reach another tenant are rejected.
              </p>
            </div>
          </Reveal>
        </div>
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
