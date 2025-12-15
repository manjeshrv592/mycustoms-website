import PrimaryButton from "@/components/custom-ui/PrimaryButton";
import Image from "next/image";

export default function Home() {
  return (
    <section className="min-h-screen bg-neutral-200 flex justify-center relative pt-[20vh]">
      <Image
        src="/images/hero-bg-new.png"
        alt="Hero background"
        fill
        className="object-cover object-top-right"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0)_50%,rgba(0,0,0,0.4)_100%)]"></div>
      <div className="text-center relative z-20">
        <h1 className="text-7xl font-orbitron uppercase mb-2">
          <span className="text-[#111A21]">More Than</span>{" "}
          <span className="text-[#A9081C]">Customs</span>
        </h1>
        <p className="text-lg uppercase text-white">
          Your trusted customs partner — fast, compliant, and seamlessly
          digital.
        </p>
        <div className="flex gap-4 items-center justify-center py-4">
          <Image
            src="/images/featured-logos/fenex.png"
            alt="Fenex logo"
            width={178}
            height={48}
            className="w-[158px] h-auto"
          />
          <Image
            src="/images/featured-logos/aeo.png"
            alt="AEO logo"
            width={127}
            height={95}
            className="w-[100px] h-auto"
          />
        </div>
        <PrimaryButton>Schedule a Call</PrimaryButton>
      </div>
    </section>
  );
}
