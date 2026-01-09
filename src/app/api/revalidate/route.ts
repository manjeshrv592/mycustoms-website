import { revalidateTag, revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { locales } from "@/i18n";

// Webhook secret from environment variable
const secret = process.env.SANITY_WEBHOOK_SECRET;

/**
 * Map of Sanity document types to their cache tags
 */
const documentTagMap: Record<string, string[]> = {
  homePage: ["homePage"],
  aboutPage: ["aboutPage"],
  portalPage: ["portalPage"],
  contactPage: ["contactPage"],
  servicesPage: ["servicesPage"],
  resourcesPage: ["resourcesPage"],
  service: ["services", "service"],
  teamMember: ["teamMembers", "teamMember"],
  resourceCategory: ["resourceCategories"],
  article: ["articles", "article"],
  blog: ["blog"],
  euVatCompliancePage: ["euVatCompliancePage"],
  guideToCustomsPage: ["guideToCustomsPage"],
  fiscalRepresentationPage: ["fiscalRepresentationPage"],
};

/**
 * Map of Sanity document types to their page paths
 * These are paths relative to the locale (e.g., "/" for home, "/about" for about)
 */
const documentPathMap: Record<string, string[]> = {
  homePage: ["/"],
  aboutPage: ["/about"],
  portalPage: ["/portal"],
  contactPage: ["/contact"],
  servicesPage: ["/services"],
  resourcesPage: ["/resources"],
  service: ["/services"],
  teamMember: ["/about"],
  article: ["/resources"],
  blog: ["/resources"],
  euVatCompliancePage: ["/resources/eu-vat-compliance"],
  guideToCustomsPage: ["/resources/guide-to-customs"],
  fiscalRepresentationPage: ["/resources/fiscal-representation"],
};

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const { isValidSignature, body } = await parseBody<{
      _type: string;
      _id: string;
      slug?: { current: string };
    }>(req, secret);

    if (!isValidSignature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 401 }
      );
    }

    if (!body) {
      return NextResponse.json(
        { success: false, message: "No body provided" },
        { status: 400 }
      );
    }

    const { _type, _id } = body;
    const revalidatedTags: string[] = [];
    const revalidatedPaths: string[] = [];

    // Revalidate cache tags
    const tagsToRevalidate = documentTagMap[_type] || [];
    for (const tag of tagsToRevalidate) {
      revalidateTag(tag, { expire: 0 });
      revalidatedTags.push(tag);
      console.log(`Revalidated tag: ${tag}`);
    }

    // Revalidate page paths for all locales (instant update)
    const pathsToRevalidate = documentPathMap[_type] || [];
    for (const path of pathsToRevalidate) {
      for (const locale of locales) {
        const fullPath = path === "/" ? `/${locale}` : `/${locale}${path}`;
        revalidatePath(fullPath);
        revalidatedPaths.push(fullPath);
        console.log(`Revalidated path: ${fullPath}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated ${revalidatedTags.length} tags and ${revalidatedPaths.length} paths`,
      revalidated: true,
      documentId: _id,
      documentType: _type,
      tags: revalidatedTags,
      paths: revalidatedPaths,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
