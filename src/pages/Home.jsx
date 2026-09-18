import React, { useState, useMemo } from 'react';
import { movies } from '../data/movies';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import { Sparkles, SlidersHorizontal, TrendingUp, Award, Film, RotateCcw, Flame, CheckCircle2 } from 'lucide-react';

export default function Home({ watchlist = [], onToggleBookmark }) {
  // Search & Catalog Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [catalogSort, setCatalogSort] = useState('rating-desc');
  const [isLoading, setIsLoading] = useState(false);

  // Recommendation Engine State
  const [recGenre, setRecGenre] = useState('Sci-Fi');
  const [recMinRating, setRecMinRating] = useState(7.5);
  const [recEra, setRecEra] = useState('all'); // 'all', 'modern' (>=2015), 'classic' (<2015)
  const [recSort, setRecSort] = useState('match'); // 'match', 'rating', 'year'

  // Available recommendation genres (excluding 'All')
  const availableGenres = ['Action', 'Comedy', 'Romance', 'Horror', 'Thriller', 'Sci-Fi', 'Drama'];

  // Movie counts by genre for GenreFilter badges
  const movieCounts = useMemo(() => {
    const counts = { All: movies.length };
    availableGenres.forEach((g) => {
      counts[g] = movies.filter((m) => m.genres.includes(g)).length;
    });
    return counts;
  }, []);

  // Filter & Search handler with brief simulate loading for realistic feedback
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 120);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 120);
  };

  // Filtered Catalog Movies
  const filteredCatalog = useMemo(() => {
    let result = [...movies];

    // Filter by Genre
    if (selectedGenre !== 'All') {
      result = result.filter((m) => m.genres.includes(selectedGenre));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some((actor) => actor.toLowerCase().includes(q)) ||
          m.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (catalogSort === 'rating-desc') return b.rating - a.rating;
      if (catalogSort === 'rating-asc') return a.rating - b.rating;
      if (catalogSort === 'year-desc') return b.releaseYear - a.releaseYear;
      if (catalogSort === 'year-asc') return a.releaseYear - b.releaseYear;
      if (catalogSort === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [selectedGenre, searchQuery, catalogSort]);

  // Recommendation Engine Algorithm
  const recommendations = useMemo(() => {
    // 1. Filter candidates by genre and minimum rating
    const candidates = movies.filter((movie) => {
      const matchesGenre = recGenre === 'All' || movie.genres.includes(recGenre);
      const matchesRating = movie.rating >= recMinRating;
      const matchesEra =
        recEra === 'all'
          ? true
          : recEra === 'modern'
          ? movie.releaseYear >= 2015
          : movie.releaseYear < 2015;

      return matchesGenre && matchesRating && matchesEra;
    });

    // 2. Score candidates (Match percentage algorithm: 70% to 99%)
    const scored = candidates.map((movie) => {
      // Base score components:
      // Rating contribution: 8.0 rating -> 80%
      const ratingFactor = (movie.rating / 10) * 45; // max 45 pts
      // Genre affinity: primary selected genre matches -> 40 pts
      const genreFactor = movie.genres.includes(recGenre) ? 40 : 20;
      // Popularity/Critique bonus: 5-14 pts
      const popularityBonus = movie.isPopular ? 10 : 6;
      const trendingBonus = movie.isTrending ? 4 : 0;

      const rawScore = Math.round(ratingFactor + genreFactor + popularityBonus + trendingBonus);
      const matchScore = Math.min(99, Math.max(72, rawScore));

      // Construct explanatory match reason
      let matchReason = `Matches ${recGenre} & rated ${movie.rating.toFixed(1)}/10`;
      if (movie.rating >= 8.5) {
        matchReason = `Critically acclaimed ${recGenre} masterwork (${movie.rating.toFixed(1)})`;
      } else if (movie.isTrending) {
        matchReason = `Trending ${recGenre} crowd favorite`;
      }

      return {
        ...movie,
        matchScore,
        matchReason,
      };
    });

    // 3. Sort recommendations
    scored.sort((a, b) => {
      if (recSort === 'match') return b.matchScore - a.matchScore;
      if (recSort === 'rating') return b.rating - a.rating;
      if (recSort === 'year') return b.releaseYear - a.releaseYear;
      return 0;
    });

    return scored;
  }, [recGenre, recMinRating, recEra, recSort]);

  // Trending and Popular Highlights
  const trendingMovies = useMemo(() => {
    return movies.filter((m) => m.isTrending).slice(0, 4);
  }, []);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setCatalogSort('rating-desc');
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner */}
      <section
        id="hero-banner"
        className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-zinc-800/80"
      >
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/10 via-rose-600/10 to-violet-600/15 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligent Movie Discovery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Discover What to Watch <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400">Next</span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Get personalized movie recommendations tailored to your favorite genres and rating standards, or explore curated cinematic masterpieces.
          </p>

          {/* Quick Search inside Hero */}
          <div className="mt-8 max-w-2xl mx-auto">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onClear={() => handleSearchChange('')}
              totalResults={searchQuery ? filteredCatalog.length : undefined}
            />
          </div>

          {/* Jump to Recommendation Engine Button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#recommendation-engine"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-zinc-950 font-bold text-sm shadow-lg shadow-rose-950/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Recommendation Engine</span>
            </a>
            <a
              href="#catalog-section"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 font-medium text-sm border border-zinc-700/60 transition-all cursor-pointer"
            >
              <Film className="w-4 h-4 text-zinc-400" />
              <span>Browse All Movies ({movies.length})</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 1: RECOMMENDATION ENGINE */}
      <section
        id="recommendation-engine"
        className="py-16 bg-zinc-950/60 border-b border-zinc-800/80 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Preference-Based Matching</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Personalized Recommendation System
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Tune your favorite genre, minimum rating, and era to compute match scores for your taste.
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 px-3 py-1.5 rounded-lg border border-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Matches found: <strong className="text-white">{recommendations.length}</strong>
              </span>
            </div>
          </div>

          {/* Interactive Recommendation Controls Panel */}
          <div className="bg-zinc-900/90 rounded-2xl p-5 md:p-7 border border-zinc-800 shadow-xl mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Genre Selector */}
              <div className="lg:col-span-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                  1. Choose Favorite Genre
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      id={`rec-genre-${genre.toLowerCase()}`}
                      onClick={() => setRecGenre(genre)}
                      className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all cursor-pointer ${
                        recGenre === genre
                          ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20 scale-105'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700/50'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating Threshold */}
              <div className="lg:col-span-4">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    2. Minimum Rating Preference
                  </label>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    ⭐ {recMinRating.toFixed(1)}+
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[7.0, 7.5, 8.0, 8.5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      id={`rec-rating-btn-${val}`}
                      onClick={() => setRecMinRating(val)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                        recMinRating === val
                          ? 'bg-amber-500 text-zinc-950 border-amber-400'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700/50'
                      }`}
                    >
                      {val}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Era & Sort Preference */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
                  3. Era / Timeframe
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'all', label: 'All Eras' },
                    { id: 'modern', label: '2015+' },
                    { id: 'classic', label: 'Classics' },
                  ].map((era) => (
                    <button
                      key={era.id}
                      type="button"
                      id={`rec-era-${era.id}`}
                      onClick={() => setRecEra(era.id)}
                      className={`py-1.5 text-center text-xs font-medium rounded-lg transition-colors cursor-pointer border ${
                        recEra === era.id
                          ? 'bg-zinc-200 text-zinc-950 font-semibold border-white'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white border-zinc-700/50'
                      }`}
                    >
                      {era.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-bar showing active recommendation formula */}
            <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500 font-medium">Recommending:</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 font-medium border border-zinc-700">
                  Genre: <strong className="text-amber-400">{recGenre}</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 font-medium border border-zinc-700">
                  Min Rating: <strong className="text-amber-400">{recMinRating.toFixed(1)}+</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Order by:</span>
                <select
                  value={recSort}
                  onChange={(e) => setRecSort(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="match">Highest Match Score</option>
                  <option value="rating">Top Rating First</option>
                  <option value="year">Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recommendations Cards Grid */}
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((movie) => {
                const isBookmarked = watchlist.some((w) => w.id === movie.id);
                return (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    matchScore={movie.matchScore}
                    matchReason={movie.matchReason}
                    isBookmarked={isBookmarked}
                    onToggleBookmark={onToggleBookmark}
                  />
                );
              })}
            </div>
          ) : (
            <div
              id="recommendations-empty-state"
              className="bg-zinc-900/60 border border-dashed border-zinc-800 rounded-2xl p-10 text-center max-w-lg mx-auto"
            >
              <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white">No Recommendations Found</h3>
              <p className="text-sm text-zinc-400 mt-1 mb-5">
                No movies in our catalog match both <strong className="text-amber-400">{recGenre}</strong> and a minimum rating of <strong className="text-amber-400">{recMinRating}+</strong> in this era.
              </p>
              <button
                type="button"
                onClick={() => {
                  setRecMinRating(7.0);
                  setRecEra('all');
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Lower Minimum Rating to 7.0+
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: TRENDING & POPULAR HIGHLIGHTS */}
      <section
        id="trending-movies"
        className="py-14 border-b border-zinc-800/80 bg-zinc-900/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Trending & Buzzing
                </h2>
                <p className="text-xs text-zinc-400">
                  Most talked-about titles across all genres right now
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-rose-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> High Engagement
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingMovies.map((movie) => (
              <MovieCard
                key={`trending-${movie.id}`}
                movie={movie}
                isBookmarked={watchlist.some((w) => w.id === movie.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: COMPLETE MOVIE CATALOG & SEARCH */}
      <section id="catalog-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Explore Full Library
              </h2>
              <p className="text-sm text-zinc-400 mt-0.5">
                Filter by genre or search across titles, cast, and directors
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                <span>Sort by:</span>
              </div>
              <select
                id="catalog-sort-select"
                value={catalogSort}
                onChange={(e) => setCatalogSort(e.target.value)}
                className="bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2 text-xs md:text-sm text-zinc-200 focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="rating-desc">Highest Rated</option>
                <option value="rating-asc">Lowest Rated</option>
                <option value="year-desc">Newest Release</option>
                <option value="year-asc">Oldest Release</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Genre Filter Tabs */}
          <div className="mb-8">
            <GenreFilter
              selectedGenre={selectedGenre}
              onSelectGenre={handleGenreChange}
              movieCounts={movieCounts}
            />
          </div>

          {/* Loading Indicator */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
              <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Filtering catalog...</p>
            </div>
          ) : filteredCatalog.length > 0 ? (
            /* Results Grid */
            <div>
              <div className="mb-4 text-xs text-zinc-400 flex items-center justify-between">
                <span>
                  Showing <strong className="text-zinc-200">{filteredCatalog.length}</strong> movies
                  {selectedGenre !== 'All' && <span> in <strong className="text-amber-400">{selectedGenre}</strong></span>}
                </span>
                {(selectedGenre !== 'All' || searchQuery) && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset all filters
                  </button>
                )}
              </div>

              <div
                id="movies-catalog-grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredCatalog.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isBookmarked={watchlist.some((w) => w.id === movie.id)}
                    onToggleBookmark={onToggleBookmark}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* "No Movies Found" State */
            <div
              id="no-movies-found-state"
              className="py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 text-center max-w-lg mx-auto px-6"
            >
              <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <Film className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No Movies Found</h3>
              <p className="text-sm text-zinc-400 mt-2 mb-6">
                We couldn't find any movies matching your current search "{searchQuery}"
                {selectedGenre !== 'All' && ` in ${selectedGenre}`}.
              </p>
              <button
                type="button"
                id="reset-catalog-btn"
                onClick={resetAllFilters}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
