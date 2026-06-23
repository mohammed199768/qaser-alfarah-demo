import React from "react";

export type PremiumSvgLoaderProps = {
  label?: string | undefined;
  sublabel?: string | undefined;
  progress?: { done: number; total: number } | undefined;
  variant?: "page" | "modal" | "inline" | undefined;
};

export default function PremiumSvgLoader({
  label,
  sublabel,
  progress,
  variant = "modal",
}: PremiumSvgLoaderProps) {
  // Variant styles
  const isInline = variant === "inline";
  const containerClass = isInline
    ? "flex flex-col items-center justify-center gap-3 p-4"
    : "flex flex-col items-center justify-center gap-5 p-8 w-full h-full min-h-[40vh]";

  // Subtle colors from luxury palette
  const accentColor = "oklch(0.84 0.10 82)"; // champagne gold
  const trackColor = "rgba(255, 255, 255, 0.08)";
  const textColor = "oklch(0.96 0.012 84)"; // warm ivory
  const subtextColor = "oklch(0.86 0.04 82 / 0.7)";

  return (
    <div
      role="status"
      aria-live="polite"
      className={containerClass}
      style={{ color: textColor }}
    >
      <div className={`relative flex items-center justify-center ${isInline ? "size-12" : "size-16 sm:size-20"}`}>
        {/* Outer animated ring */}
        <svg
          className="absolute inset-0 size-full motion-safe:animate-[spin_3s_linear_infinite]"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="46" stroke={trackColor} strokeWidth={isInline ? "3" : "2"} />
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke={accentColor}
            strokeWidth={isInline ? "3" : "2"}
            strokeDasharray="60 220"
            strokeLinecap="round"
            className="motion-reduce:hidden"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke={accentColor}
            strokeWidth={isInline ? "3" : "2"}
            strokeDasharray="20 260"
            strokeDashoffset="140"
            strokeLinecap="round"
            className="motion-reduce:hidden opacity-50"
          />
        </svg>

        {/* Inner pulsing icon - minimalist book/page flip motif */}
        <div className="absolute inset-0 flex items-center justify-center motion-safe:animate-pulse">
          <svg
            width={isInline ? "20" : "28"}
            height={isInline ? "20" : "28"}
            viewBox="0 0 24 24"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Minimalist open book path */}
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H12v20H6.5a2.5 2.5 0 0 1 0-5H12" />
            <path d="M20 19.5v-15A2.5 2.5 0 0 0 17.5 2H12v20h5.5a2.5 2.5 0 0 0 0-5H12" />
          </svg>
        </div>
      </div>

      {(label || sublabel || progress) && (
        <div className="flex flex-col items-center gap-1.5 text-center">
          {label && (
            <p
              className={`${isInline ? "text-xs" : "text-sm sm:text-base"} font-medium tracking-wide`}
              style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
            >
              {label}
            </p>
          )}
          {sublabel && (
            <p
              className={`${isInline ? "text-[10px]" : "text-xs sm:text-sm"}`}
              style={{ color: subtextColor }}
            >
              {sublabel}
            </p>
          )}
          {progress && (
            <p
              className={`${isInline ? "text-[10px]" : "text-xs sm:text-sm"}`}
              style={{ color: subtextColor }}
            >
              {progress.done} / {progress.total}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
