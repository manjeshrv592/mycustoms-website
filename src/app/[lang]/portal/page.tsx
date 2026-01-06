import PrimaryButton from "@/components/custom-ui/PrimaryButton";
import Container from "@/components/layouts/Container";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortalPage } from "@/sanity/queries";
import {
  getLocalizedValue,
  getLocalizedBlockContent,
} from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { locales, isValidLocale, type Locale } from "@/i18n";
import PortableTextContent from "@/components/sanity/PortableTextContent";
import { formatTitle } from "@/lib/utils";

interface PortalPageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Generate static params for all locales
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Portal({ params }: PortalPageProps) {
  const { lang } = await params;

  // Validate locale
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang: Locale = lang;

  // Fetch portal page data
  const portalData = await getPortalPage();

  if (!portalData) {
    notFound();
  }

  // Get localized values
  const label =
    getLocalizedValue(portalData.label, currentLang) || "Our Portal";
  const title = getLocalizedValue(portalData.title, currentLang);
  const { regularPart, boldPart } = formatTitle(title);
  const content = getLocalizedBlockContent(portalData.content, currentLang);
  const sidePanelTitle = getLocalizedValue(
    portalData.sidePanelTitle,
    currentLang
  );
  const sidePanelDescription = getLocalizedValue(
    portalData.sidePanelDescription,
    currentLang
  );
  const ctaButtonText = portalData.ctaButton
    ? getLocalizedValue(portalData.ctaButton.text, currentLang)
    : "Portal";
  const ctaButtonLink = portalData.ctaButton?.link || "#";
  const ctaButtonIsExternal = portalData.ctaButton?.isExternal;

  // Image URLs
  const backgroundImageUrl = urlFor(portalData.backgroundImage).url();
  const sidePanelImageUrl = portalData.sidePanelImage
    ? urlFor(portalData.sidePanelImage).url()
    : "/images/team/portal-image.jpg";

  return (
    <section className="h-screen py-[12vh]">
      {/* Background Image */}
      <Image
        src={backgroundImageUrl}
        alt="Portal background"
        fill
        className="object-cover filter brightness-30"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3871C1_0%,#000000_33%)] opacity-50"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full grid grid-cols-[1fr] md:grid-cols-[1.3fr_1fr] gap-4 md:gap-16">
          <div className="flex flex-col min-h-0">
            <div>
              <div className="flex items-center gap-4">
                <span className="inline-block h-px w-[50px] bg-[#7ED957]">
                  &nbsp;
                </span>
                <span className="text-[#7ED957] uppercase text-sm md:text-xs tracking-[7px] md:tracking-[5px] md:font-bold">
                  {label}
                </span>
              </div>
              <h1 className="text-2xl md:text-5xl uppercase md:normal-case font-grift text-white mt-2 md:mt-4">
                {regularPart && (
                  <span className="md:font-normal">{regularPart} </span>
                )}
                <span className="md:font-bold">{boldPart}</span>
              </h1>
            </div>
            {/* Main content rich text - scrollable */}
            <div className="flex-1 min-h-0 mt-2 md:mt-4 overflow-y-auto custom-scrollbar pr-4">
              <div className="text-[#E5E5E5] text-sm md:leading-loose leading-[15px] text-justify">
                <PortableTextContent value={content} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-center flex-col text-center py-4 md:py-10 px-10 md:px-30">
              <h3 className="text-2xl md:text-3xl text-[#3871C1]">
                {sidePanelTitle}
              </h3>
              <p className="text-xs text-[#E5E5E5] mt-4 leading-[20px]">
                {sidePanelDescription}
              </p>
              {ctaButtonIsExternal ? (
                <a
                  href={ctaButtonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 mx-auto"
                >
                  <PrimaryButton className="text-[#E5E5E5]">
                    {ctaButtonText}
                  </PrimaryButton>
                </a>
              ) : (
                <Link href={ctaButtonLink} className="mt-4 mx-auto">
                  <PrimaryButton className="text-[#E5E5E5]">
                    {ctaButtonText}
                  </PrimaryButton>
                </Link>
              )}
            </div>
            <div className="flex-1 relative hidden md:block">
              {/* Side panel image */}
              <Image
                src={sidePanelImageUrl}
                fill
                alt="Portal preview"
                className="absolute object-cover"
              />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
