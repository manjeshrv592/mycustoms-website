"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { locales, localeInfo, defaultLocale, type Locale } from "@/i18n";

/**
 * Language selector component that navigates to locale-prefixed URLs
 * This preserves SSG by using URL-based language switching
 */
export default function LanguageSelector() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract current locale from URL path
  const getCurrentLocale = (): Locale => {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    if (firstSegment && locales.includes(firstSegment as Locale)) {
      return firstSegment as Locale;
    }
    return defaultLocale;
  };

  const currentLocale = getCurrentLocale();
  const currentLangInfo = localeInfo[currentLocale];

  /**
   * Handle language change by navigating to the new locale URL
   */
  const handleLanguageChange = (newLocale: string) => {
    if (!locales.includes(newLocale as Locale)) return;

    // Get the path after the current locale
    const segments = pathname.split("/").filter(Boolean);
    const currentLocaleInPath = locales.includes(segments[0] as Locale);

    // Remove current locale from path if present
    const pathWithoutLocale = currentLocaleInPath
      ? "/" + segments.slice(1).join("/")
      : pathname;

    // Navigate to new locale path
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <Select value={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="md:bg-black/25 rounded-full p-1 4xl:p-[0.3vw] data-[size=default]:h-auto [&_svg]:text-white! [&_svg]:opacity-100! cursor-pointer border border-white/20 w-[84px] 4xl:w-[5.5vw]">
        <SelectValue>
          <div className="flex items-center gap-2 4xl:gap-[0.5vw] text-white">
            <span className="inline-block size-5 4xl:size-[1.25vw] rounded-full overflow-hidden">
              <Image
                src={currentLangInfo.flag}
                alt={currentLangInfo.alt}
                width={20}
                height={20}
                className="w-5 h-5 4xl:w-full 4xl:h-full object-cover"
              />
            </span>
            <span className="4xl:text-[0.9vw]">{currentLangInfo.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        align="end"
        className="bg-black/80 md:bg-black/25 text-white min-w-32 4xl:min-w-[8vw] border-white/20 border"
      >
        <SelectGroup>
          <SelectLabel className="text-white uppercase tracking-[1px] 4xl:text-[0.8vw]">
            Language
          </SelectLabel>
          {locales.map((locale) => {
            const info = localeInfo[locale];
            return (
              <SelectItem
                key={locale}
                value={locale}
                className="[&_svg]:text-white! [&_svg]:opacity-100! [&_svg]:duration-300 duration-300 transition-all cursor-pointer rounded-full p-1 mb-2 last:mb-0 hover:[&_svg]:text-black! data-highlighted:[&_svg]:text-black! 4xl:p-[0.3vw] 4xl:mb-[0.5vw]"
              >
                <div className="flex items-center gap-2 4xl:gap-[0.5vw]">
                  <span className="inline-block size-5 4xl:size-[1.25vw] rounded-full overflow-hidden">
                    <Image
                      src={info.flag}
                      alt={info.alt}
                      width={20}
                      height={20}
                      className="w-5 h-5 4xl:w-full 4xl:h-full object-cover"
                    />
                  </span>
                  <span className="4xl:text-[0.9vw]">{info.fullLabel}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
