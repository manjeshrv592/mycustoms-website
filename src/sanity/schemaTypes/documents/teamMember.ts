import { defineType, defineField } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "designation",
      title: "Designation / Role",
      type: "internationalizedArrayString",
      description: 'Job title or role (e.g., "General Manager")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayString",
      description: "Short description about what they do",
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order in which this member appears (lower = first)",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "designation",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      const role = subtitle?.[0]?.value || "";
      return {
        title,
        subtitle: role,
        media,
      };
    },
  },
});
