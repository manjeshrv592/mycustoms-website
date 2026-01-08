import PrimaryButton from "@/components/custom-ui/PrimaryButton";
import Image from "next/image";
import { getHomePage } from "@/sanity/queries";
import { getLocalizedValue } from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { locales, isValidLocale, defaultLocale, type Locale } from "@/i18n";
import { notFound } from "next/navigation";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

/**
 * Generate static params for all supported locales
 * This ensures all language versions are pre-rendered at build time (SSG)
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Home({ params }: HomePageProps) {
  const { lang } = await params;

  // Validate locale
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang: Locale = lang;
  const homeData = await getHomePage();

  // Fallback values if Sanity data is not available
  const titleLine1 = homeData
    ? getLocalizedValue(homeData.mainTitleLine1, currentLang)
    : "More Than";
  const titleLine2 = homeData
    ? getLocalizedValue(homeData.mainTitleLine2, currentLang)
    : "Customs";
  const description = homeData
    ? getLocalizedValue(homeData.description, currentLang)
    : "Your trusted customs partner — fast, compliant, and seamlessly digital.";
  const ctaText = homeData?.ctaButton
    ? getLocalizedValue(homeData.ctaButton.text, currentLang)
    : "Schedule a Call";
  const ctaLink = homeData?.ctaButton?.link || "#";

  // Background image URL from Sanity or fallback
  const backgroundImageUrl = homeData?.backgroundImage
    ? urlFor(homeData.backgroundImage).url()
    : "/images/hero-bg-new.png";

  // Mobile background image URL (falls back to main background if not set)
  const mobileBackgroundImageUrl = homeData?.mobileBackgroundImage
    ? urlFor(homeData.mobileBackgroundImage).url()
    : backgroundImageUrl;

  return (
    <section className="min-h-screen bg-neutral-200 flex justify-center relative xl:pt-[20vh] pt-[15vh]">
      {/* Desktop Background Image */}
      <Image
        src={backgroundImageUrl}
        alt="Hero background"
        fill
        className="object-cover object-top-right hidden md:block"
      />
      {/* Mobile Background Image */}
      <Image
        src={mobileBackgroundImageUrl}
        alt="Hero background mobile"
        fill
        className="object-cover md:hidden"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0)_50%,rgba(0,0,0,0.4)_100%)]"></div>
      <div className="text-center relative z-20">
        <h1 className="font-grift uppercase mb-4 md:mb-2 flex flex-col md:flex-row md:gap-3">
          <span className="text-[#66BD5A] text-2xl md:text-7xl">
            {titleLine1}
          </span>
          <span className="text-[#5e98e9] text-5xl md:text-7xl md:mt-0 inline-block">
            {titleLine2}
          </span>
        </h1>
        <p className="text-sm md:text-lg px-10 md:px-0 uppercase text-white">
          {description}
        </p>
        <div className="flex gap-4 items-center justify-center py-4">
          {homeData?.featuredLogos && homeData.featuredLogos.length > 0 ? (
            homeData.featuredLogos.map((logo, index) => (
              <Image
                key={index}
                src={urlFor(logo.logo).url()}
                alt={logo.alt}
                width={200}
                height={logo.height || 48}
                style={{ height: logo.height || 48, width: "auto" }}
              />
            ))
          ) : (
            <>
              <Image
                src="/images/featured-logos/fenex.png"
                alt="Fenex logo"
                width={178}
                height={48}
                className="w-[100px] md:w-[158px] h-auto"
              />
              <Image
                src="/images/featured-logos/aeo.png"
                alt="AEO logo"
                width={127}
                height={95}
                className="w-[70px] md:w-[100px] h-auto"
              />
            </>
          )}
        </div>
        {homeData?.ctaButton?.link ? (
          <a
            href={ctaLink}
            target={homeData.ctaButton.isExternal ? "_blank" : undefined}
          >
            <PrimaryButton variant="gradient">{ctaText}</PrimaryButton>
          </a>
        ) : (
          <PrimaryButton>{ctaText}</PrimaryButton>
        )}
      </div>
    </section>
  );
}
