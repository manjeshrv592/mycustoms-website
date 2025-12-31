import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const TeamCarousel = () => {
  return (
    <>
      <div className="w-full h-full flex md:flex-1 gap-2">
        <div className="">
          {/* Designation / Role - hardcoded for now */}
          <h3 className="text-2xl md:text-4xl writing-mode-vertical-lr font-semibold font-orbitron rotate-180 [writing-mode:vertical-rl]">
            <span className="text-[#716B6D]">General Mananger</span>
          </h3>
        </div>
        <div className="md:flex-1 pr-8 md:pr-0">
          <div className="size-full relative flex items-end ">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.9)_100%)]"></div>
            {/* Photo - hardcoded for now */}
            <Image
              src="/images/team/Robert-van-den-tol.jpg"
              fill
              alt="General Manager"
              className="absolute object-cover"
            />
            <div className="z-100 w-full p-4">
              <div>
                {/* First Name - hardcoded for now */}
                <h2 className="text-3xl md:text-4xl text-[#3871C1] font-orbitron font-bold tracking-tight md:pb-2">
                  Robert
                </h2>
              </div>
              <div className="text-right">
                {/* Last Name - hardcoded for now */}
                <h3 className=" text-[#E5E5E5] font-orbitron font-semibold">
                  van den Tol
                </h3>
                {/* Description - hardcoded for now */}
                <p className="text-[#E5E5E5] text-xs">
                  Ill ensure My Customs B.V. delivers efficient, compliant, and
                  technology-driven customs solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full flex gap-2 items-center justify-center ">
        <div className=" w-full flex gap-6 items-center justify-center mt-2">
          <Button
            size="icon"
            className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer"
          >
            <ArrowLeft />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer"
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
    </>
  );
};

export default TeamCarousel;
