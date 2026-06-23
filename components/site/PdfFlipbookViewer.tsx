"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type RefAttributes,
} from "react";
import { ArrowLeft, ArrowRight, X, PenLine, Download } from "lucide-react";
import HTMLFlipBookSource from "@/react-pageflip-master/src";
import type { Locale } from "@/lib/i18n";
import type { Booklet } from "@/content/site/booklets";
import NoteDrawModal from "@/components/site/NoteDrawModal";
import PremiumSvgLoader from "@/components/site/PremiumSvgLoader";

/* ── react-pageflip (approved local pageflip, demo-only) ─────────────── */
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

/* ── Copy ───────────────────────────────────────────────────────────── */
const COPY = {
  ar: {
    close: "إغلاق",
    previous: "الصفحة السابقة",
    next: "الصفحة التالية",
    page: "صفحة",
    of: "من",
    loading: "جاري فتح الدفتر",
    rendering: "تجهيز الصفحة",
    lightPreparing: "تجهيز وضع القراءة الخفيف",
    error: "تعذّر فتح هذا الملف حالياً. يرجى المحاولة لاحقاً.",
    tabletError: "تعذر فتح الدفتر على هذا الجهاز. جرّب فتحه على جهاز أقوى أو حمّل ملف PDF.",
    openPdf: "فتح ملف PDF",
    lightMode: "وضع القراءة الخفيف",
    writeNote: "اكتب ملاحظة",
    hint: "اسحب طرف الصفحة أو استخدم الأسهم",
  },
  en: {
    close: "Close",
    previous: "Previous page",
    next: "Next page",
    page: "Page",
    of: "of",
    loading: "Opening booklet",
    rendering: "Preparing page",
    lightPreparing: "Preparing light reading mode",
    error: "This file could not be opened right now. Please try again later.",
    tabletError: "This device could not open the booklet. Try a stronger device or download the PDF.",
    openPdf: "Open PDF",
    lightMode: "Light reading mode",
    writeNote: "Write a Note",
    hint: "Drag a page corner or use the arrows",
  },
} satisfies Record<Locale, Record<string, string>>;

/** Hard cap so very large PDFs stay responsive in a demo. */
const MAX_PAGES = 24;
/** Render scale for desktop (full flipbook). */
const DESKTOP_RENDER_SCALE = 1.4;
/** Render scale for light mode (mobile/tablet). */
const LIGHT_RENDER_SCALE = 1.25;

type RenderState =
  | { status: "loading"; done: number; total: number }
  | { status: "error"; message?: string }
  | { status: "ready"; pages: string[]; total: number };

interface PdfFlipbookViewerProps {
  booklet: Booklet;
  locale: Locale;
  whatsappNumber?: string | undefined;
  onClose: () => void;
}

const PageSheet = forwardRef<
  HTMLDivElement,
  { src: string; pageNumber: number; alt: string }
>(function PageSheet({ src, pageNumber, alt }, ref) {
  return (
    <div ref={ref} className="pdf-flip-sheet" data-density="soft">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={`${alt} — ${pageNumber}`} draggable={false} />
    </div>
  );
});

