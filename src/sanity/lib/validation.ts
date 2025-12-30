import { Rule } from "sanity";

interface InternationalizedArrayItem {
  _key: string;
  value?: string | unknown[];
}

/**
 * Validates that the English (en) value is present in an internationalized array field.
 * English is the base language used for translations.
 */
export function requireEnglishValue(rule: Rule): Rule {
  return rule.custom((value: InternationalizedArrayItem[] | undefined) => {
    // If the field is empty, let the required() validation handle it
    if (!value || !Array.isArray(value) || value.length === 0) {
      return "English (EN) value is required";
    }

    const englishEntry = value.find((item) => item._key === "en");

    // No English entry at all
    if (!englishEntry) {
      return "English (EN) value is required";
    }

    // Check if value is empty or undefined
    const entryValue = englishEntry.value;

    // Value is undefined or null
    if (entryValue === undefined || entryValue === null) {
      return "English (EN) value cannot be empty";
    }

    // For strings - check if empty
    if (typeof entryValue === "string") {
      if (entryValue.trim() === "") {
        return "English (EN) value cannot be empty";
      }
      return true;
    }

    // For block content (arrays) - check if empty
    if (Array.isArray(entryValue)) {
      if (entryValue.length === 0) {
        return "English (EN) content is required";
      }

      // Check if all blocks are empty (no actual text content)
      const hasContent = entryValue.some((block) => {
        if (
          typeof block === "object" &&
          block !== null &&
          "_type" in block &&
          (block as { _type: string })._type === "block" &&
          "children" in block
        ) {
          const children = (block as { children: { text?: string }[] })
            .children;
          return children.some(
            (child) => child.text && child.text.trim() !== ""
          );
        }
        // Non-block types (like images) count as content
        return true;
      });

      if (!hasContent) {
        return "English (EN) content cannot be empty";
      }
      return true;
    }

    return true;
  });
}

/**
 * Combines required() with English value validation
 */
export function requiredWithEnglish(rule: Rule): Rule {
  return requireEnglishValue(rule.required());
}
