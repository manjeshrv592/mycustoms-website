"use client";

import { useEffect, useRef, useCallback } from "react";
import { useNavigation, PAGE_ORDER } from "@/context/NavigationContext";

interface SwipeNavigatorProps {
    children: React.ReactNode;
}

// Configuration
const TOUCH_THRESHOLD = 50;
const SCROLL_THRESHOLD = 50; // Minimum delta to trigger navigation
const NAVIGATION_LOCK_DURATION = 350; // Lock duration (ms) - matches animation
const COASTING_SAMPLE_SIZE = 3; // How many samples to check for steady decrease
const SPIKE_RATIO = 1.5; // Delta must be 1.5x the previous to be considered a spike

/**
 * Check if an element or any of its parents is scrollable
 */
function getScrollableParent(element: HTMLElement | null): HTMLElement | null {
    if (!element) return null;
    let current: HTMLElement | null = element;

    while (current) {
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
 */
function isAtScrollBoundary(
    element: HTMLElement,
    direction: "up" | "down"
): boolean {
    const tolerance = 2;
    if (direction === "up") {
        return element.scrollTop <= tolerance;
    } else {
        return (
            element.scrollTop + element.clientHeight >=
            element.scrollHeight - tolerance
        );
    }
}

/**
 * Check if an array of values is steadily decreasing
 */
function isSteadilyDecreasing(values: number[]): boolean {
    if (values.length < 2) return false;
    for (let i = 1; i < values.length; i++) {
        if (values[i] >= values[i - 1]) return false;
    }
    return true;
}

/**
 * SwipeNavigator - Handles wheel scroll and touch swipe for page navigation
 * 
 * Navigation Logic:
 * 1. First swipe → Navigate, lock for 350ms
 * 2. During lock → Block all events
 * 3. After lock expires:
 *    - If coasting (steady decrease) AND spike detected → NEW SWIPE → Navigate
 *    - Edge case: If significant spike (1.5x) detected regardless of coasting → Navigate
 */
export default function SwipeNavigator({ children }: SwipeNavigatorProps) {
    const { navigateToPage, isNavigating, currentPageIndex } = useNavigation();

    // Touch tracking refs
    const touchStartY = useRef<number | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartElement = useRef<HTMLElement | null>(null);

    // Navigation lock
    const isLockedRef = useRef(false);
    const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Delta history for detecting coasting
    const deltaHistoryRef = useRef<number[]>([]);
    const hasNavigatedRef = useRef(false);

    // Store current page index in ref for synchronous access
    const currentPageIndexRef = useRef(currentPageIndex);
    useEffect(() => {
        currentPageIndexRef.current = currentPageIndex;
    }, [currentPageIndex]);

    // Lock navigation for animation duration
    const lockNavigation = useCallback(() => {
        isLockedRef.current = true;
        hasNavigatedRef.current = true;
        deltaHistoryRef.current = []; // Reset history on navigation

        if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
        }

        lockTimeoutRef.current = setTimeout(() => {
            isLockedRef.current = false;
            // Note: hasNavigatedRef stays true until we detect coasting + spike
        }, NAVIGATION_LOCK_DURATION);
    }, []);

    // Handle wheel scroll
    const handleWheel = useCallback(
        (e: WheelEvent) => {
            const currentDelta = Math.abs(e.deltaY);
            const lastDelta = deltaHistoryRef.current[deltaHistoryRef.current.length - 1] || 0;

            // Add to history
            deltaHistoryRef.current.push(currentDelta);
            if (deltaHistoryRef.current.length > COASTING_SAMPLE_SIZE) {
                deltaHistoryRef.current.shift();
            }

            // Check coasting (steady decrease) and spike
            const isCoasting = isSteadilyDecreasing(deltaHistoryRef.current);
            const isSpike = lastDelta > 0 && currentDelta > lastDelta * SPIKE_RATIO;

            console.log(
                `Delta: ${currentDelta} | Last: ${lastDelta} | History: ${deltaHistoryRef.current.join('→')} | Coasting: ${isCoasting} | Spike: ${isSpike} | Locked: ${isLockedRef.current} | HasNav: ${hasNavigatedRef.current}`
            );

            // Block during lock
            if (isLockedRef.current) {
                console.log("→ BLOCKED: Lock active");
                e.preventDefault();
                return;
            }

            // Block if React says navigating
            if (isNavigating) {
                console.log("→ BLOCKED: isNavigating");
                e.preventDefault();
                return;
            }

            // If we already navigated, only allow new swipe under specific conditions
            if (hasNavigatedRef.current) {
                // Condition 1: Coasting detected + spike → NEW SWIPE
                // Condition 2: Significant spike (edge case, no coasting) → NEW SWIPE
                const isNewSwipe = (isCoasting && isSpike) || isSpike;

                console.log(`→ hasNavigated=true | isNewSwipe: ${isNewSwipe} (coasting+spike: ${isCoasting && isSpike}, spikeOnly: ${isSpike})`);

                if (isNewSwipe) {
                    console.log("→ ✅ NEW SWIPE DETECTED - Resetting for navigation");
                    // Reset for new gesture
                    hasNavigatedRef.current = false;
                    deltaHistoryRef.current = [];
                } else {
                    // Still same gesture, block
                    console.log("→ BLOCKED: Same gesture (no spike)");
                    e.preventDefault();
                    return;
                }
            }

            // Check threshold
            if (currentDelta < SCROLL_THRESHOLD) {
                console.log("→ BLOCKED: Below threshold");
                return;
            }

            // Determine direction
            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;

            // Check for scrollable parent
            const scrollableParent = getScrollableParent(e.target as HTMLElement);
            if (scrollableParent) {
                const direction = isScrollingDown ? "down" : "up";
                if (!isAtScrollBoundary(scrollableParent, direction)) {
                    console.log("→ BLOCKED: Inside scrollable, not at boundary");
                    return;
                }
            }

            // Check page boundaries
            const pageIndex = currentPageIndexRef.current;
            const isAtFirstPage = pageIndex === 0;
            const isAtLastPage = pageIndex === PAGE_ORDER.length - 1;

            // Navigate
            if (isScrollingDown && !isAtLastPage) {
                console.log("→ 🚀 NAVIGATING: Next page");
                e.preventDefault();
                lockNavigation();
                navigateToPage("next");
            } else if (isScrollingUp && !isAtFirstPage) {
                console.log("→ 🚀 NAVIGATING: Prev page");
                e.preventDefault();
                lockNavigation();
                navigateToPage("prev");
            } else {
                console.log("→ BLOCKED: At page boundary");
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
            if (isLockedRef.current) return;
            if (isNavigating) return;

            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;

            const deltaY = touchStartY.current - touchEndY;
            const deltaX = touchStartX.current - touchEndX;

            const startElement = touchStartElement.current;
            touchStartY.current = null;
            touchStartX.current = null;
            touchStartElement.current = null;

            if (Math.abs(deltaY) < Math.abs(deltaX)) return;
            if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;

            const isSwipingUp = deltaY > 0;
            const isSwipingDown = deltaY < 0;

            const scrollableParent = getScrollableParent(startElement);
            if (scrollableParent) {
                const direction = isSwipingUp ? "down" : "up";
                if (!isAtScrollBoundary(scrollableParent, direction)) {
                    return;
                }
            }

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

    // Cleanup
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
