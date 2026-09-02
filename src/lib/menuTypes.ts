export type MenuType = 'menu' | 'page' | 'external_link';

export interface SubMenuItem {
  id: string;
  title: string;
  type: 'page' | 'external_link';
  url: string;
  target?: '_self' | '_blank';
  description?: string;
  image?: string | null;
  order: number;
  hideInMenu?: boolean;
}

export interface MenuItem {
  id: string;
  title: string;
  type: MenuType;
  url?: string | null;
  target?: '_self' | '_blank';
  description?: string;
  image?: string | null;
  isStatic?: boolean;
  isMegaMenu?: boolean;
  order: number;
  subItems?: SubMenuItem[];
  hideInMenu?: boolean;
}


export interface HeaderMenuData {
  id: string;
  name: string;
  draftItems: MenuItem[];
  publishedItems: MenuItem[];
  updatedAt?: string;
}

export interface FooterLinkItem {
  id: string;
  title: string;
  url: string;
  target?: '_self' | '_blank';
  order: number;
  hideInMenu?: boolean;
}

export interface FooterSectionItem {
  id: string;
  title: string;
  order: number;
  subItems: FooterLinkItem[];
  hideInMenu?: boolean;
}

export const DEFAULT_HEADER_MENU: MenuItem[] = [
  {
    id: 'nav-about',
    title: 'About Jivanjor',
    type: 'menu',
    description: "Learn about Jivanjor's historical commitment to quality, research, and crafting state-of-the-art polymer formulations for builders and carpenters worldwide.",
    isMegaMenu: true,
    isStatic: false,
    order: 1,
    url: null,
    subItems: [
      { id: 'sub-about-1', title: 'About Jivanjor', type: 'page', url: '/about#about-jivanjor', order: 1 },
      { id: 'sub-about-2', title: 'Research and Innovation', type: 'page', url: '/about#research-innovation', order: 2 },
      { id: 'sub-about-3', title: 'Quality & Performance Promise', type: 'page', url: '/about#quality-sustainability', order: 3 },
      { id: 'sub-about-4', title: 'TVC', type: 'page', url: '/about#tvcs', order: 4 },
      { id: 'sub-about-5', title: 'Market Presence', type: 'page', url: '/about#our-presence', order: 5 },
    ],
  },
  {
    id: 'nav-products',
    title: 'Products',
    type: 'menu',
    description: "Explore our comprehensive range of high-performance woodworking adhesives, specialty formulations, and water-resistant bonding solutions.",
    isMegaMenu: true,
    isStatic: true, // Static product menu
    order: 2,
    url: null,
    subItems: [],
  },
  {
    id: 'nav-applications',
    title: 'Applications',
    type: 'menu',
    description: "Explore the full range of Jivanjor adhesive solutions crafted for every woodworking application — furniture, laminates, kitchens, and beyond.",
    isMegaMenu: true,
    isStatic: false,
    order: 3,
    url: null,
    subItems: [
      { id: 'sub-app-1', title: 'Furniture & Woodwork', type: 'page', url: '/applications/furniture-woodwork', order: 1 },
      { id: 'sub-app-2', title: 'Laminates & Finishing', type: 'page', url: '/applications/laminates-finishing', order: 2 },
      { id: 'sub-app-3', title: 'Kitchen & Storage Units', type: 'page', url: '/applications/kitchen-storage-units', order: 3 },
      { id: 'sub-app-4', title: 'Moisture-Prone Woodwork', type: 'page', url: '/applications/moisture-prone-woodwork', order: 4 },
      { id: 'sub-app-5', title: 'PVC & Edge Finishing', type: 'page', url: '/applications/pvc-edge-finishing', order: 5 },
      { id: 'sub-app-6', title: 'Foam & Acoustic Bonding', type: 'page', url: '/applications/foam-acoustic-bonding', order: 6 },
    ],
  },
  {
    id: 'nav-knowledge',
    title: 'Knowledge Center',
    type: 'menu',
    description: "Discover expert adhesive guides, woodworking application tips, and technical resources to ensure the strongest bonds.",
    isMegaMenu: true,
    isStatic: false,
    order: 4,
    url: null,
    subItems: [
      { id: 'sub-know-1', title: 'Choosing The Right Adhesive', type: 'page', url: '/blog?category=Choosing%20The%20Right%20Adhesive', order: 1 },
      { id: 'sub-know-2', title: 'Application Tips', type: 'page', url: '/blog?category=Application%20Tips', order: 2 },
      { id: 'sub-know-3', title: 'Fix Common Issues', type: 'page', url: '/blog?category=Fix%20Common%20Issues', order: 3 },
      { id: 'sub-know-4', title: 'Latest Blogs', type: 'page', url: '/blog?category=Latest%20Blogs', order: 4 },
      { id: 'sub-know-5', title: 'Technical Resources', type: 'page', url: '/resources', order: 5 },
    ],
  },
  {
    id: 'nav-partner',
    title: 'Partner',
    type: 'menu',
    description: "Connect with Jivanjor as an authorized dealer, distributor, contractor, or master carpenter across India.",
    isMegaMenu: true,
    isStatic: false,
    order: 5,
    url: null,
    subItems: [
      { id: 'sub-part-1', title: 'Become a Dealer / Partner', type: 'page', url: '/partner', order: 1 },
      { id: 'sub-part-2', title: 'Contractor / Carpenter Connect', type: 'page', url: '/contractor', order: 2 },
    ],
  },
];

