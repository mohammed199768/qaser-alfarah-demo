"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarCheck,
  Image as ImageIcon,
  MessageCircle,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

export type DockItem = {
  href: string;
  label: string;
  icon: "home" | "services" | "gallery" | "booking" | "contact";
};

const ICONS: Record<DockItem["icon"], LucideIcon> = {
  home: Home,
  services: ListChecks,
  gallery: ImageIcon,
  booking: CalendarCheck,
  contact: MessageCircle,
};

interface MobileBottomDockProps {
  items: DockItem[];
  navLabel: string;
}

/**
 * App-like bottom navigation dock for tablet and mobile (hidden on desktop,
 * which keeps the premium top navbar). CSS-only transitions — framer-motion is
 * not installed and was intentionally not added. Reduced-motion safe: the only
 * motion is a small lift/scale governed by `transition` utilities, which the
 * global `prefers-reduced-motion` rule already neutralizes.
 */
export default function MobileBottomDock({ items, navLabel }: MobileBottomDockProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={navLabel}
      className="mobile-dock pointer-events-none fixed inset-x-0 bottom-0 z-[48] flex justify-center px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden"
    >
      <ul
        className="pointer-events-auto flex w-full max-w-md items-stretch justify-between gap-1 rounded-[1.75rem] border px-2 py-2 shadow-[0_10px_34px_rgba(62,52,37,0.16),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(1 0 0 / 0.86), oklch(0.98 0.012 82 / 0.74))",
          borderColor: "oklch(0.76 0.10 82 / 0.28)",
        }}
      >
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[1.3rem] px-1 py-1.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg ${
                  active
                    ? "text-brand-secondary"
                    : "text-brand-muted-fg hover:text-brand-secondary"
                }`}
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-full border transition-all duration-300 ${
                    active
                      ? "scale-105 border-transparent text-brand-secondary shadow-[0_8px_20px_oklch(0.76_0.10_82_/_30%)]"
                      : "border-transparent text-brand-primary group-hover:-translate-y-0.5"
                  }`}
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.84 0.10 82) 0%, oklch(0.70 0.12 76) 100%)",
                        }
                      : undefined
                  }
                >
                  <Icon
                    aria-hidden="true"
                    className="size-[1.15rem] transition-transform duration-300 group-hover:scale-110"
                  />
                </span>
                <span className="text-[0.62rem] font-semibold leading-none tracking-wide">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
