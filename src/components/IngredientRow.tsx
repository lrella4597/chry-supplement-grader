"use client";

import { useState } from "react";
import type { IngredientScore } from "@/lib/scoring-engine";

function formatDose(mg: number): string {
  if (mg >= 1000) return `${(mg / 1000).toFixed(mg % 1000 === 0 ? 0 : 1)}g`;
  if (mg < 1 && mg > 0) return `${(mg * 1000).toFixed(0)}mcg`;
  return `${mg}mg`;
}

function getFormExplanation(item: IngredientScore): string | null {
  if (item.form_quality === "preferred")
    return "This uses a high-quality, well-absorbed form. Your body can efficiently use what's on the label.";
  if (item.form_quality === "inferior")
    return "This uses a lower-quality form with reduced bioavailability. Your body may only absorb a fraction of what's listed. A 30% penalty was applied to this ingredient's score.";
  return null;
}

function getDoseExplanation(item: IngredientScore): string {
  const pct = item.dose_percentage;
  if (pct >= 100) return "This ingredient is at or above the clinically studied dose. You're getting a full effective amount.";
  if (pct >= 75) return "Close to the clinical dose but slightly under. Still likely effective for most people.";
  if (pct >= 50) return "At about half the dose shown to work in studies. You may see some benefit, but you're not getting the full effect researchers observed.";
  if (pct >= 25) return "Significantly below what clinical research shows is effective. At this dose, you're unlikely to see meaningful results.";
  return "This is what we call \"fairy dusted\" — there's so little of this ingredient that it's essentially there for the label, not for your body. Less than 25% of the studied effective dose.";
}

export function IngredientRow({ item }: { item: IngredientScore }) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.min(item.dose_percentage, 100);

  const barColor = pct >= 75 ? "#2E7D32" : pct >= 50 ? "#F59E0B" : pct >= 25 ? "#EA580C" : "#DC2626";

  const isFairyDusted = item.flags.includes("fairy_dusted");
  const isUnderdosed = item.flags.includes("underdosed") || item.flags.includes("significantly_underdosed");

  const formIcon =
    item.form_quality === "preferred"
      ? { symbol: "check", color: "#2E7D32", label: "Preferred form" }
      : item.form_quality === "inferior"
        ? { symbol: "x", color: "#DC2626", label: "Inferior form" }
        : item.form_quality === "acceptable"
          ? { symbol: "minus", color: "#F59E0B", label: "Acceptable form" }
          : null;

  const benefits = item.database_match?.key_benefits;

  return (
    <div
      className="rounded-xl border border-border bg-white overflow-hidden transition-all duration-200 cursor-pointer hover:shadow-sm"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-text">{item.ingredient_name}</span>
            {isFairyDusted && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Fairy Dusted</span>
            )}
            {isUnderdosed && !isFairyDusted && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Underdosed</span>
            )}
            {!isFairyDusted && !isUnderdosed && pct >= 100 && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Clinical Dose</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {formIcon && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${formIcon.color}15` }}
                title={formIcon.label}
              >
                {formIcon.symbol === "check" && (
                  <svg className="w-3 h-3" style={{ color: formIcon.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {formIcon.symbol === "x" && (
                  <svg className="w-3 h-3" style={{ color: formIcon.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {formIcon.symbol === "minus" && (
                  <svg className="w-3 h-3" style={{ color: formIcon.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                  </svg>
                )}
              </div>
            )}
            <svg
              className={`w-4 h-4 text-text-dim transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 rounded-full bg-cream overflow-hidden">
            <div className="h-full rounded-full animate-fill" style={{ width: `${pct}%`, backgroundColor: barColor }} />
          </div>
          <div className="text-xs text-text-muted whitespace-nowrap font-mono">
            {item.dose_mg > 0 ? formatDose(item.dose_mg) : "?"} / {formatDose(item.clinical_optimal_mg)}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border-light pt-3 space-y-3 bg-cream-light">
          {benefits && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold text-text-dim uppercase tracking-wider shrink-0 w-20">Benefits:</span>
              <p className="text-xs text-text-secondary">{benefits}</p>
            </div>
          )}
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-text-dim uppercase tracking-wider shrink-0 w-20">Dose:</span>
            <p className="text-xs text-text-secondary">{getDoseExplanation(item)}</p>
          </div>
          {getFormExplanation(item) && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold text-text-dim uppercase tracking-wider shrink-0 w-20">Form:</span>
              <p className="text-xs text-text-secondary">{getFormExplanation(item)}</p>
            </div>
          )}
          {item.database_match && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold text-text-dim uppercase tracking-wider shrink-0 w-20">Evidence:</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map((dot) => (
                    <div
                      key={dot}
                      className={`w-2 h-2 rounded-full ${
                        dot <= (item.database_match?.evidence_strength === "very_strong" ? 4 : item.database_match?.evidence_strength === "strong" ? 3 : item.database_match?.evidence_strength === "moderate" ? 2 : 1)
                          ? "bg-dog" : "bg-cream-dark"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-text-dim capitalize">{item.database_match.evidence_strength?.replace("_", " ")}</span>
              </div>
            </div>
          )}
          {item.notes.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold text-text-dim uppercase tracking-wider shrink-0 w-20">Notes:</span>
              <div className="space-y-1">
                {item.notes.map((note, i) => (
                  <p key={i} className="text-xs text-text-secondary italic">{note}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
