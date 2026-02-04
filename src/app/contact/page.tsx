'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const MatrixRain = dynamic(() => import('@/components/MatrixRain'), {
  ssr: false,
});

const contactMethods = [
  {
    name: 'Business Inquiries',
    description: 'Samarbejde, sponsorater & forretningsmæssige henvendelser',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    email: 'business@maxesis.dk',
    color: '#00ff88',
  },
  {
    name: 'General Contact',
    description: 'Spørgsmål, feedback & generelle henvendelser',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    email: 'contact@maxesis.dk',
    color: '#9146ff',
  },
];

const socialLinks = [
  {
    name: 'Twitch',
    url: 'https://www.twitch.tv/maxesis09',
    color: '#9146ff',
    icon: 'M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@maxesis09',
    color: '#ff0050',
    icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@Maxesis09',
    color: '#ff0000',
    icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    name: 'Snapchat',
    url: 'https://www.snapchat.com/add/maxesis09',
    color: '#FFFC00',
    icon: 'M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-.732-.27-1.273-.63-1.303-1.029-.045-.45.404-.793.958-.943.106-.029.255-.06.42-.06.179 0 .391.031.568.134.315.136.654.24.968.254.207 0 .33-.045.405-.09-.012-.18-.029-.345-.045-.51-.6.03-.6 0-.6 0-.28-1.093-.36-2.298-.15-3.18.525-2.263 2.28-3.854 4.168-4.555.69-.24 1.35-.36 1.95-.39.12-.015.24-.015.345-.015z',
  },
];

export default function ContactPage() {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <>
      <MatrixRain />

      <main className="relative min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
              GET IN <span className="text-[#ff0080]">TOUCH</span>
            </h1>
            <p className="text-white/60 font-mono">
              Lad os snakke!
            </p>
          </motion.div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.name}
                className="group p-6 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => copyEmail(method.email)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${method.color}20` }}
                  >
                    <svg
                      className="w-6 h-6"
                      style={{ color: method.color }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={method.icon} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg mb-1">{method.name}</h3>
                    <p className="text-white/50 text-sm mb-3">{method.description}</p>
                    <div className="flex items-center gap-2">
                      <code
                        className="px-3 py-1.5 bg-white/5 rounded-lg font-mono text-sm"
                        style={{ color: method.color }}
                      >
                        {method.email}
                      </code>
                      <motion.span
                        className="text-xs text-white/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: copiedEmail === method.email ? 1 : 0 }}
                      >
                        Kopieret!
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Copy hint */}
                <div className="mt-4 text-right">
                  <span className="text-white/30 text-xs font-mono group-hover:text-white/60 transition-colors">
                    Klik for at kopiere
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <motion.div
            className="flex items-center gap-4 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-white/30 font-mono text-sm">ELLER FIND MIG HER</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-6 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 30px ${social.color}40`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300"
                  style={{ backgroundColor: `${social.color}20` }}
                >
                  <svg
                    className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: social.color }}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={social.icon} />
                  </svg>
                </div>
                <span className="text-white font-mono text-sm">{social.name}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Response time note */}
          <motion.p
            className="text-center text-white/30 font-mono text-sm mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Svar typisk inden for 24-48 timer
          </motion.p>
        </div>
      </main>
    </>
  );
}
