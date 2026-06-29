import type { PortableTextBlock } from "@portabletext/types";

/**
 * Represents a localized string field from Sanity's internationalized-array plugin
 * Each item has a language key (_key) and the translated value
 */
export interface LocalizedString {
  _key: string;
  value: string;
}

/**
 * Represents a localized rich text field from Sanity's internationalized-array plugin
 */
export interface LocalizedBlockContent {
  _key: string;
  value: PortableTextBlock[];
}

/**
 * Reusable SEO settings object (matches the `seo` schema type).
 * All fields are optional per-language overrides; the frontend falls back to
 * the default page title and omits empty tags.
 */
export interface SeoFields {
  metaTitle?: LocalizedString[];
  metaDescription?: LocalizedString[];
  metaKeywords?: LocalizedString[];
  allowIndexing?: boolean;
}

/**
 * Sanity image field with asset reference
 */
export interface SanityImageField {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/**
 * Featured logo object as defined in the schema
 */
export interface FeaturedLogo {
  logo: SanityImageField;
  alt: string;
  url?: string;
  height?: number;
}

/**
 * CTA Button object with localized text
 */
export interface CtaButton {
  text: LocalizedString[];
  link?: string;
  isExternal?: boolean;
}
