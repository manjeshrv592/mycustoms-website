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

// ============================================
// RESOURCE PAGE NAV LABELS
// ============================================

export interface ResourcePageNavItem {
  label: Array<{ _key: string; value: string }> | null;
  slug: { current: string } | null;
}

export interface ResourcePageLabels {
  euVatCompliance: ResourcePageNavItem | null;
  guideToCustoms: ResourcePageNavItem | null;
  fiscalRepresentation: ResourcePageNavItem | null;
}

export const RESOURCE_PAGE_LABELS_QUERY = `
  {
    "euVatCompliance": *[_type == "euVatCompliancePage"][0] { label, slug },
    "guideToCustoms": *[_type == "guideToCustomsPage"][0] { label, slug },
    "fiscalRepresentation": *[_type == "fiscalRepresentationPage"][0] { label, slug }
  }
`;

export async function getResourcePageLabels(): Promise<ResourcePageLabels> {
  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<ResourcePageLabels>(
    RESOURCE_PAGE_LABELS_QUERY,
    {},
    {
      next: isDev
        ? { revalidate: 0 }
        : {
          revalidate: 60,
          tags: [
            "euVatCompliancePage",
            "guideToCustomsPage",
            "fiscalRepresentationPage",
          ],
        },
    }
  );
}

// ============================================
// DYNAMIC RESOURCE PAGE QUERIES
// ============================================

export interface ResourcePageData {
  _id: string;
  _type: "euVatCompliancePage" | "guideToCustomsPage" | "fiscalRepresentationPage";
  label: Array<{ _key: string; value: string }> | null;
  slug: { current: string } | null;
  title: Array<{ _key: string; value: string }> | null;
  content: Array<{ _key: string; value: any[] }> | null;
  sidePanelImage: any | null;
}

export const RESOURCE_PAGE_BY_SLUG_QUERY = `
  *[
    _type in ["euVatCompliancePage", "guideToCustomsPage", "fiscalRepresentationPage"] &&
    slug.current == $slug
  ][0] {
    _id,
    _type,
    label,
    slug,
    title,
    content,
    sidePanelImage
  }
`;

export async function getResourcePageBySlug(slug: string): Promise<ResourcePageData | null> {
  const isDev = process.env.NODE_ENV === "development";

  return client.fetch<ResourcePageData | null>(
    RESOURCE_PAGE_BY_SLUG_QUERY,
    { slug },
    {
      next: isDev
        ? { revalidate: 0 }
        : {
          revalidate: 60,
          tags: [
            "euVatCompliancePage",
            "guideToCustomsPage",
            "fiscalRepresentationPage",
          ],
        },
    }
  );
}

export interface ResourcePageSlug {
  slug: string;
}

export const ALL_RESOURCE_PAGE_SLUGS_QUERY = `
  *[
    _type in ["euVatCompliancePage", "guideToCustomsPage", "fiscalRepresentationPage"] &&
    defined(slug.current)
  ] {
    "slug": slug.current
  }
`;

export async function getAllResourcePageSlugs(): Promise<ResourcePageSlug[]> {
  return client.fetch<ResourcePageSlug[]>(
    ALL_RESOURCE_PAGE_SLUGS_QUERY,
    {},
    { next: { revalidate: 60 } }
  );
}



