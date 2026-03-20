"use client";

import type { IngredientScore } from "@/lib/scoring-engine";

export function IngredientRow({ item }: { item: IngredientScore }) {
  const pct = Math.min(item.dose_percentage, 100);
  const barColor =
    pct >= 75
      ? "#2E7D32"
      : pct >= 50
        ? "#F9A825"
        : pct >= 25
          ? "#EF6C00"
          : "#B71C1C";

  const formIcon =
    item.form_quality === "preferred"
      ? "✅"
      : item.form_quality === "inferior"
        ? "❌"
        : item.form_quality === "acceptable"
          ? "⚠️"
          : "—";

  const isFairyDusted = item.flags.includes("fairy_dusted");
  const isUnderdosed =
    item.flags.includes("underdosed") ||
    item.flags.includes("significantly_underdosed");

  return (
    <div className="py-3 border-b border-cream-dark/50 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{item.ingredient_name}</span>
          {isFairyDusted && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              Fairy Dusted
            </span>
          )}
          {isUnderdosed && !isFairyDusted && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
              Underdosed
            </span>
          )}
        </div>
        <span className="text-xs" title="Form quality">
          {formIcon}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-cream-dark overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        </div>
        <div className="text-xs text-navy/50 whitespace-nowrap w-36 text-right">
          {item.dose_mg > 0 ? `${formatDose(item.dose_mg)}` : "?"} /{" "}
          {formatDose(item.clinical_optimal_mg)} mg target
        </div>
      </div>
      {item.notes.length > 0 && (
        <div className="mt-1 text-xs text-navy/40 italic">
          {item.notes.join(" · ")}
        </div>
      )}
    </div>
  );
}

function formatDose(mg: number): string {
  if (mg >= 1000) return `${(mg / 1000).toFixed(mg % 1000 === 0 ? 0 : 1)}g`;
  if (mg < 1) return `${(mg * 1000).toFixed(0)}mcg`;
  return `${mg}mg`;
}
