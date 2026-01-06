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

/**
 * Page order for navigation direction calculation
 * Lower index = earlier in navigation hierarchy
 */
const PAGE_ORDER = [
  "/", // 0 - Home
  "/services", // 1 - Services (includes /services/*)
  "/portal", // 2 - Portal
  "/resources", // 3 - Resources (includes /resources/*/*)
  "/about", // 4 - About
  "/contact", // 5 - Contact
];

type NavigationDirection = "forward" | "backward" | "none";

interface NavigationContextType {
  direction: NavigationDirection;
  setNavigationDirection: (targetPath: string) => void;
  currentPageIndex: number;
  isScrollLocked: boolean;
  lockScroll: () => void;
  unlockScroll: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

/**
 * Get page index from path (handles dynamic routes)
 */
function getPageIndex(path: string): number {
  // Remove locale prefix (e.g., /en, /nl)
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
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const unlockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update current page index when pathname changes
  useEffect(() => {
    const newIndex = getPageIndex(pathname);
    setCurrentPageIndex(newIndex);

    // Reset direction after navigation completes
    const timer = setTimeout(() => {
      setDirection("none");
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  const lockScroll = useCallback(() => {
    console.log("[NavContext] Locking scroll");
    setIsScrollLocked(true);

    // Clear any existing unlock timer
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
    }

    // Auto-unlock after 1 second (500ms animation + 500ms buffer)
    unlockTimerRef.current = setTimeout(() => {
      console.log("[NavContext] Auto-unlocking scroll");
      setIsScrollLocked(false);
    }, 1000);
  }, []);

  const unlockScroll = useCallback(() => {
    console.log("[NavContext] Manually unlocking scroll");
    setIsScrollLocked(false);
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
    }
  }, []);

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

  // Set CSS custom property for direction-based animations
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
        currentPageIndex,
        isScrollLocked,
        lockScroll,
        unlockScroll,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}

export { getPageIndex, PAGE_ORDER };
