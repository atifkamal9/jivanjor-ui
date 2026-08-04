"use client";

import { useCallback, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Loader2,
  FileSpreadsheet,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Category, Material } from "@/lib/api";
import { getUserRole } from "@/lib/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  entityType: "product" | "category";
  onSave: (row: ParsedRow) => Promise<any>;
  categories?: Category[];
  materials?: Material[];
}

export interface ParsedRow {
  // Products
  name?: string;
  description?: string;
  short_description?: string;
  category_name?: string;
  category_id?: string;
  material_name?: string;
  material_id?: string;
  theme_color?: string;
  metadata_tags?: string;
  pack_sizes?: string[];
  image?: string;
  // Categories
  parent_category_name?: string;
  parent_category?: string;
  icon?: string;
  // Internal
  _rowIndex: number;
  _warnings: string[];
}

type Step = "upload" | "select-sheet" | "preview" | "importing" | "done";

interface RowResult {
  row: ParsedRow;
  status: "pending" | "success" | "error";
  error?: string;
}

// ─── Templates ───────────────────────────────────────────────────────────────

const PRODUCT_TEMPLATE_HEADERS = [
  "name",
  "description",
  "category_name",
  "material_name",
  "theme_color",
  "metadata_tags",
  "pack_sizes",
  "image",
];

const CATEGORY_TEMPLATE_HEADERS = [
  "name",
  "description",
  "parent_category_name",
  "icon",
];

const PRODUCT_TEMPLATE_EXAMPLE = [
  "Champion Super",
  "High-strength adhesive for woodworking",
  "Wood Adhesives",
  "PVA",
  "#0083CB",
  "Water Resistant, Fast Setting",
  "1 Kg|5 Kg|20 Kg",
  "https://example.com/product.png",
];

const CATEGORY_TEMPLATE_EXAMPLE = [
  "Wood Adhesives",
  "Adhesives for all wood bonding applications",
  "",
  "Layers",
];

