import axios from "axios";
import { getAuthToken } from "./auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: string[];
  created_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  shortDescription?: string;
  category_id: string;
  category_ids?: string[];
  categoryIds?: string[];
  material_id: string;
  metadata: string; // comma-separated or JSON
  image?: string;
  backgroundImage?: string;
  themeColor?: string;
  overviewBullets?: { text: string; icon: string }[];
  techSpecs?: { key: string; value: string }[];
  packSizes?: string[];
  documentUrl?: string;
  usps?: { title: string; description: string; icon: string }[];
  applications?: { title: string; description: string; imageA: string; imageB: string; link?: string; url?: string }[];
  videoUrl?: string;
  videoThumbnail?: string;
  faqs?: { question: string; answer: string }[];
  relatedProducts?: string[];
  techSpecsDescription?: string;
  appsTitle?: string;
  appsDescription?: string;
  videoTitle?: string;
  videoDescription?: string;
  faqsTitle?: string;
  faqsDescription?: string;
  relatedTitle?: string;
  techResourceTitle?: string;
  techResourceDescription?: string;
  techResourceFileUrl?: string;
  enquireText?: string;
  enquireLink?: string;
  rightChoice?: { title?: string; subtitle?: string; ctaText?: string; ctaLink?: string; bgImage?: string; bgImageMobile?: string; items?: any[] };
  right_choice?: any;
  isVisible?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_category: string; // id or empty string
  description: string;
  tagline?: string;
  icon?: string; // Pre-stored platform icon key (e.g. Lucide icon name)
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
  rightChoiceTitle?: string;
  rightChoiceSubtitle?: string;
  rightChoiceCtaText?: string;
  rightChoiceCtaLink?: string;
  rightChoice?: { title?: string; subtitle?: string; ctaText?: string; ctaLink?: string };
  hideInMenu?: boolean;
  isVisible?: boolean;
  displayOrder?: number;
}

export interface Material {
  id: string;
  name: string;
  description: string;
}

export interface ContactDetailItem {
  label: string;
  value: string;
  icon: string;
}

export interface ContactSection {
  title: string;
  details: ContactDetailItem[];
}

export interface ContactPageSettings {
  heroImage?: string;
  heroTitle?: string;
  mainHeading?: string;
  watermarkImage?: string;
  sections?: ContactSection[];
}

export interface SiteSettings {
  id?: string;
  desktopLogo?: string;
  mobileLogo?: string;
  headerDesktopLogo?: string;
  headerMobileLogo?: string;
  footerDesktopLogo?: string;
  footerMobileLogo?: string;
  categoryHeroCover?: string;
  categoryCardBg?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
  };
  rightChoiceBanner?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  };
  contactPage?: ContactPageSettings;
  updatedAt?: string;
}


export interface UseCase {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  category?: string;
  image?: string;
}

export interface Issue {
  id: string;
  issue_title: string;
  slug: string;
  problem: string;
  solution: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  author_description?: string;
  authorDescription?: string;
  author_avatar?: string;
  authorAvatar?: string;
  publish_date: string;
  updated_at?: string;
  updatedAt?: string;
  image?: string;
  tldr?: string;
}

export interface SeoMetadata {
  id: string;
  page_type: string; // 'home', 'product', 'category', 'blog', 'use-case', 'issue', 'static'
  page_id: string; // ID of record or 'home'
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  image?: string;
}

// Mapped to jivanjor-server Zod specs
export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  activeTemplateId?: string | null;
  sections?: any;
  updatedAt?: string;
  createdAt?: string;
  updated_at?: string;
  created_at?: string;
}

export interface PageTemplateSection {
  id: string;
  type: "hero" | "features" | "text" | "cta" | "testimonials";
  title: string;
  subtitle?: string;
  content?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
}

export interface PageTemplate {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sections: PageTemplateSection[];
  rawSections?: any;
}

// Set up Axios Client
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://jivanjor-server.onrender.com/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor to automatically add JWT Token
client.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Mappers for backward compatibility with UI schemas
function mapCategoryFromBackend(cat: any): Category {
  let description = cat.description || "";
  let tagline = cat.tagline || "";
  let categoryTitle = "";
  let categoryDescription = "";
  let resourcesTitle = "";
  let resourcesDescription = "";
  let heroImage = "";
  let researchTitle = "";
  let researchDescription = "";
  let researchCtaText = "";
  let researchCtaLink = "";
  let researchImage1 = "";
  let researchImage2 = "";
  let rightChoiceTitle = "";
  let rightChoiceSubtitle = "";
  let rightChoiceCtaText = "";
  let rightChoiceCtaLink = "";
  let hideInMenu = Boolean(cat.hideInMenu || cat.hiddenInMenu || false);

  if (description.startsWith("{") && description.endsWith("}")) {
    try {
      const parsed = JSON.parse(description);
      description = parsed.description || "";
      tagline = cat.tagline || parsed.tagline || "";
      categoryTitle = parsed.categoryTitle || "";
      categoryDescription = parsed.categoryDescription || "";
      resourcesTitle = parsed.resourcesTitle || parsed.researchTitle || "";
      resourcesDescription = parsed.resourcesDescription || parsed.researchDescription || "";
      heroImage = parsed.heroImage || "";
      researchTitle = parsed.researchTitle || parsed.resourcesTitle || "";
      researchDescription = parsed.researchDescription || parsed.resourcesDescription || "";
      researchCtaText = parsed.researchCtaText || "";
      researchCtaLink = parsed.researchCtaLink || "";
      researchImage1 = parsed.researchImage1 || "";
      researchImage2 = parsed.researchImage2 || "";
      rightChoiceTitle = parsed.rightChoiceTitle || parsed.rightChoice?.title || "";
      rightChoiceSubtitle = parsed.rightChoiceSubtitle || parsed.rightChoice?.subtitle || "";
      rightChoiceCtaText = parsed.rightChoiceCtaText || parsed.rightChoice?.ctaText || "";
      rightChoiceCtaLink = parsed.rightChoiceCtaLink || parsed.rightChoice?.ctaLink || "";
      if (parsed.hideInMenu !== undefined || parsed.hiddenInMenu !== undefined) {
        hideInMenu = Boolean(parsed.hideInMenu || parsed.hiddenInMenu);
      }
    } catch (e) {
      // ignore
    }
  }

  const isVisible = cat.isVisible !== undefined
    ? Boolean(cat.isVisible)
    : (hideInMenu !== undefined ? !hideInMenu : true);

  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    parent_category: cat.parentId || "",
    description,
    tagline: cat.tagline || tagline,
    categoryTitle,
    categoryDescription,
    resourcesTitle,
    resourcesDescription,
    heroImage,
    researchTitle,
    researchDescription,
    researchCtaText,
    researchCtaLink,
    researchImage1,
    researchImage2,
    rightChoiceTitle,
    rightChoiceSubtitle,
    rightChoiceCtaText,
    rightChoiceCtaLink,
    rightChoice: rightChoiceTitle ? {
      title: rightChoiceTitle,
      subtitle: rightChoiceSubtitle,
      ctaText: rightChoiceCtaText,
      ctaLink: rightChoiceCtaLink,
    } : undefined,
    icon: cat.icon || "",
    hideInMenu: !isVisible,
    isVisible,
    displayOrder: cat.displayOrder ?? cat.display_order ?? 0,
  };
}

