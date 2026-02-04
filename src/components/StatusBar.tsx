'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TwitchStatus {
  isLive: boolean;
  viewerCount?: number;
  title?: string;
  gameName?: string;
}

export default function StatusBar() {
  const [status, setStatus] = useState<TwitchStatus | null>(null);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/twitch-status');
        const data = await res.json();
        setStatus(data);
      } catch (error) {
        setStatus({ isLive: false });
      }
    };

    fetchStatus();
    // Poll every 60 seconds
    const interval = setInterval(fetchStatus, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const isLive = status?.isLive ?? false;

  return (
    <motion.a
      href="https://www.twitch.tv/maxesis09"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-3 px-4 py-2 rounded-full cursor-pointer
        backdrop-blur-sm border transition-all duration-500
        ${isLive
          ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30 hover:border-red-500'
          : 'bg-black/50 border-white/20 hover:border-white/40'
        }
      `}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Live/Offline indicator */}
      <span className="relative flex h-2.5 w-2.5">
        {isLive ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white/40" />
        )}
      </span>

      {/* Status text */}
      <AnimatePresence mode="wait">
        {status === null ? (
          <motion.span
            key="loading"
            className="text-white/50 text-sm font-mono uppercase tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Checking{dots}
          </motion.span>
        ) : isLive ? (
          <motion.div
            key="live"
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <span className="text-red-400 text-sm font-mono font-bold uppercase tracking-wider">
              LIVE
            </span>
            {status.viewerCount !== undefined && (
              <span className="flex items-center gap-1 text-white/70 text-sm font-mono">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {status.viewerCount.toLocaleString()}
              </span>
            )}
          </motion.div>
        ) : (
          <motion.span
            key="offline"
            className="text-white/50 text-sm font-mono uppercase tracking-wider"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            Offline
          </motion.span>
        )}
      </AnimatePresence>

      {/* Twitch icon */}
      <svg
        className={`w-4 h-4 transition-colors duration-300 ${isLive ? 'text-[#9146ff]' : 'text-white/40'}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
      </svg>
    </motion.a>
  );
}
