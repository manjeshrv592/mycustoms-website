"use client";

import { useEffect, useState } from "react";
import { StringInputProps } from "sanity";
import { Box, Flex, Text } from "@sanity/ui";

/**
 * Custom string input component that displays character counter inline
 * at the end of the input field: "More Than [05/10]"
 * 
 * This component wraps the default input and adds a counter badge
 * on the right side of the input row.
 */
export function StringWithInlineCounter(props: StringInputProps) {
    const { value = "", schemaType, renderDefault, path } = props;
    const [charCount, setCharCount] = useState(0);

    // Get character limit from schema options
    const options = (schemaType as any).options || {};

    // The limit could be passed as a number directly
    let limit: number | undefined = options.characterLimit;

    // Update character count when value changes
    useEffect(() => {
        setCharCount(typeof value === "string" ? value.length : 0);
    }, [value]);

    // Format character count with leading zeros based on max digits
    const formatCount = (count: number, max: number) => {
        const digits = Math.max(max.toString().length, 2);
        return count.toString().padStart(digits, "0");
    };

    // Determine if over limit
    const isOverLimit = limit ? charCount > limit : false;

    // If no limit configured, just render the default
    if (!limit) {
        return <>{renderDefault(props)}</>;
    }

    return (
        <Flex align="center" gap={2}>
            <Box flex={1}>{renderDefault(props)}</Box>
            <Box
                padding={1}
                paddingX={2}
                style={{
                    backgroundColor: isOverLimit ? "#ffeae8" : "#2a2a2a",
                    borderRadius: "4px",
                    flexShrink: 0,
                }}
            >
                <Text
                    size={1}
                    weight="medium"
                    style={{
                        fontFamily: "monospace",
                        color: isOverLimit ? "#c4281c" : "#9ca3af",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap",
                    }}
                >
                    {formatCount(charCount, limit)}/{formatCount(limit, limit)}
                </Text>
            </Box>
        </Flex>
    );
}
