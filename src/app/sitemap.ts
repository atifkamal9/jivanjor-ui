
import type { MetadataRoute } from "next";
import {
  mapProductFromBackend,
  mapCategoryFromBackend,
  mapBlogPostFromBackend,
  mapTemplateFromBackend,
  type BlogPost,
  type Category,
  type Page,
  type PageTemplate,
  type Product,
  type UseCase,
} from "@/lib/api";
import { getServerApiBase } from "@/lib/server-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? new Date() : date;
}

async function getSitemapData<T>(
  apiBase: string,
  endpoint: string,
  responseKey: string,
  mapper?: (item: any) => T
): Promise<T[]> {
  const response = await fetch(`${apiBase}${endpoint}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Sitemap API ${endpoint} returned HTTP ${response.status}`
    );
  }

  const result = await response.json();

  const items =
    result?.data?.[responseKey] ??
    result?.[responseKey] ??
    [];

  if (!Array.isArray(items)) {
    throw new Error(`Invalid sitemap API response: ${endpoint}`);
  }

  return mapper ? items.map(mapper) : (items as T[]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiBase = await getServerApiBase();

  // The production and UAT domains share one frontend.
  // Generate URLs for the hostname of the incoming request.
  const siteUrl = apiBase.replace(/\/api\/?$/, "");

  const seenUrls = new Set<string>();
  const entries: MetadataRoute.Sitemap = [];

  const addEntry = (entry: MetadataRoute.Sitemap[number]) => {
    let cleanUrl = entry.url.trim();

    try {
      const parsed = new URL(cleanUrl);

      if (
        parsed.pathname.length > 1 &&
        parsed.pathname.endsWith("/")
      ) {
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

  // 1. Static routes
  for (const route of STATIC_ROUTES) {
    addEntry({
      url: `${siteUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  // 2. Fetch current CMS collections from the correct backend
  const [
    productsRes,
    categoriesRes,
    blogsRes,
    pagesRes,
    templatesRes,
    useCasesRes,
  ] = await Promise.allSettled([
    getSitemapData<Product>(
      apiBase,
      "/products?limit=9999&visibleOnly=true",
      "products",
      mapProductFromBackend
    ),
    getSitemapData<Category>(
      apiBase,
      "/categories",
      "categories",
      mapCategoryFromBackend
    ),
    getSitemapData<BlogPost>(
      apiBase,
      "/blogs?limit=9999",
      "blogs",
      mapBlogPostFromBackend
    ),
    getSitemapData<Page>(
      apiBase,
      "/pages",
      "pages"
    ),
    getSitemapData<PageTemplate>(
      apiBase,
      "/templates",
      "templates",
      mapTemplateFromBackend
    ),
    getSitemapData<UseCase>(
      apiBase,
      "/use-cases",
      "useCases"
    ),
  ]);

  const results = [
    productsRes,
    categoriesRes,
    blogsRes,
    pagesRes,
    templatesRes,
    useCasesRes,
  ];

  const names = [
    "products",
    "categories",
    "blogs",
    "pages",
    "templates",
    "use-cases",
  ];

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `[sitemap.xml] Failed to load ${names[index]}:`,
        result.reason
      );
    }
  });

  // Do not silently publish a static-only sitemap
  // when every dynamic request has failed.
  if (results.every((result) => result.status === "rejected")) {
    throw new Error("All dynamic sitemap API requests failed");
  }

  const products: Product[] =
    productsRes.status === "fulfilled" ? productsRes.value : [];

  const categories: Category[] =
    categoriesRes.status === "fulfilled" ? categoriesRes.value : [];

  const blogs: BlogPost[] =
    blogsRes.status === "fulfilled" ? blogsRes.value : [];

  const pages: Page[] =
    pagesRes.status === "fulfilled" ? pagesRes.value : [];

  const templates: PageTemplate[] =
    templatesRes.status === "fulfilled" ? templatesRes.value : [];

  const useCases: UseCase[] =
    useCasesRes.status === "fulfilled" ? useCasesRes.value : [];

  // 3. Dynamic categories
  for (const cat of categories) {
    if (cat.isVisible === false) continue;

    const slug = (cat.slug || cat.name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (!slug) continue;

    addEntry({
      url: `${siteUrl}/categories/${slug}`,
      lastModified: parseDate(
        (cat as any).updatedAt || (cat as any).updated_at
      ),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // 4. Dynamic products
  const isProductVisible = (p: Product | any): boolean => {
    if (!p) return false;

    const hidden = (value: any) =>
      value === false || value === "false" ||
      value === 0 || value === "0";

    if (hidden(p.isVisible) || hidden(p.is_visible)) {
      return false;
    }

    if (p.metadata && typeof p.metadata === "object") {
      if (
        hidden(p.metadata.isVisible) ||
        hidden(p.metadata.is_visible)
      ) {
        return false;
      }
    }

    return p.isVisible === true || p.isVisible === undefined;
  };

  for (const prod of products) {
    if (!isProductVisible(prod)) continue;

    const slug = (prod.slug || prod.name || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    if (!slug) continue;

    addEntry({
      url: `${siteUrl}/products?product=${encodeURIComponent(slug)}`,
      lastModified: parseDate(
        (prod as any).updatedAt || (prod as any).updated_at
      ),
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // 5. Dynamic blogs
  for (const blog of blogs) {
    const slug = (blog.slug || blog.title || "").trim();

    if (!slug) continue;

    addEntry({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: parseDate(
        blog.updated_at || blog.updatedAt || blog.publish_date
      ),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // 6. Dynamic use cases / applications
  for (const uc of useCases) {
    const slug = (uc.slug || uc.title || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    if (!slug) continue;

    addEntry({
      url: `${siteUrl}/applications?article=${encodeURIComponent(slug)}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // 7. CMS-managed pages
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

    const template = templates.find(
      (t) => t.id === page.activeTemplateId
    );

    const rawData =
      (template?.rawSections as any) ||
      (template?.sections as any) ||
      {};

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
      url: `${siteUrl}${pagePath}`,
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
