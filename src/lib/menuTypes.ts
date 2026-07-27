export type MenuType = 'menu' | 'page' | 'external_link';

export interface SubMenuItem {
  id: string;
  title: string;
  type: 'page' | 'external_link';
  url: string;
  target?: '_self' | '_blank';
  description?: string;
  order: number;
}

export interface MenuItem {
  id: string;
  title: string;
  type: MenuType;
  url?: string | null;
  target?: '_self' | '_blank';
  isStatic?: boolean;
  isMegaMenu?: boolean;
  order: number;
  subItems?: SubMenuItem[];
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
}

export interface FooterSectionItem {
  id: string;
  title: string;
  order: number;
  subItems: FooterLinkItem[];
}

export const DEFAULT_HEADER_MENU: MenuItem[] = [
  {
    id: 'nav-about',
    title: 'About Jivanjor',
    type: 'menu',
    isMegaMenu: true,
    isStatic: false,
    order: 1,
    url: null,
    subItems: [
      { id: 'sub-about-1', title: 'About Jivanjor', type: 'page', url: '/about', order: 1 },
      { id: 'sub-about-2', title: 'Research and Innovation', type: 'page', url: '/about/research-and-innovation', order: 2 },
      { id: 'sub-about-3', title: 'Quality & Performance Promise', type: 'page', url: '/about/quality-and-performance-promise', order: 3 },
      { id: 'sub-about-4', title: 'TVC', type: 'page', url: '/about/tvc', order: 4 },
      { id: 'sub-about-5', title: 'Market Presence', type: 'page', url: '/about/market-presence', order: 5 },
    ],
  },
  {
    id: 'nav-products',
    title: 'Products',
    type: 'menu',
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
    isMegaMenu: true,
    isStatic: false,
    order: 3,
    url: null,
    subItems: [
      { id: 'sub-app-1', title: 'Furniture & Woodwork', type: 'page', url: '/applications', order: 1 },
      { id: 'sub-app-2', title: 'Laminates & Finishing', type: 'page', url: '/applications', order: 2 },
      { id: 'sub-app-3', title: 'Kitchen & Storage Units', type: 'page', url: '/applications', order: 3 },
      { id: 'sub-app-4', title: 'Moisture-Prone Woodwork', type: 'page', url: '/applications', order: 4 },
      { id: 'sub-app-5', title: 'PVC & Edge Finishing', type: 'page', url: '/applications', order: 5 },
      { id: 'sub-app-6', title: 'Foam & Acoustic Bonding', type: 'page', url: '/applications', order: 6 },
    ],
  },
  {
    id: 'nav-knowledge',
    title: 'Knowledge Center',
    type: 'menu',
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
      { id: 'fsub-about-1', title: 'About Jivanjor', url: '/about', target: '_self', order: 1 },
      { id: 'fsub-about-2', title: 'Research & Innovation', url: '/about/research-and-innovation', target: '_self', order: 2 },
      { id: 'fsub-about-3', title: 'Quality & Performance Promise', url: '/about/quality-and-performance-promise', target: '_self', order: 3 },
      { id: 'fsub-about-4', title: 'TVCs', url: '/about/tvc', target: '_self', order: 4 },
      { id: 'fsub-about-5', title: 'Market Presence', url: '/about/market-presence', target: '_self', order: 5 },
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
