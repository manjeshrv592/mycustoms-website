import { client } from "../lib/client";
import type {
  EuVatCompliancePageData,
  GuideToCustomsPageData,
  FiscalRepresentationPageData,
} from "../types/resourcePages";

// ============================================
// EU VAT COMPLIANCE PAGE
// ============================================

export const EU_VAT_COMPLIANCE_PAGE_QUERY = `
  *[_type == "euVatCompliancePage"][0] {
    _id,
    _type,
    label,
    title,
    content,
    sidePanelImage
  }
`;

export async function getEuVatCompliancePage(): Promise<EuVatCompliancePageData | null> {
  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<EuVatCompliancePageData | null>(
    EU_VAT_COMPLIANCE_PAGE_QUERY,
    {},
    {
      next: isDev
        ? { revalidate: 0 }
        : { revalidate: 60, tags: ["euVatCompliancePage"] },
    }
  );
}

// ============================================
// GUIDE TO CUSTOMS PAGE
// ============================================

export const GUIDE_TO_CUSTOMS_PAGE_QUERY = `
  *[_type == "guideToCustomsPage"][0] {
    _id,
    _type,
    label,
    title,
    content,
    sidePanelImage
  }
`;

export async function getGuideToCustomsPage(): Promise<GuideToCustomsPageData | null> {
  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<GuideToCustomsPageData | null>(
    GUIDE_TO_CUSTOMS_PAGE_QUERY,
    {},
    {
      next: isDev
        ? { revalidate: 0 }
        : { revalidate: 60, tags: ["guideToCustomsPage"] },
    }
  );
}

// ============================================
// FISCAL REPRESENTATION PAGE
// ============================================

export const FISCAL_REPRESENTATION_PAGE_QUERY = `
  *[_type == "fiscalRepresentationPage"][0] {
    _id,
    _type,
    label,
    title,
    content,
    sidePanelImage
  }
`;

export async function getFiscalRepresentationPage(): Promise<FiscalRepresentationPageData | null> {
  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<FiscalRepresentationPageData | null>(
    FISCAL_REPRESENTATION_PAGE_QUERY,
    {},
    {
      next: isDev
        ? { revalidate: 0 }
        : { revalidate: 60, tags: ["fiscalRepresentationPage"] },
    }
  );
}
