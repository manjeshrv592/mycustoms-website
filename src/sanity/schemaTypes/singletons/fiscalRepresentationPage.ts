import { defineType, defineField } from "sanity";
import { requireEnglishValue } from "../../lib/validation";

export const fiscalRepresentationPage = defineType({
  name: "fiscalRepresentationPage",
  title: "Fiscal Representation Page",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Section Label",
      type: "internationalizedArrayString",
      description:
        'Small label above the title (e.g., "Fiscal Representation")',
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "title",
      title: "Page Title",
      type: "internationalizedArrayString",
      description:
        'Use **bold** for bold text (e.g., "Understanding Fiscal **Representation**")',
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
      return { title: "Fiscal Representation Page" };
    },
  },
});
