import React from 'react';
import { genresList } from '../data/movies';

export default function GenreFilter({ selectedGenre, onSelectGenre, movieCounts = {} }) {
  return (
    <div id="genre-filter-container" className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Filter by Genre
        </h3>
        {selectedGenre !== 'All' && (
          <button
            type="button"
            id="genre-reset-btn"
            onClick={() => onSelectGenre('All')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
          >
            Show All
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {genresList.map((genre) => {
          const isSelected = selectedGenre === genre;
          const count = movieCounts[genre] ?? 0;

          return (
            <button
              key={genre}
              id={`genre-btn-${genre.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              type="button"
              onClick={() => onSelectGenre(genre)}
              className={`px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/20 scale-[1.02]'
                  : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700/80 hover:text-white border border-zinc-700/50'
              }`}
            >
              <span>{genre}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-zinc-950/20 text-zinc-950'
                    : 'bg-zinc-900/80 text-zinc-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
