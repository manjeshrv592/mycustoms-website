import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFirstBlogSlug } from "@/sanity/queries";

interface ResourcesSecondaryNavProps {
  currentPage:
    | "blogs"
    | "eu-vat-compliance"
    | "guide-to-customs"
    | "fiscal-representation";
  lang: string;
}

// Static navigation links
const NAV_ITEMS = [
  { key: "blogs", label: "Blogs", path: "blogs" },
  {
    key: "eu-vat-compliance",
    label: "EU VAT Compliance",
    path: "eu-vat-compliance",
  },
  {
    key: "guide-to-customs",
    label: "Guide to Customs",
    path: "guide-to-customs",
  },
  {
    key: "fiscal-representation",
    label: "Fiscal Representation",
    path: "fiscal-representation",
  },
] as const;

/**
 * Secondary navigation for resources pages
 * Shows tabs for Blogs (dynamic) and 3 static pages
 */
export default async function ResourcesSecondaryNav({
  currentPage,
  lang,
}: ResourcesSecondaryNavProps) {
  // For blogs, get first blog slug to link directly to it
  const firstBlogSlug =
    currentPage !== "blogs" ? await getFirstBlogSlug() : null;

  return (
    <div className="flex justify-center order-1 md:order-0">
      <div className="rounded-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8 p-1">
        {NAV_ITEMS.map((item) => {
          const isActive = item.key === currentPage;

          // For blogs, link to first blog article if available, otherwise to /blogs
          const href =
            item.key === "blogs" && firstBlogSlug
              ? `/${lang}/resources/blogs/${firstBlogSlug}`
              : `/${lang}/resources/${item.path}`;

          return (
            <Link key={item.key} href={href}>
              {isActive ? (
                <Button className="bg-[#3871C1] cursor-pointer hover:bg-[#2d5a9a] rounded-full w-[180px] h-8 text-xs md:text-sm">
                  {item.label}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className=" cursor-pointer rounded-full w-[180px] bg-transparent text-white hover:bg-[#3871C1] hover:border-[#3871C1] hover:text-white h-8 border-white/50"
                >
                  {item.label}
                </Button>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
