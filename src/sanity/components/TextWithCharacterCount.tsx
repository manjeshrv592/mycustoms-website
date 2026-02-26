"use client";

import { useEffect, useState } from "react";
import { Stack, Text, Card, Flex } from "@sanity/ui";

interface CharacterLimitConfig {
    en: number;
    nl: number;
    de: number;
    cn: number;
}

/**
 * Custom text input component wrapper that adds a real-time character counter.
 * Uses renderDefault to preserve the default Sanity input behavior.
 * Shows "05/50" format that updates as user types.
 * For multi-line text fields.
 */
export function TextWithCharacterCount(props: any) {
    const { value = "", schemaType, renderDefault } = props;
    const [charCount, setCharCount] = useState(0);

    // Get options from schema - try multiple paths since text type may store options differently
    const options = schemaType?.options || {};
    const limitConfig = options.characterLimit;

    // Determine the limit - could be a number or per-language object
    let limit: number | undefined;
    if (typeof limitConfig === "number") {
        limit = limitConfig;
    } else if (limitConfig && typeof limitConfig === "object") {
        const language = options.language || "en";
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
            {/* Counter at the top, matching other input components */}
            <Flex justify="flex-end">
                <Card
                    padding={1}
                    paddingX={2}
                    radius={2}
                    tone={isOverLimit ? "critical" : "default"}
                    style={{
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
                </Card>
            </Flex>
            {renderDefault(props)}
        </Stack>
    );
}
