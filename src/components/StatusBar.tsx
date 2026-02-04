'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm border border-[#00ff88]/30 rounded-full"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]"></span>
      </span>
      <span className="text-[#00ff88] text-sm font-mono uppercase tracking-wider">
        System Online{dots}
      </span>
    </motion.div>
  );
}
