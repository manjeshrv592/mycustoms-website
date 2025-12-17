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
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.8)_100%)] md:bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.9)_100%)]"></div>
      <div className="relative z-20 h-full">
        <Container className="h-full">
          <div className="flex flex-col md:grid md:grid-cols-[2fr_1fr] gap-4 h-full ">
            <div className="flex flex-col">
              <div className="md:flex-1 md:pl-20 ">
                <h1 className="text-white text-2xl md:text-5xl font-semibold md:mb-5">
                  About us
                </h1>
                <p className="text-[#E5E5E5] text-xs md:text-sm md:mb-5">
                  My Customs B.V. is a trusted customs broker focused on making
                  trade compliance effortless through digital solutions,
                  expert-driven processes, and consistent, high-quality customer
                  service.
                </p>
              </div>
              <div className="md:flex-1 flex flex-col pl-10 md:flex-row gap-4 md:gap-10 relative after:content-[''] after:absolute after:-bottom-2 after:rotate-90 after:-translate-y-[45%] md:after:rotate-0 after:left-1/2 after:-translate-x-1/2 after:h-[50%] md:after:h-[45%] after:w-px after:bg-white rounded-full after:top-1/2 md:after:-translate-y-1/6">
                <div className="md:flex-1 items-start">
                  <h3 className="text-[#A9081C] text-2xl md:text-3xl font-semibold tracking-tight text-right font-orbitron">
                    Vision
                  </h3>
                  <p className="text-[#E5E5E5] text-xs md:text-sm text-justify">
                    Our vision is to lead the digital transformation of EU
                    customs by driving innovation, automation, and data-driven
                    efficiency across the entire customs ecosystem.
                  </p>
                </div>
                <div className="md:flex-1 flex flex-col justify-end">
                  <h3 className="text-[#A9081C] text-2xl md:text-3xl font-semibold tracking-tight text-left font-orbitron">
                    Misson
                  </h3>
                  <p className="text-[#E5E5E5] text-xs md:text-sm text-justify">
                    Our mission is to simplify global trade by making customs
                    processes seamless, transparent, and effortless for
                    businesses of all sizes.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div className=" w-full h-full flex md:flex-1 gap-2 ">
                <div className="">
                  <h3 className="text-2xl md:text-4xl writing-mode-vertical-lr font-semibold font-orbitron rotate-180 [writing-mode:vertical-rl]">
                    <span className="text-[#716B6D]">General </span>
                    <span className=" text-[#A9081C]">Mananger</span>
                  </h3>
                </div>
                <div className="md:flex-1 pr-8 md:pr-0">
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
                        <h2 className="text-3xl md:text-4xl text-[#A9081C] font-orbitron font-bold tracking-tight md:pb-2">
                          Robert
                        </h2>
                      </div>
                      <div className="text-right">
                        <h3 className="text-xl md:text-xl text-[#E5E5E5] font-orbitron font-semibold">
                          van den Tol
                        </h3>
                        <p className="text-[#E5E5E5] text-sm md:text-lg">
                          Ill ensure My Customs B.V. delivers efficient,
                          compliant, and technology-driven customs solutions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" w-full flex gap-2 items-center justify-center">
                <div className=" w-full flex gap-6 items-center justify-center mt-2">
                  <Button
                    size="icon"
                    className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#A9081C] hover:text-white"
                  >
                    <ArrowLeft />
                  </Button>
                  <Button
                    size="icon"
                    className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#A9081C] hover:text-white"
                  >
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* </div> */}
    </section>
  );
}
