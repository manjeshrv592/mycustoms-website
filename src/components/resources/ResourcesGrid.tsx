import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { Locale } from "@/i18n";
import type { ResourcesGridData } from "@/sanity/queries/resources";

interface ResourcesGridProps {
  gridData: ResourcesGridData;
  currentLang: Locale;
  className?: string;
}

// Static resource pages config
const STATIC_RESOURCES = [
  { key: "eu-vat-compliance", label: "EU VAT Compliance" },
  { key: "guide-to-customs", label: "Guide to Customs" },
  { key: "fiscal-representation", label: "Fiscal Representation" },
] as const;

/**
 * Resources grid component for mobile view
 * Displays a 2x2 grid of resource cards with images
 */
export default function ResourcesGrid({
  gridData,
  currentLang,
  className = "",
}: ResourcesGridProps) {
  // Build grid items array
  const gridItems = [
    {
      key: "blogs",
      label: "Blogs",
      href: gridData.firstBlogSlug
        ? `/${currentLang}/resources/blogs/${gridData.firstBlogSlug}`
        : `/${currentLang}/resources/blogs`,
      image: gridData.firstBlogImage,
    },
    {
      key: "eu-vat-compliance",
      label: "EU VAT Compliance",
      href: `/${currentLang}/resources/eu-vat-compliance`,
      image: gridData.euVatImage,
    },
    {
      key: "guide-to-customs",
      label: "Guide to Customs",
      href: `/${currentLang}/resources/guide-to-customs`,
      image: gridData.guideToCustomsImage,
    },
    {
      key: "fiscal-representation",
      label: "Fiscal Representation",
      href: `/${currentLang}/resources/fiscal-representation`,
      image: gridData.fiscalRepImage,
    },
  ];

  return (
    <div className={`grid grid-cols-2 gap-4 auto-rows-[150px]  ${className}`}>
      {gridItems.map((item) => {
        const imageUrl = item.image ? urlFor(item.image).url() : null;

        return (
          <Link
            key={item.key}
            href={item.href}
            className="border flex flex-col justify-between hover:scale-[1.04] transition-all bg-neutral-900 duration-300 cursor-pointer shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.85)] border-none"
          >
            <div className="p-3 py-5">
              <h4 className="w-[70%] leading-[1.2] text-xs font-semibold text-white">
                {item.label}
              </h4>
            </div>
            <div className="flex-1 relative">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={item.image?.alt || item.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
