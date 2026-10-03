import { Bricolage_Grotesque, Geist, Geist_Mono } from 'next/font/google';
import { accentBootScript } from '@/lib/accent';
import { Provider } from '@/components/provider';
import './global.css';

const sans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' });

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
