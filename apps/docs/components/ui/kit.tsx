import Link from 'next/link';
import type { ComponentProps, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/*
 * Resumora's component kit: the few primitives every landing section is built from, so spacing,
 * type, colour and radius come from one place. Radius rule: interactive controls are full pills,
 * surfaces are 24px (rounded-3xl), insets inside a surface are 16px (rounded-2xl).
 * See /kit for every piece rendered in both themes.
 */

/* ---------------------------------------------------------------------------------------------
 * Layout
 * ------------------------------------------------------------------------------------------- */

type Tone = 'base' | 'sunken' | 'raised';

const toneClass: Record<Tone, string> = {
  base: '',
  sunken: 'bg-sunken',
  raised: 'bg-raised',
};

/** A page band: full-bleed background tone, a centred 1152px container, the section rhythm. */
export function Section({
  tone = 'base',
  bordered = false,
  className,
  containerClassName,
  children,
  ...rest
}: ComponentProps<'section'> & {
  tone?: Tone;
  bordered?: boolean;
  containerClassName?: string;
}) {
  return (
    <section
      className={cn(
        'relative isolate',
        toneClass[tone],
        bordered && 'border-y border-fd-border',
        className,
      )}
      {...rest}
    >
      <div className={cn('mx-auto w-full max-w-6xl px-gutter py-section', containerClassName)}>
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------------------------
 * Type
 * ------------------------------------------------------------------------------------------- */

/** The one eyebrow style. Use sparingly: at most one in every three sections. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-fd-primary',
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}

/** Section heading block: optional eyebrow, a title, an optional lead. Stacked, never split. */
export function Heading({
  eyebrow,
  title,
  lead,
  align = 'start',
  as: Tag = 'h2',
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'start' | 'center';
  as?: ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag className="max-w-[20ch] font-display text-title font-semibold text-fd-foreground">
        {title}
      </Tag>
      {lead && (
        <p className="max-w-[52ch] text-lead text-pretty text-fd-muted-foreground">{lead}</p>
      )}
    </div>
  );
}

/** Italic accent words inside a display heading. */
export function Em({ children }: { children: ReactNode }) {
  return <span className="display-em">{children}</span>;
}

/* ---------------------------------------------------------------------------------------------
 * Controls
 * ------------------------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const buttonBase =
  'group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const buttonVariant: Record<ButtonVariant, string> = {
  primary:
    'bg-fd-primary text-fd-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.28),0_14px_34px_-14px_var(--color-fd-primary)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_oklch(1_0_0/0.28),0_18px_40px_-14px_var(--color-fd-primary)]',
  secondary:
    'border border-fd-border bg-fd-card/70 text-fd-foreground hover:border-fd-primary/45 hover:bg-fd-accent',
  ghost: 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground',
};

const buttonSize: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-12 px-6 text-[15px]',
};

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return cn(buttonBase, buttonVariant[variant], buttonSize[size]);
}

/** A link styled as a button. Internal hrefs use next/link; external ones open in place. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}) {
  const cls = cn(buttonClass(variant, size), className);
  return href.startsWith('/') ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}

/* ---------------------------------------------------------------------------------------------
 * Surfaces and labels
 * ------------------------------------------------------------------------------------------- */

/** The raised card surface: 24px radius, hairline border, a top highlight and a tinted shadow. */
export function Surface({
  className,
  inset = false,
  ...rest
}: ComponentProps<'div'> & { inset?: boolean }) {
  return (
    <div
      className={cn(
        inset
          ? 'rounded-2xl border border-fd-border bg-sunken/70'
          : 'rounded-3xl border border-fd-border bg-fd-card shadow-[0_24px_60px_-32px_var(--resumora-shadow),inset_0_1px_0_color-mix(in_oklch,var(--color-fd-foreground)_6%,transparent)]',
        className,
      )}
      {...rest}
    />
  );
}

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

const badgeTone: Record<BadgeTone, string> = {
  neutral: 'border-fd-border bg-fd-muted/60 text-fd-muted-foreground',
  accent: 'border-fd-primary/30 bg-fd-primary/10 text-fd-primary',
  success: 'border-success/30 bg-success/10 text-success',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  danger: 'border-danger/30 bg-danger/10 text-danger',
  info: 'border-info/30 bg-info/10 text-info',
};

/** A small status label. Tone carries meaning: success, warning, danger, info, or accent. */
export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium',
        badgeTone[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-grid h-6 min-w-6 place-items-center rounded-md border border-b-2 border-fd-border bg-fd-card px-1.5 font-mono text-[11px] text-fd-muted-foreground',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
