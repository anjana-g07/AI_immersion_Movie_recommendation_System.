import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Sparkles, Bookmark, Menu, X, TrendingUp } from 'lucide-react';

export default function Navbar({ watchlist = [], onOpenWatchlist }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (isHome) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav id="app-navbar" className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            id="nav-logo"
            className="flex items-center space-x-2.5 group transition-transform duration-200 active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-950/40">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                CineMatch
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">
                Movie Recommendations
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              id="nav-link-home"
              className={`text-sm font-medium transition-colors ${
                isHome ? 'text-amber-400' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Explore Movies
            </Link>

            {isHome ? (
              <>
                <button
                  type="button"
                  id="nav-link-recommend"
                  onClick={() => scrollToSection('recommendation-engine')}
                  className="text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Recommendation Engine
                </button>
                <button
                  type="button"
                  id="nav-link-trending"
                  onClick={() => scrollToSection('trending-movies')}
                  className="text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  Trending
                </button>
              </>
            ) : (
              <Link
                to="/#recommendation-engine"
                id="nav-link-back-recommend"
                className="text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Recommendations
              </Link>
            )}

            {/* Watchlist Trigger */}
            <button
              type="button"
              id="nav-watchlist-btn"
              onClick={onOpenWatchlist}
              className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 hover:text-white text-sm font-medium transition-colors border border-zinc-700/60 cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span
                  id="watchlist-badge-count"
                  className="ml-1 px-1.5 py-0.2 text-xs font-bold rounded-full bg-amber-500 text-zinc-950 min-w-[20px] text-center"
                >
                  {watchlist.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              type="button"
              id="nav-mobile-watchlist-btn"
              onClick={onOpenWatchlist}
              className="relative p-2 rounded-lg bg-zinc-800/80 text-zinc-200 border border-zinc-700/60 cursor-pointer"
              aria-label="Open Watchlist"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </button>
            <button
              type="button"
              id="nav-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-t border-zinc-800 bg-zinc-900/95 px-4 py-3 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-zinc-200 hover:text-amber-400"
          >
            Explore Movies
          </Link>
          {isHome ? (
            <>
              <button
                type="button"
                onClick={() => scrollToSection('recommendation-engine')}
                className="w-full text-left py-2 text-sm font-medium text-zinc-200 hover:text-amber-400 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Recommendation Engine
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('trending-movies')}
                className="w-full text-left py-2 text-sm font-medium text-zinc-200 hover:text-rose-400 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-rose-400" />
                Trending Movies
              </button>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-zinc-200 hover:text-amber-400"
            >
              Back to Catalog
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
