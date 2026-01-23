"use client";

import { useEffect, useRef, useCallback } from "react";
import { useNavigation, PAGE_ORDER } from "@/context/NavigationContext";

interface SwipeNavigatorProps {
    children: React.ReactNode;
}

// Configuration
const SCROLL_THRESHOLD = 50; // Minimum scroll delta to trigger navigation
const TOUCH_THRESHOLD = 50; // Minimum touch swipe distance to trigger navigation
const NAVIGATION_LOCK_DURATION = 50; // Lock duration after navigation (ms) - matches animation
const GESTURE_RESET_TIME = 150; // Time to wait before allowing a new gesture (ms)

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
 */
export default function SwipeNavigator({ children }: SwipeNavigatorProps) {
    const { navigateToPage, isNavigating, currentPageIndex } = useNavigation();

    // Touch tracking refs
    const touchStartY = useRef<number | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartElement = useRef<HTMLElement | null>(null);

    // Navigation lock ref (immediate, synchronous lock)
    const isLockedRef = useRef(false);
    const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Gesture tracking - navigate immediately, then ignore rest of gesture
    const isInGestureRef = useRef(false);
    const gestureResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Store current page index in a ref for synchronous access
    const currentPageIndexRef = useRef(currentPageIndex);
    useEffect(() => {
        currentPageIndexRef.current = currentPageIndex;
    }, [currentPageIndex]);

    // Function to lock navigation - SYNCHRONOUSLY sets the lock immediately
    const lockNavigation = useCallback(() => {
        // Set lock IMMEDIATELY and SYNCHRONOUSLY before any async operations
        isLockedRef.current = true;

        // Clear existing timeout
        if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
        }

        // Set unlock timeout - also reset gesture flag when lock expires
        lockTimeoutRef.current = setTimeout(() => {
            isLockedRef.current = false;
            isInGestureRef.current = false; // Allow new gesture after lock expires
        }, NAVIGATION_LOCK_DURATION);
    }, []);

    // Mark start of a gesture - will ignore subsequent events until gesture ends
    const startGesture = useCallback(() => {
        isInGestureRef.current = true;

        // Clear existing reset timeout
        if (gestureResetTimeoutRef.current) {
            clearTimeout(gestureResetTimeoutRef.current);
        }
    }, []);

    // Reset gesture tracking after events stop coming
    const scheduleGestureReset = useCallback(() => {
        // Clear existing reset timeout
        if (gestureResetTimeoutRef.current) {
            clearTimeout(gestureResetTimeoutRef.current);
        }

        // Reset gesture flag after events stop
        gestureResetTimeoutRef.current = setTimeout(() => {
            isInGestureRef.current = false;
        }, GESTURE_RESET_TIME);
    }, []);

    // Handle wheel scroll - navigate immediately on first event, ignore rest
    const handleWheel = useCallback(
        (e: WheelEvent) => {
            // Schedule gesture reset on every wheel event (keeps extending the timeout)
            scheduleGestureReset();

            // If we're already in a gesture (already navigated), ignore this event
            if (isInGestureRef.current) {
                e.preventDefault();
                return;
            }

            // Don't navigate if locked (immediate check with ref)
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
                // We're inside a scrollable container
                const direction = isScrollingDown ? "down" : "up";

                // Only allow page navigation if at the boundary
                if (!isAtScrollBoundary(scrollableParent, direction)) {
                    // Not at boundary, let the container scroll normally
                    return;
                }
            }

            // Check if we're at the boundary pages (use ref for synchronous access)
            const pageIndex = currentPageIndexRef.current;
            const isAtFirstPage = pageIndex === 0;
            const isAtLastPage = pageIndex === PAGE_ORDER.length - 1;

            // Navigate based on direction
            if (isScrollingDown && !isAtLastPage) {
                e.preventDefault();
                startGesture(); // Mark gesture start BEFORE navigation
                lockNavigation();
                navigateToPage("next");
            } else if (isScrollingUp && !isAtFirstPage) {
                e.preventDefault();
                startGesture(); // Mark gesture start BEFORE navigation
                lockNavigation();
                navigateToPage("prev");
            }
        },
        [isNavigating, navigateToPage, lockNavigation, startGesture, scheduleGestureReset]
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
                // We're inside a scrollable container
                const direction = isSwipingUp ? "down" : "up";

                // Only allow page navigation if at the boundary
                if (!isAtScrollBoundary(scrollableParent, direction)) {
                    // Not at boundary, don't navigate
                    return;
                }
            }

            // Check if we're at the boundary pages
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
            if (gestureResetTimeoutRef.current) {
                clearTimeout(gestureResetTimeoutRef.current);
            }
        };
    }, []);

    // Attach event listeners
    useEffect(() => {
        // Use passive: false for wheel to allow preventDefault
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
