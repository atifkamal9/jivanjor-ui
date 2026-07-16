"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, BlogPost } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
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
  Heading1,
  Code,
  List,
  ArrowLeft,
} from "lucide-react";

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
    category: "",
    tagsInput: "",
    author: "",
    publish_date: "",
    image: "",
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [composerPreview, setComposerPreview] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      category: "Carpentry Guide",
      tagsInput: "woodworking, carpentry, adhesives",
      author: "Admin Editor",
      publish_date: new Date().toISOString().split("T")[0],
      image: "",
    });
    setComposerPreview(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      category: blog.category,
      tagsInput: blog.tags.join(", "),
      author: blog.author,
      publish_date: blog.publish_date,
      image: blog.image || "",
    });
    setComposerPreview(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = formData.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      await api.saveBlogPost({
        id: editingId || undefined,
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        category: formData.category,
        tags,
        author: formData.author,
        publish_date: formData.publish_date,
        image: formData.image || undefined,
      });
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

  // Helper to inject text templates in content
  const injectStyle = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("blog-content-area") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = prefix + selected + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setFormData((prev) => ({ ...prev, content: newContent }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  // Filter Blogs
  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          b.content.toLowerCase().includes(search.toLowerCase()) ||
                          b.author.toLowerCase().includes(search.toLowerCase()) ||
                          b.category.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      {!isModalOpen ? (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
                Knowledge Hub & Blogs
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
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
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
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-gray-900 dark:text-zinc-50 text-base leading-snug line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        {blog.slug}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {blog.tags?.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-500 dark:bg-zinc-800/40 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-zinc-855">
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 dark:text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4 text-red-600" />
                          <span>{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-red-600" />
                          <span>{blog.publish_date}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(blog)}
                          className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer"
                          title="Edit article"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(blog.id)}
                          className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="md:col-span-2 p-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 rounded-3xl">
                No publications compiled under this filter search.
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
                  Draft rich markdown guides, technical specifications, and wood bonding articles
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setComposerPreview(!composerPreview)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 cursor-pointer border border-gray-200 dark:border-zinc-800 transition-colors"
            >
              {composerPreview ? "Toggle Editor" : "Real-Time Preview"}
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 dark:focus:border-red-500"
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
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                            Category Section
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 dark:focus:border-red-500"
                          >
                            <option value="Woodworking Guides">Woodworking Guides</option>
                            <option value="Adhesive Science">Adhesive Science</option>
                            <option value="Jivanjor Updates">Jivanjor Updates</option>
                            <option value="Technical Bulletins">Technical Bulletins</option>
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 dark:focus:border-red-500"
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 dark:focus:border-red-500"
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
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 dark:focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 flex flex-col justify-between">
                      <ImageUpload
                        label="Hero Banner Image"
                        value={formData.image}
                        onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                        folder="blog"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                        Body Content (Supports Markdown & HTML)
                      </label>
                      <div className="flex gap-1 bg-gray-50 dark:bg-zinc-800 p-1 rounded-lg border border-gray-100 dark:border-zinc-800">
                        <button
                          type="button"
                          onClick={() => injectStyle("**", "**")}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-500 dark:text-zinc-400 cursor-pointer"
                          title="Bold text"
                        >
                          <Bold className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => injectStyle("*", "*")}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-500 dark:text-zinc-400 cursor-pointer"
                          title="Italic text"
                        >
                          <Italic className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => injectStyle("\n# ", "\n")}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-500 dark:text-zinc-400 cursor-pointer"
                          title="Heading 1"
                        >
                          <Heading1 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => injectStyle("`", "`")}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-500 dark:text-zinc-400 cursor-pointer"
                          title="Code block"
                        >
                          <Code className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => injectStyle("\n- ", "\n")}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded text-gray-500 dark:text-zinc-400 cursor-pointer"
                          title="Unordered list"
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <textarea
                      id="blog-content-area"
                      required
                      value={formData.content}
                      onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article copy here... Use markdown or HTML tags for custom styles and images."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 dark:focus:border-red-500 min-h-[30vh] font-mono leading-relaxed"
                    />
                  </div>
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
                    <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50 mb-4">
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

                    <div className="text-sm text-gray-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {formData.content || "Empty content body..."}
                    </div>
                  </div>
                </div>
              )}

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
