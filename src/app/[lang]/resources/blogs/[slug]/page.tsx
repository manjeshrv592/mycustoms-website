import { Suspense } from "react";
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
import BlogSidebarToggle, {
  BlogViewToggleButton,
} from "@/components/resources/BlogSidebarToggle";
import BlogSidebarProvider from "@/components/resources/BlogSidebarProvider";
import HideInListView from "@/components/resources/HideInListView";
import AllBlogsList from "@/components/resources/AllBlogsList";
import SearchableBlogsList from "@/components/resources/SearchableBlogsList";
import BlogKeyboardNavigation from "@/components/resources/BlogKeyboardNavigation";
import { formatTitle } from "@/lib/utils";
import type { BlogData } from "@/sanity/types";
import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

/**
 * Page title: "My Customs | Blogs - {blog title}"
 */
export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const currentLang: Locale = isValidLocale(lang) ? (lang as Locale) : "en";

  const blog = await getBlogBySlug(slug);
  const blogTitle = (
    (blog && getLocalizedValue(blog.title, currentLang)) ||
    ""
  )
    .replace(/\*\*/g, "")
    .trim();

  return {
    title: blogTitle ? `Blogs - ${blogTitle}` : "Blogs",
  };
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
    (b: BlogData) => b.slug.current === slug,
  );
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
  const nextBlog =
    currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  // Get localized values
  const blogTitle = getLocalizedValue(blog.title, currentLang) || "Untitled";
  const { regularPart: blogRegularPart, boldPart: blogBoldPart } =
    formatTitle(blogTitle);
  const blogSummary = getLocalizedValue(blog.summary, currentLang) || "";
  const blogContent = blog.content?.find(
    (c: { _key: string }) => c._key === currentLang,
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

  // Pre-process all blogs for client-side filtering
  const blogsForSearch = allBlogs.map((b: BlogData) => ({
    slug: b.slug.current,
    title: getLocalizedValue(b.title, currentLang) || "Untitled",
    summary: getLocalizedValue(b.summary, currentLang) || "",
    imageUrl: b.image
      ? urlFor(b.image).width(120).height(80).quality(80).url()
      : "/images/resources-bg.jpg",
  }));

  return (
    <Container className="h-full flex flex-col">
      {/* Left/Right arrow key navigation between blogs */}
      <BlogKeyboardNavigation
        prevHref={
          prevBlog ? `/${lang}/resources/blogs/${prevBlog.slug.current}` : null
        }
        nextHref={
          nextBlog ? `/${lang}/resources/blogs/${nextBlog.slug.current}` : null
        }
      />

      {/* Secondary Navigation - Desktop only */}
      <div className="hidden md:block mb-4">
        <ResourcesSecondaryNav currentPage="blogs" lang={currentLang} />
      </div>

      <div className="flex w-full lg:w-[65%] gap-2 flex-col">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-block h-px w-[50px] bg-[#7ED957]">
              &nbsp;
            </span>
            <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
              Resources
            </span>
          </div>
          <div className="text-xs">
            <span className="text-white">
              {String(currentPosition).padStart(2, "0")} /{" "}
              {String(totalBlogs).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* View All Resources - Mobile only */}
        <div className="flex items-center gap-4 mb-2 md:mb-0">
          <Link
            href={`/${lang}/resources`}
            className="text-white text-sm border-b-white border-b md:hidden"
          >
            View All Resources
          </Link>

          <div className="flex gap-4 lg:hidden">
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

      <div className="flex-1 min-h-0">
        <div className="grid lg:grid-cols-[3fr_2fr] xl:grid-cols-[4fr_2fr] xl gap-4 h-full min-h-0">
          {/* Blog Content */}
          <div className=" h-full overflow-y-scroll min-h-0 custom-scrollbar text-white pr-4 leading-loose">
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
                className="w-full h-auto mb-4 xl:h-[250px] object-cover 4xl:h-[20vw]"
                alt={blogTitle}
              />
            )}
            {/* Blog Summary as Quote */}
            {blogSummary && (
              <blockquote className="border-l-2 border-[#3871C1] pl-4 py-1 mb-4 bg-white/5 italic text-white/80">
                {blogSummary}
              </blockquote>
            )}
            {/* Rich content */}
            <div className="text-justify">
              {blogContent && <PortableTextContent value={blogContent} />}
            </div>
          </div>

          {/* Sidebar */}
          <div className="text-white hidden lg:block h-full min-h-0 overflow-hidden">
            <Suspense
              fallback={
                <div className="bg-white/5 backdrop-blur-[10px] h-full w-full rounded-xl px-2 py-2" />
              }
            >
              <BlogSidebarProvider>
                <article className="bg-white/5 backdrop-blur-[10px] h-full w-full rounded-xl px-2 py-2 flex flex-col overflow-hidden">
                  <div className="mb-2 text-right">
                    <BlogViewToggleButton />
                  </div>
                  <div className="flex items-center justify-between gap-2 xl:gap-4">
                    <HideInListView>
                      <div className="flex gap-2 xl:gap-4 items-center">
                        {/* Previous blog */}
                        {prevBlog ? (
                          <Link
                            href={`/${lang}/resources/blogs/${prevBlog.slug.current}`}
                          >
                            <Button
                              size="icon"
                              className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer size-8 [&>svg]:size-4"
                            >
                              <ArrowLeft />
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            size="icon"
                            className="rounded-full bg-[#E5E5E5] text-black opacity-50 cursor-not-allowed size-7 [&>svg]:size-4"
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
                              className="rounded-full bg-[#E5E5E5] text-black hover:bg-[#3871C1] hover:text-white cursor-pointer size-8 [&>svg]:size-4"
                            >
                              <ArrowRight />
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            size="icon"
                            className="rounded-full bg-[#E5E5E5] text-black opacity-50 cursor-not-allowed size-7 [&>svg]:size-4"
                            disabled
                          >
                            <ArrowRight />
                          </Button>
                        )}
                      </div>
                    </HideInListView>
                    <ResourcesSearch lang={lang} />
                  </div>

                  <div className="flex items-end text-[#3871C1] text-xs flex-col">
                    <HideInListView>
                      <div className="text-right">
                        {/* Position */}
                        <div className="text-white text-xs mb-1 mt-2">
                          {String(
                            currentPosition + 1 <= totalBlogs
                              ? currentPosition + 1
                              : currentPosition,
                          ).padStart(2, "0")}{" "}
                          / {String(totalBlogs).padStart(2, "0")}
                        </div>
                        {/* Updated date */}
                        {updatedDate && <div>Updated on - {updatedDate}</div>}
                      </div>
                    </HideInListView>
                    {/* View more/less toggle button */}
                    {/* <div className="self-start">
                      <BlogViewToggleButton />
                    </div> */}
                  </div>

                  {/* Blog sidebar toggle - switches between next blog preview and all blogs list */}
                  <BlogSidebarToggle
                    nextBlogPreview={
                      nextBlog ? (
                        <Link
                          href={`/${lang}/resources/blogs/${nextBlog.slug.current}`}
                          className="flex flex-col flex-1 min-h-0 hover:opacity-80 transition-opacity"
                        >
                          <h3 className="text-[#3871C1] text-[clamp(1rem,calc(1.2vw-0.137rem),100vw)] line-clamp-1">
                            {nextBlogTitle}
                          </h3>
                          <p className="text-xs leading-loose line-clamp-1 2xl:line-clamp-2">
                            {nextBlogSummary}
                          </p>
                          <Image
                            src={nextBlogImageUrl}
                            width={600}
                            height={700}
                            className="w-full flex-1 min-h-0 object-cover rounded-lg"
                            alt={nextBlogTitle}
                          />
                        </Link>
                      ) : (
                        <div className="text-center text-[#716B6D] mt-4">
                          No more blogs
                        </div>
                      )
                    }
                    allBlogsList={
                      <SearchableBlogsList
                        blogs={blogsForSearch}
                        lang={currentLang}
                        currentSlug={slug}
                      />
                    }
                  />
                </article>
              </BlogSidebarProvider>
            </Suspense>
          </div>
        </div>
      </div>
    </Container>
  );
}
