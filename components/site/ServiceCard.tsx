import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { ServiceItem } from "@/types/site-content";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export default function ServiceCard({ item, locale }: { item: ServiceItem; locale: Locale }) {
  return (
    <Card className="luxury-card group relative flex flex-col overflow-hidden border-brand-border/70">
      {/* ── Icon banner ── */}
      <div
        className="relative h-36 w-full overflow-hidden border-b border-brand-border/50 shrink-0"
        style={{
          background: "linear-gradient(135deg, oklch(0.97 0.022 84) 0%, oklch(0.93 0.032 80) 100%)",
        }}
        aria-hidden="true"
      >
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(oklch(0.32 0.02 58) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Ambient glow behind icon — animates on card hover */}
        <div
          className="brand-orb absolute inset-0 m-auto size-20 opacity-40 group-hover:opacity-70 group-hover:scale-125 transition-all duration-600"
          style={{ background: "oklch(0.80 0.10 82)" }}
        />

        {/* Orbiting ring decoration */}
        <div
          className="absolute inset-0 m-auto size-16 rounded-full border border-brand-primary/15 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700"
          aria-hidden="true"
        />

        {/* Service icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative flex items-center justify-center size-14 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{
              background: "linear-gradient(135deg, oklch(0.97 0.018 84), oklch(0.93 0.030 80))",
              boxShadow: "0 4px 16px oklch(0.76 0.10 82 / 20%), inset 0 1px 0 rgba(255,255,255,0.8)",
              border: "1px solid oklch(0.76 0.10 82 / 18%)",
            }}
          >
            <Icon
              name={item.icon ?? "Heart"}
              className="size-6 text-brand-primary transition-all duration-500 group-hover:text-brand-primary"
            />
          </div>
        </div>

        {/* Category number tag */}
        <div
          className="absolute top-3 end-3 text-[0.6rem] font-bold tracking-widest opacity-30 group-hover:opacity-60 transition-opacity duration-300"
          style={{ color: "oklch(0.30 0.02 58)" }}
        >
          {item.id?.toString().padStart(2, "0") ?? ""}
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Service name */}
        <h3
          className="font-bold text-base text-brand-fg leading-snug mb-2.5 transition-colors duration-300 group-hover:text-brand-secondary"
          style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
        >
          {item.name[locale]}
        </h3>

        {/* Micro gold rule */}
        <div
          className="w-8 h-0.5 rounded-full mb-3.5 transition-all duration-500 group-hover:w-14"
          style={{ background: "oklch(0.76 0.10 82 / 45%)" }}
          aria-hidden="true"
        />

        <p className="text-brand-muted-fg text-sm mb-5 flex-1 leading-relaxed">
          {item.description[locale]}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-brand-border/40">
          {item.priceHint && (
            <span
              className="inline-flex items-center text-xs font-semibold tracking-wide text-brand-primary px-2.5 py-1 rounded-full"
              style={{
                background: "oklch(0.76 0.10 82 / 9%)",
                border: "1px solid oklch(0.76 0.10 82 / 18%)",
              }}
            >
              {item.priceHint[locale]}
            </span>
          )}
          {item.cta && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="ms-auto group/btn gap-1.5 text-brand-muted-fg hover:text-brand-primary transition-colors duration-300"
            >
              <Link href={item.cta.href}>
                {item.cta.label[locale]}
                <span
                  className="inline-block transition-transform duration-300 group-hover/btn:translate-x-0.5"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Bottom gold accent — reveals on hover */}
      <div
        className="absolute bottom-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, oklch(0.76 0.10 82 / 55%) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />
    </Card>
  );
}
