"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import {
  useNavigation,
  PAGE_ORDER,
  getPageIndex,
} from "@/context/NavigationContext";
import { locales, type Locale } from "@/i18n";

interface ScrollNavigationProps {
  firstServiceSlug?: string | null;
  firstBlogSlug?: string | null;
}

// GLOBAL state - persists outside React lifecycle
let SCROLL_LOCK = false;
let LAST_WHEEL_TIME = 0;
let NAVIGATION_TIME = 0;

/**
 * Scroll Navigation Handler
 * - Locks on navigation for 600ms (animation)
 * - After unlock, requires 300ms gap between wheel events (filters momentum)
 */
export default function ScrollNavigation({
  firstServiceSlug,
  firstBlogSlug,
}: ScrollNavigationProps) {
  const router = useTransitionRouter();
  const pathname = usePathname();
  const { setNavigationDirection } = useNavigation();

  // Unlock after page change + animation time
  useEffect(() => {
    console.log("[ScrollNav] Page changed to:", pathname);

    if (SCROLL_LOCK) {
      // Unlock after animation completes (500ms animation + 100ms buffer)
      setTimeout(() => {
        console.log("[ScrollNav] Unlock after animation");
        SCROLL_LOCK = false;
      }, 600);
    }
  }, [pathname]);

  // Get current locale from pathname
  const getCurrentLocale = useCallback((): Locale => {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    if (firstSegment && locales.includes(firstSegment as Locale)) {
      return firstSegment as Locale;
    }
    return "en";
  }, [pathname]);

  // Build the full path for each page (same as nav links)
  const getFullPaths = useCallback(
    (locale: Locale): string[] => {
      return [
        `/${locale}`, // Home
        firstServiceSlug
          ? `/${locale}/services/${firstServiceSlug}`
          : `/${locale}/services`, // Services
        `/${locale}/portal`, // Portal
        firstBlogSlug
          ? `/${locale}/resources/blogs/${firstBlogSlug}`
          : `/${locale}/resources`, // Resources
        `/${locale}/about`, // About
        `/${locale}/contact`, // Contact
      ];
    },
    [firstServiceSlug, firstBlogSlug]
  );

  // Get target path for navigation
  const getTargetPath = useCallback(
    (direction: "next" | "prev"): string | null => {
      const currentIndex = getPageIndex(pathname);
      const locale = getCurrentLocale();
      const fullPaths = getFullPaths(locale);

      let targetIndex: number;
      if (direction === "next") {
        targetIndex = currentIndex + 1;
        if (targetIndex >= PAGE_ORDER.length) return null;
      } else {
        targetIndex = currentIndex - 1;
        if (targetIndex < 0) return null;
      }

      return fullPaths[targetIndex];
    },
    [pathname, getCurrentLocale, getFullPaths]
  );

  // Handle scroll/wheel events
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      const timeSinceLastWheel = now - LAST_WHEEL_TIME;
      const timeSinceNavigation = now - NAVIGATION_TIME;

      // ALWAYS update last wheel time to track momentum accurately
      LAST_WHEEL_TIME = now;

      // If locked, ignore
      if (SCROLL_LOCK) {
        return;
      }

      // MOMENTUM FILTER: If this event is too close to a previous one
      // and we recently navigated, treat it as momentum and ignore
      // Require at least 300ms gap for a "deliberate" new scroll
      if (timeSinceNavigation < 3000 && timeSinceLastWheel < 300) {
        console.log(
          "[ScrollNav] Filtering momentum event, gap:",
          timeSinceLastWheel,
          "ms"
        );
        return;
      }

      // This is a deliberate new scroll gesture
      console.log(
        "[ScrollNav] New gesture detected, gap:",
        timeSinceLastWheel,
        "ms"
      );
      SCROLL_LOCK = true;
      NAVIGATION_TIME = now;

      // Determine scroll direction
      const direction = e.deltaY > 0 ? "next" : "prev";
      const targetPath = getTargetPath(direction);

      if (!targetPath) {
        console.log("[ScrollNav] No valid target");
        SCROLL_LOCK = false;
        return;
      }

      console.log("[ScrollNav] Navigating to:", targetPath);

      // Set navigation direction for animation
      setNavigationDirection(targetPath);

      // Navigate
      router.push(targetPath);
    },
    [getTargetPath, setNavigationDirection, router]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  return null;
}
