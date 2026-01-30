"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import PrimaryButton from "@/components/custom-ui/PrimaryButton";
import PrimaryInput from "@/components/custom-ui/PrimaryInput";
import PrimaryTextarea from "@/components/custom-ui/PrimaryTextarea";
import PrimarySelect from "@/components/custom-ui/PrimarySelect";
import PrimaryPhoneInput from "@/components/custom-ui/PrimaryPhoneInput";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";

interface ContactFormProps {
  services: string[];
}

// Zod validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[^\d]*$/, "Name cannot contain numbers"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Please enter your phone number")
    .refine(
      (value) => {
        // Remove all non-digit characters except the leading +
        const digitsOnly = value.replace(/[^\d]/g, "");
        // A valid phone number should have at least 7 digits (country code + actual number)
        // Most country codes are 1-3 digits, so requiring 7+ ensures there's an actual number
        return digitsOnly.length >= 7;
      },
      {
        message: "Please enter a valid phone number",
      }
    ),
  company: z.string().min(1, "Please enter your company name"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(1, "Please enter your message"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = ({ services }: ContactFormProps) => {
  // Map services from Sanity to the format expected by PrimarySelect
  const serviceOptions = services.map((service) => ({
    value: service,
    label: service,
  }));

  // reCAPTCHA
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const { isInfoCollapsed, showClickButton, toggleInfoCollapsed } =
    useContactForm();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Validate reCAPTCHA
    if (!captchaToken) {
      setCaptchaError("Please complete the reCAPTCHA verification");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, captchaToken }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error("Something went wrong", {
          description:
            result.message || "Please try again or contact us directly.",
        });
        return;
      }

      // Show success toast
      toast.success("Thank you!", {
        description:
          "Your request has been received. We will get back to you soon.",
      });

      // Reset form and reCAPTCHA after successful submission
      reset();
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
      setCaptchaError(null);
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error("Connection error", {
        description: "Please check your internet connection and try again.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[400px] gap-4 md:gap-8 lg:gap-0 lg:justify-between max-h-[70dvh] 2xl:max-h-none md:max-h-none overflow-y-auto md:overflow-visible 2xl:mt-[1vw]"
    >
      <div className="2xl:mb-[1vw]">
        <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
        <PrimaryInput
          type="text"
          id="name"
          placeholder="Enter your full name"
          {...register("name")}
          onKeyDown={(e) => {
            // Prevent typing numbers in name field
            if (/\d/.test(e.key)) {
              e.preventDefault();
            }
          }}
          onFocus={() => {
            if (!isInfoCollapsed) {
              toggleInfoCollapsed();
            }
          }}
        />
        {errors.name && (
          <p className="text-red-400  mt-1">{errors.name.message}</p>
        )}
      </div>
      {showClickButton && (
        <div className="text-center md:hidden">
          <Button
            className="bg-transparent"
            type="button"
            variant="default"
            onClick={toggleInfoCollapsed}
          >
            <span className="flex flex-col items-center">
              <span>Click</span>
              <ChevronDown />
            </span>
          </Button>
        </div>
      )}

      <div
        className={`2xl:mb-[1vw] transition-opacity duration-500 ${isInfoCollapsed ? "opacity-100" : "opacity-0 md:opacity-100"
          }`}
      >
        <Label className="" htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <PrimaryInput
          type="email"
          id="email"
          placeholder="Enter your email address"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-400  mt-1">{errors.email.message}</p>
        )}
      </div>

      <div
        className={`2xl:mb-[1vw] transition-opacity duration-500 ${isInfoCollapsed ? "opacity-100" : "opacity-0 md:opacity-100"
          }`}
      >
        <Label className="" htmlFor="phone">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <PrimaryPhoneInput
          id="phone"
          placeholder="Phone Number"
          value={watch("phone")}
          onChange={(phone) =>
            setValue("phone", phone, { shouldValidate: false, shouldDirty: true })
          }
          onBlur={() => trigger("phone")}
        />
        {errors.phone && (
          <p className="text-red-400  mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div
        className={`2xl:mb-[1vw] transition-opacity duration-500 ${isInfoCollapsed ? "opacity-100" : "opacity-0 md:opacity-100"
          }`}
      >
        <Label className="" htmlFor="company">
          Company Name <span className="text-red-500">*</span>
        </Label>
        <PrimaryInput
          type="text"
          id="company"
          placeholder="Enter your company name"
          {...register("company")}
        />
        {errors.company && (
          <p className="text-red-400  mt-1">{errors.company.message}</p>
        )}
      </div>

      <div
        className={`2xl:mb-[1vw] transition-opacity duration-500 ${isInfoCollapsed ? "opacity-100" : "opacity-0 md:opacity-100"
          }`}
      >
        <Label className="" htmlFor="service">
          Select Service <span className="text-red-500">*</span>
        </Label>
        <PrimarySelect
          id="service"
          options={serviceOptions}
          placeholder="Choose a service"
          value={watch("service")}
          onValueChange={(value) =>
            setValue("service", value, { shouldValidate: true })
          }
        />
        {errors.service && (
          <p className="text-red-400  mt-1">{errors.service.message}</p>
        )}
      </div>

      <div
        className={`flex flex-col transition-opacity duration-500 ${isInfoCollapsed ? "opacity-100" : "opacity-0 md:opacity-100"
          }`}
      >
        <Label className="" htmlFor="message">
          Message <span className="text-red-500">*</span>
        </Label>
        <PrimaryTextarea
          className="md:h-32 lg:h-auto"
          id="message"
          rows={1}
          placeholder="Tell us more about your requirements..."
          {...register("message")}
        />
        {errors.message && (
          <p className="text-red-400  mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Google reCAPTCHA v2 */}
      <div
        className={`mt-4 flex flex-col items-center transition-opacity duration-500 ${isInfoCollapsed ? "opacity-100" : "opacity-0 md:opacity-100"
          }`}
      >
        <div className="transform scale-[0.75] origin-center -my-3">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            theme="dark"
            onChange={(token) => {
              setCaptchaToken(token);
              if (token) setCaptchaError(null);
            }}
            onExpired={() => setCaptchaToken(null)}
          />
        </div>
        {captchaError && (
          <p className="text-red-400 mt-1">{captchaError}</p>
        )}
      </div>

      <PrimaryButton
        type="submit"
        className={`w-full mt-4 transition-opacity duration-500 ${isInfoCollapsed ? "opacity-100" : "opacity-0 md:opacity-100"
          }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </PrimaryButton>

      {/* Hide form button - visible on mobile when form is expanded */}
      {isInfoCollapsed && (
        <Button
          type="button"
          variant="ghost"
          className="w-full md:hidden"
          onClick={toggleInfoCollapsed}
        >
          <span className="flex items-center gap-2">
            <ChevronUp />
            <span>Hide Form</span>
          </span>
        </Button>
      )}
    </form>
  );
};

export default ContactForm;
