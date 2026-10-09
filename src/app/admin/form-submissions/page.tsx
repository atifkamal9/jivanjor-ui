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
  Copy,
  Check,
  Eye,
  X,
  Activity,
  FileSpreadsheet,
  FileText,
  Download,
  ChevronDown,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as XLSX from "xlsx";

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
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubmissionsCount, setTotalSubmissionsCount] = useState(0);

  // Selection state for batch actions & multi-page selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAllMatchingSelected, setIsAllMatchingSelected] = useState(false);
  const [batchReason, setBatchReason] = useState("");
  const [isBatchRetrying, setIsBatchRetrying] = useState(false);

  // Detail Modal state
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmissionRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [retryReason, setRetryReason] = useState("");

  // Export Modal & Logic
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportScope, setExportScope] = useState<"page" | "all" | "selected">("all");
  const [exportFormat, setExportFormat] = useState<"excel" | "csv">("excel");
  const [exporting, setExporting] = useState(false);

  const openExportModal = (preferredScope?: "page" | "all" | "selected") => {
    if (preferredScope) {
      setExportScope(preferredScope);
    } else if (selectedIds.length > 0 || isAllMatchingSelected) {
      setExportScope("selected");
    } else {
      setExportScope("all");
    }
    setIsExportModalOpen(true);
  };

  const formatSubmissionsForExport = (data: FormSubmissionRecord[]) => {
    return data.map((sub) => {
      let formattedDate = "";
      try {
        if (sub.submittedAt) {
          const d = new Date(sub.submittedAt);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            });
          }
        }
      } catch {
        formattedDate = sub.submittedAt || "";
      }

      return {
        "Entry ID": sub.crmExternalKey || sub.id,
        "Submitted At (IST)": formattedDate,
        "Form Type": sub.formType,
        "Full Name": sub.fullName || "",
        "Firm / Business Name": sub.firmName || "",
        "Mobile (Raw)": sub.mobileRaw || "",
        "Mobile (Normalized)": sub.mobileNormalized || "",
        "Email": sub.email || "",
        "Location / Area": sub.location || "",
        "City": sub.city || "",
        "State": sub.state || "",
        "Pin Code": sub.pinCode || "",
        "Query Type": sub.queryType || sub.interestedIn || "",
        "Interested In": sub.interestedIn || "",
        "Line of Business": sub.lineOfBusiness || "",
        "User Message": sub.message || "",
        "Consent Given": sub.consentGiven ? "Yes" : "No",
        "Consent Version": sub.consentTextVersion || "",
        "Zoho Sync Status": sub.zohoSyncStatus,
        "Zoho Contact ID": sub.zohoContactId || "",
        "Zoho Contact Action": sub.zohoContactAction || "",
        "Zoho Enquiry ID": sub.zohoEnquiryId || "",
        "Zoho Enquiry Action": sub.zohoEnquiryAction || "",
        "Sync Attempts": sub.zohoSyncAttempts || 0,
        "Last Error Code": sub.zohoLastErrorCode || "",
        "Last Error Message": sub.zohoLastErrorMessage || "",
        "Last Sync Attempt (IST)": sub.zohoLastAttemptAt
          ? new Date(sub.zohoLastAttemptAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          : "",
        "Zoho Synced At (IST)": sub.zohoSyncedAt
          ? new Date(sub.zohoSyncedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          : "",
        "Source URL": sub.sourceUrl || "",
        "Referrer URL": sub.referrerUrl || "",
        "UTM Source": sub.utmSource || "",
        "UTM Medium": sub.utmMedium || "",
        "UTM Campaign": sub.utmCampaign || "",
        "UTM Content": sub.utmContent || "",
        "UTM Term": sub.utmTerm || "",
        "GCLID": sub.gclid || "",
        "FBCLID": sub.fbclid || "",
      };
    });
  };

  const executeExport = async (format: "csv" | "excel", scope: "page" | "all" | "selected") => {
    try {
      setExporting(true);

      let recordsToExport: FormSubmissionRecord[] = [];

      if (scope === "page") {
        recordsToExport = submissions;
      } else if (scope === "selected" && !isAllMatchingSelected) {
        if (selectedIds.length === 0) {
          showToast("error", "Please select at least one submission to export.");
          return;
        }
        // Fetch full records for all selected IDs
        const res = await api.getFormSubmissions({
          page: 1,
          limit: selectedIds.length,
          ids: selectedIds,
        });
        recordsToExport = res.data || [];
      } else {
        // Fetch all matching records for the current filter parameters
        const res = await api.getFormSubmissions({
          page: 1,
          limit: 50000,
          search: search || undefined,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
          formType: formTypeFilter !== "ALL" ? formTypeFilter : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
        recordsToExport = res.data || [];
      }

      if (recordsToExport.length === 0) {
        showToast("error", "No form submissions found to export.");
        return;
      }

      const formattedData = formatSubmissionsForExport(recordsToExport);
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // Auto-adjust column widths
      if (formattedData.length > 0) {
        const colWidths = Object.keys(formattedData[0]).map((key) => {
          const maxLen = Math.max(
            key.length,
            ...formattedData.slice(0, 100).map((row) => String((row as any)[key] || "").length)
          );
          return { wch: Math.min(Math.max(maxLen + 2, 12), 45) };
        });
        worksheet["!cols"] = colWidths;
      }

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Form Submissions");

      const dateStr = new Date().toISOString().slice(0, 10);
      const prefix = scope === "selected" ? "selected_" : scope === "page" ? `page_${page}_` : "all_";
      const filename = `form_submissions_${prefix}${dateStr}.${format === "excel" ? "xlsx" : "csv"}`;

      XLSX.writeFile(
        workbook,
        filename,
        format === "csv" ? { bookType: "csv" } : { bookType: "xlsx" }
      );

      showToast("success", `Successfully exported ${recordsToExport.length} submission(s) to ${filename}`);
      setIsExportModalOpen(false);
    } catch (err: any) {
      console.error("Export failed:", err);
      showToast("error", err.message || "Failed to export submissions");
    } finally {
      setExporting(false);
    }
  };

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
        limit,
        search: search || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        formType: formTypeFilter !== "ALL" ? formTypeFilter : undefined,
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
  }, [page, limit, search, statusFilter, formTypeFilter, startDate, endDate]);

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
    if (selectedIds.length === 0 && !isAllMatchingSelected) return;
    try {
      setIsBatchRetrying(true);
      let targetIds = selectedIds;
      if (isAllMatchingSelected) {
        // Fetch all matching non-synced submission IDs
        const res = await api.getFormSubmissions({
          page: 1,
          limit: 50000,
          search: search || undefined,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
          formType: formTypeFilter !== "ALL" ? formTypeFilter : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
        targetIds = (res.data || [])
          .filter((s) => s.zohoSyncStatus !== "SYNCED" && s.zohoSyncStatus !== "PROCESSING")
          .map((s) => s.id);
      }

      if (targetIds.length === 0) {
        showToast("error", "No eligible submissions found for retry.");
        return;
      }

      const res = await api.batchRetryFormSubmissions(targetIds, batchReason || "Batch admin UI retry");
      showToast("success", res.data?.message || `Queued ${targetIds.length} items for retry.`);
      clearSelection();
      setBatchReason("");
      loadSubmissions();
      loadHealth();
    } catch (err: any) {
      showToast("error", err.response?.data?.message || err.message || "Batch retry failed");
    } finally {
      setIsBatchRetrying(false);
    }
  };

  const isAllPageSelected =
    submissions.length > 0 && submissions.every((s) => selectedIds.includes(s.id));

  const toggleSelectAll = () => {
    if (isAllMatchingSelected || isAllPageSelected) {
      setSelectedIds([]);
      setIsAllMatchingSelected(false);
    } else {
      const pageIds = submissions.map((s) => s.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
      setIsAllMatchingSelected(false);
    }
  };

  const selectAllMatching = () => {
    setIsAllMatchingSelected(true);
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setIsAllMatchingSelected(false);
  };

  const toggleSelect = (id: string) => {
    setIsAllMatchingSelected(false);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const hasActiveFilters = Boolean(
    search || statusFilter !== "ALL" || formTypeFilter !== "ALL" || startDate || endDate
  );

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setFormTypeFilter("ALL");
    setStartDate("");
    setEndDate("");
    setPage(1);
    clearSelection();
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

          <div className="flex items-center gap-2 relative">
            {/* Export Button */}
            <button
              onClick={() => openExportModal()}
              disabled={exporting || loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Open Export Options"
            >
              <Download className={`w-4 h-4 ${exporting ? "animate-bounce" : ""}`} />
              <span>{exporting ? "Exporting..." : "Export"}</span>
            </button>

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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 flex-1">
              {/* Search Input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search Entry ID, Name, Mobile, City..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                    clearSelection();
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
                    clearSelection();
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
                    clearSelection();
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
                    clearSelection();
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
                    clearSelection();
                  }}
                  className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  title="End Date"
                />
              </div>
            </div>

            {/* Reset Filters button if any active */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-foreground/70 hover:text-foreground hover:bg-surface/80 transition-all cursor-pointer shrink-0 self-start lg:self-center"
                title="Reset all search & date filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Selected Actions Bar */}
          {(selectedIds.length > 0 || isAllMatchingSelected) && (
            <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-primary/5 p-3 rounded-xl animate-[fadeIn_0.15s_ease-out]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">
                  {isAllMatchingSelected
                    ? `All ${totalSubmissionsCount} submissions selected`
                    : `${selectedIds.length} submission(s) selected`}
                </span>
                <button
                  onClick={clearSelection}
                  className="text-[11px] text-foreground/60 hover:text-foreground underline cursor-pointer"
                >
                  Deselect all
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => openExportModal("selected")}
                  disabled={exporting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                  title="Export selected submissions"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export Selected</span>
                </button>

                <div className="h-4 w-px bg-border/80 mx-1 hidden sm:block" />

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

        {/* Multi-page selection notification banner (Gmail style) */}
        {isAllPageSelected && totalSubmissionsCount > submissions.length && (
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-center text-xs text-foreground animate-[fadeIn_0.15s_ease-out]">
            {!isAllMatchingSelected ? (
              <span>
                All <strong className="text-primary font-bold">{submissions.length}</strong> submissions on this page are selected.{" "}
                <button
                  onClick={selectAllMatching}
                  className="font-extrabold text-primary underline hover:opacity-80 cursor-pointer ml-1"
                >
                  Select all {totalSubmissionsCount} submissions matching the current filter
                </button>
              </span>
            ) : (
              <span>
                All <strong className="text-primary font-bold">{totalSubmissionsCount}</strong> submissions matching the current filter are selected.{" "}
                <button
                  onClick={clearSelection}
                  className="font-extrabold text-rose-600 underline hover:opacity-80 cursor-pointer ml-1"
                >
                  Clear selection
                </button>
              </span>
            )}
          </div>
        )}

        {/* Submissions Table */}
        <div className="bg-background border border-border rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border text-foreground/60 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="px-2 py-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        isAllMatchingSelected ||
                        (submissions.length > 0 && submissions.every((s) => selectedIds.includes(s.id)))
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-border text-primary focus:ring-primary cursor-pointer"
                      title={
                        isAllMatchingSelected || isAllPageSelected
                          ? "Deselect all"
                          : "Select all on this page"
                      }
                    />
                  </th>
                  <th className="px-2 py-3 max-w-30 2xl:max-w-none">Entry ID & Date</th>
                  <th className="px-2 py-3">Form Type</th>
                  <th className="px-2 py-3">Submitter Info</th>
                  <th className="px-2 py-3">Location</th>
                  <th className="px-2 py-3">CRM Sync Status</th>
                  <th className="px-2 py-3">Zoho Record IDs</th>
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
                          checked={isAllMatchingSelected || selectedIds.includes(sub.id)}
                          onChange={() => toggleSelect(sub.id)}
                          className="rounded border-border text-primary focus:ring-primary cursor-pointer"
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
          <div className="p-4 bg-surface border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs text-foreground/60 font-medium">
                Showing{" "}
                <strong className="text-foreground">
                  {totalSubmissionsCount === 0 ? 0 : (page - 1) * limit + 1}
                </strong>
                {" - "}
                <strong className="text-foreground">
                  {Math.min(page * limit, totalSubmissionsCount)}
                </strong>
                {" of "}
                <strong className="text-foreground">{totalSubmissionsCount}</strong> submissions
              </span>

              <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                <span className="text-[11px] font-semibold text-foreground/50">Rows per page:</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                    clearSelection();
                  }}
                  className="px-2.5 py-1 bg-background border border-border rounded-xl text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground/50 font-medium hidden sm:inline">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="p-2 rounded-xl bg-background border border-border text-xs font-bold hover:bg-surface disabled:opacity-40 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="p-2 rounded-xl bg-background border border-border text-xs font-bold hover:bg-surface disabled:opacity-40 cursor-pointer"
                title="Next Page"
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
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">Location / Area</span>
                          <p className="text-xs font-extrabold text-foreground">{selectedSubmission.location || "—"}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">City & State (Pin)</span>
                          <p className="text-xs font-extrabold text-foreground">
                            {[selectedSubmission.city, selectedSubmission.state].filter(Boolean).join(", ") || "—"} ({selectedSubmission.pinCode || "—"})
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                          <span className="text-[10px] text-foreground/50 font-bold uppercase">Query Type</span>
                          <p className="text-xs font-extrabold text-foreground">{selectedSubmission.queryType || selectedSubmission.interestedIn || "—"}</p>
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

        {/* Export Scope & Format Confirmation Modal */}
        {isExportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-background border border-border rounded-3xl w-full max-w-lg shadow-2xl animate-[fadeIn_0.15s_ease-out] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-foreground">Export Form Submissions</h3>
                    <p className="text-xs text-foreground/60">Choose which records and format you want to export.</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsExportModalOpen(false)}
                  disabled={exporting}
                  className="p-2 rounded-xl bg-surface hover:bg-surface/80 text-foreground cursor-pointer disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* 1. Scope Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-foreground/60 block">
                    1. Select Records to Export
                  </label>
                  <div className="space-y-2">
                    {/* Entire Dataset / All matching */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        exportScope === "all"
                          ? "bg-primary/5 border-primary shadow-xs"
                          : "bg-surface/50 border-border hover:bg-surface"
                      }`}
                    >
                      <input
                        type="radio"
                        name="exportScope"
                        checked={exportScope === "all"}
                        onChange={() => setExportScope("all")}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">Entire Dataset / All Matching Records</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-primary/10 text-primary">
                            {totalSubmissionsCount} records
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground/60">
                          {hasActiveFilters
                            ? "Exports all records that match the currently applied search & date filters across all pages."
                            : "Exports all form submission records currently stored in the database."}
                        </p>
                      </div>
                    </label>

                    {/* Current Page Only */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        exportScope === "page"
                          ? "bg-primary/5 border-primary shadow-xs"
                          : "bg-surface/50 border-border hover:bg-surface"
                      }`}
                    >
                      <input
                        type="radio"
                        name="exportScope"
                        checked={exportScope === "page"}
                        onChange={() => setExportScope("page")}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">Current Page Records Only</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-surface border border-border text-foreground/80">
                            {submissions.length} records (Page {page})
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground/60">
                          Exports only the {submissions.length} records displayed on the current active page.
                        </p>
                      </div>
                    </label>

                    {/* Selected Records */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                        selectedIds.length === 0 && !isAllMatchingSelected
                          ? "opacity-50 cursor-not-allowed bg-surface/20 border-border"
                          : exportScope === "selected"
                          ? "bg-primary/5 border-primary shadow-xs cursor-pointer"
                          : "bg-surface/50 border-border hover:bg-surface cursor-pointer"
                      }`}
                    >
                      <input
                        type="radio"
                        name="exportScope"
                        disabled={selectedIds.length === 0 && !isAllMatchingSelected}
                        checked={exportScope === "selected"}
                        onChange={() => setExportScope("selected")}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">Checked / Selected Records</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {isAllMatchingSelected ? totalSubmissionsCount : selectedIds.length} records
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground/60">
                          {selectedIds.length === 0 && !isAllMatchingSelected
                            ? "No records currently checked in the table."
                            : `Exports only the ${isAllMatchingSelected ? totalSubmissionsCount : selectedIds.length} specifically selected submission(s).`}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 2. Format Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-foreground/60 block">
                    2. Choose Export Format
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setExportFormat("excel")}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        exportFormat === "excel"
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-bold"
                          : "bg-surface border-border text-foreground hover:bg-surface/80 font-medium"
                      }`}
                    >
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Excel (.xlsx)</p>
                        <p className="text-[10px] text-foreground/50">Spreadsheet</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setExportFormat("csv")}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        exportFormat === "csv"
                          ? "bg-blue-500/10 border-blue-500/40 text-blue-700 dark:text-blue-400 font-bold"
                          : "bg-surface border-border text-foreground hover:bg-surface/80 font-medium"
                      }`}
                    >
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <p className="text-xs font-bold">CSV (.csv)</p>
                        <p className="text-[10px] text-foreground/50">Plain Text</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-border bg-surface/30 flex items-center justify-between gap-3 shrink-0">
                <span className="text-[11px] text-foreground/60 font-medium">
                  Will export:{" "}
                  <strong className="text-foreground">
                    {exportScope === "page"
                      ? submissions.length
                      : exportScope === "selected"
                      ? isAllMatchingSelected
                        ? totalSubmissionsCount
                        : selectedIds.length
                      : totalSubmissionsCount}
                  </strong>{" "}
                  record(s)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsExportModalOpen(false)}
                    disabled={exporting}
                    className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-foreground hover:bg-surface/80 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => executeExport(exportFormat, exportScope)}
                    disabled={
                      exporting ||
                      (exportScope === "selected" && selectedIds.length === 0 && !isAllMatchingSelected) ||
                      (exportScope === "all" && totalSubmissionsCount === 0) ||
                      (exportScope === "page" && submissions.length === 0)
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {exporting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Export</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
