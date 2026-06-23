"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Clock, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n";
import { dayjs } from "@/lib/utils";
import { getSlotById } from "@/content/site/booking";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzdlzqyp";

interface BookingDetailsCopy {
  detailsTitle: string;
  detailsSubtitle: string;
  summaryDate: string;
  summaryTime: string;
  back: string;
  disclaimer: string;
  requiredHint: string;
  changeSelection: string;
  submit: string;
  fields: {
    name: string;
    phone: string;
    groom: string;
    bride: string;
    guests: string;
    notes: string;
    notesPlaceholder: string;
  };
}

interface BookingDetailsFormProps {
  locale: Locale;
  copy: BookingDetailsCopy;
}

const inputClass =
  "mt-1.5 block w-full rounded-[calc(var(--brand-radius)-4px)] border border-brand-border bg-brand-bg px-3.5 py-2.5 text-brand-fg text-start outline-none transition-colors focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/30 placeholder:text-brand-muted-fg/60";
const labelClass = "block text-sm font-medium text-brand-secondary";

export default function BookingDetailsForm({ locale, copy }: BookingDetailsFormProps) {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const slotId = searchParams.get("slot");

  const slot = getSlotById(slotId);

  // A selection is valid only if the date parses to a real future-or-today date
  // and the slot id matches one of our fixed slots.
  const isValidSelection = useMemo(() => {
    if (!date || !slot) return false;
    const parsed = dayjs.tz(`${date}T00:00:00`);
    if (!parsed.isValid()) return false;
    return !parsed.startOf("day").isBefore(dayjs.tz().startOf("day"));
  }, [date, slot]);

  const dateLabel = useMemo(() => {
    if (!date) return "";
    const parsed = dayjs.tz(`${date}T00:00:00`);
    if (!parsed.isValid()) return date;
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsed.toDate());
  }, [date, locale]);

  const BackIcon = locale === "ar" ? ChevronRight : ChevronLeft;

  if (!isValidSelection) {
    return (
      <Container className="max-w-xl">
        <div className="rounded-[var(--brand-radius)] border border-brand-border bg-brand-bg p-8 text-center shadow-sm">
          <Info className="mx-auto mb-4 size-9 text-brand-primary" aria-hidden="true" />
          <p className="mb-6 text-brand-muted-fg">{copy.requiredHint}</p>
          <Button asChild variant="brand" size="lg">
            <Link href="/booking">
              <BackIcon className="size-4" aria-hidden="true" />
              <span>{copy.back}</span>
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  // Plain-text values that are friendly inside the Formspree email.
  const dateForEmail = dateLabel;
  const slotForEmail = slot ? slot.label[locale] : (slotId ?? "");

  return (
    <Container className="max-w-5xl">
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <form
          action={FORMSPREE_ENDPOINT}
          method="POST"
          className="space-y-6 rounded-[var(--brand-radius)] border border-brand-border bg-brand-bg p-5 shadow-sm sm:p-7"
        >
          <div>
            <h2 className="text-xl font-semibold text-brand-secondary">{copy.detailsTitle}</h2>
            <p className="mt-1 text-sm text-brand-muted-fg">{copy.detailsSubtitle}</p>
          </div>

          {/* Hidden fields carry the selection into the Formspree submission. */}
          <input type="hidden" name="selectedDate" value={dateForEmail} />
          <input type="hidden" name="selectedSlot" value={slotForEmail} />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              {copy.fields.name}
              <input
                name="customerName"
                required
                maxLength={120}
                autoComplete="name"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              {copy.fields.phone}
              <input
                name="customerPhone"
                type="tel"
                required
                maxLength={30}
                autoComplete="tel"
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              {copy.fields.groom}
              <input name="groomName" maxLength={120} className={inputClass} />
            </label>
            <label className={labelClass}>
              {copy.fields.bride}
              <input name="brideName" maxLength={120} className={inputClass} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              {copy.fields.guests}
              <input
                name="expectedGuests"
                type="number"
                min={1}
                max={10000}
                step={1}
                inputMode="numeric"
                className={inputClass}
              />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>
              {copy.fields.notes}
              <textarea
                name="notes"
                rows={4}
                maxLength={1000}
                placeholder={copy.fields.notesPlaceholder}
                className={`${inputClass} resize-y`}
              />
            </label>
          </div>

          <Button type="submit" variant="brand" size="lg" className="h-12 w-full text-base">
            {copy.submit}
          </Button>
        </form>

        {/* Summary */}
        <aside className="h-fit space-y-5 rounded-[var(--brand-radius)] border border-brand-primary/20 bg-brand-primary/5 p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="font-semibold text-brand-secondary">{copy.detailsTitle}</h2>

          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-2.5 text-brand-fg">
              <CalendarDays className="mt-0.5 size-5 shrink-0 text-brand-primary" aria-hidden="true" />
              <span>
                <span className="block text-xs text-brand-muted-fg">{copy.summaryDate}</span>
                <span className="font-medium">{dateLabel}</span>
              </span>
            </p>
            <p className="flex items-start gap-2.5 text-brand-fg">
              <Clock className="mt-0.5 size-5 shrink-0 text-brand-primary" aria-hidden="true" />
              <span>
                <span className="block text-xs text-brand-muted-fg">{copy.summaryTime}</span>
                <span className="font-medium" dir={locale === "ar" ? "rtl" : "ltr"}>
                  {slot?.label[locale]}
                </span>
              </span>
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href="/booking">
              <BackIcon className="size-4" aria-hidden="true" />
              <span>{copy.changeSelection}</span>
            </Link>
          </Button>

          <p className="flex items-start gap-2 border-t border-brand-primary/15 pt-4 text-xs leading-relaxed text-brand-muted-fg">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-primary" aria-hidden="true" />
            <span>{copy.disclaimer}</span>
          </p>
        </aside>
      </div>
    </Container>
  );
}