function mapMaterialFromBackend(mat: any): Material {
  return {
    id: mat.id,
    name: mat.materialName,
    description: mat.description || "",
  };
}

function mapProductFromBackend(prod: any): Product {
  let metadataStr = "";
  let themeColor = "#0498AA";
  let overviewBullets: { text: string; icon: string }[] = [];
  let techSpecs: { key: string; value: string }[] = [];
  let packSizes: string[] = [];
  let documentUrl = "";
  let usps: { title: string; description: string; icon: string }[] = [];
  let applications: { title: string; description: string; imageA: string; imageB: string; link?: string; url?: string }[] = [];
  let videoUrl = "";
  let videoThumbnail = "";
  let faqs: { question: string; answer: string }[] = [];
  let relatedProducts: string[] = [];

  let techSpecsDescription = "Watershield provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.";
  let appsTitle = "Engineered for the Task at Hand";
  let appsDescription = `Explore where Jivanjor fits across furniture, laminates, plywood, boards and professional woodwork applications.`;
  let videoTitle = "See product in Action";
  let videoDescription = "Watch how trade professionals achieve flawless, high-coverage bonding in record time.";
  let faqsTitle = "FAQs";
  let faqsDescription = "Find quick answers about product use, coverage, setting time, pack sizes and technical details.";
  let relatedTitle = "Related Products";
  let techResourceTitle = "";
  let techResourceDescription = "";
  let techResourceFileUrl = "";
  let enquireText = "Enquire Now";
  let enquireLink = "/contact";

  let backgroundImage = "";

  if (prod.metadata) {
    if (typeof prod.metadata === "string") {
      metadataStr = prod.metadata;
    } else if (typeof prod.metadata === "object") {
      if ("themeColor" in prod.metadata || "backgroundImage" in prod.metadata || "enquireText" in prod.metadata) {
        themeColor = prod.metadata.themeColor || "#0498AA";
        backgroundImage = prod.metadata.backgroundImage || prod.metadata.bg_image || "";
        enquireText = prod.metadata.enquireText || prod.metadata.enquire_text || "Enquire Now";
        enquireLink = prod.metadata.enquireLink || prod.metadata.enquire_link || "/contact";

        let rawBullets = prod.metadata.overviewBullets || [];
        overviewBullets = rawBullets.map((b: any, idx: number) => {
          if (typeof b === "string") {
            return { text: b, icon: `image ${18 + (idx % 3)}.svg` };
          }
          return {
            text: b?.text || "",
            icon: b?.icon || `image ${18 + (idx % 3)}.svg`
          };
        });

        techSpecs = prod.metadata.techSpecs || [];
        packSizes = prod.metadata.packSizes || [];
        documentUrl = prod.metadata.documentUrl || "";
        usps = prod.metadata.usps || [];
        applications = prod.metadata.applications || [];
        videoUrl = prod.metadata.videoUrl || "";
        videoThumbnail = prod.metadata.videoThumbnail || "";
        faqs = prod.metadata.faqs || [];
        relatedProducts = prod.metadata.relatedProducts || [];

        techSpecsDescription = prod.metadata.techSpecsDescription || "Watershield provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.";
        appsTitle = prod.metadata.appsTitle || "Engineered for the Task at Hand";
        appsDescription = prod.metadata.appsDescription || `Explore where Jivanjor fits across furniture, laminates, plywood, boards and professional woodwork applications.`;
        videoTitle = prod.metadata.videoTitle || "See product in Action";
        videoDescription = prod.metadata.videoDescription || "Watch how trade professionals achieve flawless, high-coverage bonding in record time.";
        faqsTitle = prod.metadata.faqsTitle || "FAQs";
        faqsDescription = prod.metadata.faqsDescription || "Find quick answers about product use, coverage, setting time, pack sizes and technical details.";
        relatedTitle = prod.metadata.relatedTitle || "Related Products";
        techResourceTitle = prod.metadata.techResourceTitle || "";
        techResourceDescription = prod.metadata.techResourceDescription || "";
        techResourceFileUrl = prod.metadata.techResourceFileUrl || "";

        metadataStr = prod.metadata.tags || (overviewBullets ? overviewBullets.map(b => b.text).join(", ") : "");
      } else if ("tags" in prod.metadata && typeof prod.metadata.tags === "string") {
        metadataStr = prod.metadata.tags;
      } else if ("list" in prod.metadata && Array.isArray(prod.metadata.list)) {
        metadataStr = prod.metadata.list.join(", ");
      } else {
        metadataStr = Object.entries(prod.metadata)
          .map(([k, v]) =>
            Array.isArray(v) ? `${k}: ${v.join("/")}` : `${k}: ${v}`,
          )
          .join(", ");
      }
    }
  }

  if (overviewBullets.length === 0) {
    if (metadataStr) {
      overviewBullets = metadataStr.split(",").map((f: string) => f.trim()).filter(Boolean).map((b, idx) => ({
        text: b,
        icon: `image ${18 + (idx % 3)}.svg`
      }));
    }
    if (overviewBullets.length === 0) {
      overviewBullets = [
        { text: "Water Resistant", icon: "image 18.svg" },
        { text: "Super Fast Setting - 1 Hour", icon: "image 19.svg" },
        { text: "Anti-Bubble Technology", icon: "image 20.svg" },
        { text: "Superior Coverage", icon: "Texture.svg" }
      ];
    }
  }

  if (techSpecs.length === 0) {
    techSpecs = [
      { key: "Appearance", value: "Milk White" },
      { key: "Solids", value: "50-53%" },
      { key: "Viscosity", value: "150-250 Poise" },
      { key: "Coverage", value: "60-70 Sqft/Kg" }
    ];
  }

  if (packSizes.length === 0) {
    packSizes = ["0.6 Kg", "1 Kg", "2 Kg", "5 Kg", "10 Kg", "20 Kg", "30 Kg", "50 Kg", "60 Kg"];
  }

  if (usps.length === 0) {
    usps = [
      { title: "Faster Site Rotation", description: "Fast setting time helps professionals complete work quicker and move between jobs more efficiently.", icon: "Cycle-arrow.svg" },
      { title: "Smooth Spreadability", description: "Superior flow and easy spreading help reduce wastage and support better coverage.", icon: "Texture.svg" },
      { title: "Solvent-Free Safety", description: "Water-based, non-flammable and non-toxic formulation for safer handling during application.", icon: "Asterisk.svg" },
      { title: "Clean Finish After Drying", description: "Dries into a clear transparent film, helping maintain a neat finish around edges and joints.", icon: "Circles-seven.svg" }
    ];
  }

  if (applications.length === 0) {
    applications = [
      { title: "Laminate to Plywood Bonding", description: "Suitable for bonding laminate and plywood where strong adhesion, smooth spreadability and anti-bubble performance are important.", imageA: "/images/Rectangle 34.png", imageB: "/images/Rectangle 34 (1).png", link: "" },
      { title: "Wood to Wood Joinery", description: "Designed for finger jointing, structural dowelling, and solid wood frames. Ensures high tensile strength and durable bonding.", imageA: "/images/Rectangle 35.png", imageB: "/images/Rectangle 30.png", link: "" }
    ];
  }

  if (!videoThumbnail) {
    videoThumbnail = "/images/Rectangle 4.png";
  }

  let shortDescription = "";
  if (prod.metadata && typeof prod.metadata === "object") {
    shortDescription = prod.metadata.shortDescription || prod.metadata.short_description || "";
  } else {
    shortDescription = prod.shortDescription || prod.short_description || "";
  }

  return {
    id: prod.id,
    name: prod.name,
    slug: prod.slug,
    description: prod.description || "",
    short_description: shortDescription,
    shortDescription: shortDescription,
    category_id: prod.categoryId,
    category_ids: prod.categoryIds || prod.category_ids || (prod.categoryId ? [prod.categoryId] : []),
    categoryIds: prod.categoryIds || prod.category_ids || (prod.categoryId ? [prod.categoryId] : []),
    material_id: prod.materialId || "",
    metadata: metadataStr,
    image: prod.image || "/images/Watershield.png",
    themeColor,
    backgroundImage,
    overviewBullets,
    techSpecs,
    packSizes,
    documentUrl,
    usps,
    applications,
    videoUrl,
    videoThumbnail,
    faqs,
    relatedProducts,
    techSpecsDescription,
    appsTitle,
    appsDescription,
    videoTitle,
    videoDescription,
    faqsTitle,
    faqsDescription,
    relatedTitle,
    techResourceTitle,
    techResourceDescription,
    techResourceFileUrl,
    enquireText,
    enquireLink,
    rightChoice: prod.rightChoice || prod.right_choice || (prod.metadata && typeof prod.metadata === "object" ? prod.metadata.rightChoice || prod.metadata.right_choice : undefined),
    isVisible: prod.isVisible !== undefined ? Boolean(prod.isVisible) : (prod.metadata && typeof prod.metadata === "object" && prod.metadata.isVisible !== undefined ? Boolean(prod.metadata.isVisible) : true),
  };
}

