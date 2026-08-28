"use client";

import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api } from "@/lib/api";
import { savePincodeMap, getPincodeMetadata, getStoredPincodes } from "@/lib/pincodeStore";
import * as XLSX from "xlsx";
import {
  MapPin,
  Upload,
  Download,
  Search,
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Database,
  Calendar,
} from "lucide-react";

export interface ParsedPinCodeRow {
  pinCode: string;
  location?: string;
  city: string;
  state: string;
  isValid: boolean;
  error?: string;
}

export default function AdminPincodesPage() {
  const [loading, setLoading] = useState(true);
  const [pincodes, setPincodes] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;

  // Excel Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedPinCodeRow[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPincodes(page, search);
  }, [page]);

  const loadPincodes = async (currentPage = 1, searchQuery = "") => {
    setLoading(true);
    try {
      // Try backend API first
      const res = await api.getPinCodes({ page: currentPage, limit, search: searchQuery });
      if (res && res.status === "success") {
        setPincodes(res.records || []);
        setTotalCount(res.total || 0);
        setTotalPages(res.totalPages || 1);
        setLastUpdated(res.updatedAt || null);

        // Sync local store if server returned records
        if (currentPage === 1 && !searchQuery && res.records && res.records.length > 0) {
          savePincodeMap(res.records);
        }
      } else {
        fallbackToLocalStorage();
      }
    } catch (err) {
      console.warn("Backend pincode API unavailable, falling back to local storage:", err);
      fallbackToLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const fallbackToLocalStorage = () => {
    const meta = getPincodeMetadata();
    const map = getStoredPincodes();
    let entries = Object.entries(map).map(([pinCode, info]) => ({
      pinCode,
      location: info.location || null,
      city: info.city,
      state: info.state,
    }));

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      entries = entries.filter(
        (item) =>
          item.pinCode.toLowerCase().includes(q) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          item.city.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q)
      );
    }

    setTotalCount(entries.length);
    setTotalPages(Math.ceil(entries.length / limit) || 1);
    const start = (page - 1) * limit;
    setPincodes(entries.slice(start, start + limit));
    setLastUpdated(meta.updatedAt);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    loadPincodes(1, val);
  };

  // Excel File Parsing (Supports Pin Code, Location, District, State)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processExcelFile(file);
  };

  const processExcelFile = (file: File) => {
    setFileName(file.name);
    setIsProcessingFile(true);
    setUploadSuccessMsg("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const parsed: ParsedPinCodeRow[] = [];

        rawJson.forEach((row) => {
          // Normalize column headers
          const pinCodeRaw =
            row["Pin Code"] ||
            row["PIN Code"] ||
            row["Pincode"] ||
            row["PIN"] ||
            row["pincode"] ||
            row["pin_code"] ||
            "";
          const locationRaw =
            row["Location"] ||
            row["location"] ||
            row["Area"] ||
            row["Post Office"] ||
            row["PostOffice"] ||
            "";
          const districtRaw =
            row["District"] ||
            row["City"] ||
            row["district"] ||
            row["city"] ||
            "";
          const stateRaw =
            row["State"] ||
            row["state"] ||
            "";

          const cleanPin = String(pinCodeRaw).trim().replace(/\D/g, "");
          const city = String(districtRaw || locationRaw || "").trim();
          const state = String(stateRaw || "").trim();
          const location = String(locationRaw || "").trim();

          const isValid = cleanPin.length === 6 && city.length > 0;
          let error = "";
          if (cleanPin.length !== 6) error = "Invalid PIN (Must be 6 digits)";
          else if (!city) error = "Missing District/City";

          parsed.push({
            pinCode: cleanPin || String(pinCodeRaw),
            location: location || undefined,
            city: city || "Unknown",
            state: state || "N/A",
            isValid,
            error,
          });
        });

        setParsedRows(parsed);
      } catch (err: any) {
        alert("Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.");
      } finally {
        setIsProcessingFile(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleUploadConfirm = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert("No valid PIN code records found in the uploaded file.");
      return;
    }

    setIsUploading(true);
    try {
      const recordsToSave = validRows.map((r) => ({
        pinCode: r.pinCode,
        location: r.location || null,
        city: r.city,
        state: r.state,
      }));

      // 1. Save directly to Database FIRST (Supabase PostgreSQL as Single Source of Truth)
      const dbResult = await api.replacePinCodes(recordsToSave);

      // 2. Update local browser store ONLY AFTER database write succeeds
      savePincodeMap(recordsToSave);

      setUploadSuccessMsg(`Successfully saved ${dbResult.count || validRows.length} PIN codes to Supabase Database!`);
      setTimeout(() => {
        setIsModalOpen(false);
        setParsedRows([]);
        setFileName("");
        setUploadSuccessMsg("");
        setPage(1);
        loadPincodes(1, search);
      }, 1500);
    } catch (err: any) {
      console.error("Database save error:", err);
      alert("Failed to save PIN codes to Database: " + (err.response?.data?.message || err.message || "Database connection error"));
    } finally {
      setIsUploading(false);
    }
  };

  // Download Sample Excel Template
  const handleDownloadSample = () => {
    const sampleData = [
      {
        "Pin Code": "110001",
        Location: "Baroda House",
        District: "NEW DELHI",
        State: "DELHI",
      },
      {
        "Pin Code": "110002",
        Location: "AGCR",
        District: "CENTRAL",
        State: "DELHI",
      },
      {
        "Pin Code": "400001",
        Location: "Fort",
        District: "MUMBAI",
        State: "MAHARASHTRA",
      },
      {
        "Pin Code": "560001",
        Location: "MG Road",
        District: "BENGALURU",
        State: "KARNATAKA",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pin Code Master");
    XLSX.writeFile(workbook, "Jivanjor_Pincode_Master_Sample.xlsx");
  };

  // Export Current Data to Excel
  const handleExportData = () => {
    const map = getStoredPincodes();
    let records = Object.entries(map).map(([pinCode, info]) => ({
      "Pin Code": pinCode,
      Location: info.location || "",
      District: info.city,
      State: info.state,
    }));

    if (records.length === 0 && pincodes.length > 0) {
      records = pincodes.map((p) => ({
        "Pin Code": p.pinCode,
        Location: p.location || "",
        District: p.city,
        State: p.state,
      }));
    }

    if (records.length === 0) {
      alert("No PIN code records available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pin Code Master");
    XLSX.writeFile(workbook, `Jivanjor_Pincodes_Master_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const validCountInModal = parsedRows.filter((r) => r.isValid).length;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
              PIN Code Master Mapping
            </h1>
            <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Upload and manage PIN code postal locations & city mappings
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Sample Template</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Export Excel</span>
            </button>
            <button
              onClick={() => {
                setIsModalOpen(true);
                setParsedRows([]);
                setFileName("");
                setUploadSuccessMsg("");
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/10 cursor-pointer transition-all hover:shadow-lg self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Sheet</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 transition-colors duration-300">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                Total Mapped PIN Codes
              </p>
              <p className="text-2xl font-black text-gray-900 dark:text-zinc-50">
                {totalCount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 transition-colors duration-300">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                Last Master Update
              </p>
              <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 mt-0.5">
                {lastUpdated
                  ? new Date(lastUpdated).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                  : "Not yet updated"}
              </p>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-4 transition-colors duration-300">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                System Mode
              </p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Master Lookup
              </p>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by PIN Code, District, Location, or State..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
            <span>Showing page {page} of {totalPages}</span>
            <button
              onClick={() => loadPincodes(page, search)}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              title="Refresh list"
            >
              <RefreshCw className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#772571] animate-spin" />
              <p className="text-sm text-zinc-500">Loading PIN code master records...</p>
            </div>
          ) : pincodes.length === 0 ? (
            <div className="py-16 text-center space-y-4 px-4">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                  No PIN codes found
                </h3>
                <p className="text-sm text-zinc-500 max-w-md mx-auto">
                  {search
                    ? `No matching records found for "${search}". Try clearing the search.`
                    : "No master PIN code records uploaded yet. Click below to upload your first Excel sheet."}
                </p>
              </div>
              {!search && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2.5 bg-linear-to-r from-[#FF0009] to-[#772571] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all inline-flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Master Excel Sheet</span>
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                      <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">#</th>
                      <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">PIN Code</th>
                      <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Location / Area</th>
                      <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">District / City</th>
                      <th className="p-5 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {pincodes.map((row, idx) => (
                      <tr
                        key={row.pinCode + idx}
                        className="hover:bg-gray-50/60 dark:hover:bg-zinc-800/40 transition-colors border-b border-gray-100 dark:border-zinc-800/60"
                      >
                        <td className="p-5 text-gray-400 dark:text-zinc-500 font-mono text-xs">
                          {(page - 1) * limit + idx + 1}
                        </td>
                        <td className="p-5 font-black font-mono text-gray-900 dark:text-zinc-50 text-base">
                          {row.pinCode}
                        </td>
                        <td className="p-5 text-sm font-semibold text-gray-700 dark:text-zinc-300">
                          {row.location || <span className="text-gray-400 italic font-normal">—</span>}
                        </td>
                        <td className="p-5 text-sm font-bold text-red-600 dark:text-red-400">
                          {row.city}
                        </td>
                        <td className="p-5 text-sm font-semibold text-gray-600 dark:text-zinc-400">
                          {row.state}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-sm">
                  <p className="text-xs text-zinc-500">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, totalCount)} of {totalCount} records
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold px-2">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Excel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-950/60 text-[#772571] rounded-xl">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    Upload PIN Code Master Excel
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Re-uploading will cleanly replace all existing PIN code records.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dropzone */}
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#772571] dark:hover:border-[#772571] rounded-2xl p-8 text-center bg-zinc-50/50 dark:bg-zinc-800/30 transition-all cursor-pointer space-y-3"
              >
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 text-[#772571] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {fileName ? fileName : "Click or drag Excel file here"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Supports <span className="font-semibold text-zinc-700 dark:text-zinc-300">.xlsx, .xls, .csv</span> format
                  </p>
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  Expected Headers: <code className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-[11px]">Pin Code</code>, <code className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-[11px]">Location</code>, <code className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-[11px]">District</code>, <code className="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded text-[11px]">State</code>
                </div>
              </div>

              {isProcessingFile && (
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-[#772571]" />
                  <span>Processing and parsing Excel rows...</span>
                </div>
              )}

              {/* Upload Success Message */}
              {uploadSuccessMsg && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              {/* Parsed Preview Summary */}
              {parsedRows.length > 0 && !uploadSuccessMsg && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-800/70 rounded-xl text-xs font-semibold">
                    <span>Total Rows Parsed: {parsedRows.length}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Valid Rows: {validCountInModal}
                    </span>
                    {parsedRows.length - validCountInModal > 0 && (
                      <span className="text-amber-600 dark:text-amber-400">
                        Invalid/Skipped: {parsedRows.length - validCountInModal}
                      </span>
                    )}
                  </div>

                  {/* Warning banner */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Warning:</strong> Confirming will cleanly <strong>replace</strong> all currently stored PIN code records with these {validCountInModal} valid entries.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-auto">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={validCountInModal === 0 || isUploading}
                onClick={handleUploadConfirm}
                className="px-6 py-2.5 bg-linear-to-r from-[#FF0009] to-[#772571] text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Replacing Dataset...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Replace ({validCountInModal})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
