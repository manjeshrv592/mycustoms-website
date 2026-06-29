import type { Metadata } from "next";
import { getLocalizedValue } from "./localization";
import type { SeoFields } from "../types";

/**
 * Builds Next.js Metadata from a page's SEO settings, applying smart fallbacks:
 *
 * - Meta Title: when set, it is used as the full title (bypasses the
 *   "My Customs | %s" template via `absolute`). When empty, `defaultTitle` is
 *   returned as a plain string so the layout template prefix still applies.
 * - Meta Description / Keywords: only included when provided.
 * - Indexing: when `allowIndexing` is explicitly `false`, emits a
 *   `noindex, nofollow` robots directive.
 *
 * @param seo - The SEO settings object from Sanity (may be undefined)
 * @param lang - Active locale used to resolve localized values
 * @param defaultTitle - Fallback title used when no Meta Title override is set
 */
export function buildSeoMetadata(
  seo: SeoFields | undefined | null,
  lang: string,
  defaultTitle: string
): Metadata {
  const metaTitle = getLocalizedValue(seo?.metaTitle, lang).trim();
  const metaDescription = getLocalizedValue(seo?.metaDescription, lang).trim();
  const metaKeywords = getLocalizedValue(seo?.metaKeywords, lang).trim();

  const metadata: Metadata = {
    title: metaTitle ? { absolute: metaTitle } : defaultTitle,
  };

  if (metaDescription) {
    metadata.description = metaDescription;
  }

  if (metaKeywords) {
    metadata.keywords = metaKeywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean);
  }

  if (seo?.allowIndexing === false) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}
