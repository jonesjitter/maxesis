'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItemProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'K';
  }
  return num.toString();
}

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (value - startValue) * easeOutQuart);

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration, hasAnimated]);

  return <span ref={ref}>{formatNumber(count)}</span>;
}

function StatItem({ value, label, suffix = '+', prefix, icon, color, delay = 0 }: StatItemProps) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
    >
      <div
        className="relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${color}10 0%, transparent 100%)`,
          borderColor: `${color}30`,
        }}
      >
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
          style={{ background: color }}
        />

        {/* Icon */}
        <div className="mb-3" style={{ color }}>
          {icon}
        </div>

        {/* Value */}
        <div className="text-4xl md:text-5xl font-black text-white mb-1 font-mono">
          {prefix}
          <AnimatedCounter value={value} />
          {suffix}
        </div>

        {/* Label */}
        <div className="text-sm text-white/60 uppercase tracking-wider font-mono">
          {label}
        </div>

        {/* Decorative corner */}
        <div
          className="absolute top-0 right-0 w-16 h-16 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, transparent 60%)`,
            borderRadius: '0 0.75rem 0 0',
          }}
        />
      </div>
    </motion.div>
  );
}

// Twitch icon
const TwitchIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
  </svg>
);

// TikTok icon
const TikTokIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Views icon
const ViewsIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// Heart icon
const HeartIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// Users icon
const UsersIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default function StatsSection() {
  // Real stats from TwitchTracker & TikTok
  const stats = {
    twitchFollowers: 795,
    twitchPeakViewers: 841,  // Impressive peak!
    tiktokFollowers: 3159,
    tiktokLikes: 136900,
  };

  const totalFollowers = stats.twitchFollowers + stats.tiktokFollowers;

  return (
    <section className="py-16 px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[#00ff88] font-mono text-sm tracking-[0.3em] uppercase mb-2">
            Stats
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Community Growth
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatItem
            value={stats.twitchPeakViewers}
            label="Peak Viewers"
            icon={<TwitchIcon />}
            color="#9146ff"
            delay={0}
          />
          <StatItem
            value={stats.tiktokLikes}
            label="TikTok Likes"
            icon={<HeartIcon />}
            color="#ff0050"
            delay={0.1}
          />
          <StatItem
            value={totalFollowers}
            label="Total Followers"
            icon={<UsersIcon />}
            color="#00ff88"
            delay={0.2}
          />
          <StatItem
            value={stats.tiktokFollowers}
            label="TikTok Followers"
            icon={<TikTokIcon />}
            color="#00ffff"
            delay={0.3}
          />
        </div>

        {/* Live indicator hint */}
        <motion.p
          className="text-center text-white/30 text-sm font-mono mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          // stats update in real-time
        </motion.p>
      </motion.div>
    </section>
  );
}
