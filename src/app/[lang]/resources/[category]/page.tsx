import { redirect } from "next/navigation";
import {
  getFirstArticleSlugByCategory,
  getAllCategorySlugs,
} from "@/sanity/queries";
import { locales, isValidLocale } from "@/i18n";

interface CategoryPageProps {
  params: Promise<{ lang: string; category: string }>;
}

// Generate static params for all locales and categories
export async function generateStaticParams() {
  const categorySlugs = await getAllCategorySlugs();

  const params: { lang: string; category: string }[] = [];

  for (const lang of locales) {
    for (const category of categorySlugs) {
      params.push({ lang, category });
    }
  }

  return params;
}

/**
 * Category page - redirects to the first article in the category
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { lang, category } = await params;

  if (!isValidLocale(lang)) {
    redirect(`/en/resources/${category}`);
  }

  // Get first article in this category
  const firstArticleSlug = await getFirstArticleSlugByCategory(category);

  if (!firstArticleSlug) {
    // No articles in category - redirect to resources home
    redirect(`/${lang}/resources`);
  }

  // Redirect to the first article
  redirect(`/${lang}/resources/${category}/${firstArticleSlug}`);
}
