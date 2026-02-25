import PrimaryNav from "@/components/layouts/PrimaryNav";
import Header from "@/components/layouts/Header";
import { locales, isValidLocale } from "@/i18n";
import { notFound } from "next/navigation";
import { getFirstServiceSlug, getFirstBlogSlug, getPortalPageIsActive } from "@/sanity/queries";
import { Toaster } from "@/components/ui/sonner";
import { ViewTransitions } from "next-view-transitions";
import { NavigationProvider } from "@/context/NavigationContext";
import SwipeNavigator from "@/components/SwipeNavigator";

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
 * Adds Header and Navigation components with View Transitions
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

  // Fetch first slugs and portal status for direct navigation (SSG-compatible)
  const [firstServiceSlug, firstBlogSlug, isPortalActive] = await Promise.all([
    getFirstServiceSlug(),
    getFirstBlogSlug(),
    getPortalPageIsActive(),
  ]);

  return (
    <ViewTransitions>
      <NavigationProvider
        firstServiceSlug={firstServiceSlug}
        firstBlogSlug={firstBlogSlug}
        isPortalActive={isPortalActive}
      >
        <SwipeNavigator>
          <Header />
          <PrimaryNav
            firstServiceSlug={firstServiceSlug}
            firstBlogSlug={firstBlogSlug}
            isPortalActive={isPortalActive}
          />
          {children}
          <Toaster position="bottom-right" richColors />
        </SwipeNavigator>
      </NavigationProvider>
    </ViewTransitions>
  );
}
