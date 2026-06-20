import { cookies } from "next/headers";
import { dictionaries, type Dictionary } from "./i18n/dictionaries";
import { dayjs } from "./utils"; // For setting locale if needed, though dayjs handles timezone first

export type Locale = "ar" | "en";
export const DEFAULT_LOCALE: Locale = "ar";
export const COOKIE_NAME = "app_locale";

/**
 * Server-side helper to get the current locale from cookies
 */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(COOKIE_NAME);
  const locale = localeCookie?.value as Locale | undefined;
  
  if (locale === "ar" || locale === "en") {
    return locale;
  }
  return DEFAULT_LOCALE;
}

/**
 * Get HTML direction for a given locale
 */
export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/**
 * Get the dictionary object for a given locale
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}

/**
 * Client-side helper for basic formatting.
 * For complex dates we can still rely on dayjs or Intl directly.
 */
export function formatDate(date: Date | string | number, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", options).format(dateObj);
}