export const DEFAULT_FOOTER_MENU: FooterSectionItem[] = [
  {
    id: 'footer-products',
    title: 'Products',
    order: 1,
    subItems: [
      { id: 'fsub-prod-1', title: 'Super Premium Adhesive', url: '/categories/super-premium', target: '_self', order: 1 },
      { id: 'fsub-prod-2', title: 'Speciality Adhesive', url: '/categories/speciality', target: '_self', order: 2 },
      { id: 'fsub-prod-3', title: 'Regular Adhesive', url: '/categories/regular', target: '_self', order: 3 },
      { id: 'fsub-prod-4', title: 'Water Proof Grade Adhesive', url: '/categories/waterproof', target: '_self', order: 4 },
      { id: 'fsub-prod-5', title: 'Wood Ancillaries', url: '/categories/wood-ancillaries', target: '_self', order: 5 },
      { id: 'fsub-prod-6', title: 'ECO', url: '/categories/eco', target: '_self', order: 6 },
      { id: 'fsub-prod-7', title: 'Wood Preservative', url: '/categories/wood-preservative', target: '_self', order: 7 },
    ],
  },
  {
    id: 'footer-about',
    title: 'About Jivanjor',
    order: 2,
    subItems: [
      { id: 'fsub-about-1', title: 'About Jivanjor', url: '/about#about-jivanjor', target: '_self', order: 1 },
      { id: 'fsub-about-2', title: 'Research & Innovation', url: '/about#research-innovation', target: '_self', order: 2 },
      { id: 'fsub-about-3', title: 'Quality & Performance Promise', url: '/about#quality-sustainability', target: '_self', order: 3 },
      { id: 'fsub-about-4', title: 'TVCs', url: '/about#tvcs', target: '_self', order: 4 },
      { id: 'fsub-about-5', title: 'Market Presence', url: '/about#our-presence', target: '_self', order: 5 },
    ],
  },
  {
    id: 'footer-support',
    title: 'Support & Compliance',
    order: 3,
    subItems: [
      { id: 'fsub-supp-1', title: 'Technical Resources', url: '/resources', target: '_self', order: 1 },
      { id: 'fsub-supp-2', title: 'Become a Dealer', url: '/partner', target: '_self', order: 2 },
      { id: 'fsub-supp-3', title: 'Contractor Connect', url: '/contractor', target: '_self', order: 3 },
      { id: 'fsub-supp-4', title: 'Privacy Policy', url: '/privacy', target: '_self', order: 4 },
      { id: 'fsub-supp-5', title: 'Terms of Use', url: '/privacy#terms', target: '_self', order: 5 },
      { id: 'fsub-supp-6', title: 'Sitemap', url: '/sitemap', target: '_self', order: 6 },
      { id: 'fsub-supp-7', title: 'Contact Us', url: '/contact', target: '_self', order: 7 },
    ],
  },
];

export function normalizeSubItemUrl(
  url: string | null | undefined,
  title: string,
  parentItem?: { id?: string; title?: string }
): string {
  const slugifiedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const parentTitle = (parentItem?.title || "").toLowerCase();
  const parentId = parentItem?.id || "";

  const isAppParent = parentId === "nav-applications" || parentTitle.includes("application");
  const isAboutParent = parentId === "nav-about" || parentTitle.includes("about");

  if (!url || url === "#") {
    if (isAppParent) {
      return slugifiedTitle === "applications" ? "/applications" : `/applications/${slugifiedTitle}`;
    }
    if (isAboutParent) {
      return slugifiedTitle === "about" ? "/about" : `/about#${slugifiedTitle}`;
    }
    return `/${slugifiedTitle}`;
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("#") ||
    url.startsWith("?") ||
    url.includes("?") ||
    url.includes("#")
  ) {
    return url;
  }

  let cleanUrl = url.startsWith("/") ? url : `/${url}`;

  if (isAppParent) {
    if (cleanUrl === "/applications" && title.toLowerCase() !== "applications" && slugifiedTitle !== "applications") {
      return `/applications/${slugifiedTitle}`;
    }
    if (!cleanUrl.startsWith("/applications/")) {
      if (cleanUrl === "/applications") return "/applications";
      const subSlug = cleanUrl.replace(/^\//, "");
      return `/applications/${subSlug}`;
    }
  }

  if (isAboutParent) {
    if (cleanUrl === "/about" && title.toLowerCase() !== "about" && title.toLowerCase() !== "about jivanjor" && slugifiedTitle !== "about") {
      return `/about/${slugifiedTitle}`;
    }
    if (!cleanUrl.startsWith("/about/")) {
      if (cleanUrl === "/about") return "/about";
      const subSlug = cleanUrl.replace(/^\//, "");
      return `/about/${subSlug}`;
    }
  }

  return cleanUrl;
}
