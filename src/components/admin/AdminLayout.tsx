"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, getUserEmail } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Hammer,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Search,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Layers,
  UserCheck,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Product", href: "/admin/products", icon: Package },
  { name: "Category", href: "/admin/categories", icon: FolderTree },
  { name: "Material", href: "/admin/materials", icon: Hammer },
  { name: "Blog", href: "/admin/blog", icon: BookOpen },
  { name: "Use Case", href: "/admin/use-cases", icon: Lightbulb },
  { name: "Issue", href: "/admin/issues", icon: HelpCircle },
  { name: "SEO Metadata", href: "/admin/seo", icon: Search },
  { name: "Dynamic Page", href: "/admin/pages", icon: FileText },
  { name: "Page Template", href: "/admin/templates", icon: Layers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setEmail(getUserEmail() || "admin@jivanjor.com");

    // Check local storage for theme
    const theme = localStorage.getItem("jivanjor_admin_theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // Check local storage for sidebar collapsed status
    const collapsed = localStorage.getItem("jivanjor_admin_sidebar_collapsed") === "true";
    setIsCollapsed(collapsed);
  }, []);

  const toggleTheme = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("jivanjor_admin_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("jivanjor_admin_theme", "light");
    }
  };

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("jivanjor_admin_sidebar_collapsed", String(nextState));
  };

  const handleLogout = () => {
    signOut();
    router.push("/admin/login");
  };

  const getPageTitle = () => {
    const activeItem = SIDEBAR_ITEMS.find((item) => item.href === pathname);
    return activeItem ? activeItem.name : "Admin Panel";
  };

  return (
    <div className="flex h-screen w-full bg-surface text-foreground overflow-hidden font-google-sans transition-colors duration-300">
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <aside className={`hidden lg:flex flex-col bg-background border-r border-border shrink-0 transition-all duration-300 ${isCollapsed ? "w-20" : "w-68"
        }`}>
        {/* Brand Header: Collapsed shows ONLY the panel open icon */}
        {isCollapsed ? (
          <div className="h-20 flex items-center justify-center shrink-0 animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={toggleCollapse}
              className="p-2.5 rounded-xl bg-surface text-foreground/75 hover:bg-surface/85 border border-border cursor-pointer transition-all hover:scale-105"
              title="Expand Sidebar"
            >
              <PanelLeftOpen className="h-5 w-5 text-primary" />
            </button>
          </div>
        ) : (
          <div className="h-20 flex items-center justify-between px-5 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30 shrink-0">
                <span className="text-lg font-black text-white">JJ</span>
              </div>
              <div className="truncate">
                <h1 className="text-sm font-extrabold text-foreground animate-[fadeIn_0.2s_ease-out]">
                  Jivanjor
                </h1>
                <p className="text-[9px] font-bold tracking-wider text-primary uppercase animate-[fadeIn_0.2s_ease-out]">
                  CMS ADMIN PANEL
                </p>
              </div>
            </div>
            <button
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg bg-surface text-foreground/75 hover:bg-surface/80 border border-border cursor-pointer transition-all hover:scale-105 shrink-0"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Navigation Links */}
        {!isCollapsed && (
          <nav className="flex-1 py-6 space-y-1.5 overflow-y-auto px-4">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-xl text-sm font-semibold transition-all group duration-200 gap-3 px-4 py-3 ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/75 hover:bg-surface hover:text-foreground"
                    }`}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 shrink-0 ${isActive ? "text-primary" : "text-foreground/45"
                      }`}
                  />
                  <span className="animate-[fadeIn_0.2s_ease-out] truncate">{item.name}</span>
                  {isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Footer Info */}
        <div className={`p-4 border-t border-border bg-surface/55 transition-all duration-300 ${isCollapsed ? "flex flex-col items-center gap-3" : ""
          }`}>
          {isCollapsed ? (
            <div className="h-9 w-9 rounded-lg bg-surface flex items-center justify-center font-bold text-foreground text-sm border border-border shrink-0" title={email}>
              {email ? email.substring(0, 2).toUpperCase() : "AD"}
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-3 animate-[fadeIn_0.2s_ease-out]">
              <div className="h-9 w-9 rounded-lg bg-surface flex items-center justify-center font-bold text-foreground text-sm border border-border shrink-0">
                {email ? email.substring(0, 2).toUpperCase() : "AD"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-foreground truncate">
                  Administrator
                </p>
                <p className="text-[10px] text-foreground/50 truncate">
                  {email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center text-xs font-bold text-primary bg-background border border-border rounded-lg hover:bg-primary/5 transition-all cursor-pointer ${isCollapsed ? "p-2.5 w-10 h-10 shrink-0" : "gap-2 w-full px-3 py-2"
              }`}
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {!isCollapsed && <span className="animate-[fadeIn_0.2s_ease-out]">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ==================== MOBILE MENU SIDEBAR ==================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="w-68 bg-background h-full flex flex-col p-4 animate-[slideIn_0.2s_ease-out]">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                  <span className="text-sm font-black text-white">JJ</span>
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground">Jivanjor</h2>
                  <p className="text-[9px] font-bold text-primary uppercase">CMS Admin</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg bg-surface text-foreground/70 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/75 hover:bg-surface"
                      }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-border">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:opacity-90 transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes slideIn {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(0); }
              }
            `
          }} />
        </div>
      )}

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-background border-b border-border flex items-center justify-between px-6 shrink-0 transition-colors duration-300 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-surface text-foreground/70 hover:bg-surface/85 cursor-pointer border border-border"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Clickable Interactive Breadcrumbs - NO back arrow buttons */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Link
                  href="/admin"
                  className="text-foreground/45 hover:text-primary transition-colors cursor-pointer"
                >
                  Dashboard
                </Link>
                {pathname !== "/admin" && (
                  <>
                    <ChevronRight className="h-4 w-4 text-foreground/20" />
                    <span className="text-foreground">{getPageTitle()}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-foreground/60 hover:bg-surface transition-all cursor-pointer"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notification Bell (Mock) */}
            <div className="relative">
              <button className="p-2.5 rounded-xl text-foreground/60 hover:bg-surface transition-all cursor-pointer">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              </button>
            </div>

            {/* Header User Badge */}
            <div className="h-9 w-px bg-border mx-1" />
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center font-bold text-white shadow-md shadow-primary/10 text-sm">
                A
              </div>
              <span className="hidden md:block text-sm font-bold text-foreground">
                Admin User
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface transition-colors duration-300">
          <div className="max-w-360 mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
