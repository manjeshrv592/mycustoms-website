"use client";

import { ReactNode } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    <Button
      variant="ghost"
      size="sm"
      onClick={() => toggleView(!showAllBlogs)}
      className="cursor-pointer text-[#3871C1] gap-2 hover:bg-transparent hover:text-[#3871C1] hover:opacity-70 transition-opacity !px-0"
    >
      {showAllBlogs ? (
        <>
          <ArrowRight className="size-4" />
          <span>View less</span>
        </>
      ) : (
        <>
          <ArrowLeft className="size-4" />
          <span>View more</span>
        </>
      )}
    </Button>
  );
}
