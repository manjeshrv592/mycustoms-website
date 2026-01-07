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
import type { ServiceData } from "@/sanity/types";
import {
  getLocalizedValue,
  getLocalizedBlockContent,
} from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { locales, isValidLocale, type Locale } from "@/i18n";
import PortableTextContent from "@/components/sanity/PortableTextContent";
import { formatTitle } from "@/lib/utils";

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

  return (
    <section className="h-screen relative py-[12vh]">
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
            <div className="flex items-center gap-4">
              <span className="inline-block h-px w-[50px] bg-[#7ED957]">
                &nbsp;
              </span>
              <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
                {pageLabel}
              </span>
            </div>
            <h1 className="text-4xl text-white font-grift">
              {regularPart && (
                <span className="font-normal">{regularPart} </span>
              )}
              <span className="font-bold">{boldPart}</span>
            </h1>
            <h3 className="text-white text-lg">{serviceSummary}</h3>
          </div>

          {/* Content Grid */}
          <div className="flex-1 min-h-0">
            <div className="grid grid-cols-2 gap-4 h-full min-h-0">
              {/* Rich Text Content */}
              <div className="text-xs h-full overflow-y-scroll min-h-0 custom-scrollbar text-white pr-4 text-justify leading-loose">
                <PortableTextContent value={serviceContent} />
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-3 gap-4 grid-rows-2">
                {allServices.map((item: ServiceData) => {
                  const itemTitle = getLocalizedValue(item.title, currentLang);
                  const isActive = item.slug.current === slug;

                  return (
                    <Link
                      key={item._id}
                      href={`/${currentLang}/services/${item.slug.current}`}
                      className={`border flex flex-col justify-between hover:scale-[1.04] transition-all bg-black/20 duration-300 cursor-pointer shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.85)] ${
                        isActive ? "border-[#3871C1]/50 border" : "border-none"
                      }`}
                    >
                      <div className="p-2 py-4">
                        <h4
                          className={`w-[70%] leading-[1.2] text-sm font-semibold ${
                            isActive ? "text-[#38B6FF]" : "text-white"
                          }`}
                        >
                          {itemTitle}
                        </h4>
                      </div>
                      <div className="flex-1 relative">
                        {item.image && (
                          <Image
                            src={urlFor(item.image).url()}
                            alt={item.image.alt || itemTitle}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
