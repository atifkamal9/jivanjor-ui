"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, SeoMetadata, Product, Category, BlogPost, UseCase, Issue } from "@/lib/api";
import { Plus, Search, Edit2, Trash2, X, Globe, Link2, Sparkles, ArrowLeft } from "lucide-react";

export default function SeoMetadataPage() {
  const [seos, setSeos] = useState<SeoMetadata[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    page_type: "home",
    page_id: "home",
    meta_title: "",
    meta_description: "",
    canonical_url: "",
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [seosList, prodsList, catsList, blogsList, casesList, issuesList] = await Promise.all([
        api.getSeoMetadata(),
        api.getProducts(),
        api.getCategories(),
        api.getBlogPosts(),
        api.getUseCases(),
        api.getIssues()
      ]);
      setSeos(seosList);
      setProducts(prodsList);
      setCategories(catsList);
      setBlogs(blogsList);
      setUseCases(casesList);
      setIssues(issuesList);
    } catch (err) {
      console.error("Failed to load SEO and dependencies", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      page_type: "home",
      page_id: "home",
      meta_title: "",
      meta_description: "",
      canonical_url: "https://jivanjor.com",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (seo: SeoMetadata) => {
    setEditingId(seo.id);
    setFormData({
      page_type: seo.page_type,
      page_id: seo.page_id,
      meta_title: seo.meta_title,
      meta_description: seo.meta_description,
      canonical_url: seo.canonical_url,
    });
    setIsModalOpen(true);
  };

  const handlePageTypeChange = (type: string) => {
    let defaultId = "";
    if (type === "home") defaultId = "home";
    else if (type === "product") defaultId = products[0]?.id || "";
    else if (type === "category") defaultId = categories[0]?.id || "";
    else if (type === "blog") defaultId = blogs[0]?.id || "";
    else if (type === "use-case") defaultId = useCases[0]?.id || "";
    else if (type === "issue") defaultId = issues[0]?.id || "";

    let canonical = "https://jivanjor.com";
    if (type === "product" && products[0]) canonical = `https://jivanjor.com/products/${products[0].slug}`;
    else if (type === "category" && categories[0]) canonical = `https://jivanjor.com/categories/${categories[0].slug}`;
    else if (type === "blog" && blogs[0]) canonical = `https://jivanjor.com/blog/${blogs[0].slug}`;

    setFormData((prev) => ({
      ...prev,
      page_type: type,
      page_id: defaultId,
      canonical_url: canonical,
    }));
  };

  const handlePageIdChange = (id: string) => {
    let slug = "";
    if (formData.page_type === "product") slug = `products/${products.find(p => p.id === id)?.slug || ""}`;
    else if (formData.page_type === "category") slug = `categories/${categories.find(c => c.id === id)?.slug || ""}`;
    else if (formData.page_type === "blog") slug = `blog/${blogs.find(b => b.id === id)?.slug || ""}`;
    else if (formData.page_type === "use-case") slug = `use-cases/${useCases.find(u => u.id === id)?.slug || ""}`;
    else if (formData.page_type === "issue") slug = `troubleshooting/${issues.find(i => i.id === id)?.slug || ""}`;

    setFormData((prev) => ({
      ...prev,
      page_id: id,
      canonical_url: slug ? `https://jivanjor.com/${slug}` : "https://jivanjor.com",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveSeoMetadata({
        id: editingId || undefined,
        ...formData,
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save SEO config", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteSeoMetadata(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete SEO config", err);
    }
  };

  // Helper to resolve linked record label
  const getLinkedRecordLabel = (seo: SeoMetadata) => {
    if (seo.page_type === "home") return "Global Home Page";
    if (seo.page_type === "product") return `Product: ${products.find((p) => p.id === seo.page_id)?.name || seo.page_id}`;
    if (seo.page_type === "category") return `Category: ${categories.find((c) => c.id === seo.page_id)?.name || seo.page_id}`;
    if (seo.page_type === "blog") return `Blog: ${blogs.find((b) => b.id === seo.page_id)?.title || seo.page_id}`;
    if (seo.page_type === "use-case") return `Use Case: ${useCases.find((u) => u.id === seo.page_id)?.title || seo.page_id}`;
    if (seo.page_type === "issue") return `Issue: ${issues.find((i) => i.id === seo.page_id)?.issue_title || seo.page_id}`;
    return seo.page_id;
  };

  // Filter SEO configs
  const filteredSeos = seos.filter((s) => {
    const label = getLinkedRecordLabel(s).toLowerCase();
    const matchesSearch = s.meta_title.toLowerCase().includes(search.toLowerCase()) || 
                          s.meta_description.toLowerCase().includes(search.toLowerCase()) ||
                          s.page_type.toLowerCase().includes(search.toLowerCase()) ||
                          label.includes(search.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSeos.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSeos = filteredSeos.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      {!isModalOpen ? (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
                SEO Optimizer
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Manage metadata, descriptions, canonical URLs, and index flags across routing endpoints
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Configure SEO Page</span>
            </button>
          </div>

          {/* Filters Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm transition-colors duration-300">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search page configurations..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
              />
            </div>
          </div>

          {/* Database Table */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Target Page & Type</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Meta Title</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Meta Description</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Canonical Link</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 bg-surface/5">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          <span>Retrieving SEO metadata from database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentSeos.length > 0 ? (
                    currentSeos.map((seo) => (
                      <tr key={seo.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                              <Globe className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-extrabold text-sm text-gray-900 dark:text-zinc-50 truncate max-w-xs">{getLinkedRecordLabel(seo)}</p>
                              <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 px-2 py-0.5 rounded">
                                {seo.page_type}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-sm font-bold text-gray-700 dark:text-zinc-200 max-w-xs truncate">
                          {seo.meta_title}
                        </td>
                        <td className="p-5 text-sm text-gray-500 dark:text-zinc-400 max-w-xs truncate">
                          {seo.meta_description}
                        </td>
                        <td className="p-5 text-xs text-blue-600 dark:text-blue-400 font-bold max-w-xs truncate">
                          <a href={seo.canonical_url} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                            <Link2 className="h-3 w-3 shrink-0" />
                            <span>{seo.canonical_url}</span>
                          </a>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(seo)}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer"
                              title="Edit SEO"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(seo.id)}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer"
                              title="Delete SEO"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500">
                        No optimizations set up under filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-zinc-800">
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
        </div>
      ) : (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out] max-w-3xl">
          {/* Header Workspace Title Bar */}
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800 pb-5 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-xl bg-surface hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-955/20 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 cursor-pointer transition-all"
              title="Discard changes"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                <Globe className="h-6 w-6 text-red-600" />
                <span>{editingId ? "Modify Metadata Configurations" : "Configure Page Metadata"}</span>
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Establish custom title tags, crawler descriptions, and canonical URL settings for this dynamic page
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                    Target Page Type
                  </label>
                  <select
                    value={formData.page_type}
                    onChange={(e) => handlePageTypeChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                  >
                    <option value="home">Home Page</option>
                    <option value="product">Product Page</option>
                    <option value="category">Category Page</option>
                    <option value="blog">Blog Hub Page</option>
                    <option value="use-case">Use Case Page</option>
                    <option value="issue">Troubleshooting Page</option>
                  </select>
                </div>

                {/* Dynamic Page Link Identifier Selector */}
                {formData.page_type !== "home" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                      Mapped Catalog Record
                    </label>
                    <select
                      value={formData.page_id}
                      onChange={(e) => handlePageIdChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                    >
                      {formData.page_type === "product" &&
                        products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      {formData.page_type === "category" &&
                        categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      {formData.page_type === "blog" &&
                        blogs.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                      {formData.page_type === "use-case" &&
                        useCases.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}
                      {formData.page_type === "issue" &&
                        issues.map((i) => <option key={i.id} value={i.id}>{i.issue_title}</option>)}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Meta Title (Max 60 chars)
                </label>
                <input
                  type="text"
                  required
                  maxLength={65}
                  value={formData.meta_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="e.g. Jivanjor WaterShield 2-in-1 Adhesives"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Meta Description (Max 160 chars)</span>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {formData.meta_description.length}/160
                  </span>
                </label>
                <textarea
                  required
                  rows={3}
                  maxLength={165}
                  value={formData.meta_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="Write search crawler summary..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Canonical URL Link</span>
                  <span className="text-[10px] text-red-500 flex items-center gap-1 font-bold">
                    <Sparkles className="h-3 w-3" /> CALCULATED
                  </span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type="url"
                    required
                    value={formData.canonical_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, canonical_url: e.target.value }))}
                    placeholder="https://jivanjor.com/..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                  />
                </div>
              </div>

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
                  {editingId ? "Save Optimizations" : "Save Configurations"}
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
              Are you absolutely sure you want to delete this SEO Metadata block? This will remove standard crawlers headers mapped to this route.
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
