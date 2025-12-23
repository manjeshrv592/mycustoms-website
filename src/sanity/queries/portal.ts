import { client } from "../lib/client";
import type { PortalPageData } from "../types";

/**
 * GROQ query for fetching portal page data
 */
export const PORTAL_PAGE_QUERY = `
  *[_type == "portalPage"][0] {
    _id,
    _type,
    backgroundImage,
    label,
    title,
    content,
    sidePanelImage,
    sidePanelTitle,
    sidePanelDescription,
    ctaButton {
      text,
      link,
      isExternal
    }
  }
`;

/**
 * Fetch portal page data from Sanity
 */
export async function getPortalPage(): Promise<PortalPageData | null> {
  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<PortalPageData | null>(
    PORTAL_PAGE_QUERY,
    {},
    {
      next: isDev
        ? { revalidate: 0 }
        : { revalidate: 60, tags: ["portalPage"] },
    }
  );
}
