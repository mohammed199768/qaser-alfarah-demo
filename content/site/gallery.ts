import type { GalleryItem, GalleryCollection } from "@/types/site-content";

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

/**
 * Curated luxury collections for the gallery page. Each collection renders as a
 * single premium card: the first id in `imageIds` is the main image, the rest
 * are preview thumbnails. We only have one distinct hero image per category, so
 * each collection leads with its own hero and borrows complementary images from
 * the wider set to give every card four varied previews (graceful fallback —
 * no duplicated tiles, no remote images). Clicking a card opens the lightbox at
 * that collection's main image.
 */
export const collections: GalleryCollection[] = [
  {
    id: "collection-hall",
    category: "hall",
    title: { ar: "القاعة", en: "The Hall" },
    imageIds: ["hall-1", "decor-1", "events-1", "couple-1"],
    order: 1
  },
  {
    id: "collection-decoration",
    category: "decoration",
    title: { ar: "الديكور", en: "Decoration" },
    imageIds: ["decor-1", "hall-1", "couple-1", "food-1"],
    order: 2
  },
  {
    id: "collection-food",
    category: "food",
    title: { ar: "الضيافة", en: "Hospitality" },
    imageIds: ["food-1", "events-1", "decor-1", "hall-1"],
    order: 3
  },
  {
    id: "collection-events",
    category: "events",
    title: { ar: "لحظات الفرح", en: "Celebration Moments" },
    imageIds: ["events-1", "couple-1", "hall-1", "decor-1"],
    order: 4
  },
  {
    id: "collection-couple",
    category: "couple",
    title: { ar: "العروسان", en: "The Couple" },
    imageIds: ["couple-1", "events-1", "food-1", "hall-1"],
    order: 5
  }
];
