import { client } from "../lib/client";
import type { ContactPageData } from "../types/contact";

/**
 * GROQ query for the Contact page singleton
 */
export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]{
  _id,
  _type,
  backgroundImage,
  title,
  description,
  contactImage,
  address,
  mapLink,
  phone,
  email,
  linkedinUrl,
  services,
  formLabelName,
  formPlaceholderName,
  formLabelEmail,
  formPlaceholderEmail,
  formLabelPhone,
  formLabelCompany,
  formPlaceholderCompany,
  formLabelService,
  formPlaceholderService,
  formLabelMessage,
  formPlaceholderMessage,
  formSubmitButton,
  formSubmittingButton,
  basedAtTitle,
  viewOnMapText,
  phoneSectionLabel,
  emailSectionLabel,
  seo
}`;

/**
 * Fetch the Contact page data
 */
export async function getContactPage(): Promise<ContactPageData | null> {
  return client.fetch<ContactPageData | null>(
    CONTACT_PAGE_QUERY,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["contactPage"],
      },
    }
  );
}
