export type HomeTestimonial = {
  id: string;
  sourceAr: string;
  sourceEn: string;
  handle: string;
  authorAr: string;
  authorEn: string;
  messageAr: string;
  messageEn: string;
  contextAr: string;
  contextEn: string;
  reactionAr?: string;
  reactionEn?: string;
  featured?: boolean;
};

export const homeTestimonials: HomeTestimonial[] = [
  {
    id: "organization",
    sourceAr: "رد على الستوري",
    sourceEn: "Story reply",
    handle: "@farah_guest",
    authorAr: "عائلة العريس",
    authorEn: "Groom family",
    contextAr: "بعد الحفل",
    contextEn: "After the wedding",
    messageAr:
      "بصراحة كل شيء كان مرتب من أول ما دخلنا القاعة. الأجواء كانت فخمة ومريحة، والضيوف ظلوا يحكوا عن جمال المكان.",
    messageEn:
      "Everything felt organized from the moment we entered the hall. The atmosphere was elegant and comfortable, and guests kept talking about how beautiful the place was.",
    reactionAr: "كانت ليلة بتجنن",
    reactionEn: "A beautiful night",
    featured: true,
  },
  {
    id: "ambiance",
    sourceAr: "من رسائل إنستغرام",
    sourceEn: "Instagram message",
    handle: "@bride_side",
    authorAr: "أهل العروس",
    authorEn: "Bride family",
    contextAr: "ليلة الزفاف",
    contextEn: "Wedding night",
    messageAr:
      "أكثر شيء ريّحنا أن التفاصيل كانت واضحة، وما حسّينا بتوتر يوم الحفل. كل شيء مشى بهدوء وترتيب.",
    messageEn:
      "What comforted us most was that the details were clear, and we did not feel stressed on the wedding day. Everything went smoothly and calmly.",
    reactionAr: "الله يعطيكم العافية",
    reactionEn: "Thank you",
    featured: false,
  },
  {
    id: "accessibility",
    sourceAr: "رسالة من ضيف",
    sourceEn: "Guest message",
    handle: "@wedding_guest",
    authorAr: "أحد ضيوف الحفل",
    authorEn: "Wedding guest",
    contextAr: "بعد المناسبة",
    contextEn: "After the event",
    messageAr:
      "المكان مرتب، الوصول سهل، والقعدة كانت مريحة. حسّينا أن الحفل معمول بعناية مش بس قاعة وخلاص.",
    messageEn:
      "The place was organized, easy to reach, and comfortable. It felt like the wedding was prepared with care, not just hosted in a hall.",
    reactionAr: "😍",
    reactionEn: "😍",
    featured: false,
  },
  {
    id: "memory-book",
    sourceAr: "تعليق بعد الحفل",
    sourceEn: "Post-wedding note",
    handle: "@memory_moment",
    authorAr: "من تجربة الضيوف",
    authorEn: "Guest experience",
    contextAr: "دفتر الذكريات",
    contextEn: "Memory book",
    messageAr:
      "فكرة دفتر الذكريات كانت حلوة كثير. الكلمات والصور خلت الحفل يضل موجود حتى بعد ما خلصت الليلة.",
    messageEn:
      "The memory book idea was really nice. The words and photos made the wedding feel alive even after the night ended.",
    reactionAr: "ذكرى بتبقى",
    reactionEn: "A lasting memory",
    featured: false,
  },
];
