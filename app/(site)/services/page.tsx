import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarCheck, CheckCircle2, MessageCircle, Sparkles } from "lucide-react";
import { getLocale } from "@/lib/i18n";
import { getContent, getServices, getSiteConfig } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import ServicesMotionBridge from "@/components/site/ServicesMotionBridge";
import type { Locale } from "@/lib/i18n";
import type { ServiceItem } from "@/types/site-content";

type LocalizedText = Record<Locale, string>;
type LocalizedLines = Record<Locale, string[]>;

const pageCopy = {
  eyebrow: {
    ar: "خدمات قصر الفرح",
    en: "Qasr Al-Farah Services",
  },
  heroTitle: {
    ar: ["خدمات تُدار مثل المشهد الأول", "في ليلة لا تُعاد"],
    en: ["Wedding services staged", "for a night that stays"],
  },
  heroSubtitle: {
    ar: "رحلة كاملة داخل قاعة أفراح فاخرة: من لحظة الوصول والزفة إلى الضيافة والديكور والتوثيق، كل خدمة تتحرك بإيقاع واحد حتى يبقى الفرح هادئاً، أنيقاً، ومليئاً بالمعنى.",
    en: "A complete wedding hall journey: arrival, zaffa, hospitality, decor, and memories moving in one calm rhythm so the celebration feels elegant, effortless, and deeply personal.",
  },
  heroPrimary: {
    ar: "احجز موعد زيارة",
    en: "Book a hall visit",
  },
  heroSecondary: {
    ar: "ابدأ المشاهدة",
    en: "Begin the story",
  },
  sceneEyebrow: {
    ar: "مشهد الخدمة",
    en: "Service Scene",
  },
  sceneMeta: {
    ar: "ضمن تجربة قاعة الأفراح",
    en: "Inside the hall experience",
  },
  defaultServiceCta: {
    ar: "أضفها إلى يومك",
    en: "Add to your day",
  },
  finalEyebrow: {
    ar: "الخطوة التالية",
    en: "Next Step",
  },
  finalTitle: {
    ar: ["لنحوّل الخدمات", "إلى ليلة فرح كاملة"],
    en: ["Turn these services", "into one complete celebration"],
  },
  finalBody: {
    ar: "احجزوا موعد زيارة قصر الفرح، وشاهدوا كيف يمكن لكل مشهد من هذه الخدمات أن يأخذ مكانه في يومكم، من أول استقبال حتى آخر ذكرى.",
    en: "Book a visit to Qasr Al-Farah and see how each service can become part of your day, from the first welcome to the final memory.",
  },
  contact: {
    ar: "تواصل معنا",
    en: "Contact us",
  },
  closingNote: {
    ar: "تنظيم هادئ، حضور فاخر، وذكريات تبقى.",
    en: "Calm planning, luxurious presence, lasting memories.",
  },
};

const heroHighlights = [
  { value: { ar: "قاعة", en: "Hall" }, label: { ar: "استقبال وجلوس", en: "Guest flow" } },
  { value: { ar: "زفة", en: "Zaffa" }, label: { ar: "لحظة دخول", en: "Entrance moment" } },
  { value: { ar: "ضيافة", en: "Dining" }, label: { ar: "باقات مرنة", en: "Flexible hosting" } },
];

const heroFrames = [
  {
    src: "/site/gallery/hall-1.jpg",
    alt: { ar: "قاعة أفراح قصر الفرح", en: "Qasr Al-Farah wedding hall" },
    className: "left-[2%] top-[8%] h-[58%] w-[66%] -rotate-3",
  },
  {
    src: "/site/gallery/decor-1.jpg",
    alt: { ar: "كوشة وديكور حفل الزفاف", en: "Wedding stage and decor" },
    className: "right-[2%] top-[4%] h-[35%] w-[40%] rotate-6",
  },
  {
    src: "/site/gallery/food-1.jpg",
    alt: { ar: "ضيافة حفل الزفاف", en: "Wedding hospitality" },
    className: "right-[4%] bottom-[12%] h-[40%] w-[46%] rotate-3",
  },
  {
    src: "/site/gallery/couple-1.jpg",
    alt: { ar: "لحظة العروسين في قصر الفرح", en: "Wedding couple moment at Qasr Al-Farah" },
    className: "left-[20%] bottom-[2%] h-[34%] w-[44%] -rotate-6",
  },
];

const serviceFallbackImages: Record<string, string> = {
  hall: "/site/gallery/hall-1.jpg",
  zaffa: "/site/gallery/events-1.jpg",
  food: "/site/gallery/food-1.jpg",
  photography: "/site/gallery/couple-1.jpg",
  decoration: "/site/gallery/decor-1.jpg",
  lighting: "/site/hero.jpg",
  dj: "/site/gallery/events-1.jpg",
  car: "/site/gallery/hall-1.jpg",
  "memory-book": "/site/og-image.jpg",
};

/* ----------------------------------------------------------------------------
 * Visual world model
 * Each service gets its own art direction: mood, palette, scenery, composition,
 * and motion intensity. Consumed by the panel markup below and (through data
 * attributes) by ServicesMotionBridge.
 * -------------------------------------------------------------------------- */

type WorldTone = "dark" | "light";

type ServiceWorld = {
  /** short cinematic label shown in the panel kicker */
  mood: LocalizedText;
  /** internal note about the spatial metaphor */
  metaphor: string;
  tone: WorldTone;
  /** primary accent color of this world */
  accent: string;
  /** secondary glow color of this world */
  glow: string;
  /** panel base gradient that sits behind the photo */
  base: string;
  /** directional wash over the photo, `{dir}` is replaced per locale */
  wash: string;
  /** how strongly the photo shows through the world */
  imageOpacity: number;
  /** media card silhouette */
  mediaClass: string;
  /** which side the media object lives on (reading-direction aware) */
  mediaPos: "start" | "end";
  /** vertical rhythm of the composition */
  align: "center" | "end";
  /** motion intensity multiplier used by the motion bridge */
  intensity: number;
};

function alpha(color: string, value: number) {
  return color.replace(")", ` / ${value})`);
}

const hallWorld: ServiceWorld = {
  mood: { ar: "بهو القصر الكبير", en: "The grand palace hall" },
  metaphor: "grand ballroom / palace hall",
  tone: "dark",
  accent: "oklch(0.80 0.11 82)",
  glow: "oklch(0.90 0.06 84)",
  base: "linear-gradient(180deg, oklch(0.17 0.022 72) 0%, oklch(0.24 0.034 78) 52%, oklch(0.13 0.018 66) 100%)",
  wash: "linear-gradient({dir}, oklch(0.13 0.020 70 / 0.88) 0%, oklch(0.17 0.026 74 / 0.62) 42%, oklch(0.32 0.050 80 / 0.34) 100%)",
  imageOpacity: 0.82,
  mediaClass: "rounded-t-[8rem] rounded-b-2xl min-h-[24rem] lg:min-h-[36rem]",
  mediaPos: "end",
  align: "center",
  intensity: 1,
};

