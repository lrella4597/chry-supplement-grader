"use client";

export function CategoryBar({
  label,
  score,
  max,
}: {
  label: string;
  score: number;
  max: number;
}) {
  const pct = Math.round((score / max) * 100);
  const color =
    pct >= 80
      ? "#2E7D32"
      : pct >= 60
        ? "#689F38"
        : pct >= 40
          ? "#F9A825"
          : pct >= 20
            ? "#EF6C00"
            : "#B71C1C";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-navy/50">
          {score.toFixed(1)} / {max}
        </span>
      </div>
      <div className="h-3 rounded-full bg-cream-dark overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
