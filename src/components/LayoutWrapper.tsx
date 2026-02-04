'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOverlay = pathname === '/overlay';

  if (isOverlay) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <div className="md:pt-20 pb-24 md:pb-0">
        {children}
      </div>
      <div className="crt-overlay" />
    </>
  );
}
