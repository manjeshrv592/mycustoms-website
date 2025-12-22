"use client";

import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n";

/**
 * Get the current path without the locale prefix
 * @param pathname - The full pathname from usePathname()
 * @returns The path without the locale prefix (e.g., "/about" from "/en/about")
 */
function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  // If first segment is a locale, remove it
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return "/" + segments.slice(1).join("/") || "/";
  }

  return pathname;
}

/**
 * Custom hook to check if the current path matches the given pathname
 * Works with language prefixes - compares paths without the locale
 *
 * @param targetPath - The path to check against (e.g., "/", "/services")
 * @returns boolean - true if current path matches targetPath, false otherwise
 *
 * @example
 * // On /en/services, useIsCurrentPath("/services") returns true
 * // On /nl/about, useIsCurrentPath("/") returns false
 */
export function useIsCurrentPath(targetPath: string): boolean {
  const pathname = usePathname();
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  return pathWithoutLocale === targetPath;
}

/**
 * Custom hook to check if the current path starts with the given pathname
 * Useful for matching nested routes (e.g., /services matches /services/import)
 *
 * @param targetPath - The path prefix to check against
 * @returns boolean - true if current path starts with targetPath
 */
export function usePathStartsWith(targetPath: string): boolean {
  const pathname = usePathname();
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  if (targetPath === "/") {
    return pathWithoutLocale === "/";
  }

  return pathWithoutLocale.startsWith(targetPath);
}

/**
 * Custom hook to get the current locale from the URL
 * @returns The current locale (e.g., "en", "nl", "de", "cn")
 */
export function useCurrentLocale(): Locale {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }

  return "en"; // Default locale
}
