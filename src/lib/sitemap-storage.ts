import { api, Category, Product, BlogPost, Page } from "./api";

export interface SitemapLink {
  id: string;
  title: string;
  href: string;
  description?: string;
  isCustom?: boolean;
}

export interface SitemapSection {
  id: string;
  title: string;
  description?: string;
  isVisible: boolean;
  order: number;
  links: SitemapLink[];
}

export interface SitemapConfig {
  heroTitle?: string;
  heroDescription?: string;
  sections: SitemapSection[];
  lastUpdated?: string;
}

const STORAGE_KEY = "jivanjor_sitemap_config";

export const DEFAULT_SITEMAP_SECTIONS: SitemapSection[] = [
  {
    id: "main",
    title: "Main Pages",
    description: "Core portal entrance pages and general information.",
    isVisible: true,
    order: 1,
    links: [
      { id: "m1", title: "Home", href: "/", description: "Jivanjor Adhesives flagship showcase page." },
      { id: "m2", title: "About Jivanjor", href: "/about", description: "Company background, research, and quality standards." },
      { id: "m3", title: "Products Directory", href: "/products", description: "Complete range of premium wood adhesives." },
      { id: "m4", title: "Product Categories", href: "/categories", description: "Browse adhesives by specialization category." },
      { id: "m5", title: "Applications & Solutions", href: "/applications", description: "Application guides for furniture, laminates, and wood." },
      { id: "m6", title: "Blog & Industry Insights", href: "/blog", description: "Articles, technical tips, and woodworking advice." },
      { id: "m7", title: "Technical Resources", href: "/resources", description: "Technical data sheets, brochures, and downloads." },
    ],
  },
  {
    id: "about-sub",
    title: "Brand & Corporate",
    description: "Research innovation, quality promises, media, and market network.",
    isVisible: true,
    order: 2,
    links: [
      { id: "a1", title: "Research & Innovation", href: "/about/research-and-innovation", description: "R&D capabilities and product technology." },
      { id: "a2", title: "Quality & Performance Promise", href: "/about/quality-and-performance-promise", description: "Quality standards and performance guarantees." },
      { id: "a3", title: "TVCs & Brand Media", href: "/about/tvc", description: "Television commercials and video showcases." },
      { id: "a4", title: "Market Presence", href: "/about/market-presence", description: "Pan-India distribution network and dealer footprint." },
    ],
  },
  {
    id: "categories",
    title: "Product Categories",
    description: "Browse adhesives by category and performance rating.",
    isVisible: true,
    order: 3,
    links: [
      { id: "c1", title: "Super Premium Adhesives", href: "/categories/super-premium", description: "High-strength premium bonding solutions." },
      { id: "c2", title: "Speciality Adhesives", href: "/categories/speciality", description: "Adhesives tailored for specific substrates." },
      { id: "c3", title: "Waterproof Grade Adhesives", href: "/categories/waterproof", description: "Moisture and water resistant formulations." },
      { id: "c4", title: "Wood Ancillaries", href: "/categories/wood-ancillaries", description: "Complementary woodworking products." },
    ],
  },
  {
    id: "editorial",
    title: "Editorial Articles & Guides",
    description: "Woodworking advice, application guides, and expert knowledge.",
    isVisible: true,
    order: 4,
    links: [
      { id: "b1", title: "Selecting the Right Adhesive for Edge Banding", href: "/blog", description: "Guide to choosing edge banding adhesives." },
      { id: "b2", title: "Waterproof vs Water Resistant Adhesives", href: "/blog", description: "Understanding bonding standards for humid conditions." },
    ],
  },
  {
    id: "support",
    title: "Support, Partners & Legal",
    description: "Dealer onboarding, contractor programs, contact, and legal policy.",
    isVisible: true,
    order: 5,
    links: [
      { id: "s1", title: "Become a Dealer / Partner", href: "/partner", description: "Information for prospective dealers and distributors." },
      { id: "s2", title: "Contractor Connect", href: "/contractor", description: "Contractor community and rewards." },
      { id: "s3", title: "Contact Us", href: "/contact", description: "Get in touch with customer support." },
      { id: "s4", title: "Privacy Policy", href: "/privacy", description: "Data privacy practices and terms of use." },
      { id: "s5", title: "Terms of Use", href: "/privacy#terms", description: "Terms governing website usage." },
    ],
  },
];

export const DEFAULT_HERO_TITLE = "Jivanjor Sitemap";
export const DEFAULT_HERO_DESCRIPTION =
  "Find direct links to all main pages, product categories, editorial guides, and support resources across Jivanjor.";

export function getLocalSitemapConfig(): SitemapConfig {
  if (typeof window === "undefined") {
    return {
      heroTitle: DEFAULT_HERO_TITLE,
      heroDescription: DEFAULT_HERO_DESCRIPTION,
      sections: DEFAULT_SITEMAP_SECTIONS,
      lastUpdated: new Date().toISOString(),
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        heroTitle: DEFAULT_HERO_TITLE,
        heroDescription: DEFAULT_HERO_DESCRIPTION,
        sections: DEFAULT_SITEMAP_SECTIONS,
        lastUpdated: new Date().toISOString(),
      };
    }
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.sections) && parsed.sections.length > 0) {
      const sanitizedSections = parsed.sections.map((sec: SitemapSection) => ({
        ...sec,
        links: sanitizeAndDeduplicateLinks(sec.links || []),
      }));
      return {
        heroTitle: parsed.heroTitle || DEFAULT_HERO_TITLE,
        heroDescription: parsed.heroDescription || DEFAULT_HERO_DESCRIPTION,
        sections: sanitizedSections,
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error("Failed to parse sitemap storage", err);
  }
  return {
    heroTitle: DEFAULT_HERO_TITLE,
    heroDescription: DEFAULT_HERO_DESCRIPTION,
    sections: DEFAULT_SITEMAP_SECTIONS,
    lastUpdated: new Date().toISOString(),
  };
}

