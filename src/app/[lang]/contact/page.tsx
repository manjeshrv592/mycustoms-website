import Container from "@/components/layouts/Container";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContactPage } from "@/sanity/queries";
import { getLocalizedValue } from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { locales, isValidLocale, type Locale } from "@/i18n";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfoSection from "@/components/contact/ContactInfoSection";
import { ContactFormProvider } from "@/context/ContactFormContext";
import { FaLinkedinIn } from "react-icons/fa6";

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function Contact({ params }: ContactPageProps) {
  const { lang } = await params;

  // Validate locale
  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  // Fetch contact page data
  const contactData = await getContactPage();

  if (!contactData) {
    notFound();
  }

  // Get localized values
  const title =
    getLocalizedValue(contactData.title, currentLang) || "Contact us";
  const description =
    getLocalizedValue(contactData.description, currentLang) || "";

  // Get background image URL
  const backgroundImageUrl = contactData.backgroundImage
    ? urlFor(contactData.backgroundImage).width(1920).quality(85).url()
    : "/images/contact-bg.jpg";

  // Get contact section image URL
  const contactImageUrl = contactData.contactImage
    ? urlFor(contactData.contactImage).width(800).quality(85).url()
    : "/images/contact-us.jpg";

  // Get contact info
  const address = contactData.address || "";
  const phone = contactData.phone || "";
  const email = contactData.email || "";

  return (
    <section className="h-screen pt-[10vh] pb-2 lg:pb-11 md:pt-[12vh] relative">
      <a
        target="_blank"
        href="https://linkedin.com"
        className="absolute text-white z-30 hidden md:flex flex-col items-center gap-2 opacity-50 left-5 bottom-5"
      >
        <FaLinkedinIn />
        <span className="h-[64px] w-px bg-white inline-block ">&nbsp;</span>
      </a>
      {/* Background image */}
      <Image
        src={backgroundImageUrl}
        alt="Contact background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.1)_0%,rgba(0,0,0,0)_100%)] md:bg-[linear-gradient(to_bottom,rgba(0,0,0,.8)_0%,rgba(0,0,0,0)_100%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3871C1_0%,#000000_20%)] opacity-50"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full text-white flex flex-col gap-2 lg:px-30">
          <div className="w-full md:max-w-[60%]">
            {/* Page Title */}

            <h1 className="text-2xl md:text-3xl xl:text-4xl text-white font-grift font-bold mb-2">
              {title}
            </h1>
            {/* Description */}
            {description && <p className="text-xs">{description}</p>}
          </div>
          <ContactFormProvider>
            <div className="md:grid md:grid-cols-2 flex-1 md:gap-12">
              {/* Contact Form Component */}
              <ContactForm />

              <ContactInfoSection
                contactImageUrl={contactImageUrl}
                address={address}
                phone={phone}
                email={email}
              />
            </div>
          </ContactFormProvider>
        </Container>
      </div>
    </section>
  );
}
