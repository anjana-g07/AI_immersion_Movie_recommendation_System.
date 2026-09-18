import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { movies } from '../data/movies';
import MovieCard from '../components/MovieCard';
import {
  Star,
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Bookmark,
  Sparkles,
  Share2,
  Film,
  Check,
  Play
} from 'lucide-react';

export default function MovieDetails({ watchlist = [], onToggleBookmark }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Find the target movie
  const movie = movies.find((m) => String(m.id) === String(id));

  // Scroll to top whenever ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (!movie) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center px-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md text-center">
          <Film className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Movie Not Found</h2>
          <p className="text-sm text-zinc-400 mb-6">
            The movie you are looking for does not exist in our catalog or the link is invalid.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-zinc-950 font-bold text-sm rounded-xl hover:bg-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Movies</span>
          </Link>
        </div>
      </div>
    );
  }

  const isBookmarked = watchlist.some((w) => w.id === movie.id);

  // Find Similar / Recommended Movies based on shared genres (excluding current)
  const similarMovies = movies
    .filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)))
    .sort((a, b) => {
      // Sort by number of matching genres, then rating
      const aOverlap = a.genres.filter((g) => movie.genres.includes(g)).length;
      const bOverlap = b.genres.filter((g) => movie.genres.includes(g)).length;
      if (bOverlap !== aOverlap) return bOverlap - aOverlap;
      return b.rating - a.rating;
    })
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Backdrop Hero Header */}
      <div className="relative w-full h-[380px] md:h-[480px] overflow-hidden bg-zinc-950">
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter blur-xs scale-105 opacity-35"
        />

        {/* Ambient Gradient Masks */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />

        {/* Floating Back Button */}
        <div className="absolute top-6 left-4 sm:left-6 lg:left-8 z-20">
          <button
            type="button"
            id="back-to-movies-btn"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white backdrop-blur-md border border-zinc-700/60 text-xs sm:text-sm font-medium transition-all shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </button>
        </div>
      </div>

      {/* Main Movie Details Card Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-56 md:-mt-64 relative z-20">
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/90 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Poster Image */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-zinc-700/60 group relative aspect-[2/3] bg-zinc-950">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setShowTrailerModal(true)}
                    className="p-4 rounded-full bg-amber-500 text-zinc-950 hover:scale-110 transition-transform shadow-xl cursor-pointer"
                    title="Watch Trailer Preview"
                  >
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons underneath Poster */}
              <div className="w-full max-w-sm grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  id="detail-watchlist-toggle"
                  onClick={() => onToggleBookmark(movie)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                    isBookmarked
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>

                <button
                  type="button"
                  id="detail-share-btn"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Information & Metadata */}
            <div className="lg:col-span-8 flex flex-col justify-start">
              {/* Genre Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  >
                    {genre}
                  </span>
                ))}
                {movie.isTrending && (
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    Trending Now
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="mt-2 text-base sm:text-lg text-zinc-400 italic font-serif">
                  "{movie.tagline}"
                </p>
              )}

              {/* Meta Statistics Bar */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 py-4 border-y border-zinc-800 text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-white">{movie.rating.toFixed(1)}</span>
                      <span className="text-xs text-zinc-500">/ 10</span>
                    </div>
                    <span className="text-[11px] text-zinc-400">{movie.voteCount} votes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-white">{movie.releaseYear}</span>
                    <span className="text-[11px] text-zinc-400">Release Year</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-white">{movie.runtime}</span>
                    <span className="text-[11px] text-zinc-400">Duration</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-white">{movie.director}</span>
                    <span className="text-[11px] text-zinc-400">Director</span>
                  </div>
                </div>
              </div>

              {/* Synopsis */}
              <div className="mt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Plot Synopsis
                </h3>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Cast & Crew Section */}
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Lead Cast
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <div
                      key={actor}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-xs sm:text-sm text-zinc-200 flex items-center gap-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-amber-400">
                        {actor.charAt(0)}
                      </div>
                      <span>{actor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Watch Trailer Button Preview */}
              <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center gap-4">
                <button
                  type="button"
                  id="watch-preview-btn"
                  onClick={() => setShowTrailerModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-bold text-sm shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Trailer Preview</span>
                </button>
                <span className="text-xs text-zinc-400">
                  HD • Surround Audio • English Subtitles
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: RECOMMENDED SIMILAR MOVIES */}
        {similarMovies.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>More Like This</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-6">
              Recommended for Fans of "{movie.title}"
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarMovies.map((simMovie) => (
                <MovieCard
                  key={simMovie.id}
                  movie={simMovie}
                  matchReason={`Shared genre: ${simMovie.genres.filter((g) => movie.genres.includes(g)).join(', ')}`}
                  isBookmarked={watchlist.some((w) => w.id === simMovie.id)}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div
          id="trailer-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setShowTrailerModal(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-2xl w-full p-6 text-center shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              "{movie.title}" Official Trailer
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              Full theatrical trailer preview. Directed by {movie.director} ({movie.releaseYear}).
            </p>

            {/* Video preview container representation */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-6 border border-zinc-800 flex items-center justify-center">
              <img
                src={movie.backdrop || movie.poster}
                alt="Trailer Scene"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-xl animate-pulse mb-3">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
                <p className="text-xs text-zinc-200 font-medium bg-black/60 px-3 py-1 rounded-full border border-zinc-700">
                  Playing High-Definition Cinematic Clip
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTrailerModal(false)}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
