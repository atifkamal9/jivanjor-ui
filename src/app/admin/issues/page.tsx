"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Issue } from "@/lib/api";
import { Plus, Search, Edit2, Trash2, X, Sparkles, HelpCircle, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    issue_title: "",
    slug: "",
    problem: "",
    solution: "",
  });

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.getIssues();
      setIssues(data);
    } catch (err) {
      console.error("Failed to load issues", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({ ...prev, issue_title: title, slug }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      issue_title: "",
      slug: "",
      problem: "",
      solution: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (issue: Issue) => {
    setEditingId(issue.id);
    setFormData({
      issue_title: issue.issue_title,
      slug: issue.slug,
      problem: issue.problem,
      solution: issue.solution,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveIssue({
        id: editingId || undefined,
        ...formData,
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save issue", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteIssue(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete issue", err);
    }
  };

  // Filter Issues
  const filteredIssues = issues.filter((i) => {
    const matchesSearch = i.issue_title.toLowerCase().includes(search.toLowerCase()) || 
                          i.problem.toLowerCase().includes(search.toLowerCase()) ||
                          i.solution.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIssues = filteredIssues.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      {!isModalOpen ? (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
                Troubleshooting & Support
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Create troubleshooting guides and common adhesive problem-solution assets
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Add Troubleshooting Issue</span>
            </button>
          </div>

          {/* Filters Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm transition-colors duration-300">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search issues, problems, solutions..."
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
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Issue/Question</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Problem Statement</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Formulated Solution</th>
                    <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-50 bg-surface/5">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                          <span>Retrieving support guidelines from database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentIssues.length > 0 ? (
                    currentIssues.map((issue) => (
                      <tr key={issue.id} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/20 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                              <HelpCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-extrabold text-sm text-gray-900 dark:text-zinc-50">{issue.issue_title}</p>
                              <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">{issue.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-gray-500 dark:text-zinc-400 max-w-xs truncate">
                          {issue.problem}
                        </td>
                        <td className="p-5 text-sm text-gray-500 dark:text-zinc-400 max-w-xs truncate">
                          {issue.solution}
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(issue)}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer"
                              title="Edit troubleshooting asset"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(issue.id)}
                              className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 dark:bg-zinc-800 dark:hover:bg-red-950/20 dark:text-zinc-400 dark:hover:text-red-400 transition-all cursor-pointer"
                              title="Delete troubleshooting asset"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-gray-400 dark:text-zinc-500">
                        No issues registered in support databases.
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
              className="p-2 rounded-xl bg-surface hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-955/20 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 cursor-pointer transition-all"
              title="Discard changes"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-red-600" />
                <span>{editingId ? "Revise Support Asset" : "Formulate Troubleshooting Support Asset"}</span>
              </h1>
              <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                Publish rich Q&A diagnostic flows, chemical problem details, and clear step-by-step resolution advice
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Issue Question / Guide Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.issue_title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Why is the glue bonding weak on wet teak wood?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Slug Identifier</span>
                  <span className="text-[10px] text-red-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Auto
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="weak-bond-wet-teak"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4.5 w-4.5" />
                  <span>Problem Statement / Analysis</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.problem}
                  onChange={(e) => setFormData((prev) => ({ ...prev, problem: e.target.value }))}
                  placeholder="Describe exactly what failure state happens (bubbling, joint failure, standard humidity stresses, clamping release, chemistry reactions)..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-amber-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  <span>Structured Solution & Best Practice Guidelines</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.solution}
                  onChange={(e) => setFormData((prev) => ({ ...prev, solution: e.target.value }))}
                  placeholder="Step-by-step procedures to resolve the issue (e.g. 1. Clean the timber... 2. Use specific notched trowel... 3. Increase clamp pressure for 3 hours... 4. Choose Jivanjor WaterShield instead...)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-emerald-500 resize-none"
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
                  {editingId ? "Save Troubleshooting Asset" : "Publish Support Guide"}
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
              Are you absolutely sure you want to delete this troubleshooting support asset? This will permanently delete this help resource.
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
    </AdminLayout>
  );
}
