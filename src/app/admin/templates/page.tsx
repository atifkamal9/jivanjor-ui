"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Page, PageTemplate } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
import MediaUpload from "@/components/admin/MediaUpload";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  CheckCircle2,
  ArrowLeft,
  Award,
  Shield,
  Grid,
  FileText,
  Sliders,
  Layout,
  MessageSquare,
  Bookmark,
  LayoutTemplate,
  AlertCircle
} from "lucide-react";

const isVideo = (url: string) =>
  /\.(mp4|webm|mov)(\?.*)?$/i.test(url) || url.includes("video");

const defaultHomeSections = {
  hero: {
    title: "Dependable Bonds for Indian Homes",
    desc: "Superior strength adhesives crafted with state-of-the-art polymer chemistry to safeguard your woodworking and furniture creations for a lifetime.",
    actionButtons: {
      primary: { text: "Explore Products", actionPath: "#product-section" },
      secondary: { text: "About Jivanjor", actionPath: "/about" },
    },
    media: [
      "/images/hero.png",
      "/images/hero (1).png",
      "/videos/hero-background.mp4",
    ],
  },
  productRange: {
    title: "A Complete Adhesive Range for Modern Woodworking",
    subtitle: "From premium wood glues to water-resistant formulations, explore adhesives trusted by master carpenters across India.",
    items: [
      {
        title: "Champion Super",
        description: "Premium white carpentry adhesive providing superior initial grab and high bonding strength.",
        tag: "Best Seller",
        image: "/images/Champion Super.png",
        cta: { text: "Learn More", actionPath: "#" }
      },
      {
        title: "Aquabond",
        description: "Heatproof and waterproof adhesive made with Cross Linking Polymer.",
        tag: "Waterproof Grade",
        image: "/images/Aquabond.png",
        cta: { text: "Learn More", actionPath: "#" }
      },
      {
        title: "Foambond",
        description: "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
        tag: "Speciality",
        image: "/images/Foambond.png",
        cta: { text: "Learn More", actionPath: "#" }
      },
      {
        title: "Watershield",
        description: "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
        tag: "Eco Friendly",
        image: "/images/Watershield.png",
        cta: { text: "Learn More", actionPath: "#" }
      }
    ]
  },
  findAdhesive: {
    title: "Find The Right Adhesive",
    subtitle: "Select your application category to discover matched adhesives engineered for maximum hold.",
    items: [
      { name: "Furniture and Woodwork", link: "#" },
      { name: "Kitchen Cabinets & Storage", link: "#" },
      { name: "Laminates & Surface Finishings", link: "#" },
      { name: "Moisture-Prone Woodwork", link: "#" },
      { name: "PVC, Acrylic & Edge Finishing", link: "#" },
      { name: "Home Repairs & Special Fixing", link: "#" }
    ]
  },
  whyTrustUs: {
    title: "Why Professionals Trust Jivanjor",
    subtitle: "Over decades, builders and contractors have endorsed Jivanjor for quality, innovation, and support.",
    items: [
      { title: "Consistent Quality", description: "Every batch is rigorously tested in our labs to ensure matching bonding performance." },
      { title: "Ease of Application", description: "Engineered viscosity allows smooth, even spreading with minimal effort." },
      { title: "Range of Products", description: "A tailored product for every surface—from solid wood to rigid PVC and terrace concrete." },
      { title: "Preferred by Experts", description: "Loved by leading interior designers, architects, and professional carpentry guilds." }
    ]
  },
  showcaseGrid: {
    title: "Built Around India’s Woodworking Professionals",
    subtitle: "Jivanjor continues to grow through the trust of carpenters, contractors, dealers and channel partners across India’s woodworking ecosystem.",
    items: [
      { title: "Technical Resources", description: "Step-by-step tutorials, safety datasheets, and best practices for modern carpenter guilds.", link: "#" },
      { title: "Our Market Presence", description: "Available at 15,000+ retail outlets across India, backed by robust distribution networks.", link: "#" },
      { title: "Industry Endorsed", description: "Recognized by woodworking associations for superior chemical safety and durability.", link: "#" }
    ]
  },
  ctaPromo: {
    title: "Grow Your Business With a Trusted Adhesive",
    subtitle: "Work with a growing brand trusted by woodworking professionals, dealers and channel partners.",
    ctaText: "Partner With Us",
    ctaLink: "#"
  },
  testimonials: {
    title: "Trusted by People Who Know the Work",
    subtitle: "Hear from carpenters, contractors and dealers who rely on Jivanjor for real projects.",
    ctaText: "Partner With Us",
    ctaLink: "#"
  },
  knowledgeBase: {
    title: "Knowledge Base & Guides",
    subtitle: "Explore insights, tips, and chemistry guides from our experts to optimize your bonding applications.",
    items: [
      { title: "Choosing the Right Adhesive", summary: "A masterclass on selecting between standard PVA, quick-drying fast bonds, and high-performance polyurethanes.", link: "#" },
      { title: "Application Tips", summary: "Pro tips for surface preparation, wood moisture content checks, clamping times, and curing environment controls.", link: "#" },
      { title: "Fix Common Issues", summary: "Learn how to easily prevent wood laminate bubbling, edge peeling, and joint cracking in high-humidity climates.", link: "#" }
    ]
  }
};

const defaultAboutSections = {
  hero: {
    title: "A Trusted Name in Woodworking Adhesives",
    desc: "Engineered for consistency. Built for the contractors and carpenters who shape India's woodwork.",
    actionButtons: {
      primary: { text: "Enquire Now", actionPath: "#about-query-section" }
    },
    media: [
      "/images/about/about-hero.png",
      "/images/about/about-hero-1.png"
    ]
  },
  promise: {
    title: "The Promise of Stronger Bonds",
    subtitle: "Jivanjor is built around the needs of woodworking professionals, channel partners and end users who look for dependable adhesive solutions.",
    items: [
      {
        title: "Quality-Led Products",
        desc: "Adhesive solutions built around consistent performance and practical use.",
        icon: "/images/about/Ad-product.svg"
      },
      {
        title: "Woodworking Focus",
        desc: "Products designed for furniture, interiors, laminates and everyday woodwork needs.",
        icon: "/images/about/Distribute-vertically.svg"
      },
      {
        title: "Trade Understanding",
        desc: "A brand connected with the professionals and partners who shape adhesive choices.",
        icon: "/images/about/Spanner.svg"
      },
      {
        title: "Application Confidence",
        desc: "Guidance, product information and support to help users choose and apply better.",
        icon: "/images/about/Worker.svg"
      }
    ]
  },
  innovation: {
    title: "Built on Innovation That Drives Performance",
    bgImage: "/images/about/about-innovation-bg.png",
    items: [
      {
        title: "Equipped R&D",
        desc: "A dedicated facility focused on adhesive development and product improvement."
      },
      {
        title: "Application Testing",
        desc: "Testing-led developments to support practical bonding and usage needs."
      },
      {
        title: "Advanced Chemistries",
        desc: "Research across adhesive technologies, wood finishes and performance-led formulations."
      }
    ],
    ctaText: "Explore Applications",
    ctaLink: "/applications"
  },
  responsibility: {
    title: "Recognised for Quality. Built with Responsibility.",
    subtitle: "Jivanjor’s product promise is supported by quality-led facilities, recognised environmental practices and a continued focus on responsible manufacturing.",
    badges: [
      { title: "GreenPro Awards 2023", src: "/images/about/badge-greenpro.png" },
      { title: "EcoVadis Awards 2023", src: "/images/about/badge-ecovadis.png" },
      { title: "Chairman's Annual Award 24-25", src: "/images/about/badge-chairman.png" },
      { title: "ISO 9001 Compliant Facilities", src: "/images/about/badge-iso-9001.png" },
      { title: "ISO 14001 Compliant Facilities", src: "/images/about/badge-iso-14001.png" }
    ],
    sustainability: {
      title: "A Responsible Approach to Manufacturing",
      subtitle: "JACPL follows a long-term sustainability approach focused on protecting the environment, managing resources responsibly and reducing the impact of business operations.",
      image: "/images/about/windmill.png",
      items: [
        { title: "Use Resources Carefully", desc: "Practices focused on saving natural resources and energy." },
        { title: "Reduce Waste and Pollutants", desc: "Efforts to reduce industrial waste and environmental pollutants from business operations." },
        { title: "Lower Substances of Concern", desc: "Efforts to reduce industrial waste and environmental pollutants from business operations." },
        { title: "Act with Environmental Awareness", desc: "Encouraging conversation-minded practices across the organisation." }
      ]
    }
  },
  presence: {
    title: "A Presence Built Through Trust",
    subtitle: "Jivanjor brings together product performance and professional know-how to support the work that happens before the final finish, inside workshops, homes and everyday interiors.",
    items: [
      { value: "Pan-India", label: "Market Presence", icon: "/images/about/presence.svg" },
      { value: "27,000+", label: "Distribution Touchpoints", icon: "/images/about/distribution.svg" },
      { value: "275K+", label: "Trusting Woodworking Professionals", icon: "/images/about/professionals.svg" },
      { value: "8 High-Tech", label: "Manufacturing Facilities", icon: "/images/about/facilities.svg" },
      { value: "20+", label: "Product Variants", icon: "/images/about/variants.svg" }
    ],
    ctaExplore: { text: "Explore Products", actionPath: "/products" },
    ctaPartner: { text: "Partner With Us", actionPath: "/partner" }
  },
  tvcs: {
    title: "A Brand That Holds It All Together",
    subtitle: "Jivanjor brings together product performance and professional know-how to support the work that happens before the final finish, inside workshops, homes and everyday interiors.",
    items: [
      { id: "allrounder", title: "Jivanjor AllRounder - Jud Gaya Toh Jud Gaya", thumbnail: "/images/about/about-video-1.png", youtubeId: "5F7y8l18Nrc" },
      { id: "champion", title: "Jivanjor Champion - Multi-purpose Adhesive", thumbnail: "/images/about/about-video-2.png", youtubeId: "11mQhW3Zntk" }
    ]
  }
};

