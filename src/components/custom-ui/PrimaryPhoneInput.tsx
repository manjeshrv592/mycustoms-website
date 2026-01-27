"use client";

import { CountrySelector, usePhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface PrimaryPhoneInputProps {
  value?: string;
  onChange?: (phone: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * Phone input with country code selector
 * Uses react-international-phone library
 */
const PrimaryPhoneInput = forwardRef<HTMLInputElement, PrimaryPhoneInputProps>(
  ({ value, onChange, placeholder = "Phone Number", className, id }, ref) => {
    const phoneInput = usePhoneInput({
      defaultCountry: "nl", // Default to Netherlands
      forceDialCode: true, // Prevent users from editing/removing country code
      value: value || "",
      onChange: (data) => {
        onChange?.(data.phone);
      },
    });

    return (
      <div
        className={cn(
          "flex items-center gap-2 border-b border-white bg-transparent rounded-lg",
          className,
        )}
      >
        <CountrySelector
          selectedCountry={phoneInput.country.iso2}
          onSelect={(country) => phoneInput.setCountry(country.iso2)}
          renderButtonWrapper={({ children, rootProps }) => (
            <button
              {...rootProps}
              type="button"
              className="flex items-center gap-1 bg-transparent text-white hover:bg-white/10 px-2 py-2 rounded transition-colors focus:outline-none focus:ring-0"
            >
              {children}
            </button>
          )}
          dropdownStyleProps={{
            style: { backgroundColor: "#171717", borderColor: "#404040" },
            className:
              "!bg-neutral-900 border !border-neutral-700 rounded-lg shadow-lg z-50",
            listItemClassName:
              "!text-white hover:!bg-neutral-800 px-3 py-2 cursor-pointer text-sm !bg-neutral-900",
            listItemFlagClassName: "mr-2",
            listItemCountryNameClassName: "!text-white",
            listItemDialCodeClassName: "!text-gray-400 ml-auto",
          }}
        />
        <input
          ref={ref}
          id={id}
          type="tel"
          placeholder={placeholder}
          value={phoneInput.inputValue}
          onChange={phoneInput.handlePhoneValueChange}
          className="flex-1 bg-transparent text-white placeholder:text-muted-foreground text-sm py-2 focus:outline-none focus:ring-0"
        />
      </div>
    );
  },
);

PrimaryPhoneInput.displayName = "PrimaryPhoneInput";

export default PrimaryPhoneInput;
