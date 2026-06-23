"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Sparkles, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const WeddingFlipBook = dynamic(() => import("@/components/site/WeddingFlipBook"), {
  ssr: false,
  loading: () => (
    <div className="wedding-book-loading" role="status">
      <span />
      <p>Loading the story…</p>
    </div>
  ),
});

const COPY = {
  ar: {
    sectionLabel: "ألبوم حكاية الفرح",
    eyebrow: "ألبوم تفاعلي",
    heading: "حكاية يوم لا يُنسى",
    body: "كتاب صُمّم كرحلة بصرية؛ من لحظة الوصول وحتى آخر رقصة. افتحه، قلّب صفحاته، ودع التفاصيل تحكي.",
    hint: "اضغط على الكتاب لفتحه",
    open: "افتح ألبوم الفرح",
    dialogTitle: "ألبوم الفرح التفاعلي",
    close: "إغلاق الألبوم",
  },
  en: {
    sectionLabel: "The wedding story album",
    eyebrow: "Interactive album",
    heading: "A Day to Remember",
    body: "A visual journey designed from the first arrival to the final dance. Open the book, turn its pages, and let every detail speak.",
    hint: "Select the book to open it",
    open: "Open the wedding album",
    dialogTitle: "Interactive wedding album",
    close: "Close album",
  },
} satisfies Record<Locale, Record<string, string>>;

export default function HomeStoriesSection({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const copy = COPY[locale];

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const opener = openerRef.current;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeRef.current?.focus(), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const modal = document.querySelector<HTMLElement>(".wedding-book-modal");
      const focusable = modal?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.setTimeout(() => opener?.focus(), 0);
    };
  }, [isOpen]);

  return (
    <section
      id="stories"
      className="wedding-book-section"
      aria-label={copy.sectionLabel}
    >
      <div className="wedding-book-section-inner">
        <div className="wedding-book-intro">
          <p className="wedding-book-eyebrow">
            <Sparkles aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <h2>{copy.heading}</h2>
          <p className="wedding-book-description">{copy.body}</p>
          <div className="wedding-book-rule" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>
          <p className="wedding-book-hint">{copy.hint}</p>
        </div>

        <button
          ref={openerRef}
          type="button"
          className="wedding-book-trigger"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-label={copy.open}
        >
          <span className="wedding-book-preview" aria-hidden="true">
            <span className="wedding-book-page-stack" />
            <span className="wedding-book-cover">
              <span className="wedding-book-cover-frame">
                <small>QASR AL-FARAH</small>
                <strong>{locale === "ar" ? "حكاية الفرح" : "The Wedding Story"}</strong>
                <i />
                <span>{locale === "ar" ? "لحظات تُروى للأبد" : "Moments told forever"}</span>
              </span>
            </span>
          </span>
          <span className="wedding-book-open-label">
            <BookOpen aria-hidden="true" />
            {copy.open}
          </span>
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div
            className="wedding-book-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wedding-book-dialog-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsOpen(false);
            }}
          >
            <div className="wedding-book-modal-panel">
              <header className="wedding-book-modal-header">
                <div>
                  <span>{copy.eyebrow}</span>
                  <h2 id="wedding-book-dialog-title">{copy.dialogTitle}</h2>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  className="wedding-book-close"
                  onClick={() => setIsOpen(false)}
                  aria-label={copy.close}
                >
                  <X aria-hidden="true" />
                </button>
              </header>

              <WeddingFlipBook locale={locale} />
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
