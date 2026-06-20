import type { Locale } from "@/lib/i18n";
import { siteConfig } from "./site.config";
import ar from "./content.ar.json";
import en from "./content.en.json";
import { services } from "./services";
import { gallery } from "./gallery";
import type { SiteContent, ServiceItem, GalleryItem } from "@/types/site-content";

const content: Record<Locale, SiteContent> = {
  ar: ar as SiteContent,
  en: en as SiteContent
};

export const getSiteConfig = () => siteConfig;
export const getContent = (locale: Locale): SiteContent => content[locale] ?? content.ar;
export const getServices = (): ServiceItem[] => [...services].sort((a, b) => a.order - b.order);
export const getGallery = (): GalleryItem[] => [...gallery].sort((a, b) => a.order - b.order);
export const getSeo = (locale: Locale, page: keyof SiteContent["seo"]) => getContent(locale).seo[page];
