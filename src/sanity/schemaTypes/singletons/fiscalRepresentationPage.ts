import { defineType, defineField } from "sanity";
import { requireEnglishValue, withCharacterLimit } from "../../lib/validation";
import { characterLimits } from "../../lib/characterLimits";
import { LocalizedStringInput } from "../../components";

export const fiscalRepresentationPage = defineType({
  name: "fiscalRepresentationPage",
  title: "Fiscal Representation Page",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Section Label",
      type: "internationalizedArrayString",
      description:
        'Small label above the title (e.g., "Fiscal Representation")',
      options: {
        characterLimit: characterLimits.fiscalRepresentationPage.label,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.fiscalRepresentationPage.label)(
          requireEnglishValue(Rule)
        ),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "Auto-generated from English label. Used for page URL.",
      options: {
        source: (doc) => {
          // Get English value from label array
          const label = doc.label as
            | Array<{ _key: string; value: string }>
            | undefined;
          const enLabel = label?.find((l) => l._key === "en");
          return enLabel?.value || "";
        },
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Page Title",
      type: "internationalizedArrayString",
      description:
        'Use **bold** for bold text (e.g., "Understanding Fiscal **Representation**")',
      options: {
        characterLimit: characterLimits.fiscalRepresentationPage.title,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.fiscalRepresentationPage.title)(
          requireEnglishValue(Rule.required())
        ),
    }),
    defineField({
      name: "content",
      title: "Main Content",
      type: "internationalizedArrayBlockContent",
      description: "Rich text content for the page",
      validation: (Rule) => requireEnglishValue(Rule),
    }),
    defineField({
      name: "sidePanelImage",
      title: "Side Panel Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Fiscal Representation Page" };
    },
  },
});
