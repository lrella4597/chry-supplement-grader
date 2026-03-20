"use client";

import { useState } from "react";
import type { CategoryScores } from "@/lib/scoring-engine";

const CATEGORY_INFO: Record<string, { description: string; whatWeCheck: string[] }> = {
  "Clinical Dosing": {
    description: "This measures whether each ingredient is at the dose shown to actually work in clinical trials. A supplement can have great ingredients on paper, but if they're underdosed, you won't get the benefits you're paying for.",
    whatWeCheck: [
      "Each ingredient's dose compared to peer-reviewed clinical research",
      "Evidence strength weighting — ingredients with stronger research matter more",
      "Form quality — some forms absorb much better than others (e.g., magnesium glycinate vs oxide)",
      "Ingredients below 25% of clinical dose are flagged as 'fairy dusted' — present for marketing, not effect",
    ],
  },
  Transparency: {
    description: "This measures how clearly the supplement discloses what's actually inside. You deserve to know exactly what you're taking and how much of each ingredient you're getting.",
    whatWeCheck: [
      "Are all individual ingredient doses clearly listed?",
      "Does the label use 'proprietary blends' that hide individual doses?",
      "Is the specific form of each ingredient disclosed (e.g., 'magnesium glycinate' vs just 'magnesium')?",
      "How many filler/inactive ingredients are in the 'Other Ingredients' section?",
    ],
  },
  "Clean Label": {
    description: "This checks for unnecessary additives, artificial sweeteners, fillers, and ingredients that don't belong in a health product. A truly clean supplement should help you — not add things your body doesn't need.",
    whatWeCheck: [
      "Artificial sweeteners (sucralose, acesulfame potassium, aspartame)",
      "Artificial colors (FD&C dyes like Red 40, Blue 1)",
      "Fillers and bulking agents (maltodextrin, titanium dioxide)",
      "Processing aids (silicon dioxide) and vague terms ('natural flavors')",
    ],
  },
  "Formula Intelligence": {
    description: "This evaluates whether the formula was designed with intention. Smart formulas pair ingredients that work better together and avoid combinations that interfere with each other.",
    whatWeCheck: [
      "Synergistic pairings — e.g., Vitamin D3 + K2 (K2 directs calcium to bones, not arteries)",
      "Ingredient antagonists — e.g., calcium and iron compete for absorption in the same serving",
      "Total ingredient count — formulas with 25+ ingredients tend to underdose everything",
      "Known bioavailability enhancers — e.g., curcumin + piperine (2000% absorption increase)",
    ],
  },
};

const CATEGORY_STYLES: Record<string, { color: string; bg: string }> = {
  "Clinical Dosing": { color: "#2E7D32", bg: "#F0FFF0" },
  Transparency: { color: "#1565C0", bg: "#EFF6FF" },
  "Clean Label": { color: "#2E7D32", bg: "#ECFDF5" },
  "Formula Intelligence": { color: "#7B1FA2", bg: "#F5F0FF" },
};

export function CategoryBreakdown({ scores }: { scores: CategoryScores }) {
  const categories = [
    { label: "Clinical Dosing", score: scores.clinical_dosing.score, max: 50 },
    { label: "Transparency", score: scores.transparency.score, max: 20 },
    { label: "Clean Label", score: scores.clean_label.score, max: 20 },
    { label: "Formula Intelligence", score: scores.formula_intelligence.score, max: 10 },
  ];

  return (
    <div className="space-y-3">
      {categories.map((cat) => (
        <CategoryBarItem key={cat.label} {...cat} />
      ))}
    </div>
  );
}

function CategoryBarItem({ label, score, max }: { label: string; score: number; max: number }) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round((score / max) * 100);
  const info = CATEGORY_INFO[label];
  const style = CATEGORY_STYLES[label] || { color: "#666", bg: "#f5f5f5" };

  const ratingLabel = pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : pct >= 40 ? "Fair" : pct >= 20 ? "Poor" : "Failing";

  return (
    <div
      className="rounded-xl border border-border bg-white overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-sm"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-semibold text-xs sm:text-sm text-text truncate">{label}</span>
            <span
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shrink-0"
              style={{ backgroundColor: style.bg, color: style.color }}
            >
              {ratingLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-xs sm:text-sm font-mono text-text-muted">
              {score.toFixed(1)}/{max}
            </span>
            <svg
              className={`w-4 h-4 text-text-dim transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-cream overflow-hidden">
          <div
            className="h-full rounded-full animate-fill"
            style={{ width: `${pct}%`, backgroundColor: style.color }}
          />
        </div>
      </div>

      {expanded && info && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-border-light pt-3 space-y-3">
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{info.description}</p>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold text-text-dim uppercase tracking-wider mb-2">What we check:</p>
            <ul className="space-y-1.5">
              {info.whatWeCheck.map((item, i) => (
                <li key={i} className="text-[11px] sm:text-xs text-text-secondary flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: style.color }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
