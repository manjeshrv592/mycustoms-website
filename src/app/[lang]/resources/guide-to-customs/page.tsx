import Container from "@/components/layouts/Container";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { locales, isValidLocale, type Locale } from "@/i18n";
import ResourcesSecondaryNav from "@/components/resources/ResourcesSecondaryNav";
import { getGuideToCustomsPage } from "@/sanity/queries";
import {
  getLocalizedValue,
  getLocalizedBlockContent,
} from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { formatTitle } from "@/lib/utils";
import PortableTextContent from "@/components/sanity/PortableTextContent";

interface GuideToCustomsPageProps {
  params: Promise<{ lang: string }>;
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function GuideToCustomsPage({
  params,
}: GuideToCustomsPageProps) {
  const { lang } = await params;
  const currentLang = isValidLocale(lang) ? (lang as Locale) : "en";

  // Fetch page data from Sanity
  const pageData = await getGuideToCustomsPage();

  if (!pageData) {
    notFound();
  }

  // Get localized values
  const label =
    getLocalizedValue(pageData.label, currentLang) || "Guide to Customs";
  const title =
    getLocalizedValue(pageData.title, currentLang) ||
    "Your Complete Guide to **Customs**";
  const { regularPart, boldPart } = formatTitle(title);
  const content = getLocalizedBlockContent(pageData.content, currentLang);

  // Side panel image
  const sidePanelImageUrl = pageData.sidePanelImage
    ? urlFor(pageData.sidePanelImage).width(600).height(400).quality(85).url()
    : "/images/resources-bg.jpg";

  return (
    <Container className="h-full flex flex-col">
      {/* Secondary Navigation - Desktop only */}
      <div className="hidden md:block mb-4">
        <ResourcesSecondaryNav
          currentPage="guide-to-customs"
          lang={currentLang}
        />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[3fr_2fr] xl:grid-cols-[4fr_2fr] gap-4">
        <div className="flex flex-col min-h-0 overflow-y-auto custom-scrollbar pr-4">
          <div>
            <div className="flex items-center gap-4">
              <span className="inline-block h-px w-[50px] bg-[#7ED957]">
                &nbsp;
              </span>
              <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
                Resources
              </span>
            </div>
            {/* View All Resources - Mobile only */}
            <Link
              href={`/${currentLang}/resources`}
              className="text-white text-sm border-b-white border-b md:hidden my-2 inline-block"
            >
              View All Resources
            </Link>

            <h1 className="h1 text-white font-grift mt-2">
              {regularPart && <span className="">{regularPart} </span>}
              <span className="font-bold">{boldPart}</span>
            </h1>
            {/* Side panel image - Mobile only */}
            <div className="h-[150px] md:h-[200px] relative lg:hidden my-4">
              <Image
                src={sidePanelImageUrl}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                alt={label}
                className="object-cover"
              />
            </div>
          </div>
          {/* Main content - scrollable */}
          <div className="flex-1 min-h-0 mt-2 md:mt-4 ">
            <div className="text-[#E5E5E5] text-xs leading-loose text-justify">
              <PortableTextContent value={content} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center">
          <div className="h-[calc(3.73rem+17.6vw)] relative hidden lg:block">
            {/* Side panel image */}
            <Image
              src={sidePanelImageUrl}
              fill
              sizes="40vw"
              alt={label}
              className="absolute object-cover"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
