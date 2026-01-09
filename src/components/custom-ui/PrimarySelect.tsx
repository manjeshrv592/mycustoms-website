"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface PrimarySelectProps {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  id?: string;
}

/**
 * Custom styled select wrapper matching the primary input styling
 * Uses shadcn Select under the hood
 */
export default function PrimarySelect({
  options,
  placeholder = "Select an option",
  value,
  onValueChange,
  className,
  id,
}: PrimarySelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        id={id}
        className={cn(
          "w-full bg-transparent rounded-lg border-0 border-b border-white text-white h-auto px-3 shadow-none focus:ring-0 focus:border-white focus-visible:ring-0 focus-visible:border-white",
          "[&>span]:text-left",
          "[&_svg]:text-white",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-neutral-900 border-neutral-700">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-white hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer text-xs"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
