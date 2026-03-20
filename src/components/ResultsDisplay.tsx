"use client";

import type { GradeResult } from "@/lib/scoring-engine";
import { GradeBadge } from "./GradeBadge";
import { CategoryBar } from "./CategoryBar";
import { IngredientRow } from "./IngredientRow";
import { ShareCard } from "./ShareCard";

export function ResultsDisplay({ result }: { result: GradeResult }) {
  const cs = result.category_scores;

  return (
    <div className="space-y-8">
      {/* Hero grade */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <GradeBadge grade={result.grade} color={result.grade_color} size="lg" />
        </div>
        <div>
          <div className="text-5xl font-extrabold">{result.total_score}</div>
          <div className="text-navy/50 text-sm">out of 100</div>
        </div>
        <p className="text-lg max-w-lg mx-auto">{result.summary}</p>
        <p className="text-xs text-navy/40">{result.grade_label}</p>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-lg">Score Breakdown</h2>
        <CategoryBar
          label="Clinical Dosing"
          score={cs.clinical_dosing.score}
          max={cs.clinical_dosing.max}
        />
        <CategoryBar
          label="Transparency"
          score={cs.transparency.score}
          max={cs.transparency.max}
        />
        <CategoryBar
          label="Clean Label"
          score={cs.clean_label.score}
          max={cs.clean_label.max}
        />
        <CategoryBar
          label="Formula Intelligence"
          score={cs.formula_intelligence.score}
          max={cs.formula_intelligence.max}
        />
      </div>

      {/* Ingredient breakdown */}
      {result.recognized_ingredients.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Ingredient Breakdown</h2>
          {result.recognized_ingredients.map((ing, i) => (
            <IngredientRow key={i} item={ing} />
          ))}
        </div>
      )}

      {/* Unrecognized */}
      {result.unrecognized_ingredients.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-2">Not Scored</h2>
          <p className="text-sm text-navy/50 mb-3">
            We don&apos;t have clinical data for these ingredients. They were
            not factored into your score.
          </p>
          <div className="flex flex-wrap gap-2">
            {result.unrecognized_ingredients.map((name, i) => (
              <span
                key={i}
                className="text-xs bg-cream-dark px-3 py-1 rounded-full"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Red flags */}
      {result.red_flags.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
          <h2 className="font-bold text-lg mb-3 text-red-700">Red Flags</h2>
          <div className="space-y-2">
            {result.red_flags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">●</span>
                <div>
                  <span className="font-semibold text-sm">{flag.name}</span>
                  <span className="text-sm text-navy/60"> — {flag.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Synergies */}
      {result.synergies.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200">
          <h2 className="font-bold text-lg mb-3 text-green-700">
            Synergy Bonuses
          </h2>
          <div className="space-y-2">
            {result.synergies.map((syn, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5">✨</span>
                <span>{syn}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share */}
      <ShareCard result={result} />

      {/* CTA */}
      <div className="text-center py-8 border-t border-cream-dark/50">
        <p className="text-navy/40 text-sm mb-2">
          Looking for a supplement that scores an A?
        </p>
        <a
          href="https://drinkchry.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-cherry text-white font-semibold px-6 py-3 rounded-full hover:bg-cherry-dark transition-colors"
        >
          Meet CHRY 🍒
        </a>
      </div>
    </div>
  );
}
