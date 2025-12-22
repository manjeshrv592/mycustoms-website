"use client";

import Image from "next/image";
import Link from "next/link";
import { useIsCurrentPath, useCurrentLocale } from "@/hooks/useIsCurrentPath";

export default function Logo() {
  const isHomePage = useIsCurrentPath("/");
  const currentLocale = useCurrentLocale();

  return (
    <Link href={`/${currentLocale}`}>
      <Image
        className="w-[80px] h-auto"
        src={
          isHomePage
            ? "/images/mycustoms-logo-new.svg"
            : "/images/mycustoms-logo.svg"
        }
        alt="Logo"
        width={100}
        height={100}
      />
    </Link>
  );
}
