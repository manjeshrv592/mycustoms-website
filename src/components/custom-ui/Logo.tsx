import Image from "next/image";
import Link from "next/link";
import { useIsCurrentPath } from "@/hooks/useIsCurrentPath";

export default function Logo() {
  const isHomePage = useIsCurrentPath("/");

  return (
    <Link href="/">
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
