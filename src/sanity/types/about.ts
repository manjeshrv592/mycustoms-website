import type { LocalizedString, SanityImageField } from "./common";

/**
 * About page singleton data structure from Sanity
 */
export interface AboutPageData {
  _id: string;
  _type: "aboutPage";
  backgroundImage: SanityImageField;
  title?: LocalizedString[];
  description?: LocalizedString[];
  visionTitle?: LocalizedString[];
  visionDescription?: LocalizedString[];
  missionTitle?: LocalizedString[];
  missionDescription?: LocalizedString[];
}
