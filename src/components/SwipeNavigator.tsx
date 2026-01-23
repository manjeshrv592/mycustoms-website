"use client";

import { useEffect, useRef, useCallback } from "react";
import { useNavigation, PAGE_ORDER } from "@/context/NavigationContext";

interface SwipeNavigatorProps {
    children: React.ReactNode;
}

// Configuration
const SCROLL_THRESHOLD = 50; // Minimum scroll delta to trigger navigation
const TOUCH_THRESHOLD = 50; // Minimum touch swipe distance to trigger navigation
const NAVIGATION_LOCK_DURATION = 350; // Lock duration after navigation (ms) - matches animation
const NEW_GESTURE_GAP = 80; // Time gap (ms) to consider wheel events as a new gesture

/**
 * Check if an element or any of its parents is scrollable
 * Returns the scrollable element if found, null otherwise
 */
function getScrollableParent(element: HTMLElement | null): HTMLElement | null {
    if (!element) return null;

    let current: HTMLElement | null = element;

    while (current) {
        // Check if element is scrollable
        const style = window.getComputedStyle(current);
        const overflowY = style.overflowY;
        const isScrollable = overflowY === "auto" || overflowY === "scroll";

        if (isScrollable && current.scrollHeight > current.clientHeight) {
            return current;
        }

        current = current.parentElement;
    }

    return null;
}

/**
 * Check if a scrollable element is at its scroll boundary
 * @param element - The scrollable element
 * @param direction - 'up' or 'down'
 * @returns true if at the boundary in the given direction
 */
function isAtScrollBoundary(
    element: HTMLElement,
    direction: "up" | "down"
): boolean {
    const tolerance = 2; // Small tolerance for rounding errors

    if (direction === "up") {
        // At top if scrollTop is 0 or very close to 0
        return element.scrollTop <= tolerance;
    } else {
        // At bottom if scrollTop + clientHeight >= scrollHeight
        return (
            element.scrollTop + element.clientHeight >=
            element.scrollHeight - tolerance
        );
    }
}

/**
 * SwipeNavigator - Handles wheel scroll and touch swipe for page navigation
 * Wraps children and attaches global event listeners
 * Respects scrollable containers - only navigates at scroll boundaries
 * 
 * Uses time-gap detection to distinguish between:
 * - Continuous wheel events from same swipe (inertia) → only navigate once
 * - New intentional swipe after a gap → allow navigation
 */
