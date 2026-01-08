import Container from "@/components/layouts/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticlesByCategory,
  getAllArticleSlugsWithCategories,
  getAllResourceCategories,
} from "@/sanity/queries";
import { getLocalizedValue } from "@/sanity/lib/localization";
import { urlFor } from "@/sanity/lib/image";
import { locales, isValidLocale, type Locale } from "@/i18n";
import PortableTextContent from "@/components/sanity/PortableTextContent";
import ResourcesSecondaryNav from "@/components/resources/ResourcesSecondaryNav";
import ResourcesSearch from "@/components/resources/ResourcesSearch";
import { formatTitle } from "@/lib/utils";

interface ArticlePageProps {
  params: Promise<{ lang: string; category: string; slug: string }>;
}

// Generate static params for all locales, categories, and articles
export async function generateStaticParams() {
  const articleSlugs = await getAllArticleSlugsWithCategories();

  const params: { lang: string; category: string; slug: string }[] = [];

  for (const lang of locales) {
    for (const article of articleSlugs) {
      if (article.categorySlug && article.articleSlug) {
        params.push({
          lang,
          category: article.categorySlug,
          slug: article.articleSlug,
        });
      }
    }
  }

  return params;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang, category, slug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const currentLang = lang as Locale;

  // Fetch article and all articles in category for navigation
  const [article, categoryArticles, categories] = await Promise.all([
    getArticleBySlug(slug),
    getArticlesByCategory(category),
    getAllResourceCategories(),
  ]);

  if (!article) {
    notFound();
  }

  // Find current article index and get prev/next
  const currentIndex = categoryArticles.findIndex(
    (a) => a.slug.current === slug
  );
  const prevArticle =
    currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < categoryArticles.length - 1
      ? categoryArticles[currentIndex + 1]
      : null;

  // Get localized values
  const articleTitle =
    getLocalizedValue(article.title, currentLang) || "Untitled";
  const { regularPart: articleRegularPart, boldPart: articleBoldPart } =
    formatTitle(articleTitle);
  const articleContent = article.content?.find(
    (c) => c._key === currentLang
  )?.value;
  const categoryTitle =
    getLocalizedValue(article.category.title, currentLang) || "";

  // Next article info
  const nextArticleTitle = nextArticle
    ? getLocalizedValue(nextArticle.title, currentLang) || ""
    : "";
  const nextArticleSummary = nextArticle
    ? getLocalizedValue(nextArticle.summary, currentLang) || ""
    : "";
  const nextArticleImageUrl = nextArticle?.image
    ? urlFor(nextArticle.image).width(600).height(400).quality(85).url()
    : "/images/resources-bg.jpg";

  // Format date
  const updatedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-GB")
    : "";

  // Current position
  const currentPosition = currentIndex + 1;
  const totalArticles = categoryArticles.length;

  // Current article featured image
  const articleImageUrl = article.image
    ? urlFor(article.image).width(800).height(400).quality(85).url()
    : null;

  return (
    <Container className="h-full flex flex-col gap-4">
      {/* Secondary Navigation */}
      <ResourcesSecondaryNav
        categories={categories}
        currentCategorySlug={category}
        lang={currentLang}
      />

      <div className="flex items-center md:max-w-[60%] md:pr-10 gap-2">
        <div className="flex items-center gap-4">
          <span className="inline-block h-px w-[50px] bg-[#7ED957]">
            &nbsp;
          </span>
          {/* Category title */}
          <span className="text-[#7ED957] uppercase text-xs tracking-[5px] font-bold">
            {categoryTitle}
          </span>
        </div>
        <div className="ml-auto">
          <span className="text-white text-sm">
            {String(currentPosition).padStart(2, "0")} /{" "}
            {String(totalArticles).padStart(2, "0")}
          </span>
        </div>
        <div className="flex gap-4 md:hidden">
          {/* Previous article */}
          {prevArticle ? (
            <Link
              href={`/${lang}/resources/${category}/${prevArticle.slug.current}`}
            >
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
          {/* Next article */}
          {nextArticle ? (
            <Link
              href={`/${lang}/resources/${category}/${nextArticle.slug.current}`}
            >
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

      <div className="flex-1 min-h-0 ">
        <div className="grid md:grid-cols-[3fr_2fr] gap-4 h-full min-h-0">
          {/* Article Content */}
          <div className="text-sm h-full overflow-y-scroll min-h-0 custom-scrollbar text-white pr-4 leading-loose text-justify">
            {/* Article title */}
            <h3 className="text-white text-2xl mb-4 font-grift">
              {articleRegularPart && (
                <span className="font-normal">{articleRegularPart} </span>
              )}
              <span className="font-bold">{articleBoldPart}</span>
            </h3>
            {/* We shall display active article featured image here */}
            {articleImageUrl && (
              <Image
                src={articleImageUrl}
                width={800}
                height={400}
                className="w-full h-[300px] mb-4 object-cover"
                alt={articleTitle}
              />
            )}
            {/* Rich content */}
            {articleContent && <PortableTextContent value={articleContent} />}
          </div>

          {/* Sidebar */}
          <div className="text-white hidden md:block">
            <article className="bg-black/5 backdrop-blur-[20px] h-full w-full rounded-xl px-2 py-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  {/* Previous article */}
                  {prevArticle ? (
                    <Link
                      href={`/${lang}/resources/${category}/${prevArticle.slug.current}`}
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
                  {/* Next article */}
                  {nextArticle ? (
                    <Link
                      href={`/${lang}/resources/${category}/${nextArticle.slug.current}`}
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

              <div className="text-right text-[#3871C1] text-xs mt-auto">
                {/* Position */}
                <div className="text-white text-sm mb-1">
                  {String(
                    currentPosition + 1 <= totalArticles
                      ? currentPosition + 1
                      : currentPosition
                  ).padStart(2, "0")}{" "}
                  / {String(totalArticles).padStart(2, "0")}
                </div>
                {/* Updated date */}
                {updatedDate && <div>Updated on - {updatedDate}</div>}
              </div>

              {/* Next article preview */}
              {nextArticle ? (
                <>
                  <h3 className="text-[#3871C1] text-lg mb-2">
                    {nextArticleTitle.length > 40
                      ? `${nextArticleTitle.substring(0, 40)}...`
                      : nextArticleTitle}
                  </h3>
                  <p className="text-xs mb-2">
                    {nextArticleSummary.length > 120
                      ? `${nextArticleSummary.substring(0, 120)}...`
                      : nextArticleSummary}
                  </p>
                  <Image
                    src={nextArticleImageUrl}
                    width={600}
                    height={700}
                    className="w-full h-[200px] object-cover mb-2"
                    alt={nextArticleTitle}
                  />
                  <Link
                    href={`/${lang}/resources/${category}/${nextArticle.slug.current}`}
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
                  No more articles in this category
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </Container>
  );
}
