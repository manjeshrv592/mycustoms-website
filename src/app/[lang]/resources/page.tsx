import Image from "next/image";
import { notFound } from "next/navigation";
import { getResourcesGridData, getFirstBlogSlug } from "@/sanity/queries";
import { locales, isValidLocale, type Locale } from "@/i18n";
import Container from "@/components/layouts/Container";
import ResourcesGrid from "@/components/resources/ResourcesGrid";
import DesktopRedirect from "@/components/services/DesktopRedirect";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
};

interface ResourcesPageProps {
  params: Promise<{ lang: string }>;
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Resources index page
 * - Mobile: Shows resources grid (stays on this page)
 * - Desktop: Redirects to first blog via client-side redirect
 */
export default async function ResourcesPage({ params }: ResourcesPageProps) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang: Locale = lang;

  // Fetch data in parallel
  const [gridData, firstBlogSlug] = await Promise.all([
    getResourcesGridData(),
    getFirstBlogSlug(),
  ]);

  // Target URL for desktop redirect
  const desktopRedirectUrl = firstBlogSlug
    ? `/${currentLang}/resources/blogs/${firstBlogSlug}`
    : `/${currentLang}/resources/blogs`;

  return (
    <>
      {/* Desktop redirect - only triggers on md+ screens */}
      <DesktopRedirect targetUrl={desktopRedirectUrl} />

      {/* Mobile View - Resources Grid Page */}
      <Container className="h-full flex flex-col gap-4 md:hidden">
        {/* Header */}
        <div>
          <div className="flex items-center gap-4 mb-4 mt-2">
            <span className="inline-block h-px w-[50px] bg-[#7ED957]">
              &nbsp;
            </span>
            <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
              Resources
            </span>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="flex-1 min-h-0">
          <ResourcesGrid
            gridData={gridData}
            currentLang={currentLang}
            className="h-full"
          />
        </div>
      </Container>

      {/* Desktop View - Loading skeleton while redirect happens */}
      <Container className="h-full hidden md:flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Loading...</div>
      </Container>
    </>
  );
}
