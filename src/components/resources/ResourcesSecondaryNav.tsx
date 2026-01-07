import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ResourceCategoryData } from "@/sanity/types";
import { getFirstArticleSlugByCategory } from "@/sanity/queries";

interface ResourcesSecondaryNavProps {
  categories: ResourceCategoryData[];
  currentCategorySlug: string;
  lang: string;
}

/**
 * Secondary navigation for resources page
 * Shows category tabs that link to first article in each category
 */
export default async function ResourcesSecondaryNav({
  categories,
  currentCategorySlug,
  lang,
}: ResourcesSecondaryNavProps) {
  // Fetch first article slug for each category
  const categoryLinks = await Promise.all(
    categories.map(async (category) => {
      const firstArticleSlug = await getFirstArticleSlugByCategory(
        category.slug.current
      );
      return {
        category,
        firstArticleSlug,
      };
    })
  );

  // Get localized category title
  const getCategoryTitle = (category: ResourceCategoryData): string => {
    const localizedTitle = category.title?.find((t) => t._key === lang);
    return localizedTitle?.value || category.key || "Untitled";
  };

  return (
    <div className="flex justify-center order-1 md:order-0">
      <div className="md:border-white/50 md:border rounded-full grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-8 p-1">
        {categoryLinks.map(({ category, firstArticleSlug }) => {
          const isActive = category.slug.current === currentCategorySlug;
          const categoryTitle = getCategoryTitle(category);

          // Link directly to first article if available, otherwise to category
          const href = firstArticleSlug
            ? `/${lang}/resources/${category.slug.current}/${firstArticleSlug}`
            : `/${lang}/resources/${category.slug.current}`;

          return (
            <Link key={category._id} href={href}>
              {isActive ? (
                <Button className="bg-[#3871C1] cursor-pointer hover:bg-[#2d5a9a] rounded-full w-[180px] h-8 text-xs md:text-sm">
                  {categoryTitle}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className=" cursor-pointer rounded-full w-[180px] bg-transparent text-white hover:bg-[#3871C1] hover:border-[#3871C1] hover:text-white h-8 border-white/50"
                >
                  {categoryTitle}
                </Button>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
