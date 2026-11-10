import type { MetadataRoute } from "next";
import {
  api,
  type BlogPost,
  type Category,
  type Page,
  type PageTemplate,
  type Product,
  type UseCase,
} from "@/lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://jivanjor.com"
).replace(/\/+$/, "");

const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
}> = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/products", priority: 0.9, changeFrequency: "daily" },
  { path: "/categories", priority: 0.9, changeFrequency: "weekly" },
  { path: "/applications", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.9, changeFrequency: "daily" },
  { path: "/partner", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contractor", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/resources", priority: 0.8, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.5, changeFrequency: "yearly" },
  { path: "/sitemap", priority: 0.5, changeFrequency: "weekly" },
];

function parseDate(dateStr?: string | null): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seenUrls = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const addEntry = (entry: MetadataRoute.Sitemap[number]) => {
    let cleanUrl = entry.url.trim();
    try {
      const parsed = new URL(cleanUrl);
      if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
        parsed.pathname = parsed.pathname.slice(0, -1);
      }
      cleanUrl = parsed.toString();
    } catch {
      cleanUrl = cleanUrl.replace(/([^:]\/)\/+/g, "$1");
    }

    const dedupeKey = cleanUrl.toLowerCase();
    if (seenUrls.has(dedupeKey)) return;
    seenUrls.add(dedupeKey);

    entries.push({
      ...entry,
      url: cleanUrl,
    });
  };

  // 1. Core static routes
  for (const route of STATIC_ROUTES) {
    addEntry({
      url: `${SITE_URL}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  // 2. Fetch live database collections in parallel
  const [
    productsRes,
    categoriesRes,
    blogsRes,
    pagesRes,
    templatesRes,
    useCasesRes,
  ] = await Promise.allSettled([
    api.getProducts({ visibleOnly: true }).catch(() => []),
    api.getCategories().catch(() => []),
    api.getBlogPosts().catch(() => []),
    api.getPages().catch(() => []),
    api.getTemplates().catch(() => []),
    api.getUseCases().catch(() => []),
  ]);

  const products: Product[] =
    productsRes.status === "fulfilled" && Array.isArray(productsRes.value)
      ? productsRes.value
      : [];
  const categories: Category[] =
    categoriesRes.status === "fulfilled" && Array.isArray(categoriesRes.value)
      ? categoriesRes.value
      : [];
  const blogs: BlogPost[] =
    blogsRes.status === "fulfilled" && Array.isArray(blogsRes.value)
      ? blogsRes.value
      : [];
  const pages: Page[] =
    pagesRes.status === "fulfilled" && Array.isArray(pagesRes.value)
      ? pagesRes.value
      : [];
  const templates: PageTemplate[] =
    templatesRes.status === "fulfilled" && Array.isArray(templatesRes.value)
      ? templatesRes.value
      : [];
  const useCases: UseCase[] =
    useCasesRes.status === "fulfilled" && Array.isArray(useCasesRes.value)
      ? useCasesRes.value
      : [];

  // 3. Dynamic Categories from API
  for (const cat of categories) {
    if (cat.isVisible === false) continue;
    const slug = (cat.slug || cat.name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
    if (!slug) continue;
    addEntry({
      url: `${SITE_URL}/categories/${slug}`,
      lastModified: parseDate((cat as any).updatedAt || (cat as any).updated_at),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // Helper to ensure strictly visible products
  const isProductVisible = (p: Product | any): boolean => {
    if (!p) return false;
    if (p.isVisible === false || p.isVisible === "false" || p.isVisible === 0 || p.isVisible === "0") return false;
    if (p.is_visible === false || p.is_visible === "false" || p.is_visible === 0 || p.is_visible === "0") return false;
    if (p.metadata && typeof p.metadata === "object") {
      if (p.metadata.isVisible === false || p.metadata.isVisible === "false" || p.metadata.isVisible === 0 || p.metadata.isVisible === "0") return false;
      if (p.metadata.is_visible === false || p.metadata.is_visible === "false" || p.metadata.is_visible === 0 || p.metadata.is_visible === "0") return false;
    }
    return p.isVisible === true || p.isVisible === undefined;
  };

  // 4. Dynamic Products from API (strictly only visible products)
  for (const prod of products) {
    if (!isProductVisible(prod)) continue;
    const slug = (prod.slug || prod.name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
    if (!slug) continue;
    addEntry({
      url: `${SITE_URL}/products?product=${encodeURIComponent(slug)}`,
      lastModified: parseDate((prod as any).updatedAt || (prod as any).updated_at),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // 5. Dynamic Blog Posts from API
  for (const blog of blogs) {
    const slug = (blog.slug || blog.title || "").trim();
    if (!slug) continue;
    addEntry({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: parseDate(
        blog.updated_at || blog.updatedAt || blog.publish_date
      ),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // 6. Dynamic Use Cases / Applications from API
  for (const uc of useCases) {
    const slug = (uc.slug || uc.title || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    if (!slug) continue;
    addEntry({
      url: `${SITE_URL}/applications?article=${encodeURIComponent(slug)}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // 7. Dynamic CMS-managed Pages from API
  const reservedSlugs = new Set([
    "home",
    "about",
    "products",
    "categories",
    "applications",
    "blog",
    "partner",
    "contractor",
    "contact",
    "resources",
    "privacy",
    "sitemap",
  ]);

  for (const page of pages) {
    const slug = page.slug?.trim().toLowerCase();
    if (!slug || reservedSlugs.has(slug)) continue;

    const template = templates.find((t) => t.id === page.activeTemplateId);
    const rawData =
      (template?.rawSections as any) || (template?.sections as any) || {};
    const layoutType = rawData.layoutType || "";

    let pagePath = `/${slug}`;
    if (layoutType === "about") {
      pagePath = `/about/${slug}`;
    } else if (layoutType === "applications") {
      pagePath = `/applications/${slug}`;
    } else if (layoutType === "products") {
      pagePath = `/products/${slug}`;
    } else if (layoutType === "categories") {
      pagePath = `/categories/${slug}`;
    } else if (layoutType === "blog") {
      pagePath = `/blog/${slug}`;
    }

    addEntry({
      url: `${SITE_URL}${pagePath}`,
      lastModified: parseDate(
        page.updatedAt ||
          page.updated_at ||
          page.createdAt ||
          page.created_at
      ),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
