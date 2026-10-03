/**
 * The Resumora mark: a ring broken by an interruption, closing back on itself with an arrow,
 * around the point it returns to. Drawn in currentColor so it follows the theme.
 */
export function LogoMark({ className = 'size-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <path
        d="M27 16a11 11 0 1 1-4.2-8.65"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M23.6 3.6l-.6 4.1-4.1-.4"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3.4" fill="currentColor" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className="size-6 text-fd-primary" />
      <span className="font-display text-[1.1rem] font-semibold tracking-tight">Resumora</span>
    </span>
  );
}
