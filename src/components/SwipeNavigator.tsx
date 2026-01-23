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
const POST_LOCK_THRESHOLD = 100; // Higher threshold for first event after lock expires (filters inertia)

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
 * Gesture detection logic:
 * 1. During navigation (locked): block all wheel events
 * 2. First event after lock expires: require higher deltaY (POST_LOCK_THRESHOLD)
 *    to filter out weak inertia, but allow strong intentional swipes
 * 3. After navigating: block remaining events from same gesture until lock expires
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

    // Gesture tracking
    const hasNavigatedInGestureRef = useRef(false);
    const justUnlockedRef = useRef(false); // True for first event after lock expires

    // Store current page index in a ref for synchronous access
    const currentPageIndexRef = useRef(currentPageIndex);
    useEffect(() => {
        currentPageIndexRef.current = currentPageIndex;
    }, [currentPageIndex]);

    // Function to lock navigation during animation
    const lockNavigation = useCallback(() => {
        isLockedRef.current = true;
        justUnlockedRef.current = false;

        if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
        }

        lockTimeoutRef.current = setTimeout(() => {
            isLockedRef.current = false;
            hasNavigatedInGestureRef.current = false; // Allow new gesture
            justUnlockedRef.current = true; // Mark that we just unlocked
        }, NAVIGATION_LOCK_DURATION);
    }, []);

    // Handle wheel scroll
    const handleWheel = useCallback(
        (e: WheelEvent) => {
            // Don't navigate if locked (animation in progress)
            if (isLockedRef.current) {
                e.preventDefault();
                return;
            }

            // If we already navigated in this gesture, block remaining events
            if (hasNavigatedInGestureRef.current) {
                e.preventDefault();
                return;
            }

            // Don't navigate if already navigating (React state check)
            if (isNavigating) {
                e.preventDefault();
                return;
            }

            // Determine scroll direction and delta
            const deltaY = e.deltaY;
            const absDeltaY = Math.abs(deltaY);
            const isScrollingDown = deltaY > 0;
            const isScrollingUp = deltaY < 0;

            // Use higher threshold right after lock expires to filter inertia
            const threshold = justUnlockedRef.current ? POST_LOCK_THRESHOLD : SCROLL_THRESHOLD;

            // After first event, reset justUnlocked flag
            if (justUnlockedRef.current) {
                justUnlockedRef.current = false;
            }

            // Check if scroll exceeds threshold
            if (absDeltaY < threshold) {
                return;
            }

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
