"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import TeamCarousel from "./TeamCarousel";

interface TeamMember {
    id: string;
    firstName: string;
    lastName: string;
    designation: string;
    description: string;
    imageUrl: string;
}

interface AboutContentProps {
    description: string;
    visionTitle: string;
    visionDescription: string;
    missionTitle: string;
    missionDescription: string;
    members: TeamMember[];
}

const AboutContent = ({
    description,
    visionTitle,
    visionDescription,
    missionTitle,
    missionDescription,
    members,
}: AboutContentProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div className="flex flex-col md:grid lg:grid-cols-[3fr_2fr] xl:grid-cols-[2fr_1fr] gap-4 lg:gap-24 h-full">
            <div className="flex flex-col">
                <div className="md:flex-1">
                    <div className="flex items-center gap-4 mb-2">
                        <span className="inline-block h-px w-[50px] bg-[#7ED957]">
                            &nbsp;
                        </span>
                        <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
                            about
                        </span>
                    </div>
                    {/* About Description */}
                    {description && (
                        <p
                            className={`text-[#E5E5E5] md:mb-5 text-justify transition-all duration-500 ease-in-out overflow-hidden lg:max-h-none lg:overflow-visible ${isExpanded ? "max-h-[500px]" : "max-h-[3.2em]"
                                }`}
                        >
                            {description}
                        </p>
                    )}
                </div>
                <div className="md:flex-1 flex flex-col md:flex-row gap-4 md:gap-10 relative after:hidden after:md:block after:absolute after:contente-[''] after:bg-white after:w-px after:h-1/2 after:left-1/2 after:-translate-x-1/2 after:top-1/2 after:-translate-y-1/2">
                    <div className="md:flex-1 items-start">
                        {/* Vision Title */}
                        <h3 className="text-[#3871C1] text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-right font-grift">
                            {visionTitle}
                        </h3>
                        {/* Vision Description */}
                        {visionDescription && (
                            <p
                                className={`text-[#E5E5E5] text-justify transition-all duration-500 ease-in-out overflow-hidden lg:max-h-none lg:overflow-visible ${isExpanded ? "max-h-[500px]" : "max-h-[1.6em]"
                                    }`}
                            >
                                {visionDescription}
                            </p>
                        )}
                    </div>
                    <div className="md:flex-1 flex flex-col justify-end">
                        {/* Mission Title */}
                        <h3 className="text-[#3871C1] text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-left font-grift">
                            {missionTitle}
                        </h3>
                        {/* Mission Description */}
                        {missionDescription && (
                            <p
                                className={`text-[#E5E5E5] text-justify transition-all duration-500 ease-in-out overflow-hidden lg:max-h-none lg:overflow-visible ${isExpanded ? "max-h-[500px]" : "max-h-[1.6em]"
                                    }`}
                            >
                                {missionDescription}
                            </p>
                        )}
                    </div>
                </div>

                {/* Read More / Show Less button — mobile only */}
                <div className="text-center lg:hidden mt-2">
                    <Button
                        className="bg-transparent"
                        type="button"
                        variant="default"
                        onClick={toggleExpanded}
                    >
                        <span className="flex flex-col items-center">
                            <span>{isExpanded ? "Show Less" : "Read More"}</span>
                            {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </span>
                    </Button>
                </div>
            </div>

            {/* Team members carousel — slides out on mobile when expanded */}
            <div
                className={`flex flex-col flex-1 overflow-hidden min-w-0 transition-all duration-500 ease-in-out lg:max-h-none lg:opacity-100 ${isExpanded
                    ? "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
                    : "max-h-[600px] opacity-100"
                    }`}
            >
                <TeamCarousel members={members} />
            </div>
        </div>
    );
};

export default AboutContent;
