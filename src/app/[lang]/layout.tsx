import type { Metadata } from "next";
import "../globals.css";
import "swiper/css";
import { fontVariables } from "@/lib/fonts";
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

export const metadata: Metadata = {
  // The template adds the "My Customs | " prefix to every child page's title.
  // Pages set their own `title` (e.g. "Home" -> "My Customs | Home").
  // `default` is used for any route that doesn't define its own title.
  title: {
    template: "My Customs | %s",
    default: "My Customs",
  },
  description:
    "My Customs — your trusted customs partner for fast, compliant, and seamlessly digital customs services.",
  icons: {
    icon: "/favicon.svg",
  },
};

/**
 * Generate static params for all supported locales
 * This ensures all language versions are pre-rendered at build time (SSG)
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Root layout for the public website with locale support.
 * Renders <html lang={lang}> so the document language matches the
 * active locale (en/nl/de/cn) for SEO and assistive technologies.
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
    <html lang={lang}>
      <body className={`${fontVariables} antialiased`}>
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
      </body>
    </html>
  );
}
