'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

/** Sonner toasts, styled from the active palette so they belong in every theme. */
export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme === 'light' ? 'light' : 'dark'}
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            '!rounded-2xl !border !border-fd-border !bg-fd-popover !text-fd-foreground !shadow-[0_20px_50px_-20px_var(--resumora-shadow)] !font-sans',
          icon: '!text-fd-primary',
          description: '!text-fd-muted-foreground',
        },
      }}
    />
  );
}
