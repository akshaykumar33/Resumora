import { Check, LockKeyhole, LockKeyholeOpen, Package } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const cell =
  'flex h-full flex-col gap-5 rounded-3xl border border-fd-border/80 bg-fd-card/85 p-7 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-fd-primary/40';

/** A crash in miniature: edits fill in, the tab flashes, everything is still there. */
function CrashGraphic() {
  const rows = ['Claimant', 'Amount', 'What happened', 'Photos'];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-fd-border/70 bg-fd-background/80 p-5 backdrop-blur-xs">
      <div className="flex flex-col gap-3">
        {rows.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs font-medium text-fd-muted-foreground">
              {label}
            </span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-fd-muted">
              <span
                className="bento-anim block h-full origin-left rounded-full bg-fd-primary/80"
                style={{ animation: `bento-bar 5s ${i * 0.18}s ease-out infinite` }}
              />
            </span>
          </div>
        ))}
      </div>
      <div
        className="bento-anim pointer-events-none absolute inset-0 grid place-items-center bg-warning/15 text-xs font-semibold tracking-wide uppercase text-warning backdrop-blur-[2px] dark:text-warning"
        style={{ animation: 'bento-crash 5s ease-in-out infinite' }}
      >
        Tab crashed · State preserved
      </div>
    </div>
  );
}

/** The lock cycle: the shackle lifts only after reauthorization. */
function LockGraphic() {
  return (
    <div className="flex items-center justify-center gap-5 rounded-2xl border border-fd-border/70 bg-fd-background/80 py-6 backdrop-blur-xs">
      <span className="grid size-12 place-items-center rounded-2xl border border-danger/25 bg-danger/10 text-danger dark:text-danger">
        <LockKeyhole className="size-6" strokeWidth={1.75} />
      </span>
      <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-fd-muted-foreground">
        reauthorize
      </span>
      <span
        className="bento-anim grid size-12 place-items-center rounded-2xl border border-success/25 bg-success/10 text-success dark:text-success"
        style={{ animation: 'bento-lock 4s ease-in-out infinite' }}
      >
        <LockKeyholeOpen className="size-6" strokeWidth={1.75} />
      </span>
    </div>
  );
}

/** Tenant isolation: every key carries tenant, user and workspace. */
function TenantGraphic() {
  const keys = [
    { tenant: 'acme', tone: 'border-info/30 bg-info/10 text-info dark:text-info' },
    {
      tenant: 'globex',
      tone: 'border-warning/30 bg-warning/10 text-warning dark:text-warning',
    },
    {
      tenant: 'initech',
      tone: 'border-fd-primary/30 bg-fd-primary/10 text-fd-primary dark:text-fd-primary',
    },
  ];
  return (
    <div className="flex flex-col gap-2">
      {keys.map((k, i) => (
        <code
          key={k.tenant}
          className={`bento-anim truncate rounded-xl border px-3 py-2 font-mono text-xs ${k.tone}`}
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
    <div className="flex items-end gap-2.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="bento-anim grid size-11 place-items-center rounded-xl bg-fd-primary text-fd-primary-foreground shadow-sm shadow-fd-primary/20"
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
            <h3 className="text-2xl font-semibold tracking-tight text-fd-foreground">
              Survives the crash
            </h3>
            <p className="max-w-[48ch] text-sm leading-relaxed text-fd-muted-foreground">
              Every pull request runs real Chromium through a page reload, a tab crash and a
              whole-browser crash, and checks the work comes back intact.
            </p>
          </div>
          <CrashGraphic />
        </div>
      </SpotlightCard>

      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <h3 className="text-xl font-semibold tracking-tight text-fd-foreground">
            Never trusts the disk
          </h3>
          <p className="text-sm leading-relaxed text-fd-muted-foreground">
            A locked workspace reveals nothing until your server reauthorizes the user.
          </p>
          <LockGraphic />
        </div>
      </SpotlightCard>

      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <h3 className="text-xl font-semibold tracking-tight text-fd-foreground">
            Strict about tenants
          </h3>
          <p className="text-sm leading-relaxed text-fd-muted-foreground">
            Every record is namespaced, and IDs that could reach another tenant are rejected.
          </p>
          <TenantGraphic />
        </div>
      </SpotlightCard>

      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <h3 className="text-xl font-semibold tracking-tight text-fd-foreground">
            All or nothing
          </h3>
          <p className="text-sm leading-relaxed text-fd-muted-foreground">
            Batches commit in one IndexedDB transaction, and a write counts only once it lands.
          </p>
          <CommitGraphic />
        </div>
      </SpotlightCard>

      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <h3 className="text-xl font-semibold tracking-tight text-fd-foreground">
            Nothing to install but us
          </h3>
          <div className="flex items-end gap-4 pt-2">
            <span className="font-display text-7xl font-bold leading-none text-fd-primary">0</span>
            <span className="mb-2 flex items-center gap-1.5 text-sm font-medium text-fd-muted-foreground">
              <Package className="size-4 text-fd-primary" strokeWidth={1.75} /> runtime dependencies
              in core
            </span>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
