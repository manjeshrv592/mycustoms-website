import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogBySlug, getAllBlogs, getAllBlogSlugs } from "@/sanity/queries";
import { getLocalizedValue } from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { locales, isValidLocale, type Locale } from "@/i18n";
import PortableTextContent from "@/components/sanity/PortableTextContent";
import ResourcesSecondaryNav from "@/components/resources/ResourcesSecondaryNav";
import ResourcesSearch from "@/components/resources/ResourcesSearch";
import { formatTitle } from "@/lib/utils";
import type { BlogData } from "@/sanity/types";

interface BlogPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

// Generate static params for all locales and blog slugs
export async function generateStaticParams() {
  const blogSlugs = await getAllBlogSlugs();

  const params: { lang: string; slug: string }[] = [];

  for (const lang of locales) {
    for (const slug of blogSlugs) {
      params.push({ lang, slug });
    }
  }

  return params;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  // Fetch blog and all blogs for navigation
  const [blog, allBlogs] = await Promise.all([
    getBlogBySlug(slug),
    getAllBlogs(),
  ]);

  if (!blog) {
    notFound();
  }

  // Find current blog index and get prev/next
  const currentIndex = allBlogs.findIndex(
    (b: BlogData) => b.slug.current === slug
  );
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextBlog =
    currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  // Get localized values
  const blogTitle = getLocalizedValue(blog.title, currentLang) || "Untitled";
  const { regularPart: blogRegularPart, boldPart: blogBoldPart } =
    formatTitle(blogTitle);
  const blogContent = blog.content?.find(
    (c: { _key: string }) => c._key === currentLang
  )?.value;

  // Next blog info
  const nextBlogTitle = nextBlog
    ? getLocalizedValue(nextBlog.title, currentLang) || ""
    : "";
  const nextBlogSummary = nextBlog
    ? getLocalizedValue(nextBlog.summary, currentLang) || ""
    : "";
  const nextBlogImageUrl = nextBlog?.image
    ? urlFor(nextBlog.image).width(600).height(400).quality(85).url()
    : "/images/resources-bg.jpg";

  // Format date
  const updatedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString("en-GB")
    : "";

  // Current position
  const currentPosition = currentIndex + 1;
  const totalBlogs = allBlogs.length;

  // Current blog featured image
  const blogImageUrl = blog.image
    ? urlFor(blog.image).width(800).height(400).quality(85).url()
    : null;

  return (
    <Container className="h-full flex flex-col">
      {/* Secondary Navigation - Desktop only */}
      <div className="hidden md:block">
        <ResourcesSecondaryNav currentPage="blogs" lang={currentLang} />
      </div>

      <div className="flex md:w-[65%] gap-2 flex-col mt-2">
        <div className="flex items-center gap-4">
          <span className="inline-block h-px w-[50px] bg-[#7ED957]">
            &nbsp;
          </span>
          <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
            Resources
          </span>
        </div>
        {/* View All Resources - Mobile only */}
        <div className="flex items-center gap-4 mb-2">
          <Link
            href={`/${lang}/resources`}
            className="text-white text-sm border-b-white border-b md:hidden"
          >
            View All Resources
          </Link>

          <div className="ml-auto">
            <span className="text-white">
              {String(currentPosition).padStart(2, "0")} /{" "}
              {String(totalBlogs).padStart(2, "0")}
            </span>
          </div>
          <div className="flex gap-4 md:hidden">
            {/* Previous blog */}
            {prevBlog ? (
              <Link href={`/${lang}/resources/blogs/${prevBlog.slug.current}`}>
                <Button
                  size="icon"
                  className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer size-8"
                >
                  <ArrowLeft />
                </Button>
              </Link>
            ) : (
              <Button
                size="icon"
                className="rounded-full bg-[#E5E5E5] text-black opacity-50 cursor-not-allowed size-8"
                disabled
              >
                <ArrowLeft />
              </Button>
            )}
            {/* Next blog */}
            {nextBlog ? (
              <Link href={`/${lang}/resources/blogs/${nextBlog.slug.current}`}>
                <Button
                  size="icon"
                  className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer size-8"
                >
                  <ArrowRight />
                </Button>
              </Link>
            ) : (
              <Button
                size="icon"
                className="rounded-full bg-[#E5E5E5] text-black opacity-50 cursor-not-allowed size-8"
                disabled
              >
                <ArrowRight />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 ">
        <div className="grid md:grid-cols-[2fr_1fr] gap-4 h-full min-h-0">
          {/* Blog Content */}
          <div className=" h-full overflow-y-scroll min-h-0 custom-scrollbar text-white pr-4 leading-loose  text-xs">
            {/* Blog title */}
            <h1 className="h1 text-white font-grift mb-2">
              {blogRegularPart && (
                <span className="font-light">{blogRegularPart} </span>
              )}
              <span className="font-bold">{blogBoldPart}</span>
            </h1>
            {/* Featured image */}
            {blogImageUrl && (
              <Image
                src={blogImageUrl}
                width={800}
                height={400}
                className="w-full h-auto mb-4 xl:h-[300px] object-cover"
                alt={blogTitle}
              />
            )}
            {/* Rich content */}
            <div className="text-justify">
              {blogContent && <PortableTextContent value={blogContent} />}
            </div>
          </div>

          {/* Sidebar */}
          <div className="text-white hidden md:block">
            <article className="bg-white/5 backdrop-blur-[10px] h-full w-full rounded-xl px-2 py-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  {/* Previous blog */}
                  {prevBlog ? (
                    <Link
                      href={`/${lang}/resources/blogs/${prevBlog.slug.current}`}
                    >
                      <Button
                        size="icon"
                        className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer"
                      >
                        <ArrowLeft />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="icon"
                      className="rounded-full bg-[#E5E5E5] text-black opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <ArrowLeft />
                    </Button>
                  )}
                  {/* Next blog */}
                  {nextBlog ? (
                    <Link
                      href={`/${lang}/resources/blogs/${nextBlog.slug.current}`}
                    >
                      <Button
                        size="icon"
                        className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer"
                      >
                        <ArrowRight />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="icon"
                      className="rounded-full bg-[#E5E5E5] text-black opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <ArrowRight />
                    </Button>
                  )}
                </div>
                <ResourcesSearch lang={lang} />
              </div>

              <div className="text-right text-[#3871C1] text-xs">
                {/* Position */}
                <div className="text-white text-sm mb-1 mt-2">
                  {String(
                    currentPosition + 1 <= totalBlogs
                      ? currentPosition + 1
                      : currentPosition
                  ).padStart(2, "0")}{" "}
                  / {String(totalBlogs).padStart(2, "0")}
                </div>
                {/* Updated date */}
                {updatedDate && <div>Updated on - {updatedDate}</div>}
              </div>

              {/* Next blog preview */}
              {nextBlog ? (
                <>
                  <h3 className="text-[#3871C1] mb-2 text-[clamp(1rem,calc(1.2vw-0.137rem),100vw)] 2xl:line-clamp-2 line-clamp-1">
                    {nextBlogTitle}
                  </h3>
                  <p className="text-xs mb-2 leading-loose line-clamp-1 2xl:line-clamp-4">
                    {nextBlogSummary}
                  </p>
                  <Image
                    src={nextBlogImageUrl}
                    width={600}
                    height={700}
                    className="w-full h-[200px] object-cover mb-2"
                    alt={nextBlogTitle}
                  />
                  <Link
                    href={`/${lang}/resources/blogs/${nextBlog.slug.current}`}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer self-start text-[#3871C1]"
                    >
                      <ArrowLeft />
                      <span className="text-[#3871C1]">Show more</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="text-center text-[#716B6D] mt-4">
                  No more blogs
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </Container>
  );
}
