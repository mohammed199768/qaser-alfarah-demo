"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type RefAttributes,
} from "react";
import { ArrowLeft, ArrowRight, Heart, MessageCircleHeart } from "lucide-react";
import HTMLFlipBookSource from "@/react-pageflip-master/src";
import type { Locale } from "@/lib/i18n";

type FlipHandle = {
  pageFlip: () => {
    flipNext: (corner?: "top" | "bottom") => void;
    flipPrev: (corner?: "top" | "bottom") => void;
  } | undefined;
};

type FlipEvent = { data: number };

type FlipBookProps = {
  children: ReactNode;
  className: string;
  style: React.CSSProperties;
  startPage: number;
  size: "fixed" | "stretch";
  width: number;
  height: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  drawShadow: boolean;
  flippingTime: number;
  usePortrait: boolean;
  startZIndex: number;
  autoSize: boolean;
  maxShadowOpacity: number;
  showCover: boolean;
  mobileScrollSupport: boolean;
  clickEventForward: boolean;
  useMouseEvents: boolean;
  swipeDistance: number;
  showPageCorners: boolean;
  disableFlipByClick: boolean;
  renderOnlyPageLengthChange: boolean;
  onFlip: (event: FlipEvent) => void;
};

const HTMLFlipBook = HTMLFlipBookSource as unknown as ComponentType<
  FlipBookProps & RefAttributes<FlipHandle>
>;

type AlbumPage = {
  id: string;
  kind: "cover" | "story" | "image" | "final";
  chapter?: string;
  titleAr: string;
  titleEn: string;
  bodyAr?: string;
  bodyEn?: string;
  quoteAr?: string;
  quoteEn?: string;
  image?: string;
  altAr?: string;
  altEn?: string;
};

