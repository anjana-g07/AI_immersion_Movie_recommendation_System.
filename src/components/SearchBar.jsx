import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ searchQuery, onSearchChange, onClear, totalResults }) {
  return (
    <div id="movie-search-bar" className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          id="search-input-field"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by movie title, actor, or director..."
          className="w-full pl-12 pr-12 py-3.5 bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-700/70 focus:border-amber-500 rounded-xl text-zinc-100 placeholder-zinc-400 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-lg shadow-black/40 transition-all"
        />

        {searchQuery && (
          <button
            type="button"
            id="search-clear-btn"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <div className="p-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300">
              <X className="w-4 h-4" />
            </div>
          </button>
        )}
      </div>

      {searchQuery && totalResults !== undefined && (
        <div className="mt-2 px-2 flex items-center justify-between text-xs text-zinc-400">
          <span>
            Found <strong className="text-amber-400 font-semibold">{totalResults}</strong> {totalResults === 1 ? 'movie' : 'movies'} matching "{searchQuery}"
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-zinc-400 hover:text-amber-400 underline transition-colors cursor-pointer"
          >
            Reset search
          </button>
        </div>
      )}
    </div>
  );
}
