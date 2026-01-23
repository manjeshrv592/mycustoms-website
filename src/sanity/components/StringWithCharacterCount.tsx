"use client";

import { useEffect, useState } from "react";
import { StringInputProps } from "sanity";
import { Stack, Text, Card, Flex, Box } from "@sanity/ui";

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
 */
export function StringWithCharacterCount(props: StringWithLimitProps) {
    const { value = "", schemaType, renderDefault } = props;
    const [charCount, setCharCount] = useState(0);

    // Get character limit from schema options
    const options = schemaType.options || {};
    const limitConfig = options.characterLimit;
    const language = options.language || "en";

    // Determine the limit - could be a number or per-language object
    let limit: number | undefined;
    if (typeof limitConfig === "number") {
        limit = limitConfig;
    } else if (limitConfig && typeof limitConfig === "object") {
        limit = (limitConfig as CharacterLimitConfig)[
            language as keyof CharacterLimitConfig
        ];
    }

    // Update character count when value changes
    useEffect(() => {
        setCharCount(typeof value === "string" ? value.length : 0);
    }, [value]);

    // Format character count with leading zero for single digits
    const formatCount = (count: number, max: number) => {
        const digits = Math.max(max.toString().length, 2);
        return count.toString().padStart(digits, "0");
    };

    // Determine if over limit
    const isOverLimit = limit ? charCount > limit : false;

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
            </Flex>
            {/* Input field */}
            {renderDefault(props)}
        </Stack>
    );
}

