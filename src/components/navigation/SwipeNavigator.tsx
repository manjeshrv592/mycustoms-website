"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWheel, useDrag } from "@use-gesture/react";
import { useNavigation, PAGE_ORDER } from "@/context/NavigationContext";
import { locales, type Locale } from "@/i18n";

// Navigation lock duration (animation duration + buffer)
const NAVIGATION_LOCK_DURATION = 600;

// Minimum delta thresholds to trigger navigation
const WHEEL_THRESHOLD = 50;
const SWIPE_DISTANCE_THRESHOLD = 30;
const SWIPE_VELOCITY_THRESHOLD = 0.3;

/**
 * SwipeNavigator - Handles swipe/scroll gesture navigation between pages
 *
 * Uses @use-gesture/react for reliable wheel/swipe detection
 * Navigates to next/prev page based on scroll direction
 */
export default function SwipeNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const { setNavigationDirection, currentPageIndex } = useNavigation();

  // Track navigation lock state with ref to avoid stale closures
  const isLockedRef = useRef(false);
  const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track if we've already triggered navigation for current gesture
  const hasTriggeredRef = useRef(false);
  const hasDragTriggeredRef = useRef(false);

  // Extract current locale from pathname
  const getCurrentLocale = useCallback((): Locale => {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0];
    return firstSegment && locales.includes(firstSegment as Locale)
      ? (firstSegment as Locale)
      : "en";
  }, [pathname]);

  // Navigate to a page by index
  const navigateToPage = useCallback(
    (targetIndex: number) => {
      // Don't navigate if locked or at boundary
      if (isLockedRef.current) {
        return;
      }

      // Clamp to valid range
      const clampedIndex = Math.max(
        0,
        Math.min(targetIndex, PAGE_ORDER.length - 1)
      );

      if (clampedIndex === currentPageIndex) {
        return;
      }

      // Lock navigation
      isLockedRef.current = true;

      // Clear any existing lock timeout
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }

      // Unlock after animation completes
      lockTimeoutRef.current = setTimeout(() => {
        isLockedRef.current = false;
      }, NAVIGATION_LOCK_DURATION);

      // Get target path
      const targetPath = PAGE_ORDER[clampedIndex];
      const currentLocale = getCurrentLocale();

      // Build localized path
      const localizedPath =
        targetPath === "/"
          ? `/${currentLocale}`
          : `/${currentLocale}${targetPath}`;

      // Set navigation direction for animation
      setNavigationDirection(localizedPath);

      // Navigate to target page
      router.push(localizedPath);
    },
    [currentPageIndex, getCurrentLocale, setNavigationDirection, router]
  );

  // Bind wheel gesture to window (for mouse wheel and trackpad)
  useWheel(
    ({ delta: [, deltaY], first, active }) => {
      // Reset trigger flag on new gesture
      if (first) {
        hasTriggeredRef.current = false;
      }

      // Trigger navigation on first event that exceeds threshold
      if (
        active &&
        !hasTriggeredRef.current &&
        !isLockedRef.current &&
        Math.abs(deltaY) > WHEEL_THRESHOLD
      ) {
        hasTriggeredRef.current = true;

        if (deltaY > 0) {
          // Scroll down = go to next page
          navigateToPage(currentPageIndex + 1);
        } else {
          // Scroll up = go to previous page
          navigateToPage(currentPageIndex - 1);
        }
      }
    },
    {
      target: typeof window !== "undefined" ? window : undefined,
      eventOptions: { passive: true },
    }
  );

  // Bind drag gesture to window (for mobile touch swipes)
  useDrag(
    ({
      movement: [, my],
      velocity: [, vy],
      direction: [, dy],
      first,
      last,
      active,
    }) => {
      // Reset trigger flag on new gesture
      if (first) {
        hasDragTriggeredRef.current = false;
      }

      // Check for swipe at the end of drag or when velocity is high enough
      if (
        active &&
        !hasDragTriggeredRef.current &&
        !isLockedRef.current &&
        Math.abs(my) > SWIPE_DISTANCE_THRESHOLD &&
        Math.abs(vy) > SWIPE_VELOCITY_THRESHOLD
      ) {
        hasDragTriggeredRef.current = true;

        if (dy > 0) {
          // Drag down (swipe down) = go to previous page (natural scroll)
          navigateToPage(currentPageIndex - 1);
        } else if (dy < 0) {
          // Drag up (swipe up) = go to next page (natural scroll)
          navigateToPage(currentPageIndex + 1);
        }
      }
    },
    {
      target: typeof window !== "undefined" ? window : undefined,
      pointer: { touch: true }, // Enable touch events
      eventOptions: { passive: true },
      axis: "y", // Only track vertical movement
      filterTaps: true, // Ignore tap-like gestures
    }
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (lockTimeoutRef.current) {
        clearTimeout(lockTimeoutRef.current);
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
}
