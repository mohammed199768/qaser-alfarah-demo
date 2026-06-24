import { getSiteConfig } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

const AMMAN_MAPS_FALLBACK =
  "https://www.google.com/maps/search/?api=1&query=Amman%2C%20Jordan";

const QUICK_LINK_ARIA_LABEL = "روابط التواصل السريعة";

import { contactLinks } from "@/content/site/socialLinks";

export default function FloatingContactRail() {
  return (
    <nav
      aria-label={QUICK_LINK_ARIA_LABEL}
      className="pointer-events-none fixed end-2 top-[42%] z-[45] flex -translate-y-1/2 justify-end sm:end-3 md:top-[58%] lg:end-4"
    >
      <div
        className="pointer-events-auto flex max-w-full flex-col items-center gap-1.5 rounded-full border px-1.5 py-1.5 shadow-[var(--brand-shadow-warm)] backdrop-blur-xl sm:gap-2 sm:px-2 sm:py-2"
        style={{
          background:
            "linear-gradient(135deg, oklch(1 0 0 / 0.80), oklch(0.98 0.012 82 / 0.66))",
          borderColor: "var(--brand-border)",
        }}
      >
        {contactLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.labelAr}
            title={link.labelAr}
            className="group flex size-10 shrink-0 items-center justify-center rounded-full border text-brand-muted-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:text-brand-primary hover:shadow-[0_10px_24px_oklch(0.76_0.10_82_/_24%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg sm:size-11 lg:size-12"
            style={{
              background:
                "linear-gradient(135deg, oklch(1 0 0 / 0.84), oklch(0.98 0.012 82 / 0.72))",
              borderColor: "oklch(0.76 0.10 82 / 0.22)",
              boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.72)",
            }}
          >
            <Icon
              name={link.icon}
              className="size-5 transition-transform duration-300 group-hover:scale-110"
              style={{ color: "currentColor" }}
            />
          </a>
        ))}
      </div>
    </nav>
  );
}
