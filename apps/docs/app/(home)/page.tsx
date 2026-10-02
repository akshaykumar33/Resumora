import Link from 'next/link';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { ArrowRight, LockKeyhole, ShieldCheck, Zap } from 'lucide-react';
import { ContinuityTimeline } from '@/components/home/continuity-timeline';

const recoveryCode = `const workspace = await runtime.openWorkspace(identity);

// Record each change as it happens
await workspace.recordIntent('SET_AMOUNT', { value: 1200 });

// Snapshot at a milestone
await workspace.saveCheckpoint({ amount: 1200, step: 3 });

// After any reload, crash or restart
const recovered = await workspace.restoreLatestCheckpoint();`;

const steps = [
  {
    verb: 'Record',
    body: 'Every change becomes a small, numbered intent, saved the moment the browser confirms the write.',
  },
  {
    verb: 'Checkpoint',
    body: 'At a milestone, snapshot your state. The intents it covers are pruned, so the journal stays short.',
  },
  {
    verb: 'Restore',
    body: 'On return, get the checkpoint plus every intent after it, and replay them onto your state.',
  },
];

const packages = [
  { name: '@resumora/core', body: 'The runtime. No dependencies, no browser APIs.' },
  { name: '@resumora/storage-indexeddb', body: 'Persistent browser storage on native IndexedDB.' },
  { name: '@resumora/storage-memory', body: 'In-memory storage with fault injection, for tests.' },
];

const githubUrl = 'https://github.com/akshaykumar33/Resumora';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-14 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tighter text-balance md:text-5xl lg:text-6xl">
            Your users never lose the work they’ve done.
          </h1>
          <p className="max-w-[46ch] text-lg leading-relaxed text-fd-muted-foreground text-pretty">
            Resumora brings unfinished work back after crashes, reloads and expired sessions,
            without trusting stored data as permission.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/docs/getting-started"
              className="group inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-transform active:scale-[0.98]"
            >
              Get started
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={githubUrl}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent active:scale-[0.98]"
            >
              View on GitHub
            </a>
          </div>
        </div>
        <ContinuityTimeline />
      </section>

      {/* How it works: code beside the three moves */}
      <section className="border-y bg-fd-card/40">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div className="min-w-0 [&_figure]:my-0">
            <DynamicCodeBlock lang="ts" code={recoveryCode} />
          </div>
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Three calls. Nothing lost.
            </h2>
            <dl className="flex flex-col gap-6">
              {steps.map((step) => (
                <div key={step.verb} className="flex flex-col gap-1">
                  <dt className="font-medium">{step.verb}</dt>
                  <dd className="text-fd-muted-foreground leading-relaxed">{step.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Guarantees: asymmetric grid, one lead cell */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="mb-10 max-w-2xl text-3xl font-semibold tracking-tight text-balance">
          Built for the moment things go wrong.
        </h2>
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <div className="flex flex-col justify-between gap-10 rounded-2xl bg-[oklch(0.4_0.075_185)] p-8 text-[oklch(0.98_0.01_185)] md:col-span-2 md:row-span-2">
            <Zap className="size-7" strokeWidth={1.5} />
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-semibold tracking-tight">Survives the crash</h3>
              <p className="max-w-[48ch] leading-relaxed opacity-85">
                Every pull request runs real Chromium through a page reload, a tab crash and a
                whole-browser crash, and checks the work comes back intact.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border bg-fd-card p-6">
            <LockKeyhole className="size-5 text-fd-primary" strokeWidth={1.75} />
            <h3 className="font-semibold">Never trusts the disk</h3>
            <p className="text-sm leading-relaxed text-fd-muted-foreground">
              A locked workspace reveals nothing until your server reauthorizes the user.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border bg-fd-accent/50 p-6">
            <ShieldCheck className="size-5 text-fd-primary" strokeWidth={1.75} />
            <h3 className="font-semibold">Strict about tenants</h3>
            <p className="text-sm leading-relaxed text-fd-muted-foreground">
              Every record is namespaced, and IDs that could reach another tenant are rejected.
            </p>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="overflow-hidden rounded-2xl border">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className="flex flex-col gap-1 border-b px-6 py-5 last:border-b-0 md:flex-row md:items-center md:justify-between"
            >
              <code className="font-mono text-sm font-medium">{pkg.name}</code>
              <span className="text-sm text-fd-muted-foreground">{pkg.body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Closing call to action */}
      <section className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Recover your first workspace in five minutes.
          </h2>
          <Link
            href="/docs/getting-started"
            className="group inline-flex items-center gap-2 rounded-full bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-transform active:scale-[0.98]"
          >
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
