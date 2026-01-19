import Container from "@/components/layouts/Container";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAboutPage, getAllTeamMembers } from "@/sanity/queries";
import { getLocalizedValue } from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { locales, isValidLocale, type Locale } from "@/i18n";
import TeamCarousel from "@/components/about/TeamCarousel";

interface AboutPageProps {
  params: Promise<{ lang: string }>;
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function About({ params }: AboutPageProps) {
  const { lang } = await params;

  // Validate locale
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  // Fetch about page data and team members
  const [aboutData, teamMembers] = await Promise.all([
    getAboutPage(),
    getAllTeamMembers(),
  ]);

  if (!aboutData) {
    notFound();
  }

  // Get localized values
  const title = getLocalizedValue(aboutData.title, currentLang) || "About us";
  const description =
    getLocalizedValue(aboutData.description, currentLang) || "";
  const visionTitle =
    getLocalizedValue(aboutData.visionTitle, currentLang) || "Vision";
  const visionDescription =
    getLocalizedValue(aboutData.visionDescription, currentLang) || "";
  const missionTitle =
    getLocalizedValue(aboutData.missionTitle, currentLang) || "Mission";
  const missionDescription =
    getLocalizedValue(aboutData.missionDescription, currentLang) || "";

  // Get background image URL
  const backgroundImageUrl = aboutData.backgroundImage
    ? urlFor(aboutData.backgroundImage).width(1920).quality(85).url()
    : "/images/about-us-bg.jpg";

  // Transform team members for the carousel
  const teamMembersForCarousel = teamMembers.map((member) => ({
    id: member._id,
    firstName: member.firstName,
    lastName: member.lastName,
    designation: getLocalizedValue(member.designation, currentLang) || "",
    description: getLocalizedValue(member.description, currentLang) || "",
    imageUrl: member.image
      ? urlFor(member.image).width(600).height(800).quality(85).url()
      : "/images/team/placeholder.jpg",
  }));

  return (
    <section className="h-screen pt-[10vh] pb-2 lg:pb-8 md:pt-[12vh] 2xl:py-[calc(0.16rem+6vw)]">
      {/* Background Image */}
      <Image
        src={backgroundImageUrl}
        alt="About background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.8)_100%)] md:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.9)_100%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3871C1_0%,#000000_20%)] opacity-50"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full">
          <div className="flex flex-col md:grid lg:grid-cols-[3fr_2fr] xl:grid-cols-[2fr_1fr] gap-4 lg:gap-24 h-full ">
            <div className="flex flex-col">
              <div className="md:flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="inline-block h-px w-[50px] bg-[#7ED957]">
                    &nbsp;
                  </span>
                  <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
                    about
                  </span>
                </div>
                {/* Page Title */}
                {/* <h1 className="text-[#3871C1] h1 font-bold font-grift">
                  {title}
                </h1> */}
                {/* About Description */}
                {description && (
                  <p className="text-[#E5E5E5] md:mb-5">{description}</p>
                )}
              </div>
              <div className="md:flex-1 flex flex-col md:flex-row gap-4 md:gap-10 relative after:hidden after:md:block after:absolute after:contente-[''] after:bg-white after:w-px after:h-1/2 after:left-1/2 after:-translate-x-1/2 after:top-1/2 after:-translate-y-1/2">
                <div className="md:flex-1 items-start">
                  {/* Vision Title */}
                  <h3 className="text-[#3871C1] text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-right font-grift">
                    {visionTitle}
                  </h3>
                  {/* Vision Description */}
                  {visionDescription && (
                    <p className="text-[#E5E5E5] text-justify">
                      {visionDescription}
                    </p>
                  )}
                </div>
                <div className="md:flex-1 flex flex-col justify-end">
                  {/* Mission Title */}
                  <h3 className="text-[#3871C1] text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-left font-grift">
                    {missionTitle}
                  </h3>
                  {/* Mission Description */}
                  {missionDescription && (
                    <p className="text-[#E5E5E5] text-justify">
                      {missionDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Team members carousel */}
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
              <TeamCarousel members={teamMembersForCarousel} />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
