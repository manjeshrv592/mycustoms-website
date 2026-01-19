"use client";

import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { BlogSearchProvider } from "@/context/BlogSearchContext";

interface BlogSidebarProviderProps {
  children: ReactNode;
}

/**
 * Wrapper that provides BlogSearchContext to the entire sidebar
 * Reads isListView from URL params
 */
export default function BlogSidebarProvider({
  children,
}: BlogSidebarProviderProps) {
  const searchParams = useSearchParams();
  const isListView = searchParams.get("view") === "list";

  return (
    <BlogSearchProvider isListView={isListView}>{children}</BlogSearchProvider>
  );
}