function mapIssueFromBackend(iss: any): Issue {
  return {
    id: iss.id,
    issue_title: iss.issueTitle,
    slug: iss.slug,
    problem: iss.problem || "",
    solution: iss.solution || "",
  };
}

function mapBlogPostFromBackend(post: any): BlogPost {
  let tagsArray: string[] = [];
  if (post.tags) {
    if (Array.isArray(post.tags)) {
      tagsArray = post.tags;
    } else if (typeof post.tags === "string") {
      tagsArray = post.tags.split(",").map((t: string) => t.trim());
    } else if (typeof post.tags === "object" && "tags" in post.tags) {
      tagsArray = (post.tags as any).tags;
    }
  }

  const rawPublishDate = post.publishDate || post.publish_date || post.createdAt || post.created_at;
  const rawUpdatedAt = post.updatedAt || post.updated_at || post.updated_At || rawPublishDate;

  const publish_date = rawPublishDate
    ? new Date(rawPublishDate).toISOString().split("T")[0]
    : "";
  const updated_at = rawUpdatedAt
    ? new Date(rawUpdatedAt).toISOString().split("T")[0]
    : publish_date;

  const author_description =
    post.author_description || post.authorDescription || post.authorDesc || "";
  const author_avatar =
    post.author_avatar || post.authorAvatar || post.authorImage || "";

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content || "",
    category: post.category || "",
    tags: tagsArray,
    author: post.author || "",
    author_description,
    authorDescription: author_description,
    author_avatar,
    authorAvatar: author_avatar,
    publish_date,
    updated_at,
    updatedAt: updated_at,
    image: post.image || "/images/Rectangle 4.png",
    tldr: post.tldr || "",
  };
}

