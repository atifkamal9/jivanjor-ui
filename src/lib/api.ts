import axios from "axios";
import { getAuthToken } from "./auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  material_id: string;
  metadata: string; // comma-separated or JSON
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_category: string; // id or empty string
  description: string;
  icon?: string; // Pre-stored platform icon key (e.g. Lucide icon name)
}

export interface Material {
  id: string;
  name: string;
  description: string;
}

export interface UseCase {
  id: string;
  title: string;
  slug: string;
  description: string;
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
  publish_date: string;
  image?: string;
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
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    parent_category: cat.parentId || "",
    description: cat.description || "",
    icon: cat.icon || "",
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
  if (prod.metadata) {
    if (typeof prod.metadata === "string") {
      metadataStr = prod.metadata;
    } else if (typeof prod.metadata === "object") {
      if ("tags" in prod.metadata && typeof prod.metadata.tags === "string") {
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
  return {
    id: prod.id,
    name: prod.name,
    slug: prod.slug,
    description: prod.description || "",
    category_id: prod.categoryId,
    material_id: prod.materialId || "",
    metadata: metadataStr,
    image:
      prod.image ||
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&auto=format&fit=crop",
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
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content || "",
    category: post.category || "",
    tags: tagsArray,
    author: post.author || "",
    publish_date: post.publishDate
      ? new Date(post.publishDate).toISOString().split("T")[0]
      : "",
    image:
      post.image ||
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?q=80&w=400&auto=format&fit=crop",
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
  getProducts: async (): Promise<Product[]> => {
    const res = await client.get("/products");
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
      categoryId: product.category_id,
      materialId: product.material_id || null,
      metadata: { tags: product.metadata },
      image: product.image || null,
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
    const payload = {
      name: category.name,
      parentId: category.parent_category || null,
      description: category.description || "",
      icon: category.icon || null,
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
    return Array.isArray(blogs) ? blogs.map(mapBlogPostFromBackend) : [];
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
      publishDate: blogPost.publish_date
        ? new Date(blogPost.publish_date).toISOString()
        : new Date().toISOString(),
      image: blogPost.image || null,
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
};
