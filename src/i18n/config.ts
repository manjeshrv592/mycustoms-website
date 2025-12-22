/**
 * Internationalization (i18n) configuration
 * Defines supported locales and default language
 */

export const locales = ["en", "nl", "de", "cn"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * Validate if a string is a supported locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Language display information for UI
 */
export const localeInfo: Record<
  Locale,
  { label: string; fullLabel: string; flag: string; alt: string }
> = {
  en: {
    label: "EN",
    fullLabel: "English",
    flag: "/images/flags/us.svg",
    alt: "US flag",
  },
  nl: {
    label: "NL",
    fullLabel: "Dutch",
    flag: "/images/flags/nl.svg",
    alt: "Netherlands flag",
  },
  de: {
    label: "DE",
    fullLabel: "German",
    flag: "/images/flags/de.svg",
    alt: "Germany flag",
  },
  cn: {
    label: "CN",
    fullLabel: "Chinese",
    flag: "/images/flags/cn.svg",
    alt: "China flag",
  },
};
