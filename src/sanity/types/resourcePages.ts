import type {
  LocalizedString,
  LocalizedBlockContent,
  SanityImageField,
} from "./common";

/**
 * Base interface for resource pages (EU VAT, Guide to Customs, Fiscal Representation)
 */
interface ResourcePageBase {
  _id: string;
  label?: LocalizedString[];
  title: LocalizedString[];
  content?: LocalizedBlockContent[];
  sidePanelImage?: SanityImageField;
}

export interface EuVatCompliancePageData extends ResourcePageBase {
  _type: "euVatCompliancePage";
}

export interface GuideToCustomsPageData extends ResourcePageBase {
  _type: "guideToCustomsPage";
}

export interface FiscalRepresentationPageData extends ResourcePageBase {
  _type: "fiscalRepresentationPage";
}
