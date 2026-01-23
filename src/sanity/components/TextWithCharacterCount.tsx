"use client";

import { useEffect, useState } from "react";
import { StringInputProps } from "sanity";
import { Stack, Text, Card, Flex } from "@sanity/ui";

interface CharacterLimitConfig {
    en: number;
    nl: number;
    de: number;
    cn: number;
}

interface TextWithLimitProps extends StringInputProps {
    schemaType: StringInputProps["schemaType"] & {
        options?: {
            characterLimit?: number | CharacterLimitConfig;
            language?: string;
            rows?: number;
        };
    };
}

/**
 * Custom text input component wrapper that adds a real-time character counter.
 * Uses renderDefault to preserve the default Sanity input behavior.
 * Shows "05/50" format that updates as user types.
 * For multi-line text fields.
 */
export function TextWithCharacterCount(props: TextWithLimitProps) {
    const { value = "", schemaType, renderDefault } = props;
    const [charCount, setCharCount] = useState(0);

    // Get options from schema
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
        const digits = max.toString().length;
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
            {renderDefault(props)}
            <Flex justify="flex-end">
                <Card
                    padding={1}
                    paddingX={2}
                    radius={2}
                    tone={isOverLimit ? "critical" : "default"}
                    style={{
                        backgroundColor: isOverLimit ? "#ffeae8" : "#f3f3f3",
                    }}
                >
                    <Text
                        size={1}
                        weight="medium"
                        style={{
                            fontFamily: "monospace",
                            color: isOverLimit ? "#c4281c" : "#6b7280",
                            letterSpacing: "0.5px",
                        }}
                    >
                        {formatCount(charCount, limit)}/{formatCount(limit, limit)}
                    </Text>
                </Card>
            </Flex>
        </Stack>
    );
}
