"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrayOfObjectsInputProps, set, unset, insert, setIfMissing } from "sanity";
import { Box, Stack, Card, Flex, Text, TextInput, Button } from "@sanity/ui";
import { TrashIcon } from "@sanity/icons";

type LanguageLimits = {
    en: number | null;
    nl: number | null;
    de: number | null;
    cn: number | null;
};

interface InternationalizedItem {
    _key: string;
    _type?: string;
    value?: string;
}

const LANGUAGES = [
    { id: "en", title: "EN" },
    { id: "nl", title: "NL" },
    { id: "de", title: "DE" },
    { id: "cn", title: "CN" },
];

/**
 * Custom internationalized string input with built-in character counter.
 * Displays each language with its own input and counter inline.
 * 
 * Layout:
 * EN                                        09/10
 * [ More Than                              ] ⊖
 */
export function LocalizedStringInput(props: ArrayOfObjectsInputProps) {
    const { value = [], onChange, schemaType } = props;

    // Get character limits from schema options
    const options = (schemaType as any).options || {};
    const limits: LanguageLimits | undefined = options.characterLimit;

    // Get value for a specific language
    const getValueForLang = useCallback(
        (lang: string): string => {
            const item = (value as InternationalizedItem[]).find(
                (v) => v._key === lang
            );
            return item?.value || "";
        },
        [value]
    );

    // Handle input change for a specific language
    const handleChange = useCallback(
        (lang: string, newValue: string) => {
            // Get the character limit for this language
            const limit = limits?.[lang as keyof LanguageLimits];

            // Truncate the value if it exceeds the limit
            const truncatedValue = limit && newValue.length > limit
                ? newValue.slice(0, limit)
                : newValue;

            const existingIndex = (value as InternationalizedItem[]).findIndex(
                (v) => v._key === lang
            );

            if (existingIndex >= 0) {
                // Update existing item
                if (truncatedValue) {
                    onChange(set(truncatedValue, [existingIndex, "value"]));
                } else {
                    onChange(set("", [existingIndex, "value"]));
                }
            } else {
                // Add new item
                onChange([
                    setIfMissing([]),
                    insert(
                        [
                            {
                                _key: lang,
                                _type: "internationalizedArrayStringValue",
                                value: truncatedValue,
                            },
                        ],
                        "after",
                        [-1]
                    ),
                ]);
            }
        },
        [onChange, value, limits]
    );

    // Format character count
    const formatCount = (count: number, max: number) => {
        const digits = Math.max(max.toString().length, 2);
        return count.toString().padStart(digits, "0");
    };

    return (
        <Stack space={3}>
            {LANGUAGES.map((lang) => {
                const currentValue = getValueForLang(lang.id);
                const charCount = currentValue.length;
                const limit = limits?.[lang.id as keyof LanguageLimits];
                const isOverLimit = limit ? charCount > limit : false;

                return (
                    <Card
                        key={lang.id}
                        padding={3}
                        radius={2}
                        tone="default"
                        style={{ backgroundColor: "#1a1a1a" }}
                    >
                        <Stack space={2}>
                            {/* Language label + counter row */}
                            <Flex justify="space-between" align="center">
                                <Text size={0} weight="semibold" style={{ color: "#9ca3af" }}>
                                    {lang.title}
                                </Text>
                                {limit && (
                                    <Box
                                        padding={1}
                                        paddingX={2}
                                        style={{
                                            backgroundColor: isOverLimit ? "#ffeae8" : "#2a2a2a",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        <Text
                                            size={0}
                                            weight="medium"
                                            style={{
                                                fontFamily: "monospace",
                                                color: isOverLimit ? "#c4281c" : "#9ca3af",
                                                letterSpacing: "0.5px",
                                            }}
                                        >
                                            {formatCount(charCount, limit)}/{formatCount(limit, limit)}
                                        </Text>
                                    </Box>
                                )}
                            </Flex>

                            {/* Input field */}
                            <TextInput
                                value={currentValue}
                                onChange={(e) => handleChange(lang.id, e.currentTarget.value)}
                                style={{
                                    borderColor: isOverLimit ? "#c4281c" : undefined,
                                }}
                            />
                        </Stack>
                    </Card>
                );
            })}
        </Stack>
    );
}
