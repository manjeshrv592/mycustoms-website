"use client";

import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";

interface HideInListViewProps {
  children: ReactNode;
}

/**
 * Wrapper that hides children when in list view (?view=list)
 * Keeps the page as server component while conditionally hiding content
 */
export default function HideInListView({ children }: HideInListViewProps) {
  const searchParams = useSearchParams();
  const isListView = searchParams.get("view") === "list";

  if (isListView) return null;

  return <>{children}</>;
}
