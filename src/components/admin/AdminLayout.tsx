"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, getUserEmail, getUserRole } from "@/lib/auth";
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
  Compass,
  Settings,
  ShieldCheck,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Material", href: "/admin/materials", icon: Hammer },
  { name: "Blog", href: "/admin/blog", icon: BookOpen },
  { name: "Use Case", href: "/admin/use-cases", icon: Lightbulb },
  { name: "Issue", href: "/admin/issues", icon: HelpCircle },
  { name: "Dynamic Page", href: "/admin/pages", icon: FileText },
  { name: "Page Template", href: "/admin/templates", icon: Layers },
  { name: "Sitemap", href: "/admin/sitemap", icon: Compass },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);


  useEffect(() => {
    setEmail(getUserEmail() || "admin@jivanjor.com");
    setRole(getUserRole());

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

  // Sync productsOpen and settingsOpen state with current path
  useEffect(() => {
    if (pathname === "/admin/products" || pathname === "/admin/categories") {
      setProductsOpen(true);
    }
    if (pathname === "/admin/menu" || pathname === "/admin/security" || pathname === "/admin/settings") {
      setSettingsOpen(true);
    }
  }, [pathname]);

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
    if (activeItem) return activeItem.name;
    if (pathname === "/admin/products") return "Products";
    if (pathname === "/admin/categories") return "Product Categories";
    if (pathname === "/admin/settings") return "General Settings";
    if (pathname === "/admin/menu") return "Menus";
    if (pathname === "/admin/security") return "Security Settings";
    return "Admin Panel";
  };



  // Helper render function for Products collapsible menu (Desktop)
  const renderDesktopProductsAccordion = () => {
    const isChildActive = pathname === "/admin/products" || pathname === "/admin/categories";
    
    if (isCollapsed) {
      return (
        <Link
          href="/admin/products"
          className={`flex items-center justify-center p-2.5 w-10 h-10 rounded-xl text-sm font-semibold transition-all group duration-200 ${
            isChildActive
              ? "bg-primary/10 text-primary"
              : "text-foreground/75 hover:bg-surface hover:text-foreground"
          }`}
          title="Products & Categories"
        >
          <Package
            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 shrink-0 ${
              isChildActive ? "text-primary" : "text-foreground/45"
            }`}
          />
        </Link>
      );
    }

    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setProductsOpen(!productsOpen)}
          className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all group duration-200 gap-3 px-4 py-3 cursor-pointer ${
            isChildActive
              ? "bg-primary/5 text-primary"
              : "text-foreground/75 hover:bg-surface hover:text-foreground"
          }`}
        >
          <Package
            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 shrink-0 ${
              isChildActive ? "text-primary" : "text-foreground/45"
            }`}
          />
          <span className="animate-[fadeIn_0.2s_ease-out] truncate">Products</span>
          <ChevronRight
            className={`ml-auto h-4 w-4 text-foreground/30 transition-transform duration-200 shrink-0 ${
              productsOpen ? "rotate-90 text-primary" : ""
            }`}
          />
        </button>

        {productsOpen && (
          <div className="relative pl-9 pr-2 py-1 space-y-1 mt-1 animate-[fadeIn_0.15s_ease-out]">
            {/* Connecting line */}
            <div className="absolute left-[26px] top-0 bottom-3 w-[1.5px] bg-gray-200 dark:bg-zinc-800" />
            
            <Link
              href="/admin/products"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all relative ${
                pathname === "/admin/products"
                  ? "text-primary font-black"
                  : "text-foreground/60 hover:bg-surface hover:text-foreground"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${pathname === "/admin/products" ? "bg-primary scale-125" : "bg-foreground/20"}`} />
              <span>Products</span>
            </Link>

            <Link
              href="/admin/categories"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all relative ${
                pathname === "/admin/categories"
                  ? "text-primary font-black"
                  : "text-foreground/60 hover:bg-surface hover:text-foreground"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${pathname === "/admin/categories" ? "bg-primary scale-125" : "bg-foreground/20"}`} />
              <span>Product Categories</span>
            </Link>
          </div>
        )}
      </div>
    );
  };

  // Helper render function for Products collapsible menu (Mobile)
  const renderMobileProductsAccordion = () => {
    const isChildActive = pathname === "/admin/products" || pathname === "/admin/categories";

    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setProductsOpen(!productsOpen)}
          className={`w-full flex items-center rounded-lg text-xs font-bold transition-all gap-3 px-3 py-2.5 cursor-pointer ${
            isChildActive
              ? "bg-primary/5 text-primary"
              : "text-foreground/75 hover:bg-surface"
          }`}
        >
          <Package className="h-4 w-4 shrink-0 text-foreground/45" />
          <span>Products</span>
          <ChevronRight
            className={`ml-auto h-3.5 w-3.5 text-foreground/30 transition-transform duration-200 shrink-0 ${
              productsOpen ? "rotate-90 text-primary" : ""
            }`}
          />
        </button>

        {productsOpen && (
          <div className="relative pl-7 py-1 space-y-1 mt-1">
            <div className="absolute left-[20px] top-0 bottom-2.5 w-[1.5px] bg-gray-200 dark:bg-zinc-800" />
            
            <Link
              href="/admin/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all relative ${
                pathname === "/admin/products"
                  ? "text-primary bg-primary/5 font-black"
                  : "text-foreground/60 hover:bg-surface"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${pathname === "/admin/products" ? "bg-primary" : "bg-foreground/20"}`} />
              <span>Products</span>
            </Link>

            <Link
              href="/admin/categories"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all relative ${
                pathname === "/admin/categories"
                  ? "text-primary bg-primary/5 font-black"
                  : "text-foreground/60 hover:bg-surface"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${pathname === "/admin/categories" ? "bg-primary" : "bg-foreground/20"}`} />
              <span>Product Categories</span>
            </Link>
          </div>
        )}
      </div>
    );
  };

  // Helper render function for Settings collapsible menu (Desktop)
  const renderDesktopSettingsAccordion = () => {
    const isChildActive = pathname === "/admin/settings" || pathname === "/admin/menu" || pathname === "/admin/security";

    if (isCollapsed) {
      return (
        <Link
          href="/admin/settings"
          className={`flex items-center justify-center p-2.5 w-10 h-10 rounded-xl text-sm font-semibold transition-all group duration-200 ${
            isChildActive
              ? "bg-primary/10 text-primary"
              : "text-foreground/75 hover:bg-surface hover:text-foreground"
          }`}
          title="Settings (General, Menus & Security)"
        >
          <Settings
            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 shrink-0 ${
              isChildActive ? "text-primary" : "text-foreground/45"
            }`}
          />
        </Link>
      );
    }

    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`w-full flex items-center rounded-xl text-sm font-semibold transition-all group duration-200 gap-3 px-4 py-3 cursor-pointer ${
            isChildActive
              ? "bg-primary/5 text-primary"
              : "text-foreground/75 hover:bg-surface hover:text-foreground"
          }`}
        >
          <Settings
            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 shrink-0 ${
              isChildActive ? "text-primary" : "text-foreground/45"
            }`}
          />
          <span className="animate-[fadeIn_0.2s_ease-out] truncate">Settings</span>
          <ChevronRight
            className={`ml-auto h-4 w-4 text-foreground/30 transition-transform duration-200 shrink-0 ${
              settingsOpen ? "rotate-90 text-primary" : ""
            }`}
          />
        </button>

        {settingsOpen && (
          <div className="relative pl-9 pr-2 py-1 space-y-1 mt-1 animate-[fadeIn_0.15s_ease-out]">
            {/* Connecting line */}
            <div className="absolute left-[26px] top-0 bottom-3 w-[1.5px] bg-gray-200 dark:bg-zinc-800" />
            
            <Link
              href="/admin/settings"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all relative ${
                pathname === "/admin/settings"
                  ? "text-primary font-black"
                  : "text-foreground/60 hover:bg-surface hover:text-foreground"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${pathname === "/admin/settings" ? "bg-primary scale-125" : "bg-foreground/20"}`} />
              <span>General & Branding</span>
            </Link>

            <Link
              href="/admin/menu"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all relative ${
                pathname === "/admin/menu"
                  ? "text-primary font-black"
                  : "text-foreground/60 hover:bg-surface hover:text-foreground"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${pathname === "/admin/menu" ? "bg-primary scale-125" : "bg-foreground/20"}`} />
              <span>Menus</span>
            </Link>

            <Link
              href="/admin/security"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all relative ${
                pathname === "/admin/security"
                  ? "text-primary font-black"
                  : "text-foreground/60 hover:bg-surface hover:text-foreground"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${pathname === "/admin/security" ? "bg-primary scale-125" : "bg-foreground/20"}`} />
              <span>Security</span>
            </Link>
          </div>
        )}
      </div>
    );
  };

  // Helper render function for Settings collapsible menu (Mobile)
  const renderMobileSettingsAccordion = () => {
    const isChildActive = pathname === "/admin/settings" || pathname === "/admin/menu" || pathname === "/admin/security";

    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setSettingsOpen(!settingsOpen)}
          className={`w-full flex items-center rounded-lg text-xs font-bold transition-all gap-3 px-3 py-2.5 cursor-pointer ${
            isChildActive
              ? "bg-primary/5 text-primary"
              : "text-foreground/75 hover:bg-surface"
          }`}
        >
          <Settings className="h-4 w-4 shrink-0 text-foreground/45" />
          <span>Settings</span>
          <ChevronRight
            className={`ml-auto h-3.5 w-3.5 text-foreground/30 transition-transform duration-200 shrink-0 ${
              settingsOpen ? "rotate-90 text-primary" : ""
            }`}
          />
        </button>

        {settingsOpen && (
          <div className="relative pl-7 py-1 space-y-1 mt-1">
            <div className="absolute left-[20px] top-0 bottom-2.5 w-[1.5px] bg-gray-200 dark:bg-zinc-800" />
            
            <Link
              href="/admin/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all relative ${
                pathname === "/admin/settings"
                  ? "text-primary bg-primary/5 font-black"
                  : "text-foreground/60 hover:bg-surface"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${pathname === "/admin/settings" ? "bg-primary" : "bg-foreground/20"}`} />
              <span>General & Branding</span>
            </Link>

            <Link
              href="/admin/menu"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all relative ${
                pathname === "/admin/menu"
                  ? "text-primary bg-primary/5 font-black"
                  : "text-foreground/60 hover:bg-surface"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${pathname === "/admin/menu" ? "bg-primary" : "bg-foreground/20"}`} />
              <span>Menus</span>
            </Link>

            <Link
              href="/admin/security"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all relative ${
                pathname === "/admin/security"
                  ? "text-primary bg-primary/5 font-black"
                  : "text-foreground/60 hover:bg-surface"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${pathname === "/admin/security" ? "bg-primary" : "bg-foreground/20"}`} />
              <span>Security</span>
            </Link>
          </div>
        )}
      </div>
    );
  };



  return (
    <div className="flex h-screen w-full bg-surface text-foreground overflow-hidden font-google-sans transition-colors duration-300">
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <aside className={`hidden lg:flex flex-col bg-background border-r border-border shrink-0 transition-all duration-300 ${isCollapsed ? "w-20" : "w-68"
        }`}>
        {isCollapsed ? (
          <div className="h-20 flex items-center justify-center shrink-0 border-b border-border animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={toggleCollapse}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30 shrink-0 cursor-pointer hover:scale-105 transition-all relative group"
              title="Expand Sidebar"
            >
              <span className="text-lg font-black text-white group-hover:opacity-0 transition-opacity duration-200">JJ</span>
              <PanelLeftOpen className="h-5 w-5 text-white absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
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
        <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto no-scrollbar px-4 ${isCollapsed ? "flex flex-col items-center animate-[fadeIn_0.2s_ease-out]" : ""}`}>
          {/* Overview Link */}
          {(() => {
            const overviewItem = SIDEBAR_ITEMS[0];
            const isActive = pathname === overviewItem.href;
            const Icon = overviewItem.icon;
            return (
              <Link
                key={overviewItem.href}
                href={overviewItem.href}
                className={`flex items-center rounded-xl text-sm font-semibold transition-all group duration-200 ${
                  isCollapsed ? "justify-center p-2.5 w-10 h-10" : "gap-3 px-4 py-3"
                } ${isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/75 hover:bg-surface hover:text-foreground"
                }`}
                title={isCollapsed ? overviewItem.name : undefined}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 shrink-0 ${
                    isActive ? "text-primary" : "text-foreground/45"
                  }`}
                />
                {!isCollapsed && (
                  <span className="animate-[fadeIn_0.2s_ease-out] truncate">{overviewItem.name}</span>
                )}
                {!isCollapsed && isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })()}

          {/* Collapsible Products Menu */}
          {renderDesktopProductsAccordion()}

          {/* Remaining Sidebar Items */}
          {SIDEBAR_ITEMS.slice(1)
            .filter((item) => item.href !== "/admin/templates" || role === "SUPER_ADMIN")
            .map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center rounded-xl text-sm font-semibold transition-all group duration-200 ${
                    isCollapsed ? "justify-center p-2.5 w-10 h-10" : "gap-3 px-4 py-3"
                  } ${isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/75 hover:bg-surface hover:text-foreground"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 shrink-0 ${
                      isActive ? "text-primary" : "text-foreground/45"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="animate-[fadeIn_0.2s_ease-out] truncate">{item.name}</span>
                  )}
                  {!isCollapsed && isActive && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}

          {/* Settings Accordion at the very bottom */}
          {renderDesktopSettingsAccordion()}
        </nav>


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

            <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
              {/* Overview Mobile link */}
              {(() => {
                const overviewItem = SIDEBAR_ITEMS[0];
                const isActive = pathname === overviewItem.href;
                const Icon = overviewItem.icon;
                return (
                  <Link
                    key={overviewItem.href}
                    href={overviewItem.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/75 hover:bg-surface"
                      }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{overviewItem.name}</span>
                  </Link>
                );
              })()}

              {/* Collapsible Mobile Menu */}
              {renderMobileProductsAccordion()}

              {/* Remaining Mobile Links */}
              {SIDEBAR_ITEMS.slice(1)
                .filter((item) => item.href !== "/admin/templates" || role === "SUPER_ADMIN")
                .map((item) => {
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


              {/* Settings Accordion at the very bottom */}
              {renderMobileSettingsAccordion()}
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
