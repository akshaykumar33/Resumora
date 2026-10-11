import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconDatabase,
  IconLayersIntersect,
  IconLock,
  IconLockOpen,
  IconServer2,
  IconShieldCheck,
  IconShieldExclamation,
} from '@tabler/icons-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const cell =
  'group relative flex h-full flex-col justify-between gap-5 overflow-hidden rounded-2xl md:rounded-3xl border border-fd-border/70 bg-gradient-to-b from-fd-card/95 via-fd-card/80 to-fd-card/50 p-5 md:p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-fd-primary/50 hover:shadow-[0_0_28px_-6px_color-mix(in_oklch,var(--color-fd-primary)_22%,transparent)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-fd-primary/30 before:to-transparent';

/**
 * Realistic crash recovery simulation:
 * Displays active draft fields, simulates an abrupt tab crash (SIGKILL),
 * and demonstrates automatic rehydration of pending intents from local IndexedDB WAL.
 */
function CrashGraphic() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-fd-border/70 bg-fd-background/95 p-3.5 sm:p-5 shadow-xs">
      {/* Mini App Form Window Header */}
      <div className="flex items-center justify-between border-b border-fd-border/60 pb-2.5">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5 pr-1">
            <span className="size-2 sm:size-2.5 rounded-full bg-danger/70" />
            <span className="size-2 sm:size-2.5 rounded-full bg-warning/70" />
            <span className="size-2 sm:size-2.5 rounded-full bg-success/70" />
          </div>
          <span className="font-mono text-[11px] sm:text-xs font-semibold text-fd-foreground">
            Claim Draft: #CLM-9402
          </span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-fd-primary/30 bg-fd-primary/10 px-2 py-0.5 font-mono text-[9.5px] sm:text-[10px] font-medium text-fd-primary">
          <span className="size-1 rounded-full bg-fd-primary animate-pulse" />
          WAL: 4 buffered
        </span>
      </div>

      {/* Realistic form fields */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-fd-border/50 bg-fd-muted/30 px-3 py-1.5 text-xs">
          <span className="text-fd-muted-foreground font-medium text-[11px] sm:text-[11.5px]">
            Policyholder
          </span>
          <span className="font-mono text-fd-foreground text-[11px] sm:text-[11.5px]">
            Elena Vance
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-fd-border/50 bg-fd-muted/30 px-3 py-1.5 text-xs">
          <span className="shrink-0 text-fd-muted-foreground font-medium text-[11px] sm:text-[11.5px]">
            Incident Report
          </span>
          <span className="truncate max-w-[140px] xs:max-w-[210px] text-fd-foreground text-[11px] sm:text-[11.5px]">
            Water valve fracture in unit 4B...
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-fd-border/50 bg-fd-muted/30 px-3 py-1.5 text-xs">
          <span className="text-fd-muted-foreground font-medium text-[11px] sm:text-[11.5px]">
            Estimated Loss
          </span>
          <span className="font-mono text-fd-foreground font-semibold text-[11px] sm:text-[11.5px]">
            $38,500.00
          </span>
        </div>
      </div>

      {/* Crash overlay banner */}
      <div
        className="bento-anim pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-fd-background/90 backdrop-blur-[3px] p-3 sm:p-4 text-center"
        style={{ animation: 'bento-crash 6s ease-in-out infinite' }}
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-warning/50 bg-warning/15 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold text-warning shadow-md">
          <IconAlertTriangle className="size-3.5" />
          Chromium tab discarded (SIGKILL)
        </div>
        <span className="font-mono text-[10px] sm:text-[10.5px] text-fd-foreground font-medium">
          4 pending intents replayed from IndexedDB in 2.1ms
        </span>
      </div>
    </div>
  );
}

/**
 * The 6-step zero-knowledge authentication lifecycle:
 * Guarantees stored local data never confers authorization.
 */
