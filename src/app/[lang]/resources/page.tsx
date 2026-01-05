import { redirect } from "next/navigation";
import {
  getFirstCategorySlug,
  getFirstArticleSlugByCategory,
} from "@/sanity/queries";
import { locales, isValidLocale } from "@/i18n";

interface ResourcesPageProps {
  params: Promise<{ lang: string }>;
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Resources index page - redirects to the first article of the first category
 */
export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    redirect(`/en/resources`);
  }

  // Get first category slug
  const firstCategorySlug = await getFirstCategorySlug();

  if (!firstCategorySlug) {
    // No categories exist - show a placeholder or redirect to home
    redirect(`/${lang}`);
  }

  // Get first article in that category
  const firstArticleSlug =
    await getFirstArticleSlugByCategory(firstCategorySlug);

  if (!firstArticleSlug) {
    // No articles in category - redirect to category page (which will show empty state)
    redirect(`/${lang}/resources/${firstCategorySlug}`);
  }

  // Redirect to the first article
  redirect(`/${lang}/resources/${firstCategorySlug}/${firstArticleSlug}`);
}
