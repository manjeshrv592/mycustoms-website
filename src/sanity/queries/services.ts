import { client } from "../lib/client";
import type { ServiceData, ServicesPageData } from "../types";

/**
 * GROQ query for fetching all services (for sidebar/navigation)
 */
export const ALL_SERVICES_QUERY = `
  *[_type == "service" && isActive == true] | order(order asc) {
    _id,
    _type,
    title,
    slug,
    summary,
    image {
      ...,
      alt
    },
    isActive,
    order
  }
`;

/**
 * GROQ query for fetching a single service by slug
 */
export const SERVICE_BY_SLUG_QUERY = `
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    summary,
    content,
    image {
      ...,
      alt
    },
    order
  }
`;

/**
 * GROQ query for fetching services page singleton
 */
export const SERVICES_PAGE_QUERY = `
  *[_type == "servicesPage"][0] {
    _id,
    _type,
    backgroundImage,
    label,
    title,
    subtitle
  }
`;

/**
 * GROQ query for fetching just the first service slug (for redirect)
 */
export const FIRST_SERVICE_SLUG_QUERY = `
  *[_type == "service" && isActive == true] | order(order asc)[0] {
    "slug": slug.current
  }
`;

/**
 * GROQ query for fetching all service slugs (for generateStaticParams)
 */
export const ALL_SERVICE_SLUGS_QUERY = `
  *[_type == "service"] {
    "slug": slug.current
  }
`;

/**
 * Fetch all services
 */
export async function getAllServices(): Promise<ServiceData[]> {
  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<ServiceData[]>(
    ALL_SERVICES_QUERY,
    {},
    {
      next: isDev ? { revalidate: 0 } : { revalidate: 60, tags: ["services"] },
    }
  );
}

/**
 * Fetch a single service by slug
 */
export async function getServiceBySlug(
  slug: string
): Promise<ServiceData | null> {
  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<ServiceData | null>(
    SERVICE_BY_SLUG_QUERY,
    { slug },
    {
      next: isDev
        ? { revalidate: 0 }
        : { revalidate: 60, tags: ["services", `service-${slug}`] },
    }
  );
}

/**
 * Fetch services page singleton
 */
export async function getServicesPage(): Promise<ServicesPageData | null> {
  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<ServicesPageData | null>(
    SERVICES_PAGE_QUERY,
    {},
    {
      next: isDev
        ? { revalidate: 0 }
        : { revalidate: 60, tags: ["servicesPage"] },
    }
  );
}

/**
 * Fetch the first service slug (for redirect)
 */
export async function getFirstServiceSlug(): Promise<string | null> {
  const isDev = process.env.NODE_ENV === "development";

  const result = await client.fetch<{ slug: string } | null>(
    FIRST_SERVICE_SLUG_QUERY,
    {},
    {
      next: isDev ? { revalidate: 0 } : { revalidate: 60, tags: ["services"] },
    }
  );

  return result?.slug || null;
}

/**
 * Fetch all service slugs (for generateStaticParams)
 */
export async function getAllServiceSlugs(): Promise<string[]> {
  const result = await client.fetch<Array<{ slug: string }>>(
    ALL_SERVICE_SLUGS_QUERY,
    {},
    {
      next: { revalidate: 60, tags: ["services"] },
    }
  );

  return result.map((item) => item.slug);
}
