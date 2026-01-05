"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  id: string;
  title: string;
  summary: string;
  slug: string;
  categorySlug: string;
  categoryTitle: string;
}

interface ResourcesSearchProps {
  lang: string;
}

/**
 * Debounce hook for search input
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ResourcesSearch({ lang }: ResourcesSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce the search query (300ms delay)
  const debouncedQuery = useDebounce(query, 300);

  // Search function
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}&lang=${lang}&limit=5`
        );
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [lang]
  );

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, performSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  // Handle result click
  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const showDropdown =
    isOpen && (results.length > 0 || (query.length >= 2 && !isLoading));

  return (
    <div className="bg-[#3871C1] p-1 rounded-full" ref={containerRef}>
      <div className="flex items-center relative">
        <Input
          className="bg-white rounded-full text-neutral-800"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
        />
        <Button
          size="icon"
          className="rounded-full bg-transparent hover:bg-transparent cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Search className="size-5" />
          )}
        </Button>

        {/* Search Results Dropdown */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-black/90 backdrop-blur-[20px] overflow-hidden z-50 shadow-lg">
            {results.length > 0 ? (
              <ul className="py-2">
                {results.map((result) => (
                  <li key={result.id}>
                    <Link
                      href={`/${lang}/resources/${result.categorySlug}/${result.slug}`}
                      onClick={handleResultClick}
                      className="block px-4 py-2 hover:bg-white/10 transition-colors"
                    >
                      <div className="text-white text-xs truncate">
                        {result.title}
                      </div>
                      <div className="text-gray-400 text-[10px] truncate">
                        {result.categoryTitle}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : query.length >= 2 && !isLoading ? (
              <div className="px-4 py-3 text-gray-400 text-sm text-center">
                No results found
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
