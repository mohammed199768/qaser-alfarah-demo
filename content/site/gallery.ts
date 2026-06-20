import type { GalleryItem } from "@/types/site-content";

export const gallery: GalleryItem[] = [
  {
    id: "hall-1",
    order: 1,
    category: "hall",
    src: "/site/gallery/hall-1.jpg",
    width: 1600,
    height: 873,
    alt: { ar: "القاعة الرئيسية", en: "Main hall" }
  },
  {
    id: "decor-1",
    order: 2,
    category: "decoration",
    src: "/site/gallery/decor-1.jpg",
    width: 1600,
    height: 873,
    alt: { ar: "ديكور المنصة", en: "Stage decoration" }
  },
  {
    id: "food-1",
    order: 3,
    category: "food",
    src: "/site/gallery/food-1.jpg",
    width: 1600,
    height: 873,
    alt: { ar: "بوفيه العشاء", en: "Dinner buffet" }
  },
  {
    id: "events-1",
    order: 4,
    category: "events",
    src: "/site/gallery/events-1.jpg",
    width: 1600,
    height: 893,
    alt: { ar: "أجواء الاحتفال", en: "Celebration atmosphere" }
  },
  {
    id: "couple-1",
    order: 5,
    category: "couple",
    src: "/site/gallery/couple-1.jpg",
    width: 1600,
    height: 899,
    alt: { ar: "العروسين", en: "The couple" }
  }
];
