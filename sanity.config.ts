"use client";

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { internationalizedArray } from "sanity-plugin-internationalized-array";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure, singletonPlugin } from "./src/sanity/structure";

// Define supported languages
const languages = [
  { id: "en", title: "English" },
  { id: "nl", title: "Dutch" },
  { id: "de", title: "German" },
  { id: "cn", title: "Chinese" },
];

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    // Internationalized array plugin for tabbed language fields
    internationalizedArray({
      languages,
      defaultLanguages: ["en"],
      fieldTypes: ["string", "text", "blockContent"],
    }),
    // Singleton plugin for page documents
    singletonPlugin,
  ],
});
