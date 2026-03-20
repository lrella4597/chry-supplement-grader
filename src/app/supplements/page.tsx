"use client";

import { useState, useEffect, useMemo } from "react";
import { preloadedSupplements } from "@/data/preloaded-supplements";
import type { SupplementProfile } from "@/data/preloaded-supplements";
import { gradeSupplement } from "@/lib/scoring-engine";
import type { GradeResult } from "@/lib/scoring-engine";
import { GradeBadge } from "@/components/GradeBadge";
import { ResultsDisplay } from "@/components/ResultsDisplay";

type Category =
  | "all"
  | "sleep"
  | "greens"
  | "preworkout"
  | "protein"
  | "multivitamin"
  | "creatine"
  | "individual"
  | "competitor";

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  sleep: "Sleep & Recovery",
  greens: "Greens Powders",
  preworkout: "Pre-Workout",
  protein: "Protein",
  multivitamin: "Multivitamins",
  creatine: "Creatine",
  individual: "Individual Supplements",
  competitor: "CHRY Competitors",
};

interface GradedProfile {
  profile: SupplementProfile;
  result: GradeResult;
}

export default function SupplementsPage() {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<GradedProfile | null>(null);
  const [sortBy, setSortBy] = useState<"grade" | "name">("grade");

  // Grade all supplements on mount
  const graded = useMemo<GradedProfile[]>(() => {
    return preloadedSupplements.map((profile) => ({
      profile,
      result: gradeSupplement(profile.data),
    }));
  }, []);

  // Filter and sort
  const filtered = useMemo(() => {
    let items = graded;

    if (category !== "all") {
      items = items.filter((g) => g.profile.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (g) =>
          g.profile.product_name.toLowerCase().includes(q) ||
          g.profile.brand.toLowerCase().includes(q)
      );
    }

    if (sortBy === "grade") {
      items = [...items].sort((a, b) => b.result.total_score - a.result.total_score);
    } else {
      items = [...items].sort((a, b) =>
        a.profile.product_name.localeCompare(b.profile.product_name)
      );
    }

    return items;
  }, [graded, category, search, sortBy]);

  // Hall of Fame / Wall of Shame
  const hallOfFame = graded
    .filter((g) => g.result.total_score >= 80)
    .sort((a, b) => b.result.total_score - a.result.total_score);
  const needsImprovement = graded
    .filter((g) => g.result.total_score < 50)
    .sort((a, b) => a.result.total_score - b.result.total_score);

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-navy/50 hover:text-cherry mb-4"
        >
          ← Back to all supplements
        </button>
        <ResultsDisplay result={selected.result} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          Supplement Leaderboard
        </h1>
        <p className="text-navy/60">
          See how the most popular supplements actually score.
        </p>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search supplements..."
          className="flex-1 border border-cream-dark rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cherry/30"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "grade" | "name")}
          className="border border-cream-dark rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="grade">Sort by Grade</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? "bg-cherry text-white"
                : "bg-white text-navy/60 hover:bg-cream-dark"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Hall of Fame / Needs Improvement */}
      {category === "all" && !search && (
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-200">
            <h3 className="font-bold text-green-700 mb-3">
              Hall of Fame (A / A-)
            </h3>
            {hallOfFame.length === 0 && (
              <p className="text-sm text-navy/40">No supplements scored A or above.</p>
            )}
            {hallOfFame.slice(0, 5).map((g) => (
              <button
                key={g.profile.id}
                onClick={() => setSelected(g)}
                className="w-full flex items-center gap-3 py-2 border-b border-cream-dark/50 last:border-0 hover:bg-cream/50 transition-colors text-left"
              >
                <GradeBadge
                  grade={g.result.grade}
                  color={g.result.grade_color}
                  size="sm"
                />
                <div>
                  <div className="text-sm font-semibold">
                    {g.profile.product_name}
                  </div>
                  <div className="text-xs text-navy/40">{g.profile.brand}</div>
                </div>
              </button>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-200">
            <h3 className="font-bold text-red-700 mb-3">
              Needs Improvement (D / F)
            </h3>
            {needsImprovement.length === 0 && (
              <p className="text-sm text-navy/40">No supplements scored D or below.</p>
            )}
            {needsImprovement.slice(0, 5).map((g) => (
              <button
                key={g.profile.id}
                onClick={() => setSelected(g)}
                className="w-full flex items-center gap-3 py-2 border-b border-cream-dark/50 last:border-0 hover:bg-cream/50 transition-colors text-left"
              >
                <GradeBadge
                  grade={g.result.grade}
                  color={g.result.grade_color}
                  size="sm"
                />
                <div>
                  <div className="text-sm font-semibold">
                    {g.profile.product_name}
                  </div>
                  <div className="text-xs text-navy/40">{g.profile.brand}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <button
            key={g.profile.id}
            onClick={() => setSelected(g)}
            className="bg-white rounded-2xl p-5 shadow-sm text-left hover:shadow-md hover:border-cherry/20 border border-transparent transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <GradeBadge
                grade={g.result.grade}
                color={g.result.grade_color}
                size="md"
              />
              <div>
                <div className="font-bold">{g.profile.product_name}</div>
                <div className="text-xs text-navy/40">{g.profile.brand}</div>
              </div>
            </div>
            <div className="text-sm text-navy/60 mb-2">
              Score: {g.result.total_score}/100
            </div>
            <p className="text-xs text-navy/40 line-clamp-2">
              {g.result.summary}
            </p>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-navy/40">
          No supplements found matching your search.
        </div>
      )}
    </div>
  );
}
