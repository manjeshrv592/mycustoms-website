import { defineType, defineField } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
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
      name: "mainTitleLine1",
      title: "Main Title - Line 1",
      type: "internationalizedArrayString",
      description: 'First part of the title (e.g., "More Than")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainTitleLine2",
      title: "Main Title - Line 2 (Highlighted)",
      type: "internationalizedArrayString",
      description: 'Second part of the title in red (e.g., "Customs")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayString",
      description: "Subtitle text below the main title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredLogos",
      title: "Featured Logos",
      type: "array",
      of: [{ type: "featuredLogo" }],
      description:
        "Partner/certification logos displayed below the description",
    }),
    defineField({
      name: "ctaButton",
      title: "Call to Action Button",
      type: "ctaButton",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
