"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BlogSearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isListView: boolean;
}

const BlogSearchContext = createContext<BlogSearchContextType | undefined>(
  undefined,
);

export function BlogSearchProvider({
  children,
  isListView,
}: {
  children: ReactNode;
  isListView: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BlogSearchContext.Provider
      value={{ searchQuery, setSearchQuery, isListView }}
    >
      {children}
    </BlogSearchContext.Provider>
  );
}

export function useBlogSearch() {
  const context = useContext(BlogSearchContext);
  if (!context) {
    throw new Error("useBlogSearch must be used within BlogSearchProvider");
  }
  return context;
}
