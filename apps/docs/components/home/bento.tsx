import { Check, LockKeyhole, LockKeyholeOpen, Package } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const cell = 'flex h-full flex-col gap-5 rounded-3xl border bg-fd-card p-7';

/** A crash in miniature: edits fill in, the tab flashes, everything is still there. */
function CrashGraphic() {
  const rows = ['Claimant', 'Amount', 'What happened', 'Photos'];
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-fd-background p-5">
      <div className="flex flex-col gap-3">
        {rows.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-fd-muted-foreground">{label}</span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-fd-muted">
              <span
                className="bento-anim block h-full origin-left rounded-full bg-gradient-to-r from-[oklch(0.82_0.12_300)] to-[oklch(0.84_0.12_170)]"
                style={{ animation: `bento-bar 5s ${i * 0.18}s ease-out infinite` }}
              />
            </span>
          </div>
        ))}
      </div>
      <div
        className="bento-anim pointer-events-none absolute inset-0 grid place-items-center bg-amber-400/20 text-sm font-semibold text-amber-700 backdrop-blur-[1px] dark:text-amber-300"
        style={{ animation: 'bento-crash 5s ease-in-out infinite' }}
      >
        Tab crashed. Nothing lost.
      </div>
    </div>
  );
}

/** The lock cycle: the shackle lifts only after reauthorization. */
function LockGraphic() {
  return (
    <div className="flex items-center justify-center gap-6 rounded-2xl border bg-fd-background py-6">
      <span className="grid size-14 place-items-center rounded-2xl bg-[oklch(0.92_0.06_355)] text-[oklch(0.45_0.15_355)] dark:bg-[oklch(0.35_0.08_355)] dark:text-[oklch(0.88_0.08_355)]">
        <LockKeyhole className="size-7" strokeWidth={1.75} />
      </span>
      <span className="font-mono text-xs text-fd-muted-foreground">reauthorize</span>
      <span
        className="bento-anim grid size-14 place-items-center rounded-2xl bg-[oklch(0.93_0.06_170)] text-[oklch(0.42_0.1_170)] dark:bg-[oklch(0.35_0.07_170)] dark:text-[oklch(0.88_0.08_170)]"
        style={{ animation: 'bento-lock 4s ease-in-out infinite' }}
      >
        <LockKeyholeOpen className="size-7" strokeWidth={1.75} />
      </span>
    </div>
  );
}

/** Tenant isolation: every key carries tenant, user and workspace. */
function TenantGraphic() {
  const keys = [
    { tenant: 'acme', tone: 'bg-[oklch(0.9_0.07_300)] dark:bg-[oklch(0.35_0.08_300)]' },
    { tenant: 'globex', tone: 'bg-[oklch(0.92_0.07_70)] dark:bg-[oklch(0.36_0.06_70)]' },
    { tenant: 'initech', tone: 'bg-[oklch(0.91_0.06_230)] dark:bg-[oklch(0.35_0.06_230)]' },
  ];
  return (
    <div className="flex flex-col gap-2">
      {keys.map((k, i) => (
        <code
          key={k.tenant}
          className={`bento-anim truncate rounded-lg px-3 py-2 font-mono text-xs ${k.tone}`}
          style={{ animation: `bento-float 4s ${i * 0.4}s ease-in-out infinite` }}
        >
          resumora::{k.tenant}::user::claim
        </code>
      ))}
    </div>
  );
}

/** Atomic commits: a batch lands all at once, or not at all. */
function CommitGraphic() {
  return (
    <div className="flex items-end gap-2">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="bento-anim grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.86_0.1_170)] to-[oklch(0.84_0.09_230)] text-white shadow-sm dark:from-[oklch(0.5_0.1_170)] dark:to-[oklch(0.5_0.1_230)]"
          style={{ animation: `bento-commit 3.5s ${i * 0.12}s ease-out infinite` }}
        >
          <Check className="size-5" strokeWidth={2.5} />
        </span>
      ))}
    </div>
  );
}

/** The feature board: five cells, each with a small animated graphic of the real behaviour. */
export function FeatureBento() {
  return (
    <div className="grid gap-4 md:grid-cols-6">
      <SpotlightCard data-reveal beam className="rounded-3xl md:col-span-4">
        <div className={cell}>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-semibold tracking-tight">Survives the crash</h3>
            <p className="max-w-[48ch] text-fd-muted-foreground">
              Every pull request runs real Chromium through a page reload, a tab crash and a
              whole-browser crash, and checks the work comes back intact.
            </p>
          </div>
          <CrashGraphic />
        </div>
      </SpotlightCard>

      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <h3 className="text-xl font-semibold tracking-tight">Never trusts the disk</h3>
          <p className="text-sm text-fd-muted-foreground">
            A locked workspace reveals nothing until your server reauthorizes the user.
          </p>
          <LockGraphic />
        </div>
      </SpotlightCard>

      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <h3 className="text-xl font-semibold tracking-tight">Strict about tenants</h3>
          <p className="text-sm text-fd-muted-foreground">
            Every record is namespaced, and IDs that could reach another tenant are rejected.
          </p>
          <TenantGraphic />
        </div>
      </SpotlightCard>

      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <h3 className="text-xl font-semibold tracking-tight">All or nothing</h3>
          <p className="text-sm text-fd-muted-foreground">
            Batches commit in one IndexedDB transaction, and a write counts only once it lands.
          </p>
          <CommitGraphic />
        </div>
      </SpotlightCard>

      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={`${cell} justify-between`}>
          <h3 className="text-xl font-semibold tracking-tight">Nothing to install but us</h3>
          <div className="flex items-end gap-4">
            <span className="font-display bg-gradient-to-br from-[oklch(0.7_0.17_300)] to-[oklch(0.72_0.14_170)] bg-clip-text text-7xl font-bold leading-none text-transparent">
              0
            </span>
            <span className="mb-2 flex items-center gap-1.5 text-sm text-fd-muted-foreground">
              <Package className="size-4" strokeWidth={1.75} /> runtime dependencies in core
            </span>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
