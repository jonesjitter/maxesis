'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Idea {
  id: string;
  title: string;
  votes: number;
  category: string;
}

const socials = [
  { name: 'Twitch', handle: 'maxesis', color: '#9146FF', icon: 'M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z' },
  { name: 'TikTok', handle: '@maxesis', color: '#ff0050', icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z' },
  { name: 'YouTube', handle: 'Maxesis', color: '#FF0000', icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  { name: 'Snap', handle: 'maxesis', color: '#FFFC00', icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z' },
];

const categoryEmojis: Record<string, string> = {
  game: '🎮',
  challenge: '🏆',
  content: '📺',
  collab: '🤝',
  general: '💡',
};

function OverlayContent() {
  const searchParams = useSearchParams();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdea, setNewIdea] = useState<Idea | null>(null);
  const [prevIdeas, setPrevIdeas] = useState<string>('');

  // URL parameters for customization
  const showIdeas = searchParams.get('ideas') !== 'false';
  const showSocials = searchParams.get('socials') !== 'false';
  const showQR = searchParams.get('qr') !== 'false';
  const maxIdeas = parseInt(searchParams.get('max') || '5');
  const layout = searchParams.get('layout') || 'sidebar'; // sidebar, bottom, minimal

  const fetchIdeas = async () => {
    try {
      const res = await fetch('/api/ideas?status=pending&sort=votes');
      const data = await res.json();
      const newIdeasData = (data.ideas || []).slice(0, maxIdeas);

      // Check for new ideas
      const newIdeasString = JSON.stringify(newIdeasData.map((i: Idea) => i.id));
      if (prevIdeas && newIdeasString !== prevIdeas) {
        const currentIds = new Set(JSON.parse(prevIdeas));
        const newest = newIdeasData.find((i: Idea) => !currentIds.has(i.id));
        if (newest) {
          setNewIdea(newest);
          setTimeout(() => setNewIdea(null), 5000);
        }
      }
      setPrevIdeas(newIdeasString);
      setIdeas(newIdeasData);
    } catch (err) {
      console.error('Failed to fetch ideas:', err);
    }
  };

  useEffect(() => {
    fetchIdeas();
    const interval = setInterval(fetchIdeas, 10000);
    return () => clearInterval(interval);
  }, [maxIdeas]);

  if (layout === 'minimal') {
    return (
      <div className="min-h-screen bg-transparent p-4">
        <div className="inline-block bg-black/80 backdrop-blur-sm border border-[#00ff88]/30 rounded-xl p-4">
          <div className="text-[#00ff88] font-mono text-sm mb-2">TOP IDÉER</div>
          {ideas.slice(0, 3).map((idea) => (
            <div key={idea.id} className="flex items-center gap-2 text-white text-sm py-1">
              <span className="text-[#00ff88] font-bold">{idea.votes}</span>
              <span className="truncate max-w-[200px]">{idea.title}</span>
            </div>
          ))}
          <div className="text-white/50 text-xs mt-2 font-mono">maxesis.com/ideas</div>
        </div>
      </div>
    );
  }

  if (layout === 'bottom') {
    return (
      <div className="bg-transparent">
        <div className="bg-gradient-to-b from-black via-black/95 to-transparent pt-6 pb-16 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Top row: Ideas */}
            {showIdeas && ideas.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-[#00ff88] font-mono text-sm tracking-widest font-bold">
                    💡 STREAM IDÉER
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#00ff88]/50 to-transparent" />
                  <div className="text-white/50 font-mono text-xs">
                    STEM PÅ MAXESIS.COM/IDEAS
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {ideas.slice(0, 4).map((idea, i) => (
                    <motion.div
                      key={idea.id}
                      className="bg-black/60 backdrop-blur-sm border border-[#00ff88]/20 rounded-xl p-4 relative overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {i === 0 && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          i === 1 ? 'bg-gray-400/20 text-gray-300' :
                          i === 2 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-white/10 text-white/50'
                        }`}>
                          #{i + 1}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#00ff88] font-bold font-mono text-lg">{idea.votes}</span>
                          <span className="text-white/40 text-xs">votes</span>
                        </div>
                        <span className="ml-auto text-lg">{categoryEmojis[idea.category] || '💡'}</span>
                      </div>
                      <div className="text-white font-medium truncate">{idea.title}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom row: Socials + QR */}
            <div className="flex items-center justify-between gap-8">
              {/* Socials */}
              {showSocials && (
                <div className="flex items-center gap-6">
                  {socials.map((social) => (
                    <div key={social.name} className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${social.color}20` }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={social.color}>
                          <path d={social.icon} />
                        </svg>
                      </div>
                      <span className="text-white/80 font-mono text-sm">{social.handle}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* QR + CTA */}
              {showQR && (
                <div className="flex items-center gap-4 bg-black/60 backdrop-blur-sm border border-[#00ff88]/30 rounded-xl px-5 py-3">
                  <div className="w-12 h-12 bg-white rounded-lg p-1">
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://maxesis.com/ideas&bgcolor=ffffff&color=000000"
                      alt="QR Code"
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="text-white font-bold">STEM PÅ NÆSTE STREAM!</div>
                    <div className="text-[#00ff88] font-mono text-sm">maxesis.com/ideas</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: Sidebar layout
  return (
    <div className="min-h-screen bg-transparent p-4 flex justify-end">
      <div className="w-80">
        {/* New idea notification */}
        <AnimatePresence>
          {newIdea && (
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className="mb-4 bg-[#00ff88]/20 border border-[#00ff88] rounded-xl p-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/0 via-[#00ff88]/10 to-[#00ff88]/0 animate-pulse" />
              <div className="relative">
                <div className="text-[#00ff88] font-mono text-xs mb-1 tracking-widest">NY IDÉ!</div>
                <div className="text-white font-medium">{newIdea.title}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main overlay card */}
        <div className="bg-black/85 backdrop-blur-md border border-[#00ff88]/30 rounded-2xl overflow-hidden shadow-2xl shadow-[#00ff88]/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00ff88]/20 to-transparent p-4 border-b border-[#00ff88]/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00ff88]/20 flex items-center justify-center">
                <span className="text-[#00ff88] text-xl">💡</span>
              </div>
              <div>
                <div className="text-white font-bold">STREAM IDÉER</div>
                <div className="text-[#00ff88] font-mono text-xs">LIVE VOTING</div>
              </div>
            </div>
          </div>

          {/* Ideas list */}
          {showIdeas && (
            <div className="p-4 space-y-2">
              {ideas.map((idea, index) => (
                <motion.div
                  key={idea.id}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-[#00ff88]/30 transition-all"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-white/10 text-white/50'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm truncate">{idea.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs">{categoryEmojis[idea.category] || '💡'}</span>
                      <span className="text-[#00ff88] font-mono text-xs font-bold">{idea.votes} votes</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {ideas.length === 0 && (
                <div className="text-center py-6 text-white/40 font-mono text-sm">
                  Ingen idéer endnu...
                </div>
              )}
            </div>
          )}

          {/* QR Code / CTA */}
          {showQR && (
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg p-1 flex-shrink-0">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://maxesis.com/ideas&bgcolor=ffffff&color=000000"
                    alt="QR Code"
                    className="w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-white font-bold text-sm">STEM PÅ DIN IDÉ!</div>
                  <div className="text-[#00ff88] font-mono text-xs mt-1">maxesis.com/ideas</div>
                </div>
              </div>
            </div>
          )}

          {/* Social links */}
          {showSocials && (
            <div className="p-4 border-t border-white/10">
              <div className="text-white/40 font-mono text-xs mb-3 tracking-widest">FIND MIG HER</div>
              <div className="grid grid-cols-2 gap-2">
                {socials.map((social) => (
                  <div
                    key={social.name}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5"
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: `${social.color}20` }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={social.color}>
                        <path d={social.icon} />
                      </svg>
                    </div>
                    <span className="text-white/80 text-xs font-mono truncate">{social.handle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2 bg-[#00ff88]/10 border-t border-[#00ff88]/20">
            <div className="text-center text-[#00ff88] font-mono text-xs tracking-widest">
              MAXESIS.COM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OverlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
      <OverlayContent />
    </Suspense>
  );
}
