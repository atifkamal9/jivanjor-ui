"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Product, Category, Material } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Package,
  Image as ImageIcon,
  ArrowLeft,
  Sliders,
  Layers,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  
  // Search & Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dependent Category Dropdowns State
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    category_id: "",
    material_id: "",
    metadata: "",
    image: "",
  });

  // SEO metadata states
  const [seos, setSeos] = useState<any[]>([]);
  const [seoMetaTitle, setSeoMetaTitle] = useState("");
  const [seoMetaDescription, setSeoMetaDescription] = useState("");
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState("");
  const [seoImage, setSeoImage] = useState("");
  const [existingSeoId, setExistingSeoId] = useState<string | null>(null);

  // Delete state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsList, catsList, matsList, seosList] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getMaterials(),
        api.getSeoMetadata()
      ]);
      setProducts(prodsList);
      setCategories(catsList);
      setMaterials(matsList);
      setSeos(seosList);

      // Pre-fill categories/materials default options in form
      const rootCats = catsList.filter(c => !c.parent_category);
      if (rootCats.length > 0) {
        const defaultMain = rootCats[0].id;
        const subs = catsList.filter(c => c.parent_category === defaultMain);
        const defaultSub = subs[0]?.id || "";
        
        setSelectedMainCategoryId(defaultMain);
        setSelectedSubCategoryId(defaultSub);
        
        if (!formData.category_id) {
          setFormData(prev => ({
            ...prev,
            category_id: defaultSub || defaultMain
          }));
        }
      }
      if (matsList.length > 0 && !formData.material_id) {
        setFormData(prev => ({
          ...prev,
          material_id: prev.material_id || matsList[0].id
        }));
      }
    } catch (err) {
      console.error("Failed to load products/metadata", err);
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
    const rootCats = categories.filter(c => !c.parent_category);
    const defaultMainId = rootCats[0]?.id || "";
    const subs = categories.filter(c => c.parent_category === defaultMainId);
    const defaultSubId = subs[0]?.id || "";
    
    setSelectedMainCategoryId(defaultMainId);
    setSelectedSubCategoryId(defaultSubId);

    setFormData({
      name: "",
      slug: "",
      description: "",
      category_id: defaultSubId || defaultMainId || "",
      material_id: materials[0]?.id || "",
      metadata: "",
      image: "",
    });

    setSeoMetaTitle("");
    setSeoMetaDescription("");
    setSeoCanonicalUrl("https://jivanjor.com/products");
    setSeoImage("");
    setExistingSeoId(null);
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    
    // Find the product's category parent-child mapping
    const productCat = categories.find(c => c.id === product.category_id);
    let mainId = "";
    let subId = "";
    
    if (productCat) {
      if (productCat.parent_category) {
        mainId = productCat.parent_category;
        subId = productCat.id;
      } else {
        mainId = productCat.id;
        subId = "";
      }
    } else {
      const rootCats = categories.filter(c => !c.parent_category);
      mainId = rootCats[0]?.id || "";
      const subs = categories.filter(c => c.parent_category === mainId);
      subId = subs[0]?.id || "";
    }
    
    setSelectedMainCategoryId(mainId);
    setSelectedSubCategoryId(subId);

    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      category_id: product.category_id,
      material_id: product.material_id,
      metadata: product.metadata,
      image: product.image || "",
    });

    const matchedSeo = seos.find(
      (s) => s.page_type === "product" && s.page_id === product.id
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
      setSeoCanonicalUrl(`https://jivanjor.com/products/${product.slug}`);
      setSeoImage("");
    }

    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const savedProd = await api.saveProduct({
        id: editingId || undefined,
        ...formData,
      });

      // Save SEO metadata record in context
      await api.saveSeoMetadata({
        id: existingSeoId || undefined,
        page_type: "product",
        page_id: savedProd.id,
        meta_title: seoMetaTitle || savedProd.name,
        meta_description: seoMetaDescription || savedProd.description || "",
        canonical_url: seoCanonicalUrl || `https://jivanjor.com/products/${savedProd.slug}`,
        image: seoImage || undefined,
      });

      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save product & SEO", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase()) ||
                          p.metadata.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? p.category_id === filterCategory : true;
    const matchesMaterial = filterMaterial ? p.material_id === filterMaterial : true;
    return matchesSearch && matchesCategory && matchesMaterial;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const tabsList = [
    { id: "general", label: "General Properties", icon: Sliders },
    { id: "seo", label: "SEO Metadata", icon: Search },
  ];

  return (
    <AdminLayout>
      {!isModalOpen ? (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
                Products Catalogue
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Assemble and classify active industrial chemical bonds and adhesives
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 cursor-pointer transition-all self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create Product Profile</span>
            </button>
          </div>

          {/* Filters Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm transition-colors duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 min-w-[320px]">
              <select
                value={filterCategory}
                onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              <select
                value={filterMaterial}
                onChange={(e) => { setFilterMaterial(e.target.value); setCurrentPage(1); }}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
              >
                <option value="">All Materials</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Database Table */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Product</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Category</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Substrate</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Attributes</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 bg-surface/5">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          <span>Retrieving product catalog from database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentProducts.length > 0 ? (
                    currentProducts.map((p) => {
                      const category = categories.find((c) => c.id === p.category_id);
                      const material = materials.find((m) => m.id === p.material_id);
                      return (
                        <tr key={p.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3.5">
                              <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 dark:bg-zinc-850 dark:border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                                {p.image ? (
                                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                                ) : (
                                  <ImageIcon className="h-5 w-5 text-gray-300 dark:text-zinc-600" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-extrabold text-sm text-gray-900 dark:text-zinc-50 truncate">{p.name}</p>
                                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider truncate">{p.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400">
                              {category ? category.name : "Uncategorized"}
                            </span>
                          </td>
                          <td className="p-5">
                            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
                              {material ? material.name : "General purpose"}
                            </span>
                          </td>
                          <td className="p-5">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {p.metadata.split(",").map((tag, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400">
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer border border-gray-100 dark:border-zinc-800"
                                title="Edit product"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(p.id)}
                                className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer border border-gray-100 dark:border-zinc-800"
                                title="Delete product"
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
                      <td colSpan={5} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 bg-surface/5">
                        No products configured in products pool.
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
                <span>{editingId ? "Modify Product details" : "Configure Custom Product"}</span>
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Configure specific settings and edit matching metadata values in context
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
                          Product Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g. WaterShield 2-in-1"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>Product URL Slug</span>
                          <span className="text-[10px] text-red-500 flex items-center gap-1 font-bold uppercase tracking-wider">
                            <Sparkles className="h-3 w-3" /> Auto
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "") }))}
                          placeholder="watershield-2-in-1"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Assign Main Category
                        </label>
                        <select
                          value={selectedMainCategoryId}
                          onChange={(e) => {
                            const mainId = e.target.value;
                            setSelectedMainCategoryId(mainId);
                            const subs = categories.filter((c) => c.parent_category === mainId);
                            const firstSubId = subs.length > 0 ? subs[0].id : "";
                            setSelectedSubCategoryId(firstSubId);
                            setFormData((prev) => ({
                              ...prev,
                              category_id: firstSubId || mainId,
                            }));
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500 cursor-pointer"
                        >
                          {categories
                            .filter((c) => !c.parent_category)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Assign Sub-Category
                        </label>
                        <select
                          value={selectedSubCategoryId}
                          onChange={(e) => {
                            const subId = e.target.value;
                            setSelectedSubCategoryId(subId);
                            setFormData((prev) => ({
                              ...prev,
                              category_id: subId || selectedMainCategoryId,
                            }));
                          }}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500 cursor-pointer"
                        >
                          {categories.filter((c) => c.parent_category === selectedMainCategoryId).length > 0 ? (
                            <>
                              <option value="">None (Assign directly to Main Category)</option>
                              {categories
                                .filter((c) => c.parent_category === selectedMainCategoryId)
                                .map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.name}
                                  </option>
                                ))}
                            </>
                          ) : (
                            <option value="">No subcategories (assign directly to Main Category)</option>
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Target Wood/Substrate Material
                        </label>
                        <select
                          value={formData.material_id}
                          onChange={(e) => setFormData((prev) => ({ ...prev, material_id: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500 cursor-pointer"
                        >
                          {materials.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Attributes (Comma Separated Tags)
                        </label>
                        <input
                          type="text"
                          value={formData.metadata}
                          onChange={(e) => setFormData((prev) => ({ ...prev, metadata: e.target.value }))}
                          placeholder="e.g. waterproof, high-bond, synthetic, marine-grade"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>
                    </div>

                    <ImageUpload
                      label="Illustration Image"
                      value={formData.image}
                      onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                      folder="products"
                    />

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Product Specifications & Description
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Write detailed chemical bonding performance..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500 resize-none"
                      />
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
                        placeholder="e.g. Champion Super PVA White Carpentry Glue | Jivanjor"
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
                        placeholder="e.g. Buy Jivanjor Champion Super wood glue. Fast setting, extreme bond strength carpentry white adhesive designed for plywood sheets pasting."
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
                        placeholder="https://jivanjor.com/products/..."
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
                                {seoCanonicalUrl || "https://jivanjor.com/products"}
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
                              {seoCanonicalUrl || "https://jivanjor.com/products"}
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

              {/* Bottom buttons panel */}
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
                  {editingId ? "Save Modifications" : "Publish Product"}
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
              Are you absolutely sure you want to delete this product? This will permanently remove its catalog details, parameters, and metadata configurations from the local database.
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
