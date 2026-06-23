import type { Locale } from "@/lib/i18n";

export type Localized = Record<Locale, string>;

export interface SiteConfig {
  brandId: string;
  logo: { src: string; alt: Localized; width: number; height: number };
  defaultLocale: Locale;
  whatsappNumber: string;
  phone: string;
  email?: string;
  mapUrl: string;
  geo?: { lat: number; lng: number };
  social: Partial<Record<"instagram" | "facebook" | "tiktok" | "snapchat" | "x" | "youtube", string>>;
  hero: {
    media: { type: "image" | "video"; src: string; poster?: string };
    overlayOpacity?: number;
  };
  features: {
    showMemoryBookTeaser: boolean;
    showGalleryHighlight: boolean;
    showPoweredBy: boolean;
    enableGalleryLightbox: boolean;
    enableContactForm: boolean;
  };
  ogImage: string;
}

export interface ServiceItem {
  id: string;
  icon?: string;
  image?: string;
  name: Localized;
  description: Localized;
  priceHint?: Localized;
  cta?: { href: "/contact"; label: Localized };
  featured?: boolean;
  order: number;
}

export type GalleryCategory = "hall" | "decoration" | "food" | "events" | "couple";

export interface GalleryItem {
  id: string;
  src: string;
  thumb?: string;
  alt: Localized;
  category: GalleryCategory;
  width?: number;
  height?: number;
  order: number;
}

/**
 * A curated collection of gallery images presented as a single premium card
 * (one main image + preview thumbnails). Collections are derived from the flat
 * `gallery` array; each `imageIds` entry references a `GalleryItem.id`.
 */
export interface GalleryCollection {
  id: string;
  category: GalleryCategory;
  title: Localized;
  /** Ordered image ids — first is the main image, the rest are previews. */
  imageIds: string[];
  order: number;
}

export interface PageSeo { title: string; description: string; }

export interface SiteContent {
  nav: { home: string; services: string; gallery: string; contact: string; book: string };
  footer: { blurb: string; rightsLine: string; poweredBy?: string };
  home: {
    hero: { title: string; subtitle: string; ctaBook: string; ctaGallery: string };
    intro: { heading: string; body: string };
    highlights: Array<{ icon: string; title: string; text: string }>;
    servicesSection: { heading: string; subheading: string; viewAll: string };
    gallerySection: { heading: string; subheading: string; viewAll: string };
    memoryTeaser: { heading: string; body: string; cta: string };
    contactTeaser: { heading: string; body: string; cta: string };
    finalCta: { heading: string; cta: string };
  };
  services: { heading: string; subheading: string };
  gallery: { heading: string; subheading: string; filters: Record<GalleryCategory | "all", string> };
  booking: {
    title: string;
    chooseDate: string;
    chooseTime: string;
    selectDateFirst: string;
    continue: string;
    back: string;
    disclaimer: string;
    slotsHeading: string;
    detailsTitle: string;
    detailsSubtitle: string;
    summaryDate: string;
    summaryTime: string;
    fields: {
      name: string;
      phone: string;
      groom: string;
      bride: string;
      guests: string;
      notes: string;
      notesPlaceholder: string;
    };
    submit: string;
    requiredHint: string;
    changeSelection: string;
  };
  contact: {
    heading: string; subheading: string;
    labels: { phone: string; whatsapp: string; address: string; hours: string; directions: string };
    address: string;
    hours?: string;
  };
  seo: { home: PageSeo; services: PageSeo; gallery: PageSeo; contact: PageSeo; booking: PageSeo };
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
  };
  fonts: { displayLatin: string; bodyLatin: string; displayArabic: string; bodyArabic: string };
  radius: string;
  shadow: "soft" | "medium" | "elevated";
  glass: { blur: string; tint: string; tintOpacity: number; borderOpacity: number; noise?: boolean };
}
