import { defineType, defineField } from "sanity";
import { requireEnglishValue, withCharacterLimit } from "../../lib/validation";
import { characterLimits } from "../../lib/characterLimits";
import { LocalizedStringInput } from "../../components";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
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
      name: "mobileBackgroundImage",
      title: "Mobile Background Image",
      type: "image",
      description:
        "Background image for mobile screens (up to md breakpoint). If not set, the main background image will be used.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "mainTitleLine1",
      title: "Main Title - Line 1",
      type: "internationalizedArrayString",
      description: 'First part of the title (e.g., "More Than")',
      options: {
        characterLimit: characterLimits.homePage.mainTitleLine1,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.homePage.mainTitleLine1)(
          requireEnglishValue(Rule.required())
        ),
    }),
    defineField({
      name: "mainTitleLine2",
      title: "Main Title - Line 2 (Highlighted)",
      type: "internationalizedArrayString",
      description: 'Second part of the title in red (e.g., "Customs")',
      options: {
        characterLimit: characterLimits.homePage.mainTitleLine2,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.homePage.mainTitleLine2)(
          requireEnglishValue(Rule.required())
        ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayString",
      description: "Subtitle text below the main title",
      options: {
        characterLimit: characterLimits.homePage.description,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.homePage.description)(
          requireEnglishValue(Rule.required())
        ),
    }),
    defineField({
      name: "featuredLogos",
      title: "Featured Logos",
      type: "array",
      of: [{ type: "featuredLogo" }],
      description:
        "Partner/certification logos displayed below the description",
    }),
    defineField({
      name: "ctaButton",
      title: "Call to Action Button",
      type: "ctaButton",
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
