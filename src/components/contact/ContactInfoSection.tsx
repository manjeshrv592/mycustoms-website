"use client";

import { useContactForm } from "@/context/ContactFormContext";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";

interface ContactInfoSectionProps {
  contactImageUrl: string;
  address: string;
  phone: string;
  email: string;
}

const ContactInfoSection = ({
  contactImageUrl,
  address,
  phone,
  email,
}: ContactInfoSectionProps) => {
  const { isInfoCollapsed } = useContactForm();

  return (
    <div
      className={` absolute md:relative md:flex flex-col gap-4 max-w-[400px] 2xl:max-w-[30vw] ml-auto bottom-0 left-0 md:left-auto p-4 md:p-0 transition-all duration-500 ease-in-out overflow-hidden 2xl:max-h-none ${
        isInfoCollapsed
          ? "max-h-0 opacity-0 md:max-h-none md:opacity-100"
          : "max-h-[500px] opacity-100 2xl:max-h-none"
      }`}
    >
      <div className="md:flex-1 md:flex md:items-end">
        <div className="size-full rounded-xl overflow-hidden relative border border-[#dcdcdc] p-4 flex items-end md:max-h-[260px] h-80 2xl:h-[20vw] 2xl:max-h-none ">
          {/* Contact Section - Image */}
          <Image
            src={contactImageUrl}
            alt="Contact image"
            fill
            className="object-cover absolute"
          />
          <div className="z-20 text-white relative border border-white py-1 px-4 rounded-lg bg-black/10 backdrop-blur-[5px] flex-1 text-xs grid grid-cols-[1fr_max-content] items-center">
            <div>
              <div className="">Based at</div>
              {/* Address */}
              {address && <div>{address}</div>}
            </div>
            <div className="">
              <a
                className="text-[#3871c1] font-bold border-b border-[#3871c1]"
                target="_blank"
                href="https://www.google.com/maps"
              >
                View on map
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-4 border-t border-white mt-4 md:mt-0 flex-col md:flex-row">
        <a href={`tel:${phone}`} className="flex gap-2">
          <span className="rounded-full bg-transparent size-8 border border-white flex items-center justify-center">
            <Phone className="size-3" />
          </span>
          <div className="flex flex-col">
            <span>Phone</span>
            {/* Phone Number */}
            {phone && <span>Office : {phone}</span>}
          </div>
        </a>
        <a
          href={`mailto:${email}`}
          className="flex gap-2 md:self-end flex-row-reverse md:flex-row"
        >
          <span className="rounded-full bg-transparent size-8 border border-white flex items-center justify-center">
            <Mail className="size-3" />
          </span>
          <div className="flex flex-col text-right md:text-left">
            <span>Email</span>
            {/* Email Address */}
            {email && <span>Office : {email}</span>}
          </div>
        </a>
      </div>
    </div>
  );
};

export default ContactInfoSection;
