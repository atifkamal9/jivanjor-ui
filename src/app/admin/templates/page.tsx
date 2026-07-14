"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Page, PageTemplate } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Video,
  Link2,
  Tag,
  Award,
  Shield,
  Grid,
  FileText,
  Sliders,
  Type,
  Layout,
  MessageSquare,
  Bookmark,
  Image as ImageIcon,
} from "lucide-react";

// Default template structure aligned with Prisma schema seed structures
const defaultHomeSections = {
  hero: {
    title: "Dependable Bonds for Indian Homes",
    desc: "Superior strength adhesives crafted with state-of-the-art polymer chemistry to safeguard your woodworking and furniture creations for a lifetime.",
    bgImage: "/images/hero.png",
    video: "https://www.youtube.com/watch?v=mock-lab-test",
    actionButtons: {
      primary: { text: "Explore Products", actionPath: "#product-section" },
      secondary: { text: "About Jivanjor", actionPath: "/about" }
    }
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
  const [homeSections, setHomeSections] = useState<any>(defaultHomeSections);

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

  const handleOpenAdd = () => {
    setEditingId(null);
    setTemplateName("");
    setTemplateSlug("");
    setHomeSections(defaultHomeSections);
    setActiveTab("general");
    setIsFormView(true);
  };

  const handleOpenEdit = (template: PageTemplate) => {
    setEditingId(template.id);
    setTemplateName(template.name);
    setTemplateSlug(template.slug);

    // Deep merge sections data with defaults to prevent missing fields
    const rawData = template.rawSections || {};
    const mergedSections = {
      hero: { ...defaultHomeSections.hero, ...rawData.hero },
      productRange: { ...defaultHomeSections.productRange, ...rawData.productRange },
      findAdhesive: { ...defaultHomeSections.findAdhesive, ...rawData.findAdhesive },
      whyTrustUs: { ...defaultHomeSections.whyTrustUs, ...rawData.whyTrustUs },
      showcaseGrid: { ...defaultHomeSections.showcaseGrid, ...rawData.showcaseGrid },
      ctaPromo: { ...defaultHomeSections.ctaPromo, ...rawData.ctaPromo },
      testimonials: { ...defaultHomeSections.testimonials, ...rawData.testimonials },
      knowledgeBase: { ...defaultHomeSections.knowledgeBase, ...rawData.knowledgeBase }
    };

    setHomeSections(mergedSections);
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
    try {
      await api.saveTemplate({
        id: editingId || undefined,
        name: templateName,
        slug: templateSlug,
        sections: homeSections, // Save the dynamic sections JSON tree directly
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

  // Pagination
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTemplates = filteredTemplates.slice(indexOfFirstItem, indexOfLastItem);

  const tabs = [
    { id: "general", label: "General Properties", icon: Sliders },
    { id: "hero", label: "Hero Setup", icon: Layout },
    { id: "productRange", label: "Product Range", icon: Grid },
    { id: "findAdhesive", label: "Right Choice Categories", icon: Search },
    { id: "whyTrustUs", label: "Professional Trust", icon: Award },
    { id: "showcaseGrid", label: "Ecosystem Grid", icon: FileText },
    { id: "ctaPromo", label: "Ecosystem Promo Banner", icon: Bookmark },
    { id: "testimonials", label: "Testimonial Banner", icon: MessageSquare },
    { id: "knowledgeBase", label: "Knowledge Base Guides", icon: Shield }
  ];

  return (
    <AdminLayout>
      {!isFormView ? (
        // ==================== LIST VIEW ====================
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-foreground">
                Dynamic Section Templates
              </h1>
              <p className="text-sm font-semibold text-foreground/45 uppercase tracking-wider">
                Assemble layout configuration states for dynamic Jivanjor sections
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:opacity-90 text-white font-bold text-sm shadow-md shadow-primary/10 cursor-pointer transition-all self-start sm:self-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Configure Dynamic Sections Template</span>
            </button>
          </div>

          {/* Filters Panel */}
          <div className="bg-background border border-border p-4 rounded-2xl shadow-sm transition-colors duration-300">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-background border border-border rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface/55">
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Template Name</th>
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Sections Map</th>
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider">Target Dynamic Pages</th>
                    <th className="p-5 text-xs font-bold text-foreground/45 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-sm font-semibold text-foreground/40 bg-surface/5">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          <span>Retrieving dynamic templates from database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : currentTemplates.length > 0 ? (
                    currentTemplates.map((temp) => {
                      const activePages = pages.filter((p) => p.activeTemplateId === temp.id);
                      return (
                        <tr key={temp.id} className="hover:bg-surface/30 transition-colors">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                <Layers className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-extrabold text-sm text-foreground">{temp.name}</p>
                                <p className="text-[10px] text-foreground/45 font-bold uppercase tracking-wider">/{temp.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5 text-sm text-foreground/75 font-semibold">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-primary bg-primary/10 border border-primary/20">
                              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                              <span>CMS JSON Configured</span>
                            </span>
                          </td>
                          <td className="p-5">
                            {activePages.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {activePages.map((page) => (
                                  <span
                                    key={page.id}
                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-green-600 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30"
                                  >
                                    /{page.slug}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-foreground/40 font-semibold italic">Unmapped (Draft)</span>
                            )}
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(temp)}
                                className="p-2 rounded-lg bg-surface hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all cursor-pointer border border-border"
                                title="Edit layout sections"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(temp.id)}
                                className="p-2 rounded-lg bg-surface hover:bg-primary/10 text-foreground/60 hover:text-primary transition-all cursor-pointer border border-border"
                                title="Delete template"
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
                        No layout templates configured. Create one above to start!
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
                  <span>{editingId ? "CMS Layout Studio" : "Create dynamic layout state"}</span>
                </h1>
                <p className="text-sm font-semibold text-foreground/45 uppercase tracking-wider">
                  Configure precise dynamic structures, sub-items parameters, and promo components
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col lg:flex-row gap-6">
            {/* Sidebar indices tabs */}
            <div className="w-full lg:w-1/4 flex flex-col gap-1.5 shrink-0 bg-surface/30 p-3 border border-border rounded-2xl h-fit">
              {tabs.map((tab) => {
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
            <div className="flex-1 bg-background border border-border p-6 rounded-3xl shadow-sm min-h-[60vh] flex flex-col">
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
                  </div>
                </div>
              )}

              {activeTab === "hero" && (
                <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Layout className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-extrabold text-foreground">Hero Setup</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Hero Banner Title Text
                      </label>
                      <input
                        type="text"
                        value={homeSections.hero.title}
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
                        value={homeSections.hero.desc}
                        onChange={(e) => updateSectionField("hero", "desc", e.target.value)}
                        placeholder="Explain premium quality formulations..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                      />
                    </div>
                    <ImageUpload
                      label="Hero Background Image"
                      value={homeSections.hero.bgImage}
                      onChange={(url) => updateSectionField("hero", "bgImage", url)}
                      folder="templates"
                    />
                    <div>
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Watch Video CTA URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={homeSections.hero.video || ""}
                        onChange={(e) => updateSectionField("hero", "video", e.target.value)}
                        placeholder="e.g. YouTube lab video link"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
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
                          className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs"
                        />
                        <input
                          type="text"
                          value={homeSections.hero.actionButtons?.primary?.actionPath || ""}
                          onChange={(e) => updateNestedField("hero", "actionButtons", "primary", { ...homeSections.hero.actionButtons?.primary, actionPath: e.target.value })}
                          placeholder="Action Path (e.g. #product-section)"
                          className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs"
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
                          className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs"
                        />
                        <input
                          type="text"
                          value={homeSections.hero.actionButtons?.secondary?.actionPath || ""}
                          onChange={(e) => updateNestedField("hero", "actionButtons", "secondary", { ...homeSections.hero.actionButtons?.secondary, actionPath: e.target.value })}
                          placeholder="Action Path (e.g. /about)"
                          className="w-full px-4 py-2 bg-background border border-border rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "productRange" && (
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

              {activeTab === "findAdhesive" && (
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
                        placeholder="Configure categories outline here..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                      />
                    </div>
                  </div>

                  {/* List of Dynamic Category Cards */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Dynamic Category Cards (Seeded order)</span>
                      <button
                        type="button"
                        onClick={() => addItem("findAdhesive", { name: "New Category", link: "#" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Category Card
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {homeSections.findAdhesive.items?.map((item: any, idx: number) => (
                        <div key={idx} className="p-4 border border-border bg-surface/30 rounded-2xl relative space-y-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => removeItem("findAdhesive", idx)}
                            className="absolute top-3 right-3 p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg cursor-pointer transition-colors border border-border bg-background"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <div className="flex-1 space-y-2">
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block">Category #{idx + 1}</span>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItemField("findAdhesive", idx, "name", e.target.value)}
                              placeholder="Category Name"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold"
                            />
                            <input
                              type="text"
                              value={item.link}
                              onChange={(e) => updateItemField("findAdhesive", idx, "link", e.target.value)}
                              placeholder="Redirection Link"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "whyTrustUs" && (
                <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Award className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-extrabold text-foreground">Professional Trust</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Section Heading Title
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
                        Section Description Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={homeSections.whyTrustUs.subtitle || ""}
                        onChange={(e) => updateSectionField("whyTrustUs", "subtitle", e.target.value)}
                        placeholder="Builders endorse Jivanjor..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                      />
                    </div>
                  </div>

                  {/* List of Dynamic Feature Cards */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Trust Features List</span>
                      <button
                        type="button"
                        onClick={() => addItem("whyTrustUs", { title: "New Trust Feature", description: "Consistent hold..." })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Trust Item
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
                          <div className="flex-1 space-y-2">
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block">Item #{idx + 1}</span>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateItemField("whyTrustUs", idx, "title", e.target.value)}
                              placeholder="Feature Title Name"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold"
                            />
                            <textarea
                              rows={2}
                              value={item.description || ""}
                              onChange={(e) => updateItemField("whyTrustUs", idx, "description", e.target.value)}
                              placeholder="Description detail..."
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "showcaseGrid" && (
                <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-extrabold text-foreground">Ecosystem Showcase Grid</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Showcase Heading Title
                      </label>
                      <input
                        type="text"
                        value={homeSections.showcaseGrid.title}
                        onChange={(e) => updateSectionField("showcaseGrid", "title", e.target.value)}
                        placeholder="Built Around India’s Woodworking Professionals"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Showcase Subheading Description
                      </label>
                      <textarea
                        rows={2}
                        value={homeSections.showcaseGrid.subtitle || ""}
                        onChange={(e) => updateSectionField("showcaseGrid", "subtitle", e.target.value)}
                        placeholder="Empowering woodworking communities..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary resize-none"
                      />
                    </div>
                  </div>

                  {/* List of Dynamic Grid items */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-foreground/45 tracking-wider">Showcase Grid Cards</span>
                      <button
                        type="button"
                        onClick={() => addItem("showcaseGrid", { title: "New Resource", description: "Learn more...", link: "#" })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase rounded-lg cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Showcase Item
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
                          <div className="flex-1 space-y-2">
                            <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full inline-block">Card #{idx + 1}</span>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => updateItemField("showcaseGrid", idx, "title", e.target.value)}
                              placeholder="Title"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold"
                            />
                            <textarea
                              rows={2}
                              value={item.description || ""}
                              onChange={(e) => updateItemField("showcaseGrid", idx, "description", e.target.value)}
                              placeholder="Description summary..."
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs resize-none"
                            />
                            <input
                              type="text"
                              value={item.link || ""}
                              onChange={(e) => updateItemField("showcaseGrid", idx, "link", e.target.value)}
                              placeholder="Redirection action path"
                              className="w-full px-3 py-1.5 bg-background border border-border rounded-xl text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "ctaPromo" && (
                <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Bookmark className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-extrabold text-foreground">Ecosystem Promo CTA Banner</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-foreground/50 uppercase tracking-wider mb-2">
                        Promo Banner Heading
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
                        value={homeSections.ctaPromo.ctaLink}
                        onChange={(e) => updateSectionField("ctaPromo", "ctaLink", e.target.value)}
                        placeholder="/contact"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface/50 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "testimonials" && (
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

              {activeTab === "knowledgeBase" && (
                <div className="space-y-6 animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex items-center gap-2 border-b border-border pb-3">
                    <Shield className="h-5 w-5 text-primary" />
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
              Are you absolutely sure you want to delete thisdynamic layout sections template? This will erase all configured section parameters permanently.
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
