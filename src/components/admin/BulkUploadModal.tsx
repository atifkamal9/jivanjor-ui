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
  // Core Product & Configuration Fields
  name?: string;
  category_name?: string;
  category_id?: string;
  categories?: string[];
  material_name?: string;
  material_id?: string;
  description?: string;
  short_description?: string;
  slug?: string;
  theme_color?: string;
  image?: string;
  backgroundImage?: string;
  pack_sizes?: string[];
  overview_bullets?: { text: string; icon: string }[];
  metadata_tags?: string;

  // Technical Specs & Dynamic Content Sections
  tech_specs?: { key: string; value: string }[];
  techSpecsDescription?: string;
  usps?: { title: string; description: string; icon: string }[];
  applications?: { title: string; description: string; imageA: string; imageB: string; link?: string }[];
  appsTitle?: string;
  appsDescription?: string;
  techResourceTitle?: string;
  techResourceDescription?: string;
  documentUrl?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  videoTitle?: string;
  videoDescription?: string;
  relatedProducts?: string[];
  relatedTitle?: string;

  // SEO Metadata
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  seo_image?: string;

  // Category Entity Fields
  parent_category_name?: string;
  parent_category?: string;
  icon?: string;
  tagline?: string;
  categoryTitle?: string;
  categoryDescription?: string;
  resourcesTitle?: string;
  resourcesDescription?: string;
  heroImage?: string;
  researchTitle?: string;
  researchDescription?: string;
  researchCtaText?: string;
  researchCtaLink?: string;
  researchImage1?: string;
  researchImage2?: string;

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

// ─── Templates ───────────────────────────────────────────────────────────────

const PRODUCT_TEMPLATE_HEADERS = [
  "name",
  "category_name",
  "description",
  "short_description",
  "slug",
  "categories",
  "themeColor",
  "image",
  "backgroundImage",
  "packSizes",
  "overviewBullets",
  "metadata",
  "techSpecs",
  "techSpecsDescription",
  "usps",
  "applications",
  "appsTitle",
  "appsDescription",
  "techResourceTitle",
  "techResourceDescription",
  "documentUrl",
  "videoUrl",
  "videoThumbnail",
  "videoTitle",
  "videoDescription",
  "relatedProducts",
  "relatedTitle",
  "meta_title",
  "meta_description",
  "canonical_url",
  "seo_image",
];

const CATEGORY_TEMPLATE_HEADERS = [
  "name",
  "parent_category_name",
  "description",
  "tagline",
  "slug",
  "icon",
  "categoryTitle",
  "categoryDescription",
  "resourcesTitle",
  "resourcesDescription",
  "heroImage",
  "researchTitle",
  "researchDescription",
  "researchCtaText",
  "researchCtaLink",
  "researchImage1",
  "researchImage2",
  "meta_title",
  "meta_description",
  "canonical_url",
  "seo_image",
];

const PRODUCT_TEMPLATE_EXAMPLE = [
  "Jivanjor Aquabond",
  "Water Resistant",
  "High-strength water-resistant D3 adhesive for premium woodworking and furniture joinery.",
  "High-strength D3 water-resistant wood adhesive.",
  "jivanjor-aquabond",
  "Woodworking Adhesives | Furniture & Woodwork",
  "#0083CB",
  "https://example.com/aquabond.png",
  "https://example.com/aquabond-hero.png",
  "500g | 1kg | 2kg | 5kg | 10kg | 20kg",
  "Water Resistant; Anti-Bubble Technology; Super Fast Setting - 1 Hour",
  "wood glue, waterproof, d3 grade",
  "Appearance: Milk White | Viscosity: 25000 - 35000 cPs | Solids: 50-53% | Coverage: 60-70 Sqft/Kg",
  "Aquabond provides excellent water-resistance and superior flow for smooth application.",
  "Faster Site Rotation: Sets in 1 hour | Smooth Spreadability: Reduces wastage | Solvent-Free Safety: Water-based formulation",
  "Laminate to Plywood Bonding: Suitable for bonding laminate and plywood where strong adhesion is required; Wood to Wood Joinery: Designed for finger jointing, structural dowelling, and solid frames",
  "Engineered for the Task at Hand",
  "Explore where Jivanjor Aquabond fits across woodworking applications.",
  "Technical Data Sheet",
  "Download official technical documentation and safety guidelines.",
  "https://example.com/aquabond-tds.pdf",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://example.com/video-thumb.jpg",
  "See Product in Action",
  "Watch trade professionals achieve flawless bonding in record time.",
  "Watershield | Champion Super",
  "Related Products",
  "Jivanjor Aquabond - D3 Waterproof Wood Adhesive",
  "Buy Jivanjor Aquabond high-strength D3 waterproof wood adhesive for furniture and plywood assembly.",
  "https://jivanjor.com/products?product=jivanjor-aquabond",
  "https://example.com/aquabond-seo.jpg",
];

