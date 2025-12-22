import { defineType, defineField } from "sanity";

export const ctaButton = defineType({
  name: "ctaButton",
  title: "CTA Button",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Button Text",
      type: "internationalizedArrayString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "link",
      title: "Link URL",
      type: "string",
      description: "URL to navigate to when button is clicked",
    }),
    defineField({
      name: "isExternal",
      title: "Open in new tab?",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "text",
    },
    prepare({ title }) {
      // Get the first language value for preview
      const text = title?.[0]?.value || "CTA Button";
      return { title: text };
    },
  },
});
