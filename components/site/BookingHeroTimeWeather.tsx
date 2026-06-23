"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Sun,
  Thermometer,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

const TIME_ZONE = "Asia/Amman";

// Open-Meteo — Amman, Jordan. Key-less, no env vars; client fetch is fine for a demo.
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=31.9539&longitude=35.9106&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia%2FAmman";

export interface WidgetLabels {
  today: string;
  currentTime: string;
  weatherTitle: string;
  temperature: string;
  humidity: string;
  wind: string;
  feelsLike: string;
  loading: string;
  error: string;
}

interface BookingHeroTimeWeatherProps {
  locale: Locale;
  labels: WidgetLabels;
}

interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
}

type WeatherState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: CurrentWeather };

/** Map common Open-Meteo weather codes to a localized label + icon. */
function describeWeather(
  code: number,
  locale: Locale,
): { label: string; Icon: LucideIcon } {
  const en: Record<string, string> = {
    clear: "Clear",
    mainlyClear: "Mainly clear",
    partlyCloudy: "Partly cloudy",
    overcast: "Overcast",
    fog: "Fog",
    drizzle: "Drizzle",
    rain: "Rain",
    snow: "Snow",
    showers: "Rain showers",
    thunder: "Thunderstorm",
    unknown: "—",
  };
  const ar: Record<string, string> = {
    clear: "صافي",
    mainlyClear: "غيوم خفيفة",
    partlyCloudy: "غائم جزئياً",
    overcast: "غائم",
    fog: "ضباب",
    drizzle: "رذاذ",
    rain: "أمطار",
    snow: "ثلوج",
    showers: "زخات مطر",
    thunder: "عاصفة رعدية",
    unknown: "—",
  };
  const dict = locale === "ar" ? ar : en;

  const pick = (key: string, Icon: LucideIcon) => ({ label: dict[key]!, Icon });

  if (code === 0) return pick("clear", Sun);
  if (code === 1) return pick("mainlyClear", Sun);
  if (code === 2) return pick("partlyCloudy", Cloud);
  if (code === 3) return pick("overcast", Cloud);
  if (code === 45 || code === 48) return pick("fog", CloudFog);
  if (code === 51 || code === 53 || code === 55) return pick("drizzle", CloudDrizzle);
  if (code === 61 || code === 63 || code === 65) return pick("rain", CloudRain);
  if (code === 71 || code === 73 || code === 75) return pick("snow", CloudSnow);
  if (code === 80 || code === 81 || code === 82) return pick("showers", CloudRain);
  if (code === 95) return pick("thunder", CloudLightning);
  return pick("unknown", Cloud);
}

