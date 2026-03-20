"use client";

import { useState } from "react";

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl">🐶</span>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-display text-xl sm:text-2xl tracking-wide text-dog">
              SuppDog
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-text-dim tracking-widest uppercase">
              by CHRY
            </span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-1">
          <a href="/grade" className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-cream transition-all">
            Grade
          </a>
          <a href="/recommend" className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-cream transition-all">
            Find Your Match
          </a>
          <a href="/supplements" className="px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-cream transition-all">
            Leaderboard
          </a>
          <a href="https://drinkchry.com" target="_blank" rel="noopener noreferrer"
            className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold bg-dog text-white hover:bg-dog-bright transition-all">
            Shop CHRY
          </a>
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-cream transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-text transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
          <span className={`block w-5 h-0.5 bg-text transition-all duration-300 mt-1 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-text transition-all duration-300 mt-1 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border-light bg-white/95 backdrop-blur-xl animate-fade-up">
          <nav className="flex flex-col px-4 py-3 gap-1">
            <a href="/grade" onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-cream transition-all">
              Grade
            </a>
            <a href="/recommend" onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-cream transition-all">
              Find Your Match
            </a>
            <a href="/supplements" onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-cream transition-all">
              Leaderboard
            </a>
            <a href="https://drinkchry.com" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-semibold bg-dog text-white hover:bg-dog-bright transition-all text-center mt-1">
              Shop CHRY
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
