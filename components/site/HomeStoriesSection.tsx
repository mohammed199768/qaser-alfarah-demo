"use client";

import { useState, useEffect, useCallback, useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { HOME_STORIES, type HomeStory } from "@/content/site/homeStories";
import { StoriesRevealBridge } from "@/components/site/StoriesRevealBridge";
import type { Locale } from "@/lib/i18n";

// ─── Constants ────────────────────────────────────────────────────────────────
const SLIDE_DURATION = 4500;
const STORIES_COPY = {
  ar: {
    sectionLabel: "قصص القصر",
    titleMain: "لحظات",
    titleHighlight: "لا تُنسى",
    subtitle: "اكتشف أجواء قصر الفرح من خلال قصصنا",
    reelsTitle: "أجمل أيامك هنا",
    openStory: "افتح قصة",
    close: "إغلاق",
    previous: "السابق",
    next: "التالي",
    brand: "قصر الفرح",
  },
  en: {
    sectionLabel: "Palace stories",
    titleMain: "Unforgettable",
    titleHighlight: "Moments",
    subtitle: "Discover the atmosphere of Qasr Al-Farah through our stories",
    reelsTitle: "Your Best Days Live Here",
    openStory: "Open story",
    close: "Close",
    previous: "Previous",
    next: "Next",
    brand: "Qasr Al-Farah",
  },
} satisfies Record<Locale, Record<string, string>>;

const REEL_POSITIONS: CSSProperties[] = [
  { top: "0%", left: "38%" },
  { top: "26%", left: "77%" },
  { top: "72%", left: "72%" },
  { top: "72%", left: "5%" },
  { top: "26%", left: "0%" },
];

// ─── Visibility hook (inline to keep island self-contained) ──────────────────
function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const check = () =>
      setVisible(document.visibilityState === "visible" && document.hasFocus());
    const onFocus = () => setVisible(true);
    const onBlur = () => setVisible(false);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", check);
    check();
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);
  return visible;
}

// ─── SVG icons (no lucide-react dependency) ───────────────────────────────────
function IconClose() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ─── Modal viewer ─────────────────────────────────────────────────────────────
interface ModalProps {
  story: HomeStory;
  slideIndex: number;
  locale: Locale;
  isPaused: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onPauseChange: (paused: boolean) => void;
}

