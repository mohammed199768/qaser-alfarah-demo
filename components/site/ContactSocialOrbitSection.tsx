"use client";

import { socialOrbitLinks, type SocialOrbitLink } from "@/content/site/socialLinks";

// ─── Inline SVG icons (no packages) ──────────────────────────────────────────

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7">
      <defs>
        <linearGradient id="cso-ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#cso-ig-grad)" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.5" stroke="url(#cso-ig-grad)" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1" fill="url(#cso-ig-grad)" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7">
      <path
        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
        stroke="#1877F2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.32 2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
        fill="#22c55e"
      />
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.962-1.406A9.944 9.944 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMaps() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        stroke="#C9A84C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9" r="2.5" stroke="#C9A84C" strokeWidth="2" />
    </svg>
  );
}

const ICON_MAP: Record<SocialOrbitLink["id"], React.ReactNode> = {
  instagram: <IconInstagram />,
  facebook:  <IconFacebook />,
  phone:     <IconPhone />,
  whatsapp:  <IconWhatsApp />,
  maps:      <IconMaps />,
};

// ─── Shared disabled styles ───────────────────────────────────────────────────

const disabledIconStyle: React.CSSProperties = {
  background: "oklch(0.95 0.004 80)",
  border: "1.5px solid oklch(0.88 0.008 80 / 55%)",
  opacity: 0.55,
};

const disabledLabelStyle: React.CSSProperties = {
  color: "oklch(0.68 0.010 65)",
};

// ─── Orbit positions ──────────────────────────────────────────────────────────

const ITEM_COUNT = 5;
const ANGLES = Array.from({ length: ITEM_COUNT }, (_, i) => (360 / ITEM_COUNT) * i);

// ─── Accessible fallback link list ───────────────────────────────────────────

