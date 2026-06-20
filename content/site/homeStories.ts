export interface StorySlide {
  type: "image";
  src: string;
  titleAr: string;
  titleEn: string;
  captionAr?: string;
  captionEn?: string;
}

export interface HomeStory {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  avatar: string;
  slides: StorySlide[];
}

export const HOME_STORIES: HomeStory[] = [
  {
    id: "entrance-moment",
    titleAr: "لحظة الدخول",
    titleEn: "Grand Entrance",
    subtitleAr: "أول خطوة في الفرح",
    subtitleEn: "First step into joy",
    avatar: "/site/gallery/hall-1.jpg",
    slides: [
      {
        type: "image",
        src: "/site/gallery/hall-1.jpg",
        titleAr: "لحظة الدخول",
        titleEn: "Grand Entrance",
        captionAr: "بداية ليلة لا تُنسى",
        captionEn: "The start of an unforgettable night",
      },
      {
        type: "image",
        src: "/site/gallery/decor-1.jpg",
        titleAr: "قاعة الفرح",
        titleEn: "The Hall of Joy",
        captionAr: "تصميم يعكس الأناقة والفخامة",
        captionEn: "Design that reflects elegance and grandeur",
      },
    ],
  },
  {
    id: "hall-ambiance",
    titleAr: "قاعة الفرح",
    titleEn: "The Hall",
    subtitleAr: "فخامة لا مثيل لها",
    subtitleEn: "Unmatched luxury",
    avatar: "/site/gallery/decor-1.jpg",
    slides: [
      {
        type: "image",
        src: "/site/gallery/decor-1.jpg",
        titleAr: "الزينة والإضاءة",
        titleEn: "Décor & Lighting",
        captionAr: "تفاصيل تُبهر العيون",
        captionEn: "Details that dazzle the eyes",
      },
      {
        type: "image",
        src: "/site/hero.jpg",
        titleAr: "أجواء ساحرة",
        titleEn: "Magical Atmosphere",
        captionAr: "كل زاوية تحكي قصة",
        captionEn: "Every corner tells a story",
      },
    ],
  },
  {
    id: "hospitality",
    titleAr: "تفاصيل الضيافة",
    titleEn: "Hospitality",
    subtitleAr: "ضيافة من القلب",
    subtitleEn: "From the heart",
    avatar: "/site/gallery/food-1.jpg",
    slides: [
      {
        type: "image",
        src: "/site/gallery/food-1.jpg",
        titleAr: "المأكولات الفاخرة",
        titleEn: "Fine Dining",
        captionAr: "أشهى الأطباق لأسعد المناسبات",
        captionEn: "The finest dishes for your finest moments",
      },
      {
        type: "image",
        src: "/site/gallery/events-1.jpg",
        titleAr: "لحظات الفرح",
        titleEn: "Joyful Moments",
        captionAr: "ذكريات تدوم للأبد",
        captionEn: "Memories that last forever",
      },
    ],
  },
  {
    id: "memories",
    titleAr: "تصوير الذكريات",
    titleEn: "Memories",
    subtitleAr: "لحظات خالدة",
    subtitleEn: "Timeless moments",
    avatar: "/site/gallery/couple-1.jpg",
    slides: [
      {
        type: "image",
        src: "/site/gallery/couple-1.jpg",
        titleAr: "أجمل اللحظات",
        titleEn: "The Best Moments",
        captionAr: "صور تبقى في القلب",
        captionEn: "Photos that stay in your heart",
      },
      {
        type: "image",
        src: "/site/gallery/hall-1.jpg",
        titleAr: "يوم لا يُنسى",
        titleEn: "An Unforgettable Day",
        captionAr: "من أجمل أيام حياتكم",
        captionEn: "One of the most beautiful days of your life",
      },
    ],
  },
  {
    id: "booking-experience",
    titleAr: "تجربة الحجز",
    titleEn: "Book Now",
    subtitleAr: "بكل سهولة ويسر",
    subtitleEn: "Simple & seamless",
    avatar: "/site/og-image.jpg",
    slides: [
      {
        type: "image",
        src: "/site/og-image.jpg",
        titleAr: "احجز يومك الاستثنائي",
        titleEn: "Reserve Your Special Day",
        captionAr: "حجز سريع وآمن عبر الإنترنت",
        captionEn: "Fast and secure online booking",
      },
      {
        type: "image",
        src: "/site/gallery/events-1.jpg",
        titleAr: "دفتر الذكريات",
        titleEn: "Memory Book",
        captionAr: "كل حفل قصة تروى",
        captionEn: "Every celebration is a story worth telling",
      },
    ],
  },
];
