"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, getUserRole } from "@/lib/auth";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      const isLogin = pathname === "/admin/login";

      if (!auth && !isLogin) {
        router.push("/admin/login");
      } else if (auth && isLogin) {
        router.push("/admin");
      } else if (auth && pathname?.startsWith("/admin/templates") && getUserRole() !== "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        setLoading(false);
      }
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

  return <>{children}</>;
}
