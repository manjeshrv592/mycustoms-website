import type {
  LocalizedString,
  LocalizedBlockContent,
  SanityImageField,
  SeoFields,
} from "./common";

/**
 * Service document data structure from Sanity
 */
export interface ServiceData {
  _id: string;
  _type: "service";
  title: LocalizedString[];
  slug: {
    current: string;
  };
  summary?: LocalizedString[];
  content?: LocalizedBlockContent[];
  image?: SanityImageField & {
    alt?: string;
  };
  isActive?: boolean;
  order?: number;
  seo?: SeoFields;
}

/**
 * Services page singleton data structure
 */
export interface ServicesPageData {
  _id: string;
  _type: "servicesPage";
  backgroundImage: SanityImageField;
  label?: LocalizedString[];
}
