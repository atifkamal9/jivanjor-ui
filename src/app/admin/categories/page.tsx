"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Category } from "@/lib/api";
import { getUserRole } from "@/lib/auth";
import ImageUpload from "@/components/admin/ImageUpload";
import BulkUploadModal, { ParsedRow } from "@/components/admin/BulkUploadModal";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  FolderTree,
  ArrowLeft,
  Sliders,
  Layers,
  FileText,
  Upload,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Bulk Upload
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent_category: "",
    description: "",
    icon: "",
    categoryTitle: "",
    categoryDescription: "",
    resourcesTitle: "",
    resourcesDescription: "",
    heroImage: "",
    researchTitle: "",
    researchDescription: "",
    researchCtaText: "",
    researchCtaLink: "",
    researchImage1: "",
    researchImage2: "",
  });

  // SEO metadata states
  const [seos, setSeos] = useState<any[]>([]);
  const [seoMetaTitle, setSeoMetaTitle] = useState("");
  const [seoMetaDescription, setSeoMetaDescription] = useState("");
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState("");
  const [seoImage, setSeoImage] = useState("");
  const [existingSeoId, setExistingSeoId] = useState<string | null>(null);

  // User Role
  const [userRole, setUserRole] = useState("");

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserRole(getUserRole());
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [catsList, seosList] = await Promise.all([
        api.getCategories(),
        api.getSeoMetadata()
      ]);
      setCategories(catsList);
      setSeos(seosList);
    } catch (err) {
      console.error("Failed to load categories/SEO", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, name, slug }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      parent_category: "",
      description: "",
      icon: "",
      categoryTitle: "",
      categoryDescription: "",
      resourcesTitle: "",
      resourcesDescription: "",
      heroImage: "",
      researchTitle: "",
      researchDescription: "",
      researchCtaText: "",
      researchCtaLink: "",
      researchImage1: "",
      researchImage2: "",
    });
    setSeoMetaTitle("");
    setSeoMetaDescription("");
    setSeoCanonicalUrl("https://jivanjor.com/categories");
    setSeoImage("");
    setExistingSeoId(null);
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      parent_category: category.parent_category || "",
      description: category.description,
      icon: category.icon || "",
      categoryTitle: category.categoryTitle || "",
      categoryDescription: category.categoryDescription || "",
      resourcesTitle: category.resourcesTitle || "",
      resourcesDescription: category.resourcesDescription || "",
      heroImage: category.heroImage || "",
      researchTitle: category.researchTitle || category.resourcesTitle || "",
      researchDescription: category.researchDescription || category.resourcesDescription || "",
      researchCtaText: category.researchCtaText || "",
      researchCtaLink: category.researchCtaLink || "",
      researchImage1: category.researchImage1 || "",
      researchImage2: category.researchImage2 || "",
    });

    const matchedSeo = seos.find(
      (s) => s.page_type === "category" && s.page_id === category.id
    );
    if (matchedSeo) {
      setExistingSeoId(matchedSeo.id);
      setSeoMetaTitle(matchedSeo.meta_title);
      setSeoMetaDescription(matchedSeo.meta_description);
      setSeoCanonicalUrl(matchedSeo.canonical_url);
      setSeoImage(matchedSeo.image || "");
    } else {
      setExistingSeoId(null);
      setSeoMetaTitle("");
      setSeoMetaDescription("");
      setSeoCanonicalUrl(`https://jivanjor.com/categories/${category.slug}`);
      setSeoImage("");
    }

    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedCat = await api.saveCategory({
        id: editingId || undefined,
        ...formData,
      });

      // Save SEO metadata record in context
      await api.saveSeoMetadata({
        id: existingSeoId || undefined,
        page_type: "category",
        page_id: savedCat.id,
        meta_title: seoMetaTitle || savedCat.name,
        meta_description: seoMetaDescription || savedCat.description || "",
        canonical_url: seoCanonicalUrl || `https://jivanjor.com/categories/${savedCat.slug}`,
        image: seoImage || undefined,
      });

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save category & SEO", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteCategory(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  // Filter Categories
  const filteredMainCategories = categories.filter((c) => {
    if (c.parent_category) return false;

    const mainMatches = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());

    const subMatches = categories.some(
      (sub) =>
        sub.parent_category === c.id &&
        (sub.name.toLowerCase().includes(search.toLowerCase()) ||
          sub.description.toLowerCase().includes(search.toLowerCase()))
    );

    return mainMatches || subMatches;
  });

  const totalPages = Math.ceil(filteredMainCategories.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMainCategories = filteredMainCategories.slice(indexOfFirstItem, indexOfLastItem);

  const isRootCategory = !formData.parent_category;

  useEffect(() => {
    if (isRootCategory && activeTab === "content") {
      setActiveTab("general");
    }
  }, [isRootCategory, activeTab]);

  const tabsList = [
    { id: "general", label: "General Properties", icon: Sliders },
    ...(!isRootCategory ? [{ id: "content", label: "Dynamic Page Content", icon: FileText }] : []),
    { id: "seo", label: "SEO Metadata", icon: Search },
  ];

  return (
    <AdminLayout>
      {!isModalOpen ? (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
                Product Categories
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Define classification structures for nested catalog layout filters
              </p>
            </div>
            <div className="flex items-center gap-3 self-start sm:self-auto">
              {userRole === "SUPER_ADMIN" && (
                <button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-red-400 dark:hover:border-red-500 text-gray-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 font-bold text-sm cursor-pointer transition-all shadow-sm"
                >
                  <Upload className="h-4 w-4" />
                  <span>Bulk Upload</span>
                </button>
              )}
              <button
                onClick={handleOpenAdd}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 cursor-pointer transition-all"
              >
                <Plus className="h-5 w-5" />
                <span>Add Category Classification</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm transition-colors duration-300">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search classifications..."
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
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Category Structure</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Description</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 bg-surface/5">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          <span>Retrieving classifications from database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentMainCategories.length > 0 ? (
                    currentMainCategories.map((mainCat) => {
                      const subCats = categories.filter(
                        (sub) =>
                          sub.parent_category === mainCat.id &&
                          (sub.name.toLowerCase().includes(search.toLowerCase()) ||
                            sub.description.toLowerCase().includes(search.toLowerCase()))
                      );

                      return (
                        <React.Fragment key={mainCat.id}>
                          {/* Main Category Row */}
                          <tr className="hover:bg-gray-50/20 dark:hover:bg-zinc-800/10 transition-colors bg-gray-50/5 dark:bg-zinc-900/5">
                            <td className="p-5 font-semibold">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                                  <FolderTree className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-extrabold text-sm text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                                    <span>{mainCat.name}</span>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Root</span>
                                  </p>
                                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">/{mainCat.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 text-sm text-gray-500 dark:text-zinc-400 max-w-xs truncate">
                              {mainCat.description || "No description provided."}
                            </td>
                            <td className="p-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEdit(mainCat)}
                                  className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer border border-gray-100 dark:border-zinc-800"
                                  title="Edit category"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  disabled={subCats.length > 0}
                                  onClick={() => setDeleteConfirmId(mainCat.id)}
                                  className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer disabled:opacity-40 border border-gray-100 dark:border-zinc-800"
                                  title={subCats.length > 0 ? "Cannot delete category containing nested sub-categories" : "Delete category"}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Child categories loop */}
                          {subCats.map((sub) => (
                            <tr key={sub.id} className="hover:bg-gray-50/10 dark:hover:bg-zinc-800/5 transition-colors bg-white dark:bg-zinc-900">
                              <td className="p-5 pl-14">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-300 dark:text-zinc-700 font-light select-none mr-1">└──</span>
                                  <div>
                                    <p className="font-extrabold text-sm text-gray-900 dark:text-zinc-50">{sub.name}</p>
                                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">/{sub.slug}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-5 text-sm text-gray-400 dark:text-zinc-500 max-w-xs truncate">
                                {sub.description || "No description provided."}
                              </td>
                              <td className="p-5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEdit(sub)}
                                    className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-955/10 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer border border-gray-100 dark:border-zinc-800"
                                    title="Edit sub-category"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmId(sub.id)}
                                    className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-955/10 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer border border-gray-100 dark:border-zinc-800"
                                    title="Delete sub-category"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 bg-surface/5">
                        No category structures configured.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/20">
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
        // ==================== FULL-PAGE SECTION FORM WORKSPACE ====================
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out] flex flex-col min-h-[80vh]">
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
                <Layers className="h-6 w-6 text-red-600" />
                <span>{editingId ? "Modify Classification Details" : "Configure Custom Category"}</span>
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Establish custom parameters and edit linked SEO settings in context
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col lg:flex-row gap-6">
            {/* Sidebar tabs */}
            <div className="w-full lg:w-1/4 flex flex-col gap-1.5 shrink-0 bg-surface/30 p-3 border border-gray-200 dark:border-zinc-800 rounded-2xl h-fit">
              {tabsList.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-bold transition-all cursor-pointer border ${activeTab === tab.id
                      ? "bg-red-600 text-white border-red-600 shadow-sm"
                      : "bg-background/40 hover:bg-surface text-foreground/80 border-gray-200 dark:border-zinc-800"
                      }`}
                  >
                    <TabIcon className={`h-4.5 w-4.5 ${activeTab === tab.id ? "text-white" : "text-red-600"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Canvas Panels */}
            <div className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-6 rounded-3xl shadow-sm min-h-[60vh] flex flex-col justify-between">
              <div className="space-y-6">
                {activeTab === "general" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <Sliders className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">General Properties</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Category Classification Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g. Waterproof PVA Glues"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>Category URL Path Reference</span>
                          <span className="text-[10px] text-red-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                            <Sparkles className="h-3 w-3" /> Auto
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "") }))}
                          placeholder="waterproof-pva-glues"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Nest Under Parent Category (Optional)
                      </label>
                      <select
                        value={formData.parent_category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, parent_category: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500 cursor-pointer"
                      >
                        <option value="">-- No Parent (Treat as Root Category) --</option>
                        {categories
                          .filter((c) => !c.parent_category && c.id !== editingId)
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Category Classification description
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Write dynamic description overview details..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500 resize-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "content" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <FileText className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">Dynamic Page Content</h3>
                    </div>

                    <div className="p-4 bg-gray-50/20 dark:bg-zinc-955/20 rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-4">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Category Hero Header Settings (Main Category / Subcategory Page)</span>
                      <div className="grid grid-cols-1 gap-4">
                        <ImageUpload
                          label="Category Hero Background Image"
                          value={formData.heroImage}
                          onChange={(url) => setFormData((prev) => ({ ...prev, heroImage: url }))}
                          folder="categories"
                        />
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Category Hero Title</label>
                          <input
                            type="text"
                            value={formData.categoryTitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, categoryTitle: e.target.value }))}
                            placeholder="e.g. A Complete Adhesive Range for Modern Woodworking"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Category Hero Description</label>
                          <textarea
                            rows={3}
                            value={formData.categoryDescription}
                            onChange={(e) => setFormData(prev => ({ ...prev, categoryDescription: e.target.value }))}
                            placeholder="Detailed overview for the category page hero..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50/20 dark:bg-zinc-955/20 rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-4">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Research & Development Section (Superior Quality Backed by Research)</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Section Title</label>
                          <input
                            type="text"
                            value={formData.researchTitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, researchTitle: e.target.value }))}
                            placeholder="Superior Quality Backed by Research"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Section Description</label>
                          <textarea
                            rows={2}
                            value={formData.researchDescription}
                            onChange={(e) => setFormData(prev => ({ ...prev, researchDescription: e.target.value }))}
                            placeholder="Learn how our focus on product development, quality standards and market reach supports India's woodworking needs."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">CTA Button Text</label>
                          <input
                            type="text"
                            value={formData.researchCtaText}
                            onChange={(e) => setFormData(prev => ({ ...prev, researchCtaText: e.target.value }))}
                            placeholder="Inside Our Labs"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">CTA Button Link</label>
                          <input
                            type="text"
                            value={formData.researchCtaLink}
                            onChange={(e) => setFormData(prev => ({ ...prev, researchCtaLink: e.target.value }))}
                            placeholder="/about/research-and-innovation"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Research Image 1 (Left)</label>
                          <ImageUpload
                            value={formData.researchImage1}
                            onChange={(url) => setFormData(prev => ({ ...prev, researchImage1: url }))}
                            label="Upload Left Image"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Research Image 2 (Right)</label>
                          <ImageUpload
                            value={formData.researchImage2}
                            onChange={(url) => setFormData(prev => ({ ...prev, researchImage2: url }))}
                            label="Upload Right Image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "seo" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <Search className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">SEO Metadata Settings</h3>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                        <span>Meta Title</span>
                        <span className={`text-[10px] font-bold ${seoMetaTitle.length > 60 || seoMetaTitle.length < 50 ? "text-amber-500" : "text-green-500"}`}>
                          {seoMetaTitle.length} / 60 chars (Recommended: 50-60)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={seoMetaTitle}
                        onChange={(e) => setSeoMetaTitle(e.target.value)}
                        placeholder="e.g. Waterproof PVA Wood Glues | Jivanjor"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                        <span>Meta Description</span>
                        <span className={`text-[10px] font-bold ${seoMetaDescription.length > 160 || seoMetaDescription.length < 120 ? "text-amber-500" : "text-green-500"}`}>
                          {seoMetaDescription.length} / 160 chars (Recommended: 120-160)
                        </span>
                      </label>
                      <textarea
                        rows={4}
                        value={seoMetaDescription}
                        onChange={(e) => setSeoMetaDescription(e.target.value)}
                        placeholder="e.g. Shop waterproof wood carpentry white glues. High grab, excellent viscosity, anti-bubble cross-linking polymers."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Canonical URL
                      </label>
                      <input
                        type="text"
                        value={seoCanonicalUrl}
                        onChange={(e) => setSeoCanonicalUrl(e.target.value)}
                        placeholder="https://jivanjor.com/categories/..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                      />
                    </div>

                    <ImageUpload
                      label="SEO Feature Image (Open Graph)"
                      value={seoImage}
                      onChange={(url) => setSeoImage(url)}
                      folder="seo"
                    />

                    {/* Google Snippet Search Engine Live Preview */}
                    <div className="p-5 border border-gray-100 dark:border-zinc-800 bg-gray-50/30 rounded-2xl space-y-3">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Search Engine Result Preview</span>
                      <div className="p-4 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl font-sans text-left space-y-1 max-w-xl shadow-inner">
                        {seoImage ? (
                          <div className="flex gap-4">
                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="text-xs text-gray-400 truncate">
                                {seoCanonicalUrl || "https://jivanjor.com/categories"}
                              </div>
                              <div className="text-base text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer truncate">
                                {seoMetaTitle || "Please specify a Meta Title..."}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-zinc-400 leading-normal line-clamp-2">
                                {seoMetaDescription || "Please write a Meta Description overview snippet..."}
                              </p>
                            </div>
                            <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                              <img src={seoImage} alt="SEO Preview" className="w-full h-full object-cover" />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-xs text-gray-400 truncate">
                              {seoCanonicalUrl || "https://jivanjor.com/categories"}
                            </div>
                            <div className="text-base text-[#1a0dab] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer truncate">
                              {seoMetaTitle || "Please specify a Meta Title..."}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-normal line-clamp-2">
                              {seoMetaDescription || "Please write a Meta Description overview snippet..."}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form submit/cancel buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800 mt-6 shrink-0">
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
                  {editingId ? "Save Modifications" : "Publish Category"}
                </button>
              </div>
            </div>
          </form>
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
              Are you absolutely sure you want to delete this category classification? This will erase its sub-category classifications permanently.
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
      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onComplete={loadData}
        entityType="category"
        categories={categories}
        onSave={async (row: ParsedRow) => {
          const latestCats = await api.getCategories();
          
          let parentId = "";
          if (row.parent_category_name) {
            const parentCat = latestCats.find(
              (c) => c.name.toLowerCase() === row.parent_category_name!.toLowerCase()
            );
            if (parentCat) {
              parentId = parentCat.id;
            }
          }

          const slug = (row.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          const existingCat = latestCats.find(
            (c) => c.name.toLowerCase() === (row.name || "").toLowerCase() || c.slug === slug
          );

          await api.saveCategory({
            id: existingCat?.id,
            name: row.name || "",
            slug,
            description: row.description || "",
            parent_category: parentId,
            icon: row.icon || "",
            categoryTitle: "",
            categoryDescription: "",
            resourcesTitle: "",
            resourcesDescription: "",
            heroImage: "",
            researchTitle: "",
            researchDescription: "",
            researchCtaText: "",
            researchCtaLink: "",
            researchImage1: "",
            researchImage2: "",
          });
        }}
      />
    </AdminLayout>
  );
}
