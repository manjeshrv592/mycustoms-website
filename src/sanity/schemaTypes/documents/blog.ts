import { defineType, defineField } from "sanity";
import { requireEnglishValue } from "../../lib/validation";

export const blog = defineType({
  name: "blog",
  title: "Blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule.required()),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc) => {
          const title = doc.title as
            | Array<{ _key: string; value: string }>
            | undefined;
          return title?.[0]?.value || "";
        },
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "internationalizedArrayString",
      description: "Short summary for blog cards",
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "internationalizedArrayBlockContent",
      description: "Full blog content (rich text with tabs for each language)",
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Manual ordering (lower = first)",
      initialValue: 0,
    }),
    defineField({
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Only active blogs will be displayed on the website",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Published Date (Newest)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      date: "publishedAt",
      isActive: "isActive",
    },
    prepare({ title, media, date, isActive }) {
      const displayTitle = title?.[0]?.value || "Untitled Blog";
      const formattedDate = date ? new Date(date).toLocaleDateString() : "";
      const status = isActive === false ? "🔴 " : "";
      return {
        title: `${status}${displayTitle}`,
        subtitle: formattedDate,
        media,
      };
    },
  },
});
