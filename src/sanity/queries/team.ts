import { client } from "../lib/client";
import type { TeamMemberData } from "../types/team";

/**
 * GROQ query for all team members ordered by display order
 */
export const TEAM_MEMBERS_QUERY = `*[_type == "teamMember"] | order(order asc) {
  _id,
  _type,
  firstName,
  lastName,
  slug,
  designation,
  description,
  image,
  order
}`;

/**
 * Fetch all team members
 */
export async function getAllTeamMembers(): Promise<TeamMemberData[]> {
  return client.fetch<TeamMemberData[]>(
    TEAM_MEMBERS_QUERY,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["teamMember"],
      },
    }
  );
}
