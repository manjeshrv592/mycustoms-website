import { defineType, defineField } from "sanity";
import { requireEnglishValue } from "../../lib/validation";

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
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayString",
      validation: (Rule) => requireEnglishValue(Rule),
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
      name: "mapLink",
      title: "Map Link",
      type: "url",
      description: "Google Maps link for the 'View on map' button",
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
