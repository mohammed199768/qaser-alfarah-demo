"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import type { Locale } from "@/lib/i18n";
import { dayjs } from "@/lib/utils";
import { BOOKING_SLOTS } from "@/content/site/booking";

interface BookingCopy {
  title: string;
  chooseDate: string;
  chooseTime: string;
  selectDateFirst: string;
  continue: string;
  disclaimer: string;
  slotsHeading: string;
}

interface BookingCalendarProps {
  locale: Locale;
  copy: BookingCopy;
}

/** How many days ahead are bookable in this demo (from today, inclusive). */
const BOOKING_WINDOW_DAYS = 60;

type CalendarCell = {
  iso: string; // YYYY-MM-DD
  dayNumber: number;
  past: boolean;
  bookable: boolean;
} | null;

export default function BookingCalendar({ locale, copy }: BookingCalendarProps) {
  const router = useRouter();
  const today = useMemo(() => dayjs.tz().startOf("day"), []);
  const windowEnd = useMemo(
    () => today.add(BOOKING_WINDOW_DAYS, "day"),
    [today]
  );

  const [viewYear, setViewYear] = useState(() => today.year());
  const [viewMonth, setViewMonth] = useState(() => today.month()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const isCurrentMonth =
    viewYear === today.year() && viewMonth === today.month();

  const weekDays = useMemo(
    () =>
      locale === "ar"
        ? ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    [locale]
  );

  // Build the month grid (leading blanks + each day of the visible month).
  const cells = useMemo<CalendarCell[]>(() => {
    const monthStart = dayjs.tz().year(viewYear).month(viewMonth).date(1).startOf("day");
    const daysInMonth = monthStart.daysInMonth();
    const leading = monthStart.day(); // 0=Sun
    const grid: CalendarCell[] = [];
    for (let i = 0; i < leading; i++) grid.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = monthStart.date(d);
      const past = date.isBefore(today);
      const afterWindow = date.isAfter(windowEnd);
      grid.push({
        iso: date.format("YYYY-MM-DD"),
        dayNumber: d,
        past,
        bookable: !past && !afterWindow,
      });
    }
    return grid;
  }, [viewYear, viewMonth, today, windowEnd]);

  const monthLabel = useMemo(() => {
    const d = dayjs.tz().year(viewYear).month(viewMonth).date(1);
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
      month: "long",
      year: "numeric",
    }).format(d.toDate());
  }, [viewYear, viewMonth, locale]);

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return null;
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(dayjs.tz(`${selectedDate}T00:00:00`).toDate());
  }, [selectedDate, locale]);

  function moveMonth(delta: number) {
    const next = dayjs.tz().year(viewYear).month(viewMonth).date(1).add(delta, "month");
    // Never navigate before the current month.
    if (next.isBefore(today.startOf("month"))) return;
    setViewYear(next.year());
    setViewMonth(next.month());
  }

  function chooseDate(cell: NonNullable<CalendarCell>) {
    if (!cell.bookable) return;
    setSelectedDate(cell.iso);
    setSelectedSlotId(null);
  }

  function handleContinue() {
    if (!selectedDate || !selectedSlotId) return;
    const params = new URLSearchParams({ date: selectedDate, slot: selectedSlotId });
    router.push(`/booking/details?${params.toString()}`);
  }

  const canContinue = Boolean(selectedDate && selectedSlotId);

  return (
    <Container className="max-w-6xl">
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_380px]">
        {/* Calendar */}
        <section
          className="rounded-[var(--brand-radius)] border border-brand-border bg-brand-bg p-4 shadow-sm sm:p-7"
          aria-label={copy.chooseDate}
        >
          <header className="mb-6 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-brand-border text-brand-fg hover:bg-brand-muted hover:text-brand-primary"
              aria-label={locale === "ar" ? "الشهر السابق" : "Previous month"}
              onClick={() => moveMonth(-1)}
              disabled={isCurrentMonth}
            >
              {locale === "ar" ? <ChevronRight /> : <ChevronLeft />}
            </Button>
            <h2 className="flex items-center gap-2.5 text-lg font-semibold text-brand-secondary sm:text-xl">
              <CalendarDays className="size-5 text-brand-primary" aria-hidden="true" />
              <span dir="ltr">{monthLabel}</span>
            </h2>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="border-brand-border text-brand-fg hover:bg-brand-muted hover:text-brand-primary"
              aria-label={locale === "ar" ? "الشهر التالي" : "Next month"}
              onClick={() => moveMonth(1)}
            >
              {locale === "ar" ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          </header>

          <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-brand-muted-fg sm:gap-2">
            {weekDays.map((d) => (
              <div key={d} className="py-1.5">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {cells.map((cell, i) => {
              if (!cell) return <div key={`blank-${i}`} className="aspect-square" />;
              const selected = cell.iso === selectedDate;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  disabled={!cell.bookable}
                  aria-pressed={selected}
                  onClick={() => chooseDate(cell)}
                  className={[
                    "aspect-square rounded-[calc(var(--brand-radius)-4px)] border text-sm transition-all duration-300 flex items-center justify-center",
                    !cell.bookable
                      ? "cursor-not-allowed border-brand-border/40 bg-brand-muted/30 text-brand-muted-fg/35"
                      : "cursor-pointer border-brand-border bg-brand-bg text-brand-fg hover:-translate-y-0.5 hover:border-brand-primary/45 hover:bg-brand-primary/5 hover:shadow-sm",
                    selected
                      ? "!border-brand-primary !bg-brand-primary/10 !text-brand-primary font-semibold ring-1 ring-brand-primary shadow-md"
                      : "",
                  ].join(" ")}
                >
                  <span className="text-base sm:text-lg">{cell.dayNumber}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Slots */}
        <section
          className="h-fit rounded-[var(--brand-radius)] border border-brand-border bg-brand-bg p-4 shadow-sm sm:p-7 lg:sticky lg:top-24"
          aria-label={copy.chooseTime}
        >
          <h2 className="mb-5 flex items-center gap-2.5 text-lg font-semibold text-brand-secondary sm:text-xl">
            <Clock className="size-5 text-brand-primary" aria-hidden="true" />
            {selectedDateLabel ?? copy.slotsHeading}
          </h2>

          {!selectedDate ? (
            <div className="rounded-[calc(var(--brand-radius)-4px)] border border-dashed border-brand-border bg-brand-muted/30 p-8 text-center text-brand-muted-fg">
              <CalendarDays className="mx-auto mb-3 size-8 opacity-25" aria-hidden="true" />
              <p>{copy.selectDateFirst}</p>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm font-medium text-brand-muted-fg">{copy.chooseTime}</p>
              <div className="space-y-3">
                {BOOKING_SLOTS.map((slot) => {
                  const selected = slot.id === selectedSlotId;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={[
                        "flex w-full items-center justify-between rounded-[calc(var(--brand-radius)-4px)] border p-4 text-start transition-all duration-300",
                        selected
                          ? "border-brand-primary bg-brand-primary/10 text-brand-primary ring-1 ring-brand-primary shadow-sm"
                          : "cursor-pointer border-brand-border text-brand-fg hover:-translate-y-0.5 hover:border-brand-primary/45 hover:bg-brand-primary/5 hover:shadow-sm",
                      ].join(" ")}
                    >
                      <span className="font-medium" dir={locale === "ar" ? "rtl" : "ltr"}>
                        {slot.label[locale]}
                      </span>
                      {selected && <Check className="size-5 text-brand-primary" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>

              <Button
                type="button"
                variant="brand"
                size="lg"
                className="mt-6 h-12 w-full text-base"
                disabled={!canContinue}
                onClick={handleContinue}
              >
                {copy.continue}
              </Button>
            </>
          )}

          {/* Disclaimer */}
          <p className="mt-6 flex items-start gap-2 rounded-[calc(var(--brand-radius)-4px)] border border-brand-primary/20 bg-brand-primary/5 p-4 text-xs leading-relaxed text-brand-muted-fg">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-primary" aria-hidden="true" />
            <span>{copy.disclaimer}</span>
          </p>
        </section>
      </div>
    </Container>
  );
}
