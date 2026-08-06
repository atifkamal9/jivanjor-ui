import React from "react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export const metadata = {
  title: "Jivanjor CMS Admin Panel",
  description: "Secure Content Management System for Jivanjor",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="admin-root" className="w-full min-h-screen bg-surface text-foreground dark:bg-zinc-950 dark:text-zinc-50 flex flex-col">
      {/* 
        This style block is executed during SSR/HTML streaming. 
        It ensures the standard website's <Navbar /> and <Footer /> 
        are completely hidden instantly without any UI flash or layout shifts.
      */}
      <style dangerouslySetInnerHTML={{
        __html: `
          body:has(#admin-root) #main-landing-header,
          body:has(#admin-root) footer {
            display: none !important;
          }
          body:has(#admin-root) {
            padding: 0 !important;
            margin: 0 !important;
            min-height: 100vh !important;
            background-color: var(--surface) !important;
          }
          /* Dark mode background override for body when html has dark class */
          html.dark body:has(#admin-root) {
            background-color: #09090b !important;
          }
        `
      }} />
      {/* Script to ensure light theme is default for admin panel unless dark mode is explicitly stored */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('jivanjor_admin_theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      <AdminAuthGuard>
        {children}
      </AdminAuthGuard>
    </div>
  );
}
