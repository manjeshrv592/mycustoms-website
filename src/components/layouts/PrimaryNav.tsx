"use client";

import { usePathname } from "next/navigation";
import { locales, defaultLocale, type Locale } from "@/i18n";
import TransitionLink from "@/components/TransitionLink";

interface NavLink {
  href: string;
  label: string;
  isDynamic?: boolean;
}

interface PrimaryNavProps {
  firstServiceSlug?: string | null;
  firstBlogSlug?: string | null;
}

const getNavLinks = (
  firstServiceSlug?: string | null,
  firstBlogSlug?: string | null
): NavLink[] => [
    { href: "/", label: "Home" },
    {
      href: firstServiceSlug ? `/services/${firstServiceSlug}` : "/services",
      label: "Services",
    },
    { href: "/portal", label: "Portal" },
    {
      href: firstBlogSlug ? `/resources/blogs/${firstBlogSlug}` : "/resources",
      label: "Resources",
    },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

export default function PrimaryNav({
  firstServiceSlug,
  firstBlogSlug,
}: PrimaryNavProps): React.ReactElement {
  const pathname = usePathname();
  const navLinks = getNavLinks(firstServiceSlug, firstBlogSlug);

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

  // Get the path without locale prefix for comparison
  const pathWithoutLocale = pathname
    .split("/")
    .filter(Boolean)
    .slice(locales.includes(pathname.split("/")[1] as Locale) ? 1 : 0)
    .join("/");

  return (
    <nav
      className="fixed z-50 right-5 top-1/2 transform -translate-y-1/2 hidden md:block"
    >
      <ul className="flex gap-5 flex-col justify-center items-center">
        {navLinks.map((link) => {
          // Prepend locale to href
          const localizedHref =
            link.href === "/"
              ? `/${currentLocale}`
              : `/${currentLocale}${link.href}`;

          // Check if current path matches this link
          let basePath = link.href;
          if (link.href.startsWith("/services")) {
            basePath = "/services";
          } else if (link.href.startsWith("/resources")) {
            basePath = "/resources";
          }

          const linkPath = basePath === "/" ? "" : basePath.slice(1);
          const isActive =
            basePath === "/"
              ? pathWithoutLocale === "" || pathWithoutLocale === currentLocale
              : pathWithoutLocale.startsWith(linkPath);

          return (
            <li key={link.label}>
              <TransitionLink
                href={localizedHref}
                className={`p-1 flex items-center justify-center rounded-full duration-300 ${isActive
                  ? "bg-[#3871C1]/50 shadow-[0_0_0_4px_rgba(56,113,193,.3)]"
                  : "bg-transparent hover:bg-white/30"
                  }`}
              >
                <span
                  className={`inline-block size-1.5 rounded-full ${isActive ? "bg-[#3871C1]" : "bg-white"
                    }`}
                >
                  &nbsp;
                </span>
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
