"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { splitTextDualColor } from "@/lib/utils";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  designation: string;
  description: string;
  imageUrl: string;
}

interface TeamCarouselProps {
  members: TeamMember[];
}

const TeamCarousel = ({ members }: TeamCarouselProps) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  // If no members, show placeholder
  if (!members || members.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[#716B6D]">
        No team members available
      </div>
    );
  }

  return (
    <div className="h-full max-h-[600px] max-w-[350px] mx-auto lg:max-w-none w-full flex flex-col">
      <Swiper
        className="flex-1 w-full"
        modules={[Navigation, Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        loop={members.length > 1}
        spaceBetween={20}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        style={{ overflow: "hidden" }}
      >
        {members.map((member) => {
          // Split designation into dual colors using utility function
          const { firstPart, secondPart } = splitTextDualColor(
            member.designation
          );

          return (
            <SwiperSlide key={member.id}>
              <div className="size-full grid grid-cols-[max-content_1fr] ">
                <h3 className="text-xl md:text-2xl font-semibold font-orbitron rotate-180 [writing-mode:vertical-rl] text-right">
                  <span className="text-[#716B6D]">{firstPart}</span>
                  {secondPart && (
                    <>
                      {" "}
                      <span className="text-[#3871C1]">{secondPart}</span>
                    </>
                  )}
                </h3>
                <div className="size-full relative flex items-end">
                  <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.9)_100%)]"></div>
                  {/* Photo */}
                  <Image
                    src={member.imageUrl}
                    fill
                    sizes="(max-width: 1024px) 350px, 30vw"
                    alt={`${member.firstName} ${member.lastName}`}
                    className="absolute object-cover"
                  />
                  <div className="z-20 w-full p-4">
                    <div>
                      {/* First Name */}
                      <h2 className="text-xl md:text-2xl text-[#3871C1] font-orbitron font-bold tracking-tight md:pb-2">
                        {member.firstName}
                      </h2>
                    </div>
                    <div className="text-right">
                      {/* Last Name */}
                      <h3 className="text-[#E5E5E5] font-orbitron font-semibold text-sm">
                        {member.lastName}
                      </h3>
                      {/* Description */}
                      {member.description && (
                        <p className="text-[#E5E5E5]">{member.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation buttons - outside Swiper so they don't move with slides */}
      {members.length > 1 && (
        <div className="flex justify-center gap-2 mt-2 pl-7 md:pl-8">
          <Button
            size="icon"
            className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer"
            onClick={handlePrev}
          >
            <ArrowLeft />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer"
            onClick={handleNext}
          >
            <ArrowRight />
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamCarousel;
