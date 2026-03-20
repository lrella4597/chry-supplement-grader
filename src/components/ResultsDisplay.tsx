"use client";

import type { GradeResult } from "@/lib/scoring-engine";
import { GradeBadge } from "./GradeBadge";
import { CategoryBreakdown } from "./CategoryBar";
import { IngredientRow } from "./IngredientRow";
import { ShareCard } from "./ShareCard";

export function ResultsDisplay({ result }: { result: GradeResult }) {
  const cs = result.category_scores;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-up">
      {/* Hero grade */}
      <div className="text-center space-y-4 sm:space-y-5 py-6 sm:py-8 bg-white rounded-2xl border border-border px-4">
        <div className="flex justify-center">
          <GradeBadge grade={result.grade} color={result.grade_color} size="xl" />
        </div>
        <div>
          <div className="font-display text-4xl sm:text-6xl text-text">{result.total_score}</div>
          <div className="text-text-dim text-sm mt-1">out of 100</div>
        </div>
        <p className="text-base sm:text-lg text-text-secondary max-w-lg mx-auto leading-relaxed">
          {result.summary}
        </p>
        <span
          className="inline-block text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-3 sm:px-4 py-1.5 rounded-full"
          style={{ backgroundColor: `${result.grade_color}15`, color: result.grade_color }}
        >
          {result.grade_label}
        </span>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl border border-border bg-white p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg sm:text-xl text-text">Score Breakdown</h2>
          <span className="text-[10px] text-text-dim uppercase tracking-widest hidden sm:inline">Tap to learn more</span>
        </div>
        <CategoryBreakdown scores={cs} />
      </div>

      {/* Ingredient breakdown */}
      {result.recognized_ingredients.length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg sm:text-xl text-text">Ingredient Analysis</h2>
            <span className="text-[10px] text-text-dim uppercase tracking-widest">
              {result.recognized_ingredients.length} scored
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mb-4">
            Each ingredient is compared against the dose proven effective in clinical trials. Tap any ingredient to learn why it scored the way it did.
          </p>
          <div className="space-y-2">
            {result.recognized_ingredients.map((ing, i) => (
              <IngredientRow key={i} item={ing} />
            ))}
          </div>
        </div>
      )}

      {/* Synergies */}
      {result.synergies.length > 0 && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-6">
          <h2 className="font-display text-lg sm:text-xl text-green-800 mb-1">Synergy Bonuses</h2>
          <p className="text-xs sm:text-sm text-text-secondary mb-4">
            These ingredient pairings work better together than alone. Smart formula design earns bonus points.
          </p>
          <div className="space-y-2 sm:space-y-3">
            {result.synergies.map((syn, i) => (
              <div key={i} className="flex items-start gap-2 sm:gap-3 rounded-xl bg-white border border-green-200 p-2.5 sm:p-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm text-text-secondary">{syn}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Red flags */}
      {result.red_flags.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-6">
          <h2 className="font-display text-lg sm:text-xl text-red-800 mb-1">Red Flags</h2>
          <p className="text-xs sm:text-sm text-text-secondary mb-4">
            These are ingredients or practices that penalize the score. They either don&apos;t belong in a health product or they hide important information from you.
          </p>
          <div className="space-y-2 sm:space-y-3">
            {result.red_flags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2 sm:gap-3 rounded-xl bg-white border border-red-200 p-2.5 sm:p-3">
                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-xs sm:text-sm text-red-800">{flag.name}</span>
                  <p className="text-xs sm:text-sm text-text-secondary mt-0.5">{flag.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unrecognized */}
      {result.unrecognized_ingredients.length > 0 && (
        <div className="rounded-2xl border border-border bg-white p-4 sm:p-6">
          <h2 className="font-display text-lg sm:text-xl text-text mb-1">Not Scored</h2>
          <p className="text-xs sm:text-sm text-text-muted mb-4">
            We don&apos;t have clinical data for these ingredients in our database yet. They weren&apos;t factored into the score — they didn&apos;t help or hurt.
          </p>
          <div className="flex flex-wrap gap-2">
            {result.unrecognized_ingredients.map((name, i) => (
              <span key={i} className="text-xs bg-cream border border-border-light px-3 py-1.5 rounded-full text-text-muted">{name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Share */}
      <ShareCard result={result} />

      {/* CTA */}
      <div className="text-center py-6 sm:py-8 border-t border-border-light">
        <p className="text-text-dim text-sm mb-3">Looking for a supplement that scores an A?</p>
        <a
          href="https://drinkchry.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-dog text-white font-bold px-8 py-3 rounded-full hover:bg-dog-bright transition-colors text-sm"
        >
          Meet SuppDog
        </a>
      </div>
    </div>
  );
}
