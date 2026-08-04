"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Material } from "@/lib/api";
import { Plus, Search, Edit2, Trash2, X, Hammer, ArrowLeft } from "lucide-react";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getMaterials();
      setMaterials(data);
    } catch (err) {
      console.error("Failed to fetch materials", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (material: Material) => {
    setEditingId(material.id);
    setFormData({
      name: material.name,
      description: material.description,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveMaterial({
        id: editingId || undefined,
        ...formData,
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save material", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMaterial(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete material", err);
    }
  };

  // Filter materials
  const filteredMaterials = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.description.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      {!isModalOpen ? (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
                Timber & Materials
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Manage wood substrates and engineered materials for adhesive matches
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Add Wood/Material</span>
            </button>
          </div>

          {/* Filters Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm transition-colors duration-300">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search wood substrates..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
              />
            </div>
          </div>

          {/* Database Table */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Substrate Name</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Material Description & Guidelines</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500 bg-surface/5">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          <span>Retrieving materials from database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentMaterials.length > 0 ? (
                    currentMaterials.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                              <Hammer className="h-5 w-5" />
                            </div>
                            <span className="font-extrabold text-sm text-gray-900 dark:text-zinc-50">{m.name}</span>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-gray-500 dark:text-zinc-400 max-w-md truncate">
                          {m.description}
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(m)}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer"
                              title="Edit material"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(m.id)}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer"
                              title="Delete material"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500">
                        No materials found in local state storage.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-zinc-800">
                <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out] max-w-3xl">
          {/* Header Workspace Title Bar */}
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800 pb-5 shrink-0">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-xl bg-surface hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 cursor-pointer transition-all"
              title="Discard changes"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                <Hammer className="h-6 w-6 text-red-600" />
                <span>{editingId ? "Modify Substrate Description" : "Register Material Substrate"}</span>
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Establish wood substrate guidelines, densities, absorption, tolerances, and adhesive match criteria
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Substrate/Material Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Veneer & Laminates"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Description & Chemistry Details
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe target wood type density, absorption characteristics, bonding details, humidity tolerances..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg"
                >
                  {editingId ? "Save Wood Details" : "Register Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE CONFIRM DIALOG ==================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 animate-[modalShow_0.15s_ease-out]">
            <h3 className="text-lg font-black text-gray-900 dark:text-zinc-50">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-normal font-medium">
              Are you absolutely sure you want to delete this material specification? This will permanently remove its catalog parameters and description.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes modalShow {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
        `
      }} />
    </AdminLayout>
  );
}
