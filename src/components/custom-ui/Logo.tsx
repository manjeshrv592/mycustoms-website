"use client";

import Image from "next/image";
import TransitionLink from "@/components/animation/TransitionLink";
import { useIsCurrentPath, useCurrentLocale } from "@/hooks/useIsCurrentPath";

export default function Logo() {
  const isHomePage = useIsCurrentPath("/");
  const currentLocale = useCurrentLocale();

  return (
    <TransitionLink href={`/${currentLocale}`}>
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
    </TransitionLink>
  );
}
