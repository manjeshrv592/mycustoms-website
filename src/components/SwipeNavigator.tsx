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
const WHEEL_DEBOUNCE_TIME = 100; // Debounce time for wheel events (ms)

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

    // Wheel debounce refs - accumulate wheel events and process once
    const wheelAccumulatorRef = useRef(0);
    const wheelDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastWheelTargetRef = useRef<HTMLElement | null>(null);
    const hasNavigatedThisGestureRef = useRef(false);

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

        // Set unlock timeout
        lockTimeoutRef.current = setTimeout(() => {
            isLockedRef.current = false;
        }, NAVIGATION_LOCK_DURATION);
    }, []);

    // Process accumulated wheel delta and navigate
    const processWheelNavigation = useCallback(() => {
        // Don't process if already navigated in this gesture
        if (hasNavigatedThisGestureRef.current) {
            wheelAccumulatorRef.current = 0;
            return;
        }

        // Don't navigate if locked
        if (isLockedRef.current) {
            wheelAccumulatorRef.current = 0;
            return;
        }

        const accumulatedDelta = wheelAccumulatorRef.current;
        wheelAccumulatorRef.current = 0;

        // Check if accumulated scroll exceeds threshold
        if (Math.abs(accumulatedDelta) < SCROLL_THRESHOLD) return;

        // Determine scroll direction
        const isScrollingDown = accumulatedDelta > 0;
        const isScrollingUp = accumulatedDelta < 0;

        // Check for scrollable parent
        const scrollableParent = getScrollableParent(lastWheelTargetRef.current);

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
            hasNavigatedThisGestureRef.current = true; // Mark as navigated
            lockNavigation();
            navigateToPage("next");
        } else if (isScrollingUp && !isAtFirstPage) {
            hasNavigatedThisGestureRef.current = true; // Mark as navigated
            lockNavigation();
            navigateToPage("prev");
        }
    }, [navigateToPage, lockNavigation]);

    // Handle wheel scroll - accumulate and debounce
    const handleWheel = useCallback(
        (e: WheelEvent) => {
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

            // Accumulate wheel delta
            wheelAccumulatorRef.current += e.deltaY;
            lastWheelTargetRef.current = e.target as HTMLElement;

            // Clear existing debounce timeout
            if (wheelDebounceTimeoutRef.current) {
                clearTimeout(wheelDebounceTimeoutRef.current);
            }

            // Set debounce timeout to process after wheel events settle
            wheelDebounceTimeoutRef.current = setTimeout(() => {
                processWheelNavigation();
                // Reset gesture flag after debounce completes
                hasNavigatedThisGestureRef.current = false;
            }, WHEEL_DEBOUNCE_TIME);

            // Prevent default scrolling if we might navigate
            const scrollableParent = getScrollableParent(e.target as HTMLElement);
            if (!scrollableParent) {
                e.preventDefault();
            } else {
                const direction = e.deltaY > 0 ? "down" : "up";
                if (isAtScrollBoundary(scrollableParent, direction)) {
                    e.preventDefault();
                }
            }
        },
        [isNavigating, processWheelNavigation]
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
            if (wheelDebounceTimeoutRef.current) {
                clearTimeout(wheelDebounceTimeoutRef.current);
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
