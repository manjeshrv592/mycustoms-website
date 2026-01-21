"use client";

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import { usePathname } from "next/navigation";

/**
 * Page order for navigation direction calculation
 * Lower index = earlier in navigation hierarchy
 */
const PAGE_ORDER = [
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
}

const NavigationContext = createContext<NavigationContextType | null>(null);

/**
 * Get page index from path (handles dynamic routes and locale prefixes)
 */
function getPageIndex(path: string): number {
    // Remove locale prefix (e.g., /en, /nl, /de, /cn)
    const pathWithoutLocale = path.replace(/^\/(en|nl|de|cn)/, "") || "/";

    // Check for exact match first
    const exactIndex = PAGE_ORDER.indexOf(pathWithoutLocale);
    if (exactIndex !== -1) return exactIndex;

    // Check for prefix matches (for dynamic routes like /services/slug)
    for (let i = PAGE_ORDER.length - 1; i >= 0; i--) {
        if (pathWithoutLocale.startsWith(PAGE_ORDER[i]) && PAGE_ORDER[i] !== "/") {
            return i;
        }
    }

    // Default to home if no match
    return 0;
}

/**
 * NavigationProvider - Tracks navigation direction for page transitions
 * This is a client component but doesn't affect SSG of child pages
 */
export function NavigationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [direction, setDirection] = useState<NavigationDirection>("none");
    const [currentPageIndex, setCurrentPageIndex] = useState(() =>
        getPageIndex(pathname)
    );

    // Update current page index when pathname changes
    useEffect(() => {
        const newIndex = getPageIndex(pathname);
        setCurrentPageIndex(newIndex);

        // Reset direction after transition completes
        const timer = setTimeout(() => {
            setDirection("none");
        }, 400);

        return () => clearTimeout(timer);
    }, [pathname]);

    // Set navigation direction based on target path
    const setNavigationDirection = useCallback(
        (targetPath: string) => {
            const targetIndex = getPageIndex(targetPath);

            if (targetIndex > currentPageIndex) {
                setDirection("forward");
            } else if (targetIndex < currentPageIndex) {
                setDirection("backward");
            } else {
                setDirection("none");
            }
        },
        [currentPageIndex]
    );

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
