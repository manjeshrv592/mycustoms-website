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
const VELOCITY_INCREASE_RATIO = 1.3; // Delta must increase by 30% to be considered new swipe

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
 * SwipeNavigator - Handles wheel scroll and touch swipe for page navigation
 * 
 * Uses VELOCITY CHANGE DETECTION to distinguish:
 * - Inertia: delta values DECREASE over time
 * - New swipe: delta values suddenly INCREASE
 */
export default function SwipeNavigator({ children }: SwipeNavigatorProps) {
    const { navigateToPage, isNavigating, currentPageIndex } = useNavigation();

    // Touch tracking refs
    const touchStartY = useRef<number | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartElement = useRef<HTMLElement | null>(null);

    // Navigation lock ref
    const isLockedRef = useRef(false);
    const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Gesture and velocity tracking
    const hasNavigatedInGestureRef = useRef(false);
    const lastDeltaYRef = useRef<number>(0);

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
            // Don't reset hasNavigatedInGestureRef here - let velocity detection handle it
        }, NAVIGATION_LOCK_DURATION);
    }, []);

    // Handle wheel scroll with velocity change detection
    const handleWheel = useCallback(
        (e: WheelEvent) => {
            const currentDeltaY = Math.abs(e.deltaY);
            const lastDeltaY = lastDeltaYRef.current;

            // Update tracking
            lastDeltaYRef.current = currentDeltaY;

            // Detect NEW gesture: delta suddenly increased (new force applied = new swipe)
            // Inertia has DECREASING delta, new swipe has INCREASING delta
            const isNewGesture = lastDeltaY > 0 && currentDeltaY > lastDeltaY * VELOCITY_INCREASE_RATIO;

            // Reset gesture flag if this is a new gesture
            if (isNewGesture) {
                hasNavigatedInGestureRef.current = false;
            }

            // Block if we already navigated in this gesture
            if (hasNavigatedInGestureRef.current) {
                e.preventDefault();
                return;
            }

            // Block during animation
            if (isLockedRef.current) {
                e.preventDefault();
                return;
            }

            // Block if React state says navigating
            if (isNavigating) {
                e.preventDefault();
                return;
            }

            // Check threshold
            if (currentDeltaY < SCROLL_THRESHOLD) {
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
                    return;
                }
            }

            // Check page boundaries
            const pageIndex = currentPageIndexRef.current;
            const isAtFirstPage = pageIndex === 0;
            const isAtLastPage = pageIndex === PAGE_ORDER.length - 1;

            // Navigate
            if (isScrollingDown && !isAtLastPage) {
                e.preventDefault();
                hasNavigatedInGestureRef.current = true;
                lockNavigation();
                navigateToPage("next");
            } else if (isScrollingUp && !isAtFirstPage) {
                e.preventDefault();
                hasNavigatedInGestureRef.current = true;
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
