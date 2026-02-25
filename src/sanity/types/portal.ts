import type {
  LocalizedString,
  LocalizedBlockContent,
  SanityImageField,
  CtaButton,
} from "./common";

/**
 * Portal page singleton data structure
 */
export interface PortalPageData {
  _id: string;
  _type: "portalPage";
  isActive?: boolean;
  backgroundImage: SanityImageField;
  label?: LocalizedString[];
  title: LocalizedString[];
  content?: LocalizedBlockContent[];
  sidePanelImage?: SanityImageField;
  sidePanelTitle?: LocalizedString[];
  sidePanelDescription?: LocalizedString[];
  ctaButton?: CtaButton;
}
