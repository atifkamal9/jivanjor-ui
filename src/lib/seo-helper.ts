import { api, SeoMetadata } from "./api";
import { Metadata } from "next";
import { PageSchemaConfig, BreadcrumbItem, ItemListEntry, ProductSchemaData } from "./structured-data";

export interface FallbackSeoData {
  pageSchemaType: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  title: string;
  description: string;
  canonical: string;
  breadcrumbs?: BreadcrumbItem[];
  itemList?: ItemListEntry[];
  product?: ProductSchemaData;
  image?: string;
}

/**
 * Searches and matches dynamic SEO metadata from the database
 */
export async function fetchMatchedSeo(
  pageType: string,
  pageIdentifier?: string | null
): Promise<SeoMetadata | undefined> {
  try {
    const seoList = await api.getSeoMetadata().catch((err) => {
      console.warn(`[fetchMatchedSeo] Failed to fetch SEO metadata:`, err?.message || err);
      return [];
    });
    if (!seoList || seoList.length === 0) return undefined;

    const normType = pageType.toLowerCase().replace("_", "-");
    const normId = (pageIdentifier || "").toLowerCase().trim();

    return seoList.find((s) => {
      const sType = (s.page_type || "").toLowerCase().replace("_", "-");
      const sId = (s.page_id || "").toLowerCase().trim();

      // Match home page
      if (normType === "home" || normType === "static_home") {
        return (
          sType === "home" ||
          (sType === "static" && (!sId || sId === "home" || sId === "static_page"))
        );
      }

      // Exact match on type & id
      if (sType === normType && (sId === normId || (!sId && !normId))) {
        return true;
      }

      // Static page aliases (e.g. about, contact, partner, contractor, privacy, sitemap, resources, applications, products, categories, blog)
      if (sType === "static" && (sId === normId || sId === `${normId}_page`)) {
        return true;
      }

      // Reverse static mapping
      if (normType === "static" && (sId === normId || sType === normId)) {
        return true;
      }

      return false;
    });
  } catch (err) {
    console.error(`[fetchMatchedSeo] Failed to fetch SEO metadata for ${pageType}/${pageIdentifier}:`, err);
    return undefined;
  }
}

/**
 * Resolves both Next.js Metadata and Schema.org JSON-LD Config
 * Uses Admin Panel dynamic values with PDF specification defaults as fallbacks.
 */
export async function getResolvedSeoAndSchema(
  pageType: string,
  pageIdentifier: string | null | undefined,
  fallback: FallbackSeoData
): Promise<{ metadata: Metadata; schemaConfig: PageSchemaConfig }> {
  const matchedSeo = await fetchMatchedSeo(pageType, pageIdentifier);

  const title = matchedSeo?.meta_title?.trim() || fallback.title;
  const description = matchedSeo?.meta_description?.trim() || fallback.description;
  const canonical = matchedSeo?.canonical_url?.trim() || fallback.canonical;
  const image = matchedSeo?.image?.trim() || fallback.image;

  const metadata: Metadata = {
    title: title.includes("Jivanjor") ? title : `${title} | Jivanjor`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: title.includes("Jivanjor") ? title : `${title} | Jivanjor`,
      description,
      url: canonical,
      images: image ? [{ url: image }] : undefined,
    },
  };

  // Sync breadcrumbs current item if breadcrumbs exist
  let breadcrumbs = fallback.breadcrumbs;
  if (breadcrumbs && breadcrumbs.length > 0) {
    breadcrumbs = breadcrumbs.map((b, idx) => {
      if (idx === breadcrumbs!.length - 1) {
        return {
          name: title.replace(/ \| Jivanjor$/i, ""),
          url: canonical,
        };
      }
      return b;
    });
  }

  // Sync product node url and title if on product page
  let product = fallback.product;
  if (product) {
    product = {
      ...product,
      name: matchedSeo?.meta_title?.trim() || product.name,
      description: matchedSeo?.meta_description?.trim() || product.description,
      url: canonical,
    };
  }

  const schemaConfig: PageSchemaConfig = {
    pageSchemaType: fallback.pageSchemaType,
    canonicalUrl: canonical,
    pageTitle: title.replace(/ \| Jivanjor$/i, ""),
    metaDescription: description,
    breadcrumbs,
    itemList: fallback.itemList,
    product,
  };

  return { metadata, schemaConfig };
}
