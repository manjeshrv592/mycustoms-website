import { defineType, defineField } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "internationalizedArrayString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc) => {
          // Get the first available title translation for slug generation
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
      description: "Short summary displayed on cards",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "internationalizedArrayBlockContent",
      description: "Full service description (rich text)",
    }),
    defineField({
      name: "image",
      title: "Image",
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
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which this service appears (lower = first)",
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
      media: "image",
    },
    prepare({ title, media }) {
      const displayTitle = title?.[0]?.value || "Untitled Service";
      return {
        title: displayTitle,
        media,
      };
    },
  },
});
