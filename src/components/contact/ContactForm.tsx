"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import PrimaryButton from "@/components/custom-ui/PrimaryButton";
import PrimaryInput from "@/components/custom-ui/PrimaryInput";
import PrimaryTextarea from "@/components/custom-ui/PrimaryTextarea";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useContactForm } from "@/context/ContactFormContext";

// Zod validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a valid phone number"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
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
      className="flex flex-col  max-w-[400px] gap-3"
    >
      <div>
        <Label className="text-xs" htmlFor="name">
          Name
        </Label>
        <PrimaryInput
          type="text"
          id="name"
          placeholder="Enter your full name"
          {...register("name")}
          onFocus={() => {
            if (!isInfoCollapsed) {
              toggleInfoCollapsed();
            }
          }}
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      <div
        className={`text-center md:hidden ${showClickButton ? "" : "hidden"}`}
      >
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
      <div
        className={`flex flex-col gap-3 transition-opacity duration-500 ${
          isInfoCollapsed ? "opacity-100" : "opacity-0 md:opacity-100"
        }`}
      >
        <div>
          <Label className="text-xs" htmlFor="email">
            Email
          </Label>
          <PrimaryInput
            type="email"
            id="email"
            placeholder="Enter your email address"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label className="text-xs" htmlFor="phone">
            Phone Number
          </Label>
          <PrimaryInput
            type="text"
            id="phone"
            placeholder="Phone Number"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label className="text-xs" htmlFor="company">
            Company Name
          </Label>
          <PrimaryInput
            type="text"
            id="company"
            placeholder="Enter your company name"
            {...register("company")}
          />
          {errors.company && (
            <p className="text-red-400 text-xs mt-1">
              {errors.company.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs" htmlFor="service">
            Select Service
          </Label>
          <PrimaryInput
            type="text"
            id="service"
            placeholder="Choose a service"
            {...register("service")}
          />
          {errors.service && (
            <p className="text-red-400 text-xs mt-1">
              {errors.service.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-xs" htmlFor="message">
            Message <span className="text-gray-400">(optional)</span>
          </Label>
          <PrimaryTextarea
            id="message"
            placeholder="Tell us more about your requirements..."
            {...register("message")}
          />
        </div>

        <PrimaryButton type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </PrimaryButton>

        {/* Hide form button - visible on mobile when form is expanded */}
        <Button
          type="button"
          variant="ghost"
          className={`w-full md:hidden ${isInfoCollapsed ? "" : "hidden"}`}
          onClick={toggleInfoCollapsed}
        >
          <span className="flex items-center gap-2">
            <ChevronUp />
            <span>Hide Form</span>
          </span>
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
