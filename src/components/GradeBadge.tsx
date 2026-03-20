"use client";

export function GradeBadge({
  grade,
  color,
  size = "lg",
}: {
  grade: string;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-10 h-10 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-24 h-24 text-4xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-extrabold text-white shadow-lg`}
      style={{ backgroundColor: color }}
    >
      {grade}
    </div>
  );
}
