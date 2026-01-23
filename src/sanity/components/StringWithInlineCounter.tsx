"use client";

import { useCallback, useMemo } from "react";
import { set, StringInputProps, unset } from "sanity";
import { Box, Flex, Text, TextInput } from "@sanity/ui";

/**
 * Custom string input component that displays character counter inline
 * at the end of the input field: "More Than [05/10]"
 * 
 * This component uses a custom TextInput with character restriction
 * to prevent users from typing beyond the max limit.
 */
export function StringWithInlineCounter(props: StringInputProps) {
    const { value = "", schemaType, onChange } = props;

    // Get character limit from schema options
    const options = (schemaType as any).options || {};

    // The limit could be passed as a number directly
    const limit: number | undefined = options.characterLimit;

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

    // Format character count with leading zeros based on max digits
    const formatCount = (count: number, max: number) => {
        const digits = Math.max(max.toString().length, 2);
        return count.toString().padStart(digits, "0");
    };

    // If no limit configured, just render the default with renderDefault
    if (!limit) {
        return <>{props.renderDefault(props)}</>;
    }

    return (
        <Flex align="center" gap={2}>
            <Box flex={1}>
                <TextInput
                    value={typeof value === "string" ? value : ""}
                    onChange={handleChange}
                    maxLength={limit}
                />
            </Box>
            <Box
                padding={1}
                paddingX={2}
                style={{
                    backgroundColor: "#2a2a2a",
                    borderRadius: "4px",
                    flexShrink: 0,
                }}
            >
                <Text
                    size={1}
                    weight="medium"
                    style={{
                        fontFamily: "monospace",
                        color: "#9ca3af",
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
