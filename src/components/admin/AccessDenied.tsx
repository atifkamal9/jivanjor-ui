"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LayoutDashboard } from "lucide-react";

interface AccessDeniedProps {
  moduleName?: string;
  message?: string;
}

export default function AccessDenied({
  moduleName = "Module Access",
  message = "You do not have permission to view or manage this section. Access is restricted for your account level or role.",
}: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-[fadeIn_0.25s_ease-out]">
      <div className="w-full max-w-md p-8 bg-background border border-border rounded-3xl shadow-xl space-y-6">
        {/* Shield Icon Badge */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5">
          <ShieldAlert className="h-10 w-10 animate-bounce" />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            Access Restricted
          </span>
          <h2 className="text-2xl font-black text-foreground pt-2">
            {moduleName}
          </h2>
          <p className="text-xs font-semibold text-foreground/60 leading-relaxed max-w-xs mx-auto">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/admin"
            className="flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Return to Dashboard Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
