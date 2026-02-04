'use client';

import { motion } from 'framer-motion';

const socials = [
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@maxesis09',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
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
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
      </svg>
    ),
    gradient: 'from-[#9146ff] to-[#9146ff]',
    shadowColor: 'shadow-[#9146ff]',
    hoverBg: 'hover:bg-[#9146ff]/20',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@Maxesis09',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    gradient: 'from-[#ff0000] to-[#ff0000]',
    shadowColor: 'shadow-[#ff0000]',
    hoverBg: 'hover:bg-[#ff0000]/20',
  },
  {
    name: 'Snapchat',
    url: 'https://www.snapchat.com/add/maxesis09',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-.732-.27-1.273-.63-1.303-1.029-.045-.45.404-.793.958-.943.106-.029.255-.06.42-.06.179 0 .391.031.568.134.315.136.654.24.968.254.207 0 .33-.045.405-.09-.012-.18-.029-.345-.045-.51-.6.03-.6 0-.6 0-.28-1.093-.36-2.298-.15-3.18.525-2.263 2.28-3.854 4.168-4.555.69-.24 1.35-.36 1.95-.39.12-.015.24-.015.345-.015z" />
      </svg>
    ),
    gradient: 'from-[#FFFC00] to-[#FFFC00]',
    shadowColor: 'shadow-[#FFFC00]',
    hoverBg: 'hover:bg-[#FFFC00]/20',
  },
];

export default function SocialLinks() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full max-w-4xl">
      {socials.map((social, index) => (
        <motion.a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            group relative overflow-hidden
            flex items-center gap-3 px-4 py-4
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
              : social.name === 'Twitch'
              ? '0 0 30px rgba(145, 70, 255, 0.5)'
              : social.name === 'YouTube'
              ? '0 0 30px rgba(255, 0, 0, 0.5)'
              : '0 0 30px rgba(255, 252, 0, 0.5)'
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
              <span className="text-[10px] text-white/50 uppercase tracking-widest">
                Follow on
              </span>
              <span className="text-base font-bold text-white">
                {social.name}
              </span>
            </div>
          </div>

          {/* Hover arrow */}
          <motion.div
            className="relative z-10 ml-auto text-white/50 group-hover:text-white transition-colors hidden sm:block"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
