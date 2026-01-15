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
    <section className="h-screen pt-[10vh] pb-2 lg:pb-8 md:pt-[12vh] 2xl:py-[calc(0.16rem+6vw)]">
      {/* Background Image */}
      <Image
        src={backgroundImageUrl}
        alt="Portal background"
        fill
        className="object-cover filter brightness-30"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.8)_0%,rgba(0,0,0,.8)_100%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3871C1_0%,#000000_20%)] opacity-50"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full flex flex-col gap-4">
          {/* Header */}
          <div>
            <div className="flex items-center gap-4">
              <span className="inline-block h-px w-[50px] bg-[#7ED957]">
                &nbsp;
              </span>
              <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
                {label}
              </span>
            </div>

            <div className="md:grid md:grid-cols-[3fr_1fr] lg:grid-cols-[3fr_2fr] gap-4">
              <div>
                <h1 className="h1 text-white font-grift">
                  {regularPart && (
                    <span className="font-light">{regularPart} </span>
                  )}
                  <span className="font-bold">{boldPart}</span>
                </h1>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex-1 min-h-0">
            <div className="md:grid md:grid-cols-[3fr_1fr] lg:grid-cols-[3fr_2fr] gap-4 h-full min-h-0">
              {/* Main content rich text - scrollable */}
              <div className="h-full overflow-y-auto min-h-0 custom-scrollbar text-[#E5E5E5] pr-4 text-justify leading-loose">
                <PortableTextContent value={content} />
              </div>

              {/* Side Panel */}
              <div className="flex flex-col gap-2 lg:justify-center">
                <div className="flex justify-center flex-col text-center lg:mb-4">
                  <h3 className="text-[clamp(1.5rem,calc(2.21vw-0.137rem),100vw)] text-[#3871C1] mb-4 2xl:mb-6">
                    {sidePanelTitle}
                  </h3>
                  <p className="text-[#E5E5E5] leading-loose mb-2">
                    {sidePanelDescription}
                  </p>
                  {ctaButtonIsExternal ? (
                    <a
                      href={ctaButtonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-auto"
                    >
                      <PrimaryButton className="text-[#E5E5E5]">
                        {ctaButtonText}
                      </PrimaryButton>
                    </a>
                  ) : (
                    <a
                      href={"https://my-customs.nl/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-auto"
                    >
                      <PrimaryButton className="text-[#E5E5E5]">
                        {ctaButtonText}
                      </PrimaryButton>
                    </a>
                  )}
                </div>
                <div className="relative hidden md:block h-[calc(20vw-0.12rem)]">
                  {/* Side panel image */}
                  <Image
                    src={sidePanelImageUrl}
                    fill
                    alt="Portal preview"
                    className="absolute object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
