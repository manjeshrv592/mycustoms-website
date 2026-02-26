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
  fieldsets: [
    {
      name: "contactInfo",
      title: "Contact Info Section",
      options: { collapsible: true, collapsed: true },
    },
    {
      name: "formLabels",
      title: "Form Labels & Placeholders",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    // ---- Page Header ----
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
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      description: "LinkedIn profile or company page URL",
    }),

    // ---- Contact Info Section ----
    defineField({
      name: "contactImage",
      title: "Contact Section - Image",
      type: "image",
      fieldset: "contactInfo",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "basedAtTitle",
      title: "Based At — Title",
      type: "internationalizedArrayString",
      fieldset: "contactInfo",
      options: { characterLimit: characterLimits.contactPage.basedAtTitle },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.basedAtTitle)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      fieldset: "contactInfo",
      rows: 3,
      description: "Physical address (not localized)",
      validation: (Rule) =>
        withSimpleCharacterLimit(characterLimits.contactPage.address)(Rule),
    }),
    defineField({
      name: "viewOnMapText",
      title: "View on Map — Link Text",
      type: "internationalizedArrayString",
      fieldset: "contactInfo",
      options: { characterLimit: characterLimits.contactPage.viewOnMapText },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.viewOnMapText)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "mapLink",
      title: "Map Link",
      type: "url",
      fieldset: "contactInfo",
      description: "Google Maps link for the 'View on map' button",
    }),
    defineField({
      name: "phoneSectionLabel",
      title: "Phone Section — Label",
      type: "internationalizedArrayString",
      fieldset: "contactInfo",
      options: { characterLimit: characterLimits.contactPage.phoneSectionLabel },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.phoneSectionLabel)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      fieldset: "contactInfo",
      validation: (Rule) =>
        withSimpleCharacterLimit(characterLimits.contactPage.phone)(Rule),
    }),
    defineField({
      name: "emailSectionLabel",
      title: "Email Section — Label",
      type: "internationalizedArrayString",
      fieldset: "contactInfo",
      options: { characterLimit: characterLimits.contactPage.emailSectionLabel },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.emailSectionLabel)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      fieldset: "contactInfo",
      validation: (Rule) =>
        withSimpleCharacterLimit(characterLimits.contactPage.email)(
          Rule.email()
        ),
    }),

    // ---- Form Labels & Placeholders ----
    defineField({
      name: "formLabelName",
      title: "Name — Label",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formLabelName },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formLabelName)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formPlaceholderName",
      title: "Name — Placeholder",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formPlaceholderName },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formPlaceholderName)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formLabelEmail",
      title: "Email — Label",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formLabelEmail },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formLabelEmail)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formPlaceholderEmail",
      title: "Email — Placeholder",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formPlaceholderEmail },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formPlaceholderEmail)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formLabelPhone",
      title: "Phone — Label",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formLabelPhone },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formLabelPhone)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formLabelCompany",
      title: "Company — Label",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formLabelCompany },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formLabelCompany)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formPlaceholderCompany",
      title: "Company — Placeholder",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formPlaceholderCompany },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formPlaceholderCompany)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formLabelService",
      title: "Service — Label",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formLabelService },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formLabelService)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formPlaceholderService",
      title: "Service — Placeholder",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formPlaceholderService },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formPlaceholderService)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formLabelMessage",
      title: "Message — Label",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formLabelMessage },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formLabelMessage)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formPlaceholderMessage",
      title: "Message — Placeholder",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formPlaceholderMessage },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formPlaceholderMessage)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formSubmitButton",
      title: "Submit Button — Text",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      options: { characterLimit: characterLimits.contactPage.formSubmitButton },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formSubmitButton)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "formSubmittingButton",
      title: "Submitting Button — Text",
      type: "internationalizedArrayString",
      fieldset: "formLabels",
      description: "Text shown while the form is being submitted",
      options: { characterLimit: characterLimits.contactPage.formSubmittingButton },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.contactPage.formSubmittingButton)(requireEnglishValue(Rule)),
    }),
    defineField({
      name: "services",
      title: "Service Options",
      description: "List of services shown in the contact form dropdown",
      type: "array",
      fieldset: "formLabels",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
