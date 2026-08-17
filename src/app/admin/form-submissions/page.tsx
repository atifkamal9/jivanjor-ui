"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  api,
  FormSubmissionRecord,
  FormSubmissionsHealth,
} from "@/lib/api";
import {
  Search,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Eye,
  X,
  Filter,
  Activity,
  Layers,
  FileSpreadsheet,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building2,
  ShieldCheck,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function FormSubmissionsAdminPage() {
  const [submissions, setSubmissions] = useState<FormSubmissionRecord[]>([]);
  const [health, setHealth] = useState<FormSubmissionsHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [healthLoading, setHealthLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [formTypeFilter, setFormTypeFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubmissionsCount, setTotalSubmissionsCount] = useState(0);

  // Selection state for batch actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchReason, setBatchReason] = useState("");
  const [isBatchRetrying, setIsBatchRetrying] = useState(false);

  // Detail Modal state
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmissionRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [retryReason, setRetryReason] = useState("");

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
    showToast("success", `Copied to clipboard: ${text}`);
  };

  const loadHealth = useCallback(async () => {
    try {
      setHealthLoading(true);
      const data = await api.getFormSubmissionsHealth();
      setHealth(data);
    } catch (err) {
      console.error("Failed to load health metrics:", err);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  const loadSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getFormSubmissions({
        page,
        limit: 10,
        search,
        status: statusFilter,
        formType: formTypeFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      setSubmissions(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalSubmissionsCount(res.pagination?.total || 0);
    } catch (err: any) {
      showToast("error", err.message || "Failed to load form submissions");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, formTypeFilter, startDate, endDate]);

  useEffect(() => {
    loadHealth();
    loadSubmissions();
  }, [loadHealth, loadSubmissions]);

  // Open Detailed Modal
  const openDetailModal = async (id: string) => {
    try {
      setDetailLoading(true);
      setIsDetailOpen(true);
      const fullRecord = await api.getFormSubmissionById(id);
      setSelectedSubmission(fullRecord);
    } catch (err: any) {
      showToast("error", "Failed to fetch submission details");
    } finally {
      setDetailLoading(false);
    }
  };

  // Single Re-queue / Retry
  const handleSingleRetry = async (id: string) => {
    try {
      setActionLoading(id);
      await api.retryFormSubmission(id, retryReason || "Manual admin UI retry");
      showToast("success", "Submission re-queued for CRM sync successfully!");
      setRetryReason("");
      loadSubmissions();
      loadHealth();
      if (selectedSubmission?.id === id) {
        openDetailModal(id);
      }
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message || "Retry failed");
    } finally {
      setActionLoading(null);
    }
  };

  // Batch Re-queue / Retry
  const handleBatchRetry = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsBatchRetrying(true);
      const res = await api.batchRetryFormSubmissions(selectedIds, batchReason || "Batch admin UI retry");
      showToast("success", res.data?.message || `Queued ${selectedIds.length} items for retry.`);
      setSelectedIds([]);
      setBatchReason("");
      loadSubmissions();
      loadHealth();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message || "Batch retry failed");
    } finally {
      setIsBatchRetrying(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === submissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(submissions.map((s) => s.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Status Badge Component
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "SYNCED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Synced
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Syncing...
          </span>
        );
      case "RETRY_SCHEDULED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <RotateCcw className="w-3.5 h-3.5" />
            Retry Scheduled
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      case "MANUAL_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            Needs Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-600 border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  // Form Type Badge
  const renderFormTypeBadge = (type: string) => {
    switch (type) {
      case "CONTACT":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Contact Us
          </span>
        );
      case "DEALER":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-extrabold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Become a Dealer
          </span>
        );
      case "CONTRACTOR":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Contractor Connect
          </span>
        );
      default:
        return <span className="text-xs font-bold">{type}</span>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border text-sm font-semibold flex items-center gap-2 animate-[slideIn_0.2s_ease-out] ${toastMessage.type === "success"
              ? "bg-emerald-600 text-white border-emerald-700"
              : "bg-rose-600 text-white border-rose-700"
              }`}
          >
            {toastMessage.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
              <span>Form Submissions & Zoho CRM Sync</span>
            </h1>
            <p className="text-xs text-foreground/60 mt-1">
              Authoritative form records, automatic Zoho CRM Contact & Website Enquiry upserts, retry outbox worker, and audit trail.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loadSubmissions();
                loadHealth();
              }}
              disabled={loading || healthLoading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-background border border-border text-xs font-bold hover:bg-surface transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading || healthLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Metrics Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Submissions */}
          <div className="p-4 rounded-2xl bg-background border border-border shadow-xs space-y-1">
            <div className="flex items-center justify-between text-foreground/60 text-xs font-bold">
              <span>Total Submissions</span>
              <FileSpreadsheet className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-foreground">
              {health?.totalSubmissions ?? totalSubmissionsCount}
            </p>
            <p className="text-[10px] text-foreground/50">Stored in PostgreSQL</p>
          </div>

          {/* Sync Success Rate */}
          <div className="p-4 rounded-2xl bg-background border border-border shadow-xs space-y-1">
            <div className="flex items-center justify-between text-foreground/60 text-xs font-bold">
              <span>Sync Success Rate</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {health?.syncSuccessRate ?? 100}%
            </p>
            <p className="text-[10px] text-foreground/50">Successful CRM delivery</p>
          </div>

          {/* Queue Depth */}
          <div className="p-4 rounded-2xl bg-background border border-border shadow-xs space-y-1">
            <div className="flex items-center justify-between text-foreground/60 text-xs font-bold">
              <span>Queue Depth</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {health?.queueDepth ?? 0}
            </p>
            <p className="text-[10px] text-foreground/50">Pending + Retry Scheduled</p>
          </div>

          {/* Synced Count */}
          <div className="p-4 rounded-2xl bg-background border border-border shadow-xs space-y-1">
            <div className="flex items-center justify-between text-foreground/60 text-xs font-bold">
              <span>Synced Records</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-foreground">
              {health?.counts?.SYNCED ?? 0}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Contact + Enquiry saved</p>
          </div>

          {/* Failed Count */}
          <div className="p-4 rounded-2xl bg-background border border-border shadow-xs space-y-1">
            <div className="flex items-center justify-between text-foreground/60 text-xs font-bold">
              <span>Failed Records</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {health?.counts?.FAILED ?? 0}
            </p>
            <p className="text-[10px] text-foreground/50">Exhausted auto-retries</p>
          </div>

          {/* Needs Review */}
          <div className="p-4 rounded-2xl bg-background border border-border shadow-xs space-y-1">
            <div className="flex items-center justify-between text-foreground/60 text-xs font-bold">
              <span>Needs Review</span>
              <HelpCircle className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
              {health?.counts?.MANUAL_REVIEW ?? 0}
            </p>
            <p className="text-[10px] text-foreground/50">CRM data conflict</p>
          </div>
        </div>

        {/* Filters & Actions Control Bar */}
        <div className="p-4 rounded-2xl bg-background border border-border shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2 text-foreground/40" />
              <input
                type="text"
                placeholder="Search Entry ID, Name, Mobile, City..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                <option value="ALL">All Sync Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Syncing (Processing)</option>
                <option value="RETRY_SCHEDULED">Retry Scheduled</option>
                <option value="SYNCED">Synced</option>
                <option value="FAILED">Failed</option>
                <option value="MANUAL_REVIEW">Needs Review</option>
              </select>
            </div>

            {/* Form Type Filter */}
            <div className="relative">
              <select
                value={formTypeFilter}
                onChange={(e) => {
                  setFormTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
              >
                <option value="ALL">All Website Forms</option>
                <option value="CONTACT">Contact Us (/contact)</option>
                <option value="DEALER">Become a Dealer (/partner)</option>
                <option value="CONTRACTOR">Contractor Connect (/contractor)</option>
              </select>
            </div>

            {/* Date Range Start */}
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                title="Start Date"
              />
            </div>

            {/* Date Range End */}
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                title="End Date"
              />
            </div>
          </div>

          {/* Selected Actions Bar */}
          {selectedIds.length > 0 && (
            <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-primary/5 p-3 rounded-xl">
              <span className="text-xs font-bold text-primary">
                {selectedIds.length} submission(s) selected
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Optional retry reason..."
                  value={batchReason}
                  onChange={(e) => setBatchReason(e.target.value)}
                  className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-medium w-60"
                />
                <button
                  onClick={handleBatchRetry}
                  disabled={isBatchRetrying}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isBatchRetrying ? "animate-spin" : ""}`} />
                  <span>Re-queue Batch</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submissions Table */}
        <div className="bg-background border border-border rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-foreground/60 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="px-2 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === submissions.length && submissions.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="px-2 py-3 max-w-30 2xl:max-w-none">Entry ID & Date</th>
                  <th className="px-2 py-3">Form Type</th>
                  <th className="px-2 py-3">Submitter Info</th>
                  <th className="px-2 py-3">Location</th>
                  <th className="px-2 py-3">CRM Sync Status</th>
                  <th className="px-2 py-3">Zoho Record IDs</th>
                  <th className="px-2 py-3 text-center hidden 2xl:block">Attempts</th>
                  <th className="px-2 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-foreground/50 font-semibold">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                      Loading form submissions...
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-foreground/50 font-semibold">
                      No form submissions found matching your search filters.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-surface/50 transition-colors"
                    >
                      <td className="px-2 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(sub.id)}
                          onChange={() => toggleSelect(sub.id)}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                      </td>

                      {/* Entry ID & Date */}
                      <td className="px-2 py-3 max-w-30 2xl:max-w-none">
                        <div className="font-mono font-bold text-foreground flex items-center gap-1">
                          <span className="truncate max-w-20 2xl:max-w-none inline-block" title={sub.crmExternalKey}>
                            {sub.crmExternalKey}
                          </span>
                          <button
                            onClick={() => copyToClipboard(sub.crmExternalKey, `key-${sub.id}`)}
                            className="hover:bg-surface rounded text-foreground/40 hover:text-foreground shrink-0 cursor-pointer"
                            title="Copy Entry ID"
                          >
                            {copiedKey === `key-${sub.id}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-foreground/50 mt-0.5 truncate">
                          {new Date(sub.submittedAt).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </td>

                      {/* Form Type */}
                      <td className="px-2 py-3 min-w-35">{renderFormTypeBadge(sub.formType)}</td>

                      {/* Submitter Info */}
                      <td className="px-2 py-3 min-w-28 max-w-35">
                        <p className="font-bold text-foreground">{sub.fullName}</p>
                        <p className="text-[10px] text-foreground/60 font-mono">{sub.mobileRaw}</p>
                        {sub.firmName && (
                          <p className="text-[10px] text-foreground/50 truncate max-w-40">{sub.firmName}</p>
                        )}
                      </td>

                      {/* Location */}
                      <td className="px-2 py-3 max-w-35">
                        <p className="font-medium text-foreground">{sub.city || "—"}</p>
                        <p className="text-[10px] text-foreground/50">{sub.pinCode || "—"}</p>
                      </td>

                      {/* Zoho Sync Status */}
                      <td className="px-2 py-3">
                        {renderStatusBadge(sub.zohoSyncStatus)}
                        {sub.zohoLastErrorMessage && (
                          <p
                            className="text-[10px] text-rose-500 font-medium truncate max-w-35 mt-1"
                            title={sub.zohoLastErrorMessage}
                          >
                            {sub.zohoLastErrorCode}: {sub.zohoLastErrorMessage}
                          </p>
                        )}
                      </td>

                      {/* Zoho Record IDs */}
                      <td className="px-2 py-3 font-mono text-[11px]">
                        {sub.zohoContactId ? (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <span className="font-bold">C:</span>
                            <span>{sub.zohoContactId}</span>
                          </div>
                        ) : (
                          <span className="text-foreground/40">—</span>
                        )}

                        {sub.zohoEnquiryId ? (
                          <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 mt-0.5">
                            <span className="font-bold">E:</span>
                            <span>{sub.zohoEnquiryId}</span>
                          </div>
                        ) : (
                          <span className="text-foreground/40 block mt-0.5">—</span>
                        )}
                      </td>

                      {/* Attempt Count */}
                      <td className="px-2 py-3 text-center font-bold text-foreground hidden 2xl:block">
                        {sub.zohoSyncAttempts}
                      </td>

                      {/* Actions */}
                      <td className="px-2 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openDetailModal(sub.id)}
                            className="p-1.5 rounded-lg bg-surface border border-border hover:bg-surface/80 text-foreground transition-all cursor-pointer"
                            title="View Full Payload & Audit Log"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {sub.zohoSyncStatus !== "SYNCED" && sub.zohoSyncStatus !== "PROCESSING" && (
                            <button
                              onClick={() => handleSingleRetry(sub.id)}
                              disabled={actionLoading === sub.id}
                              className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer disabled:opacity-50"
                              title="Re-queue for CRM retry"
                            >
                              <RotateCcw className={`w-3.5 h-3.5 ${actionLoading === sub.id ? "animate-spin" : ""}`} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 bg-surface border-t border-border flex items-center justify-between">
            <span className="text-xs text-foreground/60 font-medium">
              Showing page <strong className="text-foreground">{page}</strong> of <strong className="text-foreground">{totalPages}</strong> ({totalSubmissionsCount} submissions)
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="p-2 rounded-xl bg-background border border-border text-xs font-bold hover:bg-surface disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="p-2 rounded-xl bg-background border border-border text-xs font-bold hover:bg-surface disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Submission View Modal */}
        {isDetailOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-background border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-[fadeIn_0.15s_ease-out]">
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-black font-mono text-foreground">
                      {selectedSubmission?.crmExternalKey}
                    </h3>
                    {selectedSubmission && renderStatusBadge(selectedSubmission.zohoSyncStatus)}
                  </div>
                  <p className="text-xs text-foreground/60">
                    Form Type: {selectedSubmission && renderFormTypeBadge(selectedSubmission.formType)} | Submitted on:{" "}
                    {selectedSubmission && new Date(selectedSubmission.submittedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                  </p>
                </div>

                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="p-2 rounded-xl bg-surface hover:bg-surface/80 text-foreground cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {detailLoading ? (
                  <div className="p-12 text-center text-foreground/60 font-semibold">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                    Loading record details & attempt history...
                  </div>
                ) : !selectedSubmission ? (
                  <p className="text-center text-rose-500">Record not found.</p>
                ) : (
                  <>
                    {/* Re-queue Retry Box if not SYNCED */}
                    {selectedSubmission.zohoSyncStatus !== "SYNCED" && (
                      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" />
                            Manual Re-queue Action Available
                          </p>
                          <p className="text-[11px] text-foreground/70">
                            Re-queuing will reset the status to PENDING and trigger the worker immediately.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="text"
                            placeholder="Reason (e.g. CRM field updated)"
                            value={retryReason}
                            onChange={(e) => setRetryReason(e.target.value)}
                            className="px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-medium w-full sm:w-56"
                          />
                          <button
                            onClick={() => handleSingleRetry(selectedSubmission.id)}
                            disabled={actionLoading === selectedSubmission.id}
                            className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                          >
                            Re-queue Sync
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Section 1: Canonical Form Data */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground/60 border-b border-border pb-1">
                        Submitter Form Data & Fields
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">Full Name</span>
                          <p className="text-xs font-extrabold text-foreground">{selectedSubmission.fullName}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">Raw Mobile / Normalized</span>
                          <p className="text-xs font-extrabold text-foreground font-mono">
                            {selectedSubmission.mobileRaw} ({selectedSubmission.mobileNormalized})
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">Email</span>
                          <p className="text-xs font-extrabold text-foreground">{selectedSubmission.email || "—"}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">Firm Name</span>
                          <p className="text-xs font-extrabold text-foreground">{selectedSubmission.firmName || "—"}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">City & Pin Code</span>
                          <p className="text-xs font-extrabold text-foreground">
                            {selectedSubmission.city || "—"} ({selectedSubmission.pinCode || "—"})
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">Query Type</span>
                          <p className="text-xs font-extrabold text-foreground">{selectedSubmission.queryType || "—"}</p>
                        </div>

                        {selectedSubmission.interestedIn && (
                          <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                            <span className="text-[10px] text-foreground/50 font-bold uppercase">Interested In</span>
                            <p className="text-xs font-extrabold text-foreground">{selectedSubmission.interestedIn}</p>
                          </div>
                        )}

                        {selectedSubmission.lineOfBusiness && (
                          <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                            <span className="text-[10px] text-foreground/50 font-bold uppercase">Line of Business</span>
                            <p className="text-xs font-extrabold text-foreground">{selectedSubmission.lineOfBusiness}</p>
                          </div>
                        )}

                        <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">Consent Acceptance</span>
                          <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                            Accepted ({selectedSubmission.consentTextVersion || "v1.0"})
                          </p>
                        </div>
                      </div>

                      {/* Message Field */}
                      {selectedSubmission.message && (
                        <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">User Message</span>
                          <p className="text-xs text-foreground whitespace-pre-wrap font-medium">{selectedSubmission.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Section 2: Attribution & Tracking Metadata */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground/60 border-b border-border pb-1">
                        Attribution & UTM Metadata
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-surface border border-border">
                          <span className="text-[10px] text-foreground/50 block font-bold">UTM Source</span>
                          <span className="font-semibold">{selectedSubmission.utmSource || "—"}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface border border-border">
                          <span className="text-[10px] text-foreground/50 block font-bold">UTM Medium</span>
                          <span className="font-semibold">{selectedSubmission.utmMedium || "—"}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface border border-border">
                          <span className="text-[10px] text-foreground/50 block font-bold">UTM Campaign</span>
                          <span className="font-semibold">{selectedSubmission.utmCampaign || "—"}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface border border-border">
                          <span className="text-[10px] text-foreground/50 block font-bold">Source URL</span>
                          <span className="font-semibold truncate block max-w-full" title={selectedSubmission.sourceUrl || ""}>
                            {selectedSubmission.sourceUrl || "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Zoho CRM Record Status */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground/60 border-b border-border pb-1">
                        Zoho CRM Created Identifiers & Actions
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                            Zoho Contact ID
                          </span>
                          <p className="text-base font-mono font-bold text-foreground">
                            {selectedSubmission.zohoContactId || "Not Created Yet"}
                          </p>
                          {selectedSubmission.zohoContactAction && (
                            <p className="text-[11px] text-foreground/60 font-semibold">
                              Action: {selectedSubmission.zohoContactAction.toUpperCase()}
                            </p>
                          )}
                        </div>

                        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
                            Zoho Website Enquiry ID
                          </span>
                          <p className="text-base font-mono font-bold text-foreground">
                            {selectedSubmission.zohoEnquiryId || "Not Created Yet"}
                          </p>
                          {selectedSubmission.zohoEnquiryAction && (
                            <p className="text-[11px] text-foreground/60 font-semibold">
                              Action: {selectedSubmission.zohoEnquiryAction.toUpperCase()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Attempt History Log */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-foreground/60 border-b border-border pb-1">
                        Sync Attempt Timeline & Response Log
                      </h4>

                      {!selectedSubmission.attempts || selectedSubmission.attempts.length === 0 ? (
                        <p className="text-xs text-foreground/50">No attempt records logged yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedSubmission.attempts.map((attempt) => (
                            <div
                              key={attempt.id}
                              className="p-3 rounded-xl bg-surface border border-border text-xs space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-foreground">
                                    Attempt #{attempt.attemptNumber}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded bg-background border border-border font-bold">
                                    Source: {attempt.source} ({attempt.actor || "SYSTEM"})
                                  </span>
                                  {renderStatusBadge(attempt.status)}
                                </div>
                                <span className="text-[10px] text-foreground/50">
                                  {new Date(attempt.startedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                                </span>
                              </div>

                              {attempt.errorMessage && (
                                <p className="text-rose-500 font-semibold text-[11px]">
                                  Error [{attempt.errorCode}]: {attempt.errorMessage}
                                </p>
                              )}

                              {attempt.responsePayload && (
                                <details className="text-[10px] text-foreground/60 cursor-pointer" open={attempt.status === "FAILED" || attempt.status === "MANUAL_REVIEW"}>
                                  <summary className="font-bold hover:text-foreground text-xs text-foreground/80 py-1">
                                    View Response Payload Details
                                  </summary>
                                  <pre className="mt-1 p-2 bg-background/80 border border-border/80 rounded-lg overflow-x-auto font-mono text-[10px] text-foreground/90 leading-relaxed">
                                    {JSON.stringify(attempt.responsePayload, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
