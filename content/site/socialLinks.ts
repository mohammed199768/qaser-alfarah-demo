import { siteConfig } from "@/content/site/site.config";

export type SocialOrbitLink = {
  id: "instagram" | "facebook" | "phone" | "whatsapp" | "maps";
  labelAr: string;
  labelEn: string;
  href: string;
  ariaLabel: string;
  external: boolean;
  /** True when the href is a known placeholder and should not be rendered as a live link. */
  placeholder: boolean;
};

// ─── Placeholder detection ────────────────────────────────────────────────────
// Checks the resolved href string against known placeholder patterns without
// importing anything beyond what is already available at module load time.

const PLACEHOLDER_PATTERNS: RegExp[] = [
  /^$/,                                    // empty string
  /^#$/,                                   // bare hash
  /PASTE_HERE/i,
  /REPLACE/i,
  /placeholder/i,
  /example\.com/i,
  // tel: with obviously fake numbers — repeating digits, all zeros, all nines
  /^tel:0{6,}/,
  /^tel:9{6,}/,
  /^tel:\+?0{6,}/,
  // wa.me with same pattern
  /^https:\/\/wa\.me\/0{6,}/,
  /^https:\/\/wa\.me\/9{6,}/,
  // Google Maps generic city search (no place_id, no coordinates, just a city name)
  /maps\.google\.com\/\?q=[a-z]+$/i,
  // Instagram / Facebook fallback handles that look like brand templates
  /instagram\.com\/qasralfarah$/i,
  /facebook\.com\/qasralfarah$/i,
];

function isPlaceholderHref(href: string): boolean {
  return PLACEHOLDER_PATTERNS.some((re) => re.test(href.trim()));
}

// ─── Link definitions ─────────────────────────────────────────────────────────

const instagramHref = siteConfig.social.instagram ?? "";
const facebookHref  = siteConfig.social.facebook  ?? "";
const phoneHref     = `tel:${siteConfig.phone}`;
const whatsappHref  = `https://wa.me/${siteConfig.whatsappNumber}`;
const mapsHref      = siteConfig.mapUrl;

export const socialOrbitLinks: SocialOrbitLink[] = [
  {
    id: "instagram",
    labelAr: "إنستغرام",
    labelEn: "Instagram",
    href: instagramHref,
    ariaLabel: "Open Qasr Al-Farah Instagram",
    external: true,
    placeholder: isPlaceholderHref(instagramHref),
  },
  {
    id: "facebook",
    labelAr: "فيسبوك",
    labelEn: "Facebook",
    href: facebookHref,
    ariaLabel: "Open Qasr Al-Farah Facebook",
    external: true,
    placeholder: isPlaceholderHref(facebookHref),
  },
  {
    id: "phone",
    labelAr: "اتصال",
    labelEn: "Call",
    href: phoneHref,
    ariaLabel: "Call Qasr Al-Farah",
    external: false,
    placeholder: isPlaceholderHref(phoneHref),
  },
  {
    id: "whatsapp",
    labelAr: "واتساب",
    labelEn: "WhatsApp",
    href: whatsappHref,
    ariaLabel: "Contact Qasr Al-Farah on WhatsApp",
    external: true,
    // Disabled if wa.me URL is fake, OR if the phone number is still a placeholder —
    // phone and WhatsApp should only go live together once the owner confirms both.
    placeholder: isPlaceholderHref(whatsappHref) || isPlaceholderHref(phoneHref),
  },
  {
    id: "maps",
    labelAr: "الموقع",
    labelEn: "Google Maps",
    href: mapsHref,
    ariaLabel: "Open Qasr Al-Farah location on Google Maps",
    external: true,
    placeholder: isPlaceholderHref(mapsHref),
  },
];
