import { defineType } from "sanity";

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "internationalizedArrayString",
});
