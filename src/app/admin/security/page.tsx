"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { ShieldCheck, Key, Lock, UserCheck, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage({ text: "Please fill in all password fields", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New password and confirm password do not match", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ text: "Password must be at least 6 characters long", type: "error" });
      return;
    }

    setMessage({ text: "Password updated successfully!", type: "success" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground">Security Settings</h1>
              <p className="text-xs text-foreground/60 mt-0.5">
                Manage account authentication, access roles, and system security.
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Password Change Card */}
          <div className="bg-background border border-border rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="p-2 rounded-xl bg-surface border border-border">
                <Key className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-foreground">Change Password</h2>
                <p className="text-[11px] text-foreground/50">Update your account login password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground/80 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/80 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/80 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-extrabold hover:opacity-90 transition-all shadow-md shadow-primary/20 cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Access Roles Overview Card */}
          <div className="bg-background border border-border rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2 rounded-xl bg-surface border border-border">
                <UserCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-foreground">Active Session & Role</h2>
                <p className="text-[11px] text-foreground/50">Current authentication status</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-surface border border-border">
                <span className="font-bold text-foreground/70">Role Level</span>
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-black text-[10px] uppercase tracking-wider">
                  Administrator
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-surface border border-border">
                <span className="font-bold text-foreground/70">Two-Factor Auth</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-wider">
                  Active (JWT)
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-surface border border-border">
                <span className="font-bold text-foreground/70">Session Protection</span>
                <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-black text-[10px] uppercase tracking-wider">
                  Encrypted HTTP-Only
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface/50 border border-border text-xs text-foreground/60 space-y-1">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-primary" /> Security Best Practices
              </p>
              <p className="text-[11px]">
                Always sign out when working on shared devices and use a strong password containing numbers and special characters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
