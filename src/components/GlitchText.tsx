'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const chars = 'アイウエオカキクケコサシスセソタチツテト0123456789!@#$%^&*';

    const typeWriter = () => {
      if (currentIndex <= text.length) {
        const scrambled = text
          .split('')
          .map((char, i) => {
            if (i < currentIndex) return char;
            if (i === currentIndex) return chars[Math.floor(Math.random() * chars.length)];
            return ' ';
          })
          .join('');

        setDisplayText(scrambled);
        currentIndex++;
        setTimeout(typeWriter, 80);
      }
    };

    setTimeout(typeWriter, 500);

    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 4000);

    return () => clearInterval(glitchInterval);
  }, [text]);

  return (
    <motion.h1
      className={`relative ${className}`}
      animate={isGlitching ? {
        x: [0, -5, 5, -5, 5, 0],
        textShadow: [
          '0 0 10px #00ff88, 0 0 20px #00ff88',
          '-5px 0 #ff0080, 5px 0 #00ffff',
          '5px 0 #ff0080, -5px 0 #00ffff',
          '0 0 10px #00ff88, 0 0 20px #00ff88',
        ],
      } : {}}
      transition={{ duration: 0.2 }}
    >
      <span className="glitch-text">{displayText}</span>
      {isGlitching && (
        <>
          <span className="absolute top-0 left-0 -translate-x-[2px] translate-y-[2px] text-[#ff0080] opacity-70 mix-blend-multiply">
            {displayText}
          </span>
          <span className="absolute top-0 left-0 translate-x-[2px] -translate-y-[2px] text-[#00ffff] opacity-70 mix-blend-multiply">
            {displayText}
          </span>
        </>
      )}
    </motion.h1>
  );
}
