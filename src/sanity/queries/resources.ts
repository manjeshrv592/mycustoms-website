import { client } from "../lib/client";
import type { ResourceCategoryData, ArticleData } from "../types/resources";

// ============================================
// CATEGORY QUERIES
// ============================================

/**
 * GROQ query for all resource categories ordered by display order
 */
export const RESOURCE_CATEGORIES_QUERY = `*[_type == "resourceCategory"] | order(order asc) {
  _id,
  _type,
  title,
  slug,
  key,
  order
}`;

/**
 * Fetch all resource categories
 */
export async function getAllResourceCategories(): Promise<
  ResourceCategoryData[]
> {
  return client.fetch<ResourceCategoryData[]>(
    RESOURCE_CATEGORIES_QUERY,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["resourceCategory"],
      },
    }
  );
}

/**
 * Get first category slug (for redirecting /resources)
 */
export async function getFirstCategorySlug(): Promise<string | null> {
  const result = await client.fetch<{ slug: { current: string } } | null>(
    `*[_type == "resourceCategory"] | order(order asc)[0]{ slug }`,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["resourceCategory"],
      },
    }
  );
  return result?.slug?.current || null;
}

// ============================================
// ARTICLE QUERIES
// ============================================

/**
 * GROQ query for articles by category slug
 */
export const ARTICLES_BY_CATEGORY_QUERY = `*[_type == "article" && category->slug.current == $categorySlug] | order(order asc, publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  summary,
  content,
  image,
  publishedAt,
  order,
  "category": category->{
    _id,
    _type,
    title,
    slug,
    key,
    order
  }
}`;

/**
 * Fetch all articles for a category
 */
export async function getArticlesByCategory(
  categorySlug: string
): Promise<ArticleData[]> {
  return client.fetch<ArticleData[]>(
    ARTICLES_BY_CATEGORY_QUERY,
    { categorySlug },
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["article", "resourceCategory"],
      },
    }
  );
}

/**
 * Get first article slug for a category (for redirecting)
 */
export async function getFirstArticleSlugByCategory(
  categorySlug: string
): Promise<string | null> {
  const result = await client.fetch<{ slug: { current: string } } | null>(
    `*[_type == "article" && category->slug.current == $categorySlug] | order(order asc, publishedAt desc)[0]{ slug }`,
    { categorySlug },
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["article"],
      },
    }
  );
  return result?.slug?.current || null;
}

/**
 * Fetch a single article by slug
 */
export async function getArticleBySlug(
  articleSlug: string
): Promise<ArticleData | null> {
  return client.fetch<ArticleData | null>(
    `*[_type == "article" && slug.current == $articleSlug][0]{
      _id,
      _type,
      title,
      slug,
      summary,
      content,
      image,
      publishedAt,
      order,
      "category": category->{
        _id,
        _type,
        title,
        slug,
        key,
        order
      }
    }`,
    { articleSlug },
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["article"],
      },
    }
  );
}

/**
 * Get all article slugs with their category slugs (for generateStaticParams)
 */
export async function getAllArticleSlugsWithCategories(): Promise<
  { categorySlug: string; articleSlug: string }[]
> {
  const articles = await client.fetch<
    { slug: { current: string }; category: { slug: { current: string } } }[]
  >(
    `*[_type == "article"]{
      slug,
      "category": category->{ slug }
    }`,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["article"],
      },
    }
  );

  return articles.map((article) => ({
    categorySlug: article.category?.slug?.current || "",
    articleSlug: article.slug?.current || "",
  }));
}

/**
 * Get all category slugs (for generateStaticParams)
 */
export async function getAllCategorySlugs(): Promise<string[]> {
  const categories = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "resourceCategory"]{ slug }`,
    {},
    {
      next: {
        revalidate: process.env.NODE_ENV === "production" ? 60 : 0,
        tags: ["resourceCategory"],
      },
    }
  );

  return categories.map((cat) => cat.slug?.current).filter(Boolean);
}
