import {
  mapTemplateFromBackend,
  mapCategoryFromBackend,
  mapProductFromBackend,
  mapSettingsFromBackend,
  type Category,
  type Product,
  type SiteSettings,
} from "@/lib/api";

export async function getServerApiBase(): Promise<string> {
  const { headers } = await import("next/headers");
  const h = await headers();

  const host = h.get("x-forwarded-host") || h.get("host");

  if (!host) {
    throw new Error("Unable to determine request hostname");
  }

  const hostname = host.toLowerCase().split(":")[0];

  const allowedHosts = [
    "uat.jivanjor.com",
    "jivanjor.com",
    "www.jivanjor.com",
  ];

  if (!allowedHosts.includes(hostname)) {
    throw new Error(`Unexpected request hostname: ${hostname}`);
  }

  return `https://${hostname}/api`;
}

export async function getServerSettings(): Promise<SiteSettings> {
  const apiBase = await getServerApiBase();

  const response = await fetch(`${apiBase}/settings`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Settings API failed with ${response.status}`);
  }

  const result = await response.json();
  const raw = result?.data?.settings ?? result?.data ?? result;

  return mapSettingsFromBackend(raw);
}

export async function getServerActiveTemplateForPage(page: string) {
  try {
    const apiBase = await getServerApiBase();

    const response = await fetch(
      `${apiBase}/templates/active/page/${encodeURIComponent(page)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Active template API failed with ${response.status}`
      );
    }

    const result = await response.json();

    const temp =
      result?.data?.template ||
      result?.data;

    return temp
      ? mapTemplateFromBackend(temp)
      : undefined;
  } catch {
    return undefined;
  }
}

export async function getServerPage(pageSlug: string): Promise<any | undefined> {
  try {
    const apiBase = await getServerApiBase();

    const response = await fetch(
      `${apiBase}/pages/${encodeURIComponent(pageSlug)}`,
      {
        cache: "no-store",
      }
    );

    if (response.ok) {
      const result = await response.json();
      if (result?.data?.page) {
        return result.data.page;
      }
    }

    // Fallback: fetch all pages and find by slug or id
    const listRes = await fetch(`${apiBase}/pages`, { cache: "no-store" });
    if (listRes.ok) {
      const listData = await listRes.json();
      const pages = listData?.data?.pages || listData?.data || [];
      if (Array.isArray(pages)) {
        return pages.find(
          (p: any) => p.slug === pageSlug || p.id === pageSlug || p._id === pageSlug
        );
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export async function getServerCategories(): Promise<Category[]> {
  const apiBase = await getServerApiBase();

  const response = await fetch(`${apiBase}/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Categories API failed with ${response.status}`
    );
  }

  const result = await response.json();

  const categories =
    result?.data?.categories ??
    result?.data ??
    result?.categories ??
    [];

  return Array.isArray(categories)
    ? categories.map(mapCategoryFromBackend)
    : [];
}

export async function getServerProducts(): Promise<Product[]> {
  const apiBase = await getServerApiBase();

  const response = await fetch(
    `${apiBase}/products?limit=9999`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Products API failed with ${response.status}`
    );
  }

  const result = await response.json();

  const products =
    result?.data?.products ??
    result?.data ??
    result?.products ??
    [];

  return Array.isArray(products)
    ? products.map(mapProductFromBackend)
    : [];
}
