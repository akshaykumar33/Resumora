import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { SiteNav } from '@/components/site-nav';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()} nav={{ enabled: false }}>
      <SiteNav />
      {children}
    </HomeLayout>
  );
}
