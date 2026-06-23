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
import { ArrowLeft, ArrowRight, X, PenLine } from "lucide-react";
import HTMLFlipBookSource from "@/react-pageflip-master/src";
import type { Locale } from "@/lib/i18n";
import type { Booklet } from "@/content/site/booklets";
import NoteDrawModal from "@/components/site/NoteDrawModal";

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
    loading: "جارٍ تحضير الدفتر…",
    rendering: "جارٍ تجهيز الصفحات",
    error: "تعذّر فتح هذا الملف حالياً. يرجى المحاولة لاحقاً.",
    writeNote: "اكتب ملاحظة",
    hint: "اسحب طرف الصفحة أو استخدم الأسهم",
  },
  en: {
    close: "Close",
    previous: "Previous page",
    next: "Next page",
    page: "Page",
    of: "of",
    loading: "Preparing the booklet…",
    rendering: "Rendering pages",
    error: "This file could not be opened right now. Please try again later.",
    writeNote: "Write a Note",
    hint: "Drag a page corner or use the arrows",
  },
} satisfies Record<Locale, Record<string, string>>;

/** Hard cap so very large PDFs stay responsive in a demo. */
const MAX_PAGES = 24;
/** Render scale — balances sharpness vs. memory. */
const RENDER_SCALE = 1.4;

type RenderState =
  | { status: "loading"; done: number; total: number }
  | { status: "error" }
  | { status: "ready"; pages: string[] };

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
      {/* PDF pages are rendered client-side to data URLs in memory. */}
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
  const [isNarrow, setIsNarrow] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const bookRef = useRef<FlipHandle>(null);

  // Track narrow viewports → single-page fallback (more stable than pageflip on phones).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
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

  // Load + render the selected PDF (client-only, on mount of this viewer).
  useEffect(() => {
    let cancelled = false;
    let currentRenderTask: any = null;
    let pdfTask: any = null;
    const urls: string[] = [];

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        // Bundler-resolved worker URL (Turbopack/webpack friendly, no CDN).
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        pdfTask = pdfjs.getDocument({ url: booklet.pdfUrl });
        const doc = await pdfTask.promise;
        if (cancelled) {
          try { void pdfTask.destroy(); } catch {}
          return;
        }

        const total = Math.min(doc.numPages, MAX_PAGES);
        setRender({ status: "loading", done: 0, total });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("Canvas unavailable");

        for (let n = 1; n <= total; n++) {
          if (cancelled) break;
          const page = await doc.getPage(n);
          const viewport = page.getViewport({ scale: RENDER_SCALE });
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

        try { void pdfTask.destroy(); } catch {}
        pdfTask = null;

        if (!cancelled) {
          // Preload images so they are fully decoded before the flipbook mounts.
          // This avoids the pdfjs-dist "Dependent image isn't ready yet" warnings
          // caused by flipbook mounting too early or images not ready.
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
        }

        if (!cancelled) {
          setRender({ status: "ready", pages: urls });
        }
      } catch (err) {
        if (!cancelled && (err as Error)?.name !== "RenderingCancelledException") {
          console.error("PDF render error:", err);
          setRender({ status: "error" });
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
    };
  }, [booklet.pdfUrl]);

  const onFlip = useCallback((e: FlipEvent) => setPageIndex(e.data), []);

  const pages = render.status === "ready" ? render.pages : [];
  const total = pages.length;

  const previous = () => {
    if (isNarrow) setPageIndex((i) => Math.max(0, i - 1));
    else bookRef.current?.pageFlip()?.flipPrev("top");
  };
  const next = () => {
    if (isNarrow) setPageIndex((i) => Math.min(total - 1, i + 1));
    else bookRef.current?.pageFlip()?.flipNext("top");
  };

  const title = booklet.title[locale];
  const currentPageSrc = pages[pageIndex];

  let displayPageText = "";
  if (isNarrow || pageIndex === 0) {
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
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white/75 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 pb-2">
        {render.status === "loading" && (
          <div className="flex flex-col items-center gap-4 text-center" style={{ color: "oklch(0.86 0.04 82)" }}>
            <span
              className="size-10 animate-spin rounded-full border-2 border-white/20"
              style={{ borderTopColor: "oklch(0.84 0.10 82)" }}
              aria-hidden="true"
            />
            <p className="text-sm">{copy.loading}</p>
            {render.total > 0 && (
              <p className="text-xs opacity-70" aria-live="polite">
                {copy.rendering}: {render.done} / {render.total}
              </p>
            )}
          </div>
        )}

        {render.status === "error" && (
          <div
            className="mx-auto max-w-sm rounded-2xl border p-6 text-center text-sm"
            style={{
              borderColor: "oklch(0.70 0.06 40 / 0.4)",
              background: "oklch(0.60 0.06 40 / 0.12)",
              color: "oklch(0.9 0.04 60)",
            }}
          >
            {copy.error}
          </div>
        )}

        {render.status === "ready" && total > 0 && (
          <>
            {isNarrow ? (
              // Mobile: stable single-page viewer (no pageflip).
              <div className="flex h-full w-full max-w-md items-center justify-center">
                {currentPageSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentPageSrc}
                    alt={`${title} — ${pageIndex + 1}`}
                    className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                    draggable={false}
                  />
                )}
              </div>
            ) : (
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
            disabled={pageIndex >= total - (isNarrow ? 1 : 2)}
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

      {noteOpen && (
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
