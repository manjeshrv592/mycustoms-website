import Image from "next/image";
import Link from "next/link";
import { getLocalizedValue } from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import type { Locale } from "@/i18n";
import type { BlogData } from "@/sanity/types";

interface AllBlogsListProps {
  allBlogs: BlogData[];
  lang: Locale;
  currentSlug: string;
}

/**
 * Server component that renders a scrollable list of all blogs
 * Used in the blog sidebar when "Show more" is clicked
 */
export default function AllBlogsList({
  allBlogs,
  lang,
  currentSlug,
}: AllBlogsListProps) {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-0 custom-scrollbar pr-2">
      {allBlogs.map((blog) => {
        const title = getLocalizedValue(blog.title, lang) || "Untitled";
        const summary = getLocalizedValue(blog.summary, lang) || "";
        const imageUrl = blog.image
          ? urlFor(blog.image).width(120).height(80).quality(80).url()
          : "/images/resources-bg.jpg";
        const isCurrentBlog = blog.slug.current === currentSlug;

        return (
          <Link
            key={blog.slug.current}
            href={`/${lang}/resources/blogs/${blog.slug.current}?view=list`}
            className={`flex gap-2 p-2 rounded-lg transition-colors hover:bg-white/10 ${
              isCurrentBlog ? "bg-white/10 border border-[#3871C1]/50" : ""
            }`}
          >
            {/* Thumbnail */}
            <Image
              src={imageUrl}
              width={60}
              height={45}
              className="w-[60px] h-[45px] object-cover rounded shrink-0"
              alt={title}
            />
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[#3871C1] text-xs font-medium line-clamp-1">
                {title}
              </h4>
              <p className="text-white/70 text-[10px] line-clamp-2 leading-relaxed">
                {summary}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
