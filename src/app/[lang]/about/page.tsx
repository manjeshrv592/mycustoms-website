import Container from "@/components/layouts/Container";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAboutPage, getAllTeamMembers } from "@/sanity/queries";
import { getLocalizedValue } from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { locales, isValidLocale, type Locale } from "@/i18n";
import AboutContent from "@/components/about/AboutContent";

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
    <section className="h-screen pt-[10vh] pb-2 lg:pb-8 md:pt-[12vh] 2xl:py-[calc(0.16rem+6vw)] relative">
      {/* Background Image */}
      <Image
        src={backgroundImageUrl}
        alt="About background"
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.8)_100%)] md:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.9)_100%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3871C1_0%,#000000_20%)] opacity-50"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full">
          <AboutContent
            description={description}
            visionTitle={visionTitle}
            visionDescription={visionDescription}
            missionTitle={missionTitle}
            missionDescription={missionDescription}
            members={teamMembersForCarousel}
          />
        </Container>
      </div>
    </section>
  );
}
