import type {
  LocalizedString,
  LocalizedBlockContent,
  SanityImageField,
} from "./common";

/**
 * Blog data structure from Sanity
 */
export interface BlogData {
  _id: string;
  _type: "blog";
  title?: LocalizedString[];
  slug: { current: string };
  summary?: LocalizedString[];
  content?: LocalizedBlockContent[];
  image?: SanityImageField & { alt?: string };
  publishedAt?: string;
  order?: number;
  isActive?: boolean;
}
