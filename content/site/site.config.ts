import type { SiteConfig } from "@/types/site-content";

export const siteConfig: SiteConfig = {
  brandId: "qasr-alfarah",
  logo: {
    src: "/site/logo.svg",
    alt: { ar: "قصر الفرح", en: "Qasr Al-Farah" },
    width: 150,
    height: 50,
  },
  defaultLocale: "ar",
  whatsappNumber: "962779667168",
  phone: "0790000000",
  email: "info@qasralfarah.com",
  mapUrl: "https://maps.google.com/?q=amman",
  geo: { lat: 31.95, lng: 35.93 },
  social: {
    instagram: "https://instagram.com/qasralfarah",
    facebook: "https://facebook.com/qasralfarah",
  },
  hero: {
    media: { type: "image", src: "/site/hero.jpg" },
    overlayOpacity: 0.4,
  },
  features: {
    showMemoryBookTeaser: true,
    showGalleryHighlight: true,
    showPoweredBy: true,
    enableGalleryLightbox: true,
    enableContactForm: false,
  },
  ogImage: "/site/og-image.jpg",
};
