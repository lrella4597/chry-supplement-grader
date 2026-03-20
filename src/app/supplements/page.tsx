"use client";

import { useState, useMemo } from "react";
import { preloadedSupplements } from "@/data/preloaded-supplements";
import type { SupplementProfile } from "@/data/preloaded-supplements";
import { gradeSupplement } from "@/lib/scoring-engine";
import type { GradeResult } from "@/lib/scoring-engine";
import { GradeBadge } from "@/components/GradeBadge";
import { ResultsDisplay } from "@/components/ResultsDisplay";

type Category = "all" | "sleep" | "greens" | "preworkout" | "protein" | "multivitamin" | "creatine" | "individual" | "cognitive" | "womens" | "competitor";

const CATEGORY_LABELS: Record<Category, string> = {
  all: "All", sleep: "Sleep & Recovery", greens: "Greens Powders", preworkout: "Pre-Workout",
  protein: "Protein", multivitamin: "Multivitamins", creatine: "Creatine",
  individual: "Individual", cognitive: "Cognitive", womens: "Women's Health", competitor: "CHRY Competitors",
};

interface GradedProfile { profile: SupplementProfile; result: GradeResult; }

export default function SupplementsPage() {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<GradedProfile | null>(null);
  const [sortBy, setSortBy] = useState<"grade" | "name">("grade");

  const graded = useMemo<GradedProfile[]>(() => {
    return preloadedSupplements.map((profile) => ({ profile, result: gradeSupplement(profile.data) }));
  }, []);

  const filtered = useMemo(() => {
    let items = graded;
    if (category !== "all") items = items.filter((g) => g.profile.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((g) => g.profile.product_name.toLowerCase().includes(q) || g.profile.brand.toLowerCase().includes(q));
    }
    if (sortBy === "grade") items = [...items].sort((a, b) => b.result.total_score - a.result.total_score);
    else items = [...items].sort((a, b) => a.profile.product_name.localeCompare(b.profile.product_name));
    return items;
  }, [graded, category, search, sortBy]);

  const hallOfFame = useMemo(() => graded.filter((g) => g.result.total_score >= 80).sort((a, b) => b.result.total_score - a.result.total_score), [graded]);
  const needsImprovement = useMemo(() => graded.filter((g) => g.result.total_score < 50).sort((a, b) => a.result.total_score - b.result.total_score), [graded]);

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-fade-up">
        <button onClick={() => setSelected(null)} className="text-sm text-text-muted hover:text-dog mb-6 flex items-center gap-1 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to leaderboard
        </button>
        <ResultsDisplay result={selected.result} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl mb-3">
          <span className="text-text">Supplement </span><span className="text-dog">Leaderboard</span>
        </h1>
        <p className="text-text-muted text-sm sm:text-base">See how the most popular supplements actually score against clinical research.</p>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search supplements..."
            className="w-full border border-border rounded-xl pl-11 pr-4 py-3 text-sm bg-white text-text focus:outline-none focus:ring-2 focus:ring-dog/30 placeholder:text-text-dim"
          />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "grade" | "name")}
          className="border border-border rounded-xl px-4 py-3 text-sm bg-white text-text-secondary"
        >
          <option value="grade">Sort by Grade</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Category tabs - horizontal scroll with hidden scrollbar */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
              category === cat ? "bg-dog text-white shadow-sm" : "bg-white border border-border text-text-muted hover:border-dog/30 hover:text-text"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Hall of Fame / Needs Improvement */}
      {category === "all" && !search && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-display text-base sm:text-lg text-green-800">Top Dogs 🏆</h3>
              <span className="text-[10px] text-green-600 uppercase tracking-wider ml-auto">A / A-</span>
            </div>
            {hallOfFame.length === 0 && <p className="text-sm text-text-dim">No supplements scored A or above.</p>}
            <div className="space-y-1">
              {hallOfFame.slice(0, 8).map((g) => (
                <button key={g.profile.id} onClick={() => setSelected(g)}
                  className="w-full flex items-center gap-2 sm:gap-3 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl hover:bg-green-100/50 transition-colors text-left"
                >
                  <GradeBadge grade={g.result.grade} color={g.result.grade_color} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-text truncate">{g.profile.product_name}</div>
                    <div className="text-[10px] sm:text-xs text-text-dim">{g.profile.brand}</div>
                  </div>
                  <span className="text-xs font-mono text-green-700 shrink-0">{g.result.total_score}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-display text-base sm:text-lg text-red-800">In the Doghouse 💩</h3>
              <span className="text-[10px] text-red-600 uppercase tracking-wider ml-auto">D / F</span>
            </div>
            {needsImprovement.length === 0 && <p className="text-sm text-text-dim">No supplements scored D or below.</p>}
            <div className="space-y-1">
              {needsImprovement.slice(0, 8).map((g) => (
                <button key={g.profile.id} onClick={() => setSelected(g)}
                  className="w-full flex items-center gap-2 sm:gap-3 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl hover:bg-red-100/50 transition-colors text-left"
                >
                  <GradeBadge grade={g.result.grade} color={g.result.grade_color} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-semibold text-text truncate">{g.profile.product_name}</div>
                    <div className="text-[10px] sm:text-xs text-text-dim">{g.profile.brand}</div>
                  </div>
                  <span className="text-xs font-mono text-red-700 shrink-0">{g.result.total_score}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map((g) => (
          <button key={g.profile.id} onClick={() => setSelected(g)}
            className="rounded-2xl border border-border bg-white p-4 sm:p-5 text-left hover:border-dog/30 hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <GradeBadge grade={g.result.grade} color={g.result.grade_color} size="md" />
              <div className="min-w-0">
                <div className="font-bold text-sm sm:text-base text-text truncate group-hover:text-dog transition-colors">{g.profile.product_name}</div>
                <div className="text-[10px] sm:text-xs text-text-dim">{g.profile.brand}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-mono text-text-muted">{g.result.total_score}/100</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${g.result.grade_color}15`, color: g.result.grade_color }}
              >
                {g.result.grade_label.split(",")[0]}
              </span>
            </div>
            <p className="text-xs text-text-dim line-clamp-2 leading-relaxed">{g.result.summary}</p>
          </button>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-16 text-text-dim">No supplements found matching your search.</div>}

      <div className="text-center mt-12 sm:mt-16 py-8 sm:py-10 border-t border-border-light">
        <p className="text-text-muted mb-4 text-sm sm:text-base">Don&apos;t see your supplement? Grade it yourself.</p>
        <a href="/grade" className="inline-block bg-dog text-white font-bold px-8 py-3 rounded-full hover:bg-dog-bright transition-colors text-sm">
          Grade Your Supplement
        </a>
      </div>
    </div>
  );
}
