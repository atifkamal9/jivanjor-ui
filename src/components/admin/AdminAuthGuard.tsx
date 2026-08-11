"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, getUserRole, hasPermission } from "@/lib/auth";
import AccessDenied from "@/components/admin/AccessDenied";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [accessState, setAccessState] = useState<{ allowed: boolean; moduleName: string }>({
    allowed: true,
    moduleName: "",
  });

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      const isLogin = pathname === "/admin/login";

      if (!auth && !isLogin) {
        router.push("/admin/login");
        return;
      }
      if (auth && isLogin) {
        router.push("/admin");
        return;
      }

      if (auth && pathname) {
        const role = getUserRole();
        let allowed = true;
        let moduleName = "";

        if (pathname.startsWith("/admin/templates")) {
          allowed = role === "SUPER_ADMIN";
          moduleName = "Page Templates";
        } else if (pathname.startsWith("/admin/materials")) {
          allowed = role === "SUPER_ADMIN";
          moduleName = "Material Catalogue";
        } else if (pathname.startsWith("/admin/issues")) {
          allowed = role === "SUPER_ADMIN";
          moduleName = "Issues & Troubleshooting";
        } else if (pathname.startsWith("/admin/products")) {
          allowed = hasPermission("manage_products");
          moduleName = "Products Catalogue";
        } else if (pathname.startsWith("/admin/categories")) {
          allowed = hasPermission("manage_categories");
          moduleName = "Product Categories";
        } else if (pathname.startsWith("/admin/blog")) {
          allowed = hasPermission("manage_blogs");
          moduleName = "Blog Publications";
        } else if (pathname.startsWith("/admin/use-cases")) {
          allowed = hasPermission("manage_use_cases") || hasPermission("manage_blogs");
          moduleName = "Application Use Cases";
        } else if (pathname.startsWith("/admin/pages")) {
          allowed = hasPermission("manage_pages");
          moduleName = "Dynamic Pages";
        } else if (pathname.startsWith("/admin/sitemap")) {
          allowed = hasPermission("manage_sitemap") || hasPermission("manage_pages") || hasPermission("manage_settings");
          moduleName = "Sitemap Manager";
        } else if (pathname.startsWith("/admin/users")) {
          allowed = hasPermission("manage_users");
          moduleName = "User Management";
        } else if (
          pathname.startsWith("/admin/settings") ||
          pathname.startsWith("/admin/menu") ||
          pathname.startsWith("/admin/security") ||
          pathname.startsWith("/admin/seo")
        ) {
          allowed = hasPermission("manage_settings") || role === "SUPER_ADMIN";
          moduleName = "System Settings & Branding";
        }

        if (!allowed) {
          setAccessState({ allowed: false, moduleName });
          setLoading(false);
          return;
        }
      }

      setAccessState({ allowed: true, moduleName: "" });
      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-6">
          {/* Pulsing beautiful logo loader */}
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 animate-ping absolute rounded-full bg-red-600/20"></div>
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent z-10 shadow-lg"></div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50 font-google-sans">
              JIVANJOR
            </h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
              Admin CMS Panel
            </p>
          </div>
          <div className="w-48 h-1 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-red-600 animate-[loading_1.5s_infinite_ease-in-out] w-1/2 rounded-full"></div>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
            Verifying secure session...
          </p>
        </div>
        
        {/* Custom tailwind keyframe inline animations style block */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
          `
        }} />
      </div>
    );
  }

  if (!accessState.allowed) {
    return (
      <AdminLayout>
        <AccessDenied moduleName={accessState.moduleName} />
      </AdminLayout>
    );
  }

  return <>{children}</>;
}
