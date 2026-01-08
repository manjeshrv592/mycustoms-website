import Image from "next/image";
import Link from "next/link";
import type { ServiceData } from "@/sanity/types";
import { getLocalizedValue } from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import type { Locale } from "@/i18n";

interface ServicesGridProps {
  services: ServiceData[];
  currentLang: Locale;
  currentSlug?: string;
  className?: string;
}

/**
 * Shared services grid component used across services pages
 * Displays a grid of service cards with images and titles
 */
export default function ServicesGrid({
  services,
  currentLang,
  currentSlug,
  className = "",
}: ServicesGridProps) {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 gap-4 md:grid-rows-2 ${className}`}
    >
      {services.map((item: ServiceData) => {
        const itemTitle = getLocalizedValue(item.title, currentLang);
        const isActive = currentSlug
          ? item.slug.current === currentSlug
          : false;

        return (
          <Link
            key={item._id}
            href={`/${currentLang}/services/${item.slug.current}`}
            className={`border flex flex-col justify-between hover:scale-[1.04] transition-all bg-neutral-900 md:bg-black/20 duration-300 cursor-pointer shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.85)] ${
              isActive ? "border-[#3871C1]/50 border" : "border-none"
            }`}
          >
            <div className="p-1 py-5">
              <h4
                className={`w-[70%] leading-[1.2] text-xs font-semibold ${
                  isActive ? "text-[#38B6FF]" : "text-white"
                }`}
              >
                {itemTitle}
              </h4>
            </div>
            <div className="flex-1 relative">
              {item.image && (
                <Image
                  src={urlFor(item.image).url()}
                  alt={item.image.alt || itemTitle}
                  fill
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
