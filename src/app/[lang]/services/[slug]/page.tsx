import Container from "@/components/layouts/Container";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllServices,
  getServiceBySlug,
  getServicesPage,
  getAllServiceSlugs,
} from "@/sanity/queries";
import {
  getLocalizedValue,
  getLocalizedBlockContent,
} from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { locales, isValidLocale, type Locale } from "@/i18n";
import PortableTextContent from "@/components/sanity/PortableTextContent";
import { formatTitle } from "@/lib/utils";
import ServicesGrid from "@/components/services/ServicesGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ServicePageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/**
 * Generate static params for all service pages across all locales
 * This ensures all pages are pre-rendered at build time (SSG)
 */
export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs();

  // Generate all combinations of locale and slug
  const params: Array<{ lang: string; slug: string }> = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ lang: locale, slug });
    }
  }

  return params;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { lang, slug } = await params;

  // Validate locale
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang: Locale = lang;

  // Fetch data in parallel
  const [service, servicesPage, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getServicesPage(),
    getAllServices(),
  ]);

  // If service not found, show 404
  if (!service) {
    notFound();
  }

  // Get localized values
  const pageLabel = servicesPage
    ? getLocalizedValue(servicesPage.label, currentLang)
    : "services";
  const serviceTitle = getLocalizedValue(service.title, currentLang);
  const serviceSummary = getLocalizedValue(service.summary, currentLang);
  const serviceContent = getLocalizedBlockContent(service.content, currentLang);

  // Get formatted title parts
  const { regularPart, boldPart } = formatTitle(serviceTitle);

  // Background image URL
  const backgroundImageUrl = servicesPage?.backgroundImage
    ? urlFor(servicesPage.backgroundImage).url()
    : "/images/services-bg.jpg";

  // Calculate prev/next services for navigation
  const currentIndex = allServices.findIndex((s) => s.slug.current === slug);
  const prevService = currentIndex > 0 ? allServices[currentIndex - 1] : null;
  const nextService =
    currentIndex < allServices.length - 1
      ? allServices[currentIndex + 1]
      : null;

  return (
    <section className="h-screen relative pt-[10vh] pb-2 md:py-[12vh]">
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
            <div className="my-2 md:hidden flex items-center gap-4 justify-between mb-4">
              <Link
                href={`/${currentLang}/services`}
                className="text-white text-sm border-b-white border-b"
              >
                View All Services
              </Link>
              <div className="flex gap-2">
                {/* Previous service */}
                {prevService ? (
                  <Link
                    href={`/${currentLang}/services/${prevService.slug.current}`}
                  >
                    <Button
                      size="icon"
                      className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer size-8"
                    >
                      <ArrowLeft />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="icon"
                    className="rounded-full bg-[#E5E5E5] text-black opacity-50 cursor-not-allowed size-8"
                    disabled
                  >
                    <ArrowLeft />
                  </Button>
                )}
                {/* Next service */}
                {nextService ? (
                  <Link
                    href={`/${currentLang}/services/${nextService.slug.current}`}
                  >
                    <Button
                      size="icon"
                      className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer size-8"
                    >
                      <ArrowRight />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="icon"
                    className="rounded-full bg-[#E5E5E5] text-black opacity-50 cursor-not-allowed size-8"
                    disabled
                  >
                    <ArrowRight />
                  </Button>
                )}
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl xl:text-4xl text-white font-grift">
              {regularPart && (
                <span className="font-normal">{regularPart} </span>
              )}
              <span className="font-bold">{boldPart}</span>
            </h1>
            <h3 className="text-white text-sm md:text-base xl:text-lg">
              {serviceSummary}
            </h3>
          </div>

          {/* Content Grid */}
          <div className="flex-1 min-h-0">
            <div className="md:grid md:grid-cols-[3fr_2fr] gap-4 h-full min-h-0 relative">
              {/* Rich Text Content */}
              <div className="text-xs h-full overflow-y-auto min-h-0 custom-scrollbar text-white pr-4 text-justify leading-loose">
                <PortableTextContent value={serviceContent} />
              </div>

              {/* Services Grid - Desktop Only */}
              <ServicesGrid
                services={allServices}
                currentLang={currentLang}
                currentSlug={slug}
                className="hidden md:grid"
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
