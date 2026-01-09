/**
 * Migration Script: Convert Articles to Blogs
 *
 * This script migrates existing article documents to the new blog document type.
 * It copies all fields except the category reference.
 *
 * Usage: npx tsx scripts/migrate-articles-to-blogs.ts
 *
 * Note: Make sure SANITY_API_TOKEN is set in your .env.local file with write access
 */

import { config } from "dotenv";
import { createClient } from "@sanity/client";

// Load .env.local
config({ path: ".env.local" });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET"
  );
  console.error("   Make sure your .env.local file is configured correctly.");
  process.exit(1);
}

if (!token) {
  console.error("❌ Missing SANITY_API_TOKEN");
  console.error("   You need a token with write access to run this migration.");
  console.error(
    "   Get one from: https://www.sanity.io/manage/project/" +
      projectId +
      "/api"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

interface Article {
  _id: string;
  _type: "article";
  title?: Array<{ _key: string; value: string }>;
  slug: { _type: "slug"; current: string };
  summary?: Array<{ _key: string; value: string }>;
  content?: Array<{ _key: string; value: unknown[] }>;
  image?: {
    _type: "image";
    asset: { _ref: string; _type: "reference" };
    alt?: string;
    hotspot?: unknown;
    crop?: unknown;
  };
  publishedAt?: string;
  order?: number;
}

async function migrateArticlesToBlogs() {
  console.log("🚀 Starting migration: Articles → Blogs\n");

  // Fetch all articles
  const articles = await client.fetch<Article[]>(`
    *[_type == "article"] {
      _id,
      title,
      slug,
      summary,
      content,
      image,
      publishedAt,
      order
    }
  `);

  console.log(`📝 Found ${articles.length} articles to migrate\n`);

  if (articles.length === 0) {
    console.log("No articles to migrate. Exiting.");
    return;
  }

  const transaction = client.transaction();

  for (const article of articles) {
    const blogId = `blog-${article._id.replace("drafts.", "")}`;

    console.log(`  → Migrating: ${article.title?.[0]?.value || article._id}`);

    // Create new blog document
    transaction.create({
      _id: blogId,
      _type: "blog",
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      image: article.image,
      publishedAt: article.publishedAt,
      order: article.order || 0,
      isActive: true,
    });
  }

  console.log("\n⏳ Committing transaction...");

  try {
    await transaction.commit();
    console.log("\n✅ Migration complete!");
    console.log(`   Created ${articles.length} blog documents`);
    console.log("\n⚠️  Note: Old article documents are preserved.");
    console.log(
      "   You can delete them manually in Sanity Studio after verifying the migration."
    );
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateArticlesToBlogs();
