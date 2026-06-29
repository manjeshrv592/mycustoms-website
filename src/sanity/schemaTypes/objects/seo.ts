import { defineType, defineField } from "sanity";
import { withCharacterLimit } from "../../lib/validation";
import { characterLimits } from "../../lib/characterLimits";
import { LocalizedStringInput } from "../../components";

/**
 * Reusable SEO settings object.
 *
 * All text fields are optional, per-language overrides. When left empty the
 * frontend falls back to the page's default title and omits the tag entirely.
 * Reused across page singletons (Home, About, Contact, the resource pages) and
 * at the individual item level for Services and Blogs.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO Settings",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "internationalizedArrayString",
      description:
        "Overrides the page title shown in search results and browser tabs. Leave empty to keep the default page title.",
      options: { characterLimit: characterLimits.seo.metaTitle },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.seo.metaTitle)(Rule),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "internationalizedArrayText",
      description:
        "The snippet shown beneath the title in search results. Leave empty to omit it.",
      validation: (Rule) =>
        withCharacterLimit(characterLimits.seo.metaDescription)(Rule),
    }),
    defineField({
      name: "metaKeywords",
      title: "Meta Keywords",
      type: "internationalizedArrayString",
      description:
        "Comma-separated keywords (e.g. \"customs, vat, compliance\"). Optional.",
      options: { characterLimit: characterLimits.seo.metaKeywords },
      components: { input: LocalizedStringInput },
      validation: (Rule) =>
        withCharacterLimit(characterLimits.seo.metaKeywords)(Rule),
    }),
    defineField({
      name: "allowIndexing",
      title: "Allow search engines to crawl & index this page",
      type: "boolean",
      description:
        "On by default. When turned off, search engines are told not to index this page or follow its links (noindex, nofollow).",
      initialValue: true,
    }),
  ],
});
