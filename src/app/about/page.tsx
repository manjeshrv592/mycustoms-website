import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function About() {
  return (
    <section className=" h-screen text-black py-[12vh]">
      <Image
        src="/images/about-us-bg.jpg"
        alt="Services background"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.9)_100%)]"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full">
          <div className="grid grid-cols-[2fr_1fr] gap-4  h-full">
            <div className=" flex flex-col">
              <div className=" flex-1 pl-20">
                <h1 className="text-white text-5xl font-semibold mb-5">
                  About us
                </h1>
                <p className="text-[#E5E5E5] text-sm">
                  My Customs B.V. is a trusted customs broker focused on making
                  trade compliance effortless through digital solutions,
                  expert-driven processes, and consistent, high-quality customer
                  service.
                </p>
              </div>
              <div className="flex-1 flex gap-10 relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:h-[45%] after:w-px after:bg-white rounded-full after:top-1/2 after:-translate-y-1/6">
                <div className="flex-1 items-start">
                  <h3 className="text-[#A9081C] text-3xl font-semibold tracking-tight text-right font-orbitron">
                    Vision
                  </h3>
                  <p className="text-[#E5E5E5] text-sm text-justify">
                    Our vision is to lead the digital transformation of EU
                    customs by driving innovation, automation, and data-driven
                    efficiency across the entire customs ecosystem. We aspire to
                    set the standard for modern, technology-powered customs
                    services, empowering global trade through smarter, more
                    connected, and future-ready solutions
                  </p>
                </div>
                <div className="flex-1 flex flex-col justify-end">
                  <h3 className="text-[#A9081C] text-3xl font-semibold tracking-tight text-left font-orbitron">
                    Misson
                  </h3>
                  <p className="text-[#E5E5E5] text-sm text-justify">
                    Our mission is to simplify global trade by making customs
                    processes seamless, transparent, and effortless for
                    businesses of all sizes. We aim to remove the complexity
                    traditionally associated with cross-border logistics by
                    delivering efficient, accurate, and compliant customs
                    solutions that enable faster movement of goods and smoother
                    international operations.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className=" w-full h-full flex flex-1 gap-2">
                <div>
                  <h3 className="text-4xl writing-mode-vertical-lr font-semibold font-orbitron rotate-180 [writing-mode:vertical-rl]">
                    <span className="text-[#716B6D]">General </span>
                    <span className=" text-[#A9081C]">Mananger</span>
                  </h3>
                </div>
                <div className=" flex-1">
                  <div className="size-full relative flex items-end ">
                    <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.9)_100%)]"></div>
                    <Image
                      src="/images/team/Robert-van-den-tol.jpg"
                      fill
                      alt="General Manager"
                      className="absolute object-cover"
                    />
                    <div className="z-100 w-full p-4">
                      <div>
                        <h2 className="text-5xl text-[#A9081C] font-orbitron font-bold tracking-tight pb-2">
                          Robert
                        </h2>
                      </div>
                      <div className="text-right">
                        <h3 className="text-3xl text-[#E5E5E5] font-orbitron font-semibold">
                          van den Tol
                        </h3>
                        <p className="text-[#E5E5E5] ">
                          Ill ensure My Customs B.V. delivers efficient,
                          compliant, and technology-driven customs solutions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-full flex gap-2 items-center justify-center">
                <Button
                  size="icon"
                  className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#A9081C] hover:text-white cursor-pointer"
                >
                  <ArrowLeft />
                </Button>
                <Button
                  size="icon"
                  className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#A9081C] hover:text-white cursor-pointer"
                >
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
