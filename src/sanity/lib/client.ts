import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Set to false for ISR and tag-based revalidation to work correctly
  // When using on-demand revalidation, we need to fetch fresh data from Sanity
  useCdn: false,
});
