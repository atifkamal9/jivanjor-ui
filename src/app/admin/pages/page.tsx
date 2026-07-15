"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Page, PageTemplate } from "@/lib/api";
import { Plus, Search, Edit2, Trash2, X, Sparkles, FileText, LayoutTemplate, AlertCircle } from "lucide-react";

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    activeTemplateId: "" as string | null,
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pagesList, tempsList] = await Promise.all([
        api.getPages(),
        api.getTemplates()
      ]);
      setPages(pagesList);
      setTemplates(tempsList);
    } catch (err) {
      console.error("Failed to load pages/templates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({ ...prev, title }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      activeTemplateId: null,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (page: Page) => {
    setEditingId(page.id);
    setFormData({
      title: page.title,
      slug: page.slug,
      description: page.description || "",
      activeTemplateId: page.activeTemplateId || null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.savePage({
        id: editingId || undefined,
        ...formData,
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save page", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deletePage(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete page", err);
    }
  };

  // Filter Pages
  const filteredPages = pages.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPages = filteredPages.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-foreground">
              Dynamic Pages
            </h1>
            <p className="text-sm font-semibold text-foreground/45 uppercase tracking-wider">
              Manage custom dynamic pages and mapped layout template hubs
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:opacity-90 text-white font-bold text-sm shadow-md shadow-primary/10 cursor-pointer transition-all self-start sm:self-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create Dynamic Page</span>
          </button>
        </div>

        {/* Filters Panel */}
        <div className="bg-background border border-border p-4 rounded-2xl shadow-sm transition-colors duration-300">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search dynamic pages..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary"
            />
          </div>
        </div>

        {/* Database Table */}
        <div className="bg-background border border-border rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/55">
                  <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Page Pathway</th>
                  <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Active Layout Template</th>
                  <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Description</th>
                  <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-sm font-semibold text-foreground/40 bg-surface/5">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <span>Retrieving dynamic pages from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentPages.length > 0 ? (
                  currentPages.map((page) => {
                    const activeTemplate = templates.find((t) => t.id === page.activeTemplateId);
                    return (
                      <tr key={page.id} className="hover:bg-surface/30 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-extrabold text-sm text-foreground">{page.title}</p>
                              <p className="text-[10px] text-foreground/45 font-bold uppercase tracking-wider">/{page.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          {activeTemplate ? (
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 self-start">
                                <LayoutTemplate className="h-3.5 w-3.5 shrink-0 text-green-600" />
                                <span>{activeTemplate.name}</span>
                              </span>
                              <span className="text-[10px] text-foreground/45 font-bold uppercase tracking-wider pl-1">
                                Slug: {activeTemplate.slug}
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-surface text-foreground/40 border border-border self-start">
                              <AlertCircle className="h-3.5 w-3.5 text-foreground/30 shrink-0" />
                              <span>No Layout Mapped (Draft)</span>
                            </span>
                          )}
                        </td>
                        <td className="p-5 text-sm text-foreground/60 max-w-xs truncate">
                          {page.description || "No description provided."}
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(page)}
                              className="p-2 rounded-lg bg-surface hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all cursor-pointer border border-border"
                              title="Edit page"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(page.id)}
                              className="p-2 rounded-lg bg-surface hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all cursor-pointer border border-border"
                              title="Delete page"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-sm font-semibold text-foreground/40 bg-surface/5">
                      No custom dynamic pages created.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface/20">
              <span className="text-xs font-bold text-foreground/45 uppercase tracking-wider">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-border text-foreground hover:bg-surface disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-border text-foreground hover:bg-surface disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ==================== CREATE/EDIT MODAL ==================== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-background border border-border w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-[modalShow_0.2s_ease-out]">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-lg font-black text-foreground">
                  {editingId ? "Modify Dynamic Page" : "Configure Custom Dynamic Page"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg bg-surface text-foreground/60 hover:text-foreground cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                    Page Title Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Partner Portal Consultation"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Page Slug Path Reference</span>
                    {formData.slug === "home" && (
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider animate-[fadeIn_0.2s_ease-out]">
                        Fixed / Landing Page
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={formData.slug === "home"}
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "") }))}
                    placeholder="partner-portal"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  />
                  {formData.slug === "home" && (
                    <p className="mt-1.5 text-[11px] font-semibold text-primary animate-[fadeIn_0.2s_ease-out]">
                      ⚠️ The home page pathway is locked and cannot be modified.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                    Page Description & Details
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Write the general outline or target intent of this custom dynamic layout..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary resize-none"
                  />
                </div>

                {editingId && (
                  <div>
                    <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                      Active Layout Template
                    </label>
                    {templates.length > 0 ? (
                      <select
                        value={formData.activeTemplateId || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, activeTemplateId: e.target.value || null }))}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary text-foreground cursor-pointer"
                      >
                        <option value="">-- No Active Template (Draft Mode) --</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.slug})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-4 bg-surface/30 border border-border rounded-xl text-xs text-foreground/50 font-semibold flex items-center gap-2">
                        <LayoutTemplate className="h-4.5 w-4.5 text-foreground/45" />
                        <span>No layout templates assembled in the system yet. Build one in the Templates Manager first.</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 rounded-xl text-sm font-bold border border-border text-foreground hover:bg-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl text-sm font-bold bg-primary hover:opacity-90 text-white shadow-md shadow-primary/10 cursor-pointer"
                  >
                    {editingId ? "Save Custom Page" : "Configure Page"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== DELETE CONFIRM DIALOG ==================== */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-background border border-border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 animate-[modalShow_0.15s_ease-out]">
              <h3 className="text-lg font-black text-foreground">
                Confirm Cascading Deletion
              </h3>
              <p className="text-sm text-foreground/60 leading-normal font-medium">
                Are you absolutely sure you want to delete this dynamic page? 
              </p>
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-[11px] font-bold text-red-600 rounded-xl leading-normal border border-red-100 dark:border-red-950/30">
                ⚠️ WARNING: Deleting this page will trigger cascading deletions, permanently removing all attached layouts, sections, and template configurations from the database!
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-border text-foreground hover:bg-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white cursor-pointer"
                >
                  Delete Everything
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
