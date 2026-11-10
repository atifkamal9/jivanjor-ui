"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getLocalSitemapConfig,
  saveLocalSitemapConfig,
  resetLocalSitemapConfig,
  SitemapConfig,
  SitemapSection,
  SitemapLink,
} from "@/lib/sitemap-storage";
import { api, type Product } from "@/lib/api";
import {
  Compass,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  ExternalLink,
  CheckCircle2,
  Globe,
  Edit3,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";

export default function AdminSitemapManagerPage() {
  const [config, setConfig] = useState<SitemapConfig>(() =>
    getLocalSitemapConfig()
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState("");

  // New Section form state
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDesc, setNewSectionDesc] = useState("");
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);

  // New Link form state per section (sectionId -> { title, href, description })
  const [newLinkData, setNewLinkData] = useState<{
    [sectionId: string]: { title: string; href: string; description: string };
  }>({});

  useEffect(() => {
    setConfig(getLocalSitemapConfig());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const [
        productsRes,
        categoriesRes,
        blogsRes,
        pagesRes,
        templatesRes,
        useCasesRes,
      ] = await Promise.allSettled([
        api.getProducts({ visibleOnly: true }),
        api.getCategories(),
        api.getBlogPosts(),
        api.getPages(),
        api.getTemplates(),
        api.getUseCases(),
      ]);

      const liveProducts =
        productsRes.status === "fulfilled" && Array.isArray(productsRes.value)
          ? productsRes.value
          : [];
      const liveCategories =
        categoriesRes.status === "fulfilled" && Array.isArray(categoriesRes.value)
          ? categoriesRes.value
          : [];
      const liveBlogs =
        blogsRes.status === "fulfilled" && Array.isArray(blogsRes.value)
          ? blogsRes.value
          : [];
      const livePages =
        pagesRes.status === "fulfilled" && Array.isArray(pagesRes.value)
          ? pagesRes.value
          : [];
      const liveTemplates =
        templatesRes.status === "fulfilled" && Array.isArray(templatesRes.value)
          ? templatesRes.value
          : [];
      const liveUseCases =
        useCasesRes.status === "fulfilled" && Array.isArray(useCasesRes.value)
          ? useCasesRes.value
          : [];

      let currentSections = [...config.sections];

      // 1. Sync Categories into 'categories' section
      const categoryLinks: SitemapLink[] = liveCategories
        .filter((cat) => cat.isVisible !== false)
        .map((cat, idx) => {
          const slug = (cat.slug || cat.name || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
          return {
            id: `cat-${cat.id || idx}`,
            title: cat.name,
            href: `/categories/${slug}`,
            description:
              cat.tagline ||
              cat.description ||
              "Browse adhesives by specialization category.",
          };
        });

      const catSecIdx = currentSections.findIndex((s) => s.id === "categories");
      if (catSecIdx !== -1) {
        const customLinks = currentSections[catSecIdx].links.filter((l) => l.isCustom);
        currentSections[catSecIdx] = {
          ...currentSections[catSecIdx],
          links: [...categoryLinks, ...customLinks],
        };
      } else if (categoryLinks.length > 0) {
        currentSections.push({
          id: "categories",
          title: "Product Categories",
          description: "Browse adhesives by category and performance rating.",
          isVisible: true,
          order: currentSections.length + 1,
          links: categoryLinks,
        });
      }

      // 2. Sync Products into 'products' section - strictly only visible products
      const isProductVisible = (p: Product | any): boolean => {
        if (!p) return false;
        if (p.isVisible === false || p.isVisible === "false" || p.isVisible === 0 || p.isVisible === "0") return false;
        if (p.is_visible === false || p.is_visible === "false" || p.is_visible === 0 || p.is_visible === "0") return false;
        if (p.metadata && typeof p.metadata === "object") {
          if (p.metadata.isVisible === false || p.metadata.isVisible === "false" || p.metadata.isVisible === 0 || p.metadata.isVisible === "0") return false;
          if (p.metadata.is_visible === false || p.metadata.is_visible === "false" || p.metadata.is_visible === 0 || p.metadata.is_visible === "0") return false;
        }
        return p.isVisible === true || p.isVisible === undefined;
      };

      const productLinks: SitemapLink[] = liveProducts
        .filter(isProductVisible)
        .map((p, idx) => {
          const slug = (p.slug || p.name || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-");
          return {
            id: `prod-${p.id || idx}`,
            title: p.name,
            href: `/products?product=${encodeURIComponent(slug)}`,
            description:
              p.short_description ||
              p.shortDescription ||
              (p.description ? p.description.slice(0, 90) + "..." : "Premium Jivanjor wood adhesive."),
          };
        });

      const prodSecIdx = currentSections.findIndex((s) => s.id === "products");
      if (prodSecIdx !== -1) {
        const customLinks = currentSections[prodSecIdx].links.filter((l) => l.isCustom);
        currentSections[prodSecIdx] = {
          ...currentSections[prodSecIdx],
          links: [...productLinks, ...customLinks],
        };
      } else if (productLinks.length > 0) {
        currentSections.push({
          id: "products",
          title: "Products Directory",
          description: "Complete catalog of premium woodworking adhesives.",
          isVisible: true,
          order: currentSections.length + 1,
          links: productLinks,
        });
      }

      // 3. Sync Editorial Blogs into 'editorial' section
      const blogLinks: SitemapLink[] = liveBlogs.map((b, idx) => {
        const slug = (b.slug || b.title || "").trim();
        const rawDesc = b.tldr
          ? b.tldr.replace(/<[^>]*>/g, "").slice(0, 100)
          : b.category || "Woodworking guide and industry advice.";
        return {
          id: `blog-${b.id || idx}`,
          title: b.title,
          href: `/blog/${slug}`,
          description: rawDesc,
        };
      });

      const blogSecIdx = currentSections.findIndex((s) => s.id === "editorial");
      if (blogSecIdx !== -1) {
        const customLinks = currentSections[blogSecIdx].links.filter((l) => l.isCustom);
        currentSections[blogSecIdx] = {
          ...currentSections[blogSecIdx],
          links: [...blogLinks, ...customLinks],
        };
      } else if (blogLinks.length > 0) {
        currentSections.push({
          id: "editorial",
          title: "Editorial Articles & Guides",
          description: "Woodworking advice, application guides, and expert knowledge.",
          isVisible: true,
          order: currentSections.length + 1,
          links: blogLinks,
        });
      }

      // 4. Sync Dynamic CMS Pages into 'about-sub' or dynamic pages
      const reservedSlugs = new Set([
        "home",
        "about",
        "products",
        "categories",
        "applications",
        "blog",
        "partner",
        "contractor",
        "contact",
        "resources",
        "privacy",
        "sitemap",
      ]);

      const dynamicPageLinks: SitemapLink[] = livePages
        .filter((pg) => pg.slug && !reservedSlugs.has(pg.slug.trim().toLowerCase()))
        .map((pg, idx) => {
          const slug = pg.slug.trim().toLowerCase();
          const template = liveTemplates.find((t) => t.id === pg.activeTemplateId);
          const rawData =
            (template?.rawSections as any) || (template?.sections as any) || {};
          const layoutType = rawData.layoutType || "";

          let href = `/${slug}`;
          if (layoutType === "about") href = `/about/${slug}`;
          else if (layoutType === "applications") href = `/applications/${slug}`;
          else if (layoutType === "products") href = `/products/${slug}`;
          else if (layoutType === "categories") href = `/categories/${slug}`;
          else if (layoutType === "blog") href = `/blog/${slug}`;

          return {
            id: `page-${pg.id || idx}`,
            title: pg.title,
            href,
            description: pg.description || "Corporate and brand overview.",
          };
        });

      const aboutSecIdx = currentSections.findIndex((s) => s.id === "about-sub");
      if (aboutSecIdx !== -1) {
        const existing = currentSections[aboutSecIdx].links;
        const existingHrefs = new Set(existing.map((l) => l.href.toLowerCase()));
        const toAdd = dynamicPageLinks.filter((l) => !existingHrefs.has(l.href.toLowerCase()));
        currentSections[aboutSecIdx] = {
          ...currentSections[aboutSecIdx],
          links: [...existing, ...toAdd],
        };
      } else if (dynamicPageLinks.length > 0) {
        currentSections.push({
          id: "about-sub",
          title: "Brand & Corporate",
          description: "Research innovation, quality promises, media, and market network.",
          isVisible: true,
          order: 2,
          links: dynamicPageLinks,
        });
      }

      // 5. Sync Applications / Use Cases
      const useCaseLinks: SitemapLink[] = liveUseCases.map((uc, idx) => {
        const slug = (uc.slug || uc.title || "")
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-");
        return {
          id: `uc-${uc.id || idx}`,
          title: uc.title,
          href: `/applications?article=${encodeURIComponent(slug)}`,
          description: uc.description || "Application solutions and bonding technique.",
        };
      });

      const appSecIdx = currentSections.findIndex(
        (s) => s.id === "applications" || s.title.toLowerCase().includes("application")
      );
      if (appSecIdx !== -1) {
        const customLinks = currentSections[appSecIdx].links.filter((l) => l.isCustom);
        currentSections[appSecIdx] = {
          ...currentSections[appSecIdx],
          links: [...useCaseLinks, ...customLinks],
        };
      } else if (useCaseLinks.length > 0) {
        currentSections.push({
          id: "applications",
          title: "Applications & Solutions",
          description: "Application guides for furniture, laminates, and wood.",
          isVisible: true,
          order: currentSections.length + 1,
          links: useCaseLinks,
        });
      }

      // Re-index orders
      currentSections = currentSections.map((sec, idx) => ({
        ...sec,
        order: idx + 1,
      }));

      const updatedConfig: SitemapConfig = {
        ...config,
        sections: currentSections,
        lastUpdated: new Date().toISOString(),
      };

      saveLocalSitemapConfig(updatedConfig);
      setConfig(updatedConfig);

      showToast(
        `Synced ${productLinks.length} visible products, ${categoryLinks.length} categories, ${blogLinks.length} blogs, ${dynamicPageLinks.length} dynamic pages, and ${useCaseLinks.length} use cases successfully!`
      );
    } catch (err: any) {
      console.error("Failed to sync sitemap:", err);
      showToast(err?.message || "Failed to sync content from backend.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    saveLocalSitemapConfig(config);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Sitemap configuration saved successfully!");
    }, 400);
  };

  const handleReset = () => {
    if (
      confirm("Are you sure you want to reset sitemap to default settings?")
    ) {
      const def = resetLocalSitemapConfig();
      setConfig(def);
      showToast("Sitemap reset to default layout.");
    }
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, isVisible: !sec.isVisible } : sec
      ),
    }));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.sections.length) return;

    const newSections = [...config.sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    const ordered = newSections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setConfig((prev) => ({ ...prev, sections: ordered }));
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    const newSec: SitemapSection = {
      id: `sec-${Date.now()}`,
      title: newSectionTitle.trim(),
      description: newSectionDesc.trim() || undefined,
      isVisible: true,
      order: config.sections.length + 1,
      links: [],
    };

    setConfig((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
    }));

    setNewSectionTitle("");
    setNewSectionDesc("");
    setShowAddSectionForm(false);
    showToast("New section created.");
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm("Are you sure you want to delete this sitemap section?")) {
      setConfig((prev) => ({
        ...prev,
        sections: prev.sections.filter((sec) => sec.id !== sectionId),
      }));
      showToast("Section removed.");
    }
  };

  const handleUpdateSectionHeader = (
    sectionId: string,
    title: string,
    description: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, title, description } : sec
      ),
    }));
  };

  const handleAddLinkToSection = (sectionId: string) => {
    const data = newLinkData[sectionId];
    if (!data || !data.title.trim() || !data.href.trim()) return;

    const newLink: SitemapLink = {
      id: `link-${Date.now()}`,
      title: data.title.trim(),
      href: data.href.trim(),
      description: data.description.trim() || undefined,
      isCustom: true,
    };

    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, links: [...sec.links, newLink] } : sec
      ),
    }));

    setNewLinkData((prev) => ({
      ...prev,
      [sectionId]: { title: "", href: "", description: "" },
    }));
    showToast("Link added to section.");
  };

  const handleUpdateLink = (
    sectionId: string,
    linkId: string,
    updates: Partial<SitemapLink>
  ) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          links: sec.links.map((l) =>
            l.id === linkId ? { ...l, ...updates } : l
          ),
        };
      }),
    }));
  };

  const handleMoveLink = (
    sectionId: string,
    linkIndex: number,
    direction: "up" | "down"
  ) => {
    const targetIdx = direction === "up" ? linkIndex - 1 : linkIndex + 1;

    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        if (targetIdx < 0 || targetIdx >= sec.links.length) return sec;

        const newLinks = [...sec.links];
        const temp = newLinks[linkIndex];
        newLinks[linkIndex] = newLinks[targetIdx];
        newLinks[targetIdx] = temp;

        return { ...sec, links: newLinks };
      }),
    }));
  };

  const handleDeleteLink = (sectionId: string, linkId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId
          ? { ...sec, links: sec.links.filter((l) => l.id !== linkId) }
          : sec
      ),
    }));
  };

  const filteredSections = useMemo(() => {
    return config.sections.filter((sec) => {
      const matchesFilter =
        activeSectionFilter === "all" || sec.id === activeSectionFilter;
      if (!matchesFilter) return false;

      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        sec.title.toLowerCase().includes(q) ||
        (sec.description && sec.description.toLowerCase().includes(q)) ||
        sec.links.some(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.href.toLowerCase().includes(q) ||
            (l.description && l.description.toLowerCase().includes(q))
        )
      );
    });
  }, [config.sections, activeSectionFilter, searchFilter]);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Sitemap Manager</span>
            </div>
            <h1 className="font-amethysta text-2xl sm:text-3xl text-foreground tracking-tight">
              Manage Sitemap Content
            </h1>
            <p className="text-sm text-foreground/60 mt-1">
              Directly edit and customize Main Pages, Brand & Corporate, Product Categories, Editorial Guides, Support, or custom sections.
            </p>
            {config.lastUpdated && (
              <span className="inline-block text-xs text-foreground/50 mt-1 font-medium">
                Last synced: {new Date(config.lastUpdated).toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing || isSaving}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground font-semibold text-xs sm:text-sm hover:border-primary/50 hover:text-primary transition-all cursor-pointer shadow-sm disabled:opacity-60"
              title="Sync live pages, products, categories, blogs, and use cases from database"
            >
              <RefreshCw
                className={`w-4 h-4 ${isSyncing ? "animate-spin text-primary" : ""}`}
              />
              <span>{isSyncing ? "Syncing..." : "Sync"}</span>
            </button>

            <Link
              href="/sitemap"
              target="_blank"
              className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-border text-foreground font-semibold text-xs sm:text-sm hover:border-primary/50 hover:text-primary transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>Preview</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <button
              onClick={handleSave}
              disabled={isSaving || isSyncing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-semibold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Sitemap Hero Header Settings Card */}
        <div className="p-6 bg-surface/60 border border-border rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Edit3 className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">
              Public Sitemap Header Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1">
                Sitemap Hero Title
              </label>
              <input
                type="text"
                value={config.heroTitle || ""}
                placeholder="e.g. Jivanjor Sitemap"
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, heroTitle: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1">
                Sitemap Hero Description
              </label>
              <input
                type="text"
                value={config.heroDescription || ""}
                placeholder="e.g. Find direct links to all main pages..."
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    heroDescription: e.target.value,
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section Quick Jump Filter Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground/70 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span>Jump to Section Editor</span>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-foreground/40" />
              <input
                type="text"
                placeholder="Filter links or titles..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSectionFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSectionFilter === "all"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface border border-border text-foreground/70 hover:text-foreground"
                }`}
            >
              All Sections ({config.sections.length})
            </button>

            {config.sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionFilter(sec.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSectionFilter === sec.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface border border-border text-foreground/70 hover:text-foreground"
                  }`}
              >
                {sec.title} ({sec.links.length})
              </button>
            ))}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface/60 border border-border rounded-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddSectionForm(!showAddSectionForm)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 font-semibold text-xs hover:bg-primary/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Section</span>
            </button>

            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing || isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-foreground font-semibold text-xs hover:border-primary/50 hover:text-primary transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-primary" : ""}`}
              />
              <span>{isSyncing ? "Syncing..." : "Sync Live Content"}</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-foreground/50 hover:text-red-500 hover:bg-red-500/10 text-xs font-medium transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* Add Section Form */}
        {showAddSectionForm && (
          <form
            onSubmit={handleAddSection}
            className="p-6 bg-surface border border-primary/30 rounded-2xl space-y-4 animate-fade-in"
          >
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Create New Sitemap Section
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Specialized Solutions"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1">
                  Section Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Custom application guides & bonding solutions."
                  value={newSectionDesc}
                  onChange={(e) => setNewSectionDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddSectionForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground/60 hover:bg-background"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary/90 cursor-pointer"
              >
                Create Section
              </button>
            </div>
          </form>
        )}

        {/* Sections List */}
        <div className="space-y-6">
          {filteredSections.map((section) => {
            const originalIndex = config.sections.findIndex(
              (s) => s.id === section.id
            );

            return (
              <div
                key={section.id}
                className={`bg-surface/50 border rounded-2xl p-6 transition-all ${section.isVisible
                  ? "border-border"
                  : "border-border/40 opacity-60"
                  }`}
              >
                {/* Section Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-border">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          handleUpdateSectionHeader(
                            section.id,
                            e.target.value,
                            section.description || ""
                          )
                        }
                        className="font-bold text-base sm:text-lg bg-transparent border-b border-transparent hover:border-border focus:border-primary text-foreground focus:outline-none transition-colors px-1"
                      />
                      <span className="text-xs text-foreground/40 font-mono">
                        ({section.links.length} links)
                      </span>
                    </div>

                    <input
                      type="text"
                      value={section.description || ""}
                      placeholder="Add section description..."
                      onChange={(e) =>
                        handleUpdateSectionHeader(
                          section.id,
                          section.title,
                          e.target.value
                        )
                      }
                      className="text-xs text-foreground/60 bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-colors w-full px-1"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => moveSection(originalIndex, "up")}
                      disabled={originalIndex === 0}
                      title="Move section up"
                      className="p-2 rounded-xl bg-background border border-border text-foreground/70 hover:text-primary disabled:opacity-30 cursor-pointer"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => moveSection(originalIndex, "down")}
                      disabled={originalIndex === config.sections.length - 1}
                      title="Move section down"
                      className="p-2 rounded-xl bg-background border border-border text-foreground/70 hover:text-primary disabled:opacity-30 cursor-pointer"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleSectionVisibility(section.id)}
                      title={
                        section.isVisible
                          ? "Hide section on public sitemap"
                          : "Show section on public sitemap"
                      }
                      className={`p-2 rounded-xl border text-xs font-semibold cursor-pointer ${section.isVisible
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                    >
                      {section.isVisible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      title="Delete section"
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Editable Links List */}
                <div className="space-y-3 mb-6">
                  {section.links.length === 0 ? (
                    <p className="text-xs text-foreground/40 italic">
                      No links in this section. Add one below.
                    </p>
                  ) : (
                    section.links.map((link, lIdx) => (
                      <div
                        key={`${link.id || 'link'}-${lIdx}`}
                        className="p-3.5 rounded-xl bg-background border border-border/80 space-y-2"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                            <div>
                              <label className="text-[10px] font-semibold text-foreground/50 uppercase">
                                Link Title
                              </label>
                              <input
                                type="text"
                                value={link.title}
                                onChange={(e) =>
                                  handleUpdateLink(section.id, link.id, {
                                    title: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold text-foreground/50 uppercase">
                                URL Path
                              </label>
                              <input
                                type="text"
                                value={link.href}
                                onChange={(e) =>
                                  handleUpdateLink(section.id, link.id, {
                                    href: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold text-foreground/50 uppercase">
                                Description (Optional)
                              </label>
                              <input
                                type="text"
                                value={link.description || ""}
                                placeholder="Brief page description..."
                                onChange={(e) =>
                                  handleUpdateLink(section.id, link.id, {
                                    description: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleMoveLink(section.id, lIdx, "up")
                              }
                              disabled={lIdx === 0}
                              title="Move link up"
                              className="p-1.5 rounded-lg bg-surface border border-border text-foreground/60 hover:text-primary disabled:opacity-30 cursor-pointer"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleMoveLink(section.id, lIdx, "down")
                              }
                              disabled={lIdx === section.links.length - 1}
                              title="Move link down"
                              className="p-1.5 rounded-lg bg-surface border border-border text-foreground/60 hover:text-primary disabled:opacity-30 cursor-pointer"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteLink(section.id, link.id)
                              }
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 cursor-pointer"
                              title="Delete link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Link Form inside Section */}
                <div className="p-3.5 bg-background/60 border border-border/50 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider">
                    Add Link to &quot;{section.title}&quot;
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Link Title (e.g. Quality Policy)"
                      value={newLinkData[section.id]?.title || ""}
                      onChange={(e) =>
                        setNewLinkData((prev) => ({
                          ...prev,
                          [section.id]: {
                            ...prev[section.id],
                            title: e.target.value,
                            href: prev[section.id]?.href || "",
                            description: prev[section.id]?.description || "",
                          },
                        }))
                      }
                      className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Target URL (e.g. /about/quality)"
                      value={newLinkData[section.id]?.href || ""}
                      onChange={(e) =>
                        setNewLinkData((prev) => ({
                          ...prev,
                          [section.id]: {
                            ...prev[section.id],
                            title: prev[section.id]?.title || "",
                            href: e.target.value,
                            description: prev[section.id]?.description || "",
                          },
                        }))
                      }
                      className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Description (Optional)"
                        value={newLinkData[section.id]?.description || ""}
                        onChange={(e) =>
                          setNewLinkData((prev) => ({
                            ...prev,
                            [section.id]: {
                              ...prev[section.id],
                              title: prev[section.id]?.title || "",
                              href: prev[section.id]?.href || "",
                              description: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddLinkToSection(section.id)}
                        className="px-3 py-1.5 bg-primary text-white font-bold rounded-lg text-xs hover:bg-primary/90 shrink-0 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
