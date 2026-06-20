"use client";

import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface LanguageToggleProps {
  currentLocale: Locale;
}

export function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const router = useRouter();

  const toggleLanguage = () => {
    const newLocale: Locale = currentLocale === "ar" ? "en" : "ar";
    // Set cookie that lasts for 1 year
    document.cookie = `app_locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    // Force a full refresh to re-run server layouts and data fetching
    router.refresh();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex h-11 items-center gap-2 rounded-full border border-white/55 bg-white/48 px-3 text-sm font-semibold text-brand-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_5px_16px_rgba(62,52,37,0.08)] backdrop-blur-[14px] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/68 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
      aria-label="Toggle Language"
    >
      <Globe size={16} className="text-brand-primary" />
      <span>{currentLocale === "ar" ? "English" : "عربي"}</span>
    </button>
  );
}
