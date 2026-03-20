"use client";

export function GradeBadge({
  grade,
  color,
  size = "lg",
}: {
  grade: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "w-10 h-10 text-sm",
    md: "w-14 h-14 text-xl",
    lg: "w-24 h-24 text-4xl",
    xl: "w-32 h-32 text-5xl",
  };

  return (
    <div className="relative inline-flex">
      <div
        className="absolute inset-0 rounded-full blur-lg opacity-20"
        style={{ backgroundColor: color }}
      />
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-display text-white relative z-10 shadow-lg`}
        style={{ backgroundColor: color }}
      >
        {grade}
      </div>
    </div>
  );
}
