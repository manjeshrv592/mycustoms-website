import type { LocalizedString, LocalizedBlockContent } from "../types";

/**
 * Default language fallback when requested language is not available
 */
export const DEFAULT_LANG = "en";

/**
 * Supported languages in the application
 */
export const SUPPORTED_LANGUAGES = ["en", "nl", "de", "cn"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Extract the value for a specific language from a localized string array
 * Falls back to default language if the requested language is not found
 *
 * @param field - Array of localized values from Sanity
 * @param lang - Language key to extract (e.g., 'en', 'nl', 'de', 'cn')
 * @returns The translated string value or empty string if not found
 */
export function getLocalizedValue(
  field: LocalizedString[] | undefined | null,
  lang: string = DEFAULT_LANG
): string {
  if (!field || field.length === 0) {
    return "";
  }

  // Try to find the requested language
  const translation = field.find((item) => item._key === lang);
  if (translation?.value) {
    return translation.value;
  }

  // Fallback to default language
  const fallback = field.find((item) => item._key === DEFAULT_LANG);
  if (fallback?.value) {
    return fallback.value;
  }

  // Last resort: return the first available value
  return field[0]?.value || "";
}

/**
 * Extract the block content for a specific language from a localized block content array
 *
 * @param field - Array of localized block content from Sanity
 * @param lang - Language key to extract
 * @returns The translated block content or empty array if not found
 */
export function getLocalizedBlockContent(
  field: LocalizedBlockContent[] | undefined | null,
  lang: string = DEFAULT_LANG
): LocalizedBlockContent["value"] {
  if (!field || field.length === 0) {
    return [];
  }

  const translation = field.find((item) => item._key === lang);
  if (translation?.value) {
    return translation.value;
  }

  const fallback = field.find((item) => item._key === DEFAULT_LANG);
  if (fallback?.value) {
    return fallback.value;
  }

  return field[0]?.value || [];
}
