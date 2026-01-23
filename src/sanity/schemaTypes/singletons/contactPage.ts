import { defineType, defineField } from "sanity";
import {
  requireEnglishValue,
  withCharacterLimit,
  withSimpleCharacterLimit,
} from "../../lib/validation";
import { characterLimits } from "../../lib/characterLimits";
import { LocalizedStringInput } from "../../components";

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
      options: {
        characterLimit: characterLimits.contactPage.title,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.title)(
          requireEnglishValue(Rule)
        ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayString",
      options: {
        characterLimit: characterLimits.contactPage.description,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.description)(
          requireEnglishValue(Rule)
        ),
    }),
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
      validation: (Rule) =>
        withSimpleCharacterLimit(characterLimits.contactPage.address)(Rule),
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
      validation: (Rule) =>
        withSimpleCharacterLimit(characterLimits.contactPage.phone)(Rule),
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (Rule) =>
        withSimpleCharacterLimit(characterLimits.contactPage.email)(
          Rule.email()
        ),
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      description: "LinkedIn profile or company page URL",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
