import { defineType, defineField } from "sanity";
import {
  withCharacterLimit,
  withSimpleCharacterLimit,
} from "../../lib/validation";
import { characterLimits } from "../../lib/characterLimits";
import { LocalizedStringInput } from "../../components";

export const ctaButton = defineType({
  name: "ctaButton",
  title: "CTA Button",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Button Text",
      type: "internationalizedArrayString",
      options: {
        characterLimit: characterLimits.ctaButton.text,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.ctaButton.text)(Rule.required()),
    }),
    defineField({
      name: "link",
      title: "Link URL",
      type: "string",
      description: "URL to navigate to when button is clicked",
      validation: (Rule) =>
        withSimpleCharacterLimit(characterLimits.ctaButton.link)(Rule),
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
      const text = title?.[0]?.value || "CTA Button";
      return { title: text };
    },
  },
});
