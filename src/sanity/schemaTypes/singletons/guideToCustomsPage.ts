import { defineType, defineField } from "sanity";
import { requireEnglishValue } from "../../lib/validation";

export const guideToCustomsPage = defineType({
  name: "guideToCustomsPage",
  title: "Guide to Customs Page",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Section Label",
      type: "internationalizedArrayString",
      description: 'Small label above the title (e.g., "Guide to Customs")',
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "title",
      title: "Page Title",
      type: "internationalizedArrayString",
      description:
        'Use **bold** for bold text (e.g., "Your Complete Guide to **Customs**")',
      validation: (Rule) => requireEnglishValue(Rule.required()),
    }),
    defineField({
      name: "content",
      title: "Main Content",
      type: "internationalizedArrayBlockContent",
      description: "Rich text content for the page",
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "sidePanelImage",
      title: "Side Panel Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Guide to Customs Page" };
    },
  },
});
