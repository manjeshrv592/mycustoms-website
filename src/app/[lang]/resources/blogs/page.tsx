import { redirect } from "next/navigation";
import { getFirstBlogSlug } from "@/sanity/queries";
import { locales, isValidLocale } from "@/i18n";

interface BlogsPageProps {
  params: Promise<{ lang: string }>;
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Blogs index page - redirects to the first blog article
 */
export default async function BlogsPage({ params }: BlogsPageProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    redirect(`/en/resources/blogs`);
  }

  // Get first blog slug
  const firstBlogSlug = await getFirstBlogSlug();

  if (!firstBlogSlug) {
    // No blogs exist - redirect to resources home
    redirect(`/${lang}/resources`);
  }

  // Redirect to the first blog
  redirect(`/${lang}/resources/blogs/${firstBlogSlug}`);
}
