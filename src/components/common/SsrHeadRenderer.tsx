import React from "react";

export const DEFAULT_HEAD_SCRIPTS = `<meta name="google-site-verification" content="7nyrS05tsfB0z8AuZOUzjOymZdinnDqL1HXbWNxi-Mk" />
<meta name="msvalidate.01" content="BBDC037359A5048E914423506D41E929" />
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JS98QGT5QS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JS98QGT5QS');
</script>`;

export const DEFAULT_BODY_SCRIPTS = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=G-JS98QGT5QS" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;

const ATTR_NAME_MAP: Record<string, string> = {
  "http-equiv": "httpEquiv",
  charset: "charSet",
  crossorigin: "crossOrigin",
  class: "className",
  for: "htmlFor",
  itemprop: "itemProp",
  itemscope: "itemScope",
  itemtype: "itemType",
  "accept-charset": "acceptCharset",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  tabindex: "tabIndex",
  readonly: "readOnly",
};

const VOID_TAGS = new Set([
  "meta",
  "link",
  "base",
  "img",
  "br",
  "hr",
  "input",
  "source",
  "wbr",
  "col",
  "area",
  "embed",
  "param",
  "track",
]);

export interface ParsedHtmlElement {
  tag: string;
  attrs: Record<string, any>;
  content?: string;
}

/**
 * Converts CSS inline style string (e.g. "display:none;visibility:hidden")
 * into a React style object to prevent React SSR style warnings.
 */
function parseStyleString(styleStr: string): Record<string, string> {
  const styleObj: Record<string, string> = {};
  if (!styleStr || typeof styleStr !== "string") return styleObj;

  styleStr.split(";").forEach((pair) => {
    const colonIndex = pair.indexOf(":");
    if (colonIndex > -1) {
      const key = pair.slice(0, colonIndex).trim();
      const val = pair.slice(colonIndex + 1).trim();
      if (key && val) {
        // Convert kebab-case (e.g. z-index, margin-top) to camelCase
        const camelKey = key.replace(/-([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        );
        styleObj[camelKey] = val;
      }
    }
  });

  return styleObj;
}

/**
 * Parses raw HTML attribute string into a key-value object compatible with React props.
 */
export function parseAttributes(attrString: string): Record<string, any> {
  const attrs: Record<string, any> = {};
  if (!attrString || !attrString.trim()) return attrs;

  // Regex to match: name="val", name='val', name=val, or boolean name
  const attrRegex = /([a-zA-Z0-9:_-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;

  while ((match = attrRegex.exec(attrString)) !== null) {
    const rawName = match[1];
    if (!rawName || rawName === "/") continue;

    const lowerName = rawName.toLowerCase();
    const propName = ATTR_NAME_MAP[lowerName] || rawName;
    const value =
      match[2] !== undefined
        ? match[2]
        : match[3] !== undefined
          ? match[3]
          : match[4] !== undefined
            ? match[4]
            : true;

    if (lowerName === "style" && typeof value === "string") {
      attrs.style = parseStyleString(value);
    } else {
      attrs[propName] = value;
    }
  }

  return attrs;
}

/**
 * Server-side parser that converts raw HTML string (meta, link, script, style, noscript, iframe, div, etc.)
 * into structured elements to be rendered as first-class React SSR elements.
 */
export function parseHtmlSnippets(html: string): ParsedHtmlElement[] {
  if (!html || !html.trim()) return [];

  // Strip HTML comments
  const cleanHtml = html.replace(/<!--[\s\S]*?-->/g, "").trim();
  if (!cleanHtml) return [];

  const elements: ParsedHtmlElement[] = [];
  const tagRegex = /<([a-zA-Z0-9:_-]+)((?:\s+[^>]*)?)(\/?>)/g;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(cleanHtml)) !== null) {
    const tagName = match[1].toLowerCase();
    const rawAttrs = match[2] || "";
    const isSelfClosing = match[3] === "/>" || match[0].endsWith("/>");
    const attrs = parseAttributes(rawAttrs);

    if (VOID_TAGS.has(tagName) || isSelfClosing) {
      elements.push({ tag: tagName, attrs });
    } else {
      // Find matching closing tag </tagName>
      const closingTag = `</${match[1]}>`;
      const closingIndex = cleanHtml
        .toLowerCase()
        .indexOf(closingTag.toLowerCase(), tagRegex.lastIndex);

      if (closingIndex !== -1) {
        const content = cleanHtml.slice(tagRegex.lastIndex, closingIndex);
        elements.push({ tag: tagName, attrs, content });
        tagRegex.lastIndex = closingIndex + closingTag.length;
      } else {
        elements.push({ tag: tagName, attrs });
      }
    }
  }

  return elements;
}

/**
 * React Server Component that dynamically renders custom HTML snippets (meta tags, scripts,
 * noscripts, iframes, styles) directly during Server-Side Rendering (SSR).
 */
export function SsrHtmlRenderer({
  html,
  location = "head",
}: {
  html?: string;
  location?: "head" | "body" | "footer";
}) {
  if (!html || !html.trim()) return null;

  const elements = parseHtmlSnippets(html);
  if (elements.length === 0) return null;

  return (
    <>
      {elements.map((el, index) => {
        const key = `ssr-${location}-${el.tag}-${index}`;

        if (el.tag === "meta") {
          return <meta key={key} {...el.attrs} />;
        }
        if (el.tag === "link") {
          return <link key={key} {...el.attrs} />;
        }
        if (el.tag === "script") {
          return (
            <script
              key={key}
              {...el.attrs}
              dangerouslySetInnerHTML={
                el.content ? { __html: el.content } : undefined
              }
            />
          );
        }
        if (el.tag === "style") {
          return (
            <style
              key={key}
              {...el.attrs}
              dangerouslySetInnerHTML={
                el.content ? { __html: el.content } : undefined
              }
            />
          );
        }
        if (el.tag === "noscript") {
          return (
            <noscript
              key={key}
              {...el.attrs}
              dangerouslySetInnerHTML={
                el.content ? { __html: el.content } : undefined
              }
            />
          );
        }

        return React.createElement(
          el.tag,
          {
            key,
            ...el.attrs,
            dangerouslySetInnerHTML: el.content
              ? { __html: el.content }
              : undefined,
          }
        );
      })}
    </>
  );
}

/**
 * Default export as SsrHeadRenderer for backwards compatibility
 */
export default function SsrHeadRenderer({ html }: { html?: string }) {
  return <SsrHtmlRenderer html={html} location="head" />;
}
