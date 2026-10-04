import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Sans } from 'next/font/google';
import { accentBootScript } from '@/lib/accent';
import { Provider } from '@/components/provider';
import './global.css';

const sans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const display = Instrument_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['wdth'],
  variable: '--font-instrument',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://resumora.dev'),
  title: {
    default: 'Resumora — Application Continuity & Workflow Recovery Runtime',
    template: '%s · Resumora',
  },
  description:
    'Resumora guarantees users never lose meaningful work when web and mobile environments experience crashes, tab discards, token expirations, or network flaps.',
  openGraph: {
    title: 'Resumora — Application Continuity & Workflow Recovery Runtime',
    description:
      'Guarantees users never lose meaningful work when web environments crash or reload.',
    url: 'https://resumora.dev',
    siteName: 'Resumora',
    locale: 'en_US',
    type: 'website',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: accentBootScript }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
