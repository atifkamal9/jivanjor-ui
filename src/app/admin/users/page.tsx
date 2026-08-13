"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, User } from "@/lib/api";
import { getUserEmail, getUserRole } from "@/lib/auth";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Check,
  AlertCircle,
  Lock,
  Mail,
  User as UserIcon,
  ArrowLeft,
} from "lucide-react";

export interface PermissionOption {
  key: string;
  label: string;
  description: string;
}

export const AVAILABLE_PERMISSIONS: PermissionOption[] = [
  { key: "manage_products", label: "Products Catalogue", description: "Create, edit, delete & map products and Right Choice banners" },
  { key: "manage_categories", label: "Product Categories", description: "Manage category hierarchies & classification properties" },
  { key: "manage_blogs", label: "Blog Publications", description: "Write, edit, delete blog posts, categories & authors" },
  { key: "manage_use_cases", label: "Application Use Cases", description: "Create & manage woodworking application guides and use cases" },
  { key: "manage_forms", label: "Form Submissions", description: "View & manage website form submissions, CRM sync status & retries" },
  { key: "manage_pages", label: "Dynamic Pages", description: "Configure dynamic page content & section layouts" },
  { key: "manage_sitemap", label: "Sitemap Manager", description: "Manage XML sitemap structure, section order & link indexing" },
  { key: "manage_settings", label: "Global Settings & Navigation Menus", description: "Configure desktop/mobile logos, social links, site branding & navigation menus" },
  { key: "manage_users", label: "User Management", description: "Create, update roles & grant granular system permissions" },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");

  // Page View State: "LIST" | "CREATE" | "EDIT"
  const [viewMode, setViewMode] = useState<"LIST" | "CREATE" | "EDIT">("LIST");
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);

  // Form State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
    permissions: [] as string[],
  });

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUserEmail(getUserEmail());
    setCurrentUserRole(getUserRole());
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to load users:", err);
      setErrorMessage(err?.response?.data?.message || "Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  const visibleUsers = users.filter((u) => {
    if (u.role === "SUPER_ADMIN") {
      return currentUserRole === "SUPER_ADMIN" && u.email === currentUserEmail;
    }
    return true;
  });

  const filteredUsers = visibleUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // View Switch Triggers
  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "ADMIN",
      permissions: [
        "manage_products",
        "manage_categories",
        "manage_blogs",
        "manage_forms",
        "manage_pages",
        "manage_settings",
      ],
    });
    setErrorMessage(null);
    setViewMode("CREATE");
  };

  const handleOpenEdit = (user: User) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role || "USER",
      permissions: user.permissions || [],
    });
    setErrorMessage(null);
    setViewMode("EDIT");
  };

  const handlePermissionToggle = (key: string) => {
    setFormData((prev) => {
      const exists = prev.permissions.includes(key);
      const updated = exists
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key];
      return { ...prev, permissions: updated };
    });
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => {
      let permissions = prev.permissions;
      if (role === "USER") {
        permissions = permissions.filter((p) => p !== "manage_users");
      }
      return { ...prev, role, permissions };
    });
  };

  const handleSelectAllPermissions = () => {
    const available = AVAILABLE_PERMISSIONS.filter(
      (perm) => !(formData.role === "USER" && perm.key === "manage_users")
    );
    if (formData.permissions.length === available.length) {
      setFormData((prev) => ({ ...prev, permissions: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: available.map((p) => p.key),
      }));
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    try {
      await api.createUser(formData);
      setViewMode("LIST");
      await loadUsers();
    } catch (err: any) {
      console.error("Create user failed:", err);
      setErrorMessage(err?.response?.data?.message || "Failed to create user account");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;
    setSaving(true);
    setErrorMessage(null);
    try {
      await api.updateUser(editingUserId, {
        name: formData.name,
        email: formData.email,
        password: formData.password ? formData.password : undefined,
        role: formData.role,
        permissions: formData.permissions,
      });
      setViewMode("LIST");
      await loadUsers();
    } catch (err: any) {
      console.error("Update user failed:", err);
      setErrorMessage(err?.response?.data?.message || "Failed to update user account");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setDeleting(true);
    setErrorMessage(null);
    try {
      await api.deleteUser(deleteConfirmUser.id);
      setDeleteConfirmUser(null);
      await loadUsers();
    } catch (err: any) {
      console.error("Delete user failed:", err);
      setErrorMessage(err?.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  // Metrics
  const superAdminCount = users.filter((u) => u.role === "SUPER_ADMIN").length;
  const adminCount = visibleUsers.filter((u) => u.role === "ADMIN").length;
  const standardUserCount = visibleUsers.filter((u) => u.role === "USER").length;

  return (
    <AdminLayout>
      {/* ==================== USER LIST PAGE VIEW ==================== */}
      {viewMode === "LIST" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          {/* Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-red-600" />
                <span>User & Permission Management</span>
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Control administrative access, user credentials & modular permission assignments
              </p>
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 cursor-pointer transition-all self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create New User</span>
            </button>
          </div>

          {/* Metric Cards Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Accounts</p>
                <p className="text-2xl font-black text-gray-900 dark:text-zinc-50">{visibleUsers.length}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Administrators</p>
                <p className="text-2xl font-black text-red-600">{adminCount}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-xl">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">General Users</p>
                <p className="text-2xl font-black text-blue-600">{standardUserCount}</p>
              </div>
            </div>
          </div>

          {/* Filter & Search Controls */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role Filter:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer"
              >
                <option value="ALL">All Roles ({visibleUsers.length})</option>
                <option value="ADMIN">Administrators ({adminCount})</option>
                <option value="USER">General Users ({standardUserCount})</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">User Account</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Role</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Module Permissions</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Created</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          <span>Retrieving user accounts & security records...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => {
                      const isSelf = u.email === currentUserEmail;
                      const isSuperAdmin = u.role === "SUPER_ADMIN";
                      const isCustomAdmin = u.role === "ADMIN";

                      return (
                        <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/40 transition-colors">
                          {/* User Profile Cell */}
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center font-extrabold text-sm border border-red-200 dark:border-red-900/30 shrink-0">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-extrabold text-sm text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                                  <span>{u.name}</span>
                                  {isSelf && (
                                    <span className="text-[9px] font-black uppercase tracking-wider text-green-600 bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-900/30 px-2 py-0.5 rounded-full">
                                      You
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500 font-semibold">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Role Cell */}
                          <td className="p-5">
                            {isSuperAdmin ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/40">
                                <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
                              </span>
                            ) : isCustomAdmin ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900/40">
                                <ShieldAlert className="h-3.5 w-3.5" /> Administrator
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/40">
                                <UserCheck className="h-3.5 w-3.5" /> General User
                              </span>
                            )}
                          </td>

                          {/* Permissions Cell */}
                          <td className="p-5 max-w-md">
                            {isSuperAdmin ? (
                              <span className="text-xs font-extrabold text-purple-600 bg-purple-50 dark:bg-purple-950/20 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-900/30">
                                Full Unrestricted System Access (*)
                              </span>
                            ) : (u.permissions || []).length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {(u.permissions || []).map((permKey) => {
                                  const opt = AVAILABLE_PERMISSIONS.find((p) => p.key === permKey);
                                  return (
                                    <span
                                      key={permKey}
                                      className="text-[10px] font-bold bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-md border border-gray-200 dark:border-zinc-700"
                                    >
                                      {opt ? opt.label : permKey}
                                    </span>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic font-medium">No permissions granted</span>
                            )}
                          </td>

                          {/* Created Date */}
                          <td className="p-5 text-xs text-gray-500 dark:text-zinc-400 font-semibold">
                            {u.createdAt || u.created_at
                              ? new Date(u.createdAt || u.created_at!).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                              : "—"}
                          </td>

                          {/* Action Buttons */}
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(u)}
                                className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer border border-gray-100 dark:border-zinc-800"
                                title="Edit user role & permissions"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>

                              <button
                                disabled={isSelf || (isSuperAdmin && superAdminCount <= 1)}
                                onClick={() => setDeleteConfirmUser(u)}
                                className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer disabled:opacity-30 border border-gray-100 dark:border-zinc-800"
                                title={
                                  isSelf
                                    ? "Cannot delete active session account"
                                    : isSuperAdmin && superAdminCount <= 1
                                      ? "Cannot delete the last Super Admin"
                                      : "Delete user account"
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500">
                        No user accounts found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== CREATE USER PAGE VIEW ==================== */}
      {viewMode === "CREATE" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          {/* Header & Back Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-5">
            <div>
              <button
                type="button"
                onClick={() => setViewMode("LIST")}
                className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 mb-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Users List</span>
              </button>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50 flex items-center gap-3">
                <UserIcon className="h-7 w-7 text-red-600" />
                <span>Create User Account</span>
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Add new admin or team member with modular permissions
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleCreateSubmit} className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-foreground/40" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-foreground/40" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="rahul@jivanjor.com"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-foreground/40" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">
                    System Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="ADMIN">Administrator (Custom Permissions)</option>
                    {currentUserRole === "SUPER_ADMIN" && (
                      <option value="SUPER_ADMIN">Super Admin (Full Unrestricted Access)</option>
                    )}
                    <option value="USER">General User (Restricted Access)</option>
                  </select>
                </div>
              </div>

              {/* Modular Permissions Section */}
              {formData.role !== "SUPER_ADMIN" ? (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                        Module Permission Assignments
                      </h4>
                      <p className="text-[11px] text-foreground/50 font-medium">
                        Select which module sections this account can manage
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      {formData.permissions.length ===
                        AVAILABLE_PERMISSIONS.filter((p) => !(formData.role === "USER" && p.key === "manage_users")).length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AVAILABLE_PERMISSIONS.filter(
                      (perm) => !(formData.role === "USER" && perm.key === "manage_users")
                    ).map((perm) => {
                      const isChecked = formData.permissions.includes(perm.key);
                      return (
                        <label
                          key={perm.key}
                          onClick={() => handlePermissionToggle(perm.key)}
                          className={`flex items-start gap-3 p-3.5 rounded-2xl border transition cursor-pointer ${isChecked
                            ? "bg-red-50/50 border-red-300 dark:bg-red-950/20 dark:border-red-900/40"
                            : "bg-surface/40 border-gray-200 dark:border-zinc-800 hover:bg-surface"
                            }`}
                        >
                          <div
                            className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center border transition ${isChecked
                              ? "bg-red-600 border-red-600 text-white"
                              : "border-gray-300 dark:border-zinc-700"
                              }`}
                          >
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{perm.label}</p>
                            <p className="text-[11px] text-foreground/50">{perm.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 rounded-2xl text-xs text-purple-700 dark:text-purple-300 font-semibold">
                  ⚡ Super Admins possess full unrestricted read/write permissions across all system modules automatically.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setViewMode("LIST")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border border-gray-200 dark:border-zinc-800 text-foreground hover:bg-surface cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10 cursor-pointer transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Creating User...</span>
                    </>
                  ) : (
                    <span>Create User Account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== EDIT USER PAGE VIEW ==================== */}
      {viewMode === "EDIT" && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          {/* Header & Back Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-5">
            <div>
              <button
                type="button"
                onClick={() => setViewMode("LIST")}
                className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 mb-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Users List</span>
              </button>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50 flex items-center gap-3">
                <Edit2 className="h-7 w-7 text-red-600" />
                <span>Edit User Account</span>
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Modify profile details, role & module permission assignments
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleEditSubmit} className="space-y-6 max-w-4xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">
                    Reset Password (Optional)
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep existing password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/60 uppercase tracking-wider mb-2">
                    System Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-bold outline-none focus:border-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="ADMIN">Administrator (Custom Permissions)</option>
                    {currentUserRole === "SUPER_ADMIN" && (
                      <option value="SUPER_ADMIN">Super Admin (Full Unrestricted Access)</option>
                    )}
                    <option value="USER">General User (Restricted Access)</option>
                  </select>
                </div>
              </div>

              {/* Modular Permissions Section */}
              {formData.role !== "SUPER_ADMIN" ? (
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                        Module Permission Assignments
                      </h4>
                      <p className="text-[11px] text-foreground/50 font-medium">
                        Select which module sections this account can manage
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSelectAllPermissions}
                      className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                    >
                      {formData.permissions.length ===
                        AVAILABLE_PERMISSIONS.filter((p) => !(formData.role === "USER" && p.key === "manage_users")).length
                        ? "Deselect All"
                        : "Select All"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {AVAILABLE_PERMISSIONS.filter(
                      (perm) => !(formData.role === "USER" && perm.key === "manage_users")
                    ).map((perm) => {
                      const isChecked = formData.permissions.includes(perm.key);
                      return (
                        <label
                          key={perm.key}
                          onClick={() => handlePermissionToggle(perm.key)}
                          className={`flex items-start gap-3 p-3.5 rounded-2xl border transition cursor-pointer ${isChecked
                            ? "bg-red-50/50 border-red-300 dark:bg-red-950/20 dark:border-red-900/40"
                            : "bg-surface/40 border-gray-200 dark:border-zinc-800 hover:bg-surface"
                            }`}
                        >
                          <div
                            className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center border transition ${isChecked
                              ? "bg-red-600 border-red-600 text-white"
                              : "border-gray-300 dark:border-zinc-700"
                              }`}
                          >
                            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{perm.label}</p>
                            <p className="text-[11px] text-foreground/50">{perm.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 rounded-2xl text-xs text-purple-700 dark:text-purple-300 font-semibold">
                  ⚡ Super Admins possess full unrestricted read/write permissions across all system modules automatically.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setViewMode("LIST")}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border border-gray-200 dark:border-zinc-800 text-foreground hover:bg-surface cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10 cursor-pointer transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save User Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRMATION DIALOG ==================== */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 animate-[modalShow_0.15s_ease-out]">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 text-red-600 rounded-2xl border border-red-500/20">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">Confirm Account Deletion</h3>
                <p className="text-xs text-foreground/50 font-semibold uppercase tracking-wider">
                  Target: "{deleteConfirmUser.name}" ({deleteConfirmUser.email})
                </p>
              </div>
            </div>

            <p className="text-xs text-foreground/70 leading-relaxed font-medium">
              Are you sure you want to permanently delete user account <strong className="text-foreground font-bold">"{deleteConfirmUser.name}"</strong>?
              This operation cannot be undone.
            </p>

            {errorMessage && (
              <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMessage}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-border">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-border text-foreground hover:bg-surface cursor-pointer transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteUser}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10 cursor-pointer transition disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  <span>Confirm Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
