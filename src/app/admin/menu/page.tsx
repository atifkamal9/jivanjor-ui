"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, Category } from "@/lib/api";
import {
  MenuItem,
  SubMenuItem,
  MenuType,
  DEFAULT_HEADER_MENU,
  FooterSectionItem,
  FooterLinkItem,
  DEFAULT_FOOTER_MENU,
} from "@/lib/menuTypes";
import ImageUpload from "@/components/admin/ImageUpload";
import { FALLBACK_BLOG_CATEGORIES } from "@/lib/blog-categories";
import {
  GripVertical,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Globe,
  FileText,
  FolderTree,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Lock,
  Layers,
  ChevronDown,
  ChevronRight,
  Info,
  LayoutTemplate,
  Footprints,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";


export default function AdminMenuPage() {
  // Active Tab: "header" | "footer"
  const [activeTab, setActiveTab] = useState<"header" | "footer">("header");

  // ── HEADER MENU STATE ──────────────────────────────────────────────────
  const [headerItems, setHeaderItems] = useState<MenuItem[]>([]);
  const [publishedHeaderItems, setPublishedHeaderItems] = useState<MenuItem[]>([]);

  // ── FOOTER MENU STATE ──────────────────────────────────────────────────
  const [footerSections, setFooterSections] = useState<FooterSectionItem[]>([]);
  const [publishedFooterSections, setPublishedFooterSections] = useState<FooterSectionItem[]>([]);

  // Common UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Dynamic pages for page selector dropdown
  const [availablePages, setAvailablePages] = useState<{ title: string; slug: string }[]>([]);

  // Product mega menu categories (for ordering)
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  // Dragged product category index (for the Products static menu reorder)
  const [draggedProductCatIndex, setDraggedProductCatIndex] = useState<number | null>(null);
  // Expanded product main-cats (to show sub-cat reorder)
  const [expandedProductCats, setExpandedProductCats] = useState<Record<string, boolean>>({});
  // Dragged sub-category info within a main category
  const [draggedProductSubCatInfo, setDraggedProductSubCatInfo] = useState<{ mainCatId: string; subIdx: number } | null>(null);

  // Drag & drop state for Header main items
  const [draggedMainIndex, setDraggedMainIndex] = useState<number | null>(null);
  // Drag & drop state for Header sub items
  const [draggedSubInfo, setDraggedSubInfo] = useState<{ mainIdx: number; subIdx: number } | null>(null);

  // Drag & drop state for Footer sections
  const [draggedFooterSecIndex, setDraggedFooterSecIndex] = useState<number | null>(null);
  // Drag & drop state for Footer sub links
  const [draggedFooterLinkInfo, setDraggedFooterLinkInfo] = useState<{ secIdx: number; subIdx: number } | null>(null);

  // Expanded items state
  const [expandedHeaderItems, setExpandedHeaderItems] = useState<Record<string, boolean>>({});
  const [expandedFooterSections, setExpandedFooterSections] = useState<Record<string, boolean>>({});

  // Header Main Item Modal state
  const [mainModalOpen, setMainModalOpen] = useState(false);
  const [editingMainIndex, setEditingMainIndex] = useState<number | null>(null);
  const [mainFormData, setMainFormData] = useState<{
    title: string;
    type: MenuType;
    url: string;
    target: "_self" | "_blank";
    description: string;
    image: string;
  }>({
    title: "",
    type: "menu",
    url: "",
    target: "_self",
    description: "",
    image: "",
  });

  // Header Sub Item Modal state
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [targetMainIndex, setTargetMainIndex] = useState<number | null>(null);
  const [editingSubIndex, setEditingSubIndex] = useState<number | null>(null);
  const [subFormData, setSubFormData] = useState<{
    title: string;
    type: "page" | "external_link";
    url: string;
    target: "_self" | "_blank";
    description: string;
    image: string;
  }>({
    title: "",
    type: "page",
    url: "",
    target: "_self",
    description: "",
    image: "",
  });


  // Footer Section Modal state
  const [footerSecModalOpen, setFooterSecModalOpen] = useState(false);
  const [editingFooterSecIdx, setEditingFooterSecIdx] = useState<number | null>(null);
  const [footerSecTitle, setFooterSecTitle] = useState("");

  // Footer Sub Link Modal state
  const [footerLinkModalOpen, setFooterLinkModalOpen] = useState(false);
  const [targetFooterSecIdx, setTargetFooterSecIdx] = useState<number | null>(null);
  const [editingFooterLinkIdx, setEditingFooterLinkIdx] = useState<number | null>(null);
  const [footerLinkFormData, setFooterLinkFormData] = useState<{
    title: string;
    url: string;
    target: "_self" | "_blank";
  }>({
    title: "",
    url: "",
    target: "_self",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [headerRes, footerRes, pagesRes, blogTemplateRes, blogPostsRes, categoriesRes] = await Promise.all([
        api.getHeaderMenu(),
        api.getFooterMenu(),
        api.getPages().catch(() => []),
        api.getActiveTemplateForPage("blog").catch(() => null),
        api.getBlogPosts().catch(() => []),
        api.getCategories().catch(() => [] as Category[]),
      ]);

      setAllCategories(categoriesRes);

      let templateCats: string[] = [];
      const listSection = (blogTemplateRes as any)?.rawSections?.list || (blogTemplateRes as any)?.sections?.find((s: any) => s.type === "list" || s.id === "list");
      if (listSection?.categories && Array.isArray(listSection.categories)) {
        templateCats = listSection.categories.map((c: any) => typeof c === "string" ? c : c.name).filter(Boolean);
      }
      const postCats = blogPostsRes.map((b: any) => b.category).filter(Boolean);
      const allBlogCategories = Array.from(
        new Set([
          ...FALLBACK_BLOG_CATEGORIES,
          ...templateCats,
          ...postCats,
        ])
      ).filter(Boolean);

      const syncKnowledgeSubItems = (menuList: MenuItem[]): MenuItem[] => {
        return menuList.map((item) => {
          if (item.id === "nav-knowledge" || item.title.toLowerCase() === "knowledge center") {
            if (!item.subItems) {
              const defaultSubs = allBlogCategories.map((catName, idx) => ({
                id: `sub-know-dyn-${Date.now()}-${idx}`,
                title: catName,
                type: "page" as const,
                url: `/blog?category=${encodeURIComponent(catName)}`,
                order: idx + 1,
              }));
              return { ...item, subItems: defaultSubs };
            }
          }
          return item;
        });
      };

      const rawHeaderDraft = headerRes.draftItems.length > 0 ? headerRes.draftItems : DEFAULT_HEADER_MENU;
      const rawHeaderPub = headerRes.publishedItems.length > 0 ? headerRes.publishedItems : DEFAULT_HEADER_MENU;

      const initialHeaderDraft = syncKnowledgeSubItems(rawHeaderDraft);
      const initialHeaderPub = syncKnowledgeSubItems(rawHeaderPub);

      const initialFooterDraft = footerRes.draftItems.length > 0 ? footerRes.draftItems : DEFAULT_FOOTER_MENU;
      const initialFooterPub = footerRes.publishedItems.length > 0 ? footerRes.publishedItems : DEFAULT_FOOTER_MENU;

      setHeaderItems(initialHeaderDraft);
      setPublishedHeaderItems(initialHeaderPub);

      setFooterSections(initialFooterDraft);
      setPublishedFooterSections(initialFooterPub);

      // Expand all mega menus & footer sections by default
      const expHeader: Record<string, boolean> = {};
      initialHeaderDraft.forEach((it: MenuItem) => {
        if (it.type === "menu") expHeader[it.id] = true;
      });
      setExpandedHeaderItems(expHeader);

      const expFooter: Record<string, boolean> = {};
      initialFooterDraft.forEach((sec: FooterSectionItem) => {
        expFooter[sec.id] = true;
      });
      setExpandedFooterSections(expFooter);

      // System pages list
      const staticPages = [
        { title: "Home", slug: "/" },
        { title: "About Jivanjor", slug: "/about" },
        { title: "Research & Innovation", slug: "/about/research-and-innovation" },
        { title: "Quality & Performance Promise", slug: "/about/quality-and-performance-promise" },
        { title: "TVC", slug: "/about/tvc" },
        { title: "Market Presence", slug: "/about/market-presence" },
        { title: "Applications", slug: "/applications" },
        { title: "Blog Catalog", slug: "/blog" },
        { title: "Technical Resources", slug: "/resources" },
        { title: "Dealer / Partner Connect", slug: "/partner" },
        { title: "Contractor Connect", slug: "/contractor" },
        { title: "Contact Us", slug: "/contact" },
        { title: "Sitemap", slug: "/sitemap" },
        { title: "Privacy Policy", slug: "/privacy" },
      ];

      const customPages = pagesRes.map((p: any) => {
        let rawSlug = p.slug || "";
        if (rawSlug.startsWith("/")) return { title: p.title, slug: rawSlug };

        let sectionsObj: any = {};
        try {
          sectionsObj = typeof p.sections === "string" ? JSON.parse(p.sections) : (p.sections || {});
        } catch {
          sectionsObj = {};
        }

        const layoutType = sectionsObj?.layoutType || "";
        let pageUrl = `/${rawSlug}`;

        if (layoutType === "applications" && rawSlug !== "applications") {
          pageUrl = `/applications/${rawSlug}`;
        } else if (layoutType === "about" && rawSlug !== "about") {
          pageUrl = `/about/${rawSlug}`;
        } else if (layoutType === "blog" && rawSlug !== "blog") {
          pageUrl = `/blog/${rawSlug}`;
        } else if (layoutType === "categories" && rawSlug !== "categories") {
          pageUrl = `/categories/${rawSlug}`;
        } else if (layoutType === "products" && rawSlug !== "products") {
          pageUrl = `/products/${rawSlug}`;
        }

        return {
          title: p.title,
          slug: pageUrl,
        };
      });

      const allP = [...staticPages];
      customPages.forEach((cp: { title: string; slug: string }) => {
        if (!allP.some((sp) => sp.slug === cp.slug)) {
          allP.push(cp);
        }
      });
      setAvailablePages(allP);
    } catch (err) {
      console.error("Failed to load menu data:", err);
      showToast("Failed to load menu data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text: string, type: "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const hasHeaderUnsavedChanges = () => {
    return JSON.stringify(headerItems) !== JSON.stringify(publishedHeaderItems);
  };

  const hasFooterUnsavedChanges = () => {
    return JSON.stringify(footerSections) !== JSON.stringify(publishedFooterSections);
  };

  const toggleHeaderExpand = (id: string) => {
    setExpandedHeaderItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFooterExpand = (id: string) => {
    setExpandedFooterSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ── HEADER MENU DRAG AND DROP HANDLERS ──────────────────────────────────
  const handleMainDragStart = (e: React.DragEvent, index: number) => {
    setDraggedMainIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleMainDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedMainIndex === null || draggedMainIndex === index) return;

    const newItems = [...headerItems];
    const draggedItem = newItems[draggedMainIndex];
    newItems.splice(draggedMainIndex, 1);
    newItems.splice(index, 0, draggedItem);
    newItems.forEach((it, idx) => (it.order = idx + 1));

    setDraggedMainIndex(index);
    setHeaderItems(newItems);
  };

  const handleMainDragEnd = async () => {
    setDraggedMainIndex(null);
    await saveHeaderDraft(headerItems);
  };

  const moveHeaderMainItem = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= headerItems.length) return;

    const newItems = [...headerItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    newItems.forEach((it, idx) => (it.order = idx + 1));

    setHeaderItems(newItems);
    await saveHeaderDraft(newItems);
  };

  const handleHeaderSubDragStart = (e: React.DragEvent, mainIdx: number, subIdx: number) => {
    e.stopPropagation();
    setDraggedSubInfo({ mainIdx, subIdx });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleHeaderSubDragOver = (e: React.DragEvent, mainIdx: number, subIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedSubInfo || draggedSubInfo.mainIdx !== mainIdx || draggedSubInfo.subIdx === subIdx) return;

    const newItems = [...headerItems];
    const subItems = [...(newItems[mainIdx].subItems || [])];
    const draggedSub = subItems[draggedSubInfo.subIdx];

    subItems.splice(draggedSubInfo.subIdx, 1);
    subItems.splice(subIdx, 0, draggedSub);
    subItems.forEach((s, idx) => (s.order = idx + 1));

    newItems[mainIdx].subItems = subItems;
    setDraggedSubInfo({ mainIdx, subIdx });
    setHeaderItems(newItems);
  };

  const handleHeaderSubDragEnd = async () => {
    setDraggedSubInfo(null);
    await saveHeaderDraft(headerItems);
  };

  const moveHeaderSubItem = async (mainIdx: number, subIdx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? subIdx - 1 : subIdx + 1;
    const subItems = headerItems[mainIdx].subItems || [];
    if (targetIdx < 0 || targetIdx >= subItems.length) return;

    const newItems = [...headerItems];
    const newSubItems = [...subItems];
    const temp = newSubItems[subIdx];
    newSubItems[subIdx] = newSubItems[targetIdx];
    newSubItems[targetIdx] = temp;

    newSubItems.forEach((s, idx) => (s.order = idx + 1));
    newItems[mainIdx].subItems = newSubItems;
    setHeaderItems(newItems);
    await saveHeaderDraft(newItems);
  };

  const saveHeaderDraft = async (updatedItems: MenuItem[]) => {
    setSaving(true);
    try {
      await api.updateDraftHeaderMenu(updatedItems);
    } catch (err) {
      console.error("Failed to save header draft:", err);
      showToast("Failed to auto-save header draft", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePublishHeader = async () => {
    setPublishing(true);
    try {
      const res = await api.publishHeaderMenu();
      setPublishedHeaderItems(res.publishedItems || headerItems);
      showToast("Header menu published successfully!", "success");
    } catch (err) {
      console.error("Failed to publish header menu:", err);
      showToast("Failed to publish header menu", "error");
    } finally {
      setPublishing(false);
    }
  };

  const handleResetHeader = async () => {
    if (!window.confirm("Are you sure you want to reset header menu to default settings?")) return;
    setResetting(true);
    try {
      const res = await api.resetHeaderMenu();
      setHeaderItems(res.draftItems || DEFAULT_HEADER_MENU);
      setPublishedHeaderItems(res.publishedItems || DEFAULT_HEADER_MENU);
      showToast("Header menu reset to default settings", "success");
    } catch (err) {
      console.error("Failed to reset header menu:", err);
      showToast("Failed to reset header menu", "error");
    } finally {
      setResetting(false);
    }
  };

  // ── FOOTER MENU DRAG AND DROP HANDLERS ──────────────────────────────────
  const handleFooterSecDragStart = (e: React.DragEvent, index: number) => {
    setDraggedFooterSecIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleFooterSecDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedFooterSecIndex === null || draggedFooterSecIndex === index) return;

    const newSections = [...footerSections];
    const draggedSec = newSections[draggedFooterSecIndex];
    newSections.splice(draggedFooterSecIndex, 1);
    newSections.splice(index, 0, draggedSec);
    newSections.forEach((s, idx) => (s.order = idx + 1));

    setDraggedFooterSecIndex(index);
    setFooterSections(newSections);
  };

  const handleFooterSecDragEnd = async () => {
    setDraggedFooterSecIndex(null);
    await saveFooterDraft(footerSections);
  };

  const moveFooterSection = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= footerSections.length) return;

    const newSections = [...footerSections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;
    newSections.forEach((s, idx) => (s.order = idx + 1));

    setFooterSections(newSections);
    await saveFooterDraft(newSections);
  };

  const handleFooterLinkDragStart = (e: React.DragEvent, secIdx: number, subIdx: number) => {
    e.stopPropagation();
    setDraggedFooterLinkInfo({ secIdx, subIdx });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleFooterLinkDragOver = (e: React.DragEvent, secIdx: number, subIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedFooterLinkInfo || draggedFooterLinkInfo.secIdx !== secIdx || draggedFooterLinkInfo.subIdx === subIdx) return;

    const newSections = [...footerSections];
    const subItems = [...(newSections[secIdx].subItems || [])];
    const draggedLink = subItems[draggedFooterLinkInfo.subIdx];

    subItems.splice(draggedFooterLinkInfo.subIdx, 1);
    subItems.splice(subIdx, 0, draggedLink);
    subItems.forEach((l, idx) => (l.order = idx + 1));

    newSections[secIdx].subItems = subItems;
    setDraggedFooterLinkInfo({ secIdx, subIdx });
    setFooterSections(newSections);
  };

  const handleFooterLinkDragEnd = async () => {
    setDraggedFooterLinkInfo(null);
    await saveFooterDraft(footerSections);
  };

  const moveFooterSubLink = async (secIdx: number, subIdx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? subIdx - 1 : subIdx + 1;
    const subItems = footerSections[secIdx].subItems || [];
    if (targetIdx < 0 || targetIdx >= subItems.length) return;

    const newSections = [...footerSections];
    const newSubItems = [...subItems];
    const temp = newSubItems[subIdx];
    newSubItems[subIdx] = newSubItems[targetIdx];
    newSubItems[targetIdx] = temp;

    newSubItems.forEach((l, idx) => (l.order = idx + 1));
    newSections[secIdx].subItems = newSubItems;
    setFooterSections(newSections);
    await saveFooterDraft(newSections);
  };

  const saveFooterDraft = async (updatedSections: FooterSectionItem[]) => {
    setSaving(true);
    try {
      await api.updateDraftFooterMenu(updatedSections);
    } catch (err) {
      console.error("Failed to save footer draft:", err);
      showToast("Failed to auto-save footer draft", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePublishFooter = async () => {
    setPublishing(true);
    try {
      const res = await api.publishFooterMenu();
      setPublishedFooterSections(res.publishedItems || footerSections);
      showToast("Footer menu published successfully!", "success");
    } catch (err) {
      console.error("Failed to publish footer menu:", err);
      showToast("Failed to publish footer menu", "error");
    } finally {
      setPublishing(false);
    }
  };

  const handleResetFooter = async () => {
    if (!window.confirm("Are you sure you want to reset footer menu to default settings?")) return;
    setResetting(true);
    try {
      const res = await api.resetFooterMenu();
      setFooterSections(res.draftItems || DEFAULT_FOOTER_MENU);
      setPublishedFooterSections(res.publishedItems || DEFAULT_FOOTER_MENU);
      showToast("Footer menu reset to default settings", "success");
    } catch (err) {
      console.error("Failed to reset footer menu:", err);
      showToast("Failed to reset footer menu", "error");
    } finally {
      setResetting(false);
    }
  };

  // ── HEADER MODAL HANDLERS ──────────────────────────────────────────────
  const openAddMainModal = () => {
    setEditingMainIndex(null);
    setMainFormData({ title: "", type: "menu", url: "", target: "_self", description: "", image: "" });
    setMainModalOpen(true);
  };

  const openEditMainModal = (index: number) => {
    const item = headerItems[index];
    setEditingMainIndex(index);
    setMainFormData({
      title: item.title,
      type: item.type,
      url: item.url || "",
      target: item.target || "_self",
      description: item.description || "",
      image: item.image || "",
    });
    setMainModalOpen(true);
  };

  const handleSaveMainItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainFormData.title.trim()) {
      showToast("Item title is required", "error");
      return;
    }

    const newItems = [...headerItems];
    const urlValue = mainFormData.type === "menu" ? null : mainFormData.url.trim();

    if (editingMainIndex !== null) {
      newItems[editingMainIndex] = {
        ...newItems[editingMainIndex],
        title: mainFormData.title.trim(),
        type: mainFormData.type,
        url: urlValue,
        target: mainFormData.type === "external_link" ? mainFormData.target : "_self",
        description: mainFormData.description.trim() || undefined,
        image: mainFormData.image.trim() || null,
        isMegaMenu: mainFormData.type === "menu",
      };
    } else {
      const newItem: MenuItem = {
        id: `nav-${Date.now()}`,
        title: mainFormData.title.trim(),
        type: mainFormData.type,
        url: urlValue,
        target: mainFormData.type === "external_link" ? mainFormData.target : "_self",
        description: mainFormData.description.trim() || undefined,
        image: mainFormData.image.trim() || null,
        isMegaMenu: mainFormData.type === "menu",
        isStatic: false,
        order: newItems.length + 1,
        subItems: [],
      };
      newItems.push(newItem);
    }

    setHeaderItems(newItems);
    setMainModalOpen(false);
    await saveHeaderDraft(newItems);
    showToast(editingMainIndex !== null ? "Main menu item updated" : "New main menu item added", "success");
  };

  const handleDeleteMainItem = async (index: number) => {
    const item = headerItems[index];
    if (item.isStatic) {
      showToast("Product menu is static and cannot be deleted", "error");
      return;
    }
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    const newItems = headerItems.filter((_, idx) => idx !== index);
    newItems.forEach((it, idx) => (it.order = idx + 1));
    setHeaderItems(newItems);
    await saveHeaderDraft(newItems);
    showToast("Main menu item deleted", "success");
  };

  const openAddSubModal = (mainIdx: number) => {
    if (headerItems[mainIdx].isStatic) {
      showToast("Product menu is static. Admin cannot add custom sub-pages under Product menu.", "error");
      return;
    }
    setTargetMainIndex(mainIdx);
    setEditingSubIndex(null);
    setSubFormData({ title: "", type: "page", url: "", target: "_self", description: "", image: "" });
    setSubModalOpen(true);
  };

  const openEditSubModal = (mainIdx: number, subIdx: number) => {
    const sub = headerItems[mainIdx].subItems?.[subIdx];
    if (!sub) return;
    setTargetMainIndex(mainIdx);
    setEditingSubIndex(subIdx);
    setSubFormData({
      title: sub.title,
      type: sub.type,
      url: sub.url,
      target: sub.target || "_self",
      description: sub.description || "",
      image: sub.image || "",
    });
    setSubModalOpen(true);
  };

  const handleSaveSubItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetMainIndex === null) return;
    if (!subFormData.title.trim() || !subFormData.url.trim()) {
      showToast("Title and URL are required for sub-items", "error");
      return;
    }

    const newItems = [...headerItems];
    const currentSubItems = [...(newItems[targetMainIndex].subItems || [])];

    if (editingSubIndex !== null) {
      currentSubItems[editingSubIndex] = {
        ...currentSubItems[editingSubIndex],
        title: subFormData.title.trim(),
        type: subFormData.type,
        url: subFormData.url.trim(),
        target: subFormData.type === "external_link" ? subFormData.target : "_self",
        description: subFormData.description.trim(),
        image: subFormData.image.trim() || null,
      };
    } else {
      const newSub: SubMenuItem = {
        id: `sub-${Date.now()}`,
        title: subFormData.title.trim(),
        type: subFormData.type,
        url: subFormData.url.trim(),
        target: subFormData.type === "external_link" ? subFormData.target : "_self",
        description: subFormData.description.trim(),
        image: subFormData.image.trim() || null,
        order: currentSubItems.length + 1,
      };
      currentSubItems.push(newSub);
    }

    newItems[targetMainIndex].subItems = currentSubItems;
    setHeaderItems(newItems);
    setSubModalOpen(false);
    await saveHeaderDraft(newItems);
    showToast(editingSubIndex !== null ? "Sub-item updated" : "Sub-item added", "success");
  };


  const handleDeleteSubItem = async (mainIdx: number, subIdx: number) => {
    if (headerItems[mainIdx].isStatic) {
      showToast("Product menu sub-items are static", "error");
      return;
    }
    const newItems = [...headerItems];
    const subItems = [...(newItems[mainIdx].subItems || [])];
    subItems.splice(subIdx, 1);
    subItems.forEach((s, idx) => (s.order = idx + 1));
    newItems[mainIdx].subItems = subItems;

    setHeaderItems(newItems);
    await saveHeaderDraft(newItems);
    showToast("Sub-item deleted", "success");
  };

  // ── PRODUCTS MEGA MENU ORDER HANDLERS ──────────────────────────────────
  // Returns the ordered list of main categories for the Products mega menu.
  // Priority: stored order in nav-products.subItems → API order.
  const getProductsMenuMainCats = (): Category[] => {
    const mainCats = allCategories.filter((c) => !c.parent_category && c.isVisible !== false && !c.hideInMenu);
    const productsItem = headerItems.find(
      (it) => it.isStatic || it.id === "nav-products" || it.title.toLowerCase() === "products"
    );
    const storedOrder = productsItem?.subItems || [];
    if (storedOrder.length > 0) {
      // Sort main cats according to stored order
      const orderMap = new Map(storedOrder.map((s) => [s.id, s.order]));
      return [...mainCats].sort((a, b) => {
        const oa = orderMap.get(a.id) ?? 9999;
        const ob = orderMap.get(b.id) ?? 9999;
        return oa - ob;
      });
    }
    return mainCats;
  };

  // Save the product category order back into nav-products.subItems,
  // preserving any existing sub-category ordering stored in description.
  const saveProductCategoryOrder = async (orderedCats: Category[], currentHeaderItems?: typeof headerItems) => {
    const base = currentHeaderItems ?? headerItems;
    const newItems = [...base];
    const productsIdx = newItems.findIndex(
      (it) => it.isStatic || it.id === "nav-products" || it.title.toLowerCase() === "products"
    );
    if (productsIdx === -1) return;

    // Preserve existing sub-order descriptions
    const existingSubItems = newItems[productsIdx].subItems || [];
    const existingDescMap = new Map(existingSubItems.map((s) => [s.id, s.description || ""]));

    newItems[productsIdx] = {
      ...newItems[productsIdx],
      subItems: orderedCats.map((cat, idx) => ({
        id: cat.id,
        title: cat.name,
        type: "page" as const,
        url: `/categories/${cat.slug}`,
        order: idx + 1,
        description: existingDescMap.get(cat.id) || "",
      })),
    };
    setHeaderItems(newItems);
    await saveHeaderDraft(newItems);
  };

  const handleProductCatDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedProductCatIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleProductCatDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedProductCatIndex === null || draggedProductCatIndex === index) return;
    const orderedCats = getProductsMenuMainCats();
    const reordered = [...orderedCats];
    const draggedCat = reordered[draggedProductCatIndex];
    reordered.splice(draggedProductCatIndex, 1);
    reordered.splice(index, 0, draggedCat);
    setDraggedProductCatIndex(index);
    // Immediately reflect in header state
    const newItems = [...headerItems];
    const productsIdx = newItems.findIndex(
      (it) => it.isStatic || it.id === "nav-products" || it.title.toLowerCase() === "products"
    );
    if (productsIdx !== -1) {
      newItems[productsIdx] = {
        ...newItems[productsIdx],
        subItems: reordered.map((cat, idx) => ({
          id: cat.id,
          title: cat.name,
          type: "page" as const,
          url: `/categories/${cat.slug}`,
          order: idx + 1,
        })),
      };
      setHeaderItems(newItems);
    }
  };

  const handleProductCatDragEnd = async () => {
    setDraggedProductCatIndex(null);
    await saveHeaderDraft(headerItems);
  };

  const moveProductCat = async (index: number, direction: "up" | "down") => {
    const orderedCats = getProductsMenuMainCats();
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= orderedCats.length) return;
    const reordered = [...orderedCats];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    await saveProductCategoryOrder(reordered);
    showToast("Product category order updated", "success");
  };

  // ── PRODUCT SUB-CATEGORY ORDER HANDLERS ────────────────────────
  // Returns the ordered list of sub-categories for a given main category.
  // Priority: stored sub-order in description JSON → API order.
  const getOrderedSubCats = (mainCatId: string): Category[] => {
    const rawSubCats = allCategories.filter((c) => c.parent_category === mainCatId && c.isVisible !== false && !c.hideInMenu);
    const productsItem = headerItems.find(
      (it) => it.isStatic || it.id === "nav-products" || it.title.toLowerCase() === "products"
    );
    const storedEntry = (productsItem?.subItems || []).find((s) => s.id === mainCatId);
    if (storedEntry?.description) {
      try {
        const parsed = JSON.parse(storedEntry.description);
        const subOrderIds: string[] = parsed.subOrder || [];
        if (subOrderIds.length > 0) {
          const orderMap = new Map(subOrderIds.map((id, i) => [id, i]));
          return [...rawSubCats].sort((a, b) => {
            const oa = orderMap.has(a.id) ? orderMap.get(a.id)! : 9999;
            const ob = orderMap.has(b.id) ? orderMap.get(b.id)! : 9999;
            return oa - ob;
          });
        }
      } catch { /* ignore parse errors */ }
    }
    return rawSubCats;
  };

  // Persist sub-category ordering into the description field of the matching nav-products subItem.
  const saveProductSubCategoryOrder = async (mainCatId: string, orderedSubCats: Category[]) => {
    const newItems = [...headerItems];
    const productsIdx = newItems.findIndex(
      (it) => it.isStatic || it.id === "nav-products" || it.title.toLowerCase() === "products"
    );
    if (productsIdx === -1) return;

    const existingSubItems = newItems[productsIdx].subItems || [];
    const updatedSubItems = existingSubItems.map((entry) => {
      if (entry.id !== mainCatId) return entry;
      const subOrderDesc = JSON.stringify({ subOrder: orderedSubCats.map((c) => c.id) });
      return { ...entry, description: subOrderDesc };
    });

    newItems[productsIdx] = { ...newItems[productsIdx], subItems: updatedSubItems };
    setHeaderItems(newItems);
    await saveHeaderDraft(newItems);
  };

  const handleProductSubCatDragStart = (e: React.DragEvent, mainCatId: string, subIdx: number) => {
    e.stopPropagation();
    setDraggedProductSubCatInfo({ mainCatId, subIdx });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleProductSubCatDragOver = (e: React.DragEvent, mainCatId: string, subIdx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!draggedProductSubCatInfo || draggedProductSubCatInfo.mainCatId !== mainCatId || draggedProductSubCatInfo.subIdx === subIdx) return;

    const ordered = getOrderedSubCats(mainCatId);
    const reordered = [...ordered];
    const dragged = reordered[draggedProductSubCatInfo.subIdx];
    reordered.splice(draggedProductSubCatInfo.subIdx, 1);
    reordered.splice(subIdx, 0, dragged);
    setDraggedProductSubCatInfo({ mainCatId, subIdx });

    // Immediately reflect in state
    const newItems = [...headerItems];
    const productsIdx = newItems.findIndex(
      (it) => it.isStatic || it.id === "nav-products" || it.title.toLowerCase() === "products"
    );
    if (productsIdx !== -1) {
      const existingSubItems = newItems[productsIdx].subItems || [];
      const updatedSubItems = existingSubItems.map((entry) => {
        if (entry.id !== mainCatId) return entry;
        return { ...entry, description: JSON.stringify({ subOrder: reordered.map((c) => c.id) }) };
      });
      newItems[productsIdx] = { ...newItems[productsIdx], subItems: updatedSubItems };
      setHeaderItems(newItems);
    }
  };

  const handleProductSubCatDragEnd = async () => {
    setDraggedProductSubCatInfo(null);
    await saveHeaderDraft(headerItems);
  };

  const moveProductSubCat = async (mainCatId: string, subIdx: number, direction: "up" | "down") => {
    const ordered = getOrderedSubCats(mainCatId);
    const targetIdx = direction === "up" ? subIdx - 1 : subIdx + 1;
    if (targetIdx < 0 || targetIdx >= ordered.length) return;
    const reordered = [...ordered];
    const temp = reordered[subIdx];
    reordered[subIdx] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    await saveProductSubCategoryOrder(mainCatId, reordered);
    showToast("Sub-category order updated", "success");
  };

  // ── FOOTER MODAL HANDLERS ──────────────────────────────────────────────
  const openAddFooterSecModal = () => {
    setEditingFooterSecIdx(null);
    setFooterSecTitle("");
    setFooterSecModalOpen(true);
  };

  const openEditFooterSecModal = (secIdx: number) => {
    setEditingFooterSecIdx(secIdx);
    setFooterSecTitle(footerSections[secIdx].title);
    setFooterSecModalOpen(true);
  };

  const handleSaveFooterSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerSecTitle.trim()) {
      showToast("Section title is required", "error");
      return;
    }

    const newSections = [...footerSections];
    if (editingFooterSecIdx !== null) {
      newSections[editingFooterSecIdx].title = footerSecTitle.trim();
    } else {
      const newSec: FooterSectionItem = {
        id: `fsec-${Date.now()}`,
        title: footerSecTitle.trim(),
        order: newSections.length + 1,
        subItems: [],
      };
      newSections.push(newSec);
    }

    setFooterSections(newSections);
    setFooterSecModalOpen(false);
    await saveFooterDraft(newSections);
    showToast(editingFooterSecIdx !== null ? "Footer section updated" : "Footer section added", "success");
  };

  const handleDeleteFooterSection = async (secIdx: number) => {
    const sec = footerSections[secIdx];
    if (!window.confirm(`Delete section "${sec.title}" and its child links?`)) return;

    const newSections = footerSections.filter((_, idx) => idx !== secIdx);
    newSections.forEach((s, idx) => (s.order = idx + 1));
    setFooterSections(newSections);
    await saveFooterDraft(newSections);
    showToast("Footer section deleted", "success");
  };

  const openAddFooterLinkModal = (secIdx: number) => {
    setTargetFooterSecIdx(secIdx);
    setEditingFooterLinkIdx(null);
    setFooterLinkFormData({ title: "", url: "", target: "_self" });
    setFooterLinkModalOpen(true);
  };

  const openEditFooterLinkModal = (secIdx: number, subIdx: number) => {
    const link = footerSections[secIdx].subItems[subIdx];
    setTargetFooterSecIdx(secIdx);
    setEditingFooterLinkIdx(subIdx);
    setFooterLinkFormData({
      title: link.title,
      url: link.url,
      target: link.target || "_self",
    });
    setFooterLinkModalOpen(true);
  };

  const handleSaveFooterLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetFooterSecIdx === null) return;
    if (!footerLinkFormData.title.trim() || !footerLinkFormData.url.trim()) {
      showToast("Label and Link URL are required", "error");
      return;
    }

    const newSections = [...footerSections];
    const subItems = [...(newSections[targetFooterSecIdx].subItems || [])];

    if (editingFooterLinkIdx !== null) {
      subItems[editingFooterLinkIdx] = {
        ...subItems[editingFooterLinkIdx],
        title: footerLinkFormData.title.trim(),
        url: footerLinkFormData.url.trim(),
        target: footerLinkFormData.target,
      };
    } else {
      const newLink: FooterLinkItem = {
        id: `flink-${Date.now()}`,
        title: footerLinkFormData.title.trim(),
        url: footerLinkFormData.url.trim(),
        target: footerLinkFormData.target,
        order: subItems.length + 1,
      };
      subItems.push(newLink);
    }

    newSections[targetFooterSecIdx].subItems = subItems;
    setFooterSections(newSections);
    setFooterLinkModalOpen(false);
    await saveFooterDraft(newSections);
    showToast(editingFooterLinkIdx !== null ? "Child link updated" : "Child link added", "success");
  };

  const handleDeleteFooterLink = async (secIdx: number, subIdx: number) => {
    const newSections = [...footerSections];
    const subItems = [...(newSections[secIdx].subItems || [])];
    subItems.splice(subIdx, 1);
    subItems.forEach((l, idx) => (l.order = idx + 1));
    newSections[secIdx].subItems = subItems;

    setFooterSections(newSections);
    await saveFooterDraft(newSections);
    showToast("Child link deleted", "success");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-bold animate-[slideIn_0.2s_ease-out] ${toastMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-background backdrop-blur-md"
                : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 bg-background backdrop-blur-md"
              }`}
          >
            <Sparkles className="h-5 w-5 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FolderTree className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-foreground">Menu & Navigation Management</h1>
              <p className="text-xs text-foreground/60 mt-0.5">
                Configure top header menus, mega dropdowns, and footer navigation columns with 1-click live publishing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={activeTab === "header" ? handleResetHeader : handleResetFooter}
              disabled={resetting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-foreground/75 hover:bg-surface transition-all cursor-pointer disabled:opacity-50"
              title="Reset menu to default navigation structure"
            >
              <RotateCcw className={`h-4 w-4 ${resetting ? "animate-spin" : ""}`} />
              <span>Reset Default</span>
            </button>

            <button
              onClick={activeTab === "header" ? handlePublishHeader : handlePublishFooter}
              disabled={
                publishing ||
                (activeTab === "header" ? !hasHeaderUnsavedChanges() : !hasFooterUnsavedChanges())
              }
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-lg transition-all cursor-pointer ${(activeTab === "header" ? hasHeaderUnsavedChanges() : hasFooterUnsavedChanges())
                  ? "bg-primary hover:opacity-90 shadow-primary/25 hover:scale-102"
                  : "bg-gray-400 dark:bg-zinc-700 opacity-60 cursor-not-allowed shadow-none"
                }`}
            >
              <CheckCircle2 className={`h-4 w-4 ${publishing ? "animate-spin" : ""}`} />
              <span>
                {publishing
                  ? "Publishing..."
                  : (activeTab === "header" ? hasHeaderUnsavedChanges() : hasFooterUnsavedChanges())
                    ? `Publish ${activeTab === "header" ? "Header" : "Footer"} Menu`
                    : "Published"}
              </span>
            </button>

            <button
              onClick={activeTab === "header" ? openAddMainModal : openAddFooterSecModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-black transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{activeTab === "header" ? "Add Main Menu" : "Add Footer Column"}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher: Header vs Footer */}
        <div className="flex items-center gap-2 p-1.5 bg-background border border-border rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("header")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeTab === "header"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-foreground/70 hover:bg-surface hover:text-foreground"
              }`}
          >
            <LayoutTemplate className="h-4 w-4" />
            <span>Header Navigation</span>
            {hasHeaderUnsavedChanges() && (
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("footer")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${activeTab === "footer"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-foreground/70 hover:bg-surface hover:text-foreground"
              }`}
          >
            <Footprints className="h-4 w-4" />
            <span>Footer Navigation</span>
            {hasFooterUnsavedChanges() && (
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-background border border-border rounded-xl text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="text-foreground/50">Active Tab Status ({activeTab === "header" ? "Header Menu" : "Footer Menu"}):</span>
            {(activeTab === "header" ? hasHeaderUnsavedChanges() : hasFooterUnsavedChanges()) ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-black border border-amber-500/20">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Unpublished Draft Changes Pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-black border border-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All Changes Published & Live
              </span>
            )}
          </div>

          {saving && <span className="text-primary text-[11px] animate-pulse">Auto-saving draft...</span>}
        </div>

        {/* ==================== TAB 1: HEADER MENU MANAGEMENT ==================== */}
        {activeTab === "header" && (
          <>
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
              <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Header Menu Rules:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-700 dark:text-amber-300/80">
                  <li>
                    <strong>Mega Menu Titles:</strong> Main menu items of type <code>menu</code> do NOT navigate to any URL when clicked. They function purely as dropdown triggers.
                  </li>
                  <li>
                    <strong>Static Products Menu:</strong> The <code>Products</code> main item position can be re-ordered, and now you can also <strong>reorder the main product categories</strong> that appear in the mega menu by expanding the Products item and dragging/using the arrow buttons.
                  </li>
                </ul>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center bg-background rounded-2xl border border-border">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
                <p className="text-xs font-bold text-foreground/60 mt-3">Loading header menu...</p>
              </div>
            ) : headerItems.length === 0 ? (
              <div className="p-12 text-center bg-background rounded-2xl border border-border">
                <FolderTree className="h-12 w-12 text-foreground/30 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-foreground">No Header Items Configured</h3>
                <button
                  onClick={handleResetHeader}
                  className="mt-3 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer"
                >
                  Reset Default Header Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {headerItems.map((mainItem, mainIdx) => {
                  const isMega = mainItem.type === "menu";
                  const isExpanded = !!expandedHeaderItems[mainItem.id];
                  const subItems = mainItem.subItems || [];

                  return (
                    <div
                      key={mainItem.id}
                      draggable
                      onDragStart={(e) => handleMainDragStart(e, mainIdx)}
                      onDragOver={(e) => handleMainDragOver(e, mainIdx)}
                      onDragEnd={handleMainDragEnd}
                      className={`bg-background border rounded-2xl transition-all duration-200 overflow-hidden ${draggedMainIndex === mainIdx
                          ? "border-primary shadow-lg ring-2 ring-primary/20 opacity-70"
                          : "border-border hover:border-border/80 shadow-xs"
                        }`}
                    >
                      {/* Main Item Header Bar */}
                      <div className="flex items-center justify-between p-4 bg-background border-b border-border/60">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-surface text-foreground/40 hover:text-foreground shrink-0">
                            <GripVertical className="h-5 w-5" />
                          </div>

                          <div className="p-2 rounded-xl bg-surface border border-border shrink-0">
                            {mainItem.isStatic ? (
                              <Lock className="h-4 w-4 text-amber-500" />
                            ) : mainItem.type === "menu" ? (
                              <Layers className="h-4 w-4 text-primary" />
                            ) : mainItem.type === "page" ? (
                              <FileText className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Globe className="h-4 w-4 text-sky-500" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h3 className="text-sm font-extrabold text-foreground truncate">{mainItem.title}</h3>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-surface text-foreground/70 border border-border">
                                {mainItem.type === "menu" ? "Mega Menu" : mainItem.type === "page" ? "Internal Page" : "External Link"}
                              </span>
                              {mainItem.isStatic && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  Static Catalog
                                </span>
                              )}
                              {mainItem.hideInMenu && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                  <EyeOff className="h-3 w-3" /> Hidden
                                </span>
                              )}
                            </div>
                            {mainItem.description && (
                              <p className="text-xs text-foreground/70 line-clamp-1 mt-0.5" title={mainItem.description}>
                                {mainItem.description}
                              </p>
                            )}
                            <p className="text-[11px] text-foreground/50 truncate mt-0.5">
                              {mainItem.type === "menu" ? "No URL (Trigger only)" : mainItem.url || "No link"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-3">
                          <button
                            type="button"
                            onClick={async () => {
                              const newItems = [...headerItems];
                              const updatedHide = !newItems[mainIdx].hideInMenu;
                              const updatedSubs = (newItems[mainIdx].subItems || []).map((sub) => ({
                                ...sub,
                                hideInMenu: updatedHide,
                              }));
                              newItems[mainIdx] = {
                                ...newItems[mainIdx],
                                hideInMenu: updatedHide,
                                subItems: updatedSubs,
                              };
                              setHeaderItems(newItems);
                              await saveHeaderDraft(newItems);
                              showToast(
                                updatedHide
                                  ? `"${mainItem.title}" and all sub-menu items hidden from header menu`
                                  : `"${mainItem.title}" and all sub-menu items set to visible in header menu`,
                                "success"
                              );
                            }}
                            className={`p-2 rounded-lg border transition-all cursor-pointer ${mainItem.hideInMenu
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                : "bg-surface text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                              }`}
                            title={mainItem.hideInMenu ? "Hidden in Header Menu - Click to Show all" : "Visible in Header Menu - Click to Hide all"}
                          >
                            {mainItem.hideInMenu ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>

                          <button
                            onClick={() => moveHeaderMainItem(mainIdx, "up")}
                            disabled={mainIdx === 0}
                            className="p-1.5 rounded-lg border border-border text-foreground/60 hover:bg-surface disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => moveHeaderMainItem(mainIdx, "down")}
                            disabled={mainIdx === headerItems.length - 1}
                            className="p-1.5 rounded-lg border border-border text-foreground/60 hover:bg-surface disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>

                          {isMega && !mainItem.isStatic && (
                            <button
                              onClick={() => openAddSubModal(mainIdx)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Add Sub Link</span>
                            </button>
                          )}

                          <button
                            onClick={() => openEditMainModal(mainIdx)}
                            className="p-2 rounded-lg border border-border text-foreground/75 hover:bg-surface cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {!mainItem.isStatic && (
                            <button
                              onClick={() => handleDeleteMainItem(mainIdx)}
                              className="p-2 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}

                          {isMega && (
                            <button
                              onClick={() => toggleHeaderExpand(mainItem.id)}
                              className="p-2 rounded-lg border border-border text-foreground/60 hover:bg-surface cursor-pointer"
                            >
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {isMega && isExpanded && (
                        <div className="p-4 bg-surface/40 border-t border-border/40 space-y-2">
                          {mainItem.isStatic ? (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <p className="text-xs font-black text-foreground">Product Category Order</p>
                                <p className="text-[10px] text-foreground/55 ml-1">· Reorder main categories and their sub-categories for the mega menu.</p>
                              </div>
                              {(() => {
                                const orderedMainCats = getProductsMenuMainCats();
                                if (orderedMainCats.length === 0) {
                                  return (
                                    <div className="p-3 bg-background/60 rounded-xl border border-dashed border-border text-center text-xs text-foreground/50">
                                      No product categories found. Add categories first from the Products section.
                                    </div>
                                  );
                                }
                                return (
                                  <div className="space-y-2">
                                    {orderedMainCats.map((cat, catIdx) => {
                                      const orderedSubCats = getOrderedSubCats(cat.id);
                                      const isSubExpanded = !!expandedProductCats[cat.id];
                                      return (
                                        <div
                                          key={cat.id}
                                          className={`rounded-xl bg-background border transition-all ${draggedProductCatIndex === catIdx
                                              ? "border-primary shadow-md ring-2 ring-primary/20 opacity-70"
                                              : "border-border"
                                            }`}
                                        >
                                          {/* Main category row */}
                                          <div
                                            draggable
                                            onDragStart={(e) => handleProductCatDragStart(e, catIdx)}
                                            onDragOver={(e) => handleProductCatDragOver(e, catIdx)}
                                            onDragEnd={handleProductCatDragEnd}
                                            className="flex items-center justify-between p-3"
                                          >
                                            <div className="flex items-center gap-3 min-w-0">
                                              <div className="cursor-grab active:cursor-grabbing p-1 text-foreground/40 shrink-0">
                                                <GripVertical className="h-4 w-4" />
                                              </div>
                                              <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  <span className="text-xs font-bold text-foreground truncate">{cat.name}</span>
                                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
                                                    {orderedSubCats.length} sub-cats
                                                  </span>
                                                  {cat.hideInMenu && (
                                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                                      <EyeOff className="h-2.5 w-2.5" /> Hidden
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0 ml-2">
                                              <button
                                                type="button"
                                                onClick={async () => {
                                                  const updatedHide = !cat.hideInMenu;
                                                  const childSubCats = allCategories.filter(
                                                    (c) => c.parent_category === cat.id || c.parent_category === cat.slug
                                                  );

                                                  setAllCategories((prev) =>
                                                    prev.map((c) => {
                                                      if (c.id === cat.id) return { ...c, hideInMenu: updatedHide };
                                                      if (c.parent_category === cat.id || c.parent_category === cat.slug) {
                                                        return { ...c, hideInMenu: updatedHide };
                                                      }
                                                      return c;
                                                    })
                                                  );

                                                  try {
                                                    await api.saveCategory({ ...cat, hideInMenu: updatedHide });
                                                    if (childSubCats.length > 0) {
                                                      await Promise.all(
                                                        childSubCats.map((sub) => api.saveCategory({ ...sub, hideInMenu: updatedHide }))
                                                      );
                                                    }
                                                    showToast(
                                                      updatedHide
                                                        ? `"${cat.name}" and all sub-categories hidden from Products Mega Menu`
                                                        : `"${cat.name}" and all sub-categories visible in Products Mega Menu`,
                                                      "success"
                                                    );
                                                  } catch (err) {
                                                    console.error("Failed to toggle category menu visibility:", err);
                                                    showToast("Failed to update category visibility", "error");
                                                  }
                                                }}
                                                className={`p-1 rounded-md border transition-all cursor-pointer ${
                                                  cat.hideInMenu
                                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                                    : "bg-surface text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                                                }`}
                                                title={cat.hideInMenu ? "Hidden in Products Mega Menu - Click to Show all" : "Visible in Products Mega Menu - Click to Hide all"}
                                              >
                                                {cat.hideInMenu ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                              </button>
                                              <button
                                                onClick={() => moveProductCat(catIdx, "up")}
                                                disabled={catIdx === 0}
                                                className="p-1 rounded-md border border-border text-foreground/60 hover:bg-surface disabled:opacity-30 cursor-pointer"
                                                title="Move category up"
                                              >
                                                <ArrowUp className="h-3 w-3" />
                                              </button>
                                              <button
                                                onClick={() => moveProductCat(catIdx, "down")}
                                                disabled={catIdx === orderedMainCats.length - 1}
                                                className="p-1 rounded-md border border-border text-foreground/60 hover:bg-surface disabled:opacity-30 cursor-pointer"
                                                title="Move category down"
                                              >
                                                <ArrowDown className="h-3 w-3" />
                                              </button>
                                              {orderedSubCats.length > 0 && (
                                                <button
                                                  onClick={() => setExpandedProductCats((prev) => ({ ...prev, [cat.id]: !prev[cat.id] }))}
                                                  className="p-1 rounded-md border border-border text-foreground/60 hover:bg-surface cursor-pointer ml-0.5"
                                                  title={isSubExpanded ? "Collapse sub-categories" : "Reorder sub-categories"}
                                                >
                                                  {isSubExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                                </button>
                                              )}
                                            </div>
                                          </div>

                                          {/* Sub-category reorder panel */}
                                          {isSubExpanded && orderedSubCats.length > 0 && (
                                            <div className="border-t border-border/50 bg-surface/50 px-3 pb-3 pt-2 space-y-1.5 rounded-b-xl">
                                              <p className="text-[10px] font-black text-foreground/50 uppercase tracking-wider mb-2 pl-1">Sub-categories in &ldquo;{cat.name}&rdquo;</p>
                                              {orderedSubCats.map((sub, subIdx) => (
                                                <div
                                                  key={sub.id}
                                                  draggable
                                                  onDragStart={(e) => handleProductSubCatDragStart(e, cat.id, subIdx)}
                                                  onDragOver={(e) => handleProductSubCatDragOver(e, cat.id, subIdx)}
                                                  onDragEnd={handleProductSubCatDragEnd}
                                                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg bg-background border transition-all ${draggedProductSubCatInfo?.mainCatId === cat.id && draggedProductSubCatInfo?.subIdx === subIdx
                                                      ? "border-primary shadow ring-1 ring-primary/20 opacity-70"
                                                      : "border-border hover:border-primary/30"
                                                    }`}
                                                >
                                                  <div className="flex items-center gap-2 min-w-0">
                                                    <div className="cursor-grab active:cursor-grabbing p-0.5 text-foreground/30 shrink-0">
                                                      <GripVertical className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="text-[11px] font-semibold text-foreground truncate">{sub.name}</span>
                                                    {sub.hideInMenu && (
                                                      <span className="px-1 py-0.5 rounded text-[8px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-0.5 shrink-0">
                                                        <EyeOff className="h-2 w-2" /> Hidden
                                                      </span>
                                                    )}
                                                  </div>
                                                  <div className="flex items-center gap-1 shrink-0 ml-2">
                                                    <button
                                                      type="button"
                                                      onClick={async () => {
                                                        const updatedHide = !sub.hideInMenu;
                                                        const parentCat = allCategories.find(
                                                          (c) => !c.parent_category && (c.id === sub.parent_category || c.slug === sub.parent_category || c.id === cat.id)
                                                        );

                                                        const sisterSubCats = allCategories.filter(
                                                          (c) => c.parent_category === (parentCat?.id || cat.id) || c.parent_category === (parentCat?.slug || cat.slug)
                                                        );

                                                        let shouldParentHide = parentCat?.hideInMenu;
                                                        if (updatedHide === false && parentCat?.hideInMenu) {
                                                          shouldParentHide = false;
                                                        } else if (updatedHide === true && parentCat && !parentCat.hideInMenu) {
                                                          const otherSistersHidden = sisterSubCats
                                                            .filter((c) => c.id !== sub.id)
                                                            .every((c) => c.hideInMenu === true);
                                                          if (otherSistersHidden) {
                                                            shouldParentHide = true;
                                                          }
                                                        }

                                                        setAllCategories((prev) =>
                                                          prev.map((c) => {
                                                            if (c.id === sub.id) return { ...c, hideInMenu: updatedHide };
                                                            if (parentCat && c.id === parentCat.id) return { ...c, hideInMenu: shouldParentHide };
                                                            return c;
                                                          })
                                                        );

                                                        try {
                                                          await api.saveCategory({ ...sub, hideInMenu: updatedHide });
                                                          if (parentCat && shouldParentHide !== parentCat.hideInMenu) {
                                                            await api.saveCategory({ ...parentCat, hideInMenu: shouldParentHide });
                                                          }
                                                          showToast(
                                                            updatedHide
                                                              ? `"${sub.name}" hidden from Products Mega Menu`
                                                              : `"${sub.name}" visible in Products Mega Menu`,
                                                            "success"
                                                          );
                                                        } catch (err) {
                                                          console.error("Failed to toggle sub-category menu visibility:", err);
                                                          showToast("Failed to update sub-category visibility", "error");
                                                        }
                                                      }}
                                                      className={`p-0.5 rounded border transition-all cursor-pointer ${
                                                        sub.hideInMenu
                                                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                                          : "bg-surface text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                                                      }`}
                                                      title={sub.hideInMenu ? "Hidden in Products Mega Menu - Click to Show" : "Visible in Products Mega Menu - Click to Hide"}
                                                    >
                                                      {sub.hideInMenu ? <EyeOff className="h-2.5 w-2.5" /> : <Eye className="h-2.5 w-2.5" />}
                                                    </button>
                                                    <button
                                                      onClick={() => moveProductSubCat(cat.id, subIdx, "up")}
                                                      disabled={subIdx === 0}
                                                      className="p-0.5 rounded border border-border text-foreground/60 hover:bg-surface disabled:opacity-30 cursor-pointer"
                                                      title="Move sub-category up"
                                                    >
                                                      <ArrowUp className="h-2.5 w-2.5" />
                                                    </button>
                                                    <button
                                                      onClick={() => moveProductSubCat(cat.id, subIdx, "down")}
                                                      disabled={subIdx === orderedSubCats.length - 1}
                                                      className="p-0.5 rounded border border-border text-foreground/60 hover:bg-surface disabled:opacity-30 cursor-pointer"
                                                      title="Move sub-category down"
                                                    >
                                                      <ArrowDown className="h-2.5 w-2.5" />
                                                    </button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </>
                          ) : subItems.length === 0 ? (
                            <div className="p-3 bg-background/60 rounded-xl border border-dashed border-border text-center text-xs text-foreground/50">
                              No sub-items added yet.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {subItems.map((sub, subIdx) => (
                                <div
                                  key={sub.id || subIdx}
                                  draggable
                                  onDragStart={(e) => handleHeaderSubDragStart(e, mainIdx, subIdx)}
                                  onDragOver={(e) => handleHeaderSubDragOver(e, mainIdx, subIdx)}
                                  onDragEnd={handleHeaderSubDragEnd}
                                  className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-border/80"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="cursor-grab active:cursor-grabbing p-1 text-foreground/40 shrink-0">
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-foreground block truncate">{sub.title}</span>
                                        {sub.hideInMenu && (
                                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 shrink-0">
                                            <EyeOff className="h-2.5 w-2.5" /> Hidden
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-foreground/50 block truncate">{sub.url}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0 ml-2">
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const newItems = [...headerItems];
                                        const currentSubs = [...(newItems[mainIdx].subItems || [])];
                                        const updatedSubHide = !currentSubs[subIdx].hideInMenu;
                                        currentSubs[subIdx] = {
                                          ...currentSubs[subIdx],
                                          hideInMenu: updatedSubHide,
                                        };
                                        newItems[mainIdx].subItems = currentSubs;

                                        // Update parent menu state if needed
                                        let updatedParentHide = newItems[mainIdx].hideInMenu;
                                        if (updatedSubHide === false && newItems[mainIdx].hideInMenu) {
                                          updatedParentHide = false;
                                        } else if (updatedSubHide === true && !newItems[mainIdx].hideInMenu) {
                                          const allSubHidden = currentSubs.every((s) => s.hideInMenu === true);
                                          if (allSubHidden) {
                                            updatedParentHide = true;
                                          }
                                        }
                                        newItems[mainIdx].hideInMenu = updatedParentHide;

                                        setHeaderItems(newItems);
                                        await saveHeaderDraft(newItems);
                                        showToast(
                                          updatedSubHide
                                            ? `"${sub.title}" hidden from sub-menu`
                                            : `"${sub.title}" set to visible in sub-menu`,
                                          "success"
                                        );
                                      }}
                                      className={`p-1 rounded-md border transition-all cursor-pointer ${sub.hideInMenu
                                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                          : "bg-surface text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                                        }`}
                                      title={sub.hideInMenu ? "Hidden in Sub-menu - Click to Show" : "Visible in Sub-menu - Click to Hide"}
                                    >
                                      {sub.hideInMenu ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                    </button>

                                    <button
                                      onClick={() => moveHeaderSubItem(mainIdx, subIdx, "up")}
                                      disabled={subIdx === 0}
                                      className="p-1 rounded-md border border-border text-foreground/60 hover:bg-surface cursor-pointer"
                                    >
                                      <ArrowUp className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => moveHeaderSubItem(mainIdx, subIdx, "down")}
                                      disabled={subIdx === subItems.length - 1}
                                      className="p-1 rounded-md border border-border text-foreground/60 hover:bg-surface cursor-pointer"
                                    >
                                      <ArrowDown className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => openEditSubModal(mainIdx, subIdx)}
                                      className="p-1.5 rounded-md border border-border text-foreground/75 hover:bg-surface cursor-pointer"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSubItem(mainIdx, subIdx)}
                                      className="p-1.5 rounded-md border border-border text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ==================== TAB 2: FOOTER MENU MANAGEMENT ==================== */}
        {activeTab === "footer" && (
          <>
            <div className="bg-sky-500/10 border border-sky-500/20 p-4 rounded-2xl text-xs text-sky-800 dark:text-sky-300 flex items-start gap-3">
              <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Footer Menu Rules:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-sky-700 dark:text-sky-300/80">
                  <li>
                    <strong>Footer Columns:</strong> Create columns/sections (e.g. Products, About Jivanjor, Support & Compliance). Reorder columns using drag and drop.
                  </li>
                  <li>
                    <strong>Child Links:</strong> Every child link has a <code>Label</code>, <code>URL</code> (internal page or external link), and window target (<code>_self</code> vs <code>_blank</code>).
                  </li>
                </ul>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center bg-background rounded-2xl border border-border">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
                <p className="text-xs font-bold text-foreground/60 mt-3">Loading footer menu...</p>
              </div>
            ) : footerSections.length === 0 ? (
              <div className="p-12 text-center bg-background rounded-2xl border border-border">
                <Footprints className="h-12 w-12 text-foreground/30 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-foreground">No Footer Sections Configured</h3>
                <button
                  onClick={handleResetFooter}
                  className="mt-3 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold cursor-pointer"
                >
                  Reset Default Footer Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {footerSections.map((sec, secIdx) => {
                  const isExpanded = !!expandedFooterSections[sec.id];
                  const subLinks = sec.subItems || [];

                  return (
                    <div
                      key={sec.id}
                      draggable
                      onDragStart={(e) => handleFooterSecDragStart(e, secIdx)}
                      onDragOver={(e) => handleFooterSecDragOver(e, secIdx)}
                      onDragEnd={handleFooterSecDragEnd}
                      className={`bg-background border rounded-2xl transition-all duration-200 overflow-hidden ${draggedFooterSecIndex === secIdx
                          ? "border-primary shadow-lg ring-2 ring-primary/20 opacity-70"
                          : "border-border hover:border-border/80 shadow-xs"
                        }`}
                    >
                      {/* Footer Section Header Bar */}
                      <div className="flex items-center justify-between p-4 bg-background border-b border-border/60">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-surface text-foreground/40 hover:text-foreground shrink-0">
                            <GripVertical className="h-5 w-5" />
                          </div>

                          <div className="p-2 rounded-xl bg-surface border border-border shrink-0">
                            <Footprints className="h-4 w-4 text-primary" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-extrabold text-foreground truncate">{sec.title}</h3>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-surface text-foreground/70 border border-border">
                                {subLinks.length} Links
                              </span>
                              {sec.hideInMenu && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                  <EyeOff className="h-3 w-3" /> Hidden
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-3">
                          <button
                            type="button"
                            onClick={async () => {
                              const newSections = [...footerSections];
                              const updatedHide = !newSections[secIdx].hideInMenu;
                              const updatedSubs = (newSections[secIdx].subItems || []).map((sub) => ({
                                ...sub,
                                hideInMenu: updatedHide,
                              }));
                              newSections[secIdx] = {
                                ...newSections[secIdx],
                                hideInMenu: updatedHide,
                                subItems: updatedSubs,
                              };
                              setFooterSections(newSections);
                              await saveFooterDraft(newSections);
                              showToast(
                                updatedHide
                                  ? `"${sec.title}" column and all child links hidden from footer`
                                  : `"${sec.title}" column and all child links set to visible in footer`,
                                "success"
                              );
                            }}
                            className={`p-2 rounded-lg border transition-all cursor-pointer ${sec.hideInMenu
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                : "bg-surface text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                              }`}
                            title={sec.hideInMenu ? "Hidden in Footer - Click to Show all" : "Visible in Footer - Click to Hide all"}
                          >
                            {sec.hideInMenu ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>

                          <button
                            onClick={() => moveFooterSection(secIdx, "up")}
                            disabled={secIdx === 0}
                            className="p-1.5 rounded-lg border border-border text-foreground/60 hover:bg-surface disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => moveFooterSection(secIdx, "down")}
                            disabled={secIdx === footerSections.length - 1}
                            className="p-1.5 rounded-lg border border-border text-foreground/60 hover:bg-surface disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => openAddFooterLinkModal(secIdx)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Add Child Link</span>
                          </button>

                          <button
                            onClick={() => openEditFooterSecModal(secIdx)}
                            className="p-2 rounded-lg border border-border text-foreground/75 hover:bg-surface cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteFooterSection(secIdx)}
                            className="p-2 rounded-lg border border-border text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => toggleFooterExpand(sec.id)}
                            className="p-2 rounded-lg border border-border text-foreground/60 hover:bg-surface cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Footer Section Child Links */}
                      {isExpanded && (
                        <div className="p-4 bg-surface/40 border-t border-border/40 space-y-2">
                          {subLinks.length === 0 ? (
                            <div className="p-3 bg-background/60 rounded-xl border border-dashed border-border text-center text-xs text-foreground/50">
                              No child links added yet. Click &quot;Add Child Link&quot; to add pages/links.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {subLinks.map((link, linkIdx) => (
                                <div
                                  key={link.id || linkIdx}
                                  draggable
                                  onDragStart={(e) => handleFooterLinkDragStart(e, secIdx, linkIdx)}
                                  onDragOver={(e) => handleFooterLinkDragOver(e, secIdx, linkIdx)}
                                  onDragEnd={handleFooterLinkDragEnd}
                                  className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-border/80"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="cursor-grab active:cursor-grabbing p-1 text-foreground/40 shrink-0">
                                      <GripVertical className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-bold text-foreground truncate">{link.title}</span>
                                        {link.target === "_blank" && (
                                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-primary/10 text-primary border border-primary/20">
                                            New Tab
                                          </span>
                                        )}
                                        {link.hideInMenu && (
                                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1 shrink-0">
                                            <EyeOff className="h-2.5 w-2.5" /> Hidden
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-[10px] text-foreground/50 block truncate">{link.url}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0 ml-2">
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        const newSections = [...footerSections];
                                        const currentSubItems = [...(newSections[secIdx].subItems || [])];
                                        const updatedLinkHide = !currentSubItems[linkIdx].hideInMenu;
                                        currentSubItems[linkIdx] = {
                                          ...currentSubItems[linkIdx],
                                          hideInMenu: updatedLinkHide,
                                        };
                                        newSections[secIdx].subItems = currentSubItems;

                                        // Update parent section state if needed
                                        let updatedParentHide = newSections[secIdx].hideInMenu;
                                        if (updatedLinkHide === false && newSections[secIdx].hideInMenu) {
                                          updatedParentHide = false;
                                        } else if (updatedLinkHide === true && !newSections[secIdx].hideInMenu) {
                                          const allLinksHidden = currentSubItems.every((l) => l.hideInMenu === true);
                                          if (allLinksHidden) {
                                            updatedParentHide = true;
                                          }
                                        }
                                        newSections[secIdx].hideInMenu = updatedParentHide;

                                        setFooterSections(newSections);
                                        await saveFooterDraft(newSections);
                                        showToast(
                                          updatedLinkHide
                                            ? `"${link.title}" hidden from footer column`
                                            : `"${link.title}" set to visible in footer column`,
                                          "success"
                                        );
                                      }}
                                      className={`p-1 rounded-md border transition-all cursor-pointer ${link.hideInMenu
                                          ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                          : "bg-surface text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                                        }`}
                                      title={link.hideInMenu ? "Hidden in Footer - Click to Show" : "Visible in Footer - Click to Hide"}
                                    >
                                      {link.hideInMenu ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                    </button>

                                    <button
                                      onClick={() => moveFooterSubLink(secIdx, linkIdx, "up")}
                                      disabled={linkIdx === 0}
                                      className="p-1 rounded-md border border-border text-foreground/60 hover:bg-surface cursor-pointer"
                                    >
                                      <ArrowUp className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => moveFooterSubLink(secIdx, linkIdx, "down")}
                                      disabled={linkIdx === subLinks.length - 1}
                                      className="p-1 rounded-md border border-border text-foreground/60 hover:bg-surface cursor-pointer"
                                    >
                                      <ArrowDown className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => openEditFooterLinkModal(secIdx, linkIdx)}
                                      className="p-1.5 rounded-md border border-border text-foreground/75 hover:bg-surface cursor-pointer"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFooterLink(secIdx, linkIdx)}
                                      className="p-1.5 rounded-md border border-border text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ==================== HEADER MAIN ITEM MODAL ==================== */}
        {mainModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-[slideIn_0.15s_ease-out]">
              <h2 className="text-base font-extrabold text-foreground mb-4">
                {editingMainIndex !== null ? "Edit Main Menu Item" : "Create Main Menu Item"}
              </h2>

              <form onSubmit={handleSaveMainItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={mainFormData.title}
                    onChange={(e) => setMainFormData({ ...mainFormData, title: e.target.value })}
                    placeholder="e.g. About Us, Products, Blog"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={mainFormData.description}
                    onChange={(e) => setMainFormData({ ...mainFormData, description: e.target.value })}
                    placeholder="Default description displayed inside mega menu preview middle column"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-hidden focus:border-primary resize-none"
                  />
                  <p className="text-[11px] text-foreground/50 mt-1">
                    This dynamic text will show as default description in the middle column of the mega menu.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Menu Type</label>
                  <select
                    value={mainFormData.type}
                    onChange={(e) => setMainFormData({ ...mainFormData, type: e.target.value as MenuType })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary cursor-pointer"
                  >
                    <option value="menu">Mega Menu (Container / Dropdown)</option>
                    <option value="page">Internal Page Link</option>
                    <option value="external_link">External Link URL</option>
                  </select>
                </div>

                {mainFormData.type === "menu" ? (
                  <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 text-xs text-primary font-medium">
                    Mega Menu main title does not directly link to any URL on click.
                  </div>
                ) : mainFormData.type === "page" ? (
                  <div>
                    <label className="block text-xs font-bold text-foreground/80 mb-1">Select Page</label>
                    <select
                      value={mainFormData.url}
                      onChange={(e) => setMainFormData({ ...mainFormData, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary cursor-pointer mb-2"
                    >
                      <option value="">-- Choose System / Dynamic Page --</option>
                      {availablePages.map((pg) => (
                        <option key={pg.slug} value={pg.slug}>
                          {pg.title} ({pg.slug})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={mainFormData.url}
                      onChange={(e) => setMainFormData({ ...mainFormData, url: e.target.value })}
                      placeholder="Or enter path e.g. /custom-page"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-hidden focus:border-primary"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-foreground/80 mb-1">External URL</label>
                    <input
                      type="url"
                      required
                      value={mainFormData.url}
                      onChange={(e) => setMainFormData({ ...mainFormData, url: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary mb-2"
                    />
                    <label className="flex items-center gap-2 text-xs text-foreground/75 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mainFormData.target === "_blank"}
                        onChange={(e) => setMainFormData({ ...mainFormData, target: e.target.checked ? "_blank" : "_self" })}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span>Open in new window / tab</span>
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">
                    Mega Menu Preview Image (Optional)
                  </label>
                  <p className="text-[11px] text-foreground/50 mb-2">
                    Upload a custom image to display on the right side of this mega menu container.
                  </p>
                  <ImageUpload
                    value={mainFormData.image}
                    onChange={(url) => setMainFormData({ ...mainFormData, image: url })}
                    size="compact"
                    folder="menu"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setMainModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground/70 hover:bg-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-md shadow-primary/20"
                  >
                    Save Main Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== HEADER SUB ITEM MODAL ==================== */}
        {subModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-[slideIn_0.15s_ease-out]">
              <h2 className="text-base font-extrabold text-foreground mb-4">
                {editingSubIndex !== null ? "Edit Sub Link" : "Add Sub Link"}
              </h2>

              <form onSubmit={handleSaveSubItem} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Sub Item Title</label>
                  <input
                    type="text"
                    required
                    value={subFormData.title}
                    onChange={(e) => setSubFormData({ ...subFormData, title: e.target.value })}
                    placeholder="e.g. Application Tips, TVC"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Sub Item Type</label>
                  <select
                    value={subFormData.type}
                    onChange={(e) => setSubFormData({ ...subFormData, type: e.target.value as "page" | "external_link" })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary cursor-pointer"
                  >
                    <option value="page">Internal Page Link</option>
                    <option value="external_link">External Link URL</option>
                  </select>
                </div>

                {subFormData.type === "page" ? (
                  <div>
                    <label className="block text-xs font-bold text-foreground/80 mb-1">Select Page</label>
                    <select
                      value={subFormData.url}
                      onChange={(e) => setSubFormData({ ...subFormData, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary cursor-pointer mb-2"
                    >
                      <option value="">-- Choose System / Dynamic Page --</option>
                      {availablePages.map((pg) => (
                        <option key={pg.slug} value={pg.slug}>
                          {pg.title} ({pg.slug})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={subFormData.url}
                      onChange={(e) => setSubFormData({ ...subFormData, url: e.target.value })}
                      placeholder="Or enter path e.g. /about/tvc"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-hidden focus:border-primary"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-foreground/80 mb-1">External URL</label>
                    <input
                      type="url"
                      required
                      value={subFormData.url}
                      onChange={(e) => setSubFormData({ ...subFormData, url: e.target.value })}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary mb-2"
                    />
                    <label className="flex items-center gap-2 text-xs text-foreground/75 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subFormData.target === "_blank"}
                        onChange={(e) => setSubFormData({ ...subFormData, target: e.target.checked ? "_blank" : "_self" })}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span>Open in new window / tab</span>
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Description (Optional)</label>
                  <textarea
                    rows={2}
                    value={subFormData.description}
                    onChange={(e) => setSubFormData({ ...subFormData, description: e.target.value })}
                    placeholder="Short description displayed inside mega menu preview"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-hidden focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">
                    Hover Preview Image (Optional)
                  </label>
                  <p className="text-[11px] text-foreground/50 mb-2">
                    When hovering over this sub-link, this custom image will display in the mega menu right column.
                  </p>
                  <ImageUpload
                    value={subFormData.image}
                    onChange={(url) => setSubFormData({ ...subFormData, image: url })}
                    size="compact"
                    folder="menu"
                  />
                </div>


                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setSubModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground/70 hover:bg-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-md shadow-primary/20"
                  >
                    Save Sub Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== FOOTER SECTION MODAL ==================== */}
        {footerSecModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-[slideIn_0.15s_ease-out]">
              <h2 className="text-base font-extrabold text-foreground mb-4">
                {editingFooterSecIdx !== null ? "Edit Footer Section" : "Create Footer Section"}
              </h2>

              <form onSubmit={handleSaveFooterSection} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Section Title</label>
                  <input
                    type="text"
                    required
                    value={footerSecTitle}
                    onChange={(e) => setFooterSecTitle(e.target.value)}
                    placeholder="e.g. Products, Support & Compliance, Quick Links"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setFooterSecModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground/70 hover:bg-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-md shadow-primary/20"
                  >
                    Save Section
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== FOOTER LINK MODAL ==================== */}
        {footerLinkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 animate-[slideIn_0.15s_ease-out]">
              <h2 className="text-base font-extrabold text-foreground mb-4">
                {editingFooterLinkIdx !== null ? "Edit Child Link" : "Add Child Link"}
              </h2>

              <form onSubmit={handleSaveFooterLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Label</label>
                  <input
                    type="text"
                    required
                    value={footerLinkFormData.title}
                    onChange={(e) => setFooterLinkFormData({ ...footerLinkFormData, title: e.target.value })}
                    placeholder="e.g. Privacy Policy, Technical Resources, Become a Dealer"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Select Page or Enter Link URL</label>
                  <select
                    value={footerLinkFormData.url}
                    onChange={(e) => setFooterLinkFormData({ ...footerLinkFormData, url: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary cursor-pointer mb-2"
                  >
                    <option value="">-- Choose System / Dynamic Page --</option>
                    {availablePages.map((pg) => (
                      <option key={pg.slug} value={pg.slug}>
                        {pg.title} ({pg.slug})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    value={footerLinkFormData.url}
                    onChange={(e) => setFooterLinkFormData({ ...footerLinkFormData, url: e.target.value })}
                    placeholder="e.g. /privacy or https://example.com"
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-xs text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Target Window</label>
                  <select
                    value={footerLinkFormData.target}
                    onChange={(e) => setFooterLinkFormData({ ...footerLinkFormData, target: e.target.value as "_self" | "_blank" })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary cursor-pointer"
                  >
                    <option value="_self">Same Window (_self)</option>
                    <option value="_blank">New Tab / Window (_blank)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setFooterLinkModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-foreground/70 hover:bg-surface cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 cursor-pointer shadow-md shadow-primary/20"
                  >
                    Save Child Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
