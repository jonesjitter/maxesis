'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const MatrixRain = dynamic(() => import('@/components/MatrixRain'), {
  ssr: false,
});

interface ScheduleSegment {
  id: string;
  title: string;
  category?: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  isCanceled: boolean;
}

export default function SchedulePage() {
  const [segments, setSegments] = useState<ScheduleSegment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch('/api/twitch-schedule');
        const data = await res.json();
        setSegments(data.segments || []);
      } catch (error) {
        console.error('Failed to fetch schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('da-DK', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const date = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const getDayLabel = (dateString: string) => {
    if (isToday(dateString)) return 'I DAG';
    if (isTomorrow(dateString)) return 'I MORGEN';
    return null;
  };

  return (
    <>
      <MatrixRain />

      <main className="relative min-h-screen px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
              STREAM <span className="text-[#00ff88]">SCHEDULE</span>
            </h1>
            <p className="text-white/60 font-mono">
              Hvornår går jeg live?
            </p>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-[#00ff88] font-mono animate-pulse text-xl">
                Henter schedule...
              </div>
            </div>
          )}

          {/* No schedule state */}
          {!loading && segments.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-6">📅</div>
              <p className="text-white/60 font-mono text-lg mb-8">
                Ingen planlagte streams lige nu
              </p>
              <p className="text-white/40 font-mono text-sm max-w-md mx-auto">
                Følg med på Twitch eller sociale medier for at høre hvornår næste stream er!
              </p>
              <a
                href="https://www.twitch.tv/maxesis09"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-[#9146ff] hover:bg-[#7c3aed] text-white font-bold rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                </svg>
                Følg på Twitch
              </a>
            </motion.div>
          )}

          {/* Schedule list */}
          {!loading && segments.length > 0 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {segments.filter(s => !s.isCanceled).map((segment, index) => {
                const dayLabel = getDayLabel(segment.startTime);
                return (
                  <motion.div
                    key={segment.id}
                    className={`
                      relative p-6 rounded-xl border backdrop-blur-sm
                      ${dayLabel === 'I DAG'
                        ? 'bg-[#00ff88]/10 border-[#00ff88]/50'
                        : 'bg-black/50 border-white/10 hover:border-white/30'
                      }
                      transition-all duration-300
                    `}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Day label */}
                    {dayLabel && (
                      <div className={`
                        absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-mono font-bold
                        ${dayLabel === 'I DAG'
                          ? 'bg-[#00ff88] text-black'
                          : 'bg-[#9146ff] text-white'
                        }
                      `}>
                        {dayLabel}
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Time */}
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#00ff88]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-white font-mono text-lg font-bold">
                            {formatTime(segment.startTime)}
                          </div>
                          <div className="text-white/50 font-mono text-sm">
                            {formatDate(segment.startTime)}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="hidden md:block w-px h-12 bg-white/10 mx-4" />

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">
                          {segment.title || 'Stream'}
                        </h3>
                        {segment.category && (
                          <p className="text-[#9146ff] font-mono text-sm mt-1">
                            {segment.category}
                          </p>
                        )}
                        {segment.isRecurring && (
                          <span className="inline-block mt-2 px-2 py-1 bg-white/10 rounded text-white/50 text-xs font-mono">
                            Ugentlig
                          </span>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Timezone note */}
          <motion.p
            className="text-center text-white/30 font-mono text-sm mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Alle tider er i din lokale tidszone
          </motion.p>
        </div>
      </main>
    </>
  );
}
