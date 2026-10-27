import { headers } from "next/headers";

import {
  mapTemplateFromBackend,
  mapCategoryFromBackend,
  mapProductFromBackend,
  type Category,
  type Product,
} from "@/lib/api";

export async function getServerApiBase(): Promise<string> {
  const h = await headers();

  const host =
    h.get("x-forwarded-host") ||
    h.get("host");

  if (!host) {
    throw new Error("Unable to determine request host");
  }

  return `https://${host}/api`;
}

export async function getServerSettings() {
  const apiBase = await getServerApiBase();

  const response = await fetch(`${apiBase}/settings`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Settings API failed with ${response.status}`);
  }

  const result = await response.json();

  return (
    result?.data?.settings ??
    result?.data ??
    result
  );
}

export async function getServerActiveTemplateForPage(page: string) {
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