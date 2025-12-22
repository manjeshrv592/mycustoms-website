import { defineType } from "sanity";

export const localizedText = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "internationalizedArrayBlockContent",
});
