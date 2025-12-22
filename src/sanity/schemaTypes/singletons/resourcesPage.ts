import { defineType, defineField } from "sanity";

export const resourcesPage = defineType({
  name: "resourcesPage",
  title: "Resources Page",
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
  ],
  preview: {
    prepare() {
      return { title: "Resources Page" };
    },
  },
});
