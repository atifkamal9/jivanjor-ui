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
 * Returns dynamic site base URL based on environment:
 * - Production: https://jivanjor.com
 * - UAT: https://uat.jivanjor.com
 * - Vercel: https://jivanjor.vercel.app / https://${VERCEL_URL}
 */
export function getSiteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
  }
  return "https://jivanjor.com";
}

/**
 * Builds dynamic canonical URL using environment base URL
 */
export function buildCanonicalUrl(pathWithQuery: string): string {
  const cleanPath = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  return `${getSiteBaseUrl()}${cleanPath}`;
}

/**
 * Normalizes canonical URLs for resilient cross-domain and path/query matching.
 * Seamlessly matches URLs across:
 * - https://jivanjor.com
 * - https://www.jivanjor.com
 * - https://uat.jivanjor.com
 * - https://jivanjor.vercel.app / *.vercel.app
 * - http://localhost:3000
 * - relative paths (/products?product=watershield)
 */
export function normalizeCanonicalUrl(url: string | null | undefined): string {
  if (!url) return "";
  try {
    const raw = url.trim().toLowerCase();
    const parsed = new URL(
      raw.startsWith("http://") || raw.startsWith("https://")
        ? raw
        : `https://jivanjor.com${raw.startsWith("/") ? "" : "/"}${raw}`
    );
    const pathname = parsed.pathname.toLowerCase().replace(/\/+$/, "") || "/";
    const search = parsed.search.toLowerCase();
    return `${pathname}${search}`;
  } catch {
    return (
      url
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\/[^\/]+/, "")
        .replace(/\/+$/, "") || "/"
    );
  }
}

/**
 * Searches and matches dynamic SEO metadata from the database.
 * Uses multi-tier cross-domain resolution:
 * 1. Exact normalized canonical URL match (matches path + query across jivanjor.com, uat.jivanjor.com, jivanjor.vercel.app)
 * 2. Home page resolution
 * 3. Candidate identifier & slug match
 * 4. Hub / Static alias mapping
 */
export async function fetchMatchedSeo(
  pageType: string,
  pageIdentifier?: string | null,
  canonicalUrl?: string | null,
  extraCandidateIds: (string | null | undefined)[] = []
): Promise<SeoMetadata | undefined> {
  try {
    const seoList = await api.getSeoMetadata().catch((err) => {
      console.warn(`[fetchMatchedSeo] Failed to fetch SEO metadata:`, err?.message || err);
      return [];
    });
    if (!seoList || seoList.length === 0) return undefined;

    const normType = (pageType || "").toLowerCase().replace("_", "-");
    const normId = (pageIdentifier || "").toLowerCase().trim();
    const targetCanonical = normalizeCanonicalUrl(canonicalUrl);

    // Build candidate set of identifiers
    const candidates = new Set<string>();
    if (normId) candidates.add(normId);
    extraCandidateIds.forEach((c) => {
      if (c) candidates.add(c.toLowerCase().trim());
    });

    // Strategy 1: Match by Normalized Canonical URL (Cross-Domain: jivanjor.com, uat.jivanjor.com, jivanjor.vercel.app)
    if (targetCanonical && targetCanonical !== "/") {
      const canonicalMatch = seoList.find((s) => {
        if (!s.canonical_url) return false;
        const dbCanonical = normalizeCanonicalUrl(s.canonical_url);
        return dbCanonical === targetCanonical;
      });
      if (canonicalMatch) return canonicalMatch;
    }

    // Strategy 2: Match Home page specifically
    if (normType === "home" || normType === "static_home" || normId === "home" || targetCanonical === "/") {
      const homeMatch = seoList.find((s) => {
        const sType = (s.page_type || "").toLowerCase().replace("_", "-");
        const sId = (s.page_id || "").toLowerCase().trim();
        const sCanon = normalizeCanonicalUrl(s.canonical_url);
        return (
          sType === "home" ||
          sCanon === "/" ||
          (sType === "static" && (!sId || sId === "home" || sId === "static_page"))
        );
      });
      if (homeMatch) return homeMatch;
    }

    // Strategy 3: Match by Page Type & Identifier candidates
    return seoList.find((s) => {
      const sType = (s.page_type || "").toLowerCase().replace("_", "-");
      const sId = (s.page_id || "").toLowerCase().trim();

      // Exact match on type and any candidate ID
      if (sType === normType && (candidates.has(sId) || (!sId && candidates.size === 0))) {
        return true;
      }

      // Static hub page aliases
      const hubAliases: Record<string, string[]> = {
        products: ["products", "products-hub", "product-hub", "products_hub", "product"],
        categories: ["categories", "categories-hub", "category-hub", "categories_hub", "category"],
        resources: ["resources", "resources-hub", "technical-resources", "resources_page"],
        applications: ["applications", "applications-hub", "application-hub", "applications_hub", "use-case", "use_case"],
        blog: ["blog", "blog-hub", "blogs-hub", "blogs", "blog_hub"],
        about: ["about", "about_page", "about-us"],
        contact: ["contact", "contact_page", "contact-us"],
        partner: ["partner", "dealer", "partner_page", "become-a-dealer"],
        contractor: ["contractor", "contractor_page", "contractor-connect"],
        sitemap: ["sitemap", "sitemap_page"],
        privacy: ["privacy", "privacy_page", "privacy-policy"],
      };

      for (const [hubKey, aliases] of Object.entries(hubAliases)) {
        const isTargetHub = candidates.has(hubKey) || normType === hubKey || aliases.some((a) => candidates.has(a));
        if (isTargetHub) {
          const isDbHub =
            (sType === "static" && aliases.includes(sId)) ||
            aliases.includes(sType) ||
            sType === hubKey ||
            sId === hubKey;
          if (isDbHub) return true;
        }
      }

      // Reverse static mapping
      if (normType === "static" && (candidates.has(sId) || candidates.has(sType))) {
        return true;
      }

      // Dynamic entity match where sType matches normType
      if (
        (normType === "product" && sType === "product") ||
        (normType === "category" && sType === "category") ||
        (normType === "use-case" && (sType === "use-case" || sType === "use_case")) ||
        (normType === "blog" && sType === "blog") ||
        (normType === "page" && (sType === "page" || sType === "static"))
      ) {
        if (candidates.has(sId)) return true;
      }

      return false;
    });
  } catch (err) {
    console.error(`[fetchMatchedSeo] Failed to fetch SEO metadata for ${pageType}/${pageIdentifier}:`, err);
    return undefined;
  }
}

/**
 * Resolves both Next.js Metadata and Schema.org JSON-LD Config.
 * Uses Admin Panel dynamic values with fallback content as fallbacks.
 * Dynamically emits the active canonical URL configured in the DB or computed from environment base URL.
 */
export async function getResolvedSeoAndSchema(
  pageType: string,
  pageIdentifier: string | null | undefined,
  fallback: FallbackSeoData,
  extraCandidateIds: (string | null | undefined)[] = []
): Promise<{ metadata: Metadata; schemaConfig: PageSchemaConfig }> {
  const matchedSeo = await fetchMatchedSeo(
    pageType,
    pageIdentifier,
    fallback.canonical,
    extraCandidateIds
  );

  const title = matchedSeo?.meta_title?.trim() || fallback.title;
  const description = matchedSeo?.meta_description?.trim() || fallback.description;
  // If the admin configured a dynamic canonical URL in DB, honor it; otherwise use fallback
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
