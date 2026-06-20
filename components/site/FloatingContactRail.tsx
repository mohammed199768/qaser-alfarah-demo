import { getSiteConfig } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

const AMMAN_MAPS_FALLBACK =
  "https://www.google.com/maps/search/?api=1&query=Amman%2C%20Jordan";

const QUICK_LINK_ARIA_LABEL = "روابط التواصل السريعة";

type FloatingLink = {
  id: "whatsapp" | "maps" | "instagram" | "facebook";
  href: string;
  label: string;
  icon: string;
};

export default function FloatingContactRail() {
  const config = getSiteConfig();

  // TODO(final-link-review): replace placeholder-like social handles and the
  // generic Amman maps search with verified production venue links.
  const links: FloatingLink[] = [
    {
      id: "whatsapp",
      href: `https://wa.me/${config.whatsappNumber}`,
      label: "تواصل عبر واتساب",
      icon: "MessageCircle",
    },
    {
      id: "maps",
      href: AMMAN_MAPS_FALLBACK,
      label: "افتح الموقع على خرائط جوجل",
      icon: "MapPin",
    },
    {
      id: "instagram",
      href: config.social.instagram ?? "https://www.instagram.com/YOUR_PAGE",
      label: "افتح إنستغرام",
      icon: "Instagram",
    },
    {
      id: "facebook",
      href: config.social.facebook ?? "https://www.facebook.com/YOUR_PAGE",
      label: "افتح فيسبوك",
      icon: "Facebook",
    },
  ];

  return (
    <nav
      aria-label={QUICK_LINK_ARIA_LABEL}
      className="pointer-events-none fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[45] flex justify-center md:inset-x-auto md:bottom-auto md:right-4 md:top-[58%] md:-translate-y-1/2 md:justify-start"
    >
      <div
        className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full border px-2 py-2 shadow-[var(--brand-shadow-warm)] backdrop-blur-xl md:flex-col"
        style={{
          background:
            "linear-gradient(135deg, oklch(1 0 0 / 0.80), oklch(0.98 0.012 82 / 0.66))",
          borderColor: "var(--brand-border)",
        }}
      >
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            title={link.label}
            className="group flex size-11 shrink-0 items-center justify-center rounded-full border text-brand-muted-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:text-brand-primary hover:shadow-[0_10px_24px_oklch(0.76_0.10_82_/_24%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg sm:size-12"
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
