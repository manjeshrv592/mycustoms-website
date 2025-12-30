import { defineType, defineField } from "sanity";
import { requireEnglishValue } from "../../lib/validation";

export const portalPage = defineType({
  name: "portalPage",
  title: "Portal Page",
  type: "document",
  fields: [
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "label",
      title: "Section Label",
      type: "internationalizedArrayString",
      description: 'Small label above the title (e.g., "Our Portal")',
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "title",
      title: "Page Title",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule.required()),
    }),
    defineField({
      name: "content",
      title: "Main Content",
      type: "internationalizedArrayBlockContent",
      description: "Rich text content about the portal",
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    // Right column / Side Panel
    defineField({
      name: "sidePanelImage",
      title: "Side Panel - Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "sidePanelTitle",
      title: "Side Panel - Title",
      type: "internationalizedArrayString",
      description: 'Title in the side panel (e.g., "Access the Portal")',
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "sidePanelDescription",
      title: "Side Panel - Description",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "ctaButton",
      title: "Side Panel - CTA Button",
      type: "ctaButton",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Portal Page" };
    },
  },
});
