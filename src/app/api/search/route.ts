import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

/**
 * Search articles by query string
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
    // GROQ query to search articles by title
    const searchQuery = `*[_type == "article" && (
      title[_key == $lang].value match $searchTerm ||
      title[_key == "en"].value match $searchTerm ||
      summary[_key == $lang].value match $searchTerm ||
      summary[_key == "en"].value match $searchTerm
    )] | order(publishedAt desc)[0...$limit] {
      _id,
      title,
      slug,
      summary,
      "categorySlug": category->slug.current,
      "categoryTitle": category->title
    }`;

    const results = await client.fetch(searchQuery, {
      searchTerm: `*${query}*`,
      lang,
      limit,
    });

    // Transform results for the frontend
    const transformedResults = results.map(
      (article: {
        _id: string;
        title?: Array<{ _key: string; value: string }>;
        slug: { current: string };
        summary?: Array<{ _key: string; value: string }>;
        categorySlug: string;
        categoryTitle?: Array<{ _key: string; value: string }>;
      }) => {
        const title =
          article.title?.find((t) => t._key === lang)?.value ||
          article.title?.find((t) => t._key === "en")?.value ||
          "Untitled";
        const summary =
          article.summary?.find((s) => s._key === lang)?.value ||
          article.summary?.find((s) => s._key === "en")?.value ||
          "";
        const categoryTitle =
          article.categoryTitle?.find((c) => c._key === lang)?.value ||
          article.categoryTitle?.find((c) => c._key === "en")?.value ||
          "";

        return {
          id: article._id,
          title,
          summary:
            summary.length > 80 ? `${summary.substring(0, 80)}...` : summary,
          slug: article.slug.current,
          categorySlug: article.categorySlug,
          categoryTitle,
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
