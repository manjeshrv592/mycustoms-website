import PrimaryNav from "@/components/layouts/PrimaryNav";
import Header from "@/components/layouts/Header";
import { locales, isValidLocale, type Locale } from "@/i18n";
import { notFound } from "next/navigation";
import { getFirstServiceSlug } from "@/sanity/queries";
import { Toaster } from "@/components/ui/sonner";

interface LangLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

/**
 * Generate static params for all supported locales
 * This ensures all language versions are pre-rendered at build time (SSG)
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Layout for main website pages with locale support
 * Adds Header and Navigation components
 */
export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;

  // Validate locale - return 404 if invalid
  if (!isValidLocale(lang)) {
    notFound();
  }

  // Fetch first service slug for direct navigation (SSG-compatible)
  const firstServiceSlug = await getFirstServiceSlug();

  return (
    <>
      <Header />
      <PrimaryNav firstServiceSlug={firstServiceSlug} />
      {children}
      <Toaster position="bottom-right" richColors />
    </>
  );
}
