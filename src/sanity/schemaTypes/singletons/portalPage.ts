import { defineType, defineField } from "sanity";
import { requireEnglishValue, withCharacterLimit } from "../../lib/validation";
import { characterLimits } from "../../lib/characterLimits";
import { LocalizedStringInput } from "../../components";

export const portalPage = defineType({
  name: "portalPage",
  title: "Portal Page",
  type: "document",
  fields: [
    defineField({
      name: "isActive",
      title: "Page Active",
      type: "boolean",
      description: "Toggle to show/hide the portal page and its navigation link",
      initialValue: true,
    }),
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
      name: "label",
      title: "Section Label",
      type: "internationalizedArrayString",
      description: 'Small label above the title (e.g., "Our Portal")',
      options: {
        characterLimit: characterLimits.portalPage.label,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.portalPage.label)(
          requireEnglishValue(Rule)
        ),
    }),
    defineField({
      name: "title",
      title: "Page Title",
      type: "internationalizedArrayString",
      options: {
        characterLimit: characterLimits.portalPage.title,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.portalPage.title)(
          requireEnglishValue(Rule.required())
        ),
    }),
    defineField({
      name: "content",
      title: "Main Content",
      type: "internationalizedArrayBlockContent",
      description: "Rich text content about the portal",
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "sidePanelImage",
      title: "Side Panel - Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "sidePanelTitle",
      title: "Side Panel - Title",
      type: "internationalizedArrayString",
      description: 'Title in the side panel (e.g., "Access the Portal")',
      options: {
        characterLimit: characterLimits.portalPage.sidePanelTitle,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.portalPage.sidePanelTitle)(
          requireEnglishValue(Rule)
        ),
    }),
    defineField({
      name: "sidePanelDescription",
      title: "Side Panel - Description",
      type: "internationalizedArrayString",
      options: {
        characterLimit: characterLimits.portalPage.sidePanelDescription,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.portalPage.sidePanelDescription)(
          requireEnglishValue(Rule)
        ),
    }),
    defineField({
      name: "ctaButton",
      title: "Side Panel - CTA Button",
      type: "ctaButton",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Portal Page" };
    },
  },
});
