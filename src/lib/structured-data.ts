/**
 * Jivanjor Structured Data (Schema.org JSON-LD) Implementation
 * Follows "Jivanjor Structured Data Implementation Specification" (Approved scope)
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ItemListEntry {
  name: string;
  url: string;
}

export interface ProductSchemaData {
  name: string;
  description?: string;
  imageUrl?: string;
  url: string;
  category?: string;
}

export interface PageSchemaConfig {
  pageSchemaType: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  canonicalUrl: string;
  pageTitle: string;
  metaDescription?: string;
  breadcrumbs?: BreadcrumbItem[];
  itemList?: ItemListEntry[];
  product?: ProductSchemaData;
  logoUrl?: string;
}

export const BRAND_CONSTANTS = {
  name: "Jivanjor",
  legalName: "Jubilant Agri and Consumer Products Limited",
  alternateName: "JACPL",
  url: "https://jivanjor.com/",
  defaultLogoUrl: "https://jivanjor.com/images/logo.png",
  email: "contactJACPL@jubl.com",
  customerSupportPhone: "+91-120-6290000",
  registeredOfficePhone: "+91-5924-267406",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  addresses: [
    {
      "@type": "PostalAddress",
      streetAddress: "Plot No. 142, Chimes, 3rd Floor, Sector 44",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122003",
      addressCountry: "IN",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "NH-24, JACPL Unit-1, Bhartiagram",
      addressLocality: "Gajraula",
      addressRegion: "Uttar Pradesh",
      postalCode: "244223",
      addressCountry: "IN",
    },
  ],
  contactPoints: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+91-120-6290000",
      email: "contactJACPL@jubl.com",
      areaServed: "IN",
      availableLanguage: "English",
    },
    {
      "@type": "ContactPoint",
      contactType: "registered office",
      telephone: "+91-5924-267406",
      areaServed: "IN",
    },
  ],
};

/**
 * Builds standard Organization entity node
 */
export function buildOrganizationNode(logoUrl?: string) {
  const logo = logoUrl || BRAND_CONSTANTS.defaultLogoUrl;
  return {
    "@type": "Organization",
    "@id": "https://jivanjor.com/#organization",
    name: BRAND_CONSTANTS.name,
    legalName: BRAND_CONSTANTS.legalName,
    alternateName: BRAND_CONSTANTS.alternateName,
    url: BRAND_CONSTANTS.url,
    logo: {
      "@type": "ImageObject",
      "@id": "https://jivanjor.com/#logo",
      url: logo,
      contentUrl: logo,
    },
    email: BRAND_CONSTANTS.email,
    telephone: BRAND_CONSTANTS.customerSupportPhone,
    areaServed: BRAND_CONSTANTS.areaServed,
    address: BRAND_CONSTANTS.addresses,
    contactPoint: BRAND_CONSTANTS.contactPoints,
  };
}

/**
 * Builds standard WebSite entity node
 */
export function buildWebSiteNode() {
  return {
    "@type": "WebSite",
    "@id": "https://jivanjor.com/#website",
    url: "https://jivanjor.com/",
    name: BRAND_CONSTANTS.name,
    publisher: {
      "@id": "https://jivanjor.com/#organization",
    },
    inLanguage: "en-IN",
  };
}

/**
 * Builds BreadcrumbList entity node
 */
export function buildBreadcrumbListNode(
  canonicalUrl: string,
  breadcrumbs: BreadcrumbItem[]
) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Builds Product entity node (informational, no invented fields)
 */
export function buildProductNode(
  canonicalUrl: string,
  product: ProductSchemaData
) {
  const node: Record<string, any> = {
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    name: product.name,
    url: canonicalUrl,
    brand: {
      "@type": "Brand",
      name: BRAND_CONSTANTS.name,
    },
    manufacturer: {
      "@id": "https://jivanjor.com/#organization",
    },
    category: product.category || "Woodworking Adhesive",
    mainEntityOfPage: {
      "@id": `${canonicalUrl}#webpage`,
    },
  };

  if (product.description) {
    node.description = product.description;
  }

  if (product.imageUrl) {
    node.image = [product.imageUrl];
  }

  return node;
}

/**
 * Builds Complete Single Authoritative JSON-LD Graph for any Jivanjor route
 */
export function buildJivanjorSchema(config: PageSchemaConfig) {
  const {
    pageSchemaType,
    canonicalUrl,
    pageTitle,
    metaDescription,
    breadcrumbs,
    itemList,
    product,
    logoUrl,
  } = config;

  const graph: any[] = [
    buildOrganizationNode(logoUrl),
    buildWebSiteNode(),
  ];

  // Base WebPage / Page Node
  const pageNode: Record<string, any> = {
    "@type": pageSchemaType,
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: pageTitle,
    isPartOf: {
      "@id": "https://jivanjor.com/#website",
    },
    about: {
      "@id": "https://jivanjor.com/#organization",
    },
    inLanguage: "en-IN",
  };

  if (metaDescription) {
    pageNode.description = metaDescription;
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    pageNode.breadcrumb = {
      "@id": `${canonicalUrl}#breadcrumb`,
    };
  }

  // CollectionPage ItemList
  if (pageSchemaType === "CollectionPage" && itemList && itemList.length > 0) {
    pageNode.mainEntity = {
      "@type": "ItemList",
      itemListElement: itemList.map((item, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: item.name,
        url: item.url,
      })),
    };
  }

  graph.push(pageNode);

  // Add BreadcrumbList node if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    graph.push(buildBreadcrumbListNode(canonicalUrl, breadcrumbs));
  }

  // Add Product node if on product view
  if (product) {
    graph.push(buildProductNode(canonicalUrl, product));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Converts graph into safe escaped JSON-LD script string for SSR injection
 */
export function serializeSafeJsonLd(graph: Record<string, any>): string {
  return JSON.stringify(graph).replace(/</g, "\\u003c");
}