const CATEGORY_TEMPLATE_EXAMPLE = [
  "Water Resistant Adhesives",
  "Wood Adhesives",
  "High-performance D3 water-resistant wood adhesives engineered for site rotation and durable bonding.",
  "Next-Gen Moisture Shield Technology",
  "water-resistant-adhesives",
  "Droplets",
  "Water Resistant Wood Bonding Solutions",
  "Explore superior moisture resistance technology designed for furniture and woodworking.",
  "Technical Resources & Data",
  "Access technical specifications, application guides, and testing documentation.",
  "https://example.com/images/categories/water-resistant-hero.jpg",
  "Advanced Moisture Barrier R&D",
  "Our proprietary formula prevents swelling and joint weakness even under high humidity conditions.",
  "Explore Technical Data",
  "/resources",
  "https://example.com/images/research-1.jpg",
  "https://example.com/images/research-2.jpg",
  "Water Resistant Wood Adhesives - Jivanjor",
  "Discover Jivanjor water-resistant wood adhesives for high-humidity furniture and woodworking applications.",
  "https://jivanjor.com/categories?category=water-resistant-adhesives",
  "https://example.com/images/categories/water-resistant-seo.jpg",
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
  ws["!cols"] = headers.map(() => ({ wch: 26 }));

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

function cleanVal(str: string): string {
  if (!str) return "";
  const trimmed = str.trim();
  if (trimmed === "-- to be updated --" || trimmed === "--to be updated--") return "";
  return trimmed;
}



function parseUsps(raw: string): { title: string; description: string; icon: string }[] {
  const clean = cleanVal(raw);
  if (!clean) return [];

  const items = clean.split("|").map((s) => s.trim()).filter(Boolean);
  const icons = ["Cycle-arrow.svg", "Texture.svg", "Asterisk.svg", "Circles-seven.svg"];

  return items
    .map((item, idx) => {
      let title = item;
      let description = "";
      const colonIdx = item.indexOf(":");
      const dashIdx = item.indexOf("-");

      if (colonIdx !== -1) {
        title = item.slice(0, colonIdx).trim();
        description = item.slice(colonIdx + 1).trim();
      } else if (dashIdx !== -1) {
        title = item.slice(0, dashIdx).trim();
        description = item.slice(dashIdx + 1).trim();
      }

      return {
        title,
        description: description || `Provides high performance for ${title.toLowerCase()}.`,
        icon: icons[idx % icons.length],
      };
    })
    .filter((u) => u.title && u.title !== "-- to be updated --");
}

function parseApplications(raw: string): { title: string; description: string; imageA: string; imageB: string; link?: string }[] {
  const clean = cleanVal(raw);
  if (!clean) return [];

  const items = clean.split(/[\n;]|\s*\|\|\s*/).map((s) => s.trim().replace(/,$/, "")).filter(Boolean);

  return items
    .map((itemStr, idx) => {
      let title = itemStr;
      let description = "";
      let link = "";

      // Extract link if specified in brackets e.g. [http://...] or [/use-cases]
      const linkMatch = itemStr.match(/\[(https?:\/\/[^\]]+|\/[^\]]+)\]/);
      if (linkMatch) {
        link = linkMatch[1];
        itemStr = itemStr.replace(linkMatch[0], "").trim();
      }

      const colonIdx = itemStr.indexOf(":");
      const arrowIdx = itemStr.indexOf("->") !== -1 ? itemStr.indexOf("->") : itemStr.indexOf("=>");
      const dashIdx = itemStr.search(/\s+[-–—]\s+/);

      if (colonIdx !== -1) {
        title = itemStr.slice(0, colonIdx).trim();
        description = itemStr.slice(colonIdx + 1).trim();
      } else if (arrowIdx !== -1) {
        title = itemStr.slice(0, arrowIdx).trim();
        description = itemStr.slice(arrowIdx + 2).trim();
      } else if (dashIdx !== -1) {
        title = itemStr.slice(0, dashIdx).trim();
        description = itemStr.replace(/^[^-–—]+[-–—]\s*/, "").trim();
      } else {
        const parenMatch = itemStr.match(/^([^(]+)\(([^)]+)\)$/);
        if (parenMatch) {
          title = parenMatch[1].trim();
          description = parenMatch[2].trim();
        }
      }

      return {
        title,
        description: description || `Engineered for ${title.toLowerCase()} applications.`,
        imageA: idx % 2 === 0 ? "/images/Rectangle 34.png" : "/images/Rectangle 35.png",
        imageB: idx % 2 === 0 ? "/images/Rectangle 34 (1).png" : "/images/Rectangle 30.png",
        ...(link ? { link } : {}),
      };
    })
    .filter((a) => a.title && a.title !== "-- to be updated --");
}

