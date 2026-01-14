"use client";

import { useEffect } from "react";

/**
 * Conditionally loads the View Transitions polyfill for browsers
 * that don't support the native View Transitions API (Safari < 18, older iPads)
 */
export default function PolyfillLoader() {
  useEffect(() => {
    if (typeof document !== "undefined" && !document.startViewTransition) {
      import("view-transitions-polyfill");
    }
  }, []);

  return null;
}
