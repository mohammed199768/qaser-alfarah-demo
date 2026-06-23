import type { Localized } from "@/types/site-content";

/**
 * Static PDF booklets shown on /what-awaits-you. The PDFs already live under
 * public/pdf and are rendered client-side with pdfjs-dist on demand (never on
 * initial load). `pdfUrl` is the public, URL-encoded path (spaces → %20).
 */
export interface Booklet {
  id: string;
  title: Localized;
  description: Localized;
  /** Public, URL-encoded path under /pdf. */
  pdfUrl: string;
  /** Short source/label shown on the card. */
  sourceLabel: Localized;
  /** Cover accent (oklch) for the premium card visual. */
  accent: string;
}

export const booklets: Booklet[] = [
  {
    id: "wedding-planner",
    title: { ar: "مخطط يوم الزفاف", en: "Wedding Planner" },
    description: {
      ar: "دليل تخطيط أنيق يرافقكم خطوة بخطوة نحو يوم زفاف متكامل التفاصيل.",
      en: "An elegant planning guide that walks you step by step toward a flawless wedding day.",
    },
    pdfUrl: "/pdf/The%20Perfect%20Planner%20by%20Basic%20Invite%202026.pdf",
    sourceLabel: { ar: "دفتر التخطيط", en: "Planner booklet" },
    accent: "oklch(0.80 0.11 82)",
  },
  {
    id: "digital-ecosystem",
    title: { ar: "النظام الرقمي المتكامل", en: "Digital Ecosystem" },
    description: {
      ar: "نظرة شاملة على منظومة قصر الفرح الرقمية وكيف تتصل تجربة الحجز والدعوات والذكريات في مكان واحد.",
      en: "A complete look at Qasr Al-Farah’s digital ecosystem, connecting booking, invitations, and memories in one experience.",
    },
    pdfUrl: "/pdf/Qasr_Al-Farah_Digital_Ecosystem%20%281%29.pdf",
    sourceLabel: { ar: "كتيب النظام", en: "Ecosystem Booklet" },
    accent: "oklch(0.82 0.09 60)",
  },
  {
    id: "paper-flowers",
    title: { ar: "تفاصيل الورود الورقية", en: "Paper Flowers" },
    description: {
      ar: "تفاصيل ديكور ورقي راقٍ تضيف دفئًا وحرفية إلى زوايا القاعة.",
      en: "Refined paper décor details that add warmth and craftsmanship to every corner of the hall.",
    },
    pdfUrl: "/pdf/_OceanofPDF.com_Paper_Flowers_-_JL_Jackola.pdf",
    sourceLabel: { ar: "كتيب الديكور", en: "Décor booklet" },
    accent: "oklch(0.78 0.08 40)",
  },
  {
    id: "digital-transformation",
    title: { ar: "التحول الرقمي", en: "Digital Transformation" },
    description: {
      ar: "شرح مختصر للتحول من المتابعة اليدوية إلى تجربة رقمية منظمة وواضحة لصالة الأفراح.",
      en: "A concise overview of the shift from manual coordination to a clear digital wedding hall experience.",
    },
    pdfUrl: "/pdf/Qasr_Al-Farah_Digital_Transformation.pdf",
    sourceLabel: { ar: "كتيب التحول", en: "Transformation Booklet" },
    accent: "oklch(0.74 0.07 76)",
  },
  {
    id: "digital-experience",
    title: { ar: "التجربة الرقمية", en: "Digital Experience" },
    description: {
      ar: "استعراض لطريقة تقديم تجربة قصر الفرح الرقمية للعميل من أول زيارة حتى تأكيد التفاصيل.",
      en: "A walkthrough of the Qasr Al-Farah digital experience from first visit to confirmed details.",
    },
    pdfUrl: "/pdf/Qasr_Al-Farah_Digital_Experience.pdf",
    sourceLabel: { ar: "كتيب التجربة", en: "Experience Booklet" },
    accent: "oklch(0.66 0.10 80)",
  },
];
