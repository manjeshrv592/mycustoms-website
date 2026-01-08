import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllServices,
  getServicesPage,
  getFirstServiceSlug,
} from "@/sanity/queries";
import { getLocalizedValue } from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { locales, isValidLocale, type Locale } from "@/i18n";
import Container from "@/components/layouts/Container";
import ServicesGrid from "@/components/services/ServicesGrid";
import DesktopRedirect from "@/components/services/DesktopRedirect";

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
 * Services index page
 * - Mobile: Shows services grid (stays on this page)
 * - Desktop: Redirects to first service via client-side redirect
 */
export default async function ServicesPage({ params }: ServicesPageProps) {
  const { lang } = await params;

  // Validate locale
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang: Locale = lang;

  // Fetch data in parallel
  const [allServices, servicesPage, firstSlug] = await Promise.all([
    getAllServices(),
    getServicesPage(),
    getFirstServiceSlug(),
  ]);

  // If no services found, show 404
  if (!allServices || allServices.length === 0) {
    notFound();
  }

  // Get localized page label
  const pageLabel = servicesPage
    ? getLocalizedValue(servicesPage.label, currentLang)
    : "services";

  // Background image URL
  const backgroundImageUrl = servicesPage?.backgroundImage
    ? urlFor(servicesPage.backgroundImage).url()
    : "/images/services-bg.jpg";

  // Target URL for desktop redirect
  const desktopRedirectUrl = firstSlug
    ? `/${currentLang}/services/${firstSlug}`
    : null;

  return (
    <>
      {/* Desktop redirect - only triggers on md+ screens */}
      {desktopRedirectUrl && <DesktopRedirect targetUrl={desktopRedirectUrl} />}

      {/* Mobile View - Services Grid Page */}
      <section className="h-screen relative py-[12vh] md:hidden">
        {/* Background Image */}
        <Image
          src={backgroundImageUrl}
          alt="Services background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.8)_0%,rgba(0,0,0,.8)_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3871C1_0%,#000000_33%)] opacity-50"></div>

        <div className="relative z-20 h-full">
          <Container className="h-full flex flex-col gap-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="inline-block h-px w-[50px] bg-[#7ED957]">
                  &nbsp;
                </span>
                <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
                  {pageLabel}
                </span>
              </div>
            </div>

            {/* Services Grid */}
            <div className="flex-1 min-h-0">
              <ServicesGrid
                services={allServices}
                currentLang={currentLang}
                className="h-full"
              />
            </div>
          </Container>
        </div>
      </section>

      {/* Desktop View - Loading skeleton while redirect happens */}
      <section className="h-screen relative py-[12vh] hidden md:block">
        {/* Background Image */}
        <Image
          src={backgroundImageUrl}
          alt="Services background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.8)_0%,rgba(0,0,0,.8)_100%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3871C1_0%,#000000_33%)] opacity-50"></div>

        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-white text-lg animate-pulse">Loading...</div>
        </div>
      </section>
    </>
  );
}
