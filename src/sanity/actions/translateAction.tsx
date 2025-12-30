import { useDocumentOperation } from "sanity";
import { TranslateIcon } from "@sanity/icons";
import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Card,
  Flex,
  Select,
  Stack,
  Text,
  Label,
} from "@sanity/ui";

// Languages supported by the system
const LANGUAGES = [
  { id: "en", title: "English" },
  { id: "nl", title: "Dutch" },
  { id: "de", title: "German" },
  { id: "cn", title: "Chinese" },
];

/**
 * Translate text using our API
 */
async function translateText(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<string> {
  if (!text || text.trim() === "") return text;

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, sourceLanguage, targetLanguage }),
  });

  if (!response.ok) {
    throw new Error("Translation failed");
  }

  const data = await response.json();
  return data.translatedText;
}

/**
 * Deep clone an object
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Generate a unique key
 */
function generateKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Translate Portable Text blocks while preserving structure
 */
async function translatePortableTextBlocks(
  blocks: unknown[],
  sourceLanguage: string,
  targetLanguage: string
): Promise<unknown[]> {
  const translatedBlocks = deepClone(blocks);

  for (const block of translatedBlocks) {
    if (typeof block !== "object" || block === null) continue;

    const blockObj = block as Record<string, unknown>;

    if (blockObj._type === "block" && Array.isArray(blockObj.children)) {
      for (const child of blockObj.children) {
        if (
          typeof child === "object" &&
          child !== null &&
          (child as Record<string, unknown>)._type === "span" &&
          typeof (child as Record<string, unknown>).text === "string"
        ) {
          const spanChild = child as Record<string, unknown>;
          const originalText = spanChild.text as string;
          if (originalText.trim()) {
            spanChild.text = await translateText(
              originalText,
              sourceLanguage,
              targetLanguage
            );
          }
        }
      }
      blockObj._key = generateKey();
    } else if (blockObj._type) {
      blockObj._key = generateKey();
    }
  }

  return translatedBlocks;
}

interface InternationalizedArrayItem {
  _key: string;
  value: unknown;
}

/**
 * Sanity Document Action for Auto-Translation
 * Uses Sanity UI components for theme support
 */
