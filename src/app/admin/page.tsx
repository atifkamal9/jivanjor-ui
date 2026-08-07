"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api } from "@/lib/api";
import { getUserRole } from "@/lib/auth";
import {
  Package,
  FolderTree,
  Hammer,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Search,
  Activity,
  FileText,
  Layers,
  Settings,
  ArrowUpRight,
  FileSpreadsheet,
  X,
  Compass,
} from "lucide-react";
import Link from "next/link";
import BulkUploadModal, { ParsedRow } from "@/components/admin/BulkUploadModal";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);

  // Interactive Actions Hub state
  const [actionTab, setActionTab] = useState<"all" | "catalog" | "content" | "system">("all");
  const [actionSearch, setActionSearch] = useState("");
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkEntityType, setBulkEntityType] = useState<"product" | "category">("product");

  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    materials: 0,
    blogs: 0,
    useCases: 0,
    issues: 0,
    seo: 0,
    pages: 0,
    templates: 0,
  });

  useEffect(() => {
    setRole(getUserRole());
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        productsList,
        categoriesList,
        materialsList,
        blogs,
        useCases,
        issues,
        seo,
        pages,
        templates,
      ] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getMaterials(),
        api.getBlogPosts(),
        api.getUseCases(),
        api.getIssues(),
        api.getSeoMetadata(),
        api.getPages(),
        api.getTemplates(),
      ]);

      setCategories(categoriesList);
      setMaterials(materialsList);

      setStats({
        products: productsList.length,
        categories: categoriesList.length,
        materials: materialsList.length,
        blogs: blogs.length,
        useCases: useCases.length,
        issues: issues.length,
        seo: seo.length,
        pages: pages.length,
        templates: templates.length,
      });
    } catch (err) {
      console.error("Failed to load dashboard metrics", err);
    } finally {
      setLoading(false);
    }
  };


  const metricCards = [
    {
      name: "Total Products",
      value: stats.products,
      href: "/admin/products",
      icon: Package,
      color: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/10",
    },
    {
      name: "Product Categories",
      value: stats.categories,
      href: "/admin/categories",
      icon: FolderTree,
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/10",
    },
    {
      name: "Wood Materials",
      value: stats.materials,
      href: "/admin/materials",
      icon: Hammer,
      color: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/10",
    },
    {
      name: "Blog Posts",
      value: stats.blogs,
      href: "/admin/blog",
      icon: BookOpen,
      color: "from-primary to-pink-600",
      shadow: "shadow-primary/10",
    },
    {
      name: "Use Cases",
      value: stats.useCases,
      href: "/admin/use-cases",
      icon: Lightbulb,
      color: "from-purple-500 to-violet-600",
      shadow: "shadow-purple-500/10",
    },
    {
      name: "Issues & Solutions",
      value: stats.issues,
      href: "/admin/issues",
      icon: HelpCircle,
      color: "from-cyan-500 to-sky-600",
      shadow: "shadow-cyan-500/10",
    },
    {
      name: "Dynamic Pages",
      value: stats.pages,
      href: "/admin/pages",
      icon: FileText,
      color: "from-rose-500 to-red-600",
      shadow: "shadow-rose-500/10",
    },
    {
      name: "Page Templates",
      value: stats.templates,
      href: "/admin/templates",
      icon: Layers,
      color: "from-blue-600 to-cyan-500",
      shadow: "shadow-blue-600/10",
    },
    {
      name: "Sitemap",
      value: (stats.products + stats.categories + stats.materials + stats.blogs + stats.useCases + stats.issues + stats.pages) || 8,
      href: "/admin/sitemap",
      icon: Compass,
      color: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/10",
    },
  ];

  const actionCards = [
    {
      id: "add-product",
      title: "Add Product",
      desc: "Configure product profile, pack sizes, tech specs & images",
      href: "/admin/products",
      icon: Package,
      group: "catalog",
      gradient: "from-blue-500 to-indigo-600",
      badge: "Catalog",
    },
    {
      id: "add-category",
      title: "Add Category",
      desc: "Create category classifications & nested hierarchy",
      href: "/admin/categories",
      icon: FolderTree,
      group: "catalog",
      gradient: "from-emerald-500 to-teal-600",
      badge: "Catalog",
    },
    {
      id: "bulk-upload",
      title: "Bulk Upload Excel",
      desc: "Batch import products or categories from Excel sheets",
      href: null,
      onClick: () => {
        setBulkEntityType("product");
        setIsBulkModalOpen(true);
      },
      icon: FileSpreadsheet,
      group: "catalog",
      gradient: "from-red-500 to-rose-600",
      badge: "Super Admin",
      superAdminOnly: true,
    },
    {
      id: "compose-blog",
      title: "Compose Blog",
      desc: "Write & publish articles, guides, and news posts",
      href: "/admin/blog",
      icon: BookOpen,
      group: "content",
      gradient: "from-pink-500 to-rose-600",
      badge: "Content",
    },
    {
      id: "create-page",
      title: "Create Dynamic Page",
      desc: "Build landing pages with active dynamic sections",
      href: "/admin/pages",
      icon: FileText,
      group: "content",
      gradient: "from-purple-500 to-indigo-600",
      badge: "Content",
    },
    {
      id: "site-settings",
      title: "Site Settings",
      desc: "Configure logos, covers, banner links & parameters",
      href: "/admin/settings",
      icon: Settings,
      group: "system",
      gradient: "from-slate-600 to-zinc-800",
      badge: "System",
    },
    {
      id: "seo-manager",
      title: "SEO Metadata",
      desc: "Manage meta titles, descriptions, & canonical URLs",
      href: "/admin/seo",
      icon: Search,
      group: "system",
      gradient: "from-cyan-500 to-sky-600",
      badge: "System",
    },
    {
      id: "build-template",
      title: "Build Page Template",
      desc: "Design section templates for pages and layouts",
      href: "/admin/templates",
      icon: Layers,
      group: "system",
      gradient: "from-violet-600 to-purple-600",
      badge: "Super Admin",
      superAdminOnly: true,
    },
    {
      id: "sitemap-manager",
      title: "View Sitemap",
      desc: "Inspect live XML sitemap structure & indexed URLs",
      href: "/admin/sitemap",
      icon: Compass,
      group: "system",
      gradient: "from-amber-500 to-orange-600",
      badge: "System",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
        {/* Welcome Banner */}
        <div className="rounded-3xl bg-linear-to-r from-primary to-primary/90 p-6 md:p-8 text-white shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-20 bottom-0 translate-x-10 translate-y-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
              Welcome to Jivanjor Admin Panel
            </h1>
            <p className="text-sm md:text-base text-red-50/90 leading-normal font-medium">
              Manage your products range, write articles, edit troubleshooting
              categories, configure meta tags, and control site parameters
              instantly from this dashboard.
            </p>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards
            .filter((card) => (card.href !== "/admin/templates" && card.href !== "/admin/materials" && card.href !== "/admin/issues") || role === "SUPER_ADMIN")
            .map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  href={card.href}
                  className="group flex items-center justify-between p-6 bg-background border border-border rounded-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer duration-300"
                >
                  <div className="space-y-1 w-full">
                    <span className="text-xs font-bold text-foreground/45 uppercase tracking-wider">
                      {card.name}
                    </span>
                    {loading ? (
                      <div className="h-8 w-12 bg-foreground/10 rounded-lg animate-pulse mt-1" />
                    ) : (
                      <p className="text-3xl font-black text-foreground">
                        {card.value}
                      </p>
                    )}
                  </div>
                  <div
                    className={`h-12 w-14 p-2 rounded-xl bg-linear-to-tr ${card.color} text-white flex items-center justify-center shadow-lg ${card.shadow} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </Link>
              );
            })}
        </div>

        {/* Interactive Admin Actions Hub */}
        <div className="bg-background border border-border rounded-3xl p-6 md:p-8 shadow-sm transition-colors duration-300 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <h3 className="text-xl font-black text-foreground flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Activity className="h-5 w-5" />
                </div>
                <span>Admin Actions Hub</span>
              </h3>
              <p className="text-xs font-semibold text-foreground/50 mt-1">
                Fast interactive access to catalog management, content creation, &amp; system tools
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-foreground/40" />
                <input
                  type="text"
                  value={actionSearch}
                  onChange={(e) => setActionSearch(e.target.value)}
                  placeholder="Search actions..."
                  className="w-full sm:w-48 pl-9 pr-8 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
                {actionSearch && (
                  <button
                    onClick={() => setActionSearch("")}
                    className="absolute right-2.5 top-2.5 text-foreground/40 hover:text-foreground cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border shrink-0">
                {[
                  { id: "all", label: "All" },
                  { id: "catalog", label: "Catalog" },
                  { id: "content", label: "Content" },
                  { id: "system", label: "System" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActionTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${actionTab === tab.id
                      ? "bg-primary text-white shadow-xs"
                      : "text-foreground/60 hover:text-foreground hover:bg-background/60"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actionCards
              .filter((action) => {
                if (action.superAdminOnly && role !== "SUPER_ADMIN") return false;
                if (actionTab !== "all" && action.group !== actionTab) return false;
                if (actionSearch.trim()) {
                  const q = actionSearch.toLowerCase();
                  return action.title.toLowerCase().includes(q) || action.desc.toLowerCase().includes(q);
                }
                return true;
              })
              .map((action) => {
                const ActionIcon = action.icon;
                const cardInner = (
                  <div className="group relative flex flex-col justify-between p-5 rounded-2xl bg-surface/50 hover:bg-surface border border-border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer overflow-hidden h-full">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${action.gradient} text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <ActionIcon className="h-5 w-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-background border border-border text-foreground/60">
                            {action.badge}
                          </span>
                          <ArrowUpRight className="h-4 w-4 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                          <span>{action.title}</span>
                        </h4>
                        <p className="text-xs text-foreground/50 font-medium leading-relaxed mt-1">
                          {action.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );

                if (action.onClick) {
                  return (
                    <button key={action.id} onClick={action.onClick} className="text-left w-full cursor-pointer">
                      {cardInner}
                    </button>
                  );
                }

                return (
                  <Link key={action.id} href={action.href!}>
                    {cardInner}
                  </Link>
                );
              })}
          </div>

          {actionCards.filter((action) => {
            if (action.superAdminOnly && role !== "SUPER_ADMIN") return false;
            if (actionTab !== "all" && action.group !== actionTab) return false;
            if (actionSearch.trim()) {
              const q = actionSearch.toLowerCase();
              return action.title.toLowerCase().includes(q) || action.desc.toLowerCase().includes(q);
            }
            return true;
          }).length === 0 && (
              <div className="p-8 text-center bg-surface/30 rounded-2xl border border-dashed border-border text-xs font-bold text-foreground/50">
                No admin actions match your search &quot;{actionSearch}&quot;.
              </div>
            )}
        </div>
      </div>

      {/* Bulk Upload Modal Triggered from Dashboard Actions Hub */}
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onComplete={loadStats}
        entityType={bulkEntityType}
        categories={categories}
        materials={materials}
        onSave={async (row: ParsedRow) => {
          if (bulkEntityType === "product") {
            let catId = row.category_id;
            if (!catId && row.category_name) {
              const matchedCat = categories.find(
                (c) => c.name.toLowerCase() === row.category_name!.toLowerCase()
              );
              if (matchedCat) catId = matchedCat.id;
            }
            if (!catId && categories.length > 0) catId = categories[0].id;

            let matId = row.material_id;
            if (!matId && row.material_name) {
              const matchedMat = materials.find(
                (m) => m.name.toLowerCase() === row.material_name!.toLowerCase()
              );
              if (matchedMat) matId = matchedMat.id;
            }

            const slug = (row.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            const existingProd = (await api.getProducts()).find(
              (p) => p.name.toLowerCase() === (row.name || "").toLowerCase() || p.slug === slug
            );

            await api.saveProduct({
              id: existingProd?.id,
              name: row.name || "",
              slug,
              description: (row.description || "").slice(0, 80),
              category_id: catId || "",
              category_ids: catId ? [catId] : [],
              material_id: matId || "",
              metadata: row.metadata_tags || "",
              image: row.image || "",
              backgroundImage: "",
              themeColor: row.theme_color || "#0498AA",
              overviewBullets: [
                { text: "Water Resistant", icon: "image 18.svg" },
                { text: "Super Fast Setting - 1 Hour", icon: "image 19.svg" },
                { text: "Anti-Bubble Technology", icon: "image 20.svg" },
              ],
              techSpecs: [
                { key: "Appearance", value: "Milk White" },
                { key: "Solids", value: "50-53%" },
                { key: "Viscosity", value: "150-250 Poise" },
                { key: "Coverage", value: "60-70 Sqft/Kg" },
              ],
              packSizes: row.pack_sizes && row.pack_sizes.length > 0 ? row.pack_sizes : ["1 Kg", "5 Kg", "20 Kg"],
              documentUrl: "",
              usps: [],
              applications: [],
              videoUrl: "",
              videoThumbnail: "/images/Rectangle 4.png",
              faqs: [],
              relatedProducts: [],
              techSpecsDescription: "",
              appsTitle: "Engineered for the Task at Hand",
              appsDescription: "",
              videoTitle: "See product in Action",
              videoDescription: "",
              faqsTitle: "FAQs",
              faqsDescription: "",
              relatedTitle: "Related Products",
              techResourceTitle: "",
              techResourceDescription: "",
              techResourceFileUrl: "",
            });
          } else {
            const latestCats = await api.getCategories();
            let parentId = "";
            if (row.parent_category_name) {
              const parentCat = latestCats.find(
                (c) => c.name.toLowerCase() === row.parent_category_name!.toLowerCase()
              );
              if (parentCat) parentId = parentCat.id;
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
              tagline: row.tagline || "",
              parent_category: parentId,
              icon: row.icon || "",
            });
          }
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `,
        }}
      />
    </AdminLayout>
  );
}
