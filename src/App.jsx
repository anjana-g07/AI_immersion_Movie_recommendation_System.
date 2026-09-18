import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import { Bookmark, X, Trash2, ArrowRight, Film, Heart } from 'lucide-react';
import './App.css';

export default function App() {
  // Watchlist persisted in localStorage
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cinematch_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('cinematch_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist]);

  const handleToggleBookmark = (movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const handleRemoveFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  const handleClearWatchlist = () => {
    setWatchlist([]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0b0f19] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
        {/* Global Navbar */}
        <Navbar
          watchlist={watchlist}
          onOpenWatchlist={() => setIsWatchlistOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  watchlist={watchlist}
                  onToggleBookmark={handleToggleBookmark}
                />
              }
            />
            <Route
              path="/movie/:id"
              element={
                <MovieDetails
                  watchlist={watchlist}
                  onToggleBookmark={handleToggleBookmark}
                />
              }
            />
          </Routes>
        </main>

        {/* Watchlist Slide-over Drawer */}
        {isWatchlistOpen && (
          <div
            id="watchlist-drawer-overlay"
            className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsWatchlistOpen(false)}
          >
            <div
              id="watchlist-drawer-panel"
              className="w-full max-w-md bg-zinc-900 h-full p-6 shadow-2xl border-l border-zinc-800 flex flex-col justify-between overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Bookmark className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Your Watchlist</h2>
                    <p className="text-xs text-zinc-400">
                      {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="close-watchlist-btn"
                  onClick={() => setIsWatchlistOpen(false)}
                  className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Watchlist List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {watchlist.length > 0 ? (
                  watchlist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 transition-all group"
                    >
                      <img
                        src={item.poster}
                        alt={item.title}
                        className="w-12 h-16 object-cover rounded-lg flex-shrink-0 bg-zinc-950"
                      />

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/movie/${item.id}`}
                          onClick={() => setIsWatchlistOpen(false)}
                          className="text-sm font-bold text-white hover:text-amber-400 truncate block transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {item.releaseYear} • ⭐ {item.rating}
                        </p>
                        <span className="text-[10px] text-zinc-400">
                          {item.genres.slice(0, 2).join(', ')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFromWatchlist(item.id)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-700/50 transition-colors cursor-pointer"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-zinc-300">Your watchlist is empty</p>
                    <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                      Click the bookmark icon on any movie card to save it for later.
                    </p>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {watchlist.length > 0 && (
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleClearWatchlist}
                    className="text-xs text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear all
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWatchlistOpen(false)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Continue Browsing
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Footer */}
        <footer id="app-footer" className="bg-zinc-950 border-t border-zinc-800/80 py-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center">
                  <Film className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">
                  CineMatch • Movie Recommendation System
                </span>
              </div>

              <div className="flex items-center space-x-6 text-xs text-zinc-400">
                <span>Built with React.js & JavaScript</span>
                <span>•</span>
                <span>Curated Movie Dataset</span>
                <span>•</span>
                <span>Responsive Design</span>
              </div>

              <div className="text-xs text-zinc-500">
                &copy; {new Date().getFullYear()} CineMatch. All movie rights belong to their respective studios.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