function mapSeoFromBackend(seo: any): SeoMetadata {
  const isHome =
    seo.pageType === "STATIC" && (seo.pageId === "STATIC_PAGE" || !seo.pageId);
  return {
    id: seo.id,
    page_type: isHome
      ? "home"
      : (seo.pageType || "").toLowerCase().replace("_", "-"),
    page_id: isHome ? "home" : seo.pageId || "",
    meta_title: seo.metaTitle || "",
    meta_description: seo.metaDescription || "",
    canonical_url: seo.canonicalUrl || "",
    image: seo.image || "",
  };
}

function mapTemplateFromBackend(temp: any): PageTemplate {
  let sectionsArray: PageTemplateSection[] = [];
  if (Array.isArray(temp.sections)) {
    sectionsArray = temp.sections;
  } else if (temp.sections && typeof temp.sections === "object") {
    sectionsArray = Object.entries(temp.sections).map(
      ([key, val]: [string, any], idx) => ({
        id: val.id || `sec-${key}-${idx}`,
        type: (val.type || key) as any,
        title: val.title || "",
        subtitle: val.subtitle || val.subtitleText || "",
        content: val.content || val.description || "",
        image: val.image || val.backgroundImage || val.imageUrl || "",
        ctaText: val.ctaText || "",
        ctaLink: val.ctaLink || "",
        order: val.order || idx + 1,
      }),
    );
  }
  return {
    id: temp.id,
    name: temp.name,
    slug: temp.slug,
    isActive: !!temp.isActive,
    sections: sectionsArray,
    rawSections: temp.sections,
  };
}

