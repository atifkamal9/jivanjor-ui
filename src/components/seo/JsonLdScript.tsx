import React from "react";
import {
  PageSchemaConfig,
  buildJivanjorSchema,
  serializeSafeJsonLd,
} from "@/lib/structured-data";

interface JsonLdScriptProps {
  config: PageSchemaConfig;
}

export default function JsonLdScript({ config }: JsonLdScriptProps) {
  const graph = buildJivanjorSchema(config);
  const safeJsonLd = serializeSafeJsonLd(graph);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd }}
    />
  );
}