function LockGraphic() {
  const steps = ['Lock', 'Reauthenticate', 'Reauthorize', 'Unlock', 'Revalidate', 'Reconcile'];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Cryptographic lock visual */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 rounded-2xl border border-fd-border/70 bg-fd-background/80 p-3 sm:p-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 sm:size-9 shrink-0 place-items-center rounded-xl border border-danger/25 bg-danger/10 text-danger">
            <IconLock className="size-3.5 sm:size-4" strokeWidth={1.8} />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-fd-foreground">At-rest encryption</span>
            <span className="font-mono text-[10px] text-fd-muted-foreground">AES-GCM-256</span>
          </div>
        </div>

        <IconArrowRight className="size-3.5 sm:size-4 text-fd-muted-foreground self-center xs:self-auto rotate-90 xs:rotate-0" />

        <div className="flex items-center gap-2.5">
          <span className="grid size-8 sm:size-9 shrink-0 place-items-center rounded-xl border border-success/25 bg-success/10 text-success">
            <IconLockOpen className="size-3.5 sm:size-4" strokeWidth={1.8} />
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-fd-foreground">In-memory decrypt</span>
            <span className="font-mono text-[10px] text-success">Only post-auth</span>
          </div>
        </div>
      </div>

      {/* 6 Step Progression */}
      <div className="grid grid-cols-2 xs:grid-cols-3 gap-1.5 font-mono text-[10px] sm:text-[10.5px]">
        {steps.map((step, idx) => (
          <div
            key={step}
            className="flex items-center gap-1.5 rounded-lg border border-fd-border/60 bg-fd-muted/30 px-2 py-1 text-fd-muted-foreground"
          >
            <span className="text-fd-primary font-bold">{idx + 1}</span>
            <span className="truncate">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Strict Identity Namespacing:
 * Prefixes all records with `resumora::{tenantId}::{userId}::{workspaceId}`.
 * Blocks cross-tenant bleed mathematically.
 */
function TenantGraphic() {
  const tenants = [
    {
      ns: 'resumora::tenant_us_east::usr_92a::ws_claims',
      label: 'Tenant US-East',
      badge: 'border-info/30 bg-info/10 text-info',
    },
    {
      ns: 'resumora::tenant_eu_west::usr_44c::ws_underwriting',
      label: 'Tenant EU-West',
      badge: 'border-success/30 bg-success/10 text-success',
    },
  ];

  return (
    <div className="space-y-2.5">
      {tenants.map((t) => (
        <div key={t.ns} className="rounded-xl border border-fd-border/60 bg-fd-background/80 p-2.5">
          <div className="flex items-center justify-between pb-1 text-[11px] font-medium text-fd-muted-foreground">
            <span>{t.label}</span>
            <span className="text-success font-mono text-[10px]">Isolated</span>
          </div>
          <code className="block truncate font-mono text-[11px] text-fd-foreground/90">{t.ns}</code>
        </div>
      ))}

      {/* Cross-tenant block notification */}
      <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-[11px] text-danger">
        <IconShieldExclamation className="size-3.5 shrink-0" />
        <span className="font-mono text-[10.5px]">Cross-tenant read rejected: 0 leakage</span>
      </div>
    </div>
  );
}

/**
 * Atomic Commit Engine:
 * Batches commit in a single atomic transaction.
 * Either all writes land, or zero writes touch disk.
 */
function CommitGraphic() {
  const ops = [
    { label: 'checkpoint.write()', state: 'Committed' },
    { label: 'intent_wal.append()', state: 'Committed' },
    { label: 'metadata.update()', state: 'Committed' },
  ];

  return (
    <div className="space-y-2.5">
      <div className="rounded-xl border border-fd-border/60 bg-fd-background/80 p-3 space-y-2">
        <div className="flex items-center justify-between border-b border-fd-border/40 pb-1.5 font-mono text-[10.5px] text-fd-muted-foreground">
          <span>Single IndexedDB Batch</span>
          <span className="text-fd-primary font-semibold">Atomic (All-or-None)</span>
        </div>

        {ops.map((op, idx) => (
          <div
            key={op.label}
            className="flex items-center justify-between text-xs font-mono text-fd-foreground"
          >
            <span className="text-fd-muted-foreground">
              {idx + 1}. {op.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-success">
              <IconCheck className="size-3" strokeWidth={2.5} />
              {op.state}
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[11px] text-fd-muted-foreground text-center">
        No half-written states. Zero corrupt checkpoints.
      </p>
    </div>
  );
}

/**
 * Pluggable Storage Architecture:
 * Core runtime has 0 dependencies. Connects seamlessly to IndexedDB, SQLite, or In-Memory.
 */
function StorageMatrixGraphic() {
  const adapters = [
    { name: 'IndexedDB', target: 'Web / PWA', icon: IconDatabase },
    { name: 'SQLite / OPFS', target: 'Desktop / Native', icon: IconServer2 },
    { name: 'In-Memory', target: 'Headless / SSR Tests', icon: IconLayersIntersect },
  ];

  return (
    <div className="space-y-2">
      {adapters.map((a) => {
        const Icon = a.icon;
        return (
          <div
            key={a.name}
            className="flex items-center justify-between rounded-xl border border-fd-border/60 bg-fd-background/80 px-3 py-2 text-xs"
          >
            <div className="flex items-center gap-2">
              <Icon className="size-3.5 text-fd-primary" />
              <span className="font-mono font-medium text-fd-foreground">{a.name}</span>
            </div>
            <span className="text-[11px] text-fd-muted-foreground">{a.target}</span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The feature board: five cells, each illustrating a real architectural guarantee
 * rather than empty placeholder numbers or generic graphics.
 */
export function FeatureBento() {
  return (
    <div className="grid gap-4 md:grid-cols-6">
      {/* 1. Survives the crash (Col span 4) */}
      <SpotlightCard data-reveal beam className="rounded-3xl md:col-span-4">
        <div className={cell}>
          <div>
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-fd-primary">
              Deterministic Recovery
            </span>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-fd-foreground">
              Survives the crash
            </h3>
            <p className="mt-1.5 max-w-[48ch] text-sm leading-relaxed text-fd-muted-foreground">
              Every pull request runs real Chromium through tab kill, unexpected reload, and
              whole-browser crash. Checkpoint + Intent replay produces identical state on restart.
            </p>
          </div>
          <CrashGraphic />
        </div>
      </SpotlightCard>

      {/* 2. Never trusts the disk (Col span 2) */}
      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <div>
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-fd-primary">
              Security Invariant #1
            </span>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-fd-foreground">
              Never trusts the disk
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-fd-muted-foreground">
              Persistence never confers authorization. Data remains encrypted at rest until upstream
              server reauthorizes the user.
            </p>
          </div>
          <LockGraphic />
        </div>
      </SpotlightCard>

      {/* 3. Strict about tenants (Col span 2) */}
      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <div>
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-fd-primary">
              Security Invariant #2
            </span>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-fd-foreground">
              Strict about tenants
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-fd-muted-foreground">
              All persisted keys enforce the <code>resumora::tenant::user::workspace</code>{' '}
              namespace. Cross-tenant access is rejected at runtime.
            </p>
          </div>
          <TenantGraphic />
        </div>
      </SpotlightCard>

      {/* 4. All or nothing (Col span 2) */}
      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <div>
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-fd-primary">
              Transaction Safety
            </span>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-fd-foreground">
              All or nothing
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-fd-muted-foreground">
              Edits commit in one atomic IndexedDB transaction. If a crash interrupts the flush, the
              batch rolls back cleanly.
            </p>
          </div>
          <CommitGraphic />
        </div>
      </SpotlightCard>

      {/* 5. Pluggable Storage Matrix (Col span 2) */}
      <SpotlightCard data-reveal className="rounded-3xl md:col-span-2">
        <div className={cell}>
          <div>
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-fd-primary">
              Decoupled Architecture
            </span>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-fd-foreground">
              Pluggable storage
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-fd-muted-foreground">
              <code>@resumora/core</code> has zero external dependencies and zero browser globals.
              Plug in IndexedDB, SQLite, or memory adapters.
            </p>
          </div>
          <StorageMatrixGraphic />
        </div>
      </SpotlightCard>
    </div>
  );
}
