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
            <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
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
                className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Image/Placeholder Banner */}
                  <div className="h-44 w-full bg-gray-100 dark:bg-zinc-800 rounded-2xl overflow-hidden relative flex items-center justify-center border border-gray-200 dark:border-zinc-700">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <BookOpen className="h-8 w-8" />
                        <span className="text-xs font-bold uppercase tracking-wider">No Banner Image</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-md">
                      {blog.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-gray-900 dark:text-zinc-50 leading-normal line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      {blog.slug}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-3 leading-normal font-medium">
                      {blog.content}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800 space-y-4">
                  {/* Meta Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-gray-50 text-gray-500 dark:bg-zinc-950 dark:text-zinc-400"
                      >
                        <TagIcon className="h-2.5 w-2.5" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>

                  {/* Footing */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 dark:text-zinc-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        <span>{blog.author}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{blog.publish_date}</span>
                      </span>
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

        {/* ==================== WRITE/EDIT MODAL ==================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl animate-[modalShow_0.2s_ease-out]">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-red-600" />
                  <span>{editingId ? "Revise Knowledge Publication" : "Draft New Scientific Publication"}</span>
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setComposerPreview(!composerPreview)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-zinc-850 dark:text-zinc-300 cursor-pointer"
                  >
                    {composerPreview ? "Toggle Editor" : "Real-Time Preview"}
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {composerPreview ? (
                  /* ================= PREVIEW MODE ================= */
                  <div className="space-y-6 min-h-[40vh] p-4 bg-gray-50/50 dark:bg-zinc-950/50 rounded-2xl leading-normal">
                    <div className="space-y-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-600 text-white">
                        {formData.category}
                      </span>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
                        {formData.title || "Untitled Article Draft"}
                      </h2>
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                        <span>By {formData.author}</span>
                        <span>•</span>
                        <span>Published {formData.publish_date}</span>
                      </div>
                    </div>

                    {formData.image && (
                      <div className="h-64 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800">
                        <img src={formData.image} alt="Preview Banner" className="h-full w-full object-cover" />
                      </div>
                    )}

                    <div className="text-gray-700 dark:text-zinc-300 text-sm whitespace-pre-wrap leading-normal font-medium">
                      {formData.content || "Empty content. Begin typing in editor panel to populate details."}
                    </div>
                  </div>
                ) : (
                  /* ================= EDITOR PANEL ================= */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Article Title
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="e.g. 5 Adhesives Chemistry Secrets"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>Article URL Slug</span>
                          <span className="text-[10px] text-red-500 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Auto
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                          placeholder="chemistry-secrets"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Category Classification
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        >
                          <option value="Carpentry Guide">Carpentry Guide</option>
                          <option value="Product Science">Product Science</option>
                          <option value="Wood Joinery">Wood Joinery</option>
                          <option value="Industrial Updates">Industrial Updates</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Author Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.author}
                          onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                          placeholder="Writer's name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Publish Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.publish_date}
                          onChange={(e) => setFormData((prev) => ({ ...prev, publish_date: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Article Tags (Comma Separated)
                        </label>
                        <input
                          type="text"
                          value={formData.tagsInput}
                          onChange={(e) => setFormData((prev) => ({ ...prev, tagsInput: e.target.value }))}
                          placeholder="carpentry, adhesives, guide"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>

                      <ImageUpload
                        label="Header Banner Image"
                        value={formData.image}
                        onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                        folder="blogs"
                      />
                    </div>

                    {/* Rich WYSIWYG Composer Actions Bar */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        WYSIWYG Scientific Editorial Content
                      </label>
                      
                      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden flex flex-col">
                        <div className="flex items-center gap-1.5 p-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/20 shrink-0">
                          <button
                            type="button"
                            onClick={() => injectStyle("**", "**")}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                            title="Bold Selection"
                          >
                            <Bold className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => injectStyle("*", "*")}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                            title="Italic Selection"
                          >
                            <Italic className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => injectStyle("\n# ", "\n")}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                            title="Heading Style"
                          >
                            <Heading1 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => injectStyle("`", "`")}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                            title="Code block"
                          >
                            <Code className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => injectStyle("\n- ", "\n")}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                            title="Bullet List"
                          >
                            <List className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <textarea
                          id="blog-content-area"
                          required
                          rows={12}
                          value={formData.content}
                          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                          placeholder="Draft full analytical blog text here. Utilize the layout buttons in the toolbar to apply formatting tags..."
                          className="w-full p-4 text-sm bg-transparent outline-none resize-none leading-normal text-gray-800 dark:text-zinc-200 min-h-[30vh]"
                        />
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
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes modalShow {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
        `
      }} />
    </AdminLayout>
  );
}
