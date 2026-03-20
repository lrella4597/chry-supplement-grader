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
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#F5F0EB",
      });
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
      // In production, send to Klaviyo or email service
      handleDownload();
    }
  }

  return (
    <div className="space-y-4">
      {/* The card to capture */}
      <div
        ref={cardRef}
        className="bg-white rounded-2xl p-8 shadow-sm text-center max-w-sm mx-auto"
      >
        <div className="text-xs text-navy/40 mb-4 uppercase tracking-wider font-medium">
          Supplement Grade
        </div>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold text-white mx-auto mb-3"
          style={{ backgroundColor: result.grade_color }}
        >
          {result.grade}
        </div>
        <div className="text-2xl font-extrabold mb-1">
          {result.total_score}/100
        </div>
        <div className="font-semibold text-sm mb-4">
          {result.product_name || "Your Supplement"}
        </div>
        <div className="text-[10px] text-navy/30">
          Graded by CHRY 🍒 — drinkchry.com/grade
        </div>
      </div>

      {/* Email gate */}
      {showEmailGate && (
        <form
          onSubmit={handleEmailSubmit}
          className="max-w-sm mx-auto bg-white rounded-2xl p-6 shadow-sm space-y-3 text-center"
        >
          <p className="text-sm font-medium">
            Enter your email to download your results card
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-cream-dark rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cherry/30"
            required
          />
          <button
            type="submit"
            className="w-full bg-cherry text-white font-semibold py-2 rounded-lg hover:bg-cherry-dark transition-colors text-sm"
          >
            Download Card
          </button>
          <button
            type="button"
            onClick={() => setShowEmailGate(false)}
            className="text-xs text-navy/40 hover:text-navy/60"
          >
            Skip
          </button>
        </form>
      )}

      {!showEmailGate && (
        <div className="text-center">
          <button
            onClick={handleDownload}
            className="bg-navy text-white font-semibold px-6 py-3 rounded-full hover:bg-navy-light transition-colors text-sm"
          >
            Share Your Results
          </button>
        </div>
      )}
    </div>
  );
}
