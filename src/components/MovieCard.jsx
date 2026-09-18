import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Bookmark, Sparkles, Film } from 'lucide-react';

export default function MovieCard({
  movie,
  matchScore,
  matchReason,
  isBookmarked = false,
  onToggleBookmark,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      id={`movie-card-${movie.id}`}
      className="group relative flex flex-col bg-zinc-900/90 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={imageError ? fallbackImage : movie.poster}
          alt={movie.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 animate-pulse text-zinc-600">
            <Film className="w-8 h-8 opacity-40" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-700/50 text-amber-400 text-xs font-bold shadow-md">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {/* Match Score Badge (if recommendation algorithm calculated it) */}
        {matchScore !== undefined && (
          <div className="absolute top-3 right-12 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-md animate-in fade-in">
            <Sparkles className="w-3 h-3" />
            <span>{matchScore}% Match</span>
          </div>
        )}

        {/* Bookmark / Watchlist Action */}
        <button
          type="button"
          id={`bookmark-btn-${movie.id}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleBookmark(movie);
          }}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md border transition-all cursor-pointer ${
            isBookmarked
              ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/30'
              : 'bg-zinc-950/70 text-zinc-300 hover:text-white hover:bg-zinc-900 border-zinc-700/60'
          }`}
          title={isBookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
          aria-label="Toggle Watchlist"
        >
          <Bookmark
            className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`}
          />
        </button>

        {/* Runtime & Year floating bottom-left */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
          <span className="font-semibold text-zinc-100 bg-zinc-950/70 px-2 py-0.5 rounded border border-zinc-800">
            {movie.releaseYear}
          </span>
          <span className="flex items-center gap-1 text-zinc-400 bg-zinc-950/70 px-2 py-0.5 rounded border border-zinc-800">
            <Clock className="w-3 h-3" />
            {movie.runtime}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <Link
          to={`/movie/${movie.id}`}
          className="text-base md:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1"
          title={movie.title}
        >
          {movie.title}
        </Link>

        {/* Genre Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2 mb-2.5">
          {movie.genres.map((g) => (
            <span
              key={g}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700/40"
            >
              {g}
            </span>
          ))}
        </div>

        {/* Description Excerpt */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed flex-1">
          {movie.description}
        </p>

        {/* Match Reason Tag (for recommendations) */}
        {matchReason && (
          <div className="mt-2.5 pt-2 border-t border-zinc-800/80 text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{matchReason}</span>
          </div>
        )}

        {/* Details Link Button */}
        <div className="mt-3.5 pt-2.5 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-400">Dir. {movie.director}</span>
          <Link
            to={`/movie/${movie.id}`}
            id={`view-details-${movie.id}`}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline transition-colors flex items-center gap-1"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
