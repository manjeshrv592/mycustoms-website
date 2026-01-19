"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useBlogSearch } from "@/context/BlogSearchContext";

interface BlogItem {
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
}

interface SearchableBlogsListProps {
  blogs: BlogItem[];
  lang: string;
  currentSlug: string;
}

/**
 * Client-side searchable blog list
 * Filters the passed blog items based on search query from context
 */
export default function SearchableBlogsList({
  blogs,
  lang,
  currentSlug,
}: SearchableBlogsListProps) {
  const { searchQuery } = useBlogSearch();

  // Check if actively searching
  const isSearching = searchQuery.length >= 2;

  // Filter blogs client-side based on query from context
  const filteredBlogs = useMemo(() => {
    if (!isSearching) return blogs;
    const lowerQuery = searchQuery.toLowerCase();
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(lowerQuery) ||
        blog.summary.toLowerCase().includes(lowerQuery),
    );
  }, [blogs, searchQuery, isSearching]);

  return (
    <div className="flex flex-col gap-1 overflow-y-auto flex-1 min-h-0 custom-scrollbar pr-2 mt-2">
      {/* Search results indicator */}
      {isSearching && (
        <div className="flex items-center gap-2 text-[#3871C1] text-xs py-1 border-b border-white/10 mb-1">
          <Search className="size-3" />
          <span>
            Showing {filteredBlogs.length} result
            {filteredBlogs.length !== 1 ? "s" : ""} for &quot;{searchQuery}
            &quot;
          </span>
        </div>
      )}

      {filteredBlogs.length > 0 ? (
        filteredBlogs.map((blog) => {
          const isCurrentBlog = blog.slug === currentSlug;
          return (
            <Link
              key={blog.slug}
              href={`/${lang}/resources/blogs/${blog.slug}?view=list`}
              className={`flex gap-2 p-1 rounded-sm transition-colors hover:bg-white/10 ${
                isCurrentBlog ? "bg-white/10 border border-[#3871C1]/50" : ""
              }`}
            >
              {/* Thumbnail */}
              <Image
                src={blog.imageUrl}
                width={60}
                height={45}
                className="w-[60px] h-[45px] object-cover rounded shrink-0"
                alt={blog.title}
              />
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-[#3871C1] text-xs font-medium line-clamp-1">
                  {blog.title}
                </h4>
                <p className="text-white/70 text-[10px] line-clamp-2 leading-relaxed">
                  {blog.summary}
                </p>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="text-center text-gray-400 py-4 text-xs">
          No blogs found for &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
