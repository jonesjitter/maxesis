'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const MatrixRain = dynamic(() => import('@/components/MatrixRain'), {
  ssr: false,
});

interface Clip {
  id: string;
  title: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  viewCount: number;
  creatorName: string;
  duration: number;
  createdAt: string;
}

export default function ClipsPage() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);

  useEffect(() => {
    const fetchClips = async () => {
      try {
        const res = await fetch('/api/twitch-clips');
        const data = await res.json();
        setClips(data.clips || []);
      } catch (error) {
        console.error('Failed to fetch clips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <>
      <MatrixRain />

      <main className="relative min-h-screen px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
              TOP <span className="text-[#9146ff]">CLIPS</span>
            </h1>
            <p className="text-white/60 font-mono">
              De bedste øjeblikke fra stream
            </p>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-[#00ff88] font-mono animate-pulse text-xl">
                Henter clips...
              </div>
            </div>
          )}

          {/* No clips state */}
          {!loading && clips.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-white/60 font-mono">
                Ingen clips endnu - kom tilbage senere!
              </p>
            </motion.div>
          )}

          {/* Clips grid */}
          {!loading && clips.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {clips.map((clip, index) => (
                <motion.div
                  key={clip.id}
                  className="group relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#9146ff]/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setSelectedClip(clip)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <img
                      src={clip.thumbnailUrl}
                      alt={clip.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#9146ff] rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-mono">
                      {formatDuration(clip.duration)}
                    </div>
                    {/* Views badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-mono flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {formatViews(clip.viewCount)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white font-bold line-clamp-2 mb-2 group-hover:text-[#9146ff] transition-colors">
                      {clip.title}
                    </h3>
                    <p className="text-white/50 text-sm font-mono">
                      Clipped by {clip.creatorName}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Video Modal */}
      {selectedClip && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedClip(null)}
        >
          <motion.div
            className="relative w-full max-w-4xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedClip(null)}
              className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Embed */}
            <div className="aspect-video rounded-xl overflow-hidden border border-white/20">
              <iframe
                src={`${selectedClip.embedUrl}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>

            {/* Title */}
            <div className="mt-4">
              <h2 className="text-white text-xl font-bold">{selectedClip.title}</h2>
              <p className="text-white/50 font-mono text-sm mt-1">
                {formatViews(selectedClip.viewCount)} views • Clipped by {selectedClip.creatorName}
              </p>
            </div>

            {/* Watch on Twitch button */}
            <a
              href={selectedClip.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#9146ff] hover:bg-[#7c3aed] text-white font-bold rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
              </svg>
              Se på Twitch
            </a>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
