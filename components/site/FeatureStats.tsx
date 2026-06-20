import type { Locale } from "@/lib/i18n";
import { getContent } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/ui/Icon";

export default function FeatureStats({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const highlights = content.home.highlights;

  return (
    <section
      className="relative z-30 -mt-16 pb-6"
      aria-label="Feature highlights"
    >
      {/* Subtle top gradient connector */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0 0 0 / 0%) 0%, oklch(0.99 0.006 84 / 0%) 100%)",
        }}
        aria-hidden="true"
      />

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {highlights.map((item, i) => (
            <GlassPanel
              key={i}
              className="luxury-card group relative overflow-hidden p-6 flex flex-col items-start gap-4"
            >
              {/* Ambient top-left glow that intensifies on hover */}
              <div
                className="absolute -top-8 -start-8 size-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.76 0.10 82 / 22%) 0%, transparent 70%)",
                  filter: "blur(16px)",
                }}
                aria-hidden="true"
              />

              {/* Gold top accent line — reveals on hover */}
              <div
                className="absolute top-0 inset-x-0 h-[2px] rounded-t-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background:
                    "linear-gradient(to right, transparent 0%, oklch(0.76 0.10 82 / 60%) 50%, transparent 100%)",
                }}
                aria-hidden="true"
              />

              {/* Premium icon container */}
              <div
                className="relative flex items-center justify-center size-12 rounded-full text-brand-primary ring-1 ring-brand-primary/15 transition-transform duration-400 group-hover:scale-110"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.76 0.10 82 / 16%) 0%, oklch(0.76 0.10 82 / 7%) 100%)",
                }}
              >
                <Icon name={item.icon} className="size-5" />
              </div>

              <div className="space-y-1.5 relative z-10">
                <h3 className="font-semibold text-base text-brand-fg leading-snug group-hover:text-brand-secondary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-brand-muted-fg leading-relaxed">
                  {item.text}
                </p>
              </div>

              {/* Subtle bottom-right decorative dot */}
              <div
                className="absolute bottom-4 end-4 size-1.5 rounded-full opacity-30 group-hover:opacity-70 transition-opacity duration-400"
                style={{ background: "oklch(0.76 0.10 82)" }}
                aria-hidden="true"
              />
            </GlassPanel>
          ))}
        </div>
      </Container>
    </section>
  );
}
