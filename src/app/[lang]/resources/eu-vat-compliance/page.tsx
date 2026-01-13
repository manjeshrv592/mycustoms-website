import Container from "@/components/layouts/Container";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { locales, isValidLocale, type Locale } from "@/i18n";
import ResourcesSecondaryNav from "@/components/resources/ResourcesSecondaryNav";
import { getEuVatCompliancePage } from "@/sanity/queries";
import {
  getLocalizedValue,
  getLocalizedBlockContent,
} from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { formatTitle } from "@/lib/utils";
import PortableTextContent from "@/components/sanity/PortableTextContent";

interface EuVatCompliancePageProps {
  params: Promise<{ lang: string }>;
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function EuVatCompliancePage({
  params,
}: EuVatCompliancePageProps) {
  const { lang } = await params;
  const currentLang = isValidLocale(lang) ? (lang as Locale) : "en";

  // Fetch page data from Sanity
  const pageData = await getEuVatCompliancePage();

  if (!pageData) {
    notFound();
  }

  // Get localized values
  const label =
    getLocalizedValue(pageData.label, currentLang) || "EU VAT Compliance";
  const title =
    getLocalizedValue(pageData.title, currentLang) ||
    "Understanding EU VAT **Compliance**";
  const { regularPart, boldPart } = formatTitle(title);
  const content = getLocalizedBlockContent(pageData.content, currentLang);

  // Side panel image
  const sidePanelImageUrl = pageData.sidePanelImage
    ? urlFor(pageData.sidePanelImage).width(600).height(400).quality(85).url()
    : "/images/resources-bg.jpg";

  return (
    <Container className="h-full flex flex-col">
      {/* Secondary Navigation - Desktop only */}
      <div className="hidden md:block">
        <ResourcesSecondaryNav
          currentPage="eu-vat-compliance"
          lang={currentLang}
        />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[1fr] md:grid-cols-[2fr_1fr] gap-4 md:gap-16 mt-4">
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
            <div className="h-[150px] relative md:hidden my-4">
              <Image
                src={sidePanelImageUrl}
                fill
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
          <div className="h-[calc(3.73rem+17.6vw)] relative hidden md:block">
            {/* Side panel image */}
            <Image
              src={sidePanelImageUrl}
              fill
              alt={label}
              className="absolute object-cover"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}
