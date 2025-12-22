import { defineType, defineField } from "sanity";

export const featuredLogo = defineType({
  name: "featuredLogo",
  title: "Featured Logo",
  type: "object",
  fields: [
    defineField({
      name: "logo",
      title: "Logo Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Describe the logo for accessibility",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link URL (optional)",
      type: "url",
      description: "Optional link when logo is clicked",
    }),
    defineField({
      name: "height",
      title: "Display Height (px)",
      type: "number",
      description: "Height of the logo in pixels (width adjusts automatically)",
      initialValue: 48,
      validation: (Rule) => Rule.min(20).max(200),
    }),
  ],
  preview: {
    select: {
      title: "alt",
      media: "logo",
    },
  },
});
