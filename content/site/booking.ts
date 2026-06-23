import type { Localized } from "@/types/site-content";

/**
 * Demo-only fixed visit slots. Every available future date offers exactly these
 * four slots. There is no backend, no availability check, and no slot locking —
 * the booking flow is a static client demo that submits to Formspree.
 */
export interface BookingSlot {
  /** Stable id used in URL params and the Formspree hidden field. */
  id: string;
  /** Localized display label, e.g. "12:00 PM – 2:30 PM". */
  label: Localized;
}

export const BOOKING_SLOTS: BookingSlot[] = [
  { id: "12:00-14:30", label: { ar: "١٢:٠٠ ظهراً – ٢:٣٠ عصراً", en: "12:00 PM – 2:30 PM" } },
  { id: "15:00-17:30", label: { ar: "٣:٠٠ عصراً – ٥:٣٠ مساءً", en: "3:00 PM – 5:30 PM" } },
  { id: "18:00-20:30", label: { ar: "٦:٠٠ مساءً – ٨:٣٠ مساءً", en: "6:00 PM – 8:30 PM" } },
  { id: "21:00-23:30", label: { ar: "٩:٠٠ مساءً – ١١:٣٠ مساءً", en: "9:00 PM – 11:30 PM" } },
];

export function getSlotById(id: string | null | undefined): BookingSlot | undefined {
  if (!id) return undefined;
  return BOOKING_SLOTS.find((slot) => slot.id === id);
}
