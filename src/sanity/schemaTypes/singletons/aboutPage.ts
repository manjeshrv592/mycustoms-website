import { defineType, defineField } from "sanity";
import { requireEnglishValue, withCharacterLimit } from "../../lib/validation";
import { characterLimits } from "../../lib/characterLimits";
import { LocalizedStringInput } from "../../components";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
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
        characterLimit: characterLimits.aboutPage.title,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.aboutPage.title)(
          requireEnglishValue(Rule.required())
        ),
    }),
    defineField({
      name: "description",
      title: "About Description",
      type: "internationalizedArrayString",
      description: "Main description about the company",
      options: {
        characterLimit: characterLimits.aboutPage.description,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.aboutPage.description)(
          requireEnglishValue(Rule.required())
        ),
    }),
    defineField({
      name: "visionTitle",
      title: "Vision Title",
      type: "internationalizedArrayString",
      options: {
        characterLimit: characterLimits.aboutPage.visionTitle,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.aboutPage.visionTitle)(
          requireEnglishValue(Rule)
        ),
    }),
    defineField({
      name: "visionDescription",
      title: "Vision Description",
      type: "internationalizedArrayString",
      options: {
        characterLimit: characterLimits.aboutPage.visionDescription,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.aboutPage.visionDescription)(
          requireEnglishValue(Rule.required())
        ),
    }),
    defineField({
      name: "missionTitle",
      title: "Mission Title",
      type: "internationalizedArrayString",
      options: {
        characterLimit: characterLimits.aboutPage.missionTitle,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.aboutPage.missionTitle)(
          requireEnglishValue(Rule)
        ),
    }),
    defineField({
      name: "missionDescription",
      title: "Mission Description",
      type: "internationalizedArrayString",
      options: {
        characterLimit: characterLimits.aboutPage.missionDescription,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.aboutPage.missionDescription)(
          requireEnglishValue(Rule.required())
        ),
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
