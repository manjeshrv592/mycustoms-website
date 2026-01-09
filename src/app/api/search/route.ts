import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

/**
 * Search blogs by query string
 * Searches in title and summary fields
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const lang = searchParams.get("lang") || "en";
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // GROQ query to search blogs by title and summary
    const searchQuery = `*[_type == "blog" && isActive == true && (
      title[_key == $lang].value match $searchTerm ||
      title[_key == "en"].value match $searchTerm ||
      summary[_key == $lang].value match $searchTerm ||
      summary[_key == "en"].value match $searchTerm
    )] | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      slug,
      summary
    }`;

    const results = await client.fetch(searchQuery, {
      searchTerm: `*${query}*`,
      lang,
      limit,
    });

    // Transform results for the frontend
    const transformedResults = results.map(
      (blog: {
        _id: string;
        title?: Array<{ _key: string; value: string }>;
        slug: { current: string };
        summary?: Array<{ _key: string; value: string }>;
      }) => {
        const title =
          blog.title?.find((t) => t._key === lang)?.value ||
          blog.title?.find((t) => t._key === "en")?.value ||
          "Untitled";
        const summary =
          blog.summary?.find((s) => s._key === lang)?.value ||
          blog.summary?.find((s) => s._key === "en")?.value ||
          "";

        return {
          id: blog._id,
          title,
          summary:
            summary.length > 80 ? `${summary.substring(0, 80)}...` : summary,
          slug: blog.slug.current,
        };
      }
    );

    return NextResponse.json({ results: transformedResults });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
