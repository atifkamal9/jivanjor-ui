"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Product, Category, Material } from "@/lib/api";
import { getUserRole } from "@/lib/auth";
import ImageUpload from "@/components/admin/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";
import BulkUploadModal, { ParsedRow } from "@/components/admin/BulkUploadModal";
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
  FileText,
  Award,
  Play,
  HelpCircle,
  Files,
  CopyPlus,
  GripVertical,
  Upload,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);

  // Bulk Upload
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("");
  const [relatedSearch, setRelatedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    short_description: "",
    category_id: "",
    category_ids: [] as string[],
    material_id: "",
    metadata: "",
    image: "",
    backgroundImage: "",
    themeColor: "#0498AA",
    overviewBullets: [] as { text: string; icon: string }[],
    techSpecs: [] as { key: string; value: string }[],
    packSizes: [] as string[],
    documentUrl: "",
    usps: [] as { title: string; description: string; icon: string }[],
    applications: [] as { title: string; description: string; imageA: string; imageB: string }[],
    videoUrl: "",
    videoThumbnail: "",
    faqs: [] as { question: string; answer: string }[],
    relatedProducts: [] as string[],
    techSpecsDescription: "",
    appsTitle: "",
    appsDescription: "",
    videoTitle: "",
    videoDescription: "",
    faqsTitle: "",
    faqsDescription: "",
    relatedTitle: "",
    techResourceTitle: "",
    techResourceDescription: "",
    techResourceFileUrl: "",
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

  // Delete state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserRole(getUserRole());
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

    const primaryCatId = defaultSubId || defaultMainId || "";

    setFormData({
      name: "",
      slug: "",
      description: "",
      short_description: "",
      category_id: primaryCatId,
      category_ids: primaryCatId ? [primaryCatId] : [],
      material_id: materials[0]?.id || "",
      metadata: "",
      image: "",
      backgroundImage: "",
      themeColor: "#0498AA",
      overviewBullets: [
        { text: "Water Resistant", icon: "image 18.svg" },
        { text: "Super Fast Setting - 1 Hour", icon: "image 19.svg" },
        { text: "Anti-Bubble Technology", icon: "image 20.svg" },
        { text: "Superior Coverage", icon: "Texture.svg" }
      ],
      techSpecs: [
        { key: "Appearance", value: "Milk White" },
        { key: "Solids", value: "50-53%" },
        { key: "Viscosity", value: "150-250 Poise" },
        { key: "Coverage", value: "60-70 Sqft/Kg" }
      ],
      packSizes: ["0.6 Kg", "1 Kg", "2 Kg", "5 Kg", "10 Kg", "20 Kg", "30 Kg", "50 Kg", "60 Kg"],
      documentUrl: "",
      usps: [
        { title: "Faster Site Rotation", description: "Fast setting time helps professionals complete work quicker and move between jobs more efficiently.", icon: "Cycle-arrow.svg" },
        { title: "Smooth Spreadability", description: "Superior flow and easy spreading help reduce wastage and support better coverage.", icon: "Texture.svg" },
        { title: "Solvent-Free Safety", description: "Water-based, non-flammable and non-toxic formulation for safer handling during application.", icon: "Asterisk.svg" },
        { title: "Clean Finish After Drying", description: "Dries into a clear transparent film, helping maintain a neat finish around edges and joints.", icon: "Circles-seven.svg" }
      ],
      applications: [
        { title: "Laminate to Plywood Bonding", description: "Suitable for bonding laminate and plywood where strong adhesion, smooth spreadability and anti-bubble performance are important.", imageA: "/images/Rectangle 34.png", imageB: "/images/Rectangle 34 (1).png" },
        { title: "Wood to Wood Joinery", description: "Designed for finger jointing, structural dowelling, and solid wood frames. Ensures high tensile strength and durable bonding.", imageA: "/images/Rectangle 35.png", imageB: "/images/Rectangle 30.png" }
      ],
      videoUrl: "",
      videoThumbnail: "/images/Rectangle 4.png",
      faqs: [
        { question: "How long does it take to set?", answer: "It has a superfast setting time of just 1 hour under typical site conditions." },
        { question: "What is the coverage area?", answer: "Provides coverage of approximately 60-70 sq.ft per kg." }
      ],
      relatedProducts: [],
      techSpecsDescription: "Watershield provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
      appsTitle: "Engineered for the Task at Hand",
      appsDescription: "Explore where Jivanjor fits across furniture, laminates, plywood, boards and woodwork applications.",
      videoTitle: "See product in Action",
      videoDescription: "Watch how trade professionals achieve flawless, high-coverage bonding in record time.",
      faqsTitle: "FAQs",
      faqsDescription: "Find quick answers about product use, coverage, setting time, pack sizes and technical details.",
      relatedTitle: "Related Products",
      techResourceTitle: "Technical Data Sheet",
      techResourceDescription: "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
      techResourceFileUrl: "",
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

    const rawCatIds = product.category_ids || product.categoryIds || [];
    const mergedCatIds = Array.from(new Set([product.category_id, ...rawCatIds])).filter(Boolean);

    const resolvedRelatedIds = (product.relatedProducts || []).map((rel) => {
      const matched = products.find(
        (p) => p.id === rel || p.name.toLowerCase() === rel.toLowerCase() || p.slug.toLowerCase() === rel.toLowerCase()
      );
      return matched ? matched.id : rel;
    });

    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      short_description: product.short_description || product.shortDescription || "",
      category_id: product.category_id,
      category_ids: mergedCatIds,
      material_id: product.material_id,
      metadata: product.metadata,
      image: product.image || "",
      backgroundImage: product.backgroundImage || "",
      themeColor: product.themeColor || "#0498AA",
      overviewBullets: product.overviewBullets || [],
      techSpecs: product.techSpecs || [],
      packSizes: product.packSizes || [],
      documentUrl: product.documentUrl || "",
      usps: product.usps || [],
      applications: product.applications || [],
      videoUrl: product.videoUrl || "",
      videoThumbnail: product.videoThumbnail || "",
      faqs: product.faqs || [],
      relatedProducts: resolvedRelatedIds,
      techSpecsDescription: product.techSpecsDescription || "",
      appsTitle: product.appsTitle || "",
      appsDescription: product.appsDescription || "",
      videoTitle: product.videoTitle || "",
      videoDescription: product.videoDescription || "",
      faqsTitle: product.faqsTitle || "",
      faqsDescription: product.faqsDescription || "",
      relatedTitle: product.relatedTitle || "",
      techResourceTitle: product.techResourceTitle || "",
      techResourceDescription: product.techResourceDescription || "",
      techResourceFileUrl: product.techResourceFileUrl || "",
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

  const handleDuplicate = (product: Product) => {
    // Set editingId to null so saving creates a brand new product
    setEditingId(null);

    // Find the product's category parent-child mapping
    const productCat = categories.find((c) => c.id === product.category_id);
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
      const rootCats = categories.filter((c) => !c.parent_category);
      mainId = rootCats[0]?.id || "";
      const subs = categories.filter((c) => c.parent_category === mainId);
      subId = subs[0]?.id || "";
    }

    setSelectedMainCategoryId(mainId);
    setSelectedSubCategoryId(subId);

    const duplicateName = `${product.name} (Copy)`;
    const baseSlug = product.slug.endsWith("-copy") ? product.slug : `${product.slug}-copy`;
    const duplicateSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const rawCatIds = product.category_ids || product.categoryIds || [];
    const mergedCatIds = Array.from(new Set([product.category_id, ...rawCatIds])).filter(Boolean);

    const resolvedRelatedIds = (product.relatedProducts || []).map((rel) => {
      const matched = products.find(
        (p) => p.id === rel || p.name.toLowerCase() === rel.toLowerCase() || p.slug.toLowerCase() === rel.toLowerCase()
      );
      return matched ? matched.id : rel;
    });

    setFormData({
      name: duplicateName,
      slug: duplicateSlug,
      description: product.description,
      short_description: product.short_description || product.shortDescription || "",
      category_id: product.category_id,
      category_ids: mergedCatIds,
      material_id: product.material_id,
      metadata: product.metadata,
      image: product.image || "",
      backgroundImage: product.backgroundImage || "",
      themeColor: product.themeColor || "#0498AA",
      overviewBullets: product.overviewBullets || [],
      techSpecs: product.techSpecs || [],
      packSizes: product.packSizes || [],
      documentUrl: product.documentUrl || "",
      usps: product.usps || [],
      applications: product.applications || [],
      videoUrl: product.videoUrl || "",
      videoThumbnail: product.videoThumbnail || "",
      faqs: product.faqs || [],
      relatedProducts: resolvedRelatedIds,
      techSpecsDescription: product.techSpecsDescription || "",
      appsTitle: product.appsTitle || "",
      appsDescription: product.appsDescription || "",
      videoTitle: product.videoTitle || "",
      videoDescription: product.videoDescription || "",
      faqsTitle: product.faqsTitle || "",
      faqsDescription: product.faqsDescription || "",
      relatedTitle: product.relatedTitle || "",
      techResourceTitle: product.techResourceTitle || "",
      techResourceDescription: product.techResourceDescription || "",
      techResourceFileUrl: product.techResourceFileUrl || "",
    });

    const matchedSeo = seos.find(
      (s) => s.page_type === "product" && s.page_id === product.id
    );
    setExistingSeoId(null);
    if (matchedSeo) {
      setSeoMetaTitle(`${matchedSeo.meta_title} (Copy)`);
      setSeoMetaDescription(matchedSeo.meta_description);
      setSeoCanonicalUrl(`https://jivanjor.com/products/${duplicateSlug}`);
      setSeoImage(matchedSeo.image || "");
    } else {
      setSeoMetaTitle(`${duplicateName} | Jivanjor`);
      setSeoMetaDescription(product.description || "");
      setSeoCanonicalUrl(`https://jivanjor.com/products/${duplicateSlug}`);
      setSeoImage(product.image || "");
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
        overviewBullets: formData.overviewBullets.slice(0, 3),
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

  // Filter & Sort products by latest updated order
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.metadata.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory
        ? Array.from(new Set([p.category_id, ...(p.category_ids || p.categoryIds || [])])).includes(filterCategory)
        : true;
      const matchesMaterial = filterMaterial ? p.material_id === filterMaterial : true;
      return matchesSearch && matchesCategory && matchesMaterial;
    })
    .sort((a: any, b: any) => {
      const timeA = new Date(a.updated_at || a.updatedAt || a.created_at || a.createdAt || 0).getTime();
      const timeB = new Date(b.updated_at || b.updatedAt || b.created_at || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const tabsList = [
    { id: "general", label: "General Properties", icon: Sliders },
    { id: "overview", label: "Overview Details", icon: Package },
    { id: "specs", label: "Technical Specs", icon: FileText },
    { id: "usps", label: "Unique USPs", icon: Award },
    { id: "apps", label: "Applications & Video", icon: Play },
    { id: "faqs", label: "FAQs Editor", icon: HelpCircle },
    { id: "resources", label: "Technical Resources", icon: Files },
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
                <span>Create Product Profile</span>
              </button>
            </div>
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
            </div>
          </div>

          {/* Database Table */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 text-xs font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    <th className="px-6 py-4 w-72 sm:w-80 min-w-[260px]">Product</th>
                    <th className="px-6 py-4 w-80 min-w-[280px]">Category</th>
                    <th className="px-6 py-4 min-w-[260px]">Description</th>
                    <th className="px-6 py-4 w-32 min-w-[120px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 bg-surface/5">
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
                          <td className="px-6 py-5 min-w-[260px]">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 overflow-hidden flex items-center justify-center shrink-0">
                                {p.image ? (
                                  <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                                ) : (
                                  <ImageIcon className="h-5 w-5 text-gray-300 dark:text-zinc-600" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-black text-sm text-gray-900 dark:text-zinc-50 truncate">{p.name}</p>
                                <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-semibold tracking-wider">{p.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 min-w-[280px]">
                            <div className="flex flex-wrap gap-2 max-w-sm">
                              {(() => {
                                const allCatIds = Array.from(new Set([p.category_id, ...(p.category_ids || p.categoryIds || [])])).filter(Boolean);
                                if (allCatIds.length === 0) {
                                  return (
                                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400">
                                      Uncategorized
                                    </span>
                                  );
                                }
                                return allCatIds.map((cId) => {
                                  const cObj = categories.find((c) => c.id === cId);
                                  if (!cObj) return null;
                                  const isPrimary = cId === p.category_id;

                                  return (
                                    <span
                                      key={cId}
                                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-2xs ${isPrimary ? "" : "opacity-80"
                                        }`}
                                      style={{ color: p.themeColor || "#0498AA", backgroundColor: (p.themeColor || "#0498AA") + "1F" }}
                                    >
                                      {cObj.name}
                                    </span>
                                  );
                                });
                              })()}
                            </div>
                          </td>
                          <td className="px-6 py-5 min-w-[260px] max-w-md">
                            <p className="text-xs text-gray-600 dark:text-zinc-300 font-medium line-clamp-2 leading-relaxed" title={p.short_description || p.description}>
                              {p.short_description || p.shortDescription || "No description provided."}
                            </p>
                          </td>
                          {/* <td className="p-5">
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
                          </td> */}
                          <td className="px-6 py-5 text-right font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer border border-gray-100 dark:border-zinc-800"
                                title="Edit product"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDuplicate(p)}
                                className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer border border-gray-100 dark:border-zinc-800"
                                title="Duplicate product profile"
                              >
                                <CopyPlus className="h-4 w-4" />
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
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 bg-surface/5">
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
                          Primary Main Category
                        </label>
                        <select
                          value={selectedMainCategoryId}
                          onChange={(e) => {
                            const mainId = e.target.value;
                            setSelectedMainCategoryId(mainId);
                            const subs = categories.filter((c) => c.parent_category === mainId);
                            const firstSubId = subs.length > 0 ? subs[0].id : "";
                            setSelectedSubCategoryId(firstSubId);
                            const primaryId = firstSubId || mainId;
                            setFormData((prev) => ({
                              ...prev,
                              category_id: primaryId,
                              category_ids: Array.from(new Set([primaryId, ...prev.category_ids])),
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
                          Primary Sub-Category
                        </label>
                        <select
                          value={selectedSubCategoryId}
                          onChange={(e) => {
                            const subId = e.target.value;
                            setSelectedSubCategoryId(subId);
                            const primaryId = subId || selectedMainCategoryId;
                            setFormData((prev) => ({
                              ...prev,
                              category_id: primaryId,
                              category_ids: Array.from(new Set([primaryId, ...prev.category_ids])),
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

                    {/* Multi-Category Selector */}
                    <div className="space-y-3 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-gray-50/40 dark:bg-zinc-900/40">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="h-4 w-4 text-red-600" />
                          <span>Assign Multiple Categories & Sub-Categories</span>
                        </label>
                        <span className="text-[11px] font-extrabold text-red-600 bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/30 px-2.5 py-0.5 rounded-full">
                          {formData.category_ids.length} Categories Selected
                        </span>
                      </div>

                      {/* Active Badges */}
                      {formData.category_ids.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-gray-200 dark:border-zinc-800">
                          {formData.category_ids.map((catId) => {
                            const cat = categories.find((c) => c.id === catId);
                            if (!cat) return null;
                            const isPrimary = catId === formData.category_id;
                            const parentCat = cat.parent_category ? categories.find((c) => c.id === cat.parent_category) : null;
                            const label = parentCat ? `${parentCat.name} → ${cat.name}` : cat.name;

                            return (
                              <span
                                key={catId}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition ${isPrimary
                                  ? "bg-red-600 text-white shadow-xs"
                                  : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 border border-gray-200 dark:border-zinc-700"
                                  }`}
                              >
                                <span>{label}</span>
                                {isPrimary && <span className="text-[9px] uppercase bg-white/20 px-1.5 py-0.2 rounded font-black">Primary</span>}
                                {!isPrimary && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = formData.category_ids.filter((id) => id !== catId);
                                      setFormData((prev) => ({ ...prev, category_ids: updated }));
                                    }}
                                    className="hover:text-red-600 transition"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Checkbox Groups by Main Category */}
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {categories
                          .filter((c) => !c.parent_category)
                          .map((mainCat) => {
                            const subCats = categories.filter((c) => c.parent_category === mainCat.id);

                            return (
                              <div key={mainCat.id} className="p-3 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl space-y-2">
                                <div className="font-extrabold text-xs text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                                  <span className="text-red-600 font-black">●</span>
                                  <span>{mainCat.name}</span>
                                  <span className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">(Main Category)</span>
                                </div>

                                {subCats.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-zinc-900">
                                    {subCats.map((subCat) => {
                                      const isSubChecked = formData.category_ids.includes(subCat.id);

                                      return (
                                        <label key={subCat.id} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:text-red-600 transition select-none p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900">
                                          <input
                                            type="checkbox"
                                            checked={isSubChecked}
                                            onChange={(e) => {
                                              let updated: string[];
                                              if (e.target.checked) {
                                                updated = Array.from(new Set([...formData.category_ids, subCat.id]));
                                              } else {
                                                if (subCat.id === formData.category_id) return;
                                                updated = formData.category_ids.filter((id) => id !== subCat.id);
                                              }
                                              setFormData((prev) => ({ ...prev, category_ids: updated }));
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                                          />
                                          <span>{subCat.name}</span>
                                        </label>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-[11px] text-gray-400 italic pl-4">No sub-categories defined under this main category.</p>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ImageUpload
                        label="Product Pack / Can Image"
                        value={formData.image}
                        onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                        folder="products"
                        aspect="square"
                      />
                      <ImageUpload
                        label="Product Background Image"
                        value={formData.backgroundImage}
                        onChange={(url) => setFormData((prev) => ({ ...prev, backgroundImage: url }))}
                        folder="products"
                        aspect="video"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                        <span>Short Description (Cards &amp; Quick Teaser)</span>
                        <span className={`text-[10px] font-bold ${formData.short_description.length >= 80 ? "text-amber-500" : "text-gray-400"}`}>
                          {formData.short_description.length} / 80 chars max
                        </span>
                      </label>
                      <input
                        type="text"
                        maxLength={80}
                        value={formData.short_description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
                        placeholder="Brief overview teaser (max 80 characters e.g. Water-resistant, high-strength adhesive...)"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        <span>Full Product Specifications &amp; Detailed Description</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Write detailed product features, application methods, surface preparation & tech info..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <Files className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">Technical Resources</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Resource Title</label>
                        <input
                          type="text"
                          value={formData.techResourceTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, techResourceTitle: e.target.value }))}
                          placeholder="e.g. Watershield - Technical Data Sheet"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Resource Description</label>
                        <input
                          type="text"
                          value={formData.techResourceDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, techResourceDescription: e.target.value }))}
                          placeholder="e.g. Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <FileUpload
                      label="Upload Technical Resource File (PDF/DOC/ZIP)"
                      value={formData.techResourceFileUrl}
                      onChange={(url) => setFormData(prev => ({ ...prev, techResourceFileUrl: url }))}
                      folder="resources"
                    />
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
                      aspect="square"
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

                {activeTab === "overview" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <Package className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">Overview Details</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          Theme Color
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={formData.themeColor}
                            onChange={(e) => setFormData(prev => ({ ...prev, themeColor: e.target.value }))}
                            className="w-12 h-11 p-1 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50/50 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={formData.themeColor}
                            onChange={(e) => setFormData(prev => ({ ...prev, themeColor: e.target.value }))}
                            placeholder="#0498AA"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 dark:focus:border-red-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Overview Bullets */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Overview Highlights (Bullet Features)
                      </label>
                      <div className="space-y-3 p-4 border border-gray-150 dark:border-zinc-800 rounded-2xl bg-gray-50/30 dark:bg-zinc-900/40">
                        {formData.overviewBullets.map((bullet, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              required
                              minLength={3}
                              maxLength={30}
                              value={bullet.text}
                              onChange={(e) => setFormData(prev => {
                                const list = [...prev.overviewBullets];
                                list[idx] = { ...list[idx], text: e.target.value };
                                return {
                                  ...prev,
                                  overviewBullets: list,
                                  metadata: list.map(b => b.text).join(", ")
                                };
                              })}
                              placeholder="Bullet feature text..."
                              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                            />
                            <select
                              value={bullet.icon}
                              onChange={(e) => setFormData(prev => {
                                const list = [...prev.overviewBullets];
                                list[idx] = { ...list[idx], icon: e.target.value };
                                return { ...prev, overviewBullets: list };
                              })}
                              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer"
                            >
                              <option value="image 18.svg">Teal Water Drop (image 18)</option>
                              <option value="image 19.svg">Teal Timer Clock (image 19)</option>
                              <option value="image 20.svg">Teal Bubbles (image 20)</option>
                              <option value="Star.svg">Star (Premium)</option>
                              <option value="Cycle-arrow.svg">Cycle Arrow (Speed)</option>
                              <option value="Circles-seven.svg">Circles Seven (Finish)</option>
                              <option value="Texture.svg">Texture (Spread)</option>
                              <option value="Asterisk.svg">Asterisk (Safety)</option>
                              <option value="badge.svg">Shield Badge</option>
                            </select>
                            <div className="flex items-center justify-center p-2 w-10 h-10 rounded-xl shrink-0"
                              style={{ backgroundColor: `${formData.themeColor}` }}>
                              <img
                                src={`/icons/${bullet.icon}`}
                                alt="icon preview"
                                className="w-5 h-5 object-contain"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => {
                                const list = prev.overviewBullets.filter((_, i) => i !== idx);
                                return {
                                  ...prev,
                                  overviewBullets: list,
                                  metadata: list.map(b => b.text).join(", ")
                                };
                              })}
                              className="p-2.5 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-955/20 border border-gray-200 dark:border-zinc-800 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          disabled={formData.overviewBullets.length >= 3}
                          onClick={() => setFormData(prev => {
                            if (prev.overviewBullets.length >= 3) return prev;
                            const list = [...prev.overviewBullets, { text: "", icon: "image 18.svg" }];
                            return {
                              ...prev,
                              overviewBullets: list,
                              metadata: list.map(b => b.text).join(", ")
                            };
                          })}
                          className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-zinc-800 text-xs font-bold hover:bg-white dark:hover:bg-zinc-900/60 dark:text-zinc-400 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4 text-red-600" />
                          <span>{formData.overviewBullets.length >= 3 ? "Max 3 Bullets Reached" : "Add Overview Bullet"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Related Products */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Related Products Section Title</label>
                        <input
                          type="text"
                          value={formData.relatedTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, relatedTitle: e.target.value }))}
                          placeholder="e.g. Related Products"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                        />
                      </div>
                      <div className="space-y-4 font-google-sans">
                        <div className="flex items-center justify-between border-t border-border pt-4">
                          <span className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400">
                            SELECT RELATED PRODUCTS
                          </span>
                          <span className="px-3 py-1 bg-red-50 dark:bg-red-955/40 text-red-600 dark:text-red-400 rounded-full text-xs font-black border border-red-200 dark:border-red-900/50">
                            {formData.relatedProducts.length} Products Selected
                          </span>
                        </div>

                        {/* Drag & Drop Selected Products Reorder Bar */}
                        {formData.relatedProducts.length > 0 && (
                          <div className="p-4 border-2 border-dashed border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-955/20 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-wider">
                                <GripVertical className="h-4 w-4" />
                                <span>DRAG & DROP TO REARRANGE DISPLAY ORDER</span>
                              </div>
                              <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-bold">
                                Order: 1st → Last in Carousel
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                              {formData.relatedProducts.map((relId: string, pIdx: number) => {
                                const prod = products.find((p) => p.id === relId);
                                const prodName = prod ? prod.name : relId;
                                const prodImg = prod?.image;

                                return (
                                  <div
                                    key={relId}
                                    draggable={true}
                                    onDragStart={(e) => {
                                      e.dataTransfer.setData("text/plain", relId);
                                      e.dataTransfer.effectAllowed = "move";
                                    }}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      e.dataTransfer.dropEffect = "move";
                                    }}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      const draggedId = e.dataTransfer.getData("text/plain");
                                      if (!draggedId || draggedId === relId) return;

                                      const currentSelected = [...formData.relatedProducts];
                                      const sourceIndex = currentSelected.indexOf(draggedId);
                                      const targetIndex = currentSelected.indexOf(relId);

                                      if (sourceIndex !== -1 && targetIndex !== -1) {
                                        const [moved] = currentSelected.splice(sourceIndex, 1);
                                        currentSelected.splice(targetIndex, 0, moved);
                                        setFormData((prev) => ({ ...prev, relatedProducts: currentSelected }));
                                      }
                                    }}
                                    className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-zinc-900 border border-red-300/80 dark:border-red-900/60 rounded-2xl text-xs font-extrabold shadow-2xs cursor-grab active:cursor-grabbing transition hover:shadow-md select-none"
                                  >
                                    <GripVertical className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-955/40 text-red-600 dark:text-red-400 text-[11px] font-black flex items-center justify-center shrink-0">
                                      {pIdx + 1}
                                    </span>
                                    {prodImg && (
                                      <div className="w-6 h-6 relative shrink-0">
                                        <img src={prodImg} alt="" className="w-full h-full object-contain" />
                                      </div>
                                    )}
                                    <span className="truncate max-w-[140px] text-gray-800 dark:text-zinc-100 font-bold">{prodName}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = formData.relatedProducts.filter((id: string) => id !== relId);
                                        setFormData((prev) => ({ ...prev, relatedProducts: updated }));
                                      }}
                                      className="text-gray-400 hover:text-red-600 transition ml-1 cursor-pointer"
                                      title="Remove product"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Search Filter Input Bar */}
                        <div className="relative my-2">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                          <input
                            type="text"
                            value={relatedSearch}
                            onChange={(e) => setRelatedSearch(e.target.value)}
                            placeholder="Search related products by name..."
                            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100 font-medium transition"
                          />
                          {relatedSearch && (
                            <button
                              type="button"
                              onClick={() => setRelatedSearch("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Product Checkboxes Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                          {products
                            .filter((p) => p.id !== editingId)
                            .filter((p) =>
                              !relatedSearch ||
                              p.name.toLowerCase().includes(relatedSearch.toLowerCase()) ||
                              (p.description && p.description.toLowerCase().includes(relatedSearch.toLowerCase()))
                            )
                            .map((p) => {
                              const isChecked = formData.relatedProducts.includes(p.id);

                              return (
                                <label
                                  key={p.id}
                                  className={`px-4 py-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${isChecked
                                    ? "border-red-400 bg-red-50/40 dark:bg-red-955/30 text-red-700 dark:text-red-400 shadow-2xs font-extrabold"
                                    : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-red-300 text-gray-700 dark:text-zinc-300 font-medium"
                                    }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() =>
                                      setFormData((prev) => {
                                        const list = isChecked
                                          ? prev.relatedProducts.filter((id) => id !== p.id)
                                          : [...prev.relatedProducts, p.id];
                                        return { ...prev, relatedProducts: list };
                                      })
                                    }
                                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer accent-red-600"
                                  />
                                  {p.image && (
                                    <div className="w-6 h-6 relative shrink-0">
                                      <img src={p.image} alt="" className="w-full h-full object-contain" />
                                    </div>
                                  )}
                                  <span className="text-xs font-bold truncate">{p.name}</span>
                                </label>
                              );
                            })}
                          {products.filter((p) => p.id !== editingId).length === 0 && (
                            <span className="text-xs text-gray-400 italic">No other products configured in catalogue.</span>
                          )}
                          {products.filter((p) => p.id !== editingId).length > 0 &&
                            products
                              .filter((p) => p.id !== editingId)
                              .filter((p) =>
                                !relatedSearch ||
                                p.name.toLowerCase().includes(relatedSearch.toLowerCase()) ||
                                (p.description && p.description.toLowerCase().includes(relatedSearch.toLowerCase()))
                              ).length === 0 && (
                              <span className="col-span-full py-3 text-center text-xs text-gray-400 dark:text-zinc-500 italic">
                                No products found matching &quot;{relatedSearch}&quot;
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <FileText className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">Technical Specifications</h3>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Tech Specs Section Tagline/Intro</label>
                      <input
                        type="text"
                        value={formData.techSpecsDescription}
                        onChange={(e) => setFormData(prev => ({ ...prev, techSpecsDescription: e.target.value }))}
                        placeholder="e.g. Watershield provides excellent water-resistance. Its superior flow makes it smooth and easy to apply."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                      />
                    </div>

                    {/* Technical Specs */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Technical Specifications (Appearance, Viscosity, Solids, Coverage, etc.)
                      </label>
                      <div className="space-y-2 mb-2">
                        {formData.techSpecs.map((spec, specIdx) => (
                          <div key={specIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={spec.key}
                              onChange={(e) => setFormData(prev => {
                                const newSpecs = [...prev.techSpecs];
                                newSpecs[specIdx].key = e.target.value;
                                return { ...prev, techSpecs: newSpecs };
                              })}
                              placeholder="Parameter (e.g. Viscosity)"
                              className="w-1/3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                            />
                            <input
                              type="text"
                              value={spec.value}
                              onChange={(e) => setFormData(prev => {
                                const newSpecs = [...prev.techSpecs];
                                newSpecs[specIdx].value = e.target.value;
                                return { ...prev, techSpecs: newSpecs };
                              })}
                              placeholder="Value (e.g. 150-250 Poise)"
                              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-955 dark:text-zinc-100"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                techSpecs: prev.techSpecs.filter((_, i) => i !== specIdx)
                              }))}
                              className="p-2.5 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-955/20 border border-gray-200 dark:border-zinc-800 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          techSpecs: [...prev.techSpecs, { key: "", value: "" }]
                        }))}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 text-xs font-bold hover:bg-gray-50 dark:hover:bg-zinc-850 dark:text-zinc-300 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5 text-red-600" />
                        <span>Add Spec Row</span>
                      </button>
                    </div>

                    {/* Pack Sizes */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Available Pack Sizes
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          id="new-size-input"
                          placeholder="e.g. 1 Kg"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const input = e.currentTarget;
                              const val = input.value.trim();
                              if (val && !formData.packSizes.includes(val)) {
                                setFormData(prev => ({ ...prev, packSizes: [...prev.packSizes, val] }));
                                input.value = "";
                              }
                            }
                          }}
                          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById("new-size-input") as HTMLInputElement;
                            const val = input?.value.trim();
                            if (val && !formData.packSizes.includes(val)) {
                              setFormData(prev => ({ ...prev, packSizes: [...prev.packSizes, val] }));
                              if (input) input.value = "";
                            }
                          }}
                          className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-955/20 text-xs font-bold text-gray-700 dark:text-zinc-350 hover:text-red-600 transition-all border border-gray-200 dark:border-zinc-800 cursor-pointer"
                        >
                          Add Size
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50/50 dark:bg-zinc-955/30 rounded-xl border border-gray-100 dark:border-zinc-800 min-h-[44px]">
                        {formData.packSizes.length === 0 ? (
                          <span className="text-xs text-gray-400 dark:text-zinc-500 font-semibold italic">No pack sizes configured yet.</span>
                        ) : (
                          formData.packSizes.map((size, idx) => (
                            <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-955/20 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/20">
                              <span>{size}</span>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  packSizes: prev.packSizes.filter((_, i) => i !== idx)
                                }))}
                                className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 font-bold focus:outline-none"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "usps" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <Award className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">Unique Selling Propositions (USPs)</h3>
                    </div>


                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                          Unique Selling Propositions (USPs) - Max 4
                        </label>
                        <span className="text-[10px] text-gray-400 font-bold">{formData.usps.length} / 4 configured</span>
                      </div>
                      <div className="space-y-4 p-4 border border-gray-150 dark:border-zinc-800 rounded-2xl bg-gray-50/30 dark:bg-zinc-900/40">
                        {formData.usps.map((usp, idx) => (
                          <div key={idx} className="p-3 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-850 rounded-xl relative space-y-2">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                usps: prev.usps.filter((_, i) => i !== idx)
                              }))}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 font-bold transition-colors text-lg cursor-pointer"
                            >
                              &times;
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 sm:pt-0">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">USP Title</label>
                                <input
                                  type="text"
                                  required
                                  value={usp.title}
                                  onChange={(e) => setFormData(prev => {
                                    const list = [...prev.usps];
                                    list[idx].title = e.target.value;
                                    return { ...prev, usps: list };
                                  })}
                                  placeholder="e.g. Faster Site Rotation"
                                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">USP Icon Name</label>
                                <div className="flex items-center gap-2">
                                  <select
                                    value={usp.icon}
                                    onChange={(e) => setFormData(prev => {
                                      const list = [...prev.usps];
                                      list[idx].icon = e.target.value;
                                      return { ...prev, usps: list };
                                    })}
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 cursor-pointer"
                                  >
                                    <option value="Cycle-arrow.svg">Cycle Arrow (Rotate)</option>
                                    <option value="Texture.svg">Texture (Spreadability)</option>
                                    <option value="Asterisk.svg">Asterisk (Safety/Non-toxic)</option>
                                    <option value="Circles-seven.svg">Circles Seven (Clean Finish)</option>
                                    <option value="Star.svg">Star (Premium)</option>
                                    <option value="Shield.svg">Shield (Water Resistance)</option>
                                    <option value="badge.svg">Shield Badge</option>
                                    <option value="image 18.svg">Teal Water Drop (image 18)</option>
                                    <option value="image 19.svg">Teal Timer Clock (image 19)</option>
                                    <option value="image 20.svg">Teal Bubbles (image 20)</option>
                                  </select>
                                  <div
                                    className="flex items-center justify-center p-2 w-9 h-9 rounded-lg shrink-0 border border-black/5"
                                    style={{ backgroundColor: `${formData.themeColor}` }}
                                    title="Icon Preview"
                                  >
                                    <img
                                      src={`/icons/${usp.icon}`}
                                      alt="icon preview"
                                      className="w-4.5 h-4.5 object-contain"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">USP Description</label>
                              <textarea
                                rows={2}
                                required
                                value={usp.description}
                                onChange={(e) => setFormData(prev => {
                                  const list = [...prev.usps];
                                  list[idx].description = e.target.value;
                                  return { ...prev, usps: list };
                                })}
                                placeholder="Write how this feature helps the builder or customer..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 resize-none"
                              />
                            </div>
                          </div>
                        ))}
                        {formData.usps.length < 4 && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              usps: [...prev.usps, { title: "", description: "", icon: "Cycle-arrow.svg" }]
                            }))}
                            className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-zinc-800 text-xs font-bold hover:bg-white dark:hover:bg-zinc-900/60 dark:text-zinc-400 text-gray-600 transition-colors cursor-pointer"
                          >
                            <Plus className="h-4 w-4 text-red-600" />
                            <span>Add USP</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "apps" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <Play className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">Applications & Video</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Applications Section Title</label>
                        <input
                          type="text"
                          value={formData.appsTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, appsTitle: e.target.value }))}
                          placeholder="e.g. Engineered for the Task at Hand"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Applications Section Subtitle</label>
                        <input
                          type="text"
                          value={formData.appsDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, appsDescription: e.target.value }))}
                          placeholder="e.g. Explore where Jivanjor fits across furniture..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    {/* Applications accordion list */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Product Woodwork & Joinery Applications
                      </label>
                      <div className="space-y-4 p-4 border border-gray-150 dark:border-zinc-800 rounded-2xl bg-gray-50/30 dark:bg-zinc-900/40">
                        {formData.applications.map((app, idx) => (
                          <div key={idx} className="p-4 bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-850 rounded-xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                applications: prev.applications.filter((_, i) => i !== idx)
                              }))}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 font-bold transition-colors text-lg cursor-pointer"
                            >
                              &times;
                            </button>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Application Title</label>
                              <input
                                type="text"
                                required
                                value={app.title}
                                onChange={(e) => setFormData(prev => {
                                  const list = [...prev.applications];
                                  list[idx].title = e.target.value;
                                  return { ...prev, applications: list };
                                })}
                                placeholder="e.g. Laminate to Plywood Bonding"
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Application Description</label>
                              <textarea
                                rows={2}
                                required
                                value={app.description}
                                onChange={(e) => setFormData(prev => {
                                  const list = [...prev.applications];
                                  list[idx].description = e.target.value;
                                  return { ...prev, applications: list };
                                })}
                                placeholder="Explain adhesive requirements and performance for this joint..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 resize-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <ImageUpload
                                label="Detail Image URL A"
                                value={app.imageA}
                                onChange={(url) => setFormData(prev => {
                                  const list = [...prev.applications];
                                  list[idx].imageA = url;
                                  return { ...prev, applications: list };
                                })}
                                folder="applications"
                                aspect="cover"
                              />
                              <ImageUpload
                                label="Detail Image URL B"
                                value={app.imageB}
                                onChange={(url) => setFormData(prev => {
                                  const list = [...prev.applications];
                                  list[idx].imageB = url;
                                  return { ...prev, applications: list };
                                })}
                                folder="applications"
                                aspect="cover"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            applications: [...prev.applications, { title: "", description: "", imageA: "/images/Rectangle 34.png", imageB: "/images/Rectangle 34 (1).png" }]
                          }))}
                          className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-zinc-800 text-xs font-bold hover:bg-white dark:hover:bg-zinc-900/60 dark:text-zinc-400 text-gray-600 transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4 text-red-600" />
                          <span>Add Application Spec</span>
                        </button>
                      </div>
                    </div>

                    {/* See in Action Video */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-zinc-850 pt-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Video Section Title</label>
                        <input
                          type="text"
                          value={formData.videoTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, videoTitle: e.target.value }))}
                          placeholder="e.g. See product in Action"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Video Section Subtitle</label>
                        <input
                          type="text"
                          value={formData.videoDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, videoDescription: e.target.value }))}
                          placeholder="e.g. Watch how trade professionals achieve flawless bonding..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                          See in Action Video URL (YouTube or direct MP4)
                        </label>
                        <input
                          type="text"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                          placeholder="e.g. https://www.youtube.com/watch?v=..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                        />
                      </div>
                      <ImageUpload
                        label="Video cover/thumbnail Image"
                        value={formData.videoThumbnail}
                        onChange={(url) => setFormData(prev => ({ ...prev, videoThumbnail: url }))}
                        folder="videos"
                        aspect="video"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "faqs" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-zinc-800 pb-3">
                      <HelpCircle className="h-5 w-5 text-red-600" />
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">FAQs Editor</h3>
                    </div>

                    {/* FAQs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">FAQs Section Title</label>
                        <input
                          type="text"
                          value={formData.faqsTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, faqsTitle: e.target.value }))}
                          placeholder="e.g. FAQs"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">FAQs Section Subtitle</label>
                        <input
                          type="text"
                          value={formData.faqsDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, faqsDescription: e.target.value }))}
                          placeholder="e.g. Find quick answers about product use..."
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                        Product FAQs
                      </label>
                      <div className="space-y-3 p-4 border border-gray-150 dark:border-zinc-800 rounded-2xl bg-gray-50/30 dark:bg-zinc-900/40">
                        {formData.faqs.map((faq, idx) => (
                          <div key={idx} className="p-3 bg-white dark:bg-zinc-95 border border-gray-100 dark:border-zinc-850 rounded-xl relative space-y-2">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                faqs: prev.faqs.filter((_, i) => i !== idx)
                              }))}
                              className="absolute top-2 right-2 text-gray-400 hover:text-red-600 font-bold transition-colors text-lg cursor-pointer"
                            >
                              &times;
                            </button>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Question</label>
                              <input
                                type="text"
                                required
                                value={faq.question}
                                onChange={(e) => setFormData(prev => {
                                  const list = [...prev.faqs];
                                  list[idx].question = e.target.value;
                                  return { ...prev, faqs: list };
                                })}
                                placeholder="Question text..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mb-1">Answer</label>
                              <textarea
                                rows={2}
                                required
                                value={faq.answer}
                                onChange={(e) => setFormData(prev => {
                                  const list = [...prev.faqs];
                                  list[idx].answer = e.target.value;
                                  return { ...prev, faqs: list };
                                })}
                                placeholder="Answer text..."
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-xs outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 resize-none"
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            faqs: [...prev.faqs, { question: "", answer: "" }]
                          }))}
                          className="w-full flex items-center justify-center gap-1 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-zinc-800 text-xs font-bold hover:bg-white dark:hover:bg-zinc-900/60 dark:text-zinc-400 text-gray-600 transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4 text-red-600" />
                          <span>Add FAQ</span>
                        </button>
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
      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onComplete={loadData}
        entityType="product"
        categories={categories}
        materials={materials}
        onSave={async (row: ParsedRow) => {
          const [latestProds, latestCats, latestMats] = await Promise.all([
            api.getProducts(),
            api.getCategories(),
            api.getMaterials()
          ]);

          let catId = row.category_id;
          if (!catId && row.category_name) {
            const matchedCat = latestCats.find(
              (c) => c.name.toLowerCase() === row.category_name!.toLowerCase()
            );
            if (matchedCat) catId = matchedCat.id;
          }
          if (!catId && latestCats.length > 0) {
            catId = latestCats[0].id;
          }

          let matId = row.material_id;
          if (!matId && row.material_name) {
            const matchedMat = latestMats.find(
              (m) => m.name.toLowerCase() === row.material_name!.toLowerCase()
            );
            if (matchedMat) matId = matchedMat.id;
          }

          // Match additional categories
          const extraCatIds: string[] = [];
          if (row.categories && row.categories.length > 0) {
            for (const catName of row.categories) {
              const matched = latestCats.find((c) => c.name.toLowerCase() === catName.toLowerCase());
              if (matched) extraCatIds.push(matched.id);
            }
          }
          const finalCatIds = Array.from(new Set([catId, ...extraCatIds])).filter(Boolean) as string[];

          // Default overview bullets fallback if none provided
          const defaultOverviewBullets = [
            { text: "Water Resistant", icon: "image 18.svg" },
            { text: "Super Fast Setting - 1 Hour", icon: "image 19.svg" },
            { text: "Anti-Bubble Technology", icon: "image 20.svg" },
          ];

          // Default tech specs fallback if none provided
          const defaultTechSpecs = [
            { key: "Appearance", value: "Milk White" },
            { key: "Solids", value: "50-53%" },
            { key: "Viscosity", value: "150-250 Poise" },
            { key: "Coverage", value: "60-70 Sqft/Kg" },
          ];

          // Match related products (names/slugs to Product IDs)
          const relatedProductIds: string[] = [];
          if (row.relatedProducts && row.relatedProducts.length > 0) {
            for (const relItem of row.relatedProducts) {
              const cleanItem = relItem.trim().toLowerCase();
              if (!cleanItem) continue;
              const matched = latestProds.find(
                (p) =>
                  p.name.toLowerCase() === cleanItem ||
                  p.slug.toLowerCase() === cleanItem ||
                  p.id === relItem
              );
              if (matched) {
                relatedProductIds.push(matched.id);
              }
            }
          }

          const slug = row.slug?.trim() || (row.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
          const existingProd = latestProds.find(
            (p) => p.name.toLowerCase() === (row.name || "").toLowerCase() || p.slug.toLowerCase() === slug.toLowerCase()
          );

          const savedProd = await api.saveProduct({
            id: existingProd?.id,
            name: row.name || "",
            slug,
            description: row.description || row.short_description || "",
            short_description: row.short_description || (row.description ? row.description.slice(0, 150) : ""),
            category_id: catId || "",
            category_ids: finalCatIds,
            material_id: matId || "",
            metadata: row.metadata_tags || "",
            image: row.image || "",
            backgroundImage: row.backgroundImage || "",
            themeColor: row.theme_color || "#0498AA",
            overviewBullets: row.overview_bullets && row.overview_bullets.length > 0 ? row.overview_bullets : defaultOverviewBullets,
            techSpecs: row.tech_specs && row.tech_specs.length > 0 ? row.tech_specs : defaultTechSpecs,
            packSizes: row.pack_sizes && row.pack_sizes.length > 0 ? row.pack_sizes : ["1 Kg", "5 Kg", "20 Kg"],
            documentUrl: row.documentUrl || "",
            usps: row.usps || [],
            applications: row.applications && row.applications.length > 0 ? row.applications : [],
            videoUrl: row.videoUrl || "",
            videoThumbnail: row.videoThumbnail || "/images/Rectangle 4.png",
            videoTitle: row.videoTitle || "See product in Action",
            videoDescription: row.videoDescription || "",
            faqs: [],
            faqsTitle: "FAQs",
            faqsDescription: "Find quick answers about product use, coverage, setting time, pack sizes and technical details.",
            relatedProducts: relatedProductIds,
            relatedTitle: row.relatedTitle || "Related Products",
            techSpecsDescription: row.techSpecsDescription || "",
            appsTitle: row.appsTitle || "Engineered for the Task at Hand",
            appsDescription: row.appsDescription || "",
            techResourceTitle: row.techResourceTitle || "Technical Data Sheet",
            techResourceDescription: row.techResourceDescription || "",
            techResourceFileUrl: row.documentUrl || "",
          });

          // Save SEO metadata if SEO fields are present in the row
          if (row.meta_title || row.meta_description || row.canonical_url || row.seo_image) {
            const latestSeos = await api.getSeoMetadata();
            const matchedSeo = latestSeos.find((s) => s.page_type === "product" && s.page_id === savedProd.id);
            await api.saveSeoMetadata({
              id: matchedSeo?.id,
              page_type: "product",
              page_id: savedProd.id,
              meta_title: row.meta_title || savedProd.name,
              meta_description: row.meta_description || savedProd.description || "",
              canonical_url: row.canonical_url || `https://jivanjor.com/products?product=${savedProd.slug}`,
              image: row.seo_image || savedProd.image || undefined,
            });
          }
        }}
      />
    </AdminLayout>
  );
}
