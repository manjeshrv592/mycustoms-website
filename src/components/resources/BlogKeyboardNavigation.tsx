"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface BlogKeyboardNavigationProps {
  /** Localized href of the previous blog, or null when there is none */
  prevHref: string | null;
  /** Localized href of the next blog, or null when there is none */
  nextHref: string | null;
}

/**
 * Adds Left/Right arrow key navigation between blog articles.
 * - ArrowLeft  → previous blog
 * - ArrowRight → next blog
 *
 * Mirrors the existing prev/next arrow icon buttons. Renders nothing.
 */
export default function BlogKeyboardNavigation({
  prevHref,
  nextHref,
}: BlogKeyboardNavigationProps) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      // Ignore while typing in form fields or editable content (e.g. search)
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return;
      }

      if (e.key === "ArrowLeft" && prevHref) {
        e.preventDefault();
        router.push(prevHref);
      } else if (e.key === "ArrowRight" && nextHref) {
        e.preventDefault();
        router.push(nextHref);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevHref, nextHref, router]);

  return null;
}