function downloadTemplate(entityType: "product" | "category") {
  const headers =
    entityType === "product"
      ? PRODUCT_TEMPLATE_HEADERS
      : CATEGORY_TEMPLATE_HEADERS;
  const example =
    entityType === "product"
      ? PRODUCT_TEMPLATE_EXAMPLE
      : CATEGORY_TEMPLATE_EXAMPLE;

  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  ws["!cols"] = headers.map(() => ({ wch: 24 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    ws,
    entityType === "product" ? "Products" : "Categories"
  );
  XLSX.writeFile(
    wb,
    entityType === "product"
      ? "products_template.xlsx"
      : "categories_template.xlsx"
  );
}

// Helper to extract value case-insensitively with flexible column names
function getRowValue(row: Record<string, any>, keys: string[]): string {
  const normalizedSearchKeys = keys.map((k) => k.toLowerCase().replace(/[^a-z0-9]/g, ""));
  for (const [rowKey, val] of Object.entries(row)) {
    const normRowKey = rowKey.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalizedSearchKeys.includes(normRowKey)) {
      if (val !== undefined && val !== null) {
        return String(val).trim();
      }
    }
  }
  return "";
}

function parseExcel(
  file: File,
  sheetName: string,
  entityType: "product" | "category",
  categories: Category[],
  materials: Material[]
): Promise<ParsedRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[sheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(ws, {
          defval: "",
          raw: false,
        });

        // Pre-extract all names in file for cross-referencing
        const allCategoryNamesInFile = rows.map((r) =>
          getRowValue(r, ["name", "category_name", "category", "categoryname", "title"])
        );

        const parsed: ParsedRow[] = rows.map((row, idx) => {
          const warnings: string[] = [];
          const result: ParsedRow = {
            _rowIndex: idx + 2,
            _warnings: warnings,
          };

          if (entityType === "product") {
            const name = getRowValue(row, ["name", "product_name", "product", "productname", "title"]);
            const description = getRowValue(row, ["description", "desc", "details"]);
            const shortDescription = getRowValue(row, ["short_description", "shortdescription", "short_desc", "shortdesc", "summary"]);
            const categoryName = getRowValue(row, ["category_name", "category", "categoryname", "cat_name", "catname"]);
            const materialName = getRowValue(row, ["material_name", "material", "materialname", "mat_name"]);

            if (!name) warnings.push("'name' is required");
            if (!description) warnings.push("'description' is required");
            if (!categoryName) warnings.push("'category_name' is required");

            const matchedCat = categories.find(
              (c) => c.name.toLowerCase() === categoryName.toLowerCase()
            );
            if (categoryName && !matchedCat)
              warnings.push(`Category "${categoryName}" not found in system`);

            const matchedMat = materials.find(
              (m) => m.name.toLowerCase() === materialName.toLowerCase()
            );

            const packSizesRaw = getRowValue(row, ["pack_sizes", "packsizes", "pack_size", "packsize", "packs", "sizes"]);

            result.name = name;
            result.description = description;
            result.short_description = shortDescription;
            result.category_name = categoryName;
            result.category_id = matchedCat?.id || "";
            result.material_name = materialName;
            result.material_id = matchedMat?.id || "";
            result.theme_color =
              getRowValue(row, ["theme_color", "themecolor", "theme", "color"]) || "#0498AA";
            result.metadata_tags = getRowValue(row, ["metadata_tags", "metadatatags", "tags", "metadata"]);
            result.pack_sizes = packSizesRaw
              ? packSizesRaw
                  .split("|")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];
            result.image = getRowValue(row, ["image", "image_url", "imageurl", "photo", "img"]);
          } else {
            const name = getRowValue(row, ["name", "category_name", "category", "categoryname", "title"]);
            const description = getRowValue(row, ["description", "desc", "details"]);
            const parentName = getRowValue(row, ["parent_category_name", "parent_category", "parent", "parent_name", "parentcategoryname", "parentcategory"]);
            const icon = getRowValue(row, ["icon", "icon_name", "iconname"]);

            if (!name) warnings.push("'name' is required");

            const matchedParentDb = categories.find(
              (c) => c.name.toLowerCase() === parentName.toLowerCase()
            );
            const matchedParentFile = allCategoryNamesInFile.some(
              (n) => n && n.toLowerCase() === parentName.toLowerCase()
            );

            if (parentName && !matchedParentDb && !matchedParentFile)
              warnings.push(`Parent category "${parentName}" not found in database or file`);

            result.name = name;
            result.description = description;
            result.parent_category_name = parentName;
            result.parent_category = matchedParentDb?.id || "";
            result.icon = icon;
          }

          return result;
        });

        resolve(parsed);
      } catch (err: any) {
        reject(new Error("Failed to parse Excel file: " + err.message));
      }
    };
    reader.onerror = () => reject(new Error("File could not be read"));
    reader.readAsArrayBuffer(file);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BulkUploadModal({
  isOpen,
  onClose,
  onComplete,
  entityType,
  onSave,
  categories = [],
  materials = [],
}: BulkUploadModalProps) {
  const [step, setStep] = useState<Step>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [results, setResults] = useState<RowResult[]>([]);
  const [progress, setProgress] = useState(0);
  // Sheet selection
  const [workbookFile, setWorkbookFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const entityLabel =
    entityType === "product" ? "Products" : "Categories";

  const reset = () => {
    setStep("upload");
    setIsDragging(false);
    setFileName("");
    setParseError("");
    setRows([]);
    setResults([]);
    setProgress(0);
    setWorkbookFile(null);
    setSheetNames([]);
    setSelectedSheet("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setParseError("Please upload an Excel file (.xlsx or .xls).");
      return;
    }
    setParseError("");
    setFileName(file.name);
    setWorkbookFile(file);

    // Read workbook just to get sheet names
    const buffer = await file.arrayBuffer();
    const wb = XLSX.read(new Uint8Array(buffer), { type: "array" });
    const names = wb.SheetNames;

    if (names.length === 0) {
      setParseError("The Excel file contains no sheets.");
      return;
    }

    if (names.length === 1) {
      // Only one sheet — parse it directly
      try {
        const parsed = await parseExcel(file, names[0], entityType, categories, materials);
        if (parsed.length === 0) {
          setParseError("The sheet appears to be empty. Add rows below the header row.");
          return;
        }
        setSelectedSheet(names[0]);
        setRows(parsed);
        setStep("preview");
      } catch (err: any) {
        setParseError(err.message || "Failed to parse Excel file.");
      }
    } else {
      // Multiple sheets — let user choose
      setSheetNames(names);
      setSelectedSheet(names[0]);
      setStep("select-sheet");
    }
  };

  const handleSheetConfirm = async () => {
    if (!workbookFile || !selectedSheet) return;
    setParseError("");
    try {
      const parsed = await parseExcel(workbookFile, selectedSheet, entityType, categories, materials);
      if (parsed.length === 0) {
        setParseError(`The sheet "${selectedSheet}" appears to be empty. Add rows below the header row.`);
        return;
      }
      setRows(parsed);
      setStep("preview");
    } catch (err: any) {
      setParseError(err.message || "Failed to parse the selected sheet.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories, materials]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleImport = async () => {
    const validRows = rows.filter((r) => r._warnings.length === 0);
    const initialResults: RowResult[] = validRows.map((r) => ({
      row: r,
      status: "pending",
    }));
    setResults(initialResults);
    setStep("importing");
    setProgress(0);

    let completed = 0;
    const updated = [...initialResults];

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        await onSave(row);
        updated[i] = { ...updated[i], status: "success" };
      } catch (err: any) {
        updated[i] = {
          ...updated[i],
          status: "error",
          error:
            err?.response?.data?.message ||
            err?.message ||
            "Unknown error",
        };
      }
      completed++;
      setProgress(Math.round((completed / validRows.length) * 100));
      setResults([...updated]);
    }

    setStep("done");
  };

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const warningRows = rows.filter((r) => r._warnings.length > 0);
  const validRowCount = rows.filter((r) => r._warnings.length === 0).length;

  if (!isOpen) return null;

  if (getUserRole() !== "SUPER_ADMIN") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
        <div className="relative w-full max-w-md flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-zinc-800 text-center space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center mx-auto text-red-600">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-zinc-50">
              Access Restricted
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
              Bulk Upload feature is restricted to <strong>Super Admin</strong> users only.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <FileSpreadsheet className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">
                Bulk Upload {entityLabel}
              </h2>
              <p className="text-xs text-gray-400 dark:text-zinc-500 font-semibold">
                Import multiple {entityLabel.toLowerCase()} from an Excel file
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 px-6 py-3 bg-gray-50/60 dark:bg-zinc-950/40 border-b border-gray-100 dark:border-zinc-800 shrink-0 overflow-x-auto">
          {(() => {
            // Build the display steps: include select-sheet only when we detected multiple sheets
            const displaySteps: { key: Step; label: string }[] = [
              { key: "upload", label: "Upload" },
              ...(sheetNames.length > 1 ? [{ key: "select-sheet" as Step, label: "Select Sheet" }] : []),
              { key: "preview", label: "Preview" },
              { key: "importing", label: "Import" },
              { key: "done", label: "Done" },
            ];
            const stepOrder = displaySteps.findIndex((s) => s.key === step);
            return displaySteps.map((s, i) => {
              const isActive = s.key === step;
              const isPast = i < stepOrder;
              return (
                <div key={s.key} className="flex items-center gap-2 shrink-0">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-black transition-colors ${
                      isActive
                        ? "bg-red-600 text-white"
                        : isPast
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500"
                    }`}
                  >
                    {isPast ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-bold whitespace-nowrap ${isActive ? "text-gray-900 dark:text-zinc-100" : "text-gray-400 dark:text-zinc-500"}`}>
                    {s.label}
                  </span>
                  {i < displaySteps.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-gray-300 dark:text-zinc-600 mx-1" />
                  )}
                </div>
              );
            });
          })()}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* STEP: Upload */}
          {step === "upload" && (
            <div className="space-y-5">
              {/* Template Banner */}
              <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl px-5 py-4">
                <div>
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
                    Start with a template
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                    Download a pre-filled Excel template with the correct column headers and an example row
                  </p>
                </div>
                <button
                  onClick={() => downloadTemplate(entityType)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 ml-4"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Template
                </button>
              </div>

              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all ${
                  isDragging
                    ? "border-red-500 bg-red-50/60 dark:bg-red-950/20 scale-[1.01]"
                    : "border-gray-200 dark:border-zinc-700 hover:border-red-400 hover:bg-gray-50/60 dark:hover:bg-zinc-800/30"
                }`}
              >
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? "bg-red-100 dark:bg-red-950/40" : "bg-gray-100 dark:bg-zinc-800"}`}>
                  <Upload className={`h-6 w-6 transition-colors ${isDragging ? "text-red-600" : "text-gray-400 dark:text-zinc-500"}`} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-extrabold text-gray-700 dark:text-zinc-200">
                    {isDragging ? "Drop your Excel file here" : "Drag & drop your Excel file here"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                    or click to browse — accepts <strong>.xlsx</strong> and <strong>.xls</strong> only
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {parseError && (
                <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl px-4 py-3">
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300 font-semibold">{parseError}</p>
                </div>
              )}

              {/* Column Reference Table */}
              <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                <div className="bg-gray-50 dark:bg-zinc-900/60 px-4 py-2.5 border-b border-gray-100 dark:border-zinc-800">
                  <span className="text-xs font-extrabold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                    Expected Column Headers
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-zinc-900/30 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                        <th className="px-4 py-2 text-left">Column</th>
                        <th className="px-4 py-2 text-left">Required</th>
                        <th className="px-4 py-2 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {(() => {
                        const colDefs = entityType === "product" ? [
                          { col: "name", req: true, note: "Product name" },
                          { col: "description", req: true, note: "Full detailed product description" },
                          { col: "short_description", req: false, note: "Short overview description (max 80 chars)" },
                          { col: "category_name", req: true, note: "Must match an existing category name exactly" },
                          { col: "material_name", req: false, note: "Must match an existing material name" },
                          { col: "theme_color", req: false, note: "Hex colour e.g. #0083CB (defaults to #0498AA)" },
                          { col: "metadata_tags", req: false, note: "Comma-separated tags" },
                          { col: "pack_sizes", req: false, note: "Pipe-separated e.g. 1 Kg|5 Kg|20 Kg" },
                          { col: "image", req: false, note: "Full image URL" },
                        ] : [
                          { col: "name", req: true, note: "Category name" },
                          { col: "description", req: false, note: "Plain text description" },
                          { col: "parent_category_name", req: false, note: "Must match an existing top-level category name" },
                          { col: "icon", req: false, note: "Lucide icon key e.g. Layers" },
                        ];
                        return colDefs.map((r) => (
                          <tr key={r.col} className="hover:bg-gray-50/30 dark:hover:bg-zinc-800/20">
                            <td className="px-4 py-2 font-mono font-bold text-gray-700 dark:text-zinc-300">{r.col}</td>
                            <td className="px-4 py-2">{r.req ? <span className="text-red-600 font-black">Yes</span> : <span className="text-gray-400">No</span>}</td>
                            <td className="px-4 py-2 text-gray-500 dark:text-zinc-400">{r.note}</td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP: Select Sheet */}
          {step === "select-sheet" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800 rounded-2xl px-4 py-3">
                <FileSpreadsheet className="h-4 w-4 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-gray-700 dark:text-zinc-300 truncate">{fileName}</p>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 font-semibold mt-0.5">
                    {sheetNames.length} sheets detected — choose one to import
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-extrabold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                  Available Sheets
                </p>
                <div className="space-y-2">
                  {sheetNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => setSelectedSheet(name)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        selectedSheet === name
                          ? "border-red-500 bg-red-50/60 dark:bg-red-950/20"
                          : "border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-900"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full border-2 shrink-0 transition-all ${
                          selectedSheet === name
                            ? "border-red-500 bg-red-500"
                            : "border-gray-300 dark:border-zinc-600"
                        }`}
                      >
                        {selectedSheet === name && (
                          <div className="h-full w-full flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${selectedSheet === name ? "text-red-700 dark:text-red-400" : "text-gray-800 dark:text-zinc-200"}`}>
                          {name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 font-semibold mt-0.5">
                          Sheet tab
                        </p>
                      </div>
                      {selectedSheet === name && (
                        <CheckCircle className="h-4 w-4 text-red-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {parseError && (
                <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl px-4 py-3">
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300 font-semibold">{parseError}</p>
                </div>
              )}
            </div>
          )}

          {/* STEP: Preview */}
          {step === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700 dark:text-zinc-300 truncate max-w-xs">{fileName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 dark:text-zinc-400">
                    {rows.length} row{rows.length !== 1 ? "s" : ""} found
                  </span>
                  {warningRows.length > 0 && (
                    <span className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-black border border-amber-200 dark:border-amber-900/40">
                      {warningRows.length} warning{warningRows.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              {warningRows.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-2xl px-4 py-3 space-y-1">
                  <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Rows with warnings will be skipped during import
                  </p>
                  {warningRows.map((r) => (
                    <p key={r._rowIndex} className="text-xs text-amber-600 dark:text-amber-400">
                      Row {r._rowIndex}: {r._warnings.join(", ")}
                    </p>
                  ))}
                </div>
              )}

              <div className="rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-xs min-w-max">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-50 dark:bg-zinc-900 text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-zinc-500 border-b border-gray-100 dark:border-zinc-800">
                        <th className="px-4 py-2.5 text-left w-10">#</th>
                        {entityType === "product" ? (
                          <>
                            <th className="px-4 py-2.5 text-left">Name</th>
                            <th className="px-4 py-2.5 text-left">Description</th>
                            <th className="px-4 py-2.5 text-left">Category</th>
                            <th className="px-4 py-2.5 text-left">Material</th>
                            <th className="px-4 py-2.5 text-left">Theme</th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-2.5 text-left">Name</th>
                            <th className="px-4 py-2.5 text-left">Description</th>
                            <th className="px-4 py-2.5 text-left">Parent</th>
                            <th className="px-4 py-2.5 text-left">Icon</th>
                          </>
                        )}
                        <th className="px-4 py-2.5 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {rows.map((row) => {
                        const hasWarning = row._warnings.length > 0;
                        return (
                          <tr key={row._rowIndex} className={hasWarning ? "bg-amber-50/60 dark:bg-amber-950/10" : "hover:bg-gray-50/30 dark:hover:bg-zinc-800/20"}>
                            <td className="px-4 py-2.5 text-gray-400 dark:text-zinc-500 font-semibold">{row._rowIndex}</td>
                            {entityType === "product" ? (
                              <>
                                <td className="px-4 py-2.5 font-bold text-gray-800 dark:text-zinc-200 max-w-[140px] truncate">
                                  {row.name || <span className="text-red-500">—</span>}
                                </td>
                                <td className="px-4 py-2.5 text-gray-500 dark:text-zinc-400 max-w-[160px] truncate">{row.description || "—"}</td>
                                <td className="px-4 py-2.5">
                                  {row.category_id ? (
                                    <span className="px-2 py-0.5 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 font-semibold border border-green-200 dark:border-green-900/40">{row.category_name}</span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 font-semibold border border-red-200 dark:border-red-900/40">{row.category_name || "—"}</span>
                                  )}
                                </td>
                                <td className="px-4 py-2.5 text-gray-500 dark:text-zinc-400">{row.material_name || "—"}</td>
                                <td className="px-4 py-2.5">
                                  <div className="flex items-center gap-1.5">
                                    <div className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: row.theme_color || "#0498AA" }} />
                                    <span className="text-gray-400 dark:text-zinc-500 font-mono">{row.theme_color || "#0498AA"}</span>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-2.5 font-bold text-gray-800 dark:text-zinc-200 max-w-[140px] truncate">
                                  {row.name || <span className="text-red-500">—</span>}
                                </td>
                                <td className="px-4 py-2.5 text-gray-500 dark:text-zinc-400 max-w-[160px] truncate">{row.description || "—"}</td>
                                <td className="px-4 py-2.5 text-gray-500 dark:text-zinc-400">
                                  {row.parent_category_name || <span className="text-gray-300 dark:text-zinc-600">Root</span>}
                                </td>
                                <td className="px-4 py-2.5 text-gray-500 dark:text-zinc-400 font-mono">{row.icon || "—"}</td>
                              </>
                            )}
                            <td className="px-4 py-2.5">
                              {hasWarning ? (
                                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                                  <AlertTriangle className="h-3 w-3" /> Skip
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                                  <CheckCircle className="h-3 w-3" /> Ready
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STEP: Importing */}
          {step === "importing" && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <Loader2 className="h-8 w-8 text-red-500 animate-spin mx-auto" />
                <p className="text-sm font-extrabold text-gray-800 dark:text-zinc-200">Importing {entityLabel}…</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">
                  {results.filter((r) => r.status !== "pending").length} of {results.length} processed
                </p>
              </div>

              <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-900/50 rounded-xl px-4 py-2.5">
                    {r.status === "pending" ? (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300 dark:border-zinc-600 shrink-0" />
                    ) : r.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex-1 truncate">{r.row.name}</span>
                    {r.status === "error" && (
                      <span className="text-[10px] text-red-500 dark:text-red-400 font-semibold max-w-[160px] truncate">{r.error}</span>
                    )}
                    {r.status === "pending" && (
                      <Loader2 className="h-3.5 w-3.5 text-gray-400 animate-spin shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP: Done */}
          {step === "done" && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                {errorCount === 0 ? (
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                ) : successCount === 0 ? (
                  <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                ) : (
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
                )}
                <p className="text-base font-extrabold text-gray-900 dark:text-zinc-50">Import Complete</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold">
                    <CheckCircle className="h-4 w-4" /> {successCount} succeeded
                  </span>
                  {errorCount > 0 && (
                    <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold">
                      <XCircle className="h-4 w-4" /> {errorCount} failed
                    </span>
                  )}
                </div>
              </div>

              {errorCount > 0 && (
                <div className="rounded-2xl border border-red-200 dark:border-red-900/40 overflow-hidden">
                  <div className="bg-red-50 dark:bg-red-950/20 px-4 py-2.5 border-b border-red-200 dark:border-red-900/40">
                    <span className="text-xs font-extrabold text-red-700 dark:text-red-400 uppercase tracking-wider">Failed Rows</span>
                  </div>
                  <div className="divide-y divide-red-100 dark:divide-red-900/20 max-h-48 overflow-y-auto">
                    {results.filter((r) => r.status === "error").map((r, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3">
                        <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                            {r.row.name} <span className="text-gray-400">(row {r.row._rowIndex})</span>
                          </p>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{r.error}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900">
          {step === "upload" && (
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step === "select-sheet" && (
            <>
              <button
                onClick={() => { setSheetNames([]); setSelectedSheet(""); setFileName(""); setWorkbookFile(null); setStep("upload"); }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <p className="text-xs text-gray-400 dark:text-zinc-500 font-semibold">
                  Sheet: <strong className="text-gray-700 dark:text-zinc-300">{selectedSheet}</strong>
                </p>
                <button
                  onClick={handleSheetConfirm}
                  disabled={!selectedSheet}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Preview Sheet →
                </button>
              </div>
            </>
          )}

          {step === "preview" && (
            <>
              <button
                onClick={() => {
                  setRows([]);
                  if (sheetNames.length > 1) {
                    setStep("select-sheet");
                  } else {
                    setFileName("");
                    setWorkbookFile(null);
                    setStep("upload");
                  }
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <p className="text-xs text-gray-400 dark:text-zinc-500 font-semibold">
                  {validRowCount} row{validRowCount !== 1 ? "s" : ""} will be imported
                </p>
                <button
                  onClick={handleImport}
                  disabled={validRowCount === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm &amp; Import
                </button>
              </div>
            </>
          )}

          {step === "importing" && (
            <p className="text-xs text-gray-400 dark:text-zinc-500 font-semibold mx-auto">
              Please wait — do not close this window…
            </p>
          )}

          {step === "done" && (
            <button
              onClick={() => { handleClose(); onComplete(); }}
              className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/10 transition-all cursor-pointer"
            >
              Close &amp; Refresh
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
