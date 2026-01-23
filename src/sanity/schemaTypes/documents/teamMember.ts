import { defineType, defineField } from "sanity";
import {
  requireEnglishValue,
  withCharacterLimit,
  withSimpleCharacterLimit,
} from "../../lib/validation";
import { characterLimits } from "../../lib/characterLimits";
import { LocalizedStringInput, StringWithCharacterCount } from "../../components";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "document",
  fields: [
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      options: {
        characterLimit: characterLimits.teamMember.firstName,
      } as any,
      components: {
        input: StringWithCharacterCount,
      },
      validation: (Rule) =>
        withSimpleCharacterLimit(characterLimits.teamMember.firstName)(
          Rule.required()
        ),
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
      options: {
        characterLimit: characterLimits.teamMember.lastName,
      } as any,
      components: {
        input: StringWithCharacterCount,
      },
      validation: (Rule) =>
        withSimpleCharacterLimit(characterLimits.teamMember.lastName)(
          Rule.required()
        ),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc) => `${doc.firstName || ""}-${doc.lastName || ""}`,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "designation",
      title: "Designation / Role",
      type: "internationalizedArrayString",
      description: 'Job title or role (e.g., "General Manager")',
      options: {
        characterLimit: characterLimits.teamMember.designation,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.teamMember.designation)(
          requireEnglishValue(Rule.required())
        ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayString",
      description: "Short description about what they do",
      options: {
        characterLimit: characterLimits.teamMember.description,
      },
      components: {
        input: LocalizedStringInput,
      },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.teamMember.description)(
          requireEnglishValue(Rule)
        ),
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
      firstName: "firstName",
      lastName: "lastName",
      subtitle: "designation",
      media: "image",
    },
    prepare({ firstName, lastName, subtitle, media }) {
      const fullName = `${firstName || ""} ${lastName || ""}`.trim();
      const role = subtitle?.[0]?.value || "";
      return {
        title: fullName || "Untitled",
        subtitle: role,
        media,
      };
    },
  },
});
