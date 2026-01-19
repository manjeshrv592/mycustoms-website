"use client";

import TransitionLink from "@/components/animation/TransitionLink";
import PrimaryButton from "@/components/custom-ui/PrimaryButton";

interface ContactButtonProps {
  locale: string;
}

/**
 * Contact Us button with page transition animation
 * Used on the home page to navigate to contact page
 */
export default function ContactButton({ locale }: ContactButtonProps) {
  return (
    <TransitionLink href={`/${locale}/contact`}>
      <PrimaryButton variant="gradient">Contact Us</PrimaryButton>
    </TransitionLink>
  );
}
