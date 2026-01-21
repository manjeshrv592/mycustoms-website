"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { useWheel, useDrag } from "@use-gesture/react";
import { useNavigation } from "@/context/NavigationContext";

/**
 * SwipeNavigator - Enables swipe/scroll navigation between pages
 * - Mouse wheel / Trackpad scroll (desktop)
 * - Touch swipe (mobile)
 * 
 * Swipe up / scroll down → Next page (forward)
 * Swipe down / scroll up → Previous page (backward)
 */
export default function SwipeNavigator() {
    const pathname = usePathname();
    const router = useTransitionRouter();
    const { setNavigationDirection, getNextPath, getPrevPath } = useNavigation();

    // Navigation lock to prevent rapid-fire transitions
    const isNavigating = useRef(false);
    const lastNavigationTime = useRef(0);

    // Get current locale from pathname
    const locale = pathname.split("/")[1] || "en";

    // Wheel accumulator for trackpad (which sends many small events)
    const wheelAccumulator = useRef(0);
    const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

    // Navigate to next or previous page
    const navigate = useCallback(
        (direction: "next" | "prev") => {
            const now = Date.now();
            const timeSinceLastNav = now - lastNavigationTime.current;

            console.log(`[NAV] navigate(${direction}) called`, {
                isNavigating: isNavigating.current,
                timeSinceLastNav,
                lockTime: 1200,
            });

            // Prevent navigation if already navigating or too soon after last navigation
            // Use a longer lock time (1200ms) to prevent multi-page skips on fast swipes
            if (isNavigating.current || timeSinceLastNav < 1200) {
                console.log(`[NAV] BLOCKED - isNavigating: ${isNavigating.current}, timeSinceLastNav: ${timeSinceLastNav}ms`);
                return;
            }

            const targetPath =
                direction === "next" ? getNextPath(locale) : getPrevPath(locale);

            if (!targetPath) {
                console.log(`[NAV] At boundary, no target path`);
                return; // At boundary, can't navigate
            }

            console.log(`[NAV] NAVIGATING to ${targetPath}`);
            isNavigating.current = true;
            lastNavigationTime.current = now;

            // Reset wheel accumulator immediately to prevent queued navigations
            wheelAccumulator.current = 0;
            if (wheelTimeout.current) {
                clearTimeout(wheelTimeout.current);
                wheelTimeout.current = null;
            }

            // Set navigation direction for animation
            setNavigationDirection(targetPath);

            // Navigate after a tiny delay to let direction be set
            setTimeout(() => {
                router.push(targetPath);

                // Reset navigation lock after transition animation completes
                setTimeout(() => {
                    console.log(`[NAV] Lock released after 800ms`);
                    isNavigating.current = false;
                }, 800);
            }, 10);
        },
        [locale, getNextPath, getPrevPath, setNavigationDirection, router]
    );

    // Check if an element or its parents are scrollable
    const isScrollableElement = useCallback((element: HTMLElement | null): boolean => {
        if (!element) return false;

        let current: HTMLElement | null = element;
        while (current && current !== document.body) {
            const style = window.getComputedStyle(current);
            const overflowY = style.overflowY;
            const isScrollable =
                (overflowY === "auto" || overflowY === "scroll") &&
                current.scrollHeight > current.clientHeight;

            if (isScrollable) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }, []);

    // Check if element is at scroll boundary
    const isAtScrollBoundary = useCallback(
        (element: HTMLElement | null, direction: "up" | "down"): boolean => {
            if (!element) return true;

            let current: HTMLElement | null = element;
            while (current && current !== document.body) {
                const style = window.getComputedStyle(current);
                const overflowY = style.overflowY;
                const isScrollable =
                    (overflowY === "auto" || overflowY === "scroll") &&
                    current.scrollHeight > current.clientHeight;

                if (isScrollable) {
                    if (direction === "up") {
                        // At top boundary if scrollTop is 0
                        return current.scrollTop <= 0;
                    } else {
                        // At bottom boundary if scrolled to end
                        return (
                            current.scrollTop + current.clientHeight >=
                            current.scrollHeight - 5
                        );
                    }
                }
                current = current.parentElement;
            }
            return true;
        },
        []
    );

    // Handle wheel events (mouse/trackpad)
    useWheel(
        ({ event, delta: [, deltaY], active }) => {
            const target = event.target as HTMLElement;
            const now = Date.now();
            const timeSinceLastNav = now - lastNavigationTime.current;

            // COMPLETELY IGNORE wheel events while navigation is locked
            // This prevents accumulation during transition momentum
            if (isNavigating.current || timeSinceLastNav < 1200) {
                console.log(`[WHEEL] IGNORED - locked (isNavigating: ${isNavigating.current}, timeSince: ${timeSinceLastNav}ms)`);
                // Reset accumulator to clear any momentum
                wheelAccumulator.current = 0;
                return;
            }

            // Determine scroll direction
            const isScrollingDown = deltaY > 0;
            const direction = isScrollingDown ? "down" : "up";

            // If inside scrollable element and not at boundary, let it scroll
            if (isScrollableElement(target) && !isAtScrollBoundary(target, direction)) {
                return;
            }

            // Accumulate wheel delta (trackpads send many small events)
            wheelAccumulator.current += deltaY;

            // Clear previous timeout
            if (wheelTimeout.current) {
                clearTimeout(wheelTimeout.current);
            }

            // Set timeout to reset accumulator if wheel stops
            wheelTimeout.current = setTimeout(() => {
                wheelAccumulator.current = 0;
            }, 150);

            // Trigger navigation when accumulated delta exceeds threshold
            const threshold = 100;
            console.log(`[WHEEL] deltaY: ${deltaY}, accumulator: ${wheelAccumulator.current}, threshold: ${threshold}`);

            if (Math.abs(wheelAccumulator.current) > threshold) {
                console.log(`[WHEEL] Threshold exceeded, triggering navigation`);
                if (wheelAccumulator.current > 0) {
                    navigate("next"); // Scroll down → next page
                } else {
                    navigate("prev"); // Scroll up → prev page
                }
                wheelAccumulator.current = 0;
            }
        },
        {
            target: typeof window !== "undefined" ? window : undefined,
            eventOptions: { passive: false },
        }
    );

    // Handle touch swipe (mobile)
    useDrag(
        ({ swipe: [, swipeY], direction: [, dirY], distance: [, distY], event }) => {
            const target = event.target as HTMLElement;

            // Only trigger on vertical swipes with enough distance
            if (Math.abs(distY) < 50) return;

            // Determine swipe direction
            const isSwipingUp = dirY < 0;
            const scrollDirection = isSwipingUp ? "down" : "up";

            // If inside scrollable element and not at boundary, let it scroll
            if (
                isScrollableElement(target) &&
                !isAtScrollBoundary(target, scrollDirection)
            ) {
                return;
            }

            // Navigate based on swipe direction
            if (swipeY === -1 || (dirY < 0 && distY > 100)) {
                // Swipe up → next page
                navigate("next");
            } else if (swipeY === 1 || (dirY > 0 && distY > 100)) {
                // Swipe down → prev page
                navigate("prev");
            }
        },
        {
            target: typeof window !== "undefined" ? window : undefined,
            filterTaps: true,
            threshold: 50,
        }
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (wheelTimeout.current) {
                clearTimeout(wheelTimeout.current);
            }
        };
    }, []);

    // This component doesn't render anything
    return null;
}
