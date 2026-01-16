import type { LocalizedString, SanityImageField } from "./common";

/**
 * Contact page singleton data structure from Sanity
 */
export interface ContactPageData {
  _id: string;
  _type: "contactPage";
  backgroundImage: SanityImageField;
  title?: LocalizedString[];
  description?: LocalizedString[];
  contactImage?: SanityImageField;
  address?: string;
  mapLink?: string;
  phone?: string;
  email?: string;
  linkedinUrl?: string;
}
