import { redirect, notFound } from "next/navigation";
import { getFirstServiceSlug } from "@/sanity/queries";
import { locales, isValidLocale, type Locale } from "@/i18n";

interface ServicesPageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Generate static params for all locales
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Services index page - redirects to the first service
 * This is SSG-compatible as the redirect happens at request time
 */
export default async function ServicesPage({ params }: ServicesPageProps) {
  const { lang } = await params;

  // Validate locale
  if (!isValidLocale(lang)) {
    notFound();
  }

  // Get the first service slug
  const firstSlug = await getFirstServiceSlug();

  if (!firstSlug) {
    // No services found - could show empty state or 404
    notFound();
  }

  // Redirect to the first service
  redirect(`/${lang}/services/${firstSlug}`);
}
