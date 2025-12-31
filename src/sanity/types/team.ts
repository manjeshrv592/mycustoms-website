import type { LocalizedString, SanityImageField } from "./common";

/**
 * Team member data structure from Sanity
 */
export interface TeamMemberData {
  _id: string;
  _type: "teamMember";
  firstName: string;
  lastName: string;
  slug: { current: string };
  designation?: LocalizedString[];
  description?: LocalizedString[];
  image: SanityImageField;
  order?: number;
}