export default function SwipeNavigator({ children }: SwipeNavigatorProps) {
    const { navigateToPage, isNavigating, currentPageIndex } = useNavigation();

    // Touch tracking refs
    const touchStartY = useRef<number | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartElement = useRef<HTMLElement | null>(null);

    // Navigation lock ref (prevents navigation during animation)
    const isLockedRef = useRef(false);
    const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Time-gap based gesture detection
    const lastWheelTimeRef = useRef<number>(0);
    const hasNavigatedInGestureRef = useRef(false);

    // Store current page index in a ref for synchronous access
    const currentPageIndexRef = useRef(currentPageIndex);
    useEffect(() => {
        currentPageIndexRef.current = currentPageIndex;
    }, [currentPageIndex]);

    // Function to lock navigation during animation
    const lockNavigation = useCallback(() => {
        isLockedRef.current = true;

        if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
        }

        lockTimeoutRef.current = setTimeout(() => {
            isLockedRef.current = false;
        }, NAVIGATION_LOCK_DURATION);
    }, []);

    // Handle wheel scroll with time-gap gesture detection
    const handleWheel = useCallback(
        (e: WheelEvent) => {
            const now = performance.now();
            const timeSinceLastWheel = now - lastWheelTimeRef.current;
            lastWheelTimeRef.current = now;

            // Detect if this is a NEW gesture (gap since last wheel event)
            // If gap > NEW_GESTURE_GAP, reset the "navigated" flag
            if (timeSinceLastWheel > NEW_GESTURE_GAP) {
                hasNavigatedInGestureRef.current = false;
            }

            // If we already navigated in this gesture, ignore remaining events
            if (hasNavigatedInGestureRef.current) {
                e.preventDefault();
                return;
            }

            // Don't navigate if locked (animation in progress)
            if (isLockedRef.current) {
                e.preventDefault();
                return;
            }

            // Don't navigate if already navigating (React state check)
            if (isNavigating) {
                e.preventDefault();
                return;
            }

            // Determine scroll direction
            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;

            // Check if scroll exceeds threshold
            const exceedsThreshold = Math.abs(e.deltaY) >= SCROLL_THRESHOLD;
            if (!exceedsThreshold) return;

            // Check for scrollable parent
            const scrollableParent = getScrollableParent(e.target as HTMLElement);

            if (scrollableParent) {
                const direction = isScrollingDown ? "down" : "up";
                if (!isAtScrollBoundary(scrollableParent, direction)) {
                    return;
                }
            }

            // Check page boundaries
            const pageIndex = currentPageIndexRef.current;
            const isAtFirstPage = pageIndex === 0;
            const isAtLastPage = pageIndex === PAGE_ORDER.length - 1;

            // Navigate and mark this gesture as "navigated"
            if (isScrollingDown && !isAtLastPage) {
                e.preventDefault();
                hasNavigatedInGestureRef.current = true; // Block rest of this gesture
                lockNavigation();
                navigateToPage("next");
            } else if (isScrollingUp && !isAtFirstPage) {
                e.preventDefault();
                hasNavigatedInGestureRef.current = true; // Block rest of this gesture
                lockNavigation();
                navigateToPage("prev");
            }
        },
        [isNavigating, navigateToPage, lockNavigation]
    );

    // Handle touch start
    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (e.touches.length === 1) {
            touchStartY.current = e.touches[0].clientY;
            touchStartX.current = e.touches[0].clientX;
            touchStartElement.current = e.target as HTMLElement;
        }
    }, []);

    // Handle touch end
    const handleTouchEnd = useCallback(
        (e: TouchEvent) => {
            if (touchStartY.current === null || touchStartX.current === null) return;

            // Don't navigate if locked
            if (isLockedRef.current) return;
            if (isNavigating) return;

            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;

            const deltaY = touchStartY.current - touchEndY;
            const deltaX = touchStartX.current - touchEndX;

            // Reset touch tracking
            const startElement = touchStartElement.current;
            touchStartY.current = null;
            touchStartX.current = null;
            touchStartElement.current = null;

            // Check if vertical swipe is more dominant than horizontal
            if (Math.abs(deltaY) < Math.abs(deltaX)) return;

            // Check if swipe exceeds threshold
            if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

            // Swipe up (deltaY positive) = next page
            // Swipe down (deltaY negative) = prev page
            const isSwipingUp = deltaY > 0;
            const isSwipingDown = deltaY < 0;

            // Check for scrollable parent
            const scrollableParent = getScrollableParent(startElement);

            if (scrollableParent) {
                const direction = isSwipingUp ? "down" : "up";
                if (!isAtScrollBoundary(scrollableParent, direction)) {
                    return;
                }
            }

            // Check page boundaries
            const isAtFirstPage = currentPageIndex === 0;
            const isAtLastPage = currentPageIndex === PAGE_ORDER.length - 1;

            if (isSwipingUp && !isAtLastPage) {
                lockNavigation();
                navigateToPage("next");
            } else if (isSwipingDown && !isAtFirstPage) {
                lockNavigation();
                navigateToPage("prev");
            }
        },
        [isNavigating, currentPageIndex, navigateToPage, lockNavigation]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (lockTimeoutRef.current) {
                clearTimeout(lockTimeoutRef.current);
            }
        };
    }, []);

    // Attach event listeners
    useEffect(() => {
        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [handleWheel, handleTouchStart, handleTouchEnd]);

    return <>{children}</>;
}
