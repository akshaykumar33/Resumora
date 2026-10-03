import {
  BatteryLow,
  CloudOff,
  KeyRound,
  Layers,
  RefreshCw,
  Rocket,
  WifiOff,
  Zap,
} from 'lucide-react';

const INTERRUPTIONS = [
  { icon: Zap, label: 'Tab crashed' },
  { icon: KeyRound, label: 'Token expired' },
  { icon: Rocket, label: 'New deploy reloaded the page' },
  { icon: WifiOff, label: 'Went offline' },
  { icon: BatteryLow, label: 'Laptop died' },
  { icon: Layers, label: 'Tab discarded in the background' },
  { icon: RefreshCw, label: 'Accidental refresh' },
  { icon: CloudOff, label: 'Server returned 500' },
];

/** Everything that interrupts real work, scrolling past. Pauses on hover. */
export function InterruptionsMarquee() {
  const items = [...INTERRUPTIONS, ...INTERRUPTIONS];
  return (
    <section aria-label="Interruptions Resumora recovers from" className="border-y py-6">
      <div className="marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track">
          {items.map(({ icon: Icon, label }, i) => (
            <span
              key={`${label}-${i}`}
              aria-hidden={i >= INTERRUPTIONS.length}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border bg-fd-card px-4 py-2 text-sm font-medium shadow-sm"
            >
              <Icon className="size-4 text-fd-primary" strokeWidth={1.75} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
