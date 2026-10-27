"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import { useEffect, useState, useRef } from "react";
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
  Table as TableIcon,
  ChevronDown,
  Columns,
  Trash2,
} from "lucide-react";

interface BlogRichEditorProps {
  value: string;
  onChange: (content: string) => void;
  title?: string;
}

const parsePlainTextToHtml = (text: string): string => {
  if (!text) return "";
  const trimmed = text.trim();

  // If already HTML formatted or contains tags, return as is
  if (/<(p|h[1-6]|ul|ol|table|blockquote|div)[\s>]/i.test(trimmed) || trimmed.startsWith("<")) {
    return text;
  }

  // Split into double-line break blocks
  const blocks = trimmed.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  const htmlParts: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    // Markdown Table Detection
    const isMarkdownTable =
      lines.length >= 2 &&
      lines.every((line) => line.includes("|")) &&
      lines.some((line) => /^[\s|:-]+$/.test(line));

    if (isMarkdownTable) {
      const rows = lines
        .filter((line) => !/^[\s|:-]+$/.test(line))
        .map((line, rIdx) => {
          const rawParts = line.split("|").map((c) => c.trim());
          if (rawParts[0] === "") rawParts.shift();
          if (rawParts[rawParts.length - 1] === "") rawParts.pop();
          const tag = rIdx === 0 ? "th" : "td";
          return `<tr>${rawParts.map((c) => `<${tag}><p>${c}</p></${tag}>`).join("")}</tr>`;
        })
        .join("");
      htmlParts.push(`<table><tbody>${rows}</tbody></table>`);
      continue;
    }

    // List detection (- or • or numbered 1.)
    const isList = lines.length > 0 && lines.every((line) => line.startsWith("-") || line.startsWith("•") || /^\d+\./.test(line));
    if (isList) {
      const items = lines
        .map((line) => line.replace(/^([-•]|\d+\.)\s*/, ""))
        .map((item) => `<li><p>${item}</p></li>`)
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
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [customCols, setCustomCols] = useState(3);
  const [customRows, setCustomRows] = useState(3);
  const tableMenuRef = useRef<HTMLDivElement>(null);

  // Close table menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setShowTableMenu(false);
      }
    };
    if (showTableMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTableMenu]);

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
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "blog-table border-collapse w-full my-4",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
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

  const insertTableWithCols = (cols: number, rows: number = 3) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setShowTableMenu(false);
  };

  const getCurrentBlockType = () => {
    if (editor.isActive("table")) return "Table";
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
      {/* Main Toolbar */}
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

          {/* Table Insertion Dropdown */}
          <div className="relative" ref={tableMenuRef}>
            <button
              type="button"
              onClick={() => setShowTableMenu((prev) => !prev)}
              className={`p-1.5 rounded cursor-pointer transition-colors flex items-center gap-1 ${
                editor.isActive("table") || showTableMenu
                  ? "bg-red-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
              }`}
              title="Insert Table (2, 3, 4 columns)"
            >
              <TableIcon className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </button>

            {showTableMenu && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-1 text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  Insert Table
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => insertTableWithCols(2, 3)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-800 dark:text-zinc-200 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Columns className="h-3.5 w-3.5 text-red-600" />
                      <strong>2 Columns</strong> (2 &times; 3)
                    </span>
                    <span className="text-[10px] text-gray-400">Header + 2 rows</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTableWithCols(3, 3)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-800 dark:text-zinc-200 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Columns className="h-3.5 w-3.5 text-red-600" />
                      <strong>3 Columns</strong> (3 &times; 3)
                    </span>
                    <span className="text-[10px] text-gray-400">Header + 2 rows</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertTableWithCols(4, 4)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-800 dark:text-zinc-200 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Columns className="h-3.5 w-3.5 text-red-600" />
                      <strong>4 Columns</strong> (4 &times; 4)
                    </span>
                    <span className="text-[10px] text-gray-400">Header + 3 rows</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 dark:border-zinc-800 pt-2 px-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Custom Grid
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1">
                      <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Cols</label>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={customCols}
                        onChange={(e) => setCustomCols(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
                        className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-zinc-700 rounded bg-gray-50 dark:bg-zinc-800 text-center font-bold"
                      />
                    </div>
                    <span className="text-xs text-gray-400 pt-3">&times;</span>
                    <div className="flex-1">
                      <label className="block text-[9px] text-gray-400 uppercase font-semibold mb-0.5">Rows</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={customRows}
                        onChange={(e) => setCustomRows(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                        className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-zinc-700 rounded bg-gray-50 dark:bg-zinc-800 text-center font-bold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => insertTableWithCols(customCols, customRows)}
                      className="mt-5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

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

      {/* Contextual Table Editing Toolbar (Appears when cursor is inside any table) */}
      {editor.isActive("table") && (
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-red-50/90 dark:bg-red-950/40 border-b border-red-200 dark:border-red-900/60 text-xs">
          <span className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1 text-[11px] uppercase tracking-wider mr-1">
            <TableIcon className="h-3.5 w-3.5" /> Table Edit:
          </span>

          {/* Column Operations */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 px-1 py-0.5 rounded-lg border border-red-200 dark:border-red-900/50">
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              className="px-2 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-gray-700 dark:text-zinc-200 text-[11px] font-semibold cursor-pointer transition-colors"
              title="Add column to the left"
            >
              + Col Left
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-gray-700 dark:text-zinc-200 text-[11px] font-semibold cursor-pointer transition-colors"
              title="Add column to the right"
            >
              + Col Right
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-2 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 text-[11px] font-semibold cursor-pointer transition-colors"
              title="Delete current column"
            >
              Delete Col
            </button>
          </div>

          {/* Row Operations */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 px-1 py-0.5 rounded-lg border border-red-200 dark:border-red-900/50">
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowBefore().run()}
              className="px-2 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-gray-700 dark:text-zinc-200 text-[11px] font-semibold cursor-pointer transition-colors"
              title="Add row above"
            >
              + Row Above
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-gray-700 dark:text-zinc-200 text-[11px] font-semibold cursor-pointer transition-colors"
              title="Add row below"
            >
              + Row Below
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-2 py-0.5 rounded hover:bg-red-100 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 text-[11px] font-semibold cursor-pointer transition-colors"
              title="Delete current row"
            >
              Delete Row
            </button>
          </div>

          {/* Header Toggle */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            className="px-2.5 py-1 bg-white/80 dark:bg-zinc-900/80 hover:bg-red-100 dark:hover:bg-red-950/60 rounded-lg border border-red-200 dark:border-red-900/50 text-[11px] font-semibold text-gray-700 dark:text-zinc-200 cursor-pointer transition-colors"
            title="Toggle header row"
          >
            Toggle Header
          </button>

          {/* Delete Table */}
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs ml-auto"
            title="Delete this entire table"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Table
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