function parseOverviewBullets(raw: string): { text: string; icon: string }[] {
  const clean = cleanVal(raw);
  if (!clean) return [];

  const items = clean.split(/[\n|;]/).map((s) => s.trim()).filter(Boolean);
  const icons = ["image 18.svg", "image 19.svg", "image 20.svg", "Texture.svg"];

  return items
    .map((text, idx) => ({
      text,
      icon: icons[idx % icons.length],
    }))
    .filter((b) => b.text && b.text !== "-- to be updated --");
}

function parseTechSpecs(raw: string): { key: string; value: string }[] {
  const clean = cleanVal(raw);
  if (!clean) return [];

  const items = clean.includes("|") ? clean.split("|") : clean.split("\n");
  const result: { key: string; value: string }[] = [];

  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed || trimmed === "-- to be updated --") continue;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx !== -1) {
      result.push({ key: trimmed.slice(0, colonIdx).trim(), value: trimmed.slice(colonIdx + 1).trim() });
    } else {
      const dashIdx = trimmed.indexOf("-");
      if (dashIdx !== -1) {
        result.push({ key: trimmed.slice(0, dashIdx).trim(), value: trimmed.slice(dashIdx + 1).trim() });
      } else {
        result.push({ key: trimmed, value: "" });
      }
    }
  }

  return result;
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
            let description = getRowValue(row, ["description", "desc", "details", "long_description", "longdescription"]);
            let shortDescription = getRowValue(row, ["short_description", "shortdescription", "short_desc", "shortdesc", "summary", "brief"]);
            const categoryName = getRowValue(row, ["category_name", "category", "categoryname", "cat_name", "catname"]);
            const materialName = getRowValue(row, ["material_name", "material", "materialname", "mat_name"]);

            if (!name) warnings.push("'name' is required");
            if (!categoryName) warnings.push("'category_name' is required");

            if (!description && shortDescription) description = shortDescription;
            if (!shortDescription && description) shortDescription = description.slice(0, 150);

            const matchedCat = categories.find(
              (c) => c.name.toLowerCase() === categoryName.toLowerCase()
            );
            if (categoryName && !matchedCat)
              warnings.push(`Category "${categoryName}" not found in system`);

            const matchedMat = materials.find(
              (m) => m.name.toLowerCase() === materialName.toLowerCase()
            );

            // Raw strings from Excel
            const rawSlug = getRowValue(row, ["slug", "url_slug", "product_slug"]);
            const rawCategories = getRowValue(row, ["categories", "additional_categories"]);
            const rawThemeColor = getRowValue(row, ["themeColor", "theme_color", "themecolor", "theme", "color"]);
            const rawImage = getRowValue(row, ["image", "image_url", "imageurl", "photo", "img"]);
            const rawBgImage = getRowValue(row, ["backgroundImage", "background_image", "hero_image"]);
            const packSizesRaw = getRowValue(row, ["packSizes", "pack_sizes", "packsizes", "pack_size", "packsize", "packs", "sizes"]);
            const overviewBulletsRaw = getRowValue(row, ["overviewBullets", "overview_bullets", "overviewbullets", "overview_bullet", "bullets", "key_features"]);
            const rawMetadata = getRowValue(row, ["metadata", "metadata_tags", "metadatatags", "tags"]);

            const techSpecsRaw = getRowValue(row, ["techSpecs", "tech_specs", "techspecs", "specifications", "specs", "technical_specs"]);
            const techSpecsDescription = cleanVal(getRowValue(row, ["techSpecsDescription", "tech_specs_description"]));
            const uspsRaw = getRowValue(row, ["usps", "unique_selling_points", "selling_points"]);
            const applicationsRaw = getRowValue(row, ["applications", "application", "uses", "use_cases", "usecases"]);
            const appsTitle = cleanVal(getRowValue(row, ["appsTitle", "apps_title", "applications_title"]));
            const appsDescription = cleanVal(getRowValue(row, ["appsDescription", "apps_description", "applications_description"]));
            const techResourceTitle = cleanVal(getRowValue(row, ["techResourceTitle", "tech_resource_title"]));
            const techResourceDescription = cleanVal(getRowValue(row, ["techResourceDescription", "tech_resource_description"]));
            const documentUrl = cleanVal(getRowValue(row, ["documentUrl", "document_url", "tds_url", "pdf_url"]));
            const videoUrl = cleanVal(getRowValue(row, ["videoUrl", "video_url"]));
            const videoThumbnail = cleanVal(getRowValue(row, ["videoThumbnail", "video_thumbnail"]));
            const videoTitle = cleanVal(getRowValue(row, ["videoTitle", "video_title"]));
            const videoDescription = cleanVal(getRowValue(row, ["videoDescription", "video_description"]));
            const relatedProductsRaw = getRowValue(row, ["relatedProducts", "related_products"]);
            const relatedTitle = cleanVal(getRowValue(row, ["relatedTitle", "related_title"]));

            const metaTitle = cleanVal(getRowValue(row, ["meta_title", "metatitle", "seo_title"]));
            const metaDescription = cleanVal(getRowValue(row, ["meta_description", "metadescription", "seo_description"]));
            const canonicalUrl = cleanVal(getRowValue(row, ["canonical_url", "canonicalurl", "seo_canonical"]));
            const seoImage = cleanVal(getRowValue(row, ["seo_image", "seoimage", "social_image"]));

            result.name = name;
            result.category_name = categoryName;
            result.category_id = matchedCat?.id || "";
            result.categories = rawCategories ? rawCategories.split(/[\n|;]/).map((s) => s.trim()).filter(Boolean) : [];
            result.material_name = materialName;
            result.material_id = matchedMat?.id || "";
            result.description = cleanVal(description);
            result.short_description = cleanVal(shortDescription);
            result.slug = cleanVal(rawSlug);
            result.theme_color = cleanVal(rawThemeColor) || "#0498AA";
            result.image = cleanVal(rawImage);
            result.backgroundImage = cleanVal(rawBgImage);
            result.pack_sizes = packSizesRaw ? packSizesRaw.split("|").map((s) => s.trim()).filter((s) => s && s !== "-- to be updated --") : [];
            result.overview_bullets = parseOverviewBullets(overviewBulletsRaw);
            result.metadata_tags = cleanVal(rawMetadata);

            result.tech_specs = parseTechSpecs(techSpecsRaw);
            result.techSpecsDescription = techSpecsDescription;
            result.usps = parseUsps(uspsRaw);
            result.applications = parseApplications(applicationsRaw);
            result.appsTitle = appsTitle;
            result.appsDescription = appsDescription;
            result.techResourceTitle = techResourceTitle;
            result.techResourceDescription = techResourceDescription;
            result.documentUrl = documentUrl;
            result.videoUrl = videoUrl;
            result.videoThumbnail = videoThumbnail;
            result.videoTitle = videoTitle;
            result.videoDescription = videoDescription;
            result.relatedProducts = relatedProductsRaw ? relatedProductsRaw.split(/[\n|;]/).map((s) => s.trim()).filter((s) => s && s !== "-- to be updated --") : [];
            result.relatedTitle = relatedTitle;

            result.meta_title = metaTitle;
            result.meta_description = metaDescription;
            result.canonical_url = canonicalUrl;
            result.seo_image = seoImage;
          } else {
            const name = getRowValue(row, ["name", "category_name", "category", "categoryname", "title"]);
            const slug = getRowValue(row, ["slug", "url_slug", "category_slug"]);
            const description = getRowValue(row, ["description", "desc", "details"]);
            const tagline = getRowValue(row, ["tagline", "sub_title", "subtitle"]);
            const parentName = getRowValue(row, ["parent_category_name", "parent_category", "parent", "parent_name", "parentcategoryname", "parentcategory"]);
            const icon = getRowValue(row, ["icon", "icon_name", "iconname"]);

            const categoryTitle = cleanVal(getRowValue(row, ["categoryTitle", "category_title"]));
            const categoryDescription = cleanVal(getRowValue(row, ["categoryDescription", "category_description"]));
            const resourcesTitle = cleanVal(getRowValue(row, ["resourcesTitle", "resources_title"]));
            const resourcesDescription = cleanVal(getRowValue(row, ["resourcesDescription", "resources_description"]));
            const heroImage = cleanVal(getRowValue(row, ["heroImage", "hero_image"]));
            const researchTitle = cleanVal(getRowValue(row, ["researchTitle", "research_title"]));
            const researchDescription = cleanVal(getRowValue(row, ["researchDescription", "research_description"]));
            const researchCtaText = cleanVal(getRowValue(row, ["researchCtaText", "research_cta_text"]));
            const researchCtaLink = cleanVal(getRowValue(row, ["researchCtaLink", "research_cta_link"]));
            const researchImage1 = cleanVal(getRowValue(row, ["researchImage1", "research_image_1"]));
            const researchImage2 = cleanVal(getRowValue(row, ["researchImage2", "research_image_2"]));

            const metaTitle = cleanVal(getRowValue(row, ["meta_title", "metatitle", "seo_title"]));
            const metaDescription = cleanVal(getRowValue(row, ["meta_description", "metadescription", "seo_description"]));
            const canonicalUrl = cleanVal(getRowValue(row, ["canonical_url", "canonicalurl", "seo_canonical"]));
            const seoImage = cleanVal(getRowValue(row, ["seo_image", "seoimage", "social_image"]));

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
            result.slug = cleanVal(slug);
            result.description = description;
            result.tagline = tagline;
            result.parent_category_name = parentName;
            result.parent_category = matchedParentDb?.id || "";
            result.icon = icon;
            result.categoryTitle = categoryTitle;
            result.categoryDescription = categoryDescription;
            result.resourcesTitle = resourcesTitle;
            result.resourcesDescription = resourcesDescription;
            result.heroImage = heroImage;
            result.researchTitle = researchTitle;
            result.researchDescription = researchDescription;
            result.researchCtaText = researchCtaText;
            result.researchCtaLink = researchCtaLink;
            result.researchImage1 = researchImage1;
            result.researchImage2 = researchImage2;
            result.meta_title = metaTitle;
            result.meta_description = metaDescription;
            result.canonical_url = canonicalUrl;
            result.seo_image = seoImage;
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
                          { col: "name", req: true, note: "Product name e.g. Jivanjor Aquabond" },
                          { col: "category_name", req: true, note: "Primary category name e.g. Water Resistant" },
                          { col: "description", req: true, note: "Detailed product summary description" },
                          { col: "slug", req: false, note: "URL slug (auto-generated if empty)" },
                          { col: "categories", req: false, note: "Additional categories (pipe-separated e.g. Cat 1 | Cat 2)" },
                          { col: "themeColor", req: false, note: "Hex color e.g. #0083CB (defaults to #0498AA)" },
                          { col: "image", req: false, note: "Product bottle/can image URL" },
                          { col: "backgroundImage", req: false, note: "Product page hero cover image URL" },
                          { col: "packSizes", req: false, note: "Pipe-separated sizes e.g. 500g | 1kg | 2kg | 5kg" },
                          { col: "overviewBullets", req: false, note: "Semicolon/pipe-separated badges e.g. Water Resistant; Fast Setting" },
                          { col: "metadata", req: false, note: "Comma-separated search tags e.g. wood glue, waterproof" },
                          { col: "techSpecs", req: false, note: "Pipe-separated pairs e.g. Appearance: Milk White | Viscosity: 2500 cPs" },
                          { col: "techSpecsDescription", req: false, note: "Header text above technical specs table" },
                          { col: "usps", req: false, note: "Pipe-separated Title: Description e.g. Waterproof: 48-hr immersion passed | Eco: Zero VOC" },
                          { col: "applications", req: false, note: "Semicolon/pipe-separated applications e.g. Plywood Assembly; Furniture Joinery" },
                          { col: "appsTitle", req: false, note: "Custom header for Applications section" },
                          { col: "appsDescription", req: false, note: "Custom description for Applications section" },
                          { col: "techResourceTitle", req: false, note: "Datasheet section header e.g. Technical Data Sheet" },
                          { col: "techResourceDescription", req: false, note: "Datasheet section description" },
                          { col: "documentUrl", req: false, note: "Technical Data Sheet (TDS) PDF URL" },
                          { col: "videoUrl", req: false, note: "Product video link (YouTube or MP4)" },
                          { col: "videoThumbnail", req: false, note: "Video cover image URL" },
                          { col: "videoTitle", req: false, note: "Video section header" },
                          { col: "videoDescription", req: false, note: "Video section description" },
                          { col: "relatedProducts", req: false, note: "Pipe-separated names of related products" },
                          { col: "relatedTitle", req: false, note: "Related products section header" },
                          { col: "meta_title", req: false, note: "SEO Meta Title (50-60 characters)" },
                          { col: "meta_description", req: false, note: "SEO Meta Description (120-160 characters)" },
                          { col: "canonical_url", req: false, note: "Canonical URL link" },
                          { col: "seo_image", req: false, note: "Social sharing thumbnail image URL" },
                        ] : [
                          { col: "name", req: true, note: "Category/Sub-category name e.g. Water Resistant Adhesives" },
                          { col: "parent_category_name", req: false, note: "Parent category name (leave blank for top-level main category, fill for sub-category)" },
                          { col: "description", req: false, note: "Overview description of the category/sub-category" },
                          { col: "slug", req: false, note: "URL slug (auto-generated from name if blank)" },
                          { col: "icon", req: false, note: "Lucide icon key or name e.g. Droplets, Layers" },
                          { col: "categoryTitle", req: false, note: "Hero section header title" },
                          { col: "categoryDescription", req: false, note: "Hero section sub-description" },
                          { col: "resourcesTitle", req: false, note: "Resources section header title" },
                          { col: "resourcesDescription", req: false, note: "Resources section description" },
                          { col: "heroImage", req: false, note: "Hero banner background image URL" },
                          { col: "researchTitle", req: false, note: "Research & Development section title" },
                          { col: "researchDescription", req: false, note: "R&D body description text" },
                          { col: "researchCtaText", req: false, note: "R&D CTA button text e.g. Explore Tech Data" },
                          { col: "researchCtaLink", req: false, note: "R&D CTA button link e.g. /resources" },
                          { col: "researchImage1", req: false, note: "Research feature image 1 URL" },
                          { col: "researchImage2", req: false, note: "Research feature image 2 URL" },
                          { col: "meta_title", req: false, note: "SEO Meta Title" },
                          { col: "meta_description", req: false, note: "SEO Meta Description" },
                          { col: "canonical_url", req: false, note: "SEO Canonical URL link" },
                          { col: "seo_image", req: false, note: "Social sharing thumbnail image URL" },
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
