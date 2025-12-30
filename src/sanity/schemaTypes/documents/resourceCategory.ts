import { defineType, defineField } from "sanity";
import { requireEnglishValue } from "../../lib/validation";

export const resourceCategory = defineType({
  name: "resourceCategory",
  title: "Resource Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category Title",
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
      description:
        'URL-friendly identifier (e.g., "blogs", "guide-to-customs")',
    }),
    defineField({
      name: "key",
      title: "Category Key",
      type: "string",
      options: {
        list: [
          { title: "Blogs", value: "blogs" },
          { title: "Guide to Customs", value: "guide-to-customs" },
          { title: "Fiscal Representation", value: "fiscal-representation" },
          { title: "EU VAT Compliance", value: "eu-vat-compliance" },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: "Internal identifier for the category",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      key: "key",
    },
    prepare({ title, key }) {
      const displayTitle = title?.[0]?.value || "Untitled Category";
      return {
        title: displayTitle,
        subtitle: key,
      };
    },
  },
});
