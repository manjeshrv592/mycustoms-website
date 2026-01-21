"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import PrimaryButton from "@/components/custom-ui/PrimaryButton";
import PrimaryInput from "@/components/custom-ui/PrimaryInput";
import PrimaryTextarea from "@/components/custom-ui/PrimaryTextarea";
import PrimarySelect from "@/components/custom-ui/PrimarySelect";
import PrimaryPhoneInput from "@/components/custom-ui/PrimaryPhoneInput";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";

// Service options for the select dropdown
const SERVICE_OPTIONS = [
  { value: "Import declaration", label: "Import declaration" },
  { value: "Export declaration", label: "Export declaration" },
  { value: "Fiscal representation", label: "Fiscal representation" },
  { value: "Transit", label: "Transit" },
  { value: "Consulting", label: "Consulting" },
  { value: "General Enquiry", label: "General Enquiry" },
];

// Zod validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[^\d]*$/, "Name cannot contain numbers"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().or(z.literal("")), // Phone is optional, format handled by input component
  company: z.string().optional(), // Company is optional
  service: z.string().min(1, "Please select a service"),
  message: z.string().optional(), // Message is optional
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const { isInfoCollapsed, showClickButton, toggleInfoCollapsed } =
    useContactForm();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
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
    // Log form data to console
    console.log("Contact Form Submitted:", data);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Show success toast
    toast.success("Thank you!", {
      description:
        "Your request has been received. We will get back to you soon.",
    });

    // Reset form after successful submission
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col max-w-[400px] gap-4 md:gap-8 lg:gap-0 lg:justify-between max-h-[70dvh] 2xl:max-h-none md:max-h-none overflow-y-auto md:overflow-visible 2xl:mt-[1vw]"
    >
      <div className="2xl:mb-[1vw]">
        <Label htmlFor="name">Name</Label>
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
          Email
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
          Phone Number <span className="text-gray-400">(optional)</span>
        </Label>
        <PrimaryPhoneInput
          id="phone"
          placeholder="Phone Number"
          value={watch("phone")}
          onChange={(phone) =>
            setValue("phone", phone, { shouldValidate: true })
          }
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
          Company Name <span className="text-gray-400">(optional)</span>
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
          Select Service
        </Label>
        <PrimarySelect
          id="service"
          options={SERVICE_OPTIONS}
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
          Message <span className="text-gray-400">(optional)</span>
        </Label>
        <PrimaryTextarea
          className="md:h-32 lg:h-auto"
          id="message"
          rows={1}
          placeholder="Tell us more about your requirements..."
          {...register("message")}
        />
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
