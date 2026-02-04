'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import GlitchText from '@/components/GlitchText';
import SocialLinks from '@/components/SocialLinks';
import StatusBar from '@/components/StatusBar';
import StatsSection from '@/components/StatsSection';

const MatrixRain = dynamic(() => import('@/components/MatrixRain'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <MatrixRain />

      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Status indicator */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StatusBar />
        </motion.div>

        {/* Main content */}
        <div className="flex flex-col items-center text-center max-w-4xl">
          {/* Subtitle */}
          <motion.p
            className="text-[#00ff88] font-mono text-sm tracking-[0.3em] uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Welcome to the system
          </motion.p>

          {/* Main title */}
          <GlitchText
            text="MAXESIS"
            className="text-6xl sm:text-8xl md:text-9xl font-black text-white tracking-tight"
          />

          {/* Tagline */}
          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span className="px-3 py-1 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded text-[#00ff88] font-mono text-sm">
              CREATOR
            </span>
            <span className="text-white/30">//</span>
            <span className="px-3 py-1 bg-[#9146ff]/10 border border-[#9146ff]/30 rounded text-[#9146ff] font-mono text-sm">
              GAMER
            </span>
            <span className="text-white/30">//</span>
            <span className="px-3 py-1 bg-[#ff0080]/10 border border-[#ff0080]/30 rounded text-[#ff0080] font-mono text-sm">
              ENTERTAINER
            </span>
          </motion.div>

          {/* Bio text */}
          <motion.p
            className="mt-8 text-white/60 max-w-md text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Building the future of entertainment, one stream at a time.
          </motion.p>

          {/* Social links */}
          <SocialLinks />

          {/* Terminal prompt */}
          <motion.div
            className="mt-16 font-mono text-sm text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <span className="text-[#00ff88]">$</span> initializing_maxesis_hub
            <span className="animate-pulse">_</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <span className="text-white/30 text-xs font-mono">SCROLL</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-[#00ff88] to-transparent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Version badge */}
        <motion.div
          className="absolute bottom-8 right-8 font-mono text-xs text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          v1.0.0 // SYSTEM ACTIVE
        </motion.div>
      </main>

      {/* Stats Section */}
      <StatsSection />

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-white/20 text-sm font-mono">
          &copy; {new Date().getFullYear()} MAXESIS // ALL RIGHTS RESERVED
        </p>
      </footer>
    </>
  );
}
