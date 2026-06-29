import { client } from "../lib/client";
import type { AboutPageData } from "../types/about";

/**
 * GROQ query for the About page singleton
 */
export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  _id,
  _type,
  backgroundImage,
  title,
  description,
  visionTitle,
  visionDescription,
  missionTitle,
  missionDescription,
  seo
}`;

/**
 * Fetch the About page data
 */
export async function getAboutPage(): Promise<AboutPageData | null> {
  return client.fetch<AboutPageData | null>(
    ABOUT_PAGE_QUERY,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["aboutPage"],
      },
    }
  );
}
