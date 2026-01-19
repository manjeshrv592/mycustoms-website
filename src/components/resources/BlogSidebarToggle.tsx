"use client";

import { ReactNode } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import PrimaryButton from "../custom-ui/PrimaryButton";

interface BlogSidebarToggleProps {
  nextBlogPreview: ReactNode;
  allBlogsList: ReactNode;
}

/**
 * Client component that toggles between next blog preview and all blogs list
 * Uses URL search params to persist state across navigation
 */
export default function BlogSidebarToggle({
  nextBlogPreview,
  allBlogsList,
}: BlogSidebarToggleProps) {
  const searchParams = useSearchParams();

  // Check if list view is active from URL params
  const showAllBlogs = searchParams.get("view") === "list";

  return (
    <>
      {/* Toggle between views - content only, button is placed separately */}
      {showAllBlogs ? allBlogsList : nextBlogPreview}
    </>
  );
}

/**
 * Toggle button to switch between next blog preview and all blogs list
 * Place this where you want the button to appear
 */
export function BlogViewToggleButton() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const showAllBlogs = searchParams.get("view") === "list";

  const toggleView = (showList: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (showList) {
      params.set("view", "list");
    } else {
      params.delete("view");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <PrimaryButton
      className="text-xs px-4 py-1 h-auto"
      onClick={() => toggleView(!showAllBlogs)}
    >
      {showAllBlogs ? "View less" : "View all"}
    </PrimaryButton>
  );
}
