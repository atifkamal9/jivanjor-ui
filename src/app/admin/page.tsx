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
  Plus,
  TrendingUp,
  Activity,
  FileText,
  Layers,
  Shield,
  CheckCircle,
  XCircle,
  Terminal,
  Cpu,
  Database,
  Key,
  Clock,
  History,
  PlusCircle,
  Edit,
  Eye,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { getUserEmail } from "@/lib/auth";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
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
    async function loadStats() {
      try {
        const [
          products,
          categories,
          materials,
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

        setStats({
          products: products.length,
          categories: categories.length,
          materials: materials.length,
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
    }
    loadStats();
  }, []);


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
            .filter((card) => card.href !== "/admin/templates" || role === "SUPER_ADMIN")
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

        {/* Quick Actions Panel */}
        <div className="bg-background border border-border rounded-3xl p-6 shadow-sm transition-colors duration-300">
          <div className="space-y-5">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Admin Actions Hub</span>
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/admin/products"
                className="flex flex-col gap-2 p-4 rounded-xl bg-surface hover:bg-primary/10 text-foreground/80 hover:text-primary transition-all font-bold cursor-pointer border border-border"
              >
                <Plus className="h-5 w-5 shrink-0" />
                <span className="text-xs">Add Product</span>
              </Link>
              <Link
                href="/admin/blog"
                className="flex flex-col gap-2 p-4 rounded-xl bg-surface hover:bg-primary/10 text-foreground/80 hover:text-primary transition-all font-bold cursor-pointer border border-border"
              >
                <Plus className="h-5 w-5 shrink-0" />
                <span className="text-xs">Compose Blog</span>
              </Link>
              <Link
                href="/admin/pages"
                className="flex flex-col gap-2 p-4 rounded-xl bg-surface hover:bg-primary/10 text-foreground/80 hover:text-primary transition-all font-bold cursor-pointer border border-border"
              >
                <Plus className="h-5 w-5 shrink-0" />
                <span className="text-xs">Create Page</span>
              </Link>
              {role === "SUPER_ADMIN" && (
                <Link
                  href="/admin/templates"
                  className="flex flex-col gap-2 p-4 rounded-xl bg-surface hover:bg-primary/10 text-foreground/80 hover:text-primary transition-all font-bold cursor-pointer border border-border"
                >
                  <Plus className="h-5 w-5 shrink-0" />
                  <span className="text-xs">Build Template</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

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
