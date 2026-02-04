'use client';

import { motion } from 'framer-motion';

const socials = [
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@maxesis09',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    ),
    gradient: 'from-[#ff0050] via-[#00f2ea] to-[#ff0050]',
    shadowColor: 'shadow-[#ff0050]',
    hoverBg: 'hover:bg-[#ff0050]/20',
  },
  {
    name: 'Twitch',
    url: 'https://www.twitch.tv/maxesis09',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
      </svg>
    ),
    gradient: 'from-[#9146ff] to-[#9146ff]',
    shadowColor: 'shadow-[#9146ff]',
    hoverBg: 'hover:bg-[#9146ff]/20',
  },
];

export default function SocialLinks() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 mt-12">
      {socials.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            group relative overflow-hidden
            flex items-center gap-4 px-8 py-5
            bg-black/50 backdrop-blur-sm
            border border-white/10 rounded-xl
            transition-all duration-300
            ${social.hoverBg}
            hover:border-white/30
            hover:scale-105
          `}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
          whileHover={{
            boxShadow: social.name === 'TikTok'
              ? '0 0 30px rgba(255, 0, 80, 0.5), 0 0 60px rgba(0, 242, 234, 0.3)'
              : '0 0 30px rgba(145, 70, 255, 0.5)'
          }}
        >
          {/* Animated gradient border */}
          <div className={`
            absolute inset-0 opacity-0 group-hover:opacity-100
            transition-opacity duration-300
          `}>
            <div className={`
              absolute inset-[-2px] rounded-xl
              bg-gradient-to-r ${social.gradient}
              animate-spin-slow blur-sm
            `} />
            <div className="absolute inset-[1px] bg-black/90 rounded-xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center gap-4">
            <motion.div
              className="text-white"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              {social.icon}
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xs text-white/50 uppercase tracking-widest">
                Follow on
              </span>
              <span className="text-xl font-bold text-white">
                {social.name}
              </span>
            </div>
          </div>

          {/* Hover arrow */}
          <motion.div
            className="relative z-10 ml-4 text-white/50 group-hover:text-white transition-colors"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>

          {/* Scan line effect */}
          <div className="absolute inset-0 overflow-hidden rounded-xl opacity-0 group-hover:opacity-100">
            <div className="absolute inset-0 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>
        </motion.a>
      ))}
    </div>
  );
}
