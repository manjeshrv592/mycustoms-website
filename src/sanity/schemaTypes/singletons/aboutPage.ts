import { defineType, defineField } from "sanity";
import { requireEnglishValue } from "../../lib/validation";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
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
      name: "title",
      title: "Page Title",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule.required()),
    }),
    defineField({
      name: "description",
      title: "About Description",
      type: "internationalizedArrayString",
      description: "Main description about the company",
      validation: (Rule) => requireEnglishValue(Rule.required()),
    }),
    defineField({
      name: "visionTitle",
      title: "Vision Title",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "visionDescription",
      title: "Vision Description",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule.required()),
    }),
    defineField({
      name: "missionTitle",
      title: "Mission Title",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "missionDescription",
      title: "Mission Description",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule.required()),
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
