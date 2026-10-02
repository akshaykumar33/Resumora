import Link from 'next/link';

const guarantees = [
  {
    title: 'Survives the crash',
    body: 'Work is recorded as it happens and restored after a reload, a tab crash or a whole-browser crash. Verified in real Chromium on every change.',
  },
  {
    title: 'Never trusts the disk',
    body: 'Stored work is evidence, not permission. A locked workspace reveals nothing until your server reauthorizes the user.',
  },
  {
    title: 'Strict about tenants',
    body: 'Every record is namespaced by tenant, user and workspace, and IDs that could forge another tenant’s keys are rejected.',
  },
];

const example = `const workspace = await runtime.openWorkspace(identity);

await workspace.recordIntent('UPDATE_FIELD', { field: 'amount', value: 1200 });
await workspace.saveCheckpoint({ amount: 1200, step: 3 });

// …the tab crashes. Later:
const recovered = await workspace.restoreLatestCheckpoint();`;

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16 md:py-24">
      <section className="flex flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-widest text-fd-primary">
          Application continuity runtime
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Your users never lose the work they’ve already done.
        </h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground text-pretty">
          Resumora records what people do in your app and brings it back after crashes, reloads and
          expired sessions, without ever treating stored data as permission to see it.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/docs/getting-started"
            className="rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
          <Link
            href="/docs/concepts/recovery-model"
            className="rounded-lg border px-5 py-2.5 font-medium transition-colors hover:bg-fd-accent"
          >
            How recovery works
          </Link>
        </div>
      </section>

      <section aria-label="Example" className="overflow-hidden rounded-xl border bg-fd-card">
        <div className="border-b px-4 py-2 font-mono text-xs text-fd-muted-foreground">app.ts</div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code>{example}</code>
        </pre>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {guarantees.map((g) => (
          <div key={g.title} className="flex flex-col gap-2">
            <h2 className="font-semibold">{g.title}</h2>
            <p className="text-sm leading-relaxed text-fd-muted-foreground">{g.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
