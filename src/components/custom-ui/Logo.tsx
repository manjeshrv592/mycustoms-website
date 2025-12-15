import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="fixed z-50 top-1 left-2">
      <Image
        className="w-[80px] h-auto"
        src="/images/mycustoms-logo-new.svg"
        alt="Logo"
        width={100}
        height={100}
      />
    </Link>
  );
}