function ContactLinkList({ hasAnyPlaceholder }: { hasAnyPlaceholder: boolean }) {
  return (
    <div className="mt-14 max-w-3xl mx-auto space-y-3">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        role="list"
        aria-label="قنوات التواصل"
      >
        {socialOrbitLinks.map((link) => {
          if (link.placeholder) {
            return (
              <span
                key={link.id}
                role="listitem"
                aria-disabled="true"
                className="flex items-center gap-4 rounded-2xl px-5 py-4 cursor-not-allowed select-none"
                style={{
                  background: "oklch(0.97 0.003 82)",
                  border: "1px solid oklch(0.90 0.008 80 / 45%)",
                  opacity: 0.60,
                }}
              >
                <span
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full"
                  style={disabledIconStyle}
                >
                  {ICON_MAP[link.id]}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold" style={disabledLabelStyle}>
                    {link.labelAr}
                  </span>
                  <span
                    className="text-[0.58rem] font-medium tracking-wide"
                    style={{ color: "oklch(0.72 0.05 76)" }}
                  >
                    قريبًا
                  </span>
                </div>
              </span>
            );
          }

          return (
            <a
              key={link.id}
              href={link.href}
              aria-label={link.ariaLabel}
              role="listitem"
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "oklch(0.99 0.005 84)",
                border: "1px solid oklch(0.88 0.014 82 / 55%)",
                boxShadow: "0 2px 12px oklch(0.76 0.10 82 / 7%)",
              }}
            >
              <span
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: "oklch(0.97 0.010 83)",
                  border: "1.5px solid oklch(0.85 0.030 80)",
                }}
              >
                {ICON_MAP[link.id]}
              </span>
              <span className="text-sm font-semibold" style={{ color: "oklch(0.30 0.025 62)" }}>
                {link.labelAr}
              </span>
              <span
                className="ms-auto text-xs transition-transform duration-300 group-hover:-translate-x-0.5"
                style={{ color: "oklch(0.65 0.06 76)" }}
                aria-hidden="true"
              >
                ←
              </span>
            </a>
          );
        })}
      </div>

      {/* Quiet notice shown only when at least one link is a placeholder */}
      {hasAnyPlaceholder && (
        <p
          className="text-center text-[0.62rem] pt-2"
          style={{ color: "oklch(0.68 0.04 72)" }}
        >
          سيتم تحديث روابط التواصل الرسمية قريبًا
        </p>
      )}
    </div>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function ContactSocialOrbitSection() {
  const hasAnyPlaceholder = socialOrbitLinks.some((l) => l.placeholder);

  return (
    <section
      aria-labelledby="contact-orbit-heading"
      dir="rtl"
      className="relative w-full overflow-x-hidden py-16 sm:py-24"
      style={{
        background:
          "radial-gradient(ellipse 65% 55% at 50% 40%, oklch(0.96 0.018 80 / 0.50) 0%, transparent 80%), oklch(0.99 0.006 84)",
      }}
    >
      {/* Top border */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, oklch(0.76 0.10 82 / 28%), transparent)" }}
        aria-hidden="true"
      />

      {/* Section heading */}
      <div className="mx-auto mb-14 max-w-xl px-4 text-center">
        <span
          className="inline-block mb-3 text-[0.62rem] font-bold tracking-[0.28em] uppercase"
          style={{ color: "oklch(0.58 0.09 78)" }}
        >
          تواصل معنا
        </span>
        <h2
          id="contact-orbit-heading"
          className="mb-3 text-3xl font-bold tracking-wide sm:text-4xl"
          style={{
            fontFamily: "var(--font-display-ar), var(--font-display), serif",
            color: "oklch(0.22 0.02 58)",
          }}
        >
          تواصل مع قصر الفرح
        </h2>
        <p className="text-sm leading-relaxed sm:text-base" style={{ color: "oklch(0.50 0.01 58)" }}>
          اختر الطريقة الأنسب للتواصل معنا أو الوصول إلى موقع القاعة.
        </p>
      </div>

      {/* Orbit */}
      <div className="flex items-center justify-center px-4">
        <div
          className="cso-orbit-spin relative rounded-full border border-[oklch(0.84_0.035_80)]"
          style={{
            width: "clamp(260px, 55vw, 440px)",
            height: "clamp(260px, 55vw, 440px)",
            animation: "csoOrbitSpin 32s linear infinite",
          }}
        >
          {/* Center label */}
          <div
            className="cso-counter absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ animation: "csoCounterSpin 32s linear infinite" }}
          >
            <span
              className="text-lg font-bold sm:text-xl"
              style={{
                fontFamily: "var(--font-display-ar), var(--font-display), serif",
                color: "oklch(0.22 0.02 58)",
              }}
            >
              تواصل معنا
            </span>
            <span className="mt-1 text-[0.6rem] tracking-widest uppercase" style={{ color: "oklch(0.70 0.08 78)" }}>
              Qasr Al-Farah
            </span>
          </div>

          {/* Orbit items */}
          {socialOrbitLinks.map((link, index) => {
            const angleDeg = ANGLES[index] ?? (360 / ITEM_COUNT) * index;
            const angleRad = (angleDeg * Math.PI) / 180;
            const radiusPct = 50;
            const cx = 50 + radiusPct * Math.sin(angleRad);
            const cy = 50 - radiusPct * Math.cos(angleRad);

            const positionStyle: React.CSSProperties = {
              left: `${cx}%`,
              top: `${cy}%`,
              transform: "translate(-50%, -50%)",
              animation: "csoCounterSpin 32s linear infinite",
            };

            if (link.placeholder) {
              return (
                <span
                  key={link.id}
                  aria-disabled="true"
                  aria-label={`${link.labelAr} — قريبًا`}
                  className="cso-counter absolute flex flex-col items-center gap-1 cursor-not-allowed"
                  style={positionStyle}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14"
                    style={disabledIconStyle}
                  >
                    {ICON_MAP[link.id]}
                  </span>
                  <span
                    className="whitespace-nowrap text-[10px] font-medium sm:text-xs"
                    style={disabledLabelStyle}
                  >
                    {link.labelAr}
                  </span>
                </span>
              );
            }

            return (
              <a
                key={link.id}
                href={link.href}
                aria-label={link.ariaLabel}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="cso-counter absolute flex flex-col items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.76_0.10_82)] focus-visible:ring-offset-2"
                style={positionStyle}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-transform duration-300 hover:scale-110 sm:h-14 sm:w-14"
                  style={{
                    background: "oklch(0.99 0.005 84)",
                    border: "1.5px solid oklch(0.85 0.035 80)",
                    boxShadow: "0 2px 10px oklch(0.76 0.10 82 / 10%)",
                  }}
                >
                  {ICON_MAP[link.id]}
                </span>
                <span
                  className="whitespace-nowrap text-[10px] font-medium sm:text-xs"
                  style={{ color: "oklch(0.46 0.04 68)" }}
                >
                  {link.labelAr}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Accessible fallback link grid */}
      <div className="px-4">
        <ContactLinkList hasAnyPlaceholder={hasAnyPlaceholder} />
      </div>

      {/* Keyframes + reduced-motion */}
      <style>{`
        @keyframes csoOrbitSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes csoCounterSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cso-orbit-spin { animation: none !important; }
          .cso-counter    {
            animation: none !important;
            transform: translate(-50%, -50%) !important;
          }
        }
      `}</style>
    </section>
  );
}
