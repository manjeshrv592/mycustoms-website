import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextBlock } from "@portabletext/types";

interface PortableTextContentProps {
  value: PortableTextBlock[];
  className?: string;
}

/**
 * Custom components for rendering Sanity Portable Text
 * Includes support for images with captions
 */
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) {
        return null;
      }

      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || ""}
              fill
              className="object-cover"
            />
          </div>
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold text-white mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-white mt-4 mb-2">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-white mt-3 mb-2">{children}</h4>
    ),
    normal: ({ children }) => <p className="mb-4">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#A9081C] pl-4 my-4 italic text-gray-300">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-4 mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-4 mb-4 space-y-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[#da1b31] hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

/**
 * Renders Sanity Portable Text content with custom styling
 * Supports images, headings, lists, and text formatting
 */
export default function PortableTextContent({
  value,
  className = "",
}: PortableTextContentProps) {
  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
