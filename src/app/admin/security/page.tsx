"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { api } from "@/lib/api";
import { ChevronRight, Key, ShieldAlert, CheckCircle2, Loader2, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setMessage({ text: "Please fill in all password fields.", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New password and confirm password do not match.", type: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ text: "New password must be at least 6 characters long.", type: "error" });
      return;
    }

    setUpdating(true);
    setMessage(null);

    try {
      await api.changePassword({ currentPassword, newPassword });
      setMessage({ text: "Password updated successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Failed to update password:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Failed to update password";
      setMessage({ text: errMsg, type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
            Security Settings
          </h1>
          <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
            Update your account password and security credentials.
          </p>
        </div>

        {/* Feedback Message Alert */}
        {message && (
          <div
            className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-2.5 max-w-2xl animate-[fadeIn_0.15s_ease-out] ${message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
              }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            ) : (
              <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Change Password Card Form */}
        <div className="max-w-md bg-background border border-border rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-foreground">Change Account Password</h2>
              <p className="text-[11px] text-foreground/50 mt-0.5">
                Ensure your account is using a strong password.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground/80 mb-1">Current Password</label>
              <div className="relative flex items-center">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                  title={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground/80 mb-1">New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                  title={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground/80 mb-1">Confirm New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updating}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-extrabold hover:opacity-90 transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
