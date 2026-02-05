'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const MatrixRain = dynamic(() => import('@/components/MatrixRain'), {
  ssr: false,
});

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  viewCount: number;
  duration: string;
  createdAt: string;
  type: string;
  description: string;
}

export default function HighlightsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/twitch-videos?type=archive');
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const parseDuration = (duration: string) => {
    // Twitch returns duration like "1h2m3s" or "2m30s"
    const hours = duration.match(/(\d+)h/)?.[1] || '0';
    const minutes = duration.match(/(\d+)m/)?.[1] || '0';
    const seconds = duration.match(/(\d+)s/)?.[1] || '0';

    if (parseInt(hours) > 0) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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
              PAST <span className="text-[#00ff88]">BROADCASTS</span>
            </h1>
            <p className="text-white/60 font-mono">
              Se tidligere streams i fuld længde
            </p>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-[#00ff88] font-mono animate-pulse text-xl">
                Henter streams...
              </div>
            </div>
          )}

          {/* No videos state */}
          {!loading && videos.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">📺</div>
              <p className="text-white/60 font-mono">
                Ingen tidligere streams - slå "Store past broadcasts" til på Twitch
              </p>
            </motion.div>
          )}

          {/* Videos grid */}
          {!loading && videos.length > 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className="group relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-[#00ff88]/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#00ff88] rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-mono">
                      {parseDuration(video.duration)}
                    </div>
                    {/* Views badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 rounded text-white text-xs font-mono flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {formatViews(video.viewCount)}
                    </div>
                    {/* VOD badge */}
                    <div className="absolute top-2 left-2 px-2 py-1 bg-[#00ff88]/20 border border-[#00ff88]/50 rounded text-[#00ff88] text-xs font-mono uppercase">
                      VOD
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-white font-bold line-clamp-2 mb-2 group-hover:text-[#00ff88] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-white/50 text-sm font-mono">
                      {formatDate(video.createdAt)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            className="relative w-full max-w-4xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Embed */}
            <div className="aspect-video rounded-xl overflow-hidden border border-white/20">
              <iframe
                src={`https://player.twitch.tv/?video=${selectedVideo.id}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}&autoplay=true`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>

            {/* Title */}
            <div className="mt-4">
              <h2 className="text-white text-xl font-bold">{selectedVideo.title}</h2>
              <p className="text-white/50 font-mono text-sm mt-1">
                {formatViews(selectedVideo.viewCount)} views • {formatDate(selectedVideo.createdAt)}
              </p>
              {selectedVideo.description && (
                <p className="text-white/40 text-sm mt-2 line-clamp-2">
                  {selectedVideo.description}
                </p>
              )}
            </div>

            {/* Watch on Twitch button */}
            <a
              href={selectedVideo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold rounded-xl transition-colors"
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
