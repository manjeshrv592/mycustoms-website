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
    <div className="flex flex-col h-full w-full overflow-hidden lg:mt-9">
      <div className="flex-1 min-h-0 overflow-hidden">
        <Swiper
          className="h-full w-full"
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
                <div className="w-full h-full flex gap-2">
                  <div className="">
                    {/* Designation / Role */}
                    <h3 className="text-xl md:text-2xl writing-mode-vertical-lr font-semibold font-orbitron rotate-180 [writing-mode:vertical-rl]">
                      <span className="text-[#716B6D]">{firstPart}</span>
                      {secondPart && (
                        <>
                          {" "}
                          <span className="text-[#3871C1]">{secondPart}</span>
                        </>
                      )}
                    </h3>
                  </div>
                  <div className="flex-1 pr-8 md:pr-0">
                    <div className="size-full relative flex items-end">
                      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.9)_100%)]"></div>
                      {/* Photo */}
                      <Image
                        src={member.imageUrl}
                        fill
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
                            <p className="text-[#E5E5E5]">
                              {member.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Navigation buttons - only show if more than 1 member */}
      {members.length > 1 && (
        <div className="w-full flex gap-2 items-center justify-center shrink-0">
          <div className="w-full flex gap-6 items-center justify-center md:mt-6 mt-2">
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
        </div>
      )}
    </div>
  );
};

export default TeamCarousel;