const defaultProductSections = {
  hero: {
    title: "Premium Carpentry Adhesive Specs",
    desc: "Detailed technical sheets, packaging sizes, application steps, and key specifications.",
    actionButtons: {
      primary: { text: "Download TDS", actionPath: "#" },
      secondary: { text: "Request Sample", actionPath: "/contact" }
    },
    media: [
      "/images/hero (1).png"
    ]
  },
  specifications: {
    title: "Technical Specifications",
    subtitle: "Accurate specifications tested under standardized laboratory conditions.",
    items: [
      { label: "Adhesive Base", value: "Polyvinyl Acetate (PVA) Emulsion" },
      { label: "Viscosity", value: "200 to 250 Poise at 30°C" },
      { label: "Coverage", value: "Approx. 8-10 sq.m per kg" },
      { label: "Clamping Time", value: "2 to 3 hours under normal humidity" }
    ]
  },
  features: {
    title: "Key Performance Features",
    subtitle: "Why Jivanjor outperforms ordinary carpentry glues.",
    items: [
      { title: "Extra Sticky Grab", description: "Prevents sliding of laminate sheets during initial alignment." },
      { title: "Micro-Polymer Crosslinking", description: "Deep wood fiber penetration for unbreakable bonds." },
      { title: "Anti-Bubble Action", description: "Formulated to minimize bubbles under laminate surfaces." }
    ]
  },
  applicationGuide: {
    title: "Step-by-Step Application Guide",
    subtitle: "Follow these simple steps for professional bonding results.",
    items: [
      { title: "Surface Preparation", description: "Ensure both wood and laminate surfaces are clean, dry, and free from grease or dust.", image: "/images/Champion Super.png" },
      { title: "Adhesive Spreading", description: "Spread Jivanjor adhesive evenly using a spreader or brush on one surface.", image: "/images/Aquabond.png" },
      { title: "Pressing & Clamping", description: "Align the laminate on the wood and press firmly. Clamp for at least 2 hours.", image: "/images/Foambond.png" }
    ]
  },
  faqs: {
    title: "Troubleshooting & FAQs",
    subtitle: "Common application questions answered by Jivanjor engineers.",
    items: [
      { question: "What is the recommended clamping duration?", answer: "We recommend clamping for 2 to 3 hours. Full curing takes 24 hours." },
      { question: "Can it be used on exterior doors?", answer: "Yes, our waterproof Aquabond grade is highly recommended for exterior doors." }
    ]
  }
};