const ALBUM_PAGES: AlbumPage[] = [
  {
    id: "cover",
    kind: "cover",
    titleAr: "حكاية الفرح",
    titleEn: "The Wedding Story",
    bodyAr: "تفاصيل صغيرة صنعت يومًا كبيرًا",
    bodyEn: "Small details that shaped one extraordinary day",
  },
  {
    id: "prologue",
    kind: "story",
    chapter: "01",
    titleAr: "قبل أن تبدأ الموسيقى",
    titleEn: "Before the Music Begins",
    bodyAr: "يسبق الفرح هدوءٌ قصير؛ نظرة أخيرة إلى التفاصيل، نبضٌ أسرع من المعتاد، وأبواب تنتظر أن تُفتح على بداية جديدة.",
    bodyEn: "Every celebration begins with a quiet pause: one final look at the details, a faster heartbeat, and doors waiting to open onto a new beginning.",
    quoteAr: "البدايات الجميلة لا تحتاج ضجيجًا، يكفي أن تكون صادقة.",
    quoteEn: "Beautiful beginnings need no noise—only truth.",
  },
  {
    id: "arrival-photo",
    kind: "image",
    chapter: "02",
    titleAr: "لحظة الوصول",
    titleEn: "The Arrival",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=76",
    altAr: "عروسان في حفل زفاف أنيق",
    altEn: "A couple at an elegant wedding ceremony",
    quoteAr: "كل الطرق أوصلتنا إلى هذه اللحظة.",
    quoteEn: "Every road brought us to this moment.",
  },
  {
    id: "vows",
    kind: "story",
    chapter: "03",
    titleAr: "وعدٌ أمام الجميع",
    titleEn: "A Promise Witnessed",
    bodyAr: "بين كلمتين وابتسامة، يصبح الوعد ذكرى حيّة. لذلك نصنع للمشهد إيقاعه الخاص: ضوء هادئ، مساحة دافئة، ووقت يكفي ليشعر الجميع بمعناه.",
    bodyEn: "Between a few words and a smile, a promise becomes a living memory. The scene deserves its own rhythm: gentle light, warmth, and enough time for everyone to feel it.",
    quoteAr: "ليست الكلمات وحدها ما يبقى، بل الشعور الذي تركته.",
    quoteEn: "What remains is not only the words, but how they felt.",
  },
  {
    id: "details-photo",
    kind: "image",
    chapter: "04",
    titleAr: "تفاصيل المائدة",
    titleEn: "The Table Details",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=76",
    altAr: "طاولة زفاف مزينة بالزهور والإضاءة",
    altEn: "Wedding table decorated with flowers and warm lights",
    quoteAr: "الضيافة رسالة حب تُقرأ بلا كلمات.",
    quoteEn: "Hospitality is a love letter without words.",
  },
  {
    id: "gathering",
    kind: "story",
    chapter: "05",
    titleAr: "حين يجتمع الأحبة",
    titleEn: "When Loved Ones Gather",
    bodyAr: "القاعة ليست مجرد مكان؛ إنها إطار للقاءات التي انتظرناها طويلًا. كل طاولة تقرّب حكايتين، وكل ضوء يمنح الوجوه دفئًا يليق بها.",
    bodyEn: "A hall is more than a place; it frames reunions long awaited. Every table brings stories closer, and every light gives familiar faces the warmth they deserve.",
    quoteAr: "أجمل الديكورات هي الوجوه التي نحبها.",
    quoteEn: "The most beautiful décor is the faces we love.",
  },
  {
    id: "dance-photo",
    kind: "image",
    chapter: "06",
    titleAr: "الرقصة الأولى",
    titleEn: "The First Dance",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=76",
    altAr: "عروسان يرقصان في ليلة زفافهما",
    altEn: "A newlywed couple dancing at their wedding",
    quoteAr: "للحظةٍ واحدة، اختفى كل شيء وبقينا نحن.",
    quoteEn: "For one moment, everything disappeared but us.",
  },
  {
    id: "afterglow",
    kind: "story",
    chapter: "07",
    titleAr: "ما يبقى بعد الليلة",
    titleEn: "What the Night Leaves Behind",
    bodyAr: "تنتهي الموسيقى، لكن الصور والرسائل والضحكات تظل قريبة. لهذا نؤمن أن توثيق الفرح ليس إضافة؛ بل الفصل الأخير الذي يحفظ كل الفصول قبله.",
    bodyEn: "The music ends, yet photographs, messages, and laughter remain close. Preserving a celebration is not an extra—it is the final chapter that protects every chapter before it.",
    quoteAr: "الذكرى الجميلة عمرٌ آخر للحظة.",
    quoteEn: "A beautiful memory gives a moment another life.",
  },
  {
    id: "memory-photo",
    kind: "image",
    chapter: "08",
    titleAr: "صورة للعمر",
    titleEn: "A Portrait for a Lifetime",
    image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=900&q=76",
    altAr: "لقطة رومانسية لعروسين",
    altEn: "A romantic wedding portrait",
    quoteAr: "سنعود إلى هذه الصورة كلما أردنا أن نتذكر البداية.",
    quoteEn: "We will return to this portrait whenever we want to remember the beginning.",
  },
  {
    id: "final",
    kind: "final",
    titleAr: "والبداية لكم",
    titleEn: "Now, Your Story Begins",
    bodyAr: "كل قصة فرح مختلفة. دعونا نصنع معكم كتابًا لا يشبه سواه.",
    bodyEn: "Every wedding story is different. Let us create one that belongs only to you.",
  },
];

const COPY = {
  ar: {
    label: "ألبوم الفرح التفاعلي",
    previous: "الصفحة السابقة",
    next: "الصفحة التالية",
    page: "صفحة",
    of: "من",
    hint: "اسحب طرف الصفحة أو استخدم الأسهم",
    contact: "ابدأ حكايتك معنا",
  },
  en: {
    label: "Interactive wedding album",
    previous: "Previous page",
    next: "Next page",
    page: "Page",
    of: "of",
    hint: "Drag a page corner or use the arrows",
    contact: "Begin your story with us",
  },
} satisfies Record<Locale, Record<string, string>>;

const AlbumSheet = forwardRef<
  HTMLDivElement,
  { page: AlbumPage; locale: Locale; pageNumber: number }
