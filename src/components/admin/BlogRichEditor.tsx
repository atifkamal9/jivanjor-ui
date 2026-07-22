"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  Eraser,
} from "lucide-react";

interface BlogRichEditorProps {
  value: string;
  onChange: (content: string) => void;
  title?: string;
}

const parsePlainTextToHtml = (text: string): string => {
  if (!text) return "";
  const trimmed = text.trim();

  // If already HTML formatted, return as is
  if (trimmed.startsWith("<")) {
    return text;
  }

  // Split into double-line break blocks
  const blocks = trimmed.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  const htmlParts: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    // List detection (- or • or numbered 1.)
    const isList = lines.length > 0 && lines.every((line) => line.startsWith("-") || line.startsWith("•") || /^\d+\./.test(line));
    if (isList) {
      const items = lines
        .map((line) => line.replace(/^([-•]|\d+\.)\s*/, ""))
        .map((item) => `<li>${item}</li>`)
        .join("");
      htmlParts.push(`<ul>${items}</ul>`);
      continue;
    }

    // Heading auto-detection (single line under 80 chars without ending punctuation)
    const isSingleLine = !block.includes("\n");
    const noEndingPunctuation = !/[.!?]$/.test(block);
    const notListPrefix = !block.startsWith("-") && !block.startsWith("•");

    if (isSingleLine && notListPrefix && block.length < 80 && noEndingPunctuation) {
      if (block.length < 35) {
        htmlParts.push(`<h2>${block}</h2>`);
      } else {
        htmlParts.push(`<h3>${block}</h3>`);
      }
      continue;
    }

    // Standard Paragraph
    htmlParts.push(`<p>${block.replace(/\n/g, "<br/>")}</p>`);
  }

  return htmlParts.join("");
};

export default function BlogRichEditor({ value, onChange, title = "Content Editor" }: BlogRichEditorProps) {
  const formattedContent = parsePlainTextToHtml(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#FF0009] underline font-medium",
        },
      }),
    ],
    content: formattedContent,
    editorProps: {
      attributes: {
        class:
          "w-full px-5 py-4 rounded-b-xl border border-t-0 border-gray-200 bg-white text-gray-900 outline-none focus:ring-2 focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-955 dark:text-zinc-100 min-h-[350px] shadow-inner leading-relaxed blog-editor-content prose-content focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor) {
      const targetHtml = parsePlainTextToHtml(value);
      if (targetHtml !== editor.getHTML()) {
        editor.commands.setContent(targetHtml);
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const getCurrentBlockType = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    if (editor.isActive("heading", { level: 4 })) return "Heading 4";
    if (editor.isActive("blockquote")) return "Blockquote";
    if (editor.isActive("bulletList")) return "Bullet List";
    if (editor.isActive("orderedList")) return "Numbered List";
    if (editor.isActive("paragraph")) return "Paragraph (p)";
    return "Paragraph (p)";
  };

  return (
    <div className="space-y-0 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-100 dark:bg-zinc-800 p-2 border-b border-gray-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider px-2">
            {title}
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 tracking-wide uppercase">
            {getCurrentBlockType()}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {/* Paragraph / Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
              editor.isActive("paragraph")
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Paragraph / Normal Text (p)"
          >
            <Pilcrow className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
              editor.isActive("heading", { level: 1 })
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Heading 1 (h1)"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
              editor.isActive("heading", { level: 2 })
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Heading 2 (h2)"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
              editor.isActive("heading", { level: 3 })
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Heading 3 (h3)"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`p-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
              editor.isActive("heading", { level: 4 })
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Heading 4 (h4)"
          >
            <Heading4 className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-gray-300 dark:bg-zinc-700 mx-1" />

          {/* Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded cursor-pointer transition-colors ${
              editor.isActive("bold")
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded cursor-pointer transition-colors ${
              editor.isActive("italic")
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded cursor-pointer transition-colors ${
              editor.isActive("underline")
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Underline"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded cursor-pointer transition-colors ${
              editor.isActive("strike")
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-gray-300 dark:bg-zinc-700 mx-1" />

          {/* Lists & Blockquote */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded cursor-pointer transition-colors ${
              editor.isActive("bulletList")
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded cursor-pointer transition-colors ${
              editor.isActive("orderedList")
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded cursor-pointer transition-colors ${
              editor.isActive("blockquote")
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-gray-300 dark:bg-zinc-700 mx-1" />

          {/* Links */}
          <button
            type="button"
            onClick={setLink}
            className={`p-1.5 rounded cursor-pointer transition-colors ${
              editor.isActive("link")
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Insert Link"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          {editor.isActive("link") && (
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-700 dark:text-zinc-300 cursor-pointer"
              title="Remove Link"
            >
              <Unlink className="h-4 w-4" />
            </button>
          )}

          <div className="h-4 w-px bg-gray-300 dark:bg-zinc-700 mx-1" />

          {/* Clear & Undo/Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-700 dark:text-zinc-300 cursor-pointer"
            title="Clear Formatting"
          >
            <Eraser className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded text-gray-700 dark:text-zinc-300 cursor-pointer"
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded text-gray-700 dark:text-zinc-300 cursor-pointer"
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