// API methods calling axios
export const api = {
  // UPLOADS
  uploadFile: async (
    file: File,
    folder?: string,
    bucket?: string,
  ): Promise<{
    url: string;
    path: string;
    bucket: string;
    size: number;
    mimeType: string;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) formData.append("folder", folder);
    if (bucket) formData.append("bucket", bucket);

    const res = await client.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data?.data;
  },

  // PRODUCTS
  getProducts: async (params?: { limit?: number; page?: number; categoryId?: string; search?: string }): Promise<Product[]> => {
    const query = new URLSearchParams();
    // Default to a high limit so all products are fetched (backend defaults to 10)
    query.set("limit", String(params?.limit ?? 9999));
    if (params?.page) query.set("page", String(params.page));
    if (params?.categoryId) query.set("categoryId", params.categoryId);
    if (params?.search) query.set("search", params.search);
    const res = await client.get(`/products?${query.toString()}`);
    const products = res.data?.data?.products || [];
    return Array.isArray(products) ? products.map(mapProductFromBackend) : [];
  },
  getProductById: async (id: string): Promise<Product | undefined> => {
    const res = await client.get(`/products/${id}`);
    const product = res.data?.data?.product;
    return product ? mapProductFromBackend(product) : undefined;
  },
  saveProduct: async (
    product: Omit<Product, "id"> & { id?: string },
  ): Promise<Product> => {
    const payload = {
      name: product.name,
      description: product.description,
      shortDescription: product.short_description || product.shortDescription || null,
      short_description: product.short_description || product.shortDescription || null,
      categoryId: product.category_id,
      categoryIds: product.category_ids || product.categoryIds || [product.category_id],
      materialId: product.material_id || null,
      metadata: {
        shortDescription: product.short_description || product.shortDescription || "",
        tags: product.metadata,
        themeColor: product.themeColor || "#0498AA",
        backgroundImage: product.backgroundImage || "",
        overviewBullets: product.overviewBullets || [],
        techSpecs: product.techSpecs || [],
        packSizes: product.packSizes || [],
        documentUrl: product.documentUrl || "",
        usps: product.usps || [],
        applications: product.applications || [],
        videoUrl: product.videoUrl || "",
        videoThumbnail: product.videoThumbnail || "",
        faqs: product.faqs || [],
        relatedProducts: product.relatedProducts || [],
        techSpecsDescription: product.techSpecsDescription || "",
        appsTitle: product.appsTitle || "",
        appsDescription: product.appsDescription || "",
        videoTitle: product.videoTitle || "",
        videoDescription: product.videoDescription || "",
        faqsTitle: product.faqsTitle || "",
        faqsDescription: product.faqsDescription || "",
        relatedTitle: product.relatedTitle || "",
        techResourceTitle: product.techResourceTitle || "",
        techResourceDescription: product.techResourceDescription || "",
        techResourceFileUrl: product.techResourceFileUrl || "",
        enquireText: product.enquireText || "Enquire Now",
        enquireLink: product.enquireLink || "/contact",
        rightChoice: product.rightChoice || (product as any).right_choice || null,
        isVisible: product.isVisible !== undefined ? product.isVisible : true,
      },
      rightChoice: product.rightChoice || (product as any).right_choice || null,
      image: product.image || null,
      isVisible: product.isVisible !== undefined ? product.isVisible : true,
    };
    if (product.id) {
      const res = await client.put(`/products/${product.id}`, payload);
      return mapProductFromBackend(res.data?.data?.product);
    } else {
      const res = await client.post("/products", payload);
      return mapProductFromBackend(res.data?.data?.product);
    }
  },
  deleteProduct: async (id: string): Promise<boolean> => {
    await client.delete(`/products/${id}`);
    return true;
  },

  // CATEGORIES
  getCategories: async (): Promise<Category[]> => {
    const res = await client.get("/categories");
    const categories = res.data?.data?.categories || [];
    return Array.isArray(categories)
      ? categories.map(mapCategoryFromBackend)
      : [];
  },
  getCategoryById: async (id: string): Promise<Category | undefined> => {
    const res = await client.get(`/categories/${id}`);
    const category = res.data?.data?.category;
    return category ? mapCategoryFromBackend(category) : undefined;
  },
  saveCategory: async (
    category: Omit<Category, "id"> & { id?: string },
  ): Promise<Category> => {
    const serializedDescription = JSON.stringify({
      description: category.description || "",
      categoryTitle: category.categoryTitle || "",
      categoryDescription: category.categoryDescription || "",
      resourcesTitle: category.resourcesTitle || category.researchTitle || "",
      resourcesDescription: category.resourcesDescription || category.researchDescription || "",
      heroImage: category.heroImage || "",
      researchTitle: category.researchTitle || category.resourcesTitle || "",
      researchDescription: category.researchDescription || category.resourcesDescription || "",
      researchCtaText: category.researchCtaText || "",
      researchCtaLink: category.researchCtaLink || "",
      researchImage1: category.researchImage1 || "",
      researchImage2: category.researchImage2 || "",
      rightChoiceTitle: category.rightChoiceTitle || category.rightChoice?.title || "",
      rightChoiceSubtitle: category.rightChoiceSubtitle || category.rightChoice?.subtitle || "",
      rightChoiceCtaText: category.rightChoiceCtaText || category.rightChoice?.ctaText || "",
      rightChoiceCtaLink: category.rightChoiceCtaLink || category.rightChoice?.ctaLink || "",
      hideInMenu: category.isVisible !== undefined ? !category.isVisible : (category.hideInMenu ?? false),
      isVisible: category.isVisible !== undefined ? category.isVisible : !(category.hideInMenu ?? false),
    });

    const isVisibleVal = category.isVisible !== undefined ? category.isVisible : !(category.hideInMenu ?? false);

    const payload = {
      name: category.name,
      parentId: category.parent_category || null,
      description: serializedDescription,
      tagline: category.tagline || null,
      icon: category.icon || null,
      isVisible: isVisibleVal,
      hideInMenu: !isVisibleVal,
    };
    if (category.id) {
      const res = await client.put(`/categories/${category.id}`, payload);
      return mapCategoryFromBackend(res.data?.data?.category);
    } else {
      const res = await client.post("/categories", payload);
      return mapCategoryFromBackend(res.data?.data?.category);
    }
  },
  deleteCategory: async (id: string): Promise<boolean> => {
    await client.delete(`/categories/${id}`);
    return true;
  },
  reorderCategories: async (items: { id: string; displayOrder: number }[]): Promise<boolean> => {
    try {
      await client.put("/categories/reorder", { items });
      return true;
    } catch (err) {
      console.error("Failed to reorder categories:", err);
      return false;
    }
  },

  // MATERIALS
  getMaterials: async (): Promise<Material[]> => {
    const res = await client.get("/materials");
    const list = res.data?.data?.materials || [];
    return Array.isArray(list) ? list.map(mapMaterialFromBackend) : [];
  },
  getMaterialById: async (id: string): Promise<Material | undefined> => {
    const res = await client.get(`/materials/${id}`);
    const material = res.data?.data?.material;
    return material ? mapMaterialFromBackend(material) : undefined;
  },
  saveMaterial: async (
    material: Omit<Material, "id"> & { id?: string },
  ): Promise<Material> => {
    const payload = {
      materialName: material.name,
      description: material.description || "",
    };
    if (material.id) {
      const res = await client.put(`/materials/${material.id}`, payload);
      return mapMaterialFromBackend(res.data?.data?.material);
    } else {
      const res = await client.post("/materials", payload);
      return mapMaterialFromBackend(res.data?.data?.material);
    }
  },
  deleteMaterial: async (id: string): Promise<boolean> => {
    await client.delete(`/materials/${id}`);
    return true;
  },

  // USE CASES
  getUseCases: async (): Promise<UseCase[]> => {
    const res = await client.get("/use-cases");
    const list = res.data?.data?.useCases || [];
    return Array.isArray(list) ? list : [];
  },
  getUseCaseById: async (id: string): Promise<UseCase | undefined> => {
    const res = await client.get(`/use-cases/${id}`);
    return res.data?.data?.useCase;
  },
  saveUseCase: async (
    useCase: Omit<UseCase, "id"> & { id?: string },
  ): Promise<UseCase> => {
    const payload = {
      title: useCase.title,
      description: useCase.description,
      content: useCase.content || null,
      category: useCase.category || null,
      image: useCase.image || null,
    };
    if (useCase.id) {
      const res = await client.put(`/use-cases/${useCase.id}`, payload);
      return res.data?.data?.useCase;
    } else {
      const res = await client.post("/use-cases", payload);
      return res.data?.data?.useCase;
    }
  },
  deleteUseCase: async (id: string): Promise<boolean> => {
    await client.delete(`/use-cases/${id}`);
    return true;
  },

  // ISSUES
  getIssues: async (): Promise<Issue[]> => {
    const res = await client.get("/issues");
    const list = res.data?.data?.issues || [];
    return Array.isArray(list) ? list.map(mapIssueFromBackend) : [];
  },
  getIssueById: async (id: string): Promise<Issue | undefined> => {
    const res = await client.get(`/issues/${id}`);
    const issue = res.data?.data?.issue;
    return issue ? mapIssueFromBackend(issue) : undefined;
  },
  saveIssue: async (
    issue: Omit<Issue, "id"> & { id?: string },
  ): Promise<Issue> => {
    const payload = {
      issueTitle: issue.issue_title,
      problem: issue.problem,
      solution: issue.solution,
    };
    if (issue.id) {
      const res = await client.put(`/issues/${issue.id}`, payload);
      return mapIssueFromBackend(res.data?.data?.issue);
    } else {
      const res = await client.post("/issues", payload);
      return mapIssueFromBackend(res.data?.data?.issue);
    }
  },
  deleteIssue: async (id: string): Promise<boolean> => {
    await client.delete(`/issues/${id}`);
    return true;
  },

  // BLOG POSTS
  getBlogPosts: async (): Promise<BlogPost[]> => {
    const res = await client.get("/blogs");
    const blogs = res.data?.data?.blogs || [];
    const mapped = Array.isArray(blogs) ? blogs.map(mapBlogPostFromBackend) : [];
    return mapped.sort((a, b) => {
      const dateA = new Date(a.updated_at || a.updatedAt || a.publish_date || 0).getTime();
      const dateB = new Date(b.updated_at || b.updatedAt || b.publish_date || 0).getTime();
      return dateB - dateA;
    });
  },
  getBlogPostById: async (id: string): Promise<BlogPost | undefined> => {
    const res = await client.get(`/blogs/${id}`);
    const blog = res.data?.data?.blog;
    return blog ? mapBlogPostFromBackend(blog) : undefined;
  },
  saveBlogPost: async (
    blogPost: Omit<BlogPost, "id"> & { id?: string },
  ): Promise<BlogPost> => {
    const payload = {
      title: blogPost.title,
      content: blogPost.content,
      category: blogPost.category,
      tags: blogPost.tags,
      author: blogPost.author,
      authorDescription: blogPost.author_description || blogPost.authorDescription || null,
      author_description: blogPost.author_description || blogPost.authorDescription || null,
      authorAvatar: blogPost.author_avatar || blogPost.authorAvatar || null,
      author_avatar: blogPost.author_avatar || blogPost.authorAvatar || null,
      publishDate: blogPost.publish_date
        ? new Date(blogPost.publish_date).toISOString()
        : new Date().toISOString(),
      image: blogPost.image || null,
      tldr: blogPost.tldr || null,
    };
    if (blogPost.id) {
      const res = await client.put(`/blogs/${blogPost.id}`, payload);
      return mapBlogPostFromBackend(res.data?.data?.blog);
    } else {
      const res = await client.post("/blogs", payload);
      return mapBlogPostFromBackend(res.data?.data?.blog);
    }
  },
  deleteBlogPost: async (id: string): Promise<boolean> => {
    await client.delete(`/blogs/${id}`);
    return true;
  },

  // SEO METADATA
  getSeoMetadata: async (): Promise<SeoMetadata[]> => {
    const res = await client.get("/seo");
    const list = res.data?.data?.seoList || res.data?.data?.seo || [];
    return Array.isArray(list) ? list.map(mapSeoFromBackend) : [];
  },
  getSeoMetadataById: async (id: string): Promise<SeoMetadata | undefined> => {
    const res = await client.get(`/seo/${id}`);
    const seo = res.data?.data?.seo;
    return seo ? mapSeoFromBackend(seo) : undefined;
  },
  saveSeoMetadata: async (
    seo: Omit<SeoMetadata, "id"> & { id?: string },
  ): Promise<SeoMetadata> => {
    const isHome = seo.page_type === "home";
    const payload = {
      pageType: isHome
        ? "STATIC"
        : seo.page_type.toUpperCase().replace("-", "_"),
      pageId: isHome ? null : seo.page_id || null,
      metaTitle: seo.meta_title,
      metaDescription: seo.meta_description,
      canonicalUrl: seo.canonical_url || null,
      image: seo.image || null,
    };
    const res = await client.post("/seo", payload);
    return mapSeoFromBackend(res.data?.data?.seo);
  },
  deleteSeoMetadata: async (id: string): Promise<boolean> => {
    await client.delete(`/seo/${id}`);
    return true;
  },

  // DYNAMIC PAGES
  getPages: async (): Promise<Page[]> => {
    const res = await client.get("/pages");
    const pages = res.data?.data?.pages || [];
    return Array.isArray(pages) ? pages : [];
  },
  getPageById: async (id: string): Promise<Page | undefined> => {
    const res = await client.get(`/pages/${id}`);
    return res.data?.data?.page;
  },
  savePage: async (page: Omit<Page, "id"> & { id?: string; sections?: any }): Promise<Page> => {
    if (page.id) {
      const payload = {
        title: page.title,
        slug: page.slug,
        description: page.description || "",
        activeTemplateId: page.activeTemplateId,
        sections: page.sections,
      };
      const res = await client.put(`/pages/${page.id}`, payload);
      return res.data?.data?.page;
    } else {
      const payload = {
        title: page.title,
        slug: page.slug,
        description: page.description || "",
        activeTemplateId: page.activeTemplateId,
        sections: page.sections,
      };
      const res = await client.post("/pages", payload);
      return res.data?.data?.page;
    }
  },
  deletePage: async (id: string): Promise<boolean> => {
    await client.delete(`/pages/${id}`);
    return true;
  },

  // PAGE TEMPLATES
  getTemplates: async (): Promise<PageTemplate[]> => {
    const res = await client.get("/templates");
    const templates = res.data?.data?.templates || res.data?.templates || [];
    return Array.isArray(templates)
      ? templates.map(mapTemplateFromBackend)
      : [];
  },
  getTemplateById: async (id: string): Promise<PageTemplate | undefined> => {
    const res = await client.get(`/templates/${id}`);
    const temp = res.data?.data?.template || res.data?.data;
    return temp ? mapTemplateFromBackend(temp) : undefined;
  },
  saveTemplate: async (
    template: Omit<PageTemplate, "id" | "isActive"> & { id?: string },
  ): Promise<PageTemplate> => {
    const payload = {
      name: template.name,
      sections: template.sections,
    };
    if (template.id) {
      const res = await client.put(`/templates/${template.id}`, payload);
      return mapTemplateFromBackend(res.data?.data?.template || res.data?.data);
    } else {
      const res = await client.post("/templates", payload);
      return mapTemplateFromBackend(res.data?.data?.template || res.data?.data);
    }
  },
  deleteTemplate: async (id: string): Promise<boolean> => {
    await client.delete(`/templates/${id}`);
    return true;
  },
  activateTemplate: async (id: string): Promise<PageTemplate | undefined> => {
    const res = await client.post(`/templates/${id}/activate`);
    const temp = res.data?.data?.template || res.data?.data;
    return temp ? mapTemplateFromBackend(temp) : undefined;
  },
  getActiveTemplateForPage: async (
    pageSlug: string,
  ): Promise<PageTemplate | undefined> => {
    try {
      const res = await client.get(`/templates/active/page/${pageSlug}`);
      const temp = res.data?.data?.template || res.data?.data;
      return temp ? mapTemplateFromBackend(temp) : undefined;
    } catch (err) {
      console.error(`Failed to get active template for page ${pageSlug}`, err);
      return undefined;
    }
  },

  // MENU MANAGEMENT
  getHeaderMenu: async (): Promise<{ draftItems: any[]; publishedItems: any[] }> => {
    try {
      const res = await client.get("/menus/header");
      const menu = res.data?.data?.menu;
      return {
        draftItems: menu?.draftItems || [],
        publishedItems: menu?.publishedItems || [],
      };
    } catch (err) {
      console.error("Failed to fetch header menu:", err);
      return { draftItems: [], publishedItems: [] };
    }
  },
  updateDraftHeaderMenu: async (items: any[]): Promise<any> => {
    const res = await client.put("/menus/header", { items });
    return res.data?.data?.menu;
  },
  publishHeaderMenu: async (): Promise<any> => {
    const res = await client.post("/menus/header/publish");
    return res.data?.data?.menu;
  },
  resetHeaderMenu: async (): Promise<any> => {
    const res = await client.post("/menus/header/reset");
    return res.data?.data?.menu;
  },

  // FOOTER MENU MANAGEMENT
  getFooterMenu: async (): Promise<{ draftItems: any[]; publishedItems: any[] }> => {
    try {
      const res = await client.get("/menus/footer");
      const menu = res.data?.data?.menu;
      return {
        draftItems: menu?.draftItems || [],
        publishedItems: menu?.publishedItems || [],
      };
    } catch (err) {
      console.error("Failed to fetch footer menu:", err);
      return { draftItems: [], publishedItems: [] };
    }
  },
  updateDraftFooterMenu: async (items: any[]): Promise<any> => {
    const res = await client.put("/menus/footer", { items });
    return res.data?.data?.menu;
  },
  publishFooterMenu: async (): Promise<any> => {
    const res = await client.post("/menus/footer/publish");
    return res.data?.data?.menu;
  },
  resetFooterMenu: async (): Promise<any> => {
    const res = await client.post("/menus/footer/reset");
    return res.data?.data?.menu;
  },

  // AUTH & SECURITY
  changePassword: async (data: { currentPassword?: string; newPassword?: string }): Promise<any> => {
    const res = await client.post("/auth/change-password", data);
    return res.data;
  },

  // SITE GENERAL & BRANDING SETTINGS
  getSettings: async (): Promise<SiteSettings> => {
    try {
      const res = await client.get("/settings");
      return res.data?.data?.settings || {};
    } catch (err) {
      console.error("Failed to fetch site settings:", err);
      return {
        desktopLogo: "/images/logo.png",
        mobileLogo: "/images/logo.png",
        headerDesktopLogo: "/images/logo.png",
        headerMobileLogo: "/images/logo.png",
        footerDesktopLogo: "/images/logo.png",
        footerMobileLogo: "/images/logo.png",
        categoryHeroCover: "/images/main-category-hero.png",
        categoryCardBg: "/images/placeholder.png",
        socialLinks: {
          facebook: "https://facebook.com",
          instagram: "https://instagram.com",
          youtube: "https://youtube.com",
          linkedin: "https://linkedin.com",
          twitter: "https://x.com",
        },
        rightChoiceBanner: {
          title: "Need Help Choosing the Right Adhesive?",
          subtitle: "Share your woodwork needs, product query or application concerns. Our team will help you find the right Jivanjor solution.",
          ctaText: "Submit Your Query",
          ctaLink: "/contact",
        },
        contactPage: {
          heroImage: "/images/image 24.png",
          heroTitle: "Contact Us",
          mainHeading: "We are always happy to assist you.",
          watermarkImage: "/images/watermark-contact.svg",
          sections: [
            {
              title: "Customer Support",
              details: [
                { label: "Phone", value: "1800-XXX-XXX", icon: "/images/Phone-call.svg" },
                { label: "Email", value: "support@jivanjor.com", icon: "/images/Mail-one.svg" },
                { label: "Hours", value: "Mon-Sat, 9:00 AM – 6:00 PM", icon: "/images/Alarm-clock.svg" },
              ],
            },
            {
              title: "Corporate Headquarters",
              details: [
                { label: "Address", value: "1234, Address Street", icon: "/images/Pin.svg" },
                { label: "Hours", value: "Mon-Sat, 9:00 AM – 6:00 PM", icon: "/images/Alarm-clock.svg" },
              ],
            },
          ],
        },
      };
    }
  },
  updateSettings: async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
    const res = await client.put("/settings", data);
    return res.data?.data?.settings;
  },

  // USER MANAGEMENT & PERMISSIONS
  getUsers: async (): Promise<User[]> => {
    const res = await client.get("/users");
    const rawUsers = res.data?.data?.users || [];
    return rawUsers.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      permissions: u.permissions || [],
      created_at: u.createdAt || u.created_at,
      createdAt: u.createdAt || u.created_at,
      updatedAt: u.updatedAt,
    }));
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    permissions?: string[];
  }): Promise<User> => {
    const res = await client.post("/users", userData);
    const u = res.data?.data?.user;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      permissions: u.permissions || [],
      created_at: u.createdAt || u.created_at,
      createdAt: u.createdAt || u.created_at,
    };
  },

  updateUser: async (
    id: string,
    userData: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
      permissions?: string[];
    }
  ): Promise<User> => {
    const res = await client.put(`/users/${id}`, userData);
    const u = res.data?.data?.user;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      permissions: u.permissions || [],
      updatedAt: u.updatedAt,
    };
  },

  deleteUser: async (id: string): Promise<void> => {
    await client.delete(`/users/${id}`);
  },

  // FORM SUBMISSIONS & ZOHO CRM MANAGEMENT
  submitContactForm: async (data: {
    fullName: string;
    firmName?: string;
    mobileNumber: string;
    email?: string;
    city?: string;
    location?: string;
    state?: string;
    pinCode?: string;
    queryType?: string;
    interestedIn?: string;
    message?: string;
    consent: boolean;
    sourceUrl?: string;
  }): Promise<any> => {
    const res = await client.post("/forms/contact", data);
    return res.data;
  },
  submitDealerForm: async (data: {
    fullName: string;
    firmName?: string;
    mobileNumber: string;
    email?: string;
    city?: string;
    location?: string;
    state?: string;
    pinCode?: string;
    queryType?: string;
    interestedIn?: string;
    lineOfBusiness?: string;
    message?: string;
    consent: boolean;
    sourceUrl?: string;
  }): Promise<any> => {
    const res = await client.post("/forms/dealer", data);
    return res.data;
  },
  submitContractorForm: async (data: {
    fullName: string;
    mobileNumber: string;
    email?: string;
    city?: string;
    location?: string;
    state?: string;
    pinCode?: string;
    queryType?: string;
    interestedIn?: string;
    message?: string;
    consent: boolean;
    sourceUrl?: string;
  }): Promise<any> => {
    const res = await client.post("/forms/contractor", data);
    return res.data;
  },
  getFormSubmissions: async (params?: { page?: number; limit?: number; formType?: string; status?: string; search?: string; startDate?: string; endDate?: string }): Promise<{ status: string; data: FormSubmissionRecord[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.formType && params.formType !== "ALL") query.set("formType", params.formType);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    const res = await client.get(`/admin/form-submissions?${query.toString()}`);
    return res.data;
  },
  getFormSubmissionById: async (id: string): Promise<FormSubmissionRecord> => {
    const res = await client.get(`/admin/form-submissions/${id}`);
    return res.data?.data;
  },
  retryFormSubmission: async (id: string, reason?: string): Promise<any> => {
    const res = await client.post(`/admin/form-submissions/${id}/retry`, { reason });
    return res.data;
  },
  batchRetryFormSubmissions: async (submissionIds: string[], reason?: string): Promise<any> => {
    const res = await client.post(`/admin/form-submissions/batch-retry`, { submissionIds, reason });
    return res.data;
  },
  getFormSubmissionsHealth: async (): Promise<FormSubmissionsHealth> => {
    const res = await client.get(`/admin/form-submissions/health`);
    return res.data?.data;
  },
  lookupPinCode: async (pinCode: string): Promise<{ pinCode: string; city: string; state: string; location?: string | null } | null> => {
    try {
      const res = await axios.get(`/api/pincodes?pin=${encodeURIComponent(pinCode)}`);
      return res.data?.data || null;
    } catch {
      return null;
    }
  },
  getPinCodes: async (params?: { page?: number; limit?: number; search?: string }): Promise<{ status: string; total: number; page: number; limit: number; totalPages: number; updatedAt: string | null; records: any[] }> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    const res = await axios.get(`/api/pincodes?${query.toString()}`);
    return res.data;
  },
  replacePinCodes: async (records: any[]): Promise<{ status: string; count: number; updatedAt: string; message: string }> => {
    // 1. Save directly to backend Database (jivanjor-server -> Supabase PostgreSQL)
    const res = await client.post("/pincodes/replace", { records });
    // 2. Sync local Next.js cache file only after database write succeeds
    axios.post("/api/pincodes", { records }).catch(() => {});
    return res.data;
  },
};

