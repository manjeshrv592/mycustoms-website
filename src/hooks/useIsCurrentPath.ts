"use client";

import { usePathname } from "next/navigation";

/**
 * Custom hook to check if the current path matches the given pathname
 * @param targetPath - The path to check against (e.g., "/", "/services")
 * @returns boolean - true if current path matches targetPath, false otherwise
 */
export function useIsCurrentPath(targetPath: string): boolean {
  const pathname = usePathname();
  return pathname === targetPath;
}
