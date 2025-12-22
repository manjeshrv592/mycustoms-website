import { defineType, defineField } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
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
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayString",
    }),
    // Right column / Contact Info
    defineField({
      name: "contactImage",
      title: "Contact Section - Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      description: "Physical address (not localized)",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
