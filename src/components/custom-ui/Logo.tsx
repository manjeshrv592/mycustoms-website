import Image from "next/image"

export default function Logo() {
  return (
   <Image className="w-[100px] h-auto fixed z-50 top-1 left-2" src="/images/mycustoms-logo.svg" alt="Logo" width={100} height={100} />
  );
}
