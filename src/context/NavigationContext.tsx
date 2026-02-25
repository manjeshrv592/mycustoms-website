"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";

/**
 * Page order for navigation direction calculation
 * Lower index = earlier in navigation hierarchy
 */
export const PAGE_ORDER = [
    "/", // 0 - Home
    "/services", // 1 - Services (includes /services/*)
    "/portal", // 2 - Portal
    "/resources", // 3 - Resources (includes /resources/*)
    "/about", // 4 - About
    "/contact", // 5 - Contact
];

type NavigationDirection = "forward" | "backward" | "none";

interface NavigationContextType {
    direction: NavigationDirection;
    setNavigationDirection: (targetPath: string) => void;
    navigateToPage: (direction: "next" | "prev") => void;
    isNavigating: boolean;
    currentPageIndex: number;
}

interface NavigationProviderProps {
    children: React.ReactNode;
    firstServiceSlug?: string | null;
    firstBlogSlug?: string | null;
    isPortalActive?: boolean;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

// Cooldown duration in milliseconds (prevents rapid navigation) - matches animation
const NAVIGATION_COOLDOWN = 350;

/**
 * Get page index from path (handles dynamic routes and locale prefixes)
 */
function getPageIndex(path: string, pageOrder: string[] = PAGE_ORDER): number {
    // Remove locale prefix (e.g., /en, /nl, /de, /cn)
    const pathWithoutLocale = path.replace(/^\/(en|nl|de|cn)/, "") || "/";

    // Check for exact match first
    const exactIndex = pageOrder.indexOf(pathWithoutLocale);
    if (exactIndex !== -1) return exactIndex;

    // Check for prefix matches (for dynamic routes like /services/slug)
    for (let i = pageOrder.length - 1; i >= 0; i--) {
        if (pathWithoutLocale.startsWith(pageOrder[i]) && pageOrder[i] !== "/") {
            return i;
        }
    }

    // Default to home if no match
    return 0;
}

/**
 * Get locale from path
 */
function getLocale(path: string): string {
    const match = path.match(/^\/(en|nl|de|cn)/);
    return match ? match[1] : "en";
}

/**
 * NavigationProvider - Tracks navigation direction for page transitions
 * This is a client component but doesn't affect SSG of child pages
 */
export function NavigationProvider({
    children,
    firstServiceSlug,
    firstBlogSlug,
    isPortalActive,
}: NavigationProviderProps) {
    const pathname = usePathname();
    const router = useTransitionRouter();
    const [direction, setDirection] = useState<NavigationDirection>("none");
    const [isNavigating, setIsNavigating] = useState(false);

    // Filter out /portal from navigation when inactive
    const effectivePageOrder = React.useMemo(
        () => isPortalActive === false
            ? PAGE_ORDER.filter((p) => p !== "/portal")
            : PAGE_ORDER,
        [isPortalActive]
    );

    const [currentPageIndex, setCurrentPageIndex] = useState(() =>
        getPageIndex(pathname, effectivePageOrder)
    );
    const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Build dynamic default paths based on props
    const getDefaultPath = useCallback((pageKey: string): string => {
        switch (pageKey) {
            case "/":
                return "/";
            case "/services":
                return firstServiceSlug ? `/services/${firstServiceSlug}` : "/services";
            case "/portal":
                return "/portal";
            case "/resources":
                return firstBlogSlug ? `/resources/blogs/${firstBlogSlug}` : "/resources";
            case "/about":
                return "/about";
            case "/contact":
                return "/contact";
            default:
                return pageKey;
        }
    }, [firstServiceSlug, firstBlogSlug]);

    // Update current page index when pathname changes
    useEffect(() => {
        const newIndex = getPageIndex(pathname, effectivePageOrder);
        setCurrentPageIndex(newIndex);

        // Reset direction after transition completes
        const timer = setTimeout(() => {
            setDirection("none");
        }, 400);

        return () => clearTimeout(timer);
    }, [pathname, effectivePageOrder]);

    // Set navigation direction based on target path
    const setNavigationDirection = useCallback(
        (targetPath: string) => {
            const targetIndex = getPageIndex(targetPath, effectivePageOrder);

            if (targetIndex > currentPageIndex) {
                setDirection("forward");
            } else if (targetIndex < currentPageIndex) {
                setDirection("backward");
            } else {
                setDirection("none");
            }
        },
        [currentPageIndex, effectivePageOrder]
    );

    // Programmatic navigation to next/prev page
    const navigateToPage = useCallback(
        (navDirection: "next" | "prev") => {
            // Don't navigate if already navigating (cooldown active)
            if (isNavigating) return;

            const locale = getLocale(pathname);
            let targetIndex: number;

            if (navDirection === "next") {
                targetIndex = currentPageIndex + 1;
                if (targetIndex >= effectivePageOrder.length) return; // Already at last page
            } else {
                targetIndex = currentPageIndex - 1;
                if (targetIndex < 0) return; // Already at first page
            }

            // Get the target page path using dynamic paths
            const targetPageKey = effectivePageOrder[targetIndex];
            const targetPath = getDefaultPath(targetPageKey);
            const fullPath = `/${locale}${targetPath}`;

            // Set navigation state
            setIsNavigating(true);
            setDirection(navDirection === "next" ? "forward" : "backward");

            // Clear any existing cooldown timer
            if (cooldownTimerRef.current) {
                clearTimeout(cooldownTimerRef.current);
            }

            // Navigate to the target page
            router.push(fullPath);

            // Set cooldown timer
            cooldownTimerRef.current = setTimeout(() => {
                setIsNavigating(false);
            }, NAVIGATION_COOLDOWN);
        },
        [currentPageIndex, isNavigating, pathname, router, getDefaultPath, effectivePageOrder]
    );

    // Cleanup cooldown timer on unmount
    useEffect(() => {
        return () => {
            if (cooldownTimerRef.current) {
                clearTimeout(cooldownTimerRef.current);
            }
        };
    }, []);

    // Set CSS data attribute for direction-based animations
    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.dataset.navDirection = direction;
        }
    }, [direction]);

    return (
        <NavigationContext.Provider
            value={{
                direction,
                setNavigationDirection,
                navigateToPage,
                isNavigating,
                currentPageIndex,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
}

/**
 * Hook to access navigation context
 */
export function useNavigation() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error("useNavigation must be used within NavigationProvider");
    }
    return context;
}