const serviceWorlds: Record<string, ServiceWorld> = {
  hall: hallWorld,
  zaffa: {
    mood: { ar: "مسار الدخلة", en: "The ceremonial path" },
    metaphor: "entrance procession / ceremonial aisle",
    tone: "dark",
    accent: "oklch(0.84 0.09 70)",
    glow: "oklch(0.86 0.05 20)",
    base: "linear-gradient(160deg, oklch(0.15 0.024 40) 0%, oklch(0.21 0.034 56) 50%, oklch(0.12 0.020 34) 100%)",
    wash: "linear-gradient({dir}, oklch(0.12 0.022 40 / 0.90) 0%, oklch(0.18 0.030 50 / 0.58) 46%, oklch(0.40 0.060 66 / 0.30) 100%)",
    imageOpacity: 0.8,
    mediaClass: "rounded-2xl min-h-[24rem] -rotate-2 lg:min-h-[32rem]",
    mediaPos: "start",
    align: "center",
    intensity: 1.2,
  },
  food: {
    mood: { ar: "مائدة الضيافة", en: "The banquet table" },
    metaphor: "hospitality table / banquet warmth",
    tone: "dark",
    accent: "oklch(0.72 0.10 55)",
    glow: "oklch(0.92 0.05 75)",
    base: "linear-gradient(180deg, oklch(0.19 0.028 52) 0%, oklch(0.26 0.040 60) 56%, oklch(0.15 0.024 48) 100%)",
    wash: "linear-gradient({dir}, oklch(0.14 0.026 50 / 0.88) 0%, oklch(0.20 0.034 56 / 0.58) 44%, oklch(0.45 0.070 62 / 0.30) 100%)",
    imageOpacity: 0.85,
    mediaClass: "rounded-2xl min-h-[18rem] lg:min-h-[24rem] lg:self-end lg:mb-24",
    mediaPos: "end",
    align: "end",
    intensity: 0.8,
  },
  photography: {
    mood: { ar: "داخل الإطار", en: "Inside the frame" },
    metaphor: "captured moments / camera viewfinder",
    tone: "dark",
    accent: "oklch(0.86 0.03 84)",
    glow: "oklch(0.97 0.01 84)",
    base: "linear-gradient(180deg, oklch(0.15 0.008 260) 0%, oklch(0.21 0.012 270) 54%, oklch(0.12 0.008 250) 100%)",
    wash: "linear-gradient({dir}, oklch(0.11 0.010 260 / 0.90) 0%, oklch(0.16 0.012 264 / 0.62) 44%, oklch(0.30 0.020 268 / 0.34) 100%)",
    imageOpacity: 0.85,
    mediaClass: "rounded-lg border-[6px] min-h-[24rem] lg:min-h-[34rem]",
    mediaPos: "start",
    align: "center",
    intensity: 1.1,
  },
  decoration: {
    mood: { ar: "مسرح الزهور", en: "The floral stage" },
    metaphor: "kosha / floral romantic symmetry",
    tone: "dark",
    accent: "oklch(0.82 0.06 20)",
    glow: "oklch(0.92 0.04 16)",
    base: "linear-gradient(170deg, oklch(0.20 0.026 18) 0%, oklch(0.27 0.034 26) 52%, oklch(0.16 0.022 14) 100%)",
    wash: "linear-gradient({dir}, oklch(0.15 0.024 18 / 0.88) 0%, oklch(0.21 0.030 22 / 0.58) 44%, oklch(0.48 0.050 26 / 0.30) 100%)",
    imageOpacity: 0.82,
    mediaClass: "rounded-t-full rounded-b-3xl min-h-[26rem] lg:min-h-[36rem]",
    mediaPos: "end",
    align: "center",
    intensity: 0.9,
  },
  lighting: {
    mood: { ar: "لحظة الضوء", en: "The light cue" },
    metaphor: "stage lighting control / beams and haze",
    tone: "dark",
    accent: "oklch(0.82 0.12 75)",
    glow: "oklch(0.75 0.06 250)",
    base: "linear-gradient(180deg, oklch(0.10 0.012 70) 0%, oklch(0.15 0.018 76) 56%, oklch(0.08 0.010 60) 100%)",
    wash: "linear-gradient({dir}, oklch(0.08 0.012 70 / 0.92) 0%, oklch(0.12 0.016 74 / 0.66) 46%, oklch(0.26 0.040 78 / 0.36) 100%)",
    imageOpacity: 0.72,
    mediaClass: "rounded-xl min-h-[20rem] lg:min-h-[28rem] lg:mt-16",
    mediaPos: "start",
    align: "center",
    intensity: 1.3,
  },
  dj: {
    mood: { ar: "إيقاع السهرة", en: "The night's rhythm" },
    metaphor: "sound and celebration / circular rhythm",
    tone: "dark",
    accent: "oklch(0.82 0.10 80)",
    glow: "oklch(0.55 0.10 320)",
    base: "linear-gradient(200deg, oklch(0.14 0.024 320) 0%, oklch(0.18 0.028 340) 50%, oklch(0.10 0.018 310) 100%)",
    wash: "linear-gradient({dir}, oklch(0.10 0.020 320 / 0.90) 0%, oklch(0.15 0.026 330 / 0.62) 44%, oklch(0.32 0.050 340 / 0.34) 100%)",
    imageOpacity: 0.78,
    mediaClass: "rounded-[2.5rem] min-h-[24rem] lg:min-h-[30rem]",
    mediaPos: "end",
    align: "center",
    intensity: 1.4,
  },
  car: {
    mood: { ar: "لحظة الوصول", en: "The arrival route" },
    metaphor: "valet arrival / guided reception path",
    tone: "dark",
    accent: "oklch(0.82 0.08 84)",
    glow: "oklch(0.85 0.07 80)",
    base: "linear-gradient(180deg, oklch(0.17 0.014 80) 0%, oklch(0.23 0.020 84) 54%, oklch(0.13 0.012 76) 100%)",
    wash: "linear-gradient({dir}, oklch(0.12 0.014 80 / 0.88) 0%, oklch(0.17 0.018 82 / 0.60) 44%, oklch(0.36 0.040 84 / 0.32) 100%)",
    imageOpacity: 0.82,
    mediaClass: "rounded-2xl min-h-[16rem] lg:min-h-[22rem] lg:self-end lg:mb-28",
    mediaPos: "start",
    align: "end",
    intensity: 0.9,
  },
  "memory-book": {
    mood: { ar: "صفحات تبقى", en: "Pages that stay" },
    metaphor: "digital keepsake / memory album",
    tone: "light",
    accent: "oklch(0.62 0.09 76)",
    glow: "oklch(0.88 0.06 82)",
    base: "linear-gradient(180deg, oklch(0.98 0.008 84) 0%, oklch(0.95 0.018 82) 56%, oklch(0.97 0.012 84) 100%)",
    wash: "linear-gradient({dir}, oklch(0.98 0.010 84 / 0.94) 0%, oklch(0.96 0.014 84 / 0.84) 48%, oklch(0.92 0.030 82 / 0.62) 100%)",
    imageOpacity: 0.3,
    mediaClass: "rounded-md min-h-[24rem] lg:min-h-[32rem] rotate-1",
    mediaPos: "end",
    align: "center",
    intensity: 0.7,
  },
};

/* ----------------------------------------------------------------------------
 * World scenery: per-service decorative layers built from CSS shapes only.
 * `data-world-glow`, `data-world-ornament`, `data-world-float` are animated by
 * ServicesMotionBridge; everything stays static for mobile / reduced motion.
 * -------------------------------------------------------------------------- */