export function TranslateAction(props: {
  id: string;
  type: string;
  draft?: unknown;
  published?: unknown;
}) {
  const { patch } = useDocumentOperation(props.id, props.type);
  const [isTranslating, setIsTranslating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguages, setTargetLanguages] = useState<string[]>([
    "nl",
    "de",
    "cn",
  ]);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "info">(
    "info"
  );
  const [progress, setProgress] = useState("");

  const document = props.draft || props.published;

  const handleTranslate = async () => {
    if (!document || targetLanguages.length === 0) return;

    setIsTranslating(true);
    setStatus("Starting translation...");
    setStatusType("info");

    try {
      const doc = document as Record<string, unknown>;
      let fieldsTranslated = 0;

      for (const [fieldName, fieldValue] of Object.entries(doc)) {
        if (fieldName.startsWith("_")) continue;

        if (Array.isArray(fieldValue) && fieldValue.length > 0) {
          const firstItem = fieldValue[0] as Record<string, unknown>;

          if (
            firstItem &&
            "_key" in firstItem &&
            ("value" in firstItem ||
              LANGUAGES.some((l) => l.id === firstItem._key))
          ) {
            const sourceItem = fieldValue.find(
              (item: InternationalizedArrayItem) => item._key === sourceLanguage
            ) as InternationalizedArrayItem | undefined;

            if (!sourceItem?.value) continue;

            const sourceValue = sourceItem.value;
            const isBlockContent = Array.isArray(sourceValue);

            if (isBlockContent && (sourceValue as unknown[]).length === 0)
              continue;
            if (typeof sourceValue === "string" && sourceValue.trim() === "")
              continue;

            const newArray: InternationalizedArrayItem[] =
              deepClone(fieldValue);

            for (const targetLang of targetLanguages) {
              if (targetLang === sourceLanguage) continue;

              setProgress(`Translating "${fieldName}" to ${targetLang}...`);

              try {
                let translatedValue: unknown;

                if (isBlockContent) {
                  translatedValue = await translatePortableTextBlocks(
                    sourceValue as unknown[],
                    sourceLanguage,
                    targetLang
                  );
                } else if (typeof sourceValue === "string") {
                  translatedValue = await translateText(
                    sourceValue,
                    sourceLanguage,
                    targetLang
                  );
                } else {
                  continue;
                }

                const existingIndex = newArray.findIndex(
                  (item) => item._key === targetLang
                );

                if (existingIndex >= 0) {
                  newArray[existingIndex] = {
                    ...newArray[existingIndex],
                    value: translatedValue,
                  };
                } else {
                  newArray.push({
                    _key: targetLang,
                    value: translatedValue,
                  });
                }

                fieldsTranslated++;
              } catch (error) {
                console.error(
                  `Failed to translate ${fieldName} to ${targetLang}:`,
                  error
                );
              }
            }

            patch.execute([{ set: { [fieldName]: newArray } }]);
          }
        }
      }

      setProgress("");
      if (fieldsTranslated > 0) {
        setStatus(
          `Translation complete! ${fieldsTranslated} translations applied.`
        );
        setStatusType("success");
      } else {
        setStatus("No translatable content found.");
        setStatusType("info");
      }

      setTimeout(() => {
        setDialogOpen(false);
        setStatus("");
      }, 2500);
    } catch (error) {
      console.error("Translation error:", error);
      setStatus(
        "Translation failed. Is LibreTranslate running on localhost:5000?"
      );
      setStatusType("error");
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleTargetLanguage = (langId: string) => {
    if (targetLanguages.includes(langId)) {
      setTargetLanguages(targetLanguages.filter((l) => l !== langId));
    } else {
      setTargetLanguages([...targetLanguages, langId]);
    }
  };

  // Check if document exists (has been saved at least once)
  const isNewUnsavedDocument = !document;

  return {
    label: "Translate",
    icon: TranslateIcon,
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen && {
      type: "dialog" as const,
      header: "Auto-Translate Content",
      content: isNewUnsavedDocument ? (
        <Box padding={4}>
          <Card padding={4} radius={2} tone="caution">
            <Stack space={3}>
              <Text weight="bold">Document Not Saved Yet</Text>
              <Text size={1} muted>
                Please save this document first (it auto-saves after a few
                seconds), then click Translate again.
              </Text>
              <Text size={1} muted>
                Translation needs the document to be saved at least once to
                access its content.
              </Text>
            </Stack>
          </Card>
        </Box>
      ) : (
        <Box padding={4}>
          <Stack space={4}>
            {/* Source Language */}
            <Stack space={2}>
              <Label>Source Language</Label>
              <Select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.currentTarget.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.title}
                  </option>
                ))}
              </Select>
            </Stack>

            {/* Target Languages */}
            <Stack space={2}>
              <Label>Translate to</Label>
              <Card padding={3} radius={2} shadow={1}>
                <Stack space={3}>
                  {LANGUAGES.filter((lang) => lang.id !== sourceLanguage).map(
                    (lang) => (
                      <Flex key={lang.id} align="center" gap={2}>
                        <Checkbox
                          checked={targetLanguages.includes(lang.id)}
                          onChange={() => toggleTargetLanguage(lang.id)}
                        />
                        <Text size={1}>{lang.title}</Text>
                      </Flex>
                    )
                  )}
                </Stack>
              </Card>
            </Stack>

            {/* Progress */}
            {progress && (
              <Card padding={3} radius={2} tone="primary">
                <Text size={1}>{progress}</Text>
              </Card>
            )}

            {/* Status */}
            {status && (
              <Card
                padding={3}
                radius={2}
                tone={
                  statusType === "success"
                    ? "positive"
                    : statusType === "error"
                      ? "critical"
                      : "caution"
                }
              >
                <Text size={1}>{status}</Text>
              </Card>
            )}

            {/* Translate Button */}
            <Button
              onClick={handleTranslate}
              disabled={isTranslating || targetLanguages.length === 0}
              tone="primary"
              text={isTranslating ? "Translating..." : "Translate Content"}
            />

            {/* Info */}
            <Card padding={3} radius={2} tone="default">
              <Stack space={2}>
                <Text size={1} muted>
                  <strong>✓ Preserves:</strong> Images, bold, italic, links,
                  lists, headings
                </Text>
                <Text size={1} muted>
                  <strong>↗ Translates:</strong> Text content only
                </Text>
              </Stack>
            </Card>
          </Stack>
        </Box>
      ),
      onClose: () => {
        setDialogOpen(false);
        setStatus("");
        setProgress("");
      },
    },
  };
}
