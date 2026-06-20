"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n";

type PublicCustomerShellProps = {
  locale: Locale;
  brandName: string;
  children: ReactNode;
};

export function PublicCustomerShell({
  locale,
  brandName,
  children,
}: PublicCustomerShellProps) {
  const pathname = usePathname();
  // Suppress the navbar for the invite experience so guests get a
  // full-screen immersive flow. All other customer routes keep the header.
  const hideHeader = pathname?.startsWith("/invite/") ?? false;

  return (
    <>
      {!hideHeader && (
        <header className="sticky top-0 z-40 w-full border-b border-brand-border/50 bg-brand-bg/90 backdrop-blur-[var(--glass-blur)]">
          <Container className="flex h-16 items-center justify-between gap-4">
            <Link
              href="/"
              aria-label={brandName}
              className="font-bold tracking-wide text-brand-secondary transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
              style={{
                fontFamily: "var(--font-display-ar), var(--font-display), serif",
              }}
            >
              {brandName}
            </Link>
            <LanguageToggle currentLocale={locale} />
          </Container>
        </header>
      )}
      <div className="flex flex-1 flex-col">{children}</div>
    </>
  );
}
