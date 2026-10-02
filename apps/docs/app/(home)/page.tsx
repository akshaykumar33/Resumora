import Link from 'next/link';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { ArrowRight, LockKeyhole, ShieldCheck, Zap } from 'lucide-react';
import { Aurora } from '@/components/home/aurora';
import { ContinuityTimeline } from '@/components/home/continuity-timeline';
import { LiveDemo } from '@/components/home/live-demo';
import { HeroTitle, Reveal } from '@/components/home/motion';
import { RecoveryDiagram } from '@/components/home/recovery-diagram';

const recoveryCode = `const workspace = await runtime.openWorkspace(identity);

// Record each change as it happens
await workspace.recordIntent('SET_AMOUNT', { value: 1200 });

// Snapshot at a milestone
await workspace.saveCheckpoint({ amount: 1200, step: 3 });

// After any reload, crash or restart
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
  'group inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.47_0.09_185/0.6)] transition-transform hover:-translate-y-px active:scale-[0.98]';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative isolate">
        <Aurora />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-14 md:pt-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <HeroTitle
              text="Your users never lose the work they’ve done."
              className="text-4xl font-semibold leading-[1.05] tracking-tighter text-balance md:text-5xl lg:text-6xl"
            />
            <Reveal delay={0.35}>
              <p className="max-w-[46ch] text-lg leading-relaxed text-fd-muted-foreground text-pretty">
                Resumora brings unfinished work back after crashes, reloads and expired sessions,
                without trusting stored data as permission.
              </p>
            </Reveal>
            <Reveal delay={0.45}>
              <div className="flex flex-wrap gap-3">
                <Link href="/docs/getting-started" className={primaryCta}>
                  Get started
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="#try-it"
                  className="inline-flex items-center gap-2 rounded-full border bg-fd-background/60 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:bg-fd-accent active:scale-[0.98]"
                >
                  Try to break it
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <ContinuityTimeline />
          </Reveal>
        </div>
      </section>

      {/* Stats: real numbers only */}
      <section className="border-y">
        <div className="mx-auto grid w-full max-w-6xl gap-px bg-fd-border sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="bg-fd-background px-6 py-10">
              <div className="text-5xl font-semibold tracking-tighter tabular-nums">{s.value}</div>
              <div className="mt-2 max-w-[24ch] text-sm text-fd-muted-foreground">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Live demo */}
      <section id="try-it" className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-24">
        <Reveal>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Try to lose your work.
          </h2>
          <p className="mb-10 max-w-[60ch] text-fd-muted-foreground">
            This is the real runtime, storing to IndexedDB in your browser right now.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <LiveDemo />
        </Reveal>
      </section>

      {/* How it works */}
      <section className="border-y bg-fd-card/40">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-24 lg:grid-cols-2 lg:items-center">
          <Reveal className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              Three calls. Nothing lost.
            </h2>
            <p className="max-w-[52ch] text-fd-muted-foreground leading-relaxed">
              Record each change as a small intent, checkpoint at milestones, and restore after any
              interruption. Your app replays what comes back, so it always owns its state.
            </p>
            <div className="min-w-0 [&_figure]:my-0">
              <DynamicCodeBlock lang="ts" code={recoveryCode} />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <RecoveryDiagram />
          </Reveal>
        </div>
      </section>

      {/* Guarantees */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <Reveal>
          <h2 className="mb-10 max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            Built for the moment things go wrong.
          </h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Reveal className="md:col-span-2 md:row-span-2">
            <div className="relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-2xl bg-[oklch(0.4_0.075_185)] p-8 text-[oklch(0.98_0.01_185)]">
              <div
                aria-hidden
                className="absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,oklch(0.7_0.12_175/0.45),transparent_70%)]"
              />
              <Zap className="relative size-7" strokeWidth={1.5} />
              <div className="relative flex flex-col gap-3">
                <h3 className="text-2xl font-semibold tracking-tight">Survives the crash</h3>
                <p className="max-w-[48ch] leading-relaxed opacity-85">
                  Every pull request runs real Chromium through a page reload, a tab crash and a
                  whole-browser crash, and checks the work comes back intact.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border bg-fd-card p-6">
              <LockKeyhole className="size-5 text-fd-primary" strokeWidth={1.75} />
              <h3 className="font-semibold">Never trusts the disk</h3>
              <p className="text-sm leading-relaxed text-fd-muted-foreground">
                A locked workspace reveals nothing until your server reauthorizes the user.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="flex h-full flex-col gap-3 rounded-2xl border bg-fd-accent/50 p-6">
              <ShieldCheck className="size-5 text-fd-primary" strokeWidth={1.75} />
              <h3 className="font-semibold">Strict about tenants</h3>
              <p className="text-sm leading-relaxed text-fd-muted-foreground">
                Every record is namespaced, and IDs that could reach another tenant are rejected.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Packages */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-col gap-1 border-b px-6 py-5 transition-colors last:border-b-0 hover:bg-fd-accent/40 md:flex-row md:items-center md:justify-between"
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
        <Aurora />
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-20 md:flex-row md:items-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Recover your first workspace in five minutes.
          </h2>
          <Link href="/docs/getting-started" className={primaryCta}>
            Get started
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-fd-muted-foreground">
          <span>Resumora is open source under the Apache-2.0 license.</span>
          <a href={githubUrl} className="hover:text-fd-foreground">
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
