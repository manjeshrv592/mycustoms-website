"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed z-50 right-5 top-1/2 transform -translate-y-1/2">
      <ul className="flex gap-5 flex-col justify-center items-center">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`p-1 flex items-center justify-center rounded-full hover:bg-white/30 duration-300 ${
                  isActive
                    ? "bg-[#A9081C]/20 shadow-[0_0_0_4px_rgba(169,8,28,.1)]"
                    : "bg-white/0"
                }`}
              >
                <span
                  className={`inline-block size-1.5 rounded-full ${
                    isActive ? "bg-[#A9081C]" : "bg-white"
                  }`}
                >
                  &nbsp;
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
