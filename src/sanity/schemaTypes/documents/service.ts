import { defineType, defineField } from "sanity";
import { requireEnglishValue, withCharacterLimit } from "../../lib/validation";
import { characterLimits } from "../../lib/characterLimits";
import { LocalizedStringInput } from "../../components";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "internationalizedArrayString",
      options: {
        characterLimit: characterLimits.service.title,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.service.title)(
          requireEnglishValue(Rule.required())
        ),
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
      description: "Short summary displayed on cards",
      options: {
        characterLimit: characterLimits.service.summary,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.service.summary)(
          requireEnglishValue(Rule)
        ),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "internationalizedArrayBlockContent",
      description: "Full service description (rich text)",
      validation: (Rule) => requireEnglishValue(Rule),
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
      name: "isActive",
      title: "Active",
      type: "boolean",
      description: "Only active services will be displayed on the website",
      initialValue: true,
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
