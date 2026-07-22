"use client";

import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, BlogPost, SeoMetadata } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
import BlogRichEditor from "@/components/admin/BlogRichEditor";
import { BLOG_POST_CATEGORIES } from "@/lib/blog-categories";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Sparkles,
  BookOpen,
  User,
  Calendar,
  Tag as TagIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Palette,
  Eraser,
  ArrowLeft,
  Eye,
  Globe,
  FileSearch,
  Image as ImageIcon,
} from "lucide-react";

type ComposerTab = "article" | "seo";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    category: BLOG_POST_CATEGORIES[0] || "Application Tips",
    tagsInput: "",
    author: "",
    author_description: "",
    author_avatar: "",
    publish_date: "",
    image: "",
    tldr: "",
  });

  // SEO state
  const [seoData, setSeoData] = useState({
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    image: "",
  });
  const [existingSeoId, setExistingSeoId] = useState<string | null>(null);

  const [composerTab, setComposerTab] = useState<ComposerTab>("article");
  const [composerPreview, setComposerPreview] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ContentEditable Editor Ref
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Sync editor innerHTML when modal opens or editing post changes
  useEffect(() => {
    if (isModalOpen && editorRef.current && !composerPreview) {
      if (editorRef.current.innerHTML !== formData.content) {
        editorRef.current.innerHTML = formData.content;
      }
    }
  }, [isModalOpen, composerPreview]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getBlogPosts();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to load blog posts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const resetSeo = () => {
    setSeoData({ meta_title: "", meta_description: "", canonical_url: "", image: "" });
    setExistingSeoId(null);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      content: "<p>Write your article content here...</p>",
      category: BLOG_POST_CATEGORIES[0] || "Application Tips",
      tagsInput: "woodworking, carpentry, adhesives",
      author: "Admin Editor",
      author_description: "Knowledge shaped by Jivanjor's team of product specialists, woodworking experts and professionals.",
      author_avatar: "",
      publish_date: new Date().toISOString().split("T")[0],
      image: "",
      tldr: "",
    });
    resetSeo();
    setComposerPreview(false);
    setComposerTab("article");
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (blog: BlogPost) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      category: blog.category || BLOG_POST_CATEGORIES[0],
      tagsInput: (blog.tags || []).join(", "),
      author: blog.author,
      author_description: blog.author_description || blog.authorDescription || "",
      author_avatar: blog.author_avatar || blog.authorAvatar || "",
      publish_date: blog.publish_date,
      image: blog.image || "",
      tldr: blog.tldr || "",
    });
    resetSeo();
    setComposerPreview(false);
    setComposerTab("article");
    setIsModalOpen(true);

    // Load existing SEO for this blog post
    try {
      const allSeo = await api.getSeoMetadata();
      const existing = allSeo.find(
        (s) => s.page_type === "blog" && s.page_id === blog.id
      );
      if (existing) {
        setSeoData({
          meta_title: existing.meta_title || "",
          meta_description: existing.meta_description || "",
          canonical_url: existing.canonical_url || "",
          image: existing.image || "",
        });
        setExistingSeoId(existing.id);
      }
    } catch {
      // silently ignore — SEO is optional
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentContent = editorRef.current ? editorRef.current.innerHTML : formData.content;
    const tags = formData.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const saved = await api.saveBlogPost({
        id: editingId || undefined,
        title: formData.title,
        slug: formData.slug,
        content: currentContent,
        category: formData.category,
        tags,
        author: formData.author,
        author_description: formData.author_description,
        author_avatar: formData.author_avatar,
        publish_date: formData.publish_date,
        image: formData.image || undefined,
        tldr: formData.tldr || undefined,
      });

      // Save SEO if any field is filled
      const hasSeo =
        seoData.meta_title ||
        seoData.meta_description ||
        seoData.canonical_url ||
        seoData.image;
      if (hasSeo) {
        await api.saveSeoMetadata({
          id: existingSeoId || undefined,
          page_type: "blog",
          page_id: saved.id,
          meta_title: seoData.meta_title,
          meta_description: seoData.meta_description,
          canonical_url: seoData.canonical_url,
          image: seoData.image || undefined,
        });
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save blog post", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteBlogPost(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete blog post", err);
    }
  };

  // Rich Text Editing ExecCommands
  const execCmd = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      setFormData((prev) => ({
        ...prev,
        content: editorRef.current ? editorRef.current.innerHTML : prev.content,
      }));
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setFormData((prev) => ({
        ...prev,
        content: editorRef.current!.innerHTML,
      }));
    }
  };

  const handleAddLink = () => {
    const url = prompt("Enter link URL:", "https://");
    if (url) {
      execCmd("createLink", url);
    }
  };

  // Filter Blogs
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.content.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      (b.category && b.category.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

  // Composer Tabs Config
  const composerTabs: { id: ComposerTab; label: string; icon: React.ReactNode }[] = [
    { id: "article", label: "Article Content", icon: <BookOpen className="h-4 w-4" /> },
    { id: "seo", label: "SEO Settings", icon: <Globe className="h-4 w-4" /> },
  ];

  return (
    <AdminLayout>
      {!isModalOpen ? (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
                Knowledge Hub &amp; Blogs
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Compose wood science publications, guidebooks, and announcements
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Compose Article</span>
            </button>
          </div>

          {/* Filters Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm transition-colors duration-300">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-50" />
              <input
                type="text"
                placeholder="Search posts, writers, guides..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 dark:focus:border-red-500"
              />
            </div>
          </div>

          {/* Blog Post List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="md:col-span-2 p-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 rounded-3xl">
                <div className="flex flex-col items-center gap-3 justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                  <span>Retrieving publications from database...</span>
                </div>
              </div>
            ) : currentBlogs.length > 0 ? (
              currentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="h-48 w-full bg-gray-50 dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-800 overflow-hidden relative flex items-center justify-center">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-10 w-10 text-gray-300 dark:text-zinc-600" />
                    )}
                    <span className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {blog.category || "General"}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-3">
                    <h3 className="text-base font-black text-gray-900 dark:text-zinc-50 leading-snug line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> {blog.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {blog.publish_date}
                      </span>
                    </div>
                    {blog.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {blog.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-full border border-red-100 dark:border-red-900/30 flex items-center gap-1"
                          >
                            <TagIcon className="h-2.5 w-2.5" /> {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-zinc-800">
                      <button
                        onClick={() => handleOpenEdit(blog)}
                        className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-500 border border-gray-200 dark:border-zinc-800 cursor-pointer transition-colors"
                        title="Edit publication"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(blog.id)}
                        className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 border border-gray-200 dark:border-zinc-800 cursor-pointer transition-colors"
                        title="Delete publication"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 p-16 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-center rounded-3xl">
                <BookOpen className="h-12 w-12 text-gray-200 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500">
                  No publications found. Compose your first article.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm transition-colors duration-300">
              <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out] max-w-5xl">
          {/* Header Workspace Title Bar */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-5 gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-surface hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 cursor-pointer transition-all"
                title="Discard changes"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-red-600" />
                  <span>{editingId ? "Revise Knowledge Publication" : "Draft New Scientific Publication"}</span>
                </h1>
                <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                  Draft rich articles with real-time styling editor
                </p>
              </div>
            </div>

            {composerTab === "article" && (
              <button
                type="button"
                onClick={() => setComposerPreview(!composerPreview)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 cursor-pointer border border-gray-200 dark:border-zinc-800 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>{composerPreview ? "Toggle Editor" : "Real-Time Preview"}</span>
              </button>
            )}
          </div>

          {/* Composer Tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-zinc-800/60 p-1 rounded-xl w-fit border border-gray-200 dark:border-zinc-700">
            {composerTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setComposerTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  composerTab === tab.id
                    ? "bg-white dark:bg-zinc-900 text-red-600 shadow-sm border border-gray-200 dark:border-zinc-700"
                    : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ARTICLE TAB */}
              {composerTab === "article" && (
                <>
                  {!composerPreview ? (
                    <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                              Article Title
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.title}
                              onChange={(e) => handleTitleChange(e.target.value)}
                              placeholder="e.g. Mechanics of Polyvinyl Acetate bonding"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span>URL Slug Link</span>
                              <span className="text-[10px] text-red-500 flex items-center gap-1 font-bold">
                                <Sparkles className="h-3 w-3" /> AUTO
                              </span>
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.slug}
                              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                              placeholder="mechanics-of-polyvinyl-acetate"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                              TLDR Summary / Highlights
                            </label>
                            <textarea
                              rows={2}
                              value={formData.tldr}
                              onChange={(e) => setFormData((prev) => ({ ...prev, tldr: e.target.value }))}
                              placeholder="e.g. Laminate bubbling is a common failure point in coastal interior woodwork. This guide covers..."
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 resize-none font-medium"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Category Selector */}
                            <div>
                              <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                                Category Section
                              </label>
                              <select
                                value={formData.category}
                                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                              >
                                {BLOG_POST_CATEGORIES.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                                Tags (Comma Separated)
                              </label>
                              <input
                                type="text"
                                value={formData.tagsInput}
                                onChange={(e) => setFormData((prev) => ({ ...prev, tagsInput: e.target.value }))}
                                placeholder="e.g. glue, craft, plywood"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                                Author/Publisher Name
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.author}
                                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                                placeholder="e.g. Dr. Wood Glue"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                                Publish Date
                              </label>
                              <input
                                type="date"
                                required
                                value={formData.publish_date}
                                onChange={(e) => setFormData((prev) => ({ ...prev, publish_date: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                              Author Bio / Description
                            </label>
                            <textarea
                              rows={2}
                              value={formData.author_description}
                              onChange={(e) => setFormData((prev) => ({ ...prev, author_description: e.target.value }))}
                              placeholder="e.g. Knowledge shaped by Jivanjor's team of product specialists, woodworking experts..."
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 resize-none font-medium"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 flex flex-col justify-between">
                          <ImageUpload
                            label="Hero Banner Image"
                            value={formData.image}
                            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                            folder="blog"
                            aspect="square"
                          />
                          <ImageUpload
                            label="Author Avatar Photo"
                            value={formData.author_avatar}
                            onChange={(url) => setFormData((prev) => ({ ...prev, author_avatar: url }))}
                            folder="authors"
                            aspect="square"
                          />
                        </div>
                      </div>

                      {/* TipTap WYSIWYG Rich Text Content Editor */}
                      <BlogRichEditor
                        value={formData.content}
                        onChange={(html) =>
                          setFormData((prev) => ({ ...prev, content: html }))
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-4 animate-[fadeIn_0.15s_ease-out]">
                      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                        <Sparkles className="h-5 w-5 text-red-600 animate-pulse" />
                        <h4 className="text-sm font-black text-gray-900 dark:text-zinc-50 uppercase tracking-wider">
                          Real-Time Layout Render
                        </h4>
                      </div>

                      <div className="bg-gray-50 dark:bg-zinc-955 border border-gray-100 dark:border-zinc-900 rounded-3xl p-6 overflow-y-auto max-h-[60vh] prose dark:prose-invert max-w-none">
                        <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50 mb-4 font-amethysta">
                          {formData.title || "Untitled Article Specification"}
                        </h1>
                        <div className="flex gap-4 text-xs text-gray-400 mb-6 font-bold uppercase tracking-wider">
                          <span>Author: {formData.author}</span>
                          <span>Published: {formData.publish_date}</span>
                          <span>Category: {formData.category}</span>
                        </div>

                        {formData.image && (
                          <img
                            src={formData.image}
                            alt={formData.title}
                            className="w-full max-h-80 object-cover rounded-2xl mb-6 border border-gray-200 dark:border-zinc-800"
                          />
                        )}

                        {formData.tldr && (
                          <div className="bg-red-50/40 dark:bg-red-950/15 border-l-4 border-red-600 p-4 mb-6 rounded-r-xl font-sans">
                            <span className="block text-[10px] font-black uppercase text-red-600 dark:text-red-400 tracking-wider mb-1">TLDR Summary / Key Highlights</span>
                            <p className="text-xs text-gray-700 dark:text-zinc-300 font-medium leading-relaxed">{formData.tldr}</p>
                          </div>
                        )}

                        <div
                          className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed blog-editor-content prose-content"
                          dangerouslySetInnerHTML={{ __html: formData.content || "<p>Empty content...</p>" }}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* SEO TAB */}
              {composerTab === "seo" && (
                <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                  {/* Header */}
                  <div className="flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800 pb-4">
                    <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
                      <Globe className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-zinc-50 uppercase tracking-wider">
                        SEO Settings
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium mt-0.5">
                        Optimise this article for search engines. These fields are optional — leave blank to skip.
                      </p>
                    </div>
                  </div>

                  {/* Preview snippet */}
                  {(seoData.meta_title || seoData.meta_description) && (
                    <div className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/10 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">Google Snippet Preview</span>
                      <p className="text-[15px] font-semibold text-blue-700 dark:text-blue-400 truncate leading-tight">
                        {seoData.meta_title || formData.title || "Untitled Article"}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-500 font-medium truncate">
                        {seoData.canonical_url || `https://jivanjor.com/blog/${formData.slug || "..."}`}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                        {seoData.meta_description || "No meta description set."}
                      </p>
                    </div>
                  )}

                  {/* Meta Title */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      <FileSearch className="h-3.5 w-3.5" />
                      Meta Title
                      <span className={`ml-auto text-[10px] font-bold ${seoData.meta_title.length > 60 ? "text-red-500" : "text-gray-300 dark:text-zinc-650"}`}>
                        {seoData.meta_title.length}/60
                      </span>
                    </label>
                    <input
                      type="text"
                      value={seoData.meta_title}
                      onChange={(e) => setSeoData((prev) => ({ ...prev, meta_title: e.target.value }))}
                      placeholder={formData.title || "e.g. Mechanics of Polyvinyl Acetate | Jivanjor Blog"}
                      maxLength={80}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                    />
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-medium">
                      Recommended: 50–60 characters. Defaults to article title if left blank.
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      <FileSearch className="h-3.5 w-3.5" />
                      Meta Description
                      <span className={`ml-auto text-[10px] font-bold ${seoData.meta_description.length > 160 ? "text-red-500" : "text-gray-300 dark:text-zinc-655"}`}>
                        {seoData.meta_description.length}/160
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      value={seoData.meta_description}
                      onChange={(e) => setSeoData((prev) => ({ ...prev, meta_description: e.target.value }))}
                      placeholder="A concise summary of this article displayed under the title in search results…"
                      maxLength={200}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 resize-none"
                    />
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-medium">
                      Recommended: 120–160 characters.
                    </p>
                  </div>

                  {/* Canonical URL */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      <Globe className="h-3.5 w-3.5" />
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      value={seoData.canonical_url}
                      onChange={(e) => setSeoData((prev) => ({ ...prev, canonical_url: e.target.value }))}
                      placeholder={`https://jivanjor.com/blog/${formData.slug || "article-slug"}`}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                    />
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-medium">
                      Only set if this content appears at multiple URLs (avoids duplicate content penalties).
                    </p>
                  </div>

                  {/* OG / Twitter Meta Image */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Social Share Image (OG Image)
                    </label>
                    <ImageUpload
                      value={seoData.image}
                      onChange={(url) => setSeoData((prev) => ({ ...prev, image: url }))}
                      folder="seo"
                      label="Upload Meta / OG Image"
                      aspect="square"
                    />
                    <p className="text-[10px] text-gray-400 dark:text-zinc-600 font-medium">
                      Recommended size: 1200×630px. Used for Open Graph (Facebook, LinkedIn, Twitter cards). Defaults to the hero banner if left blank.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg"
                >
                  {editingId ? "Save Modifications" : "Publish Publication"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRM DIALOG ==================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 animate-[modalShow_0.15s_ease-out]">
            <h3 className="text-lg font-black text-gray-900 dark:text-zinc-50">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-normal font-medium">
              Are you absolutely sure you want to delete this publication? This will permanently erase this knowledge asset from Jivanjor catalogs.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