>(function AlbumSheet({ page, locale, pageNumber }, ref) {
  const isAr = locale === "ar";
  const title = isAr ? page.titleAr : page.titleEn;
  const body = isAr ? page.bodyAr : page.bodyEn;
  const quote = isAr ? page.quoteAr : page.quoteEn;
  const alt = isAr ? page.altAr : page.altEn;

  if (page.kind === "cover") {
    return (
      <article ref={ref} className="album-sheet album-sheet-cover" data-density="hard">
        <div className="album-cover-ornament" aria-hidden="true" />
        <div className="album-cover-content">
          <p>QASR AL-FARAH</p>
          <Heart aria-hidden="true" />
          <h3>{title}</h3>
          <span>{body}</span>
          <small>MMXXVI</small>
        </div>
      </article>
    );
  }

  if (page.kind === "image" && page.image) {
    return (
      <article ref={ref} className="album-sheet album-sheet-image">
        {/* The book is dynamically mounted only after the dialog opens. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={page.image} alt={alt ?? ""} loading="lazy" decoding="async" />
        <div className="album-image-wash" />
        <div className="album-image-caption" dir={isAr ? "rtl" : "ltr"}>
          <small>{page.chapter}</small>
          <h3>{title}</h3>
          {quote && <p>{quote}</p>}
        </div>
        <span className="album-page-number">{pageNumber}</span>
      </article>
    );
  }

  if (page.kind === "final") {
    return (
      <article ref={ref} className="album-sheet album-sheet-final" data-density="hard" dir={isAr ? "rtl" : "ltr"}>
        <div className="album-final-content">
          <MessageCircleHeart aria-hidden="true" />
          <h3>{title}</h3>
          <p>{body}</p>
          <a href="/contact">{COPY[locale].contact}</a>
          <small>QASR AL-FARAH</small>
        </div>
      </article>
    );
  }

  return (
    <article ref={ref} className="album-sheet album-sheet-story" dir={isAr ? "rtl" : "ltr"}>
      <div className="album-story-content">
        <div className="album-story-topline">
          <span>{page.chapter}</span>
          <i />
          <small>QASR AL-FARAH</small>
        </div>
        <h3>{title}</h3>
        <p>{body}</p>
        {quote && <blockquote>{quote}</blockquote>}
        <span className="album-page-number">{pageNumber}</span>
      </div>
    </article>
  );
});

export default function WeddingFlipBook({ locale }: { locale: Locale }) {
  const [pageIndex, setPageIndex] = useState(0);
  const bookRef = useRef<FlipHandle>(null);
  const prefetchedImages = useRef(new Set<string>());
  const copy = COPY[locale];
  const pages = useMemo(() => ALBUM_PAGES, []);

  const onFlip = useCallback((event: FlipEvent) => {
    setPageIndex(event.data);
  }, []);

  useEffect(() => {
    const nextImage = pages
      .slice(pageIndex + 1, pageIndex + 4)
      .find((page) => page.kind === "image" && page.image)?.image;
    if (!nextImage || prefetchedImages.current.has(nextImage)) return;

    const timer = window.setTimeout(() => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = nextImage;
      prefetchedImages.current.add(nextImage);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [pageIndex, pages]);

  const previous = () => bookRef.current?.pageFlip()?.flipPrev("top");
  const next = () => bookRef.current?.pageFlip()?.flipNext("top");

  return (
    <div className="wedding-flipbook-experience">
      <div className="wedding-flipbook-stage" aria-label={copy.label}>
        <HTMLFlipBook
          ref={bookRef}
          className="wedding-flipbook"
          style={{}}
          startPage={0}
          size="stretch"
          width={390}
          height={560}
          minWidth={276}
          maxWidth={430}
          minHeight={398}
          maxHeight={620}
          drawShadow
          flippingTime={520}
          usePortrait
          startZIndex={0}
          autoSize
          maxShadowOpacity={0.2}
          showCover
          mobileScrollSupport
          clickEventForward
          useMouseEvents
          swipeDistance={36}
          showPageCorners
          disableFlipByClick={false}
          renderOnlyPageLengthChange
          onFlip={onFlip}
        >
          {pages.map((page, index) => (
            <AlbumSheet
              key={page.id}
              page={page}
              locale={locale}
              pageNumber={index + 1}
            />
          ))}
        </HTMLFlipBook>
      </div>

      <div className="wedding-flipbook-controls">
        <button type="button" onClick={previous} disabled={pageIndex === 0} aria-label={copy.previous}>
          {locale === "ar" ? <ArrowRight aria-hidden="true" /> : <ArrowLeft aria-hidden="true" />}
        </button>
        <div aria-live="polite">
          <span>{copy.page} {pageIndex + 1} {copy.of} {pages.length}</span>
          <small>{copy.hint}</small>
        </div>
        <button type="button" onClick={next} disabled={pageIndex >= pages.length - 1} aria-label={copy.next}>
          {locale === "ar" ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
