import type {
  LocalizedString,
  LocalizedBlockContent,
  SanityImageField,
} from "./common";

/**
 * Resource Category data structure from Sanity
 */
export interface ResourceCategoryData {
  _id: string;
  _type: "resourceCategory";
  title?: LocalizedString[];
  slug: { current: string };
  key: string;
  order?: number;
}

/**
 * Article data structure from Sanity
 */
export interface ArticleData {
  _id: string;
  _type: "article";
  title?: LocalizedString[];
  slug: { current: string };
  category: ResourceCategoryData;
  summary?: LocalizedString[];
  content?: LocalizedBlockContent[];
  image?: SanityImageField & { alt?: string };
  publishedAt?: string;
  order?: number;
}

/**
 * Article with category slug for navigation
 */
export interface ArticleWithCategorySlug extends ArticleData {
  categorySlug: string;
}