const defaultCategorySections = {
  hero: {
    title: "Woodworking Applications",
    desc: "Explore specific adhesives engineered for laminates, solid wood, edge banding, and high-moisture environments.",
    actionButtons: {
      primary: { text: "Selector Tool", actionPath: "#category-showcase" },
      secondary: { text: "Guides", actionPath: "/resources" }
    },
    media: [
      "/images/hero.png"
    ]
  },
  categoriesShowcase: {
    title: "Application Sub-Categories",
    subtitle: "Navigate through specialized category segments to find custom formulas.",
    items: [
      { name: "Laminates & Veneers", description: "Water-based glues with high coverage and zero bubbling.", image: "/images/Champion Super.png", link: "#" },
      { name: "PVC Edge Banding", description: "Fast setting glues designed to bond wood panels with plastic edge strips.", image: "/images/Aquabond.png", link: "#" }
    ]
  },
  applicationsGrid: {
    title: "Common Construction & Assembly Areas",
    subtitle: "Where Jivanjor adhesives are applied daily by Indian carpenters.",
    items: [
      { title: "Modular Kitchen Cabinets", description: "Demands moisture-proof Aquabond grade to resist steam and humidity.", image: "/images/Foambond.png" },
      { title: "Solid Wood Joints", description: "Requires high-viscosity Champion Super for high-stress tenon joints.", image: "/images/Watershield.png" }
    ]
  },
  substrates: {
    title: "Substrates Compatibility Matrix",
    subtitle: "Check substrate compatibility rating for modern interior woodworking boards.",
    items: [
      { name: "Plywood to Laminate", suitability: "Excellent", comment: "Highly recommended with all Jivanjor grades." },
      { name: "MDF to Acrylic Sheet", suitability: "Good", comment: "Use Foambond or specialized edge formulations." }
    ]
  }
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Workspace View State
  const [isFormView, setIsFormView] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [templateName, setTemplateName] = useState("");
  const [templateSlug, setTemplateSlug] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [homeSections, setHomeSections] = useState<any>({ layoutType: "" });

  // Deletion confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [templatesList, pagesList] = await Promise.all([
        api.getTemplates(),
        api.getPages()
      ]);
      setTemplates(templatesList);
      setPages(pagesList);
    } catch (err) {
      console.error("Failed to load templates/pages", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setTemplateName(name);
    setTemplateSlug(slug);
  };

  const handleLayoutTypeChange = (newType: string) => {
    if (newType === "about") {
      setHomeSections({ layoutType: "about", ...defaultAboutSections });
    } else if (newType === "products") {
      setHomeSections({ layoutType: "products", ...defaultProductSections });
    } else if (newType === "categories") {
      setHomeSections({ layoutType: "categories", ...defaultCategorySections });
    } else {
      setHomeSections({ layoutType: "home", ...defaultHomeSections });
    }
    setActiveTab("general");
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTemplateName("");
    setTemplateSlug("");
    setHomeSections({ layoutType: "" });
    setActiveTab("general");
    setIsFormView(true);
  };

  const handleOpenEdit = (template: PageTemplate) => {
    setEditingId(template.id);
    setTemplateName(template.name);
    setTemplateSlug(template.slug);

    const rawData = template.rawSections || template.sections || {};
    const type = rawData.layoutType || "home";

    let merged: any = {};
    if (type === "about") {
      merged = {
        layoutType: "about",
        hero: { ...defaultAboutSections.hero, ...rawData.hero },
        promise: { ...defaultAboutSections.promise, ...rawData.promise },
        innovation: { ...defaultAboutSections.innovation, ...rawData.innovation },
        responsibility: { ...defaultAboutSections.responsibility, ...rawData.responsibility },
        presence: { ...defaultAboutSections.presence, ...rawData.presence },
        tvcs: { ...defaultAboutSections.tvcs, ...rawData.tvcs }
      };
    } else if (type === "products") {
      merged = {
        layoutType: "products",
        hero: { ...defaultProductSections.hero, ...rawData.hero },
        specifications: { ...defaultProductSections.specifications, ...rawData.specifications },
        features: { ...defaultProductSections.features, ...rawData.features },
        applicationGuide: { ...defaultProductSections.applicationGuide, ...rawData.applicationGuide },
        faqs: { ...defaultProductSections.faqs, ...rawData.faqs }
      };
    } else if (type === "categories") {
      merged = {
        layoutType: "categories",
        hero: { ...defaultCategorySections.hero, ...rawData.hero },
        categoriesShowcase: { ...defaultCategorySections.categoriesShowcase, ...rawData.categoriesShowcase },
        applicationsGrid: { ...defaultCategorySections.applicationsGrid, ...rawData.applicationsGrid },
        substrates: { ...defaultCategorySections.substrates, ...rawData.substrates }
      };
    } else {
      const rawHero = rawData.hero || {};
      let heroMedia = rawHero.media;
      if (!heroMedia) {
        if (rawHero.slides) {
          heroMedia = rawHero.slides.map((s: any) => s.video || s.bgImage).filter(Boolean);
        } else if (rawHero.bgImage || rawHero.video) {
          heroMedia = [rawHero.bgImage, rawHero.video].filter(Boolean);
        }
      }
      if (!Array.isArray(heroMedia) || heroMedia.length === 0) {
        heroMedia = [...defaultHomeSections.hero.media];
      }

      merged = {
        layoutType: "home",
        hero: {
          title: rawHero.title || defaultHomeSections.hero.title,
          desc: rawHero.desc || defaultHomeSections.hero.desc,
          actionButtons: rawHero.actionButtons || defaultHomeSections.hero.actionButtons,
          media: heroMedia
        },
        productRange: { ...defaultHomeSections.productRange, ...rawData.productRange },
        findAdhesive: { ...defaultHomeSections.findAdhesive, ...rawData.findAdhesive },
        whyTrustUs: { ...defaultHomeSections.whyTrustUs, ...rawData.whyTrustUs },
        showcaseGrid: { ...defaultHomeSections.showcaseGrid, ...rawData.showcaseGrid },
        ctaPromo: { ...defaultHomeSections.ctaPromo, ...rawData.ctaPromo },
        testimonials: { ...defaultHomeSections.testimonials, ...rawData.testimonials },
        knowledgeBase: { ...defaultHomeSections.knowledgeBase, ...rawData.knowledgeBase }
      };
    }

    setHomeSections(merged);
    setActiveTab("general");
    setIsFormView(true);
  };

  // State Update Helpers
  const updateSectionField = (sectionKey: string, fieldKey: string, value: any) => {
    setHomeSections((prev: any) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldKey]: value,
      },
    }));
  };

  const updateNestedField = (sectionKey: string, subKey: string, fieldKey: string, value: any) => {
    setHomeSections((prev: any) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [subKey]: {
          ...prev[sectionKey]?.[subKey],
          [fieldKey]: value,
        },
      },
    }));
  };

  const updateItemField = (sectionKey: string, idx: number, fieldKey: string, value: any) => {
    setHomeSections((prev: any) => {
      const items = [...(prev[sectionKey]?.items || [])];
      items[idx] = { ...items[idx], [fieldKey]: value };
      return {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          items,
        },
      };
    });
  };

  const updateNestedItemField = (sectionKey: string, idx: number, subKey: string, fieldKey: string, value: any) => {
    setHomeSections((prev: any) => {
      const items = [...(prev[sectionKey]?.items || [])];
      items[idx] = {
        ...items[idx],
        [subKey]: {
          ...items[idx]?.[subKey],
          [fieldKey]: value
        }
      };
      return {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          items,
        },
      };
    });
  };

  const addItem = (sectionKey: string, defaultItem: any) => {
    setHomeSections((prev: any) => {
      const items = [...(prev[sectionKey]?.items || []), defaultItem];
      return {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          items,
        },
      };
    });
  };

  const removeItem = (sectionKey: string, idx: number) => {
    setHomeSections((prev: any) => {
      const items = (prev[sectionKey]?.items || []).filter((_: any, i: number) => i !== idx);
      return {
        ...prev,
        [sectionKey]: {
          ...prev[sectionKey],
          items,
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeSections.layoutType) {
      alert("Please select a Template Layout Style Type.");
      return;
    }
    try {
      await api.saveTemplate({
        id: editingId || undefined,
        name: templateName,
        slug: templateSlug,
        sections: homeSections,
      });
      setIsFormView(false);
      await loadData();
    } catch (err) {
      console.error("Failed to save template", err);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await api.deleteTemplate(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to delete template", err);
    }
  };

  const currentLayoutType = homeSections.layoutType || "";

  // Build Dynamic tabs list based on Layout Type
  const tabsList = [
    { id: "general", label: "General Properties", icon: Sliders },
    ...(currentLayoutType === "about"
      ? [
        { id: "hero", label: "Hero Banner", icon: Layout },
        { id: "promise", label: "Stronger Bonds Promise", icon: Shield },
        { id: "innovation", label: "Research & Innovation", icon: Sparkles },
        { id: "responsibility", label: "Quality & Responsibility", icon: Award },
        { id: "presence", label: "Market Presence", icon: Grid },
        { id: "tvcs", label: "Brand TVCs", icon: MessageSquare },
      ]
      : currentLayoutType === "products"
        ? [
          { id: "hero", label: "Hero Banner", icon: Layout },
          { id: "specifications", label: "Technical Specs", icon: Sliders },
          { id: "features", label: "Key Features", icon: Shield },
          { id: "applicationGuide", label: "Application Steps", icon: Grid },
          { id: "faqs", label: "Troubleshooting FAQs", icon: Award },
        ]
        : currentLayoutType === "categories"
          ? [
            { id: "hero", label: "Hero Banner", icon: Layout },
            { id: "categoriesShowcase", label: "Sub-Categories Showcase", icon: Grid },
            { id: "applicationsGrid", label: "Common Areas Grid", icon: FileText },
            { id: "substrates", label: "Substrates Matrix", icon: Shield },
          ]
          : currentLayoutType === "home"
            ? [
              { id: "hero", label: "Hero Banner", icon: Layout },
              { id: "productRange", label: "Products Range", icon: Grid },
              { id: "findAdhesive", label: "Right Choice Categories", icon: Search },
              { id: "whyTrustUs", label: "Trust Factors", icon: Shield },
              { id: "showcaseGrid", label: "Resource Grid", icon: FileText },
              { id: "ctaPromo", label: "CTA Promotion", icon: MessageSquare },
              { id: "testimonials", label: "Testimonials", icon: Bookmark },
              { id: "knowledgeBase", label: "Knowledge Articles", icon: Award },
            ]
            : [])
  ];

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    const activePages = pages.filter((p) => p.activeTemplateId === t.id);
    const activePagesName = activePages.map((p) => p.title).join(", ");
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      activePagesName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <AdminLayout>
      {!isFormView ? (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-foreground">
                Page Layout Templates
              </h1>
              <p className="text-sm font-semibold text-foreground/45 uppercase tracking-wider">
                Assemble and structure decoupled layouts for dynamic web categories
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:opacity-90 text-white font-bold text-sm shadow-md shadow-primary/10 cursor-pointer transition-all self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create Layout Template</span>
            </button>
          </div>

          {/* Filters Panel */}
          <div className="bg-background border border-border p-4 rounded-2xl shadow-sm">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 dark:focus:border-primary"
              />
            </div>
          </div>

          {/* Catalog Layout Table */}
          <div className="bg-background border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface/55">
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Layout Template Name</th>
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Layout Style Type</th>
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Mapped Active Pages</th>
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-foreground/40 bg-surface/5">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          <span>Retrieving templates from CMS pool...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentTemplates.length > 0 ? (
                    currentTemplates.map((temp) => {
                      const activePages = pages.filter((p) => p.activeTemplateId === temp.id);
                      const rawSections = temp.rawSections || temp.sections || {};
                      const typeLabel = (rawSections.layoutType || "home").toUpperCase() + " PAGE";

                      return (
                        <tr key={temp.id} className="hover:bg-surface/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <LayoutTemplate className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-extrabold text-sm text-foreground">{temp.name}</p>
                                <p className="text-[10px] text-foreground/45 font-bold uppercase tracking-wider">{temp.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase text-primary bg-primary/10 border border-primary/20">
                              {typeLabel}
                            </span>
                          </td>
                          <td className="p-5">
                            {activePages.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {activePages.map((page) => (
                                  <span key={page.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200 dark:border-green-900/30">
                                    /{page.slug}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-foreground/35 font-semibold">Unmapped Layout (Draft)</span>
                            )}
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(temp)}
                                className="p-2 rounded-lg bg-surface hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all cursor-pointer border border-border"
                                title="Edit layout configurations"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                disabled={activePages.length > 0}
                                onClick={() => setDeleteConfirmId(temp.id)}
                                className="p-2 rounded-lg bg-surface hover:bg-red-50 hover:text-red-600 disabled:opacity-40 disabled:hover:bg-surface disabled:hover:text-foreground/60 transition-all cursor-pointer border border-border"
                                title={activePages.length > 0 ? "Cannot delete template mapped to active pages" : "Delete template"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-foreground/40 bg-surface/5">
                        No layout templates configured in templates pool.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-surface/20">
                <span className="text-xs font-bold text-foreground/45 uppercase tracking-wider">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-border text-foreground hover:bg-surface disabled:opacity-40 cursor-pointer"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-border text-foreground hover:bg-surface disabled:opacity-40 cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // ==================== FULL-PAGE SECTION FORM WORKSPACE ====================
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out] flex flex-col min-h-[80vh]">
          {/* Workspace Title bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5 shrink-0">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFormView(false)}
                className="p-2 rounded-xl bg-surface hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all cursor-pointer border border-border"
                title="Discard changes"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
                  <Layers className="h-6 w-6 text-primary" />
                  <span>{editingId ? "CMS Layout Studio" : "Create Dynamic Layout Presets"}</span>
                </h1>
                <p className="text-sm font-semibold text-foreground/45 uppercase tracking-wider">
                  Configure precise dynamic structures, layout style types, and sections contents
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col lg:flex-row gap-6">
            {/* Sidebar indices tabs */}
            <div className="w-full lg:w-1/4 flex flex-col gap-1.5 shrink-0 bg-surface/30 p-3 border border-border rounded-2xl h-fit">
              {tabsList.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-bold transition-all cursor-pointer border ${activeTab === tab.id
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-background/40 hover:bg-surface text-foreground/80 border-border"
                      }`}
                  >
                    <TabIcon className={`h-4.5 w-4.5 ${activeTab === tab.id ? "text-white" : "text-primary"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input Canvas Panels */}
            <div className="flex-1 bg-background border border-border p-6 rounded-3xl shadow-sm min-h-[60vh] flex flex-col justify-between">
              <div className="space-y-6">
                {activeTab === "general" && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Sliders className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">General Properties</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Template Layout Name
                        </label>
                        <input
                          type="text"
                          required
                          value={templateName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="e.g. Home Woodworking Studio"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2 flex items-center justify-between">
                          <span>Slug URL Path</span>
                          <span className="text-[10px] text-primary flex items-center gap-1 font-bold uppercase tracking-wider">
                            <Sparkles className="h-3 w-3" /> Auto
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          value={templateSlug}
                          onChange={(e) => setTemplateSlug(e.target.value)}
                          placeholder="home-woodworking"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Template Layout Style Type
                        </label>
                        <select
                          disabled={!!editingId}
                          value={homeSections.layoutType || ""}
                          onChange={(e) => handleLayoutTypeChange(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary text-foreground cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                          required
                        >
                          <option value="" disabled>-- Select Template Layout Style --</option>
                          <option value="home">Homepage Layout System</option>
                          <option value="about">About Page Layout System</option>
                          <option value="products">Product Specification Layout System</option>
                          <option value="categories">Category Application Layout System</option>
                        </select>
                        {editingId && (
                          <p className="mt-1 text-[11px] text-foreground/45 font-bold">
                            * Layout style type cannot be changed once a template is saved.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "hero" && homeSections.hero && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Layout className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Global Hero Settings</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Hero Banner Title Text
                        </label>
                        <input
                          type="text"
                          value={homeSections.hero.title || ""}
                          onChange={(e) => updateSectionField("hero", "title", e.target.value)}
                          placeholder="Dependable Bonds for Indian Homes"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Hero Description Paragraph
                        </label>
                        <textarea
                          rows={3}
                          value={homeSections.hero.desc || ""}
                          onChange={(e) => updateSectionField("hero", "desc", e.target.value)}
                          placeholder="Explain premium quality formulations..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Hero Action Buttons */}
                    <div className="p-5 border border-border bg-surface/20 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-primary tracking-wider">CTA Action Buttons Setup</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Primary Button */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Primary Call-to-action</span>
                          <input
                            type="text"
                            value={homeSections.hero.actionButtons?.primary?.text || ""}
                            onChange={(e) => updateNestedField("hero", "actionButtons", "primary", { ...homeSections.hero.actionButtons?.primary, text: e.target.value })}
                            placeholder="Button Text"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={homeSections.hero.actionButtons?.primary?.actionPath || ""}
                            onChange={(e) => updateNestedField("hero", "actionButtons", "primary", { ...homeSections.hero.actionButtons?.primary, actionPath: e.target.value })}
                            placeholder="Action Path (e.g. #product-section)"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                        </div>
                        {/* Secondary Button */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Secondary Call-to-action</span>
                          <input
                            type="text"
                            value={homeSections.hero.actionButtons?.secondary?.text || ""}
                            onChange={(e) => updateNestedField("hero", "actionButtons", "secondary", { ...homeSections.hero.actionButtons?.secondary, text: e.target.value })}
                            placeholder="Button Text"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={homeSections.hero.actionButtons?.secondary?.actionPath || ""}
                            onChange={(e) => updateNestedField("hero", "actionButtons", "secondary", { ...homeSections.hero.actionButtons?.secondary, actionPath: e.target.value })}
                            placeholder="Action Path (e.g. /about)"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {currentLayoutType === "about" ? (
                      <div className="space-y-6 border-t border-border pt-6 mt-4">
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs font-bold text-primary leading-relaxed">
                          💡 INFO: The about hero template requires 2 images: one optimized for desktop screens and one optimized for mobile screens.
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider">
                              Desktop Hero Image (Desktop Banner)
                            </label>
                            <ImageUpload
                              value={homeSections.hero.media?.[0] || ""}
                              onChange={(url) => {
                                const newMedia = [...(homeSections.hero.media || [])];
                                newMedia[0] = url;
                                updateSectionField("hero", "media", newMedia);
                              }}
                              folder="templates"
                            />
                            <span className="text-[10px] text-foreground/40 font-medium">Recommended aspect ratio: 16:9 (e.g. 1920x1080)</span>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider">
                              Mobile Hero Image (Mobile Banner)
                            </label>
                            <ImageUpload
                              value={homeSections.hero.media?.[1] || ""}
                              onChange={(url) => {
                                const newMedia = [...(homeSections.hero.media || [])];
                                newMedia[1] = url;
                                updateSectionField("hero", "media", newMedia);
                              }}
                              folder="templates"
                            />
                            <span className="text-[10px] text-foreground/40 font-medium">Recommended aspect ratio: 4:5 or 9:16 (e.g. 750x1334)</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col border-t border-border pt-6 mt-4 gap-3">
                          <div className="flex items-center gap-2">
                            <Layout className="h-5 w-5 text-primary" />
                            <h3 className="text-base font-extrabold text-foreground">Hero Background Media (Images/Videos)</h3>
                          </div>
                          <p className="text-xs text-foreground/50 font-medium">
                            At least one background image or video is mandatory for the hero slideshow.
                          </p>
                        </div>

                        {/* Media Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {(homeSections.hero.media || []).map((mediaUrl: string, idx: number) => {
                            const isVid = isVideo(mediaUrl);
                            return (
                              <div key={idx} className="relative aspect-video rounded-xl border border-border overflow-hidden bg-surface group">
                                {isVid ? (
                                  <video src={mediaUrl} className="w-full h-full object-cover" muted playsInline />
                                ) : (
                                  <img src={mediaUrl} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                                )}

                                {/* Remove button (only if more than 1 item) */}
                                {(homeSections.hero.media || []).length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newMedia = (homeSections.hero.media || []).filter((_: any, i: number) => i !== idx);
                                      updateSectionField("hero", "media", newMedia);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer shadow-md border border-red-700"
                                    title="Delete media file"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}

                                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[9px] font-bold text-white uppercase tracking-wider">
                                  {isVid ? "Video" : "Image"}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Add Media upload zone */}
                        <div className="mt-4">
                          <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                            Upload New Image or Video
                          </label>
                          <MediaUpload
                            value=""
                            onChange={(url) => {
                              if (url) {
                                const newMedia = [...(homeSections.hero.media || [])];
                                newMedia.push(url);
                                updateSectionField("hero", "media", newMedia);
                              }
                            }}
                            folder="templates"
                            accept="any"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Homepage Layout Only Tabs */}
                {activeTab === "productRange" && homeSections.productRange && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Grid className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Product Range Section</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Product Range Section Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.productRange.title}
                          onChange={(e) => updateSectionField("productRange", "title", e.target.value)}
                          placeholder="A Complete Adhesive Range for Modern Woodworking"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Product Range Description/Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={homeSections.productRange.subtitle || ""}
                          onChange={(e) => updateSectionField("productRange", "subtitle", e.target.value)}
                          placeholder="From premium wood glues to waterproof formulas..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* List of Dynamic Product Cards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Dynamic Products Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("productRange", { title: "New Product", description: "Excellent setting...", tag: "New", image: "/images/Champion Super.png", cta: { text: "Learn More", actionPath: "#" } })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Product Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.productRange.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("productRange", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <div className="pr-10">
                              <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">Card #{idx + 1}</span>
                            </div>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("productRange", idx, "title", e.target.value)}
                                placeholder="Product Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("productRange", idx, "description", e.target.value)}
                                placeholder="Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                <input
                                  type="text"
                                  value={item.tag || ""}
                                  onChange={(e) => updateItemField("productRange", idx, "tag", e.target.value)}
                                  placeholder="Badge tag (e.g. Best Seller)"
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                                />
                                <div className="space-y-1">
                                  <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Image</span>
                                  <ImageUpload
                                    value={item.image || ""}
                                    onChange={(url) => updateItemField("productRange", idx, "image", url)}
                                    folder="templates"
                                    size="compact"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={item.cta?.text || ""}
                                  onChange={(e) => updateNestedItemField("productRange", idx, "cta", "text", e.target.value)}
                                  placeholder="CTA Text"
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                                />
                                <input
                                  type="text"
                                  value={item.cta?.actionPath || ""}
                                  onChange={(e) => updateNestedItemField("productRange", idx, "cta", "actionPath", e.target.value)}
                                  placeholder="CTA Link"
                                  className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "findAdhesive" && homeSections.findAdhesive && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Search className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Right Choice Categories</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.findAdhesive.title}
                          onChange={(e) => updateSectionField("findAdhesive", "title", e.target.value)}
                          placeholder="Find The Right Adhesive"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={homeSections.findAdhesive.subtitle || ""}
                          onChange={(e) => updateSectionField("findAdhesive", "subtitle", e.target.value)}
                          placeholder="Select your application category..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Categories Links */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Application Pathways Categories</span>
                        <button
                          type="button"
                          onClick={() => addItem("findAdhesive", { name: "New Category Pathway", link: "#" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Category Link
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.findAdhesive.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => removeItem("findAdhesive", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Link #{idx + 1}</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItemField("findAdhesive", idx, "name", e.target.value)}
                                placeholder="Category Name"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold"
                              />
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(e) => updateItemField("findAdhesive", idx, "link", e.target.value)}
                                placeholder="Link Target (e.g. #)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "whyTrustUs" && homeSections.whyTrustUs && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Why Professionals Trust Jivanjor</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.whyTrustUs.title}
                          onChange={(e) => updateSectionField("whyTrustUs", "title", e.target.value)}
                          placeholder="Why Professionals Trust Jivanjor"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={homeSections.whyTrustUs.subtitle || ""}
                          onChange={(e) => updateSectionField("whyTrustUs", "subtitle", e.target.value)}
                          placeholder="Over decades, builders have endorsed..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Trust Items */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Trust Factors Checklist</span>
                        <button
                          type="button"
                          onClick={() => addItem("whyTrustUs", { title: "Consistent Quality", description: "Batch checked..." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Trust Factor
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.whyTrustUs.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("whyTrustUs", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Item #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("whyTrustUs", idx, "title", e.target.value)}
                                placeholder="Factor Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("whyTrustUs", idx, "description", e.target.value)}
                                placeholder="Factor Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "showcaseGrid" && homeSections.showcaseGrid && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Resource Showcase Grid</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.showcaseGrid.title}
                          onChange={(e) => updateSectionField("showcaseGrid", "title", e.target.value)}
                          placeholder="Built Around India's Woodworking Professionals"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={homeSections.showcaseGrid.subtitle || ""}
                          onChange={(e) => updateSectionField("showcaseGrid", "subtitle", e.target.value)}
                          placeholder="Jivanjor continues to grow..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Showcase Items */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Showcase Grid Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("showcaseGrid", { title: "Technical Resources", description: "Pro guides...", link: "#" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Showcase Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.showcaseGrid.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("showcaseGrid", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Card #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("showcaseGrid", idx, "title", e.target.value)}
                                placeholder="Card Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("showcaseGrid", idx, "description", e.target.value)}
                                placeholder="Card Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(e) => updateItemField("showcaseGrid", idx, "link", e.target.value)}
                                placeholder="Link Target (e.g. #)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "ctaPromo" && homeSections.ctaPromo && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground font-google-sans">CTA Promotion Banner</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Promo Heading Text
                        </label>
                        <input
                          type="text"
                          value={homeSections.ctaPromo.title}
                          onChange={(e) => updateSectionField("ctaPromo", "title", e.target.value)}
                          placeholder="Grow Your Business With a Trusted Adhesive"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Promo Description Paragraph text
                        </label>
                        <textarea
                          rows={3}
                          value={homeSections.ctaPromo.subtitle || ""}
                          onChange={(e) => updateSectionField("ctaPromo", "subtitle", e.target.value)}
                          placeholder="Work with a growing brand..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          CTA Action Button Text
                        </label>
                        <input
                          type="text"
                          value={homeSections.ctaPromo.ctaText}
                          onChange={(e) => updateSectionField("ctaPromo", "ctaText", e.target.value)}
                          placeholder="Partner With Us"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          CTA Action Link Path
                        </label>
                        <input
                          type="text"
                          value={homeSections.ctaPromo.ctaLink || ""}
                          onChange={(e) => updateSectionField("ctaPromo", "ctaLink", e.target.value)}
                          placeholder="/contact"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "testimonials" && homeSections.testimonials && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Testimonial Banner</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Testimonial Heading Title
                        </label>
                        <input
                          type="text"
                          value={homeSections.testimonials.title}
                          onChange={(e) => updateSectionField("testimonials", "title", e.target.value)}
                          placeholder="Trusted by People Who Know the Work"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Testimonial Subheading Description
                        </label>
                        <textarea
                          rows={3}
                          value={homeSections.testimonials.subtitle || ""}
                          onChange={(e) => updateSectionField("testimonials", "subtitle", e.target.value)}
                          placeholder="Hear from carpenters..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          CTA Action Button Text
                        </label>
                        <input
                          type="text"
                          value={homeSections.testimonials.ctaText || ""}
                          onChange={(e) => updateSectionField("testimonials", "ctaText", e.target.value)}
                          placeholder="Partner With Us"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          CTA Action Link Path
                        </label>
                        <input
                          type="text"
                          value={homeSections.testimonials.ctaLink || ""}
                          onChange={(e) => updateSectionField("testimonials", "ctaLink", e.target.value)}
                          placeholder="/contact"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "knowledgeBase" && homeSections.knowledgeBase && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Knowledge Base Guides</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Knowledge base Title Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.knowledgeBase.title}
                          onChange={(e) => updateSectionField("knowledgeBase", "title", e.target.value)}
                          placeholder="Knowledge Base & Guides"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Knowledge base Description Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={homeSections.knowledgeBase.subtitle || ""}
                          onChange={(e) => updateSectionField("knowledgeBase", "subtitle", e.target.value)}
                          placeholder="Explore insights and tips..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* List of Dynamic Resource Cards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Dynamic Guides List</span>
                        <button
                          type="button"
                          onClick={() => addItem("knowledgeBase", { title: "New Masterclass Guide", summary: "Learn techniques...", link: "#" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Guide Item
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.knowledgeBase.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("knowledgeBase", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <div className="flex-1 space-y-2">
                              <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block">Guide #{idx + 1}</span>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("knowledgeBase", idx, "title", e.target.value)}
                                placeholder="Guide Name"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Image</span>
                                <ImageUpload
                                  value={item.image || ""}
                                  onChange={(url) => updateItemField("knowledgeBase", idx, "image", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                              <textarea
                                rows={2}
                                value={item.summary || ""}
                                onChange={(e) => updateItemField("knowledgeBase", idx, "summary", e.target.value)}
                                placeholder="Summary content detail..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(e) => updateItemField("knowledgeBase", idx, "link", e.target.value)}
                                placeholder="Action Redirect URL Path"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* About Layout Tabs */}
                {activeTab === "promise" && homeSections.promise && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Stronger Bonds Promise</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Promise Section Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.promise.title || ""}
                          onChange={(e) => updateSectionField("promise", "title", e.target.value)}
                          placeholder="The Promise of Stronger Bonds"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Promise Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={homeSections.promise.subtitle || ""}
                          onChange={(e) => updateSectionField("promise", "subtitle", e.target.value)}
                          placeholder="Jivanjor is built around the needs..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Promise Cards list */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Promise Feature Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("promise", { title: "New Quality Pillar", desc: "Description...", icon: "/images/about/Ad-product.svg" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Promise Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.promise.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("promise", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Card #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => updateItemField("promise", idx, "title", e.target.value)}
                                placeholder="Card Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.desc || ""}
                                onChange={(e) => updateItemField("promise", idx, "desc", e.target.value)}
                                placeholder="Card Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Icon Image</span>
                                <ImageUpload
                                  value={item.icon || ""}
                                  onChange={(url) => updateItemField("promise", idx, "icon", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "innovation" && homeSections.innovation && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground font-google-sans">Research & Innovation</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Innovation Section Title
                        </label>
                        <input
                          type="text"
                          value={homeSections.innovation.title || ""}
                          onChange={(e) => updateSectionField("innovation", "title", e.target.value)}
                          placeholder="Built on Innovation That Drives Performance"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <span className="block text-xs font-bold text-foreground/50 uppercase tracking-wider">Background Lab Image</span>
                        <ImageUpload
                          value={homeSections.innovation.bgImage || ""}
                          onChange={(url) => updateSectionField("innovation", "bgImage", url)}
                          folder="templates"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Explore CTA Text
                        </label>
                        <input
                          type="text"
                          value={homeSections.innovation.ctaText || ""}
                          onChange={(e) => updateSectionField("innovation", "ctaText", e.target.value)}
                          placeholder="Explore Applications"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Explore CTA Link
                        </label>
                        <input
                          type="text"
                          value={homeSections.innovation.ctaLink || ""}
                          onChange={(e) => updateSectionField("innovation", "ctaLink", e.target.value)}
                          placeholder="/applications"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Innovation Cards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Innovation Pillars</span>
                        <button
                          type="button"
                          onClick={() => addItem("innovation", { title: "New Chemistry Standard", desc: "Description detail..." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Pillar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {homeSections.innovation.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-2">
                            <button
                              type="button"
                              onClick={() => removeItem("innovation", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Pillar #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => updateItemField("innovation", idx, "title", e.target.value)}
                                placeholder="Pillar Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={3}
                                value={item.desc || ""}
                                onChange={(e) => updateItemField("innovation", idx, "desc", e.target.value)}
                                placeholder="Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "responsibility" && homeSections.responsibility && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground font-google-sans">Quality & Responsibility</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Responsibility Main Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.responsibility.title || ""}
                          onChange={(e) => updateSectionField("responsibility", "title", e.target.value)}
                          placeholder="Recognised for Quality. Built with Responsibility."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Responsibility Description Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={homeSections.responsibility.subtitle || ""}
                          onChange={(e) => updateSectionField("responsibility", "subtitle", e.target.value)}
                          placeholder="Jivanjor’s product promise is supported..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Swiper Badges list */}
                    <div className="p-5 border border-border bg-surface/20 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black uppercase text-primary tracking-wider">Awards & Certification Badges</h4>
                        <button
                          type="button"
                          onClick={() => addItem("responsibility", { title: "New Award 2026", src: "/images/about/badge-greenpro.png" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Badge
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.responsibility.badges?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 bg-background border border-border rounded-xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("responsibility", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Badge #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => updateItemField("responsibility", idx, "title", e.target.value)}
                                placeholder="Badge Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Badge Image</span>
                                <ImageUpload
                                  value={item.src || ""}
                                  onChange={(url) => updateItemField("responsibility", idx, "src", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sustainability Card */}
                    <div className="p-5 border border-border bg-surface/20 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-primary tracking-wider font-google-sans">Responsible Manufacturing card</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider mb-2">
                            Sustainability Card Title
                          </label>
                          <input
                            type="text"
                            value={homeSections.responsibility.sustainability?.title || ""}
                            onChange={(e) => updateNestedField("responsibility", "sustainability", "title", e.target.value)}
                            placeholder="A Responsible Approach to Manufacturing"
                            className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-semibold"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider mb-2">
                            Sustainability Subtitle
                          </label>
                          <textarea
                            rows={2}
                            value={homeSections.responsibility.sustainability?.subtitle || ""}
                            onChange={(e) => updateNestedField("responsibility", "sustainability", "subtitle", e.target.value)}
                            placeholder="JACPL follows a long-term sustainability..."
                            className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs resize-none"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-1">
                          <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Illustration / Photo</span>
                          <ImageUpload
                            value={homeSections.responsibility.sustainability?.image || ""}
                            onChange={(url) => updateNestedField("responsibility", "sustainability", "image", url)}
                            folder="templates"
                          />
                        </div>
                      </div>

                      {/* Leaves items practices list */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-t border-border pt-4">
                          <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Environmental Practices (Leaves list)</span>
                          <button
                            type="button"
                            onClick={() => {
                              const currItems = homeSections.responsibility.sustainability?.items || [];
                              const newItems = [...currItems, { title: "Save Energy", desc: "Energy checks..." }];
                              updateNestedField("responsibility", "sustainability", "items", newItems);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Practice item
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {homeSections.responsibility.sustainability?.items?.map((item: any, itemIdx: number) => (
                            <div key={itemIdx} className="p-3 bg-background border border-border rounded-xl relative space-y-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const currItems = homeSections.responsibility.sustainability?.items || [];
                                  const newItems = currItems.filter((_: any, i: number) => i !== itemIdx);
                                  updateNestedField("responsibility", "sustainability", "items", newItems);
                                }}
                                className="absolute top-2 right-2 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-[9px] font-black uppercase bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit">Item #{itemIdx + 1}</span>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => {
                                  const currItems = [...(homeSections.responsibility.sustainability?.items || [])];
                                  currItems[itemIdx] = { ...currItems[itemIdx], title: e.target.value };
                                  updateNestedField("responsibility", "sustainability", "items", currItems);
                                }}
                                placeholder="Practice Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold"
                              />
                              <textarea
                                rows={2}
                                value={item.desc || ""}
                                onChange={(e) => {
                                  const currItems = [...(homeSections.responsibility.sustainability?.items || [])];
                                  currItems[itemIdx] = { ...currItems[itemIdx], desc: e.target.value };
                                  updateNestedField("responsibility", "sustainability", "items", currItems);
                                }}
                                placeholder="Practice Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "presence" && homeSections.presence && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Grid className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Market Presence</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Presence Section Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.presence.title || ""}
                          onChange={(e) => updateSectionField("presence", "title", e.target.value)}
                          placeholder="A Presence Built Through Trust"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Presence Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={homeSections.presence.subtitle || ""}
                          onChange={(e) => updateSectionField("presence", "subtitle", e.target.value)}
                          placeholder="Jivanjor brings together product performance..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* Stats List */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Statistics Cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("presence", { value: "100+", label: "Stat Label", icon: "/images/about/presence.svg" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Stat Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.presence.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("presence", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Stat #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.value || ""}
                                onChange={(e) => updateItemField("presence", idx, "value", e.target.value)}
                                placeholder="Stat Value (e.g. 27,000+)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold mb-2"
                              />
                              <input
                                type="text"
                                value={item.label || ""}
                                onChange={(e) => updateItemField("presence", idx, "label", e.target.value)}
                                placeholder="Stat Label"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Icon Image</span>
                                <ImageUpload
                                  value={item.icon || ""}
                                  onChange={(url) => updateItemField("presence", idx, "icon", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="p-5 border border-border bg-surface/20 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-primary tracking-wider font-google-sans">CTA Action Buttons Setup</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Explore button */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Explore Products CTA</span>
                          <input
                            type="text"
                            value={homeSections.presence.ctaExplore?.text || ""}
                            onChange={(e) => updateNestedField("presence", "ctaExplore", "text", e.target.value)}
                            placeholder="Button Text"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={homeSections.presence.ctaExplore?.actionPath || ""}
                            onChange={(e) => updateNestedField("presence", "ctaExplore", "actionPath", e.target.value)}
                            placeholder="Action Path (e.g. /products)"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                        </div>
                        {/* Partner button */}
                        <div className="space-y-3">
                          <span className="text-[10px] font-black uppercase text-foreground/45 tracking-wider">Partner With Us CTA</span>
                          <input
                            type="text"
                            value={homeSections.presence.ctaPartner?.text || ""}
                            onChange={(e) => updateNestedField("presence", "ctaPartner", "text", e.target.value)}
                            placeholder="Button Text"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            value={homeSections.presence.ctaPartner?.actionPath || ""}
                            onChange={(e) => updateNestedField("presence", "ctaPartner", "actionPath", e.target.value)}
                            placeholder="Action Path (e.g. /partner)"
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "tvcs" && homeSections.tvcs && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Brand TVCs commercials</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          TVCs Section Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.tvcs.title || ""}
                          onChange={(e) => updateSectionField("tvcs", "title", e.target.value)}
                          placeholder="A Brand That Holds It All Together"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          TVCs Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          value={homeSections.tvcs.subtitle || ""}
                          onChange={(e) => updateSectionField("tvcs", "subtitle", e.target.value)}
                          placeholder="Jivanjor brings together product performance..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    {/* TVC commercial videos list */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Commercial Videos</span>
                        <button
                          type="button"
                          onClick={() => addItem("tvcs", { id: "commercial", title: "New Commercial Video", thumbnail: "/images/about/about-video-1.png", youtubeId: "5F7y8l18Nrc" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Video
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.tvcs.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("tvcs", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Video #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => updateItemField("tvcs", idx, "title", e.target.value)}
                                placeholder="Video Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <input
                                type="text"
                                value={item.youtubeId || ""}
                                onChange={(e) => updateItemField("tvcs", idx, "youtubeId", e.target.value)}
                                placeholder="YouTube Video ID (e.g. 5F7y8l18Nrc)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Thumbnail Image</span>
                                <ImageUpload
                                  value={item.thumbnail || ""}
                                  onChange={(url) => updateItemField("tvcs", idx, "thumbnail", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Layout Only Tabs */}
                {activeTab === "specifications" && homeSections.specifications && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Sliders className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Technical Specifications</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={homeSections.specifications.title}
                          onChange={(e) => updateSectionField("specifications", "title", e.target.value)}
                          placeholder="Technical Specifications"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Description/Subtitle
                        </label>
                        <input
                          type="text"
                          value={homeSections.specifications.subtitle || ""}
                          onChange={(e) => updateSectionField("specifications", "subtitle", e.target.value)}
                          placeholder="Accurate specifications tested under normal lab conditions..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Specifications key-value table */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Specifications properties</span>
                        <button
                          type="button"
                          onClick={() => addItem("specifications", { label: "Adhesive Viscosity", value: "220 Poise" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Property row
                        </button>
                      </div>

                      <div className="space-y-3 bg-surface/10 p-4 border border-border rounded-2xl">
                        {homeSections.specifications.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <span className="text-xs text-foreground/40 font-bold shrink-0">#{idx + 1}</span>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => updateItemField("specifications", idx, "label", e.target.value)}
                              placeholder="Property (e.g. Viscosity)"
                              className="flex-1 px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={item.value}
                              onChange={(e) => updateItemField("specifications", idx, "value", e.target.value)}
                              placeholder="Value (e.g. 200 Poise)"
                              className="flex-1 px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-medium"
                            />
                            <button
                              type="button"
                              onClick={() => removeItem("specifications", idx)}
                              className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "features" && homeSections.features && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Performance Features</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Features Heading Title
                        </label>
                        <input
                          type="text"
                          value={homeSections.features.title}
                          onChange={(e) => updateSectionField("features", "title", e.target.value)}
                          placeholder="Key Performance Features"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Features Subtitle
                        </label>
                        <input
                          type="text"
                          value={homeSections.features.subtitle || ""}
                          onChange={(e) => updateSectionField("features", "subtitle", e.target.value)}
                          placeholder="Why Jivanjor outperforms ordinary carpentry glues..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Features checklist cards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Product features features</span>
                        <button
                          type="button"
                          onClick={() => addItem("features", { title: "Extra Sticky Grab", description: "Align laminates easily..." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Feature Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.features.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("features", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Feature #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("features", idx, "title", e.target.value)}
                                placeholder="Feature Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("features", idx, "description", e.target.value)}
                                placeholder="Feature Details Description"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "applicationGuide" && homeSections.applicationGuide && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Grid className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Step-by-Step Application Guide</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Guide Title Main Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.applicationGuide.title}
                          onChange={(e) => updateSectionField("applicationGuide", "title", e.target.value)}
                          placeholder="Step-by-Step Application Guide"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Guide Subtitle details
                        </label>
                        <input
                          type="text"
                          value={homeSections.applicationGuide.subtitle || ""}
                          onChange={(e) => updateSectionField("applicationGuide", "subtitle", e.target.value)}
                          placeholder="Follow these simple steps for professional results..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Guide Steps list */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Application Steps Workflow</span>
                        <button
                          type="button"
                          onClick={() => addItem("applicationGuide", { title: "Next Prep Step", description: "Ensure surface dry...", image: "/images/Champion Super.png" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Guide Step
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.applicationGuide.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("applicationGuide", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Step #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("applicationGuide", idx, "title", e.target.value)}
                                placeholder="Step Title"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("applicationGuide", idx, "description", e.target.value)}
                                placeholder="Step Guidelines detail..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Illustration Image</span>
                                <ImageUpload
                                  value={item.image || ""}
                                  onChange={(url) => updateItemField("applicationGuide", idx, "image", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "faqs" && homeSections.faqs && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Troubleshooting & FAQs</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          FAQ Section Title
                        </label>
                        <input
                          type="text"
                          value={homeSections.faqs.title}
                          onChange={(e) => updateSectionField("faqs", "title", e.target.value)}
                          placeholder="Troubleshooting & FAQs"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          FAQ Section Subtitle
                        </label>
                        <input
                          type="text"
                          value={homeSections.faqs.subtitle || ""}
                          onChange={(e) => updateSectionField("faqs", "subtitle", e.target.value)}
                          placeholder="Common application questions answered..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* FAQ Q&A cards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Troubleshooting FAQ cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("faqs", { question: "What is the clamping time?", answer: "Normally 2 to 3 hours." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Q&A Item
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.faqs.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("faqs", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">FAQ #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.question}
                                onChange={(e) => updateItemField("faqs", idx, "question", e.target.value)}
                                placeholder="Question Text"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.answer}
                                onChange={(e) => updateItemField("faqs", idx, "answer", e.target.value)}
                                placeholder="Detailed Answer description..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories Layout Only Tabs */}
                {activeTab === "categoriesShowcase" && homeSections.categoriesShowcase && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Grid className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Application Sub-Categories Showcase</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Showcase Main Heading
                        </label>
                        <input
                          type="text"
                          value={homeSections.categoriesShowcase.title}
                          onChange={(e) => updateSectionField("categoriesShowcase", "title", e.target.value)}
                          placeholder="Application Sub-Categories"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Showcase Subtitle
                        </label>
                        <input
                          type="text"
                          value={homeSections.categoriesShowcase.subtitle || ""}
                          onChange={(e) => updateSectionField("categoriesShowcase", "subtitle", e.target.value)}
                          placeholder="Navigate through specialized category segments..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Sub-category showcase cards */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Sub-category cards</span>
                        <button
                          type="button"
                          onClick={() => addItem("categoriesShowcase", { name: "Laminates & Veneers", description: "Water-based glues...", image: "/images/Champion Super.png", link: "#" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Category Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.categoriesShowcase.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("categoriesShowcase", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Card #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItemField("categoriesShowcase", idx, "name", e.target.value)}
                                placeholder="Subcategory Name"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("categoriesShowcase", idx, "description", e.target.value)}
                                placeholder="Subcategory description detail..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <input
                                type="text"
                                value={item.link || ""}
                                onChange={(e) => updateItemField("categoriesShowcase", idx, "link", e.target.value)}
                                placeholder="Link Target (e.g. /products?cat=laminates)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Showcase Image</span>
                                <ImageUpload
                                  value={item.image || ""}
                                  onChange={(url) => updateItemField("categoriesShowcase", idx, "image", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "applicationsGrid" && homeSections.applicationsGrid && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground">Common Assembly & Applications Areas</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Grid Heading Title
                        </label>
                        <input
                          type="text"
                          value={homeSections.applicationsGrid.title}
                          onChange={(e) => updateSectionField("applicationsGrid", "title", e.target.value)}
                          placeholder="Common Construction & Assembly Areas"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Grid Description details
                        </label>
                        <input
                          type="text"
                          value={homeSections.applicationsGrid.subtitle || ""}
                          onChange={(e) => updateSectionField("applicationsGrid", "subtitle", e.target.value)}
                          placeholder="Where Jivanjor adhesives are applied daily..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Applications cards lists */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Assembly grids</span>
                        <button
                          type="button"
                          onClick={() => addItem("applicationsGrid", { title: "Kitchen Assembly", description: "Demands moisture proof...", image: "/images/Champion Super.png" })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Assembly Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeSections.applicationsGrid.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3">
                            <button
                              type="button"
                              onClick={() => removeItem("applicationsGrid", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Area #{idx + 1}</span>
                            <div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updateItemField("applicationsGrid", idx, "title", e.target.value)}
                                placeholder="Area Name"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold mb-2"
                              />
                              <textarea
                                rows={2}
                                value={item.description}
                                onChange={(e) => updateItemField("applicationsGrid", idx, "description", e.target.value)}
                                placeholder="Substrate requirements description..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs mb-2 resize-none"
                              />
                              <div className="space-y-1">
                                <span className="block text-[10px] font-bold text-foreground/45 uppercase tracking-wider">Area Image</span>
                                <ImageUpload
                                  value={item.image || ""}
                                  onChange={(url) => updateItemField("applicationsGrid", idx, "image", url)}
                                  folder="templates"
                                  size="compact"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "substrates" && homeSections.substrates && (
                  <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-base font-extrabold text-foreground font-google-sans">Substrates Compatibility Matrix</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Matrix Title
                        </label>
                        <input
                          type="text"
                          value={homeSections.substrates.title}
                          onChange={(e) => updateSectionField("substrates", "title", e.target.value)}
                          placeholder="Substrates Compatibility Matrix"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                          Section Description Subtitle
                        </label>
                        <input
                          type="text"
                          value={homeSections.substrates.subtitle || ""}
                          onChange={(e) => updateSectionField("substrates", "subtitle", e.target.value)}
                          placeholder="Check substrate compatibility ratings..."
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Substrates list rows */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Substrate Boards Rows</span>
                        <button
                          type="button"
                          onClick={() => addItem("substrates", { name: "Plywood to Laminate", suitability: "Excellent", comment: "Perfect bonding grab." })}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Substrate board
                        </button>
                      </div>

                      <div className="space-y-3 bg-surface/10 p-4 border border-border rounded-2xl">
                        {homeSections.substrates.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-4 bg-background border border-border rounded-xl space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => removeItem("substrates", idx)}
                              className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full w-fit">Row #{idx + 1}</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItemField("substrates", idx, "name", e.target.value)}
                                placeholder="Substrate (e.g. MDF to Acrylic)"
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-bold"
                              />
                              <select
                                value={item.suitability}
                                onChange={(e) => updateItemField("substrates", idx, "suitability", e.target.value)}
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold text-foreground cursor-pointer"
                              >
                                <option value="Excellent">Excellent Compatibility</option>
                                <option value="Good">Good Compatibility</option>
                                <option value="Fair">Fair Compatibility</option>
                                <option value="Poor">Poor / Unsupported</option>
                              </select>
                              <input
                                type="text"
                                value={item.comment || ""}
                                onChange={(e) => updateItemField("substrates", idx, "comment", e.target.value)}
                                placeholder="Recommendations details comments..."
                                className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-medium"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom workspace action buttons toolbar */}
              <div className="mt-auto pt-6 border-t border-border flex items-center justify-end gap-3 bg-background shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormView(false)}
                  className="px-6 py-3 rounded-xl text-sm font-bold border border-border text-foreground hover:bg-surface cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-bold bg-primary hover:opacity-90 text-white shadow-md shadow-primary/10 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  <span>Save Template Layout</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ==================== DELETE CONFIRM DIALOG ==================== */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-background border border-border w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 animate-[modalShow_0.15s_ease-out]">
            <h3 className="text-lg font-black text-foreground">
              Confirm Template Deletion
            </h3>
            <p className="text-sm text-foreground/60 leading-normal font-medium">
              Are you absolutely sure you want to delete this dynamic layout sections template? This will erase all configured section parameters permanently.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-border text-foreground hover:bg-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTemplate(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(5px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes modalShow {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
        `
      }} />
    </AdminLayout>
  );
}
