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
  services?: string[];
  // Form labels & placeholders
  formLabelName?: LocalizedString[];
  formPlaceholderName?: LocalizedString[];
  formLabelEmail?: LocalizedString[];
  formPlaceholderEmail?: LocalizedString[];
  formLabelPhone?: LocalizedString[];
  formLabelCompany?: LocalizedString[];
  formPlaceholderCompany?: LocalizedString[];
  formLabelService?: LocalizedString[];
  formPlaceholderService?: LocalizedString[];
  formLabelMessage?: LocalizedString[];
  formPlaceholderMessage?: LocalizedString[];
  formSubmitButton?: LocalizedString[];
  formSubmittingButton?: LocalizedString[];
  // Contact info labels
  basedAtTitle?: LocalizedString[];
  viewOnMapText?: LocalizedString[];
  phoneSectionLabel?: LocalizedString[];
  emailSectionLabel?: LocalizedString[];
}
