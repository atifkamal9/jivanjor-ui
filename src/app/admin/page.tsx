"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api } from "@/lib/api";
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
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
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
          {metricCards.map((card, idx) => {
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

        {/* Charts & Interactive Stats Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-background border border-border rounded-3xl p-6 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Visitor Engagement Trend</span>
                </h3>
                <p className="text-xs text-foreground/40 font-semibold uppercase tracking-wider">
                  Weekly Analytics Overview
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground/60 bg-surface px-3 py-1.5 rounded-lg">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>Product Page Visits</span>
              </div>
            </div>

            {/* High fidelity inline SVG Chart */}
            <div className="w-full h-64 bg-surface/40 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex-1 w-full relative">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 600 200"
                  preserveAspectRatio="none"
                >
                  {/* Grid Lines */}
                  <line
                    x1="0"
                    y1="50"
                    x2="600"
                    y2="50"
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                    className="stroke-border"
                  />
                  <line
                    x1="0"
                    y1="100"
                    x2="600"
                    y2="100"
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                    className="stroke-border"
                  />
                  <line
                    x1="0"
                    y1="150"
                    x2="600"
                    y2="150"
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                    className="stroke-border"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient
                      id="chartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#ed1c24" stopOpacity="0.3" />
                      <stop
                        offset="100%"
                        stopColor="#ed1c24"
                        stopOpacity="0.0"
                      />
                    </linearGradient>
                  </defs>

                  {/* Fill Area */}
                  <path
                    d="M0,170 Q75,130 150,110 T300,120 T450,60 T600,40 L600,200 L0,200 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Stroke Line */}
                  <path
                    d="M0,170 Q75,130 150,110 T300,120 T450,60 T600,40"
                    fill="none"
                    stroke="#ed1c24"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  <circle
                    cx="150"
                    cy="110"
                    r="5"
                    fill="#ed1c24"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle
                    cx="300"
                    cy="120"
                    r="5"
                    fill="#ed1c24"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle
                    cx="450"
                    cy="60"
                    r="5"
                    fill="#ed1c24"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <circle
                    cx="600"
                    cy="40"
                    r="5"
                    fill="#ed1c24"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Chart Labels */}
              <div className="flex justify-between items-center px-2 mt-4 text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Updates */}
          <div className="bg-background border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-colors duration-300">
            <div className="space-y-5">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>Admin Actions Hub</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
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
                <Link
                  href="/admin/templates"
                  className="flex flex-col gap-2 p-4 rounded-xl bg-surface hover:bg-primary/10 text-foreground/80 hover:text-primary transition-all font-bold cursor-pointer border border-border"
                >
                  <Plus className="h-5 w-5 shrink-0" />
                  <span className="text-xs">Build Template</span>
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-3">
                Latest Activity
              </h4>
              <div className="space-y-3">
                <div className="flex gap-3 text-xs leading-normal">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-foreground/80">
                      Product Catalog Seeded
                    </p>
                    <p className="text-[10px] text-foreground/45 font-semibold">
                      Just now • System Agent
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs leading-normal">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-foreground/80">
                      Admin Session Authenticated
                    </p>
                    <p className="text-[10px] text-foreground/45 font-semibold">
                      5 mins ago • admin@jivanjor.com
                    </p>
                  </div>
                </div>
              </div>
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
