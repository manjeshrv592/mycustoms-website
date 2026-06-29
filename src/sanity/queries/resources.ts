import { client } from "../lib/client";
import type { BlogData } from "../types/resources";

// ============================================
// BLOG QUERIES
// ============================================

/**
 * GROQ query for all active blogs ordered by display order and date
 */
export const BLOGS_QUERY = `*[_type == "blog" && isActive == true] | order(order asc, publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  summary,
  content,
  image,
  publishedAt,
  order,
  isActive
}`;

/**
 * Fetch all active blogs
 */
export async function getAllBlogs(): Promise<BlogData[]> {
  return client.fetch<BlogData[]>(
    BLOGS_QUERY,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["blog"],
      },
    }
  );
}

/**
 * Get first blog slug (for redirecting /resources/blogs)
 */
export async function getFirstBlogSlug(): Promise<string | null> {
  const result = await client.fetch<{ slug: { current: string } } | null>(
    `*[_type == "blog" && isActive == true] | order(order asc, publishedAt desc)[0]{ slug }`,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["blog"],
      },
    }
  );
  return result?.slug?.current || null;
}

/**
 * Fetch a single blog by slug
 */
export async function getBlogBySlug(
  blogSlug: string
): Promise<BlogData | null> {
  return client.fetch<BlogData | null>(
    `*[_type == "blog" && slug.current == $blogSlug && isActive == true][0]{
      _id,
      _type,
      title,
      slug,
      summary,
      content,
      image,
      publishedAt,
      order,
      isActive,
      seo
    }`,
    { blogSlug },
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["blog"],
      },
    }
  );
}

/**
 * Get all blog slugs (for generateStaticParams)
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  const blogs = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "blog" && isActive == true]{ slug }`,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["blog"],
      },
    }
  );

  return blogs.map((blog) => blog.slug?.current).filter(Boolean);
}

// ============================================
// RESOURCES GRID DATA
// ============================================

export interface ResourcesGridData {
  firstBlogImage: { asset: { _ref: string }; alt?: string } | null;
  firstBlogSlug: string | null;
  euVatImage: { asset: { _ref: string }; alt?: string } | null;
  guideToCustomsImage: { asset: { _ref: string }; alt?: string } | null;
  fiscalRepImage: { asset: { _ref: string }; alt?: string } | null;
}

/**
 * Fetch all images needed for resources grid on mobile
 */
export async function getResourcesGridData(): Promise<ResourcesGridData> {
  const result = await client.fetch<{
    firstBlog: {
      image: { asset: { _ref: string }; alt?: string } | null;
      slug: { current: string };
    } | null;
    euVat: {
      sidePanelImage: { asset: { _ref: string }; alt?: string } | null;
    } | null;
    guideToCustoms: {
      sidePanelImage: { asset: { _ref: string }; alt?: string } | null;
    } | null;
    fiscalRep: {
      sidePanelImage: { asset: { _ref: string }; alt?: string } | null;
    } | null;
  }>(
    `{
      "firstBlog": *[_type == "blog" && isActive == true] | order(order asc, publishedAt desc)[0]{ image, slug },
      "euVat": *[_type == "euVatCompliancePage"][0]{ sidePanelImage },
      "guideToCustoms": *[_type == "guideToCustomsPage"][0]{ sidePanelImage },
      "fiscalRep": *[_type == "fiscalRepresentationPage"][0]{ sidePanelImage }
    }`,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: [
          "blog",
          "euVatCompliancePage",
          "guideToCustomsPage",
          "fiscalRepresentationPage",
        ],
      },
    }
  );

  return {
    firstBlogImage: result.firstBlog?.image || null,
    firstBlogSlug: result.firstBlog?.slug?.current || null,
    euVatImage: result.euVat?.sidePanelImage || null,
    guideToCustomsImage: result.guideToCustoms?.sidePanelImage || null,
    fiscalRepImage: result.fiscalRep?.sidePanelImage || null,
  };
}
