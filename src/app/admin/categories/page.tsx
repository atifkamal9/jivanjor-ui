"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Category } from "@/lib/api";
import { getUserRole } from "@/lib/auth";
import ImageUpload from "@/components/admin/ImageUpload";
import BulkUploadModal, { ParsedRow } from "@/components/admin/BulkUploadModal";
import Image from "next/image";
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
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Root category collapse state
  const [collapsedCategoryIds, setCollapsedCategoryIds] = useState<Record<string, boolean>>({});

  const toggleCategoryCollapse = (id: string) => {
    setCollapsedCategoryIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    setCollapsedCategoryIds({});
  };

  const handleCollapseAll = () => {
    const newCollapsed: Record<string, boolean> = {};
    categories.filter((c) => !c.parent_category).forEach((c) => {
      newCollapsed[c.id] = true;
    });
    setCollapsedCategoryIds(newCollapsed);
  };

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
    tagline: "",
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
    rightChoiceTitle: "",
    rightChoiceSubtitle: "",
    rightChoiceCtaText: "",
    rightChoiceCtaLink: "",
    hideInMenu: false,
    isVisible: true,
    displayOrder: 0,
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
      const sortedCats = [...catsList].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      setCategories(sortedCats);
      setSeos(seosList);
    } catch (err) {
      console.error("Failed to load categories/SEO", err);
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop state
  const [draggedItem, setDraggedItem] = useState<{ id: string; parentId: string | null } | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string, parentId: string | null) => {
    setDraggedItem({ id, parentId });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string, parentId: string | null) => {
    e.preventDefault();
    if (!draggedItem) return;
    if (draggedItem.parentId === parentId && draggedItem.id !== targetId) {
      e.dataTransfer.dropEffect = "move";
      setDragOverItemId(targetId);
    }
  };

  const handleDragLeave = () => {
    setDragOverItemId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: string, parentId: string | null) => {
    e.preventDefault();
    setDragOverItemId(null);
    if (!draggedItem) return;
    if (draggedItem.parentId !== parentId || draggedItem.id === targetId) return;

    const siblings = parentId
      ? categories.filter((c) => c.parent_category === parentId)
      : categories.filter((c) => !c.parent_category);

    const fromIdx = siblings.findIndex((c) => c.id === draggedItem.id);
    const toIdx = siblings.findIndex((c) => c.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const updated = [...siblings];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);

    const reorderPayload = updated.map((c, idx) => ({
      id: c.id,
      displayOrder: idx + 1,
    }));

    try {
      await api.reorderCategories(reorderPayload);
      await loadData();
    } catch (err) {
      console.error("Failed to save drag order:", err);
    } finally {
      setDraggedItem(null);
    }
  };

  const handleMoveCategory = async (category: Category, direction: "up" | "down", siblings: Category[]) => {
    const currentIndex = siblings.findIndex((c) => c.id === category.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const updatedSiblings = [...siblings];
    const [moved] = updatedSiblings.splice(currentIndex, 1);
    updatedSiblings.splice(targetIndex, 0, moved);

    const reorderPayload = updatedSiblings.map((c, idx) => ({
      id: c.id,
      displayOrder: idx + 1,
    }));

    try {
      await api.reorderCategories(reorderPayload);
      await loadData();
    } catch (err) {
      console.error("Failed to reorder categories:", err);
    }
  };

  const handleOrderInputChange = async (id: string, newOrder: number) => {
    try {
      const targetCat = categories.find((c) => c.id === id);
      if (!targetCat) return;
      await api.saveCategory({
        ...targetCat,
        displayOrder: newOrder,
      });
      await loadData();
    } catch (err) {
      console.error("Failed to update order:", err);
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
      tagline: "",
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
      rightChoiceTitle: "",
      rightChoiceSubtitle: "",
      rightChoiceCtaText: "",
      rightChoiceCtaLink: "",
      hideInMenu: false,
      isVisible: true,
      displayOrder: categories.length + 1,
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
      tagline: category.tagline || "",
      icon: category.icon || category.image || "",
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
      rightChoiceTitle: category.rightChoiceTitle || category.rightChoice?.title || "",
      rightChoiceSubtitle: category.rightChoiceSubtitle || category.rightChoice?.subtitle || "",
      rightChoiceCtaText: category.rightChoiceCtaText || category.rightChoice?.ctaText || "",
      rightChoiceCtaLink: category.rightChoiceCtaLink || category.rightChoice?.ctaLink || "",
      hideInMenu: category.hideInMenu || false,
      isVisible: category.isVisible !== undefined ? category.isVisible : !category.hideInMenu,
      displayOrder: category.displayOrder ?? 0,
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

  const handleToggleVisibility = async (category: Category) => {
    try {
      const updatedIsVisible = !(category.isVisible !== false && !category.hideInMenu);
      await api.saveCategory({
        ...category,
        isVisible: updatedIsVisible,
        hideInMenu: !updatedIsVisible,
      });
      // If parent category is being hidden, also hide its sub-categories
      if (!updatedIsVisible && !category.parent_category) {
        const childSubCats = categories.filter((c) => c.parent_category === category.id);
        await Promise.all(
          childSubCats.map((sub) =>
            api.saveCategory({
              ...sub,
              isVisible: false,
              hideInMenu: true,
            })
          )
        );
      }
      await loadData();
    } catch (err) {
      console.error("Failed to toggle category visibility", err);
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
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm transition-colors duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search classifications..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
              />
            </div>

            {/* Expand / Collapse Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleExpandAll}
                className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-zinc-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Expand all root category branches"
              >
                <ChevronDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                <span>Expand All</span>
              </button>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="px-3 py-2 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-700 dark:text-zinc-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Collapse all root category branches"
              >
                <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
                <span>Collapse All</span>
              </button>
            </div>
          </div>

          {/* Database Table */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Category Structure</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-center w-40">Display Order</th>
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

                      const isCollapsed = !search.trim() && Boolean(collapsedCategoryIds[mainCat.id]);

                      return (
                        <React.Fragment key={mainCat.id}>
                          {/* Main Category Row */}
                          <tr
                            key={mainCat.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, mainCat.id, null)}
                            onDragOver={(e) => handleDragOver(e, mainCat.id, null)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, mainCat.id, null)}
                            className={`hover:bg-gray-50/20 dark:hover:bg-zinc-800/10 transition-all bg-gray-50/5 dark:bg-zinc-900/5 ${
                              dragOverItemId === mainCat.id ? "border-t-2 border-red-500 bg-red-50/30 dark:bg-red-950/30" : ""
                            }`}
                          >
                            <td className="p-5 font-semibold">
                              <div className="flex items-center gap-3">
                                <div
                                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 cursor-grab active:cursor-grabbing transition-colors shrink-0"
                                  title="Drag to reorder category"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>

                                <button
                                  type="button"
                                  disabled={subCats.length === 0}
                                  onClick={() => toggleCategoryCollapse(mainCat.id)}
                                  className={`p-1.5 rounded-lg border transition-all ${subCats.length === 0
                                    ? "opacity-30 cursor-not-allowed border-transparent text-gray-400"
                                    : "cursor-pointer bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 shadow-xs"
                                    }`}
                                  title={
                                    subCats.length === 0
                                      ? "No subcategories"
                                      : isCollapsed
                                        ? "Click to expand subcategories"
                                        : "Click to collapse subcategories"
                                  }
                                >
                                  {isCollapsed ? (
                                    <ChevronRight className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                  )}
                                </button>

                                <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-2xs">
                                  {mainCat.icon || mainCat.image ? (
                                    <Image
                                      src={mainCat.icon || mainCat.image || ""}
                                      alt={mainCat.name}
                                      width={40}
                                      height={40}
                                      className="object-contain w-full h-full p-1"
                                    />
                                  ) : (
                                    <FolderTree className="h-5 w-5" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-extrabold text-sm text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                                    <span>{mainCat.name}</span>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900/40">Root</span>
                                    {mainCat.isVisible !== false && !mainCat.hideInMenu ? (
                                      <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-1">
                                        Visible
                                      </span>
                                    ) : (
                                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40 flex items-center gap-1">
                                        Hidden
                                      </span>
                                    )}
                                    {subCats.length > 0 && (
                                      <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-zinc-700">
                                        {subCats.length} {subCats.length === 1 ? "sub-category" : "sub-categories"}
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">/{mainCat.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-5 text-center">
                              <div className="inline-flex items-center justify-center gap-1 bg-gray-50 dark:bg-zinc-800 p-1.5 rounded-xl border border-gray-200 dark:border-zinc-700">
                                <button
                                  type="button"
                                  disabled={filteredMainCategories.findIndex((c) => c.id === mainCat.id) === 0}
                                  onClick={() => handleMoveCategory(mainCat, "up", filteredMainCategories)}
                                  className="p-1 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
                                  title="Move category up"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                                <input
                                  type="number"
                                  value={mainCat.displayOrder ?? 0}
                                  onChange={(e) => handleOrderInputChange(mainCat.id, parseInt(e.target.value) || 0)}
                                  className="w-10 text-center text-xs font-bold bg-transparent outline-none border-b border-transparent focus:border-red-500 text-gray-900 dark:text-zinc-100"
                                />
                                <button
                                  type="button"
                                  disabled={filteredMainCategories.findIndex((c) => c.id === mainCat.id) === filteredMainCategories.length - 1}
                                  onClick={() => handleMoveCategory(mainCat, "down", filteredMainCategories)}
                                  className="p-1 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
                                  title="Move category down"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="p-5 text-sm text-gray-500 dark:text-zinc-400 max-w-xs truncate">
                              {mainCat.description || "No description provided."}
                            </td>
                            <td className="p-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleVisibility(mainCat)}
                                  className={`p-2 rounded-lg border transition-all cursor-pointer ${mainCat.isVisible !== false && !mainCat.hideInMenu
                                    ? "bg-gray-50 text-emerald-600 hover:bg-emerald-50 dark:bg-zinc-800 dark:text-emerald-400 border-gray-100 dark:border-zinc-800"
                                    : "bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"
                                    }`}
                                  title={mainCat.isVisible !== false && !mainCat.hideInMenu ? "Visible on site - Click to hide" : "Hidden from site - Click to show"}
                                >
                                  {mainCat.isVisible !== false && !mainCat.hideInMenu ? (
                                    <Eye className="h-4 w-4" />
                                  ) : (
                                    <EyeOff className="h-4 w-4" />
                                  )}
                                </button>
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
                          {!isCollapsed &&
                            subCats.map((sub) => (
                              <tr
                                key={sub.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, sub.id, mainCat.id)}
                                onDragOver={(e) => handleDragOver(e, sub.id, mainCat.id)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, sub.id, mainCat.id)}
                                className={`hover:bg-gray-50/10 dark:hover:bg-zinc-800/5 transition-all bg-white dark:bg-zinc-900 animate-[fadeIn_0.15s_ease-out] ${
                                  dragOverItemId === sub.id ? "border-t-2 border-red-500 bg-red-50/30 dark:bg-red-950/30" : ""
                                }`}
                              >
                                <td className="p-5 pl-14">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="p-1 text-gray-300 hover:text-red-600 dark:hover:text-red-400 cursor-grab active:cursor-grabbing transition-colors shrink-0"
                                      title="Drag to reorder sub-category"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <span className="text-gray-300 dark:text-zinc-700 font-light select-none mr-1">└──</span>
                                    <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-2xs">
                                      {sub.icon || sub.image ? (
                                        <Image
                                          src={sub.icon || sub.image || ""}
                                          alt={sub.name}
                                          width={32}
                                          height={32}
                                          className="object-contain w-full h-full p-0.5"
                                        />
                                      ) : (
                                        <ImageIcon className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-extrabold text-sm text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                                        <span>{sub.name}</span>
                                        {sub.isVisible !== false && !sub.hideInMenu ? (
                                          <span className="text-[8px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-0.5">
                                            Visible
                                          </span>
                                        ) : (
                                          <span className="text-[8px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/40 flex items-center gap-0.5">
                                            Hidden
                                          </span>
                                        )}
                                      </p>
                                      <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">/{sub.slug}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-5 text-center">
                                  <div className="inline-flex items-center justify-center gap-1 bg-gray-50/50 dark:bg-zinc-950 p-1 rounded-xl border border-gray-100 dark:border-zinc-800">
                                    <button
                                      type="button"
                                      disabled={subCats.findIndex((s) => s.id === sub.id) === 0}
                                      onClick={() => handleMoveCategory(sub, "up", subCats)}
                                      className="p-1 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
                                      title="Move sub-category up"
                                    >
                                      <ArrowUp className="h-3.5 w-3.5" />
                                    </button>
                                    <input
                                      type="number"
                                      value={sub.displayOrder ?? 0}
                                      onChange={(e) => handleOrderInputChange(sub.id, parseInt(e.target.value) || 0)}
                                      className="w-10 text-center text-xs font-bold bg-transparent outline-none border-b border-transparent focus:border-red-500 text-gray-900 dark:text-zinc-100"
                                    />
                                    <button
                                      type="button"
                                      disabled={subCats.findIndex((s) => s.id === sub.id) === subCats.length - 1}
                                      onClick={() => handleMoveCategory(sub, "down", subCats)}
                                      className="p-1 rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-all"
                                      title="Move sub-category down"
                                    >
                                      <ArrowDown className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                                <td className="p-5 text-sm text-gray-400 dark:text-zinc-500 max-w-xs truncate">
                                  {sub.description || "No description provided."}
                                </td>
                                <td className="p-5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleVisibility(sub)}
                                      className={`p-2 rounded-lg border transition-all cursor-pointer ${sub.isVisible !== false && !sub.hideInMenu
                                        ? "bg-gray-50 text-emerald-600 hover:bg-emerald-50 dark:bg-zinc-800 dark:text-emerald-400 border-gray-100 dark:border-zinc-800"
                                        : "bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"
                                        }`}
                                      title={sub.isVisible !== false && !sub.hideInMenu ? "Visible on site - Click to hide" : "Hidden from site - Click to show"}
                                    >
                                      {sub.isVisible !== false && !sub.hideInMenu ? (
                                        <Eye className="h-4 w-4" />
                                      ) : (
                                        <EyeOff className="h-4 w-4" />
                                      )}
                                    </button>
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
                        Display Order Position
                      </label>
                      <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                        placeholder="e.g. 1"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">Numerical order position (lower numbers appear first on the website menu and catalog).</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Category Tagline
                      </label>
                      <input
                        type="text"
                        value={formData.tagline}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tagline: e.target.value }))}
                        placeholder="e.g. Super Premium Adhesives by Jivanjor"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                      />
                    </div>

                    <div>
                      <ImageUpload
                        label="Featured Category Image / Thumbnail"
                        value={formData.icon}
                        onChange={(url) => setFormData((prev) => ({ ...prev, icon: url }))}
                        folder="categories"
                        aspect="square"
                      />
                      <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1">
                        Featured thumbnail icon for this category (displayed as the category card icon on category listing pages, sidebar selectors, and navigation menus).
                      </p>
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

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Visibility Status
                      </label>
                      <div className="flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950">
                        <input
                          type="checkbox"
                          id="categoryIsVisible"
                          checked={formData.isVisible !== false && !formData.hideInMenu}
                          onChange={(e) => setFormData((prev) => ({ ...prev, isVisible: e.target.checked, hideInMenu: !e.target.checked }))}
                          className="h-4 w-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                        <label htmlFor="categoryIsVisible" className="text-sm font-extrabold text-gray-900 dark:text-zinc-100 cursor-pointer select-none">
                          Visible on Website & Menu Settings
                        </label>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">If unchecked, this category and its sub-categories will be hidden from the public website UI and menu settings admin panel.</p>
                    </div>
                  </div>
                )}

                {activeTab === "content" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <FileText className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">Dynamic Page Content</h3>
                    </div>

                    <div className="p-4 bg-gray-50/20 dark:bg-zinc-955/20 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-4">
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

                      </div>
                    </div>

                    <div className="p-4 bg-gray-50/20 dark:bg-zinc-955/20 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-4">
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

                    <div className="p-4 bg-gray-50/20 dark:bg-zinc-955/20 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-4">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Right Choice Banner Section ("Need Help Choosing the Right Adhesive?")</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Banner Title</label>
                          <input
                            type="text"
                            value={formData.rightChoiceTitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, rightChoiceTitle: e.target.value }))}
                            placeholder="Need Help Choosing the Right Adhesive?"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Banner Subtitle / Description</label>
                          <textarea
                            rows={2}
                            value={formData.rightChoiceSubtitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, rightChoiceSubtitle: e.target.value }))}
                            placeholder="Share your woodwork needs, product query or application concerns. Our team will help you find the right Jivanjor solution."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">CTA Button Text</label>
                          <input
                            type="text"
                            value={formData.rightChoiceCtaText}
                            onChange={(e) => setFormData(prev => ({ ...prev, rightChoiceCtaText: e.target.value }))}
                            placeholder="Submit Your Query"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">CTA Button Link Target</label>
                          <input
                            type="text"
                            value={formData.rightChoiceCtaLink}
                            onChange={(e) => setFormData(prev => ({ ...prev, rightChoiceCtaLink: e.target.value }))}
                            placeholder="/contact"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
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

          const slug = row.slug?.trim() || (row.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          const existingCat = latestCats.find(
            (c) => c.name.toLowerCase() === (row.name || "").toLowerCase() || c.slug.toLowerCase() === slug.toLowerCase()
          );

          const savedCat = await api.saveCategory({
            id: existingCat?.id,
            name: row.name || "",
            slug,
            description: row.description || "",
            tagline: row.tagline || "",
            parent_category: parentId,
            icon: row.icon || "",
            categoryTitle: row.categoryTitle || "",
            categoryDescription: row.categoryDescription || "",
            resourcesTitle: row.resourcesTitle || "",
            resourcesDescription: row.resourcesDescription || "",
            heroImage: row.heroImage || "",
            researchTitle: row.researchTitle || "",
            researchDescription: row.researchDescription || "",
            researchCtaText: row.researchCtaText || "",
            researchCtaLink: row.researchCtaLink || "",
            researchImage1: row.researchImage1 || "",
            researchImage2: row.researchImage2 || "",
          });

          // Save SEO metadata if SEO fields are present
          if (row.meta_title || row.meta_description || row.canonical_url || row.seo_image) {
            const latestSeos = await api.getSeoMetadata();
            const matchedSeo = latestSeos.find((s) => s.page_type === "category" && s.page_id === savedCat.id);
            await api.saveSeoMetadata({
              id: matchedSeo?.id,
              page_type: "category",
              page_id: savedCat.id,
              meta_title: row.meta_title || savedCat.name,
              meta_description: row.meta_description || savedCat.description || "",
              canonical_url: row.canonical_url || `https://jivanjor.com/categories?category=${savedCat.slug}`,
              image: row.seo_image || undefined,
            });
          }
        }}
      />
    </AdminLayout>
  );
}
