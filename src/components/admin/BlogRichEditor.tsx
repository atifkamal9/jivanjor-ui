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
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  Eraser,
} from "lucide-react";

interface BlogRichEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function BlogRichEditor({ value, onChange }: BlogRichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
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
    content: value,
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
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
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

  return (
    <div className="space-y-0 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-100 dark:bg-zinc-800 p-2 border-b border-gray-200 dark:border-zinc-700">
        <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider px-2">
          Blog Content Editor
        </span>

        <div className="flex flex-wrap items-center gap-1">
          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-1.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
              editor.isActive("heading", { level: 1 })
                ? "bg-red-600 text-white"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
            }`}
            title="Heading 1"
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
            title="Heading 2"
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
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
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