export function saveLocalSitemapConfig(config: SitemapConfig): void {
  if (typeof window === "undefined") return;
  try {
    const sanitizedSections = config.sections.map((sec) => ({
      ...sec,
      links: sanitizeAndDeduplicateLinks(sec.links || []),
    }));

    const updated = {
      ...config,
      sections: sanitizedSections,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save sitemap storage", err);
  }
}

export function resetLocalSitemapConfig(): SitemapConfig {
  const config: SitemapConfig = {
    heroTitle: DEFAULT_HERO_TITLE,
    heroDescription: DEFAULT_HERO_DESCRIPTION,
    sections: DEFAULT_SITEMAP_SECTIONS,
    lastUpdated: new Date().toISOString(),
  };
  saveLocalSitemapConfig(config);
  return config;
}

function sanitizeAndDeduplicateLinks(links: SitemapLink[]): SitemapLink[] {
  const seenHrefs = new Set<string>();
  const seenIds = new Set<string>();
  const deduplicated: SitemapLink[] = [];

  for (const link of links) {
    if (!link || !link.href || !link.title) continue;
    const normalizedHref = link.href.trim().toLowerCase();

    // Skip if we already saw this exact URL in this section
    if (seenHrefs.has(normalizedHref)) continue;

    // Build clean deterministic ID
    let baseId = link.id
      ? link.id.split("-dedup-")[0]
      : `link-${normalizedHref.replace(/[^a-z0-9]/g, "-")}`;
    let uniqueId = baseId;
    let counter = 1;
    while (seenIds.has(uniqueId)) {
      uniqueId = `${baseId}-dedup-${counter++}`;
    }

    seenHrefs.add(normalizedHref);
    seenIds.add(uniqueId);
    deduplicated.push({
      ...link,
      id: uniqueId,
      title: link.title.trim(),
      href: link.href.trim(),
    });
  }

  return deduplicated;
}

export async function syncSitemapConfigWithApi(
  existingConfig?: SitemapConfig
): Promise<SitemapConfig> {
  const current = existingConfig || getLocalSitemapConfig();

  try {
    const [categories, blogs, pages] = await Promise.all([
      api.getCategories().catch(() => [] as Category[]),
      api.getBlogPosts().catch(() => [] as BlogPost[]),
      api.getPages().catch(() => [] as Page[]),
    ]);

    // Known static base paths that shouldn't be duplicated as dynamic CMS pages
    const staticBaseHrefs = new Set([
      "/",
      "/about",
      "/products",
      "/categories",
      "/applications",
      "/blog",
      "/resources",
      "/partner",
      "/contractor",
      "/contact",
      "/privacy",
      "/privacy#terms",
      "/sitemap",
    ]);

    const updatedSections = current.sections.map((sec) => {
      let mergedLinks: SitemapLink[] = [...sec.links];

      // Sync dynamic categories
      if (sec.id === "categories") {
        const dynamicCatLinks: SitemapLink[] = categories
          .filter((cat) => cat && cat.slug)
          .map((cat) => ({
            id: `cat-${cat.slug}`,
            title: cat.name,
            href: `/categories/${cat.slug}`,
            description: cat.description || `Category showcase for ${cat.name}`,
          }));

        const customLinks = sec.links.filter((l) => l.isCustom);
        mergedLinks =
          dynamicCatLinks.length > 0
            ? [...dynamicCatLinks, ...customLinks]
            : sec.links;
      }

      // Sync dynamic editorial blogs
      if (sec.id === "editorial") {
        const dynamicBlogLinks: SitemapLink[] = blogs
          .filter((post) => post && post.slug)
          .map((post) => ({
            id: `blog-${post.slug}`,
            title: post.title,
            href: `/blog/${post.slug}`,
            description:
              post.tldr || `Published article on ${post.category || "Woodworking"}`,
          }));

        const customLinks = sec.links.filter((l) => l.isCustom);
        mergedLinks =
          dynamicBlogLinks.length > 0
            ? [...dynamicBlogLinks, ...customLinks]
            : sec.links;
      }

      // Sync dynamic custom CMS pages (avoiding static routes)
      if (sec.id === "main") {
        const staticMainLinks = sec.links.filter(
          (l) => staticBaseHrefs.has(l.href.toLowerCase()) || l.isCustom
        );
        const dynamicPageLinks: SitemapLink[] = pages
          .filter(
            (p) =>
              p &&
              p.slug &&
              !staticBaseHrefs.has(`/${p.slug.toLowerCase()}`) &&
              !p.slug.startsWith("admin")
          )
          .map((p) => ({
            id: `page-${p.slug}`,
            title: p.title,
            href: `/${p.slug}`,
            description: p.description || "Custom dynamic page",
          }));

        mergedLinks = [...staticMainLinks, ...dynamicPageLinks];
      }

      return {
        ...sec,
        links: sanitizeAndDeduplicateLinks(mergedLinks),
      };
    });

    const newConfig: SitemapConfig = {
      ...current,
      sections: updatedSections,
      lastUpdated: new Date().toISOString(),
    };

    saveLocalSitemapConfig(newConfig);
    return newConfig;
  } catch (err) {
    console.error("Failed to sync sitemap config with API", err);
    return current;
  }
}
