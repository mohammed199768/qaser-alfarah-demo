"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type PublicNavItem = {
  href: string;
  label: string;
};

type PublicMobileMenuProps = {
  items: PublicNavItem[];
  menuLabel: string;
  closeLabel: string;
  dir: "rtl" | "ltr";
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function PublicMobileMenu({
  items,
  menuLabel,
  closeLabel,
  dir,
}: PublicMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setOpen(false);
      }
    };

    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => desktopQuery.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = panelRef.current;
      const focusableElements = Array.from(
        panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        panel?.focus();
        return;
      }

      const firstElement = focusableElements[0]!;
      const lastElement = focusableElements[focusableElements.length - 1]!;
      const focusIsOutsidePanel = !panel?.contains(document.activeElement);

      if (event.shiftKey && (document.activeElement === firstElement || focusIsOutsidePanel)) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && (document.activeElement === lastElement || focusIsOutsidePanel)) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeMenu, open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : menuLabel}
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/55 bg-white/48 text-brand-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_5px_16px_rgba(62,52,37,0.08)] backdrop-blur-[14px] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/68 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg md:hidden"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-[60] bg-brand-secondary/20 backdrop-blur-sm md:hidden"
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeMenu();
                }
              }}
            >
              <div
                ref={panelRef}
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-label={menuLabel}
                tabIndex={-1}
                dir={dir}
                className={[
                  "absolute top-4 max-h-[calc(100vh-2rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl border border-white/55 bg-white/82 p-5 shadow-[var(--brand-shadow-elevated)] backdrop-blur-[22px]",
                  dir === "rtl" ? "right-4" : "left-4",
                ].join(" ")}
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-brand-secondary">{menuLabel}</p>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={closeMenu}
                    aria-label={closeLabel}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-brand-secondary transition-colors hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>

                <nav aria-label={menuLabel} className="grid gap-2">
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="flex min-h-11 items-center rounded-2xl px-4 py-3 text-start font-medium text-brand-secondary transition-colors hover:bg-white/58 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