export default function BookingHeroTimeWeather({
  locale,
  labels,
}: BookingHeroTimeWeatherProps) {
  // Time is set only after mount to avoid SSR/client hydration mismatch.
  const [now, setNow] = useState<Date | null>(null);
  const [weather, setWeather] = useState<WeatherState>({ status: "loading" });

  // Live clock — ticks every second, cleaned up on unmount.
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Weather — fetched once on mount, abortable on unmount.
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(WEATHER_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: { current?: CurrentWeather } = await res.json();
        if (!json.current) throw new Error("No current weather");
        setWeather({ status: "ready", data: json.current });
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        setWeather({ status: "error" });
      }
    })();
    return () => controller.abort();
  }, []);

  const intlLocale = locale === "ar" ? "ar-JO" : "en-US";

  const timeText = now
    ? new Intl.DateTimeFormat(intlLocale, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: TIME_ZONE,
      }).format(now)
    : "—";

  const dateText = now
    ? new Intl.DateTimeFormat(intlLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: TIME_ZONE,
      }).format(now)
    : "—";

  const condition =
    weather.status === "ready"
      ? describeWeather(weather.data.weather_code, locale)
      : null;
  const ConditionIcon = condition?.Icon ?? Cloud;

  const tempUnit = "°C";
  const numFmt = (n: number, digits = 0) =>
    new Intl.NumberFormat(intlLocale, {
      maximumFractionDigits: digits,
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="booking-hero-widget mx-auto w-full max-w-[20rem] select-none"
    >
      {/* Phone/tablet screen */}
      <div
        className="relative overflow-hidden rounded-[1.6rem] border p-4 shadow-[0_22px_60px_oklch(0.18_0.02_60_/_0.45)] backdrop-blur-xl sm:p-5"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.22 0.026 64 / 0.96) 0%, oklch(0.14 0.018 58 / 0.96) 100%)",
          borderColor: "oklch(0.80 0.10 82 / 0.40)",
        }}
      >
        {/* Soft champagne glow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/3 start-1/4 aspect-square w-2/3 rounded-full opacity-30 blur-3xl"
          style={{ background: "oklch(0.80 0.10 82 / 0.5)" }}
        />

        {/* Status-bar feel: notch + condition glyph */}
        <div className="relative mb-4 flex items-center justify-between">
          <span
            aria-hidden="true"
            className="h-1.5 w-10 rounded-full"
            style={{ background: "oklch(0.80 0.10 82 / 0.45)" }}
          />
          <ConditionIcon
            aria-hidden="true"
            className="size-4"
            style={{ color: "oklch(0.86 0.09 84)" }}
          />
        </div>

        {/* Clock */}
        <div className="relative text-center">
          <p
            className="text-[0.62rem] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "oklch(0.78 0.07 82)" }}
          >
            {labels.currentTime}
          </p>
          <p
            className="mt-1 text-3xl font-bold tabular-nums tracking-wide sm:text-4xl"
            style={{
              color: "oklch(0.97 0.012 84)",
              fontFamily: "var(--font-display), serif",
            }}
            aria-live="off"
            dir="ltr"
          >
            {timeText}
          </p>
        </div>

        {/* Date */}
        <div
          className="relative mt-4 flex items-center justify-center gap-2 rounded-full border px-3 py-1.5"
          style={{
            borderColor: "oklch(0.80 0.10 82 / 0.22)",
            background: "oklch(1 0 0 / 0.04)",
          }}
        >
          <CalendarDays
            aria-hidden="true"
            className="size-3.5"
            style={{ color: "oklch(0.84 0.08 82)" }}
          />
          <span className="text-xs font-medium" style={{ color: "oklch(0.90 0.03 82)" }}>
            <span className="opacity-70">{labels.today}: </span>
            {dateText}
          </span>
        </div>

        {/* Divider */}
        <span
          aria-hidden="true"
          className="relative my-4 block h-px w-full"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(0.80 0.10 82 / 0.35), transparent)",
          }}
        />

        {/* Weather */}
        <div className="relative">
          <p
            className="mb-3 flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "oklch(0.78 0.07 82)" }}
          >
            <Clock aria-hidden="true" className="size-3" />
            {labels.weatherTitle}
          </p>

          {weather.status === "loading" && (
            <div
              className="flex animate-pulse items-center justify-center rounded-xl border py-6 text-xs"
              style={{
                borderColor: "oklch(0.80 0.10 82 / 0.18)",
                color: "oklch(0.80 0.04 82)",
              }}
            >
              {labels.loading}
            </div>
          )}

          {weather.status === "error" && (
            <div
              className="flex items-center justify-center rounded-xl border py-6 text-center text-xs"
              style={{
                borderColor: "oklch(0.70 0.05 40 / 0.3)",
                color: "oklch(0.82 0.05 60)",
                background: "oklch(0.60 0.06 40 / 0.08)",
              }}
            >
              {labels.error}
            </div>
          )}

          {weather.status === "ready" && condition && (
            <>
              {/* Big temperature + condition */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p
                    className="text-3xl font-bold tabular-nums"
                    style={{ color: "oklch(0.97 0.012 84)" }}
                    dir="ltr"
                  >
                    {numFmt(weather.data.temperature_2m)}
                    {tempUnit}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "oklch(0.84 0.05 82)" }}>
                    {condition.label}
                  </p>
                </div>
                <ConditionIcon
                  aria-hidden="true"
                  className="size-12 shrink-0"
                  style={{ color: "oklch(0.86 0.09 84)" }}
                />
              </div>

              {/* Metrics grid */}
              <dl className="grid grid-cols-3 gap-2">
                <WeatherMetric
                  Icon={Thermometer}
                  label={labels.feelsLike}
                  value={`${numFmt(weather.data.apparent_temperature)}${tempUnit}`}
                />
                <WeatherMetric
                  Icon={Droplets}
                  label={labels.humidity}
                  value={`${numFmt(weather.data.relative_humidity_2m)}%`}
                />
                <WeatherMetric
                  Icon={Wind}
                  label={labels.wind}
                  value={`${numFmt(weather.data.wind_speed_10m)} ${
                    locale === "ar" ? "كم/س" : "km/h"
                  }`}
                />
              </dl>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function WeatherMetric({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-xl border px-1.5 py-2.5 text-center"
      style={{
        borderColor: "oklch(0.80 0.10 82 / 0.16)",
        background: "oklch(1 0 0 / 0.04)",
      }}
    >
      <Icon aria-hidden="true" className="size-4" style={{ color: "oklch(0.84 0.08 82)" }} />
      <span
        className="text-[0.7rem] font-semibold tabular-nums"
        style={{ color: "oklch(0.95 0.02 84)" }}
        dir="ltr"
      >
        {value}
      </span>
      <span className="text-[0.55rem] leading-tight opacity-70" style={{ color: "oklch(0.86 0.03 82)" }}>
        {label}
      </span>
    </div>
  );
}
