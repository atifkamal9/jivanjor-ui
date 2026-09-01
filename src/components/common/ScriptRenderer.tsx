"use client";

import { useEffect, useRef } from "react";

interface ScriptRendererProps {
  headScripts?: string;
  bodyScripts?: string;
  footerScripts?: string;
}

export default function ScriptRenderer({
  headScripts = "",
  bodyScripts = "",
  footerScripts = "",
}: ScriptRendererProps) {
  const injectedRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    // Clean up previously injected elements
    injectedRef.current.forEach((el) => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    injectedRef.current = [];

    const injectSnippet = (rawHtml: string, target: HTMLElement, position: "append" | "prepend") => {
      if (!rawHtml || !rawHtml.trim()) return;

      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, "text/html");

      // Extract all script elements and non-script elements from the parsed doc
      const nodes = Array.from(doc.head.childNodes).concat(Array.from(doc.body.childNodes));

      nodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (el.tagName === "SCRIPT") {
            const script = document.createElement("script");
            Array.from(el.attributes).forEach((attr) => {
              script.setAttribute(attr.name, attr.value);
            });
            script.text = el.innerHTML;
            script.setAttribute("data-jivanjor-custom-script", "true");

            if (position === "prepend" && target.firstChild) {
              target.insertBefore(script, target.firstChild);
            } else {
              target.appendChild(script);
            }
            injectedRef.current.push(script);
          } else {
            const cloned = el.cloneNode(true) as HTMLElement;
            cloned.setAttribute("data-jivanjor-custom-element", "true");

            if (position === "prepend" && target.firstChild) {
              target.insertBefore(cloned, target.firstChild);
            } else {
              target.appendChild(cloned);
            }
            injectedRef.current.push(cloned);
          }
        }
      });
    };

    // Inject Head Scripts into document.head
    if (headScripts) {
      injectSnippet(headScripts, document.head, "append");
    }

    // Inject Body Scripts at the beginning of document.body
    if (bodyScripts) {
      injectSnippet(bodyScripts, document.body, "prepend");
    }

    // Inject Footer Scripts at the end of document.body
    if (footerScripts) {
      injectSnippet(footerScripts, document.body, "append");
    }

    return () => {
      injectedRef.current.forEach((el) => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      injectedRef.current = [];
    };
  }, [headScripts, bodyScripts, footerScripts]);

  return null;
}
