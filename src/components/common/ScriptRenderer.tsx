import React from "react";
import { SsrHtmlRenderer } from "./SsrHeadRenderer";

interface ScriptRendererProps {
  headScripts?: string;
  bodyScripts?: string;
  footerScripts?: string;
}

/**
 * Universal SSR Renderer for custom scripts, meta tags, and HTML snippets across Head, Body, and Footer.
 */
export default function ScriptRenderer({
  headScripts = "",
  bodyScripts = "",
  footerScripts = "",
}: ScriptRendererProps) {
  return (
    <>
      {headScripts && <SsrHtmlRenderer html={headScripts} location="head" />}
      {bodyScripts && <SsrHtmlRenderer html={bodyScripts} location="body" />}
      {footerScripts && <SsrHtmlRenderer html={footerScripts} location="footer" />}
    </>
  );
}
