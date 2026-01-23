import { Rule, StringRule } from "sanity";

interface InternationalizedArrayItem {
  _key: string;
  value?: string | unknown[];
}

/***
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

/**
 * Language limits type for internationalized fields
 */
type LanguageLimits = {
  en: number | null;
  nl: number | null;
  de: number | null;
  cn: number | null;
};

/**
 * Validates character limits for each language in an internationalized array field.
 * @param limits - Object with character limits per language { en: 50, nl: 60, de: 70, cn: 30 }
 */
export function withCharacterLimit(limits: LanguageLimits) {
  return (rule: Rule): Rule => {
    return rule.custom((value: InternationalizedArrayItem[] | undefined) => {
      if (!value || !Array.isArray(value)) {
        return true; // Let required() handle empty values
      }

      const errors: string[] = [];

      for (const item of value) {
        const lang = item._key as keyof LanguageLimits;
        const limit = limits[lang];

        if (limit && typeof item.value === "string") {
          const charCount = item.value.length;
          if (charCount > limit) {
            const langNames: Record<string, string> = {
              en: "English",
              nl: "Dutch",
              de: "German",
              cn: "Chinese",
            };
            errors.push(
              `${langNames[lang] || lang}: ${charCount}/${limit} characters (exceeds limit by ${charCount - limit})`
            );
          }
        }
      }

      if (errors.length > 0) {
        return `Character limit exceeded:\n${errors.join("\n")}`;
      }

      return true;
    });
  };
}

/**
 * Validates character limit for a simple (non-localized) string field.
 * @param limit - Maximum number of characters allowed, or null for unlimited
 */
export function withSimpleCharacterLimit(limit: number | null) {
  return (rule: StringRule): StringRule => {
    if (limit === null) {
      return rule; // No limit, return rule as-is
    }
    return rule.max(limit).error(`Maximum ${limit} characters allowed`);
  };
}
