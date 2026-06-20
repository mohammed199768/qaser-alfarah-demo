import type { ThemeConfig } from "@/types/site-content";

export const theme: ThemeConfig = {
  colors: {
    primary: "oklch(0.78 0.09 85)",
    secondary: "oklch(0.32 0.02 60)",
    accent: "oklch(0.86 0.05 20)",
    background: "oklch(0.99 0.005 85)",
    foreground: "oklch(0.24 0.01 60)",
    muted: "oklch(0.96 0.01 85)",
    mutedForeground: "oklch(0.55 0.01 60)",
    border: "oklch(0.90 0.01 85)",
  },
  fonts: {
    displayLatin: "var(--font-display)",
    bodyLatin: "var(--font-body)",
    displayArabic: "var(--font-display-ar)",
    bodyArabic: "var(--font-body-ar)",
  },
  radius: "0.75rem",
  shadow: "soft",
  glass: {
    blur: "16px",
    tint: "255 255 255",
    tintOpacity: 0.12,
    borderOpacity: 0.25,
    noise: false
  },
};
