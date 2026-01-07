import { client } from "../lib/client";
import type { HomePageData } from "../types";

/**
 * GROQ query for fetching home page data
 * Fetches all fields needed for the home page component
 */
export const HOME_PAGE_QUERY = `
  *[_type == "homePage"][0] {
    _id,
    _type,
    backgroundImage,
    mobileBackgroundImage,
    mainTitleLine1,
    mainTitleLine2,
    description,
    featuredLogos[] {
      logo,
      alt,
      url,
      height
    },
    ctaButton {
      text,
      link,
      isExternal
    }
  }
`;

/**
 * Fetch home page data from Sanity
 * This is designed to be called from a Server Component for SSG
 *
 * @returns HomePageData or null if not found
 */
export async function getHomePage(): Promise<HomePageData | null> {
  try {
    const isDev = process.env.NODE_ENV === "development";

    const data = await client.fetch<HomePageData>(
      HOME_PAGE_QUERY,
      {},
      {
        next: isDev
          ? { revalidate: 0 } // No cache in development for instant updates
          : { revalidate: 60, tags: ["homePage"] }, // 1 min cache + tag in production
      }
    );
    return data;
  } catch (error) {
    console.error("Error fetching home page:", error);
    return null;
  }
}