const hallParticles = [
  { x: "12%", y: "22%", s: 5 },
  { x: "30%", y: "58%", s: 4 },
  { x: "46%", y: "30%", s: 6 },
  { x: "58%", y: "68%", s: 4 },
  { x: "72%", y: "26%", s: 5 },
  { x: "86%", y: "54%", s: 4 },
];

const zaffaMarkers = ["18%", "32%", "46%", "60%", "74%"];

const decorationPetals = [
  { x: "14%", y: "20%", s: 14, r: 18 },
  { x: "26%", y: "64%", s: 11, r: -32 },
  { x: "40%", y: "16%", s: 12, r: 64 },
  { x: "55%", y: "74%", s: 15, r: -12 },
  { x: "68%", y: "24%", s: 10, r: 40 },
  { x: "80%", y: "60%", s: 13, r: -56 },
  { x: "90%", y: "32%", s: 11, r: 24 },
];

const djBars = [18, 34, 24, 46, 28, 40, 20];

function WorldScenery({ id, accent, glow }: { id: string; accent: string; glow: string }) {
  switch (id) {
    case "hall":
      return (
        <>
          <div
            data-world-glow=""
            aria-hidden="true"
            className="pointer-events-none absolute -top-[18%] left-[14%] h-[64%] w-[48%]"
            style={{ background: `radial-gradient(ellipse at center, ${alpha(glow, 0.2)}, transparent 70%)` }}
          />
          <div data-world-ornament="" aria-hidden="true" className="pointer-events-none absolute inset-0">
            {[
              { left: "8%", w: "11%", h: "44%" },
              { left: "23%", w: "13%", h: "56%" },
              { left: "40%", w: "11%", h: "46%" },
            ].map((arch) => (
              <span
                key={arch.left}
                className="absolute bottom-[13%] block rounded-t-full border border-b-0"
                style={{ left: arch.left, width: arch.w, height: arch.h, borderColor: alpha(accent, 0.26) }}
              />
            ))}
            <span
              className="absolute inset-x-0 bottom-0 block h-[13%]"
              style={{
                background: `linear-gradient(180deg, transparent, ${alpha(glow, 0.14)})`,
                borderTop: `1px solid ${alpha(accent, 0.3)}`,
              }}
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            {hallParticles.map((p) => (
              <span
                key={`${p.x}-${p.y}`}
                data-world-float=""
                className="absolute block rounded-full"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.s,
                  height: p.s,
                  background: alpha(glow, 0.85),
                  boxShadow: `0 0 12px ${alpha(glow, 0.5)}`,
                }}
              />
            ))}
          </div>
        </>
      );
    case "zaffa":
      return (
        <>
          <div
            data-world-glow=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[4%] top-[18%] h-[64%] w-[34%]"
            style={{ background: `radial-gradient(ellipse at center, ${alpha(accent, 0.22)}, transparent 70%)` }}
          />
          <div data-world-ornament="" aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span
              className="absolute bottom-0 left-1/4 block h-[26%] w-1/2"
              style={{
                clipPath: "polygon(0 100%, 100% 100%, 58% 0, 42% 0)",
                background: `linear-gradient(0deg, ${alpha(accent, 0.22)}, transparent 85%)`,
              }}
            />
            {["56%", "65%", "74%", "83%"].map((left, i) => (
              <span
                key={left}
                className="absolute top-0 block h-[72%] w-px"
                style={{
                  left,
                  transform: "skewX(-12deg)",
                  background: `linear-gradient(180deg, ${alpha(glow, i % 2 ? 0.34 : 0.22)}, transparent 75%)`,
                }}
              />
            ))}
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            {zaffaMarkers.map((left, i) => (
              <span
                key={left}
                data-world-float=""
                className="absolute block rotate-45"
                style={{
                  left,
                  bottom: `${16 + (i % 2) * 4}%`,
                  width: 8,
                  height: 8,
                  border: `1px solid ${alpha(accent, 0.7)}`,
                  background: alpha(accent, 0.18),
                }}
              />
            ))}
            {["20%", "34%", "50%"].map((top, i) => (
              <span
                key={top}
                data-world-float=""
                className="absolute block h-px w-16 rounded-full"
                style={{
                  left: `${12 + i * 9}%`,
                  top,
                  transform: `rotate(${i % 2 ? -8 : 6}deg)`,
                  background: `linear-gradient(90deg, transparent, ${alpha(glow, 0.6)}, transparent)`,
                }}
              />
            ))}
          </div>
        </>
      );
    case "food":
      return (
        <>
          <div
            data-world-glow=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[4%] left-1/4 h-[52%] w-1/2"
            style={{ background: `radial-gradient(ellipse at 50% 100%, ${alpha(glow, 0.22)}, transparent 72%)` }}
          />
          <div data-world-ornament="" aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span
              className="absolute inset-x-[6%] bottom-[11%] block h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${alpha(accent, 0.5)}, transparent)` }}
            />
            <span
              className="absolute inset-x-[10%] bottom-[10%] block h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${alpha(accent, 0.2)}, transparent)` }}
            />
            <span
              className="absolute inset-x-0 bottom-0 block h-[10%] opacity-70"
              style={{
                background: `repeating-linear-gradient(90deg, ${alpha(accent, 0.12)} 0 1px, transparent 1px 56px)`,
              }}
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            {[
              { x: "14%", y: "70%", s: 52 },
              { x: "34%", y: "78%", s: 36 },
              { x: "55%", y: "72%", s: 64 },
            ].map((ring) => (
              <span
                key={ring.x}
                data-world-float=""
                className="absolute block rounded-full"
                style={{
                  left: ring.x,
                  top: ring.y,
                  width: ring.s,
                  height: ring.s,
                  border: `1px solid ${alpha(glow, 0.4)}`,
                  boxShadow: `inset 0 0 0 5px ${alpha(glow, 0.08)}`,
                }}
              />
            ))}
            {["24%", "44%"].map((left, i) => (
              <span
                key={left}
                data-world-float=""
                className="absolute block rounded-full"
                style={{
                  left,
                  top: `${34 + i * 10}%`,
                  width: 90,
                  height: 130,
                  background: `radial-gradient(ellipse at center, ${alpha(glow, 0.14)}, transparent 70%)`,
                }}
              />
            ))}
          </div>
        </>
      );
    case "photography":
      return (
        <>
          <div
            data-world-glow=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[8%] top-[6%] h-[40%] w-[30%]"
            style={{ background: `radial-gradient(ellipse at center, ${alpha(glow, 0.16)}, transparent 70%)` }}
          />
          <div data-world-ornament="" aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span
              className="absolute left-[8%] top-[14%] block h-[34%] w-[22%] rotate-2 rounded-lg border"
              style={{ borderColor: alpha(accent, 0.22) }}
            />
            <span
              className="absolute bottom-[16%] right-[12%] block h-[28%] w-[18%] -rotate-3 rounded-lg border"
              style={{ borderColor: alpha(accent, 0.16) }}
            />
            <span
              className="absolute bottom-[8%] left-[10%] block h-9 w-[34%]"
              style={{
                borderTop: `1px solid ${alpha(accent, 0.3)}`,
                borderBottom: `1px solid ${alpha(accent, 0.3)}`,
                background: `repeating-linear-gradient(90deg, ${alpha(glow, 0.12)} 0 26px, transparent 26px 36px)`,
              }}
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            {[
              { x: "70%", y: "20%", r: 6 },
              { x: "78%", y: "62%", r: -8 },
              { x: "60%", y: "74%", r: 3 },
            ].map((card) => (
              <span
                key={card.x}
                data-world-float=""
                className="absolute block h-16 w-12 rounded-sm"
                style={{
                  left: card.x,
                  top: card.y,
                  transform: `rotate(${card.r}deg)`,
                  background: alpha(glow, 0.1),
                  border: `1px solid ${alpha(glow, 0.4)}`,
                  borderBottomWidth: 10,
                }}
              />
            ))}
            {[44, 28].map((size, i) => (
              <span
                key={size}
                data-world-float=""
                className="absolute block rounded-full"
                style={{
                  left: `${18 + i * 6}%`,
                  top: `${58 + i * 8}%`,
                  width: size,
                  height: size,
                  border: `1px solid ${alpha(glow, 0.35)}`,
                  boxShadow: `inset 0 0 0 4px ${alpha(glow, 0.08)}`,
                }}
              />
            ))}
          </div>
        </>
      );
    case "decoration":
      return (
        <>
          <div
            data-world-glow=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/4 top-[2%] h-[48%] w-1/2"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${alpha(glow, 0.18)}, transparent 72%)` }}
          />
          <div data-world-ornament="" aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span
              className="absolute left-1/2 top-[5%] block aspect-[2/1] w-[46%] -translate-x-1/2 rounded-t-full border border-b-0"
              style={{ borderColor: alpha(accent, 0.3) }}
            />
            <span
              className="absolute left-1/2 top-[9%] block aspect-[2/1] w-[38%] -translate-x-1/2 rounded-t-full border border-b-0"
              style={{ borderColor: alpha(accent, 0.18) }}
            />
            {["16%", "50%", "82%"].map((left, i) => (
              <span
                key={left}
                className="absolute bottom-[10%] block w-px"
                style={{
                  left,
                  height: 90 + i * 16,
                  transform: `rotate(${i % 2 ? 8 : -6}deg)`,
                  background: `linear-gradient(0deg, transparent, ${alpha(accent, 0.5)})`,
                }}
              />
            ))}
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            {decorationPetals.map((petal) => (
              <span
                key={`${petal.x}-${petal.y}`}
                data-world-float=""
                className="absolute block"
                style={{
                  left: petal.x,
                  top: petal.y,
                  width: petal.s,
                  height: petal.s,
                  borderRadius: "80% 0 80% 0",
                  transform: `rotate(${petal.r}deg)`,
                  background: alpha(accent, 0.4),
                  boxShadow: `0 2px 8px ${alpha(accent, 0.2)}`,
                }}
              />
            ))}
          </div>
        </>
      );
    case "lighting":
      return (
        <>
          <div
            data-world-glow=""
            aria-hidden="true"
            className="pointer-events-none absolute left-[12%] top-0 h-[58%] w-[32%]"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${alpha(accent, 0.22)}, transparent 70%)` }}
          />
          <div
            data-world-glow=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[14%] top-0 h-[48%] w-[26%]"
            style={{ background: `radial-gradient(ellipse at 50% 0%, ${alpha(glow, 0.18)}, transparent 70%)` }}
          />
          <div data-world-ornament="" aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span
              className="absolute left-[16%] top-0 block h-[70%] w-[20%]"
              style={{
                clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
                background: `linear-gradient(180deg, ${alpha(accent, 0.26)}, transparent 78%)`,
              }}
            />
            <span
              className="absolute right-[18%] top-0 block h-[60%] w-[16%]"
              style={{
                clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
                background: `linear-gradient(180deg, ${alpha(glow, 0.22)}, transparent 78%)`,
              }}
            />
            <span
              className="absolute inset-x-0 bottom-0 block h-[16%]"
              style={{
                background: `repeating-linear-gradient(90deg, ${alpha(accent, 0.08)} 0 1px, transparent 1px 64px), repeating-linear-gradient(0deg, ${alpha(accent, 0.08)} 0 1px, transparent 1px 26px)`,
                maskImage: "linear-gradient(180deg, transparent, black 70%)",
                WebkitMaskImage: "linear-gradient(180deg, transparent, black 70%)",
              }}
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                data-world-float=""
                className="absolute block rounded-full"
                style={{
                  left: `${10 + i * 4}%`,
                  bottom: "20%",
                  width: 6,
                  height: 6,
                  background: i % 2 ? alpha(glow, 0.8) : alpha(accent, 0.8),
                  boxShadow: `0 0 10px ${i % 2 ? alpha(glow, 0.5) : alpha(accent, 0.5)}`,
                }}
              />
            ))}
            {["28%", "40%"].map((top, i) => (
              <span
                key={top}
                data-world-float=""
                className="absolute block h-px w-24"
                style={{
                  right: `${8 + i * 6}%`,
                  top,
                  transform: `rotate(${i % 2 ? 24 : -18}deg)`,
                  background: `linear-gradient(90deg, transparent, ${alpha(accent, 0.55)}, transparent)`,
                }}
              />
            ))}
          </div>
        </>
      );
    case "dj":
      return (
        <>
          <div
            data-world-glow=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[2%] top-[14%] h-[70%] w-[42%]"
            style={{ background: `radial-gradient(ellipse at center, ${alpha(glow, 0.26)}, transparent 70%)` }}
          />
          <div data-world-ornament="" aria-hidden="true" className="pointer-events-none absolute inset-0">
            {[
              { s: "32%", o: 0.26 },
              { s: "46%", o: 0.16 },
              { s: "60%", o: 0.1 },
            ].map((ring) => (
              <span
                key={ring.s}
                className="absolute right-[6%] top-1/2 block aspect-square -translate-y-1/2 rounded-full border"
                style={{ width: ring.s, borderColor: alpha(accent, ring.o) }}
              />
            ))}
            <span className="absolute bottom-[13%] left-[10%] flex items-end gap-1.5">
              {djBars.map((h, i) => (
                <span
                  key={i}
                  className="block w-1 rounded-full"
                  style={{
                    height: h,
                    background: `linear-gradient(0deg, ${alpha(accent, 0.55)}, ${alpha(glow, 0.35)})`,
                  }}
                />
              ))}
            </span>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            {[
              { x: "16%", y: "26%", r: -10 },
              { x: "30%", y: "62%", r: 8 },
              { x: "44%", y: "20%", r: -4 },
              { x: "54%", y: "70%", r: 12 },
            ].map((wave) => (
              <span
                key={`${wave.x}-${wave.y}`}
                data-world-float=""
                className="absolute block h-px w-14 rounded-full"
                style={{
                  left: wave.x,
                  top: wave.y,
                  transform: `rotate(${wave.r}deg)`,
                  background: `linear-gradient(90deg, transparent, ${alpha(accent, 0.6)}, transparent)`,
                }}
              />
            ))}
            {["22%", "48%"].map((top, i) => (
              <span
                key={top}
                data-world-float=""
                className="absolute block rounded-full"
                style={{
                  left: `${62 + i * 8}%`,
                  top,
                  width: 8,
                  height: 8,
                  background: alpha(accent, 0.8),
                  boxShadow: `0 0 0 6px ${alpha(accent, 0.12)}`,
                }}
              />
            ))}
          </div>
        </>
      );
    case "car":
      return (
        <>
          <div
            data-world-glow=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[10%] right-[6%] h-[56%] w-[26%]"
            style={{ background: `radial-gradient(ellipse at 50% 100%, ${alpha(glow, 0.2)}, transparent 72%)` }}
          />
          <div data-world-ornament="" aria-hidden="true" className="pointer-events-none absolute inset-0">
            <svg
              className="absolute inset-x-0 bottom-[6%] h-[36%] w-full"
              viewBox="0 0 1200 300"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M -20 250 C 280 110, 660 280, 1220 110"
                stroke={alpha(accent, 0.5)}
                strokeWidth="2"
                strokeDasharray="2 16"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="absolute bottom-[16%] right-[9%] block h-[30%] w-[12%] rounded-t-full border border-b-0"
              style={{ borderColor: alpha(accent, 0.34) }}
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            {[
              { x: "18%", y: "66%" },
              { x: "46%", y: "76%" },
              { x: "72%", y: "58%" },
            ].map((dot) => (
              <span
                key={dot.x}
                data-world-float=""
                className="absolute block rounded-full"
                style={{
                  left: dot.x,
                  top: dot.y,
                  width: 10,
                  height: 10,
                  background: alpha(accent, 0.9),
                  boxShadow: `0 0 0 6px ${alpha(accent, 0.14)}, 0 0 14px ${alpha(glow, 0.4)}`,
                }}
              />
            ))}
          </div>
        </>
      );
    case "memory-book":
      return (
        <>
          <div
            data-world-glow=""
            aria-hidden="true"
            className="pointer-events-none absolute -top-[8%] right-[10%] h-[48%] w-[36%]"
            style={{ background: `radial-gradient(ellipse at center, ${alpha(glow, 0.4)}, transparent 70%)` }}
          />
          <div data-world-ornament="" aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span
              className="absolute inset-0 block opacity-60"
              style={{
                background: `radial-gradient(${alpha(accent, 0.12)} 1px, transparent 1px)`,
                backgroundSize: "26px 26px",
              }}
            />
            <span
              className="absolute right-[8%] top-[16%] block h-[56%] w-[28%] rotate-3 rounded-md border"
              style={{
                background: "oklch(0.99 0.005 84)",
                borderColor: alpha(accent, 0.2),
                boxShadow: "0 18px 44px oklch(0.40 0.04 70 / 0.10)",
              }}
            />
            <span
              className="absolute right-[11%] top-[20%] block h-[52%] w-[26%] -rotate-2 rounded-md border"
              style={{
                background: "oklch(0.98 0.008 84)",
                borderColor: alpha(accent, 0.16),
                boxShadow: "0 14px 36px oklch(0.40 0.04 70 / 0.08)",
              }}
            />
            <svg
              className="absolute bottom-[14%] left-[8%] h-16 w-[26%]"
              viewBox="0 0 300 60"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 8 40 C 50 10, 80 56, 120 32 S 200 8, 240 36 S 280 30, 294 24"
                stroke={alpha(accent, 0.55)}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
            {[
              { x: "16%", y: "22%", r: -5 },
              { x: "30%", y: "58%", r: 7 },
            ].map((frame) => (
              <span
                key={frame.x}
                data-world-float=""
                className="absolute block h-14 w-11 rounded-sm"
                style={{
                  left: frame.x,
                  top: frame.y,
                  transform: `rotate(${frame.r}deg)`,
                  background: "oklch(0.99 0.005 84)",
                  border: `1px solid ${alpha(accent, 0.3)}`,
                  borderBottomWidth: 9,
                  boxShadow: "0 8px 20px oklch(0.40 0.04 70 / 0.12)",
                }}
              />
            ))}
            <span
              data-world-float=""
              className="absolute left-[44%] top-[18%] block h-12 w-9 rotate-6 rounded-sm"
              style={{
                background: "oklch(0.98 0.010 84)",
                border: `1px solid ${alpha(accent, 0.22)}`,
                boxShadow: "0 6px 16px oklch(0.40 0.04 70 / 0.10)",
              }}
            />
          </div>
        </>
      );
    default:
      return null;
  }
}

function localize(text: LocalizedText, locale: Locale) {
  return text[locale] ?? text.ar;
}

function localizeLines(lines: LocalizedLines, locale: Locale) {
  return lines[locale] ?? lines.ar;
}

function GoldDivider({ light = false, color }: { light?: boolean; color?: string }) {
  const resolved = color ?? (light ? "oklch(0.98 0.010 84 / 0.74)" : "var(--brand-primary)");

  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <span
        className="block h-px w-14 rounded-full"
        style={{ background: `linear-gradient(to right, transparent, ${resolved})` }}
      />
      <span className="block size-1.5 rounded-full" style={{ background: resolved }} />
      <span
        className="block h-px w-14 rounded-full"
        style={{ background: `linear-gradient(to left, transparent, ${resolved})` }}
      />
    </div>
  );
}

function SplitTitle({
  lines,
  light = false,
  world = false,
}: {
  lines: string[];
  light?: boolean;
  world?: boolean;
}) {
  const worldAttr = world ? { "data-world-title-line": "" } : {};

  return (
    <>
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden pb-2">
          <span
            className="block"
            data-service-title-line=""
            {...worldAttr}
            style={{ color: light ? "oklch(0.98 0.012 84)" : "var(--brand-secondary)" }}
          >
            {line}
          </span>
        </span>
      ))}
    </>
  );
}

function PanelShell({
  children,
  id,
  locale,
  className = "",
  panelProps,
}: {
  children: React.ReactNode;
  id?: string;
  locale: Locale;
  className?: string;
  panelProps?: Record<string, string>;
}) {
  return (
    <section
      id={id}
      data-services-panel=""
      data-services-flip-page=""
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`relative flex min-h-[100svh] w-full min-w-full shrink-0 items-center overflow-hidden px-0 py-20 md:h-[100svh] md:w-screen md:min-w-[100vw] md:py-0 ${className}`}
      {...panelProps}
    >
      <div
        data-services-page-face=""
        className="relative flex min-h-[100svh] w-full items-center overflow-hidden md:h-full"
      >
        {children}
        <span
          data-services-page-edge=""
          className="pointer-events-none absolute bottom-0 right-0 top-0 z-[60] w-3 opacity-0 md:w-4"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

function ServicePanel({
  service,
  index,
  total,
  locale,
}: {
  service: ServiceItem;
  index: number;
  total: number;
  locale: Locale;
}) {
  const world = serviceWorlds[service.id] ?? hallWorld;
  const imageSrc = service.image ?? serviceFallbackImages[service.id] ?? "/site/hero.jpg";
  const ctaHref = service.cta?.href ?? "/contact";
  const ctaLabel = service.cta ? localize(service.cta.label, locale) : localize(pageCopy.defaultServiceCta, locale);
  const sceneId = index === 0 ? "service-menu" : `service-${service.id}`;
  const isArabic = locale === "ar";
  const dark = world.tone === "dark";
  const wash = world.wash.replace("{dir}", isArabic ? "270deg" : "90deg");
  const mediaFirst = world.mediaPos === "start";

  const textMain = dark ? "oklch(0.98 0.012 84)" : "var(--brand-secondary)";
  const textSoft = dark ? "oklch(0.98 0.012 84 / 0.78)" : "oklch(0.40 0.030 70)";
  const chipBg = dark ? "oklch(1 0 0 / 0.12)" : alpha(world.accent, 0.08);
  const chipBorder = dark ? "oklch(1 0 0 / 0.22)" : alpha(world.accent, 0.34);

  return (
    <PanelShell
      id={sceneId}
      locale={locale}
      panelProps={{
        "data-services-active": "false",
        "data-service-scene": "",
        "data-service-id": service.id,
        "data-service-world": service.id,
        "data-world-intensity": String(world.intensity),
      }}
    >
      <div className="absolute inset-0" data-world-bg="" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: world.base }} />
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ opacity: world.imageOpacity }}
          loading={index <= 1 ? "eager" : "lazy"}
        />
        <div className="absolute inset-0" style={{ background: wash }} />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `repeating-linear-gradient(112deg, ${alpha(world.accent, 0.06)} 0 1px, transparent 1px 22px)`,
          }}
        />
      </div>

      <WorldScenery id={service.id} accent={world.accent} glow={world.glow} />

      <Container
        className={`relative z-10 grid w-full gap-8 lg:gap-16 ${
          world.align === "end" ? "items-end pb-6 md:pb-16" : "items-center"
        } ${
          mediaFirst
            ? "lg:grid-cols-[minmax(320px,0.72fr)_minmax(0,0.95fr)]"
            : "lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.72fr)]"
        }`}
      >
        <div
          data-service-copy=""
          data-world-copy=""
          className={`max-w-3xl text-start ${mediaFirst ? "lg:order-2" : ""}`}
          style={{ color: textMain }}
        >
          <div
            data-service-kicker=""
            className="inline-flex items-center gap-3 rounded-full px-4 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.22em]"
            style={{
              background: chipBg,
              border: `1px solid ${chipBorder}`,
              boxShadow: dark ? "inset 0 1px 0 oklch(1 0 0 / 0.16)" : "inset 0 1px 0 oklch(1 0 0 / 0.7)",
            }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className="h-px w-8" style={{ background: world.accent }} aria-hidden="true" />
            {localize(world.mood, locale)}
          </div>

          <h2
            className="mt-7 text-4xl font-bold leading-[1.02] tracking-normal sm:text-5xl md:text-6xl lg:text-[4.55rem]"
            style={{
              fontFamily: "var(--font-display-ar), var(--font-display), serif",
              textWrap: "balance",
              textShadow: dark ? "0 20px 54px oklch(0 0 0 / 0.28)" : "none",
            }}
          >
            <SplitTitle lines={[service.name[locale]]} light={dark} world />
          </h2>

          <div className="my-7">
            <GoldDivider color={dark ? alpha(world.glow, 0.8) : world.accent} />
          </div>

          <p
            data-service-body=""
            className="max-w-2xl text-base leading-[2] md:text-lg"
            style={{ color: textSoft, textWrap: "pretty" }}
          >
            {service.description[locale]}
          </p>

          <div data-service-meta="" className="mt-7 flex flex-wrap gap-3">
            {service.priceHint && (
              <span
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                style={{
                  background: dark ? "oklch(0.98 0.010 84 / 0.14)" : alpha(world.accent, 0.1),
                  border: `1px solid ${chipBorder}`,
                  color: textMain,
                }}
              >
                <CheckCircle2 className="size-4" aria-hidden="true" />
                {service.priceHint[locale]}
              </span>
            )}
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                background: dark ? "oklch(0.98 0.010 84 / 0.10)" : alpha(world.accent, 0.06),
                border: `1px solid ${dark ? "oklch(1 0 0 / 0.16)" : alpha(world.accent, 0.26)}`,
                color: textSoft,
              }}
            >
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              <span className="h-px w-5" style={{ background: world.accent }} aria-hidden="true" />
              {localize(pageCopy.sceneMeta, locale)}
            </span>
          </div>

          <div data-service-cta="" className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ctaHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.84 0.10 82) 0%, oklch(0.70 0.12 76) 100%)",
                color: "oklch(0.14 0.01 58)",
                boxShadow: "0 16px 42px oklch(0.76 0.10 82 / 0.34)",
              }}
            >
              {ctaLabel}
              <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div
          data-world-media=""
          className={`relative overflow-hidden border ${world.mediaClass} ${mediaFirst ? "lg:order-1" : ""}`}
          style={{
            background: dark ? "oklch(0.96 0.012 82)" : "oklch(0.99 0.005 84)",
            borderColor:
              service.id === "memory-book"
                ? "oklch(0.99 0.005 84)"
                : dark
                  ? "oklch(1 0 0 / 0.54)"
                  : alpha(world.accent, 0.3),
            borderWidth: service.id === "memory-book" ? 10 : undefined,
            boxShadow: dark
              ? `0 32px 78px oklch(0.08 0.010 58 / 0.38), 0 0 0 1px ${alpha(world.accent, 0.18)}`
              : `0 26px 60px oklch(0.40 0.04 70 / 0.16), 0 0 0 1px ${alpha(world.accent, 0.14)}`,
          }}
        >
          <Image
            src={imageSrc}
            alt={service.name[locale]}
            fill
            loading={index <= 1 ? "eager" : "lazy"}
            sizes="(max-width: 1024px) 100vw, 34vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, oklch(1 0 0 / 0.10), transparent 36%, oklch(0.12 0.018 58 / 0.42)), linear-gradient(135deg, transparent 0%, ${alpha(world.accent, 0.18)} 100%)`,
            }}
            aria-hidden="true"
          />
          {service.id === "photography" && (
            <>
              {[
                "left-3 top-3 border-l-2 border-t-2",
                "right-3 top-3 border-r-2 border-t-2",
                "bottom-3 left-3 border-b-2 border-l-2",
                "bottom-3 right-3 border-b-2 border-r-2",
              ].map((corner) => (
                <span
                  key={corner}
                  className={`absolute size-7 ${corner}`}
                  style={{ borderColor: alpha(world.glow, 0.9) }}
                  aria-hidden="true"
                />
              ))}
            </>
          )}
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
            <span
              className="inline-flex size-12 items-center justify-center rounded-xl"
              style={{
                background: "oklch(0.99 0.006 84 / 0.88)",
                color: "oklch(0.45 0.07 76)",
                border: "1px solid oklch(1 0 0 / 0.62)",
              }}
              aria-hidden="true"
            >
              <Icon name={service.icon ?? "Sparkles"} className="size-6" />
            </span>
            <span
              className="rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em]"
              style={{
                background: "oklch(0.12 0.018 58 / 0.46)",
                color: "oklch(0.98 0.012 84)",
                border: "1px solid oklch(1 0 0 / 0.18)",
              }}
            >
              Qasr Al-Farah
            </span>
          </div>
        </div>
      </Container>
    </PanelShell>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = getContent(locale);
  const seo = content.seo.services;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/services" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/services",
      images: [{ url: "/site/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      title: seo.title,
      description: seo.description,
      images: ["/site/og-image.jpg"],
    },
  };
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const content = getContent(locale);
  const config = getSiteConfig();
  const services = getServices();
  const brandName = config.logo.alt[locale];
  const isArabic = locale === "ar";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      data-services-page=""
      className="relative isolate w-full overflow-x-hidden [--svc-gap:0.5rem] sm:[--svc-gap:0.75rem] lg:[--svc-gap:1rem]"
      style={{
        background:
          "radial-gradient(ellipse 74% 46% at 50% -12%, oklch(0.92 0.046 80 / 0.42) 0%, transparent 68%), radial-gradient(ellipse 50% 42% at 100% 80%, oklch(0.95 0.024 22 / 0.25) 0%, transparent 72%), var(--brand-bg)",
      }}
    >
      <div data-services-frame="" className="w-full p-[var(--svc-gap)]">
        <section
          data-services-horizontal=""
          dir="ltr"
          aria-label={localize(pageCopy.eyebrow, locale)}
          className="relative w-full overflow-hidden rounded-[1.75rem] border border-[oklch(0.82_0.05_82_/_0.45)] shadow-[0_24px_70px_oklch(0.30_0.035_68_/_0.18)] md:h-[calc(100svh_-_2*var(--svc-gap))] md:rounded-[2.25rem]"
        >
          <div
            data-services-viewport=""
            data-services-flip-stage=""
            dir="ltr"
            className="relative min-h-[100svh] overflow-hidden md:h-[calc(100svh_-_2*var(--svc-gap))] md:min-h-0"
          >
          <div
            data-services-track=""
            dir="ltr"
            className="flex min-h-[100svh] w-full flex-col md:h-full md:w-max md:flex-row"
            style={{ willChange: "transform" }}
          >
            <PanelShell
              id="services-story"
              locale={locale}
              panelProps={{
                "data-services-active": "true",
                "data-services-hero-scene": "",
              }}
            >
              <div className="absolute inset-0" aria-hidden="true">
                <Image
                  src="/site/hero.jpg"
                  alt=""
                  fill
                  priority
                  loading="eager"
                  sizes="100vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(95deg, oklch(0.99 0.006 84 / 0.96) 0%, oklch(0.98 0.010 84 / 0.88) 42%, oklch(0.18 0.02 58 / 0.58) 100%)",
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(118deg, transparent 0 28%, oklch(0.76 0.10 82 / 0.16) 28% 29%, transparent 29% 100%), repeating-linear-gradient(112deg, oklch(0.76 0.10 82 / 0.08) 0 1px, transparent 1px 18px)",
                  }}
                />
              </div>

              <Container className="relative z-10 grid w-full items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1fr)] lg:gap-16">
                <div className="max-w-4xl text-start" data-services-hero-copy="">
                  <span
                    data-services-hero-kicker=""
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.18em]"
                    style={{
                      background: "oklch(0.99 0.006 84 / 0.82)",
                      border: "1px solid oklch(0.76 0.10 82 / 0.28)",
                      boxShadow: "0 12px 34px oklch(0.56 0.06 64 / 0.07), inset 0 1px 0 oklch(1 0 0 / 0.8)",
                      color: "oklch(0.47 0.06 76)",
                    }}
                  >
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    {brandName}
                    <span className="h-px w-8" style={{ background: "var(--brand-primary)" }} aria-hidden="true" />
                    {localize(pageCopy.eyebrow, locale)}
                  </span>

                  <h1
                    data-services-hero-title=""
                    className="mt-7 text-5xl font-bold leading-[1.02] tracking-normal text-brand-secondary sm:text-6xl md:text-7xl lg:text-[5.2rem]"
                    style={{
                      fontFamily: "var(--font-display-ar), var(--font-display), serif",
                      textWrap: "balance",
                      textShadow: "0 1px 0 oklch(1 0 0 / 0.60), 0 18px 32px oklch(0.22 0.03 58 / 0.11)",
                    }}
                  >
                    <SplitTitle lines={localizeLines(pageCopy.heroTitle, locale)} />
                  </h1>

                  <div className="my-8" data-services-hero-divider="">
                    <GoldDivider />
                  </div>

                  <p
                    data-services-hero-body=""
                    className="max-w-2xl text-base leading-[1.95] text-brand-muted-fg md:text-lg"
                    style={{ textWrap: "pretty" }}
                  >
                    {localize(pageCopy.heroSubtitle, locale)}
                  </p>

                  <div
                    data-services-hero-actions=""
                    className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
                  >
                    <Link
                      href="/contact"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.76_0.10_82)] focus-visible:ring-offset-2"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.80 0.11 82) 0%, oklch(0.69 0.12 76) 100%)",
                        color: "oklch(0.14 0.01 58)",
                        boxShadow: "0 0 0 1px oklch(0.74 0.12 76 / 0.42), 0 18px 42px oklch(0.70 0.12 76 / 0.28)",
                      }}
                    >
                      <CalendarCheck className="size-4" aria-hidden="true" />
                      {localize(pageCopy.heroPrimary, locale)}
                    </Link>
                    <Link
                      href="#service-menu"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-8 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.76_0.10_82)] focus-visible:ring-offset-2"
                      style={{
                        background: "oklch(0.99 0.006 84 / 0.88)",
                        borderColor: "oklch(0.76 0.10 82 / 0.32)",
                        color: "oklch(0.36 0.045 74)",
                        boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.72)",
                      }}
                    >
                      {localize(pageCopy.heroSecondary, locale)}
                      <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                    </Link>
                  </div>

                  <dl data-services-hero-stats="" className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
                    {heroHighlights.map((item) => (
                      <div
                        key={item.value.en}
                        className="rounded-xl border px-3 py-3 text-center"
                        style={{
                          background: "oklch(0.99 0.006 84 / 0.70)",
                          borderColor: "oklch(0.88 0.018 82 / 0.58)",
                        }}
                      >
                        <dt className="text-[0.66rem] font-medium text-brand-muted-fg">{localize(item.label, locale)}</dt>
                        <dd
                          className="mt-1 text-lg font-bold text-brand-secondary"
                          style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
                        >
                          {localize(item.value, locale)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div
                  data-services-hero-stage=""
                  className="relative mx-auto min-h-[24rem] w-full max-w-[36rem] sm:min-h-[34rem] lg:min-h-[42rem] lg:max-w-none"
                  aria-label={isArabic ? "مشاهد من خدمات قصر الفرح" : "Qasr Al-Farah service scenes"}
                >
                  <div
                    data-services-hero-backdrop=""
                    className="absolute inset-[8%] rounded-2xl border"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(1 0 0 / 0.52), oklch(0.95 0.018 82 / 0.30)), repeating-linear-gradient(112deg, oklch(0.76 0.10 82 / 0.08) 0 1px, transparent 1px 18px)",
                      borderColor: "oklch(0.76 0.10 82 / 0.18)",
                      boxShadow: "0 28px 70px oklch(0.30 0.035 68 / 0.10), inset 0 1px 0 oklch(1 0 0 / 0.62)",
                      transform: "rotate(-2deg)",
                    }}
                  />
                  {heroFrames.map((frame) => (
                    <figure
                      key={frame.src}
                      data-services-hero-card=""
                      className={`absolute overflow-hidden rounded-2xl border ${frame.className}`}
                      style={{
                        background: "oklch(0.96 0.012 82)",
                        borderColor: "oklch(1 0 0 / 0.78)",
                        boxShadow: "0 20px 46px oklch(0.22 0.026 58 / 0.15), 0 0 0 1px oklch(0.78 0.08 80 / 0.12)",
                      }}
                    >
                      <Image
                        src={frame.src}
                        alt={localize(frame.alt, locale)}
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 70vw, 360px"
                        className="object-cover"
                      />
                    </figure>
                  ))}
                </div>
              </Container>
            </PanelShell>

            {services.map((service, index) => (
              <ServicePanel
                key={service.id}
                service={service}
                index={index}
                total={services.length}
                locale={locale}
              />
            ))}

            <PanelShell
              id="services-final-cta"
              locale={locale}
              panelProps={{
                "data-services-active": "false",
                "data-services-final-cta": "",
              }}
            >
              <div className="absolute inset-0" data-services-final-bg="" aria-hidden="true">
                <Image
                  src="/site/gallery/couple-1.jpg"
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.12 0.018 58 / 0.84) 0%, oklch(0.25 0.035 58 / 0.72) 48%, oklch(0.55 0.08 76 / 0.68) 100%)",
                  }}
                />
              </div>

              <Container className="relative z-10">
                <div
                  data-services-final-content=""
                  className="mx-auto flex max-w-4xl flex-col items-center text-center"
                  style={{ color: "oklch(0.98 0.012 84)" }}
                >
                  <span
                    data-service-kicker=""
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em]"
                    style={{
                      background: "oklch(1 0 0 / 0.10)",
                      border: "1px solid oklch(1 0 0 / 0.24)",
                    }}
                  >
                    <MessageCircle className="size-3.5" aria-hidden="true" />
                    {localize(pageCopy.finalEyebrow, locale)}
                  </span>

                  <h2
                    className="mt-7 text-4xl font-bold leading-[1.03] sm:text-5xl md:text-6xl lg:text-[5rem]"
                    style={{
                      fontFamily: "var(--font-display-ar), var(--font-display), serif",
                      textWrap: "balance",
                    }}
                  >
                    <SplitTitle lines={localizeLines(pageCopy.finalTitle, locale)} light />
                  </h2>

                  <div className="my-8">
                    <GoldDivider light />
                  </div>

                  <p
                    data-service-body=""
                    className="max-w-2xl text-base leading-[1.95] md:text-lg"
                    style={{ color: "oklch(0.98 0.012 84 / 0.78)" }}
                  >
                    {localize(pageCopy.finalBody, locale)}
                  </p>

                  <div
                    data-service-meta=""
                    className="mt-7 rounded-full border px-4 py-2 text-sm font-semibold"
                    style={{ borderColor: "oklch(1 0 0 / 0.20)", background: "oklch(1 0 0 / 0.10)" }}
                  >
                    {localize(pageCopy.closingNote, locale)}
                  </div>

                  <div data-service-cta="" className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                    <Link
                      href="/contact"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                      style={{
                        background: "oklch(0.98 0.006 84)",
                        color: "oklch(0.28 0.02 58)",
                      }}
                    >
                      <CalendarCheck className="size-4" aria-hidden="true" />
                      {content.nav.book}
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex h-12 items-center justify-center gap-2 rounded-full border px-8 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                      style={{
                        background: "oklch(1 0 0 / 0.10)",
                        border: "1px solid oklch(1 0 0 / 0.30)",
                        color: "oklch(0.95 0.01 84)",
                      }}
                    >
                      {localize(pageCopy.contact, locale)}
                    </Link>
                  </div>
                </div>
              </Container>
            </PanelShell>
          </div>
        </div>
        </section>
      </div>

      <style>{`
        [data-services-page],
        [data-services-horizontal],
        [data-services-viewport] {
          max-width: 100%;
        }

        [data-services-track] {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }

        [data-services-panel] {
          contain: layout paint;
        }

        @media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
          [data-services-flip-stage] {
            perspective: 1800px;
            transform-style: preserve-3d;
            background: oklch(0.96 0.012 84);
          }

          [data-services-track] {
            position: relative;
            display: block !important;
            height: 100%;
            width: 100% !important;
            min-height: 100%;
            transform: none !important;
            transform-style: preserve-3d;
            will-change: auto !important;
          }

          [data-services-flip-page] {
            position: absolute;
            inset: 0;
            height: 100% !important;
            min-height: 100% !important;
            min-width: 100% !important;
            width: 100% !important;
            overflow: visible;
            opacity: 0;
            pointer-events: none;
            transform-style: preserve-3d;
            visibility: hidden;
            will-change: transform, opacity;
          }

          [data-services-flip-page][data-services-active="true"] {
            opacity: 1;
            visibility: visible;
          }

          [data-services-page-face] {
            position: absolute;
            inset: 0;
            height: 100%;
            min-height: 100%;
            backface-visibility: hidden;
            background: linear-gradient(90deg, oklch(0.99 0.006 84), oklch(0.95 0.014 82));
            box-shadow: 0 0 0 1px oklch(0.76 0.10 82 / 0.16);
            transform-style: preserve-3d;
          }

          [data-services-page-face]::before,
          [data-services-page-face]::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 45;
            pointer-events: none;
            transition: none;
          }

          [data-services-page-face]::before {
            background:
              linear-gradient(90deg, oklch(0.08 0.014 58 / 0.34), transparent 20%, transparent 70%, oklch(0.08 0.014 58 / 0.22)),
              radial-gradient(ellipse at 18% 50%, oklch(0.10 0.012 58 / 0.18), transparent 62%);
            mix-blend-mode: multiply;
            opacity: var(--services-page-shadow, 0);
          }

          [data-services-page-face]::after {
            background:
              linear-gradient(100deg, oklch(1 0 0 / 0.26), transparent 22%, oklch(0.84 0.10 82 / 0.18) 48%, transparent 66%),
              repeating-linear-gradient(90deg, oklch(1 0 0 / 0.08) 0 1px, transparent 1px 14px);
            opacity: var(--services-page-curl, 0);
          }

          [data-services-page-edge] {
            background:
              linear-gradient(90deg, transparent 0%, oklch(1 0.004 84 / 0.92) 42%, oklch(0.78 0.09 82 / 0.52) 100%);
            box-shadow:
              0 0 18px oklch(0.82 0.09 82 / 0.24),
              inset 1px 0 0 oklch(1 0 0 / 0.54);
            opacity: var(--services-page-edge-opacity, 0);
          }
        }

        @media (max-width: 767px), (prefers-reduced-motion: reduce) {
          [data-services-horizontal] {
            height: auto !important;
            min-height: 0 !important;
          }

          [data-services-viewport] {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
          }

          [data-services-track] {
            width: 100% !important;
            transform: none !important;
            flex-direction: column !important;
            will-change: auto !important;
          }

          [data-services-panel] {
            width: 100% !important;
            min-width: 100% !important;
            height: auto !important;
            min-height: 100svh !important;
          }

          [data-services-page-face] {
            position: relative !important;
            height: auto !important;
            min-height: 100svh !important;
            width: 100% !important;
          }

          [data-services-page-edge] {
            display: none !important;
          }
        }
      `}</style>

      <ServicesMotionBridge />
    </div>
  );
}
