export interface ProductItem {
  name: string;
  image: string;
  bgColor: string;
}

export interface CategoryItem {
  name: string;
  products: ProductItem[];
  categoryImage: string;
}

export interface NavItem {
  name: string;
  link: string;
}

export const aboutItems: NavItem[] = [
  { name: "About Jivanjor", link: "/about" },
  { name: "Research and Innovation", link: "/about#innovation-section" },
  {
    name: "Quality & Performance Promise",
    link: "/about#responsibility-section",
  },
  { name: "TVC", link: "/about#tvcs-section" },
  { name: "Market Presence", link: "/about#presence-section" },
];

export const applicationItems = [
  { name: "Furniture & Woodwork", link: "/applications" },
  { name: "Laminates & Finishing", link: "/applications" },
  { name: "Kitchen & Storage Units", link: "/applications" },
  { name: "Moisture-Prone Woodwork", link: "/applications" },
  { name: "PVC & Edge Finishing", link: "/applications" },
  { name: "Foam & Acoustic Bonding", link: "/applications" },
];

export const knowledgeItems: NavItem[] = [
  { name: "Choosing The Right Adhesive", link: "/blog" },
  { name: "Application Tips", link: "/blog" },
  { name: "Fix Common Issues", link: "/blog" },
  { name: "Latest Blogs", link: "/blog" },
  { name: "Technical Resources", link: "/resources" },
];

export const productCategories: CategoryItem[] = [
  {
    name: "Woodworking Adhesives",
    products: [
      {
        name: "Super Premium Adhesive",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Specialty Adhesive",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "Regular Adhesive",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Waterproof Grade Adhesive",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
      {
        name: "Wood Ancillaries",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "ECO",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
      {
        name: "Wood Preservative",
        image: "/images/Aquabond.png",
        bgColor: "bg-[#1CB6F6]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
  {
    name: "Construction Chemicals",
    products: [
      {
        name: "Tile Adhesive",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      { name: "Grout", image: "/images/Foambond.png", bgColor: "bg-[#F57F26]" },
      {
        name: "Waterproofing Compound",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
      {
        name: "Epoxy Grout",
        image: "/images/Aquabond.png",
        bgColor: "bg-[#1CB6F6]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
  {
    name: "Maintenance",
    products: [
      {
        name: "Pipe Sealant",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Thread Seal Tape",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "Maintenance Spray",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
  {
    name: "Wood Finish Products",
    products: [
      {
        name: "Wood Polish",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Wood Stain",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "Lacquer",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
  {
    name: "Packaging Adhesives",
    products: [
      {
        name: "Box Sealing Adhesive",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Lamination Adhesive",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "Carton Adhesive",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
  {
    name: "Footwear Adhesives",
    products: [
      {
        name: "Sole Bonding Adhesive",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Leather Adhesive",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "Synthetic Adhesive",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
];

export const partnerItems: NavItem[] = [
  { name: "Become a Dealer / Partner", link: "/partner" },
  { name: "Contractor / Carpenter Connect", link: "/contractor" },
];
