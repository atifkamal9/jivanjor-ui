"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  api,
  SeoMetadata,
  Product,
  Category,
  BlogPost,
  UseCase,
  Issue,
  Page,
} from "@/lib/api";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Globe,
  Link2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function SeoMetadataPage() {
  const [seos, setSeos] = useState<SeoMetadata[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      const [
        seosList,
        prodsList,
        catsList,
        blogsList,
        casesList,
        issuesList,
        pagesList,
      ] = await Promise.all([
        api.getSeoMetadata(),
        api.getProducts().catch(() => []),
        api.getCategories().catch(() => []),
        api.getBlogPosts().catch(() => []),
        api.getUseCases().catch(() => []),
        api.getIssues().catch(() => []),
        api.getPages().catch(() => []),
      ]);
      setSeos(seosList);
      setProducts(prodsList);
      setCategories(catsList);
      setBlogs(blogsList);
      setUseCases(casesList);
      setIssues(issuesList);
      setPages(pagesList);
    } catch (err) {
      console.error("Failed to load SEO and dependencies", err);
    } finally {
      setLoading(false);
    }
  };

  const getOriginBase = () => {
    if (typeof window !== "undefined" && window.location.origin) {
      const origin = window.location.origin;
      if (
        origin.includes("uat.jivanjor.com") ||
        origin.includes("vercel.app") ||
        origin.includes("localhost")
      ) {
        return origin;
      }
    }
    return "https://jivanjor.com";
  };

  const handleOpenAdd = () => {
    const base = getOriginBase();
    setEditingId(null);
    setFormData({
      page_type: "home",
      page_id: "home",
      meta_title: "",
      meta_description: "",
      canonical_url: base,
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
    const base = getOriginBase();
    let defaultId = "";
    let canonical = base;

    switch (type) {
      case "home":
        defaultId = "home";
        canonical = base;
        break;
      case "about":
        defaultId = "about";
        canonical = `${base}/about`;
        break;
      case "contact":
        defaultId = "contact";
        canonical = `${base}/contact`;
        break;
      case "partner":
        defaultId = "partner";
        canonical = `${base}/partner`;
        break;
      case "contractor":
        defaultId = "contractor";
        canonical = `${base}/contractor`;
        break;
      case "products-hub":
        defaultId = "products";
        canonical = `${base}/products`;
        break;
      case "categories-hub":
        defaultId = "categories";
        canonical = `${base}/categories`;
        break;
      case "applications-hub":
        defaultId = "applications";
        canonical = `${base}/applications`;
        break;
      case "blog-hub":
        defaultId = "blog";
        canonical = `${base}/blog`;
        break;
      case "resources":
        defaultId = "resources";
        canonical = `${base}/resources`;
        break;
      case "sitemap":
        defaultId = "sitemap";
        canonical = `${base}/sitemap`;
        break;
      case "privacy":
        defaultId = "privacy";
        canonical = `${base}/privacy`;
        break;
      case "product":
        defaultId = products[0]?.id || "";
        canonical = products[0]
          ? `${base}/products?product=${products[0].slug}`
          : `${base}/products`;
        break;
      case "category":
        defaultId = categories[0]?.id || "";
        canonical = categories[0]
          ? `${base}/categories/${categories[0].slug}`
          : `${base}/categories`;
        break;
      case "use-case":
        defaultId = useCases[0]?.id || "";
        canonical = useCases[0]
          ? `${base}/applications?article=${useCases[0].slug}`
          : `${base}/applications`;
        break;
      case "blog":
        defaultId = blogs[0]?.id || "";
        canonical = blogs[0]
          ? `${base}/blog/${blogs[0].slug}`
          : `${base}/blog`;
        break;
      case "page":
        defaultId = pages[0]?.id || "";
        canonical = pages[0]
          ? `${base}/${pages[0].slug}`
          : base;
        break;
      case "issue":
        defaultId = issues[0]?.id || "";
        canonical = issues[0]
          ? `${base}/troubleshooting/${issues[0].slug}`
          : base;
        break;
      default:
        defaultId = type;
        canonical = `${base}/${type}`;
    }

    setFormData((prev) => ({
      ...prev,
      page_type: type,
      page_id: defaultId,
      canonical_url: canonical,
    }));
  };

  const handlePageIdChange = (id: string) => {
    const base = getOriginBase();
    let canonical = base;

    if (formData.page_type === "product") {
      const p = products.find((x) => x.id === id);
      canonical = p
        ? `${base}/products?product=${p.slug}`
        : `${base}/products`;
    } else if (formData.page_type === "category") {
      const c = categories.find((x) => x.id === id);
      canonical = c
        ? `${base}/categories/${c.slug}`
        : `${base}/categories`;
    } else if (formData.page_type === "use-case") {
      const u = useCases.find((x) => x.id === id);
      canonical = u
        ? `${base}/applications?article=${u.slug}`
        : `${base}/applications`;
    } else if (formData.page_type === "blog") {
      const b = blogs.find((x) => x.id === id);
      canonical = b
        ? `${base}/blog/${b.slug}`
        : `${base}/blog`;
    } else if (formData.page_type === "page") {
      const pg = pages.find((x) => x.id === id);
      canonical = pg ? `${base}/${pg.slug}` : base;
    } else if (formData.page_type === "issue") {
      const i = issues.find((x) => x.id === id);
      canonical = i
        ? `${base}/troubleshooting/${i.slug}`
        : base;
    }

    setFormData((prev) => ({
      ...prev,
      page_id: id,
      canonical_url: canonical,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map static types to backend format
      const isStaticPage = [
        "home",
        "about",
        "contact",
        "partner",
        "contractor",
        "products-hub",
        "categories-hub",
        "applications-hub",
        "blog-hub",
        "resources",
        "sitemap",
        "privacy",
        "page",
      ].includes(formData.page_type);

      const resolvedPageType = isStaticPage
        ? "STATIC"
        : formData.page_type.toUpperCase().replace("-", "_");

      const resolvedPageId =
        formData.page_type === "home"
          ? null
          : formData.page_id || formData.page_type;

      await api.saveSeoMetadata({
        id: editingId || undefined,
        page_type: resolvedPageType.toLowerCase(),
        page_id: resolvedPageId || "",
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        canonical_url: formData.canonical_url,
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
    const sType = (seo.page_type || "").toLowerCase();
    const sId = (seo.page_id || "").toLowerCase();

    if (sType === "home" || (sType === "static" && (!sId || sId === "home"))) {
      return "Global Home Page (/)";
    }
    if (sType === "static" || sType.includes("hub")) {
      if (sId === "about") return "About Us (/about)";
      if (sId === "contact") return "Contact Page (/contact)";
      if (sId === "partner") return "Become a Dealer (/partner)";
      if (sId === "contractor") return "Contractor Connect (/contractor)";
      if (sId === "products" || sId === "products-hub") return "Products Catalog (/products)";
      if (sId === "categories" || sId === "categories-hub") return "Categories Directory (/categories)";
      if (sId === "applications" || sId === "applications-hub") return "Applications Hub (/applications)";
      if (sId === "blog" || sId === "blog-hub") return "Blog Knowledge Hub (/blog)";
      if (sId === "resources") return "Technical Resources (/resources)";
      if (sId === "sitemap") return "HTML Sitemap (/sitemap)";
      if (sId === "privacy") return "Privacy Policy (/privacy)";

      const matchedPage = pages.find((p) => p.id === seo.page_id || p.slug === seo.page_id);
      if (matchedPage) return `CMS Page: ${matchedPage.title} (/${matchedPage.slug})`;
      return `Static Page: ${seo.page_id}`;
    }

    if (sType === "product") {
      const p = products.find((x) => x.id === seo.page_id || x.slug === seo.page_id);
      return `Product: ${p?.name || seo.page_id}`;
    }
    if (sType === "category") {
      const c = categories.find((x) => x.id === seo.page_id || x.slug === seo.page_id);
      return `Category: ${c?.name || seo.page_id}`;
    }
    if (sType === "blog") {
      const b = blogs.find((x) => x.id === seo.page_id || x.slug === seo.page_id);
      return `Blog: ${b?.title || seo.page_id}`;
    }
    if (sType === "use-case" || sType === "use_case") {
      const u = useCases.find((x) => x.id === seo.page_id || x.slug === seo.page_id);
      return `Application Guide: ${u?.title || seo.page_id}`;
    }
    if (sType === "issue") {
      const i = issues.find((x) => x.id === seo.page_id || x.slug === seo.page_id);
      return `Troubleshooting: ${i?.issue_title || seo.page_id}`;
    }

    return `${seo.page_type}: ${seo.page_id}`;
  };

  // Filter SEO configs
  const filteredSeos = seos.filter((s) => {
    const label = getLinkedRecordLabel(s).toLowerCase();
    const matchesSearch =
      s.meta_title.toLowerCase().includes(search.toLowerCase()) ||
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

  const hasMappedDropdown = [
    "product",
    "category",
    "use-case",
    "blog",
    "page",
    "issue",
  ].includes(formData.page_type);

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
                Manage metadata, descriptions, canonical URLs, and index flags across all routing endpoints
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Configure Page SEO</span>
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
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
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      Target Page & Type
                    </th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      Meta Title
                    </th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      Meta Description
                    </th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                      Canonical Link
                    </th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 bg-surface/5"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          <span>Retrieving SEO metadata from database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentSeos.length > 0 ? (
                    currentSeos.map((seo) => (
                      <tr
                        key={seo.id}
                        className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/20 transition-colors"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                              <Globe className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-extrabold text-sm text-gray-900 dark:text-zinc-50 truncate max-w-xs">
                                {getLinkedRecordLabel(seo)}
                              </p>
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
                          <a
                            href={seo.canonical_url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline flex items-center gap-1"
                          >
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
                      <td
                        colSpan={5}
                        className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500"
                      >
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
                <span>
                  {editingId
                    ? "Modify Metadata Configurations"
                    : "Configure Page Metadata"}
                </span>
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
                    <optgroup label="Main & Hub Pages">
                      <option value="home">Home Page (/)</option>
                      <option value="about">About Us (/about)</option>
                      <option value="contact">Contact Page (/contact)</option>
                      <option value="partner">Become a Dealer (/partner)</option>
                      <option value="contractor">Contractor Connect (/contractor)</option>
                      <option value="products-hub">Products Catalog (/products)</option>
                      <option value="categories-hub">Categories Directory (/categories)</option>
                      <option value="applications-hub">Applications Hub (/applications)</option>
                      <option value="blog-hub">Blog Knowledge Hub (/blog)</option>
                      <option value="resources">Technical Resources (/resources)</option>
                      <option value="sitemap">HTML Sitemap (/sitemap)</option>
                      <option value="privacy">Privacy Policy (/privacy)</option>
                    </optgroup>

                    <optgroup label="Dynamic Records">
                      <option value="product">Individual Product</option>
                      <option value="category">Individual Category</option>
                      <option value="use-case">Application Guide</option>
                      <option value="blog">Individual Blog Post</option>
                      <option value="page">CMS Custom Page</option>
                      <option value="issue">Troubleshooting Issue</option>
                    </optgroup>
                  </select>
                </div>

                {/* Dynamic Page Link Identifier Selector */}
                {hasMappedDropdown && (
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
                        products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      {formData.page_type === "category" &&
                        categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      {formData.page_type === "use-case" &&
                        useCases.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.title}
                          </option>
                        ))}
                      {formData.page_type === "blog" &&
                        blogs.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.title}
                          </option>
                        ))}
                      {formData.page_type === "page" &&
                        pages.map((pg) => (
                          <option key={pg.id} value={pg.id}>
                            {pg.title} (/{pg.slug})
                          </option>
                        ))}
                      {formData.page_type === "issue" &&
                        issues.map((i) => (
                          <option key={i.id} value={i.id}>
                            {i.issue_title}
                          </option>
                        ))}
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_title: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_description: e.target.value,
                    }))
                  }
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
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        canonical_url: e.target.value,
                      }))
                    }
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
