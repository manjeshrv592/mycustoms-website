"use client";

import { useCallback, useMemo } from "react";
import { set, StringInputProps, unset } from "sanity";
import { Stack, Text, Flex, Box, TextInput } from "@sanity/ui";

interface CharacterLimitConfig {
    en: number;
    nl: number;
    de: number;
    cn: number;
}

interface StringWithLimitProps extends StringInputProps {
    schemaType: StringInputProps["schemaType"] & {
        options?: {
            characterLimit?: number | CharacterLimitConfig;
            language?: string;
        };
    };
}

/**
 * Custom string input component wrapper that adds a real-time character counter.
 * Shows counter in header row above the input, similar to LocalizedStringInput.
 * Restricts character input to the max limit.
 */
export function StringWithCharacterCount(props: StringWithLimitProps) {
    const { value = "", schemaType, renderDefault, onChange } = props;

    // Get character limit from schema options
    const options = schemaType.options || {};
    const limitConfig = options.characterLimit;
    const language = options.language || "en";

    // Determine the limit - could be a number or per-language object
    const limit = useMemo(() => {
        if (typeof limitConfig === "number") {
            return limitConfig;
        } else if (limitConfig && typeof limitConfig === "object") {
            return (limitConfig as CharacterLimitConfig)[
                language as keyof CharacterLimitConfig
            ];
        }
        return undefined;
    }, [limitConfig, language]);

    // Handle input change with character restriction
    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.currentTarget.value;

            // Truncate the value if it exceeds the limit
            const truncatedValue = limit && newValue.length > limit
                ? newValue.slice(0, limit)
                : newValue;

            if (truncatedValue) {
                onChange(set(truncatedValue));
            } else {
                onChange(unset());
            }
        },
        [onChange, limit]
    );

    // Get current character count
    const charCount = typeof value === "string" ? value.length : 0;

    // Format character count with leading zero for single digits
    const formatCount = (count: number, max: number) => {
        const digits = Math.max(max.toString().length, 2);
        return count.toString().padStart(digits, "0");
    };

    // If no limit configured, just render the default
    if (!limit) {
        return renderDefault(props);
    }

    return (
        <Stack space={2}>
            {/* Header row with counter on the right */}
            <Flex justify="flex-end" align="center">
                <Box
                    padding={1}
                    paddingX={2}
                    style={{
                        borderRadius: "4px",
                    }}
                >
                    <Text
                        size={0}
                        weight="medium"
                        style={{
                            fontFamily: "monospace",
                            color: "#9ca3af",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {formatCount(charCount, limit)}/{formatCount(limit, limit)}
                    </Text>
                </Box>
            </Flex>
            {/* Input field with character restriction */}
            <TextInput
                value={typeof value === "string" ? value : ""}
                onChange={handleChange}
                maxLength={limit}
            />
        </Stack>
    );
}

