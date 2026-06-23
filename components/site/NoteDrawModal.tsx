"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Eraser, Download, Share2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const COPY = {
  ar: {
    title: "اكتب ملاحظة",
    hint: "ارسم أو اكتب ملاحظتك بإصبعك أو الفأرة",
    clear: "مسح",
    download: "تنزيل الصورة",
    share: "مشاركة",
    whatsappLabel: "رقم واتساب (اختياري)",
    whatsappPlaceholder: "9627xxxxxxxx",
    sendWhatsapp: "إرسال عبر واتساب",
    close: "إغلاق",
    message: "مرحباً، أرسل لكم ملاحظتي من قصر الفرح 🤍 (الصورة مرفقة/سيتم إرفاقها)",
  },
  en: {
    title: "Write a Note",
    hint: "Draw or write your note with your finger or mouse",
    clear: "Clear",
    download: "Download image",
    share: "Share",
    whatsappLabel: "WhatsApp number (optional)",
    whatsappPlaceholder: "9627xxxxxxxx",
    sendWhatsapp: "Send via WhatsApp",
    close: "Close",
    message: "Hello, here is my note from Qasr Al-Farah 🤍 (image attached / to attach)",
  },
} satisfies Record<Locale, Record<string, string>>;

interface NoteDrawModalProps {
  locale: Locale;
  /** Current rendered page (data URL) used as a faded background, if available. */
  backgroundSrc?: string | undefined;
  whatsappNumber?: string | undefined;
  onClose: () => void;
}

const CANVAS_W = 720;
const CANVAS_H = 960;

export default function NoteDrawModal({
  locale,
  backgroundSrc,
  whatsappNumber,
  onClose,
}: NoteDrawModalProps) {
  const copy = COPY[locale];
  const isAr = locale === "ar";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [phone, setPhone] = useState(whatsappNumber ?? "");
  const [canShareFiles, setCanShareFiles] = useState(false);

  // Detect Web Share API (files) support.
  useEffect(() => {
    setCanShareFiles(
      typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        typeof navigator.share === "function",
    );
  }, []);

  // Lock scroll + Esc to close.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Initialise canvas: ivory fill + faded page background (if any).
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#fbf7ef";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (backgroundSrc) {
      const img = new window.Image();
      img.onload = () => {
        ctx.globalAlpha = 0.18;
        // contain
        const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        ctx.globalAlpha = 1;
      };
      img.src = backgroundSrc;
    }
  }, [backgroundSrc]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    drawing.current = true;
    last.current = pointerPos(e);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };
  const moveDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    const p = pointerPos(e);
    if (!ctx || !last.current) return;
    ctx.strokeStyle = "oklch(0.45 0.06 60)";
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };
  const endDraw = () => {
    drawing.current = false;
    last.current = null;
  };

  const clear = () => initCanvas();

  const toBlob = () =>
    new Promise<Blob | null>((resolve) => {
      canvasRef.current?.toBlob((b) => resolve(b), "image/png");
    });

  const download = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qasr-al-farah-note.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const waLink = () => {
    const digits = phone.replace(/[^\d]/g, "");
    const text = encodeURIComponent(copy.message);
    return digits
      ? `https://wa.me/${digits}?text=${text}`
      : `https://wa.me/?text=${text}`;
  };

  // Preferred: share PNG via Web Share (files). Fallback: download + open wa.me.
  const share = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const file = new File([blob], "qasr-al-farah-note.png", { type: "image/png" });

    if (
      canShareFiles &&
      navigator.canShare?.({ files: [file] })
    ) {
      try {
        await navigator.share({ files: [file], text: copy.message });
        return;
      } catch {
        // user cancelled or share failed → fall through to download + wa.me
      }
    }
    // Fallback: download the PNG, then open WhatsApp with prepared text.
    await download();
    window.open(waLink(), "_blank", "noopener,noreferrer");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      dir={isAr ? "rtl" : "ltr"}
      className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-5"
      style={{ background: "oklch(0.10 0.012 60 / 0.9)" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border shadow-2xl"
        style={{
          background: "linear-gradient(160deg, oklch(0.99 0.008 84), oklch(0.96 0.016 82))",
          borderColor: "oklch(0.80 0.10 82 / 0.4)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b px-5 py-3" style={{ borderColor: "oklch(0.88 0.02 82)" }}>
          <div>
            <h3 className="text-base font-semibold text-brand-secondary" style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}>
              {copy.title}
            </h3>
            <p className="text-[0.7rem] text-brand-muted-fg">{copy.hint}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-brand-secondary transition-colors hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="mx-auto block aspect-[3/4] w-full max-w-[18rem] touch-none rounded-xl border bg-[#fbf7ef] shadow-inner"
            style={{ borderColor: "oklch(0.84 0.05 82)" }}
            onPointerDown={startDraw}
            onPointerMove={moveDraw}
            onPointerUp={endDraw}
            onPointerLeave={endDraw}
          />
        </div>

        {/* WhatsApp field */}
        <div className="px-5 pb-2">
          <label className="block text-xs font-medium text-brand-secondary">
            {copy.whatsappLabel}
            <input
              type="tel"
              dir="ltr"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={copy.whatsappPlaceholder}
              className="mt-1.5 block w-full rounded-xl border border-brand-border bg-brand-bg px-3.5 py-2.5 text-start text-brand-fg outline-none transition-colors focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/30"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 border-t px-5 py-3" style={{ borderColor: "oklch(0.88 0.02 82)" }}>
          <button
            type="button"
            onClick={clear}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-brand-border px-4 text-xs font-semibold text-brand-fg transition-colors hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Eraser className="size-4" aria-hidden="true" />
            {copy.clear}
          </button>
          <button
            type="button"
            onClick={download}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-brand-border px-4 text-xs font-semibold text-brand-fg transition-colors hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          >
            <Download className="size-4" aria-hidden="true" />
            {copy.download}
          </button>
          <button
            type="button"
            onClick={share}
            className="ms-auto inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-xs font-bold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            style={{
              background: "linear-gradient(135deg, oklch(0.84 0.10 82) 0%, oklch(0.70 0.12 76) 100%)",
              color: "oklch(0.16 0.01 58)",
            }}
          >
            <Share2 className="size-4" aria-hidden="true" />
            {canShareFiles ? copy.share : copy.sendWhatsapp}
          </button>
        </div>
      </div>
    </div>
  );
}
