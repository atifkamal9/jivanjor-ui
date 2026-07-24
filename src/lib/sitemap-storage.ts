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
export const DEFAULT_HERO_DESCRIPTION = "Find direct links to all main pages, product categories, editorial guides, and support resources across Jivanjor.";

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
      return {
        heroTitle: parsed.heroTitle || DEFAULT_HERO_TITLE,
        heroDescription: parsed.heroDescription || DEFAULT_HERO_DESCRIPTION,
        ...parsed,
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
    const updated = {
      ...config,
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

export async function syncSitemapConfigWithApi(existingConfig?: SitemapConfig): Promise<SitemapConfig> {
  const current = existingConfig || getLocalSitemapConfig();

  try {
    const [categories, blogs, pages] = await Promise.all([
      api.getCategories().catch(() => [] as Category[]),
      api.getBlogPosts().catch(() => [] as BlogPost[]),
      api.getPages().catch(() => [] as Page[]),
    ]);

    const updatedSections = current.sections.map((sec) => {
      // Sync dynamic categories
      if (sec.id === "categories") {
        const dynamicCatLinks: SitemapLink[] = categories.map((cat) => ({
          id: `cat-${cat.id || cat.slug}`,
          title: cat.name,
          href: `/categories/${cat.slug}`,
          description: cat.description || `Category showcase for ${cat.name}`,
        }));
        
        // Preserve any custom links added by admin
        const customLinks = sec.links.filter((l) => l.isCustom);
        return {
          ...sec,
          links: dynamicCatLinks.length > 0 ? [...dynamicCatLinks, ...customLinks] : sec.links,
        };
      }

      // Sync dynamic editorial blogs
      if (sec.id === "editorial") {
        const dynamicBlogLinks: SitemapLink[] = blogs.map((post) => ({
          id: `blog-${post.id || post.slug}`,
          title: post.title,
          href: `/blog/${post.slug}`,
          description: post.tldr || `Published article on ${post.category || "Woodworking"}`,
        }));

        const customLinks = sec.links.filter((l) => l.isCustom);
        return {
          ...sec,
          links: dynamicBlogLinks.length > 0 ? [...dynamicBlogLinks, ...customLinks] : sec.links,
        };
      }

      // Sync dynamic custom pages
      if (sec.id === "main" && pages.length > 0) {
        const dynamicPageLinks: SitemapLink[] = pages.map((p) => ({
          id: `page-${p.id || p.slug}`,
          title: p.title,
          href: `/${p.slug}`,
          description: p.description || "Custom dynamic page",
        }));

        const existingHrefs = new Set(sec.links.map((l) => l.href));
        const newPageLinks = dynamicPageLinks.filter((l) => !existingHrefs.has(l.href));
        return {
          ...sec,
          links: [...sec.links, ...newPageLinks],
        };
      }

      return sec;
    });

    const newConfig: SitemapConfig = {
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
