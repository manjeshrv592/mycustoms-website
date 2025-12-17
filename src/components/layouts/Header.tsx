"use client";

import Image from "next/image";
import { useIsCurrentPath } from "@/hooks/useIsCurrentPath";
import LanguageSelector from "../custom-ui/LanguageSelector";
import Logo from "../custom-ui/Logo";
import PrimaryButton from "../custom-ui/PrimaryButton";

export default function Header() {
  const isHomePage = useIsCurrentPath("/");

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4">
      <Logo />
      <div className="flex items-center gap-4">
        {!isHomePage && (
          <div className="hidden md:flex items-center gap-4">
            <Image
              src="/images/featured-logos/fenex.png"
              alt="Fenex logo"
              width={178}
              height={48}
              className=" w-[96px] h-auto"
            />
            <Image
              src="/images/featured-logos/aeo.png"
              alt="AEO logo"
              width={127}
              height={95}
              className="w-[48px] h-auto"
            />
            <PrimaryButton>Contact Us</PrimaryButton>
          </div>
        )}
        <LanguageSelector />
      </div>
    </header>
  );
}
