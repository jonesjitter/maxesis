'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navigation from './Navigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOverlay = pathname === '/overlay';

  // Make body transparent for overlay page
  useEffect(() => {
    if (isOverlay) {
      document.body.style.background = 'transparent';
      document.documentElement.style.background = 'transparent';
    }
    return () => {
      document.body.style.background = '';
      document.documentElement.style.background = '';
    };
  }, [isOverlay]);

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
