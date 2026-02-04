'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const MatrixRain = dynamic(() => import('@/components/MatrixRain'), {
  ssr: false,
});

interface User {
  id: string;
  username: string;
  profilePicture: string | null;
}

interface Idea {
  id: string;
  title: string;
  category: string;
  votes: number;
  status: string;
  createdAt: string;
  hasVoted: boolean;
  user: User;
}

const categories = [
  { value: 'game', label: 'Spil', emoji: '🎮' },
  { value: 'challenge', label: 'Challenge', emoji: '🏆' },
  { value: 'content', label: 'Content', emoji: '📺' },
  { value: 'collab', label: 'Collab', emoji: '🤝' },
  { value: 'general', label: 'Andet', emoji: '💡' },
];

export default function IdeasPage() {
  const { data: session, status } = useSession();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIdea, setNewIdea] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fetchIdeas = async () => {
    try {
      const res = await fetch('/api/ideas?status=pending&sort=votes');
      const data = await res.json();
      setIdeas(data.ideas || []);
    } catch (err) {
      console.error('Failed to fetch ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newIdea, category: newCategory }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Noget gik galt');
        return;
      }

      setNewIdea('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchIdeas();
    } catch (err) {
      setError('Kunne ikke sende idé');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (ideaId: string) => {
    if (!session) {
      signIn('twitch');
      return;
    }

    try {
      const res = await fetch('/api/ideas/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId }),
      });

      if (res.ok) {
        fetchIdeas();
      } else if (res.status === 401) {
        signIn('twitch');
      }
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const getCategoryEmoji = (category: string) => {
    return categories.find(c => c.value === category)?.emoji || '💡';
  };

  return (
    <>
      <MatrixRain />

      <main className="relative min-h-screen px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
              STREAM <span className="text-[#00ff88]">IDÉER</span>
            </h1>
            <p className="text-white/60 font-mono">
              Hvad skal næste stream handle om?
            </p>
          </motion.div>

          {/* Submit form */}
          <motion.form
            onSubmit={handleSubmit}
            className="mb-12 p-6 bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex flex-col gap-4">
              {/* User info or login prompt */}
              {session ? (
                <div className="flex items-center gap-3 mb-2">
                  {session.user?.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full border border-[#00ff88]/50"
                    />
                  )}
                  <span className="text-white font-mono text-sm">
                    {session.user?.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="text-white/40 hover:text-white/80 font-mono text-xs transition-colors ml-auto"
                  >
                    Log ud
                  </button>
                </div>
              ) : null}

              <div className="relative">
                <input
                  type="text"
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  placeholder="Skriv din stream idé..."
                  maxLength={200}
                  disabled={!session}
                  onClick={() => !session && signIn('twitch')}
                  className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/40 font-mono focus:outline-none focus:border-[#00ff88]/50 focus:ring-1 focus:ring-[#00ff88]/50 transition-all ${!session ? 'cursor-pointer opacity-60' : ''}`}
                />
                <div className="flex justify-between mt-2 text-xs text-white/30 font-mono">
                  <span>{newIdea.length}/200</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    disabled={!session}
                    onClick={() => session ? setNewCategory(cat.value) : signIn('twitch')}
                    className={`px-3 py-2 rounded-lg font-mono text-sm transition-all ${
                      newCategory === cat.value && session
                        ? 'bg-[#00ff88]/20 border border-[#00ff88]/50 text-[#00ff88]'
                        : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/30'
                    } ${!session ? 'opacity-60' : ''}`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>

              {session ? (
                <button
                  type="submit"
                  disabled={submitting || !newIdea.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-[#00ff88] to-[#00ffff] text-black font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? 'Sender...' : '✨ Send Idé'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => signIn('twitch')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#9146FF] hover:bg-[#7c3aed] text-white font-bold rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                  Log ind med Twitch for at sende idé
                </button>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-sm font-mono"
                  >
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[#00ff88] text-sm font-mono"
                  >
                    ✓ Idé sendt! Tak for dit input.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>

          {/* Ideas list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-[#00ff88]">🔥</span> Top Idéer
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="text-[#00ff88] font-mono animate-pulse">
                  Henter idéer...
                </div>
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">💡</div>
                <p className="text-white/60 font-mono">
                  Ingen idéer endnu - vær den første!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {ideas.map((idea, index) => (
                  <motion.div
                    key={idea.id}
                    className="group flex items-center gap-4 p-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Vote button */}
                    <button
                      onClick={() => handleVote(idea.id)}
                      className={`flex flex-col items-center min-w-[60px] p-2 rounded-lg transition-all ${
                        idea.hasVoted
                          ? 'bg-[#00ff88]/20 text-[#00ff88]'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${idea.hasVoted ? 'scale-110' : 'group-hover:scale-110'}`}
                        fill={idea.hasVoted ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                      <span className="font-mono font-bold">{idea.votes}</span>
                    </button>

                    {/* Idea content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {idea.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm">
                          {getCategoryEmoji(idea.category)}
                        </span>
                        {idea.user && (
                          <div className="flex items-center gap-1">
                            {idea.user.profilePicture && (
                              <img
                                src={idea.user.profilePicture}
                                alt={idea.user.username}
                                className="w-4 h-4 rounded-full"
                              />
                            )}
                            <span className="text-white/50 text-xs font-mono">
                              {idea.user.username}
                            </span>
                          </div>
                        )}
                        <span className="text-white/30 text-xs">•</span>
                        <span className="text-white/40 text-xs font-mono">
                          {new Date(idea.createdAt).toLocaleDateString('da-DK')}
                        </span>
                      </div>
                    </div>

                    {/* Rank badge for top 3 */}
                    {index < 3 && (
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        index === 1 ? 'bg-gray-400/20 text-gray-300' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        #{index + 1}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info note */}
          <motion.p
            className="text-center text-white/30 font-mono text-sm mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Log ind for at stemme • Top idéer bliver måske til virkelighed!
          </motion.p>
        </div>
      </main>
    </>
  );
}
