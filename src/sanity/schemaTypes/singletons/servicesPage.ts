import { defineType, defineField } from "sanity";

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
    }),
    defineField({
      name: "title",
      title: "Page Title",
      type: "internationalizedArrayString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "internationalizedArrayString",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Services Page" };
    },
  },
});
