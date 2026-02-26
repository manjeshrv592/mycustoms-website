import { client } from "../lib/client";
import type { PortalPageData } from "../types";

/**
 * GROQ query for fetching portal page data
 */
export const PORTAL_PAGE_QUERY = `
  *[_type == "portalPage"][0] {
    _id,
    _type,
    isActive,
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

/**
 * Lightweight query to fetch only the portal page active status
 */
const PORTAL_IS_ACTIVE_QUERY = `*[_type == "portalPage"][0].isActive`;

export async function getPortalPageIsActive(): Promise<boolean> {
  const isDev = process.env.NODE_ENV === "development";

  const isActive = await client.fetch<boolean | null>(
    PORTAL_IS_ACTIVE_QUERY,
    {},
    {
      next: isDev
        ? { revalidate: 0 }
        : { revalidate: 60, tags: ["portalPage"] },
      cache: isDev ? "no-store" : undefined,
    }
  );


  return isActive ?? true;
}
