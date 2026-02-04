'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/ideas', label: 'Idéer', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
  { href: '/clips', label: 'Clips', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { href: '/schedule', label: 'Schedule', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navigation - Top */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mx-4 mt-4">
          <div className="max-w-4xl mx-auto px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="text-xl font-black text-white hover:text-[#00ff88] transition-colors">
                MAXESIS
              </Link>

              {/* Nav Items */}
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        relative px-4 py-2 rounded-xl font-mono text-sm transition-all duration-300
                        ${isActive
                          ? 'text-[#00ff88]'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl"
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Live indicator placeholder */}
              <div className="w-20" />
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation - Bottom */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mx-4 mb-4">
          <div className="px-2 py-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="flex items-center justify-around">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300
                      ${isActive
                        ? 'text-[#00ff88]'
                        : 'text-white/50 active:scale-95'
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeMobileTab"
                        className="absolute inset-0 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xl"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    <svg
                      className="relative z-10 w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={isActive ? 2.5 : 2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    <span className="relative z-10 text-xs font-mono">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
