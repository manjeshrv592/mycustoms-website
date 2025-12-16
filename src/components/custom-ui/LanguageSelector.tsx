"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const languages = [
  {
    code: "en",
    label: "EN",
    fullLabel: "English",
    flag: "/images/flags/us.svg",
    alt: "US flag",
  },
  {
    code: "nl",
    label: "NL",
    fullLabel: "Dutch",
    flag: "/images/flags/nl.svg",
    alt: "Netherlands flag",
  },
  {
    code: "de",
    label: "DE",
    fullLabel: "German",
    flag: "/images/flags/de.svg",
    alt: "Germany flag",
  },
  {
    code: "cn",
    label: "CN",
    fullLabel: "Chinese",
    flag: "/images/flags/cn.svg",
    alt: "China flag",
  },
];

export default function LanguageSelector() {
  const [selectedLang, setSelectedLang] = useState("en");

  const currentLang =
    languages.find((l) => l.code === selectedLang) || languages[0];

  return (
    <Select value={selectedLang} onValueChange={setSelectedLang}>
      <SelectTrigger className="bg-black/25 rounded-full p-1 data-[size=default]:h-auto [&_svg]:text-white! [&_svg]:opacity-100! cursor-pointer border border-white/20">
        <SelectValue>
          <div className="flex items-center gap-2 text-white">
            <span className="inline-block size-5 rounded-full overflow-hidden">
              <Image
                src={currentLang.flag}
                alt={currentLang.alt}
                width={20}
                height={20}
                className="w-5 h-5 object-cover"
              />
            </span>
            <span>{currentLang.label}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        align="end"
        className="bg-black/25 text-white min-w-28 border-white/20 border"
      >
        <SelectGroup>
          <SelectLabel className="text-white uppercase tracking-[1px]">
            Language
          </SelectLabel>
          {languages.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className="[&_svg]:text-white! [&_svg]:opacity-100! [&_svg]:duration-300 duration-300 transition-all cursor-pointer rounded-full p-1 mb-2 last:mb-0 hover:[&_svg]:text-black! data-highlighted:[&_svg]:text-black!"
            >
              <div className="flex items-center gap-2">
                <span className="inline-block size-5 rounded-full overflow-hidden">
                  <Image
                    src={lang.flag}
                    alt={lang.alt}
                    width={20}
                    height={20}
                    className="w-5 h-5 object-cover"
                  />
                </span>
                <span>{lang.fullLabel}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
