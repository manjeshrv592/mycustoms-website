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
 * Check if an element is scrollable vertically
 */
function isScrollableElement(element: Element): boolean {
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  const isScrollable = overflowY === "auto" || overflowY === "scroll";
  const hasScrollableContent = element.scrollHeight > element.clientHeight;
  return isScrollable && hasScrollableContent;
}

/**
 * Find the nearest scrollable ancestor of an element
 */
function findScrollableAncestor(element: Element | null): Element | null {
  while (element && element !== document.body) {
    if (isScrollableElement(element)) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
}

/**
 * Check if a scrollable element is at its scroll boundary
 * Returns true if we should allow page navigation
 */
function canNavigateFromScrollable(
  element: Element,
  direction: "up" | "down"
): boolean {
  const scrollTop = element.scrollTop;
  const scrollHeight = element.scrollHeight;
  const clientHeight = element.clientHeight;

  if (direction === "up") {
    // Can navigate up if at the top of the scrollable content
    return scrollTop <= 0;
  } else {
    // Can navigate down if at the bottom of the scrollable content
    return scrollTop + clientHeight >= scrollHeight - 1; // -1 for rounding tolerance
  }
}

/**
 * SwipeNavigator - Handles swipe/scroll gesture navigation between pages
 *
 * Uses @use-gesture/react for reliable wheel/swipe detection
 * Navigates to next/prev page based on scroll direction
 * Respects scrollable containers - only navigates at scroll boundaries
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

  // Track the scrollable element for the current gesture
  const currentScrollableRef = useRef<Element | null>(null);

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
    ({ delta: [, deltaY], first, active, event }) => {
      // Reset trigger flag on new gesture
      if (first) {
        hasTriggeredRef.current = false;
        // Find scrollable ancestor on first event
        const target = event?.target as Element | null;
        currentScrollableRef.current = target
          ? findScrollableAncestor(target)
          : null;
      }

      // If inside a scrollable container, check if at boundary
      if (currentScrollableRef.current) {
        const direction = deltaY > 0 ? "down" : "up";
        if (
          !canNavigateFromScrollable(currentScrollableRef.current, direction)
        ) {
          // Container can still scroll, don't navigate
          return;
        }
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

  // Track scrollable element for drag gesture
  const dragScrollableRef = useRef<Element | null>(null);

  // Bind drag gesture to window (for mobile touch swipes)
  useDrag(
    ({
      movement: [, my],
      velocity: [, vy],
      direction: [, dy],
      first,
      active,
      event,
    }) => {
      // Reset trigger flag on new gesture
      if (first) {
        hasDragTriggeredRef.current = false;
        // Find scrollable ancestor on first event
        const target = event?.target as Element | null;
        dragScrollableRef.current = target
          ? findScrollableAncestor(target)
          : null;
      }

      // If inside a scrollable container, check if at boundary
      if (dragScrollableRef.current) {
        // dy > 0 means dragging down, which is scrolling up direction
        const direction = dy > 0 ? "up" : "down";
        if (!canNavigateFromScrollable(dragScrollableRef.current, direction)) {
          // Container can still scroll, don't navigate
          return;
        }
      }

      // Check for swipe when velocity is high enough
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
