import { siteConfig } from "@/content/site/site.config";

export type ContactLink = {
  id: "whatsapp" | "maps" | "instagram" | "facebook";
  labelAr: string;
  labelEn: string;
  href: string;
  icon: string;
  external: boolean;
};

const AMMAN_MAPS_FALLBACK =
  "https://www.google.com/maps/search/?api=1&query=Amman%2C%20Jordan";

export const contactLinks: ContactLink[] = [
  {
    id: "whatsapp",
    labelAr: "واتساب",
    labelEn: "WhatsApp",
    href: `https://wa.me/${siteConfig.whatsappNumber}`,
    icon: "MessageCircle",
    external: true,
  },
  {
    id: "maps",
    labelAr: "موقع القاعة",
    labelEn: "Location",
    href: AMMAN_MAPS_FALLBACK,
    icon: "MapPin",
    external: true,
  },
  {
    id: "instagram",
    labelAr: "إنستغرام",
    labelEn: "Instagram",
    href: siteConfig.social.instagram ?? "https://www.instagram.com/YOUR_PAGE",
    icon: "Instagram",
    external: true,
  },
  {
    id: "facebook",
    labelAr: "فيسبوك",
    labelEn: "Facebook",
    href: siteConfig.social.facebook ?? "https://www.facebook.com/YOUR_PAGE",
    icon: "Facebook",
    external: true,
  },
];