export interface FormSubmissionRecord {
  id: string;
  crmExternalKey: string;
  formType: "CONTACT" | "DEALER" | "CONTRACTOR";
  fullName: string;
  firmName?: string | null;
  mobileRaw: string;
  mobileNormalized: string;
  email?: string | null;
  city?: string | null;
  location?: string | null;
  state?: string | null;
  pinCode?: string | null;
  queryType?: string | null;
  interestedIn?: string | null;
  lineOfBusiness?: string | null;
  message?: string | null;
  consentGiven: boolean;
  consentTextVersion?: string | null;
  sourceUrl?: string | null;
  referrerUrl?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  submittedAt: string;
  zohoSyncStatus: "PENDING" | "PROCESSING" | "RETRY_SCHEDULED" | "SYNCED" | "FAILED" | "MANUAL_REVIEW";
  zohoContactId?: string | null;
  zohoEnquiryId?: string | null;
  zohoContactAction?: string | null;
  zohoEnquiryAction?: string | null;
  zohoSyncAttempts: number;
  zohoLastHttpStatus?: number | null;
  zohoLastErrorCode?: string | null;
  zohoLastErrorMessage?: string | null;
  zohoLastResponse?: any;
  zohoLastAttemptAt?: string | null;
  zohoSyncedAt?: string | null;
  nextRetryAt?: string | null;
  attempts?: FormSyncAttemptRecord[];
  adminAuditLogs?: any[];
}

export interface FormSyncAttemptRecord {
  id: string;
  submissionId: string;
  attemptNumber: number;
  source: string;
  actor?: string | null;
  status: string;
  httpStatus?: number | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  responsePayload?: any;
  startedAt: string;
  completedAt?: string | null;
}

export interface FormSubmissionsHealth {
  queueDepth: number;
  counts: Record<string, number>;
  totalSubmissions: number;
  syncSuccessRate: number;
  oldestPendingAgeSeconds: number;
  lastSuccessAt?: string | null;
}





