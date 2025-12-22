import type {
  LocalizedString,
  SanityImageField,
  FeaturedLogo,
  CtaButton,
} from "./common";

/**
 * Home page document data structure returned from Sanity query
 */
export interface HomePageData {
  _id: string;
  _type: "homePage";
  backgroundImage: SanityImageField;
  mainTitleLine1: LocalizedString[];
  mainTitleLine2: LocalizedString[];
  description: LocalizedString[];
  featuredLogos?: FeaturedLogo[];
  ctaButton?: CtaButton;
}