export default function PdfFlipbookViewer({
  booklet,
  locale,
  whatsappNumber,
  onClose,
}: PdfFlipbookViewerProps) {
  const copy = COPY[locale];
  const isAr = locale === "ar";

  const [render, setRender] = useState<RenderState>({
    status: "loading",
    done: 0,
    total: 0,
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [noteOpen, setNoteOpen] = useState(false);
  const bookRef = useRef<FlipHandle>(null);

  // Device detection for Light Reader mode
  const [isLightMode, setIsLightMode] = useState<boolean | null>(null);
  useEffect(() => {
    const mem = (navigator as any).deviceMemory;
    const isLowMem = mem && mem <= 4;
    setIsLightMode(window.innerWidth < 1024 || isLowMem);
  }, []);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Esc closes the viewer; lock body scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const pdfDocRef = useRef<any>(null);
  const [lightPages, setLightPages] = useState<Record<number, string>>({});

  // 1. Load PDF & Desktop render loop
  useEffect(() => {
    if (isLightMode === null) return;

    let cancelled = false;
    let currentRenderTask: any = null;
    let pdfTask: any = null;
    const urls: string[] = [];

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        pdfTask = pdfjs.getDocument({ url: booklet.pdfUrl });
        const doc = await pdfTask.promise;
        if (cancelled) {
          try { void doc.destroy(); } catch {}
          return;
        }

        pdfDocRef.current = doc;
        const total = Math.min(doc.numPages, MAX_PAGES);

        if (isLightMode) {
          // LIGHT MODE: Do not render everything. Just mark as ready.
          setRender({ status: "ready", pages: [], total });
          setPageIndex(0);
        } else {
          // DESKTOP MODE: Render all upfront for flipbook
          setRender({ status: "loading", done: 0, total });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d", { alpha: false });
          if (!ctx) throw new Error("Canvas unavailable");

          for (let n = 1; n <= total; n++) {
            if (cancelled) break;
            const page = await doc.getPage(n);
            const viewport = page.getViewport({ scale: DESKTOP_RENDER_SCALE });
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);
            
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            currentRenderTask = page.render({ canvas, canvasContext: ctx, viewport });
            await currentRenderTask.promise;
            currentRenderTask = null;
            
            urls.push(canvas.toDataURL("image/jpeg", 0.82));
            page.cleanup();
            
            if (!cancelled) {
              setRender({ status: "loading", done: n, total });
            }
          }

          if (!cancelled) {
            await Promise.all(
              urls.map(
                (url) =>
                  new Promise((resolve) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve;
                    img.src = url;
                  })
              )
            );
            setRender({ status: "ready", pages: urls, total });
          }
        }
      } catch (err) {
        if (!cancelled && (err as Error)?.name !== "RenderingCancelledException") {
          console.error("PDF render error:", err);
          setRender({ status: "error", message: (err as Error)?.message || "Unknown error" });
        }
      }
    })();

    return () => {
      cancelled = true;
      if (currentRenderTask) {
        try { currentRenderTask.cancel(); } catch {}
      }
      if (pdfTask) {
        try { void pdfTask.destroy(); } catch {}
      }
      if (pdfDocRef.current) {
        try { void pdfDocRef.current.destroy(); } catch {}
        pdfDocRef.current = null;
      }
    };
  }, [booklet.pdfUrl, isLightMode]);

  // 2. Light Mode lazy render loop
  useEffect(() => {
    if (!isLightMode || render.status !== "ready" || !pdfDocRef.current) return;
    
    let cancelled = false;
    let renderTask: any = null;

    const renderPage = async (idx: number) => {
      if (idx < 0 || idx >= render.total) return;
      if (lightPages[idx]) return; // already in memory

      try {
        const doc = pdfDocRef.current;
        const page = await doc.getPage(idx + 1);
        const viewport = page.getViewport({ scale: LIGHT_RENDER_SCALE });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;
        
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        renderTask = page.render({ canvas, canvasContext: ctx, viewport });
        await renderTask.promise;
        renderTask = null;
        
        const url = canvas.toDataURL("image/jpeg", 0.82);
        page.cleanup();
        
        if (!cancelled) {
          setLightPages((prev) => {
             const nextState: Record<number, string> = { [idx]: url };
             // Keep only adjacent pages to save memory
             if (prev[idx - 1]) nextState[idx - 1] = prev[idx - 1]!;
             if (prev[idx + 1]) nextState[idx + 1] = prev[idx + 1]!;
             return nextState;
          });
        }
      } catch (err) {
        if (!cancelled && (err as Error)?.name !== "RenderingCancelledException") {
          console.error(`Page ${idx+1} render error:`, err);
        }
      }
    };

    renderPage(pageIndex).then(() => {
      if (!cancelled) renderPage(pageIndex + 1);
    });

    return () => {
      cancelled = true;
      if (renderTask) {
        try { renderTask.cancel(); } catch {}
      }
    };
  }, [pageIndex, isLightMode, render.status, lightPages, "total" in render ? render.total : 0]);

  const onFlip = useCallback((e: FlipEvent) => setPageIndex(e.data), []);

  const pages = render.status === "ready" && !isLightMode ? render.pages : [];
  const total = render.status === "ready" ? render.total : 0;

  const previous = () => {
    if (isLightMode) setPageIndex((i) => Math.max(0, i - 1));
    else bookRef.current?.pageFlip()?.flipPrev("top");
  };
  const next = () => {
    if (isLightMode) setPageIndex((i) => Math.min(total - 1, i + 1));
    else bookRef.current?.pageFlip()?.flipNext("top");
  };

  const title = booklet.title[locale];
  const currentPageSrc = isLightMode ? lightPages[pageIndex] : pages[pageIndex];

  let displayPageText = "";
  if (isLightMode || pageIndex === 0) {
    displayPageText = `${pageIndex + 1}`;
  } else if (pageIndex + 1 === total) {
    displayPageText = `${total}`;
  } else {
    displayPageText = `${pageIndex + 1}-${Math.min(pageIndex + 2, total)}`;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      dir={isAr ? "rtl" : "ltr"}
      className="pdf-viewer-overlay fixed inset-0 z-[120] flex flex-col"
      style={{ background: "oklch(0.12 0.012 60 / 0.96)" }}
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <h2
          className="truncate text-base font-semibold sm:text-lg"
          style={{
            color: "oklch(0.96 0.012 84)",
            fontFamily: "var(--font-display-ar), var(--font-display), serif",
          }}
        >
          {title}
        </h2>
        <div className="flex items-center gap-3">
          {isLightMode && render.status === "ready" && (
            <span className="rounded-full px-2 py-0.5 text-[10px] sm:px-3 sm:py-1 font-medium tracking-wide shadow-sm"
                  style={{ background: "oklch(0.2 0.02 60 / 0.6)", color: "oklch(0.8 0.02 60)", border: "1px solid oklch(0.4 0.02 60)" }}>
              {copy.lightMode}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/75 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 pb-2">
        {render.status === "loading" && (
          <PremiumSvgLoader
            variant="modal"
            label={isLightMode ? copy.lightPreparing : copy.loading}
            progress={
              "total" in render && render.total > 0 && !isLightMode
                ? { done: render.done, total: render.total }
                : undefined
            }
            sublabel={
              "total" in render && render.total > 0 && !isLightMode
                ? copy.rendering
                : undefined
            }
          />
        )}

        {render.status === "error" && (
          <div
            className="mx-auto flex max-w-sm flex-col gap-4 rounded-2xl border p-6 text-center text-sm"
            style={{
              borderColor: "oklch(0.70 0.06 40 / 0.4)",
              background: "oklch(0.60 0.06 40 / 0.12)",
              color: "oklch(0.9 0.04 60)",
            }}
          >
            <p>{isLightMode ? copy.tabletError : copy.error}</p>
            {isLightMode && (
              <a
                href={booklet.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                style={{
                  background: "oklch(0.9 0.04 60 / 0.1)",
                  border: "1px solid oklch(0.9 0.04 60 / 0.2)",
                  color: "oklch(0.95 0.02 70)"
                }}
              >
                <Download className="me-2 size-4" aria-hidden="true" />
                {copy.openPdf}
              </a>
            )}
            {process.env.NODE_ENV !== "production" && render.message && (
              <p className="mt-1 text-xs opacity-70 break-words">{render.message}</p>
            )}
          </div>
        )}

        {render.status === "ready" && total > 0 && (
          <>
            {isLightMode ? (
              // Tablet/Mobile: Light Reader
              <div className="flex h-full w-full max-w-2xl items-center justify-center relative">
                {lightPages[pageIndex] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={pageIndex}
                    src={lightPages[pageIndex]}
                    alt={`${title} — ${pageIndex + 1}`}
                    className="max-h-full max-w-full rounded-lg object-contain shadow-2xl animate-in fade-in duration-300"
                    draggable={false}
                  />
                ) : (
                  <PremiumSvgLoader variant="inline" label={`${copy.rendering} ${pageIndex + 1}`} />
                )}
              </div>
            ) : (
              // Desktop: Full Flipbook
              <div className="pdf-flip-stage w-full h-full max-w-[1000px] mx-auto">
                <HTMLFlipBook
                  ref={bookRef}
                  className="pdf-flipbook"
                  style={{}}
                  startPage={0}
                  size="stretch"
                  width={420}
                  height={560}
                  minWidth={300}
                  maxWidth={560}
                  minHeight={420}
                  maxHeight={740}
                  drawShadow
                  flippingTime={520}
                  usePortrait={false}
                  startZIndex={0}
                  autoSize
                  maxShadowOpacity={0.3}
                  showCover={true}
                  mobileScrollSupport
                  clickEventForward
                  useMouseEvents
                  swipeDistance={36}
                  showPageCorners
                  disableFlipByClick={false}
                  renderOnlyPageLengthChange
                  onFlip={onFlip}
                >
                  {pages.map((src, i) => (
                    <PageSheet key={i} src={src} pageNumber={i + 1} alt={title} />
                  ))}
                </HTMLFlipBook>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      {render.status === "ready" && total > 0 && (
        <div className="flex shrink-0 items-center justify-center gap-3 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 sm:gap-5">
          <button
            type="button"
            onClick={previous}
            disabled={pageIndex === 0}
            aria-label={copy.previous}
            className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/75 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {isAr ? <ArrowRight className="size-5" aria-hidden="true" /> : <ArrowLeft className="size-5" aria-hidden="true" />}
          </button>

          <div className="text-center" aria-live="polite">
            <p className="text-xs font-medium" style={{ color: "oklch(0.9 0.03 82)" }}>
              {copy.page} {displayPageText} {copy.of} {total}
            </p>
            <p className="text-[0.65rem] opacity-50" style={{ color: "oklch(0.8 0.03 82)" }}>
              {copy.hint}
            </p>
          </div>

          <button
            type="button"
            onClick={next}
            disabled={pageIndex >= total - (isLightMode ? 1 : 2)}
            aria-label={copy.next}
            className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/75 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            {isAr ? <ArrowLeft className="size-5" aria-hidden="true" /> : <ArrowRight className="size-5" aria-hidden="true" />}
          </button>

          {/* Write a Note */}
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="ms-1 inline-flex h-11 items-center gap-2 rounded-full border px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{
              borderColor: "oklch(0.80 0.10 82 / 0.45)",
              background: "oklch(0.80 0.10 82 / 0.14)",
              color: "oklch(0.92 0.06 84)",
            }}
          >
            <PenLine className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{copy.writeNote}</span>
          </button>
        </div>
      )}

      {noteOpen && currentPageSrc && (
        <NoteDrawModal
          locale={locale}
          backgroundSrc={currentPageSrc}
          whatsappNumber={whatsappNumber}
          onClose={() => setNoteOpen(false)}
        />
      )}
    </div>
  );
}
