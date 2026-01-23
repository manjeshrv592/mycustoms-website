import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFirstBlogSlug, getResourcePageLabels } from "@/sanity/queries";
import type { ResourcePageNavItem } from "@/sanity/queries/resourcePages";

interface ResourcesSecondaryNavProps {
  currentPage: string;
  lang: string;
}

/**
 * Helper to get localized label from internationalized array
 */
function getLocalizedLabel(
  item: ResourcePageNavItem | null | undefined,
  lang: string,
  fallback: string
): string {
  const labels = item?.label;
  if (!labels || labels.length === 0) return fallback;

  // Map route lang to Sanity lang keys
  const langMap: Record<string, string> = {
    en: "en",
    nl: "nl",
    de: "de",
    cn: "cn",
  };

  const sanityLang = langMap[lang] || "en";
  const match = labels.find((l) => l._key === sanityLang);

  if (match?.value) return match.value;

  // Fallback to English, then first available
  const enMatch = labels.find((l) => l._key === "en");
  return enMatch?.value || labels[0]?.value || fallback;
}

/**
 * Helper to get slug from page item
 */
function getSlug(
  item: ResourcePageNavItem | null | undefined,
  fallback: string
): string {
  return item?.slug?.current || fallback;
}

/**
 * Secondary navigation for resources pages
 * Shows tabs for Blogs (static) and 3 dynamic pages with labels and slugs from Sanity
 */
export default async function ResourcesSecondaryNav({
  currentPage,
  lang,
}: ResourcesSecondaryNavProps) {
  // Fetch data in parallel
  const [firstBlogSlug, pageLabels] = await Promise.all([
    currentPage !== "blogs" ? getFirstBlogSlug() : Promise.resolve(null),
    getResourcePageLabels(),
  ]);

  // Build navigation items with dynamic labels and slugs
  const NAV_ITEMS = [
    { key: "blogs", label: "Blogs", path: "blogs" },
    {
      key: "eu-vat-compliance",
      label: getLocalizedLabel(
        pageLabels.euVatCompliance,
        lang,
        "EU VAT Compliance"
      ),
      path: getSlug(pageLabels.euVatCompliance, "eu-vat-compliance"),
    },
    {
      key: "guide-to-customs",
      label: getLocalizedLabel(
        pageLabels.guideToCustoms,
        lang,
        "Guide to Customs"
      ),
      path: getSlug(pageLabels.guideToCustoms, "guide-to-customs"),
    },
    {
      key: "fiscal-representation",
      label: getLocalizedLabel(
        pageLabels.fiscalRepresentation,
        lang,
        "Fiscal Representation"
      ),
      path: getSlug(pageLabels.fiscalRepresentation, "fiscal-representation"),
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 lg:gap-12 max-w-[1000px] mx-auto">
      {NAV_ITEMS.map((item) => {
        // Check if current page matches this item's key or path
        const isActive =
          item.key === currentPage || item.path === currentPage;

        // For blogs, link to first blog article if available, otherwise to /blogs
        const href =
          item.key === "blogs" && firstBlogSlug
            ? `/${lang}/resources/blogs/${firstBlogSlug}`
            : `/${lang}/resources/${item.path}`;

        return (
          <Link key={item.key} href={href}>
            {isActive ? (
              <Button className="bg-[#3871C1] cursor-pointer hover:bg-[#2d5a9a] rounded-full h-8 text-xs xl:text-sm w-full">
                {item.label}
              </Button>
            ) : (
              <Button
                variant="outline"
                className=" cursor-pointer rounded-full bg-transparent text-white hover:bg-[#3871C1] hover:border-[#3871C1] hover:text-white h-8 border-white/50 text-xs xl:text-sm w-full"
              >
                {item.label}
              </Button>
            )}
          </Link>
        );
      })}
    </div>
  );
}
