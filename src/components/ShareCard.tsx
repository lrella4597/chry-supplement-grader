"use client";

import { useRef, useState } from "react";
import type { GradeResult } from "@/lib/scoring-engine";

export function ShareCard({ result }: { result: GradeResult }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  async function handleDownload() {
    if (!downloaded && !showEmailGate) {
      setShowEmailGate(true);
      return;
    }
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: "#F5F0EB" });
      const link = document.createElement("a");
      link.download = `supplement-grade-${result.product_name || "result"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Could not generate image. Try taking a screenshot instead.");
    }
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.includes("@")) {
      setDownloaded(true);
      setShowEmailGate(false);
      handleDownload();
    }
  }

  return (
    <div className="space-y-4">
      <div ref={cardRef} className="rounded-2xl border border-border bg-white p-6 sm:p-8 text-center max-w-[320px] sm:max-w-sm mx-auto">
        <div className="text-[10px] text-text-dim mb-4 sm:mb-6 uppercase tracking-[0.2em] font-medium">Supplement Grade</div>
        <div className="relative inline-flex mb-4">
          <div className="absolute inset-0 rounded-full blur-lg opacity-20" style={{ backgroundColor: result.grade_color }} />
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-display text-2xl sm:text-3xl text-white relative z-10 shadow-lg"
            style={{ backgroundColor: result.grade_color }}
          >
            {result.grade}
          </div>
        </div>
        <div className="font-display text-2xl sm:text-3xl text-text mb-1">{result.total_score}/100</div>
        <div className="font-semibold text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6">{result.product_name || "Your Supplement"}</div>
        <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] text-text-dim">
          <span>Graded by</span>
          <span className="text-dog font-bold">SuppDog</span>
          <span>drinkchry.com/grade</span>
        </div>
      </div>

      {showEmailGate && (
        <form onSubmit={handleEmailSubmit} className="max-w-[320px] sm:max-w-sm mx-auto rounded-2xl border border-border bg-white p-4 sm:p-6 space-y-3 text-center">
          <p className="text-xs sm:text-sm font-medium text-text">Enter your email to download your results card</p>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-cream-light text-text focus:outline-none focus:ring-2 focus:ring-dog/30"
            required
          />
          <button type="submit" className="w-full bg-dog text-white font-semibold py-2.5 rounded-lg hover:bg-dog-bright transition-colors text-sm">
            Download Card
          </button>
          <button type="button" onClick={() => setShowEmailGate(false)} className="text-xs text-text-dim hover:text-text-muted">Skip</button>
        </form>
      )}

      {!showEmailGate && (
        <div className="text-center">
          <button onClick={handleDownload} className="border border-border text-text-secondary font-semibold px-6 sm:px-8 py-3 rounded-full hover:border-dog/30 hover:text-dog transition-all text-sm">
            Share Your Results
          </button>
        </div>
      )}
    </div>
  );
}
