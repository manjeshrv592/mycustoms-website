"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface DesktopRedirectProps {
  targetUrl: string;
}

/**
 * Client component that redirects to target URL only on desktop (md+) screens.
 * Uses matchMedia to detect screen size and router.replace for navigation.
 * Renders nothing - the parent component handles showing appropriate UI.
 */
export default function DesktopRedirect({ targetUrl }: DesktopRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if screen is md or larger (768px)
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    if (mediaQuery.matches) {
      // Desktop - redirect to target URL
      router.replace(targetUrl);
    }

    // Optional: Handle resize (in case user resizes window)
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        router.replace(targetUrl);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [router, targetUrl]);

  // This component renders nothing - parent handles UI
  return null;
}
