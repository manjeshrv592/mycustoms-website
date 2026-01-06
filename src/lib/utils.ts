import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Splits a title into regular and bold parts based on word count.
 * - 1 word: all bold
 * - 2 words: first regular, second bold
 * - 3+ words: Math.floor(wordCount/2) words regular, rest bold
 */
export function formatTitle(title: string): {
  regularPart: string;
  boldPart: string;
} {
  const words = title.split(" ");
  const wordCount = words.length;

  if (wordCount === 1) {
    return { regularPart: "", boldPart: title };
  }

  const regularWordCount = Math.floor(wordCount / 2);
  const regularPart = words.slice(0, regularWordCount).join(" ");
  const boldPart = words.slice(regularWordCount).join(" ");

  return { regularPart, boldPart };
}
