"use client";

import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, UseCase } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
import BlogRichEditor from "@/components/admin/BlogRichEditor";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Lightbulb,
  ArrowLeft,
  Eye,
  Globe,
  FileSearch,
  BookOpen,
} from "lucide-react";

type ComposerTab = "useCase" | "seo";



export default function UseCasesPage() {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [appPages, setAppPages] = useState<{ title: string; slug: string }[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "",
    image: "",
  });

  // SEO state
  const [seoData, setSeoData] = useState({
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    image: "",
  });
  const [existingSeoId, setExistingSeoId] = useState<string | null>(null);

  const [composerTab, setComposerTab] = useState<ComposerTab>("useCase");
  const [composerPreview, setComposerPreview] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ContentEditable Editor Ref
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Sync editor innerHTML when modal opens or editing use case changes
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
      const [data, pages] = await Promise.all([
        api.getUseCases(),
        api.getPages().catch(() => []),
      ]);
      setUseCases(data);

      const filteredPages = pages
        .filter((p: any) => {
          try {
            const sections = typeof p.sections === "string" ? JSON.parse(p.sections) : p.sections;
            return p.slug === "applications" || sections?.layoutType === "applications";
          } catch {
            return p.slug === "applications";
          }
        })
        .map((p: any) => ({ title: p.title, slug: p.slug }));

      setAppPages(filteredPages);
    } catch (err) {
      console.error("Failed to fetch use cases or pages", err);
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
      description: "",
      content: "<p>Write your detailed application guidelines and story here...</p>",
      category: appPages[0]?.title || "",
      image: "",
    });
    resetSeo();
    setComposerPreview(false);
    setComposerTab("useCase");
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (useCase: UseCase) => {
    setEditingId(useCase.id);
    setFormData({
      title: useCase.title,
      slug: useCase.slug,
      description: useCase.description || "",
      content: useCase.content || "<p>Write your detailed application guidelines and story here...</p>",
      category: useCase.category || appPages[0]?.title || "",
      image: useCase.image || "",
    });
    setComposerPreview(false);
    setComposerTab("useCase");
    setIsModalOpen(true);

    // Fetch associated SEO
    try {
      const seos = await api.getSeoMetadata();
      const matched = seos.find(
        (s) => s.page_type === "use_case" && (s.page_id === useCase.id || s.canonical_url?.includes(useCase.slug))
      );
      if (matched) {
        setExistingSeoId(matched.id);
        setSeoData({
          meta_title: matched.meta_title || "",
          meta_description: matched.meta_description || "",
          canonical_url: matched.canonical_url || "",
          image: matched.image || "",
        });
      } else {
        resetSeo();
      }
    } catch {
      resetSeo();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const saved = await api.saveUseCase({
        id: editingId || undefined,
        ...formData,
      });

      // Save SEO metadata if filled
      if (seoData.meta_title || seoData.meta_description) {
        await api.saveSeoMetadata({
          id: existingSeoId || undefined,
          page_type: "use_case",
          page_id: saved?.id || editingId || "",
          meta_title: seoData.meta_title || formData.title,
          meta_description: seoData.meta_description || formData.description,
          canonical_url: seoData.canonical_url || `/applications?article=${formData.slug}`,
          image: seoData.image || formData.image,
        });
      }

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save use case", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteUseCase(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete use case", err);
    }
  };

  // Filter Use Cases
  const filteredUseCases = useCases.filter((u) => {
    const matchesSearch =
      u.title.toLowerCase().includes(search.toLowerCase()) ||
      u.description?.toLowerCase().includes(search.toLowerCase()) ||
      u.category?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUseCases.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUseCases = filteredUseCases.slice(indexOfFirstItem, indexOfLastItem);

  const composerTabs = [
    { id: "useCase" as ComposerTab, label: "Application Content", icon: <BookOpen className="h-4 w-4" /> },
    { id: "seo" as ComposerTab, label: "SEO Settings", icon: <Globe className="h-4 w-4" /> },
  ];

  return (
    <AdminLayout>
      {!isModalOpen ? (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
                Application Use Cases
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Create and manage professional application guidelines and woodworking stories
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg hover:shadow-red-600/20 active:scale-[0.98]"
            >
              <Plus className="h-5 w-5" />
              <span>Record New Use Case</span>
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search use cases by title, category, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-955 text-sm font-medium outline-none focus:border-red-500 transition-all dark:text-zinc-100"
              />
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 dark:bg-zinc-800/40 text-gray-400 dark:text-zinc-500 text-[11px] font-black uppercase tracking-wider border-b border-gray-100 dark:border-zinc-800">
                  <tr>
                    <th className="py-4 px-4">Application Card</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-4">Summary Description</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-700 dark:text-zinc-300 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        Loading application use cases...
                      </td>
                    </tr>
                  ) : currentUseCases.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        No application use cases found. Click &quot;Record New Use Case&quot; to add one.
                      </td>
                    </tr>
                  ) : (
                    currentUseCases.map((useCase) => (
                      <tr key={useCase.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-zinc-800 shrink-0 border border-gray-200 dark:border-zinc-700">
                              <img
                                src={useCase.image || "/images/applications/Rectangle 150.png"}
                                alt={useCase.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-zinc-100">{useCase.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                            {useCase.category || "General"}
                          </span>
                        </td>
                        <td className="py-4 px-4 max-w-xs truncate text-gray-500 dark:text-zinc-400 text-xs">
                          {useCase.description}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEdit(useCase)}
                              className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Edit Use Case"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(useCase.id)}
                              className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Delete Use Case"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="text-xs font-semibold text-gray-400 dark:text-zinc-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          {/* Header Workspace Title Bar */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-5 shrink-0">
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
                  <Lightbulb className="h-6 w-6 text-red-600" />
                  <span>{editingId ? "Modify Application Use Case" : "Draft New Application Use Case"}</span>
                </h1>
                <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                  Draft rich application guides with real-time styling editor
                </p>
              </div>
            </div>

            {composerTab === "useCase" && (
              <button
                type="button"
                onClick={() => setComposerPreview(!composerPreview)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-bold text-gray-700 dark:text-zinc-200 cursor-pointer transition-all border border-gray-200 dark:border-zinc-700"
              >
                <Eye className="h-4 w-4" />
                <span>{composerPreview ? "Back to Editor" : "Real-Time Preview"}</span>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${composerTab === tab.id
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
              {/* USE CASE CONTENT TAB */}
              {composerTab === "useCase" && (
                <>
                  {!composerPreview ? (
                    <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                              Application Title
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.title}
                              onChange={(e) => handleTitleChange(e.target.value)}
                              placeholder="e.g. Waterproof Bonding in Saunas & Kitchens"
                              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-base font-bold outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
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
                              placeholder="waterproof-bonding-saunas"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                              Summary Description / Highlights
                            </label>
                            <textarea
                              rows={3}
                              required
                              value={formData.description}
                              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                              placeholder="e.g. Explore Jivanjor adhesives for furniture assembly, lamination, edge banding and structural woodwork..."
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 resize-none font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                              Application Subpage / Category
                            </label>
                            <select
                              value={formData.category}
                              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-semibold outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                            >
                              {appPages.length > 0 ? (
                                appPages.map((p) => (
                                  <option key={p.slug} value={p.title}>
                                    {p.title} ({p.slug === "applications" ? "/applications" : `/applications/${p.slug}`})
                                  </option>
                                ))
                              ) : (
                                <option value="">No application subpages found</option>
                              )}
                            </select>
                          </div>
                        </div>

                        <div className="lg:col-span-5 xl:col-span-4 space-y-4 flex flex-col justify-between">
                          <ImageUpload
                            label="Cover Image"
                            value={formData.image}
                            onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                            folder="applications"
                            aspect="square"
                          />
                        </div>
                      </div>

                      {/* Content Editor */}
                      <BlogRichEditor
                        value={formData.content}
                        onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                      />
                    </div>
                  ) : (
                    /* REAL-TIME PREVIEW MODE */
                    <div className="space-y-6 animate-[fadeIn_0.15s_ease-out] bg-gray-50 dark:bg-zinc-955 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800">
                      <div className="space-y-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                          {formData.category}
                        </span>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-zinc-50">
                          {formData.title || "Untitled Application Guide"}
                        </h2>
                        <p className="text-gray-600 dark:text-zinc-400 text-base font-medium">
                          {formData.description}
                        </p>
                      </div>

                      {formData.image && (
                        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800">
                          <img
                            src={formData.image}
                            alt={formData.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div
                        className="prose dark:prose-invert max-w-none text-gray-800 dark:text-zinc-200"
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* SEO SETTINGS TAB */}
              {composerTab === "seo" && (
                <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                    <Globe className="h-5 w-5 text-red-600" />
                    <div>
                      <h3 className="text-base font-black text-gray-900 dark:text-zinc-50">
                        SEO &amp; Social Search Indexing
                      </h3>
                      <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                        Configure search engine preview metadata for this application guide
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={seoData.meta_title}
                        onChange={(e) => setSeoData((prev) => ({ ...prev, meta_title: e.target.value }))}
                        placeholder={formData.title || "Enter custom title..."}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        SEO Meta Description
                      </label>
                      <textarea
                        rows={3}
                        value={seoData.meta_description}
                        onChange={(e) => setSeoData((prev) => ({ ...prev, meta_description: e.target.value }))}
                        placeholder={formData.description || "Enter custom SEO summary..."}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 resize-none font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Canonical URL Link
                      </label>
                      <input
                        type="text"
                        value={seoData.canonical_url}
                        onChange={(e) => setSeoData((prev) => ({ ...prev, canonical_url: e.target.value }))}
                        placeholder={`https://jivanjor.com/applications?article=${formData.slug || "use-case"}`}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Social Share Preview Image
                      </label>
                      <ImageUpload
                        value={seoData.image}
                        onChange={(url) => setSeoData((prev) => ({ ...prev, image: url }))}
                        folder="seo"
                        aspect="cover"
                      />
                    </div>
                  </div>

                  {/* Google Search Card Preview */}
                  <div className="p-4 bg-gray-50 dark:bg-zinc-955 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <FileSearch className="h-3.5 w-3.5 text-red-600" />
                      Search Engine Result Preview
                    </div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                      {seoData.canonical_url || `https://jivanjor.com/applications?article=${formData.slug || "use-case"}`}
                    </div>
                    <div className="text-base font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer truncate">
                      {seoData.meta_title || formData.title || "Application Title"}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-zinc-400 line-clamp-2">
                      {seoData.meta_description || formData.description || "Application summary description..."}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
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
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg active:scale-95"
                >
                  {editingId ? "Save Use Case" : "Record Use Case"}
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
              Are you absolutely sure you want to delete this application use case? This will permanently erase it.
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
