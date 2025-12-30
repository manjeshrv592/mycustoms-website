import { defineType, defineField } from "sanity";
import { requireEnglishValue } from "../../lib/validation";

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services Page",
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
      description: 'Small label (e.g., "services")',
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "title",
      title: "Page Title",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule.required()),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Services Page" };
    },
  },
});
