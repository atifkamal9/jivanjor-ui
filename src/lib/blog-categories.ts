export interface BlogCategoryFilter {
  name: string;
  icon: string;
}

export const FALLBACK_BLOG_CATEGORIES: string[] = [
  "Latest Blogs",
  "Application Tips",
  "Choosing The Right Adhesive",
  "Fix Common Issues",
];

export const BLOG_POST_CATEGORIES: string[] = FALLBACK_BLOG_CATEGORIES;

export const BLOG_CATEGORY_FILTERS: BlogCategoryFilter[] = [
  { name: "Latest Blogs", icon: "/images/blog/image 47.svg" },
  { name: "Application Tips", icon: "/images/blog/image 43.svg" },
  { name: "Choosing The Right Adhesive", icon: "/images/blog/Check-correct.svg" },
  { name: "Fix Common Issues", icon: "/images/blog/image 48.svg" },
];
