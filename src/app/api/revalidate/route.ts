import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Webhook secret from environment variable
const secret = process.env.SANITY_WEBHOOK_SECRET;

/**
 * Map of Sanity document types to their cache tags
 * Add new document types here as you create more queries
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

    // Get the tags to revalidate for this document type
    const tagsToRevalidate = documentTagMap[_type] || [];

    if (tagsToRevalidate.length === 0) {
      // If no specific tags, revalidate all content
      console.log(
        `No specific tags for type "${_type}", skipping revalidation`
      );
      return NextResponse.json({
        success: true,
        message: `No tags configured for type "${_type}"`,
        revalidated: false,
      });
    }

    // Revalidate all relevant tags
    for (const tag of tagsToRevalidate) {
      revalidateTag(tag);
      console.log(`Revalidated tag: ${tag}`);
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated tags: ${tagsToRevalidate.join(", ")}`,
      revalidated: true,
      documentId: _id,
      documentType: _type,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, message: "Error processing webhook" },
      { status: 500 }
    );
  }
}