function StoryModal({
  story,
  slideIndex,
  locale,
  isPaused,
  onClose,
  onNext,
  onPrev,
  onPauseChange,
}: ModalProps) {
  const slide = story.slides[slideIndex];
  if (!slide) return null;
  const copy = STORIES_COPY[locale];
  const isAr = locale === "ar";
  const storyTitle = isAr ? story.titleAr : story.titleEn;
  const storySubtitle = isAr ? story.subtitleAr : story.subtitleEn;
  const slideTitle = isAr ? slide.titleAr : slide.titleEn;
  const slideCaption = isAr ? slide.captionAr : slide.captionEn;

  return (
    <div
      className="stories-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={storyTitle}
    >
      {/* Card wrapper — stops click propagation */}
      <div
        className="stories-card"
        dir={isAr ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => onPauseChange(true)}
        onMouseUp={() => onPauseChange(false)}
        onMouseLeave={() => onPauseChange(false)}
        onTouchStart={() => onPauseChange(true)}
        onTouchEnd={() => onPauseChange(false)}
      >
        {/* Media */}
        <div className="stories-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`${story.id}-${slideIndex}`}
            src={slide.src}
            alt={slideTitle}
            className="stories-img"
          />
          <div className="stories-vignette" aria-hidden="true" />
        </div>

        {/* Top UI */}
        <div className="stories-top">
          {/* Progress bars */}
          <div className="stories-bars" aria-hidden="true">
            {story.slides.map((_, i) => (
              <div key={i} className="stories-bar-track">
                <div
                  className="stories-bar-fill"
                  style={{
                    width:
                      i < slideIndex
                        ? "100%"
                        : i === slideIndex
                        ? isPaused
                          ? undefined
                          : "100%"
                        : "0%",
                    transitionDuration:
                      i === slideIndex && !isPaused ? `${SLIDE_DURATION}ms` : "0ms",
                    transitionProperty: "width",
                    transitionTimingFunction: "linear",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="stories-header">
            <div className="stories-identity">
              <div className="stories-avatar-ring">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.avatar}
                  alt={storyTitle}
                  className="stories-avatar-img"
                />
              </div>
              <div>
                <p className="stories-name">{storyTitle}</p>
                <p className="stories-sub">{storySubtitle}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="stories-close"
              aria-label={copy.close}
            >
              <IconClose />
            </button>
          </div>
        </div>

        {/* Stealth nav zones */}
        <div className="stories-zones" aria-hidden="true">
          <div
            className="stories-zone-left"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          />
          <div className="stories-zone-right"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          />
        </div>

        {/* Caption overlay */}
        <div className="stories-caption">
          <div className="stories-tag">
            <span className="stories-tag-title">{slideTitle}</span>
            {slideCaption && (
              <span className="stories-tag-sub">{slideCaption}</span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop nav arrows */}
      <div className="stories-arrows">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="stories-arrow"
          aria-label={copy.previous}
          disabled={slideIndex === 0}
        >
          <IconChevronLeft />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="stories-arrow"
          aria-label={copy.next}
        >
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function HomeStoriesSection({ locale }: { locale: Locale }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const isPageVisible = usePageVisible();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copy = STORIES_COPY[locale];
  const isAr = locale === "ar";

  useEffect(() => {
    const timeout = window.setTimeout(() => setMounted(true), 0);

    return () => window.clearTimeout(timeout);
  }, []);

  // Close
  const closeStories = useCallback(() => {
    if (activeIdx !== null) {
      const story = HOME_STORIES[activeIdx];
      if (story) setSeen((prev) => new Set(prev).add(story.id));
    }
    setActiveIdx(null);
    setSlideIdx(0);
    setIsPaused(false);
  }, [activeIdx]);

  // Next slide / next story
  const nextSlide = useCallback(() => {
    if (activeIdx === null) return;
    const story = HOME_STORIES[activeIdx];
    if (!story) return;
    if (slideIdx < story.slides.length - 1) {
      setSlideIdx((s) => s + 1);
    } else if (activeIdx < HOME_STORIES.length - 1) {
      setSeen((prev) => new Set(prev).add(story.id));
      setActiveIdx(activeIdx + 1);
      setSlideIdx(0);
    } else {
      closeStories();
    }
  }, [activeIdx, slideIdx, closeStories]);

  // Prev slide / prev story
  const prevSlide = useCallback(() => {
    if (slideIdx > 0) {
      setSlideIdx((s) => s - 1);
    } else if (activeIdx !== null && activeIdx > 0) {
      const prevStoryIdx = activeIdx - 1;
      const prevStory = HOME_STORIES[prevStoryIdx];
      if (!prevStory) return;
      setActiveIdx(prevStoryIdx);
      setSlideIdx(prevStory.slides.length - 1);
    }
  }, [activeIdx, slideIdx]);

  // Auto-advance timer
  useEffect(() => {
    if (activeIdx !== null && !isPaused && isPageVisible) {
      timerRef.current = setTimeout(nextSlide, SLIDE_DURATION);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIdx, slideIdx, isPaused, nextSlide, isPageVisible]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeIdx === null) return;
      if (e.key === "Escape") closeStories();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, closeStories, nextSlide, prevSlide]);

  // Body scroll lock
  useEffect(() => {
    if (activeIdx !== null) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      return () => {
        document.body.style.overflow = prev;
        document.body.style.touchAction = "";
      };
    }
  }, [activeIdx]);

  return (
    <section
      id="stories"
      dir={isAr ? "rtl" : "ltr"}
      className="stories-section scene-stories"
      aria-label={copy.sectionLabel}
    >
      {/* Section header */}
      <div className="stories-section-header">
        <span className="scene-header-arch" aria-hidden="true" />
        <h2 className="stories-section-title">
          <span className="stories-section-title-main">{copy.titleMain}</span>
          {" "}
          <span className="stories-section-title-highlight">{copy.titleHighlight}</span>
        </h2>
        <p className="stories-section-sub">
          {copy.subtitle}
        </p>
      </div>

      <div className="stories-reveal-stage" data-stories-video-stage="" data-reels-anchor="">
        <div className="stories-cinema-backdrop" aria-hidden="true" />
        <span className="stories-cinema-beam stories-cinema-beam--l" aria-hidden="true" />
        <span className="stories-cinema-beam stories-cinema-beam--r" aria-hidden="true" />
        <div className="stories-video-shell" data-stories-video-shell="">
          <video
            className="stories-reveal-video"
            poster="/site/hero.jpg"
            muted
            playsInline
            loop
            preload="metadata"
            data-stories-video=""
          />
          <div className="stories-video-shade" aria-hidden="true" />
          <div className="stories-video-mark" aria-hidden="true">
            {copy.brand}
          </div>
        </div>
        <div className="stories-cinema-reflection" aria-hidden="true" />
      </div>

      <div id="reels" className="stories-reels-section" data-stories-reels-section="">
        <h3 className="stories-type-title" aria-label={copy.reelsTitle} data-stories-type-title="">
          {copy.reelsTitle}
        </h3>

        <div className="stories-reels-orbit" aria-hidden="true" data-stories-reels-layer="">
          <div className="stories-reels-phone-wrap" data-stories-phone-wrap="">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/site/phone-rsvp-removebg-preview.png"
              alt=""
              className="stories-phone-device"
              aria-hidden="true"
              data-stories-phone=""
            />
          </div>

          <div className="stories-bubbles" role="list" data-stories-reels="">
        {HOME_STORIES.map((story, idx) => {
          const isSeen = seen.has(story.id);
          const storyTitle = isAr ? story.titleAr : story.titleEn;
          return (
            <button
              key={story.id}
              role="listitem"
              style={REEL_POSITIONS[idx % REEL_POSITIONS.length]}
              onClick={() => {
                setActiveIdx(idx);
                setSlideIdx(0);
                setIsPaused(false);
              }}
              className="stories-bubble-btn"
              aria-label={`${copy.openStory}: ${storyTitle}`}
            >
              <div
                className={`stories-bubble-ring ${isSeen ? "stories-bubble-ring--seen" : "stories-bubble-ring--unseen"}`}
              >
                <div className="stories-bubble-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.avatar}
                    alt={storyTitle}
                    className={`stories-bubble-avatar ${isSeen ? "stories-bubble-avatar--seen" : ""}`}
                  />
                  {isSeen && <div className="stories-bubble-seen-overlay" aria-hidden="true" />}
                </div>
              </div>
              <span className={`stories-bubble-label ${isSeen ? "stories-bubble-label--seen" : ""}`}>
                {storyTitle}
              </span>
            </button>
          );
        })}
      </div>
        </div>
      </div>
      <StoriesRevealBridge />

      {/* Portal modal */}
      {mounted && activeIdx !== null && (() => {
        const activeStory = HOME_STORIES[activeIdx];
        if (!activeStory) return null;
        return createPortal(
          <StoryModal
            story={activeStory}
            slideIndex={slideIdx}
            locale={locale}
            isPaused={isPaused}
            onClose={closeStories}
            onNext={nextSlide}
            onPrev={prevSlide}
            onPauseChange={setIsPaused}
          />,
          document.body
        );
      })()}

      <style>{`
        /* ── Section wrapper ─────────────────────────────── */
        .stories-section {
          width: 100%;
          scroll-margin-top: 6rem;
          padding: 3.5rem 1rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          overflow-x: hidden;
          position: relative;
          z-index: 10;
        }

        /* ── Section header ──────────────────────────────── */
        .stories-section-header {
          text-align: center;
        }
        .stories-section-title {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 700;
          line-height: 1.15;
          color: oklch(0.20 0.022 58);
          font-family: var(--font-display-ar), var(--font-display), serif;
          margin: 0 0 0.5rem;
        }
        .stories-section-title-highlight {
          color: oklch(0.60 0.09 76);
        }
        .stories-section-sub {
          font-size: 0.95rem;
          color: oklch(0.50 0.016 58);
          margin: 0;
        }

        .stories-reveal-stage {
          position: relative;
          isolation: isolate;
          display: grid;
          justify-items: center;
          width: min(100%, 68rem);
          margin-top: 0.25rem;
        }

        /* Warm champagne halo behind the video — carries the hero atmosphere
           into the stories scene instead of a hard cut. Static, paint-cheap. */
        .stories-reveal-stage::before {
          content: "";
          position: absolute;
          inset: -14% -8%;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 62% 52% at 50% 36%, oklch(0.92 0.05 80 / 0.40), transparent 70%),
            radial-gradient(ellipse 36% 30% at 78% 70%, oklch(0.95 0.024 22 / 0.22), transparent 72%);
        }

        .stories-video-shell {
          position: relative;
          z-index: 2;
          width: min(100%, 52rem);
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border: 1px solid oklch(1 0 0 / 0.76);
          border-radius: 1.35rem;
          background: oklch(0.14 0.02 58);
          box-shadow:
            0 30px 70px oklch(0.24 0.03 58 / 0.16),
            0 0 0 1px oklch(0.76 0.10 82 / 0.13);
          outline: 1px solid oklch(0.76 0.10 82 / 0.35);
          outline-offset: 10px;
          transform-origin: center bottom;
          will-change: auto;
        }

        .stories-reveal-video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          user-select: none;
        }

        .stories-video-shade {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(180deg, oklch(0 0 0 / 0.10), transparent 42%, oklch(0 0 0 / 0.28)),
            radial-gradient(circle at 50% 20%, oklch(1 0 0 / 0.16), transparent 48%);
        }

        .stories-video-mark {
          position: absolute;
          inset-inline-start: 1.15rem;
          bottom: 1rem;
          z-index: 1;
          color: oklch(1 0 0 / 0.76);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.22em;
        }

        .stories-reels-section {
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(1.5rem, 4vw, 2.75rem);
          width: min(100%, 68rem);
          min-height: clamp(36rem, 78vh, 50rem);
          margin-top: clamp(3rem, 7vw, 5.5rem);
          padding-block: clamp(2.5rem, 6vh, 4.5rem);
          scroll-margin-top: 7rem;
          direction: inherit;
        }

        .stories-reels-orbit {
          position: relative;
          z-index: 1;
          width: min(100%, 42rem);
          aspect-ratio: 1;
          opacity: 0;
          pointer-events: none;
          transform: translateY(3rem) scale(0.98);
          transform-origin: center;
          will-change: auto;
        }

        .stories-reels-orbit::before,
        .stories-reels-orbit::after {
          content: "";
          position: absolute;
          inset: 12%;
          border: 1px solid oklch(0.76 0.10 82 / 0.18);
          border-radius: 50%;
          pointer-events: none;
        }

        .stories-reels-orbit::after {
          inset: 24%;
          border-style: dashed;
          opacity: 0.58;
        }

        .stories-reels-phone-wrap {
          position: absolute;
          inset: 50% auto auto 50%;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          width: clamp(12rem, 31vw, 18.5rem);
        }

        .stories-phone-device {
          position: relative;
          z-index: 2;
          width: 100%;
          height: auto;
          opacity: 0;
          pointer-events: none;
          transform-origin: center;
          filter: drop-shadow(0 28px 36px oklch(0.18 0.02 58 / 0.26));
          will-change: auto;
        }

        .stories-type-title {
          position: relative;
          z-index: 4;
          margin: 0;
          color: oklch(0.19 0.025 58);
          font-family: var(--font-display-ar), var(--font-display), serif;
          font-size: clamp(1.95rem, 4.6vw, 3.85rem);
          font-weight: 800;
          line-height: 1.05;
          text-align: center;
          text-wrap: balance;
          opacity: 0;
          transform: translateY(1.75rem);
          transform-origin: center;
          will-change: auto;
        }

        .stories-reels-section--active .stories-phone-device,
        .stories-reels-section--active .stories-type-title,
        .stories-reels-section--active .stories-reels-orbit {
          will-change: transform, opacity;
        }

        #reels:target .stories-phone-device {
          opacity: 1 !important;
          transform: none !important;
        }

        #reels:target .stories-type-title {
          opacity: 1 !important;
          transform: none !important;
        }

        #reels:target .stories-reels-orbit {
          opacity: 1 !important;
          pointer-events: auto !important;
          transform: none !important;
        }

        #reels:target .stories-bubble-btn {
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }

        /* ── Bubbles orbit ───────────────────────────────── */
        .stories-bubbles {
          position: absolute;
          inset: 0;
          overflow: visible;
          width: 100%;
          height: 100%;
        }
        .stories-bubbles::-webkit-scrollbar { display: none; }

        @media (max-width: 767px) {
          .stories-reveal-stage {
            width: 100%;
          }

          .stories-video-shell {
            border-radius: 1rem;
          }

          .stories-video-mark {
            inset-inline-start: 0.85rem;
            bottom: 0.75rem;
            font-size: 0.58rem;
          }

          .stories-reels-section {
            gap: 1.25rem;
            min-height: 33rem;
            margin-top: 2.75rem;
            padding-block: 2rem 2.75rem;
          }

          .stories-reels-orbit {
            width: min(100%, 22rem);
          }

          .stories-reels-phone-wrap {
            width: clamp(9rem, 42vw, 11.5rem);
          }

          .stories-type-title {
            font-size: clamp(1.65rem, 8.5vw, 2.65rem);
            max-width: 18rem;
          }
        }

        .stories-bubble-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          width: clamp(4.75rem, 12vw, 7.25rem);
          flex-shrink: 0;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: transform 0.2s ease;
        }
        .stories-bubble-btn:hover .stories-bubble-ring { transform: scale(1.05); }
        .stories-bubble-btn:active .stories-bubble-ring { transform: scale(0.95); }
        .stories-bubble-btn:focus-visible {
          outline: 2px solid oklch(0.76 0.10 82);
          outline-offset: 4px;
          border-radius: 50%;
        }

        /* ── Ring ────────────────────────────────────────── */
        .stories-bubble-ring {
          padding: 3px;
          border-radius: 50%;
          transition: opacity 0.3s ease, transform 0.2s ease;
        }
        .stories-bubble-ring--unseen {
          background: conic-gradient(
            from 180deg,
            oklch(0.76 0.10 82),
            oklch(0.68 0.14 30),
            oklch(0.55 0.18 340),
            oklch(0.76 0.10 82)
          );
          box-shadow: 0 8px 24px oklch(0.68 0.14 30 / 0.28);
        }
        .stories-bubble-ring--seen {
          background: oklch(0.85 0.006 58);
          opacity: 0.5;
        }

        .stories-bubble-inner {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: oklch(0.99 0.006 84);
          padding: 2px;
          overflow: hidden;
          position: relative;
        }
        @media (min-width: 768px) {
          .stories-bubble-inner {
            width: 110px;
            height: 110px;
          }
        }
        @media (max-width: 767px) {
          .stories-bubble-inner {
            width: 62px;
            height: 62px;
          }
        }

        .stories-bubble-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          transition: filter 0.3s ease;
        }
        .stories-bubble-avatar--seen { filter: grayscale(60%); }
        .stories-bubble-btn:hover .stories-bubble-avatar { filter: brightness(1.1); }

        .stories-bubble-seen-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: oklch(0 0 0 / 0.25);
        }

        .stories-bubble-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: oklch(0.28 0.018 58);
          text-align: center;
          max-width: 90px;
          line-height: 1.3;
          font-family: var(--font-display-ar), var(--font-display), serif;
          transition: color 0.3s;
        }
        @media (min-width: 768px) {
          .stories-bubble-label { font-size: 0.95rem; max-width: 120px; }
        }
        @media (max-width: 767px) {
          .stories-bubble-label {
            font-size: 0.68rem;
            max-width: 4.8rem;
          }
        }
        .stories-bubble-label--seen { color: oklch(0.62 0.008 58); }

        /* ── Modal overlay ───────────────────────────────── */
        .stories-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: oklch(0 0 0 / 0.55);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          overscroll-behavior: none;
          touch-action: none;
        }

        /* ── Story card ──────────────────────────────────── */
        .stories-card {
          position: relative;
          width: 100%;
          height: 100dvh;
          background: oklch(0.06 0 0);
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .stories-card {
            width: 380px;
            height: min(90vh, 720px);
            border-radius: 2rem;
            box-shadow: 0 40px 100px oklch(0 0 0 / 0.7);
            border: 1px solid oklch(1 0 0 / 0.08);
          }
        }
        @media (min-width: 768px) {
          .stories-card {
            width: 440px;
            height: min(90vh, 840px);
          }
        }

        /* ── Media ───────────────────────────────────────── */
        .stories-media {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: oklch(0.06 0 0);
        }
        .stories-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          user-select: none;
          pointer-events: none;
          animation: stories-fadein 0.35s ease;
        }
        @keyframes stories-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .stories-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            oklch(0 0 0 / 0.5) 0%,
            transparent 35%,
            transparent 55%,
            oklch(0 0 0 / 0.75) 100%
          );
          pointer-events: none;
        }

        /* ── Top UI ──────────────────────────────────────── */
        .stories-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          padding: 1rem 1rem 3rem;
          background: linear-gradient(to bottom, oklch(0 0 0 / 0.6), transparent);
        }
        @media (min-width: 640px) {
          .stories-top { padding: 1.25rem 1.25rem 3rem; }
        }

        /* ── Progress bars ───────────────────────────────── */
        .stories-bars {
          display: flex;
          gap: 4px;
          margin-bottom: 1rem;
        }
        .stories-bar-track {
          flex: 1;
          height: 2px;
          background: oklch(1 0 0 / 0.25);
          border-radius: 2px;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .stories-bar-track { height: 3px; }
        }
        .stories-bar-fill {
          height: 100%;
          background: oklch(1 0 0 / 0.9);
          border-radius: 2px;
          width: 0%;
          will-change: width;
        }

        /* ── Header ──────────────────────────────────────── */
        .stories-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          direction: inherit;
        }
        .stories-identity {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .stories-avatar-ring {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: conic-gradient(
            from 180deg,
            oklch(0.76 0.10 82),
            oklch(0.68 0.14 30),
            oklch(0.55 0.18 340),
            oklch(0.76 0.10 82)
          );
          padding: 2px;
          flex-shrink: 0;
        }
        @media (min-width: 640px) {
          .stories-avatar-ring { width: 46px; height: 46px; }
        }
        .stories-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid oklch(0.06 0 0);
          display: block;
        }
        .stories-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: oklch(1 0 0 / 0.95);
          margin: 0;
          line-height: 1.2;
          font-family: var(--font-display-ar), var(--font-display), serif;
        }
        @media (min-width: 640px) { .stories-name { font-size: 0.95rem; } }
        .stories-sub {
          font-size: 0.72rem;
          color: oklch(1 0 0 / 0.7);
          margin: 0;
          line-height: 1.2;
        }

        .stories-close {
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          background: oklch(1 0 0 / 0.1);
          border: 1px solid oklch(1 0 0 / 0.08);
          color: oklch(1 0 0 / 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s;
          position: relative;
          z-index: 60;
        }
        .stories-close:hover { background: oklch(1 0 0 / 0.18); }
        .stories-close:active { transform: scale(0.92); }

        /* ── Stealth nav zones ───────────────────────────── */
        .stories-zones {
          position: absolute;
          inset: 0;
          z-index: 30;
          display: flex;
        }
        .stories-zone-left,
        .stories-zone-right {
          width: 35%;
          height: 100%;
          cursor: pointer;
        }
        .stories-zone-left  { margin-inline-end: auto; }
        .stories-zone-right { margin-inline-start: auto; }

        /* ── Caption ─────────────────────────────────────── */
        .stories-caption {
          position: absolute;
          bottom: max(env(safe-area-inset-bottom, 1.5rem), 1.5rem);
          left: 0;
          right: 0;
          z-index: 40;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1rem 1rem;
          direction: inherit;
        }
        .stories-tag {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.6rem 1.5rem;
          border-radius: 9999px;
          background: oklch(0 0 0 / 0.32);
          border: 1px solid oklch(1 0 0 / 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          text-align: center;
        }
        .stories-tag-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: oklch(1 0 0 / 0.95);
          letter-spacing: 0.06em;
          font-family: var(--font-display-ar), var(--font-display), serif;
        }
        .stories-tag-sub {
          font-size: 0.7rem;
          color: oklch(1 0 0 / 0.7);
        }

        /* ── Desktop arrows ──────────────────────────────── */
        .stories-arrows {
          display: none;
        }
        @media (min-width: 1024px) {
          .stories-arrows {
            display: flex;
            position: absolute;
            inset: 0;
            align-items: center;
            justify-content: space-between;
            padding: 0 5rem;
            pointer-events: none;
            z-index: 100;
          }
        }
        .stories-arrow {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: oklch(1 0 0 / 0.06);
          border: 1px solid oklch(1 0 0 / 0.18);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: oklch(1 0 0 / 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
          transition: background 0.15s, transform 0.15s;
        }
        .stories-arrow:hover { background: oklch(1 0 0 / 0.12); transform: scale(1.1); }
        .stories-arrow:active { transform: scale(0.92); }
        .stories-arrow:disabled { opacity: 0.15; cursor: not-allowed; transform: none; }

        /* ── Reduced motion ──────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .stories-reels-orbit {
            opacity: 1 !important;
            pointer-events: auto !important;
            transform: none !important;
          }
          .stories-phone-device {
            opacity: 1 !important;
            transform: none !important;
          }
          .stories-type-title {
            opacity: 1 !important;
            transform: none !important;
          }
          .stories-video-shell {
            transform: none !important;
          }
          .stories-img { animation: none; }
          .stories-bubble-btn,
          .stories-bubble-btn:hover { transform: none; }
          .stories-bar-fill { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
