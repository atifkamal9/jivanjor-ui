"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  aboutItems,
  applicationItems,
  knowledgeItems,
  partnerItems,
  productCategories,
} from "@/lib/nav";
import { ChevronRight } from "lucide-react";
import MobileNav from "./MobileNav";
import { api, SiteSettings } from "@/lib/api";

import { MenuItem, DEFAULT_HEADER_MENU, normalizeSubItemUrl } from "@/lib/menuTypes";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  const [publishedMenu, setPublishedMenu] = useState<MenuItem[]>(DEFAULT_HEADER_MENU);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredAboutItem, setHoveredAboutItem] = useState<string | null>(null);
  const [hoveredAppItem, setHoveredAppItem] = useState<string | null>(null);
  const [hoveredKnowledgeItem, setHoveredKnowledgeItem] = useState<string | null>(null);
  const [hoveredGenericSubItem, setHoveredGenericSubItem] = useState<string | null>(null);
  const [hoveredSubItemObj, setHoveredSubItemObj] = useState<any | null>(null);
  const [pages, setPages] = useState<any[]>([]);

  const [seos, setSeos] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [blogCategories, setBlogCategories] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    async function loadNavData() {
      try {
        const [pagesList, seosList, catsList, activeBlogTemplate, menuRes, settingsRes] = await Promise.all([
          api.getPages(),
          api.getSeoMetadata(),
          api.getCategories(),
          api.getActiveTemplateForPage("blog").catch(() => null),
          api.getHeaderMenu().catch(() => ({ draftItems: [], publishedItems: [] })),
          api.getSettings().catch(() => null),
        ]);
        setPages(pagesList);
        setSeos(seosList);
        setDbCategories(catsList);
        if (settingsRes) setSiteSettings(settingsRes);


        if (menuRes?.publishedItems && menuRes.publishedItems.length > 0) {
          setPublishedMenu(menuRes.publishedItems);
        }

        if (activeBlogTemplate) {
          const rawSec = activeBlogTemplate.rawSections || activeBlogTemplate.sections;
          const sections = typeof rawSec === "string" ? JSON.parse(rawSec) : rawSec;
          if (sections?.list?.categories) {
            setBlogCategories(sections.list.categories);
          }
        }

        // Find first main category and make it the active one
        const firstMain = catsList.find((cat: any) => !cat.parent_category);
        if (firstMain) {
          setActiveCategory(firstMain.name);
        }
      } catch (err) {
        console.error("Failed to load dynamic nav data:", err);
      }
    }
    loadNavData();
  }, []);


  // ── About ──────────────────────────────────────────────────────────────────
  const defaultAboutData: Record<string, { desc: string; img: string }> = {
    "/about": {
      desc: "Jivanjor is a leading manufacturer of premium adhesives in India, delivering unmatched bonding strength and durability for diverse woodworking and interior applications.",
      img: "/images/hero (1).png",
    },
    "/about/research-and-innovation": {
      desc: "Explore Jivanjor's research & development lab and innovation center where cutting-edge polymer chemistry creates our advanced woodworking formulas.",
      img: "/images/about/badge-greenpro.png",
    },
    "/about/quality-and-performance-promise": {
      desc: "Understand our quality assurance compliance, certified manufacturing facilities, and our commitment to sustainable development.",
      img: "/images/about/badge-iso-9001.png",
    },
    "/about/tvc": {
      desc: "Watch the latest Jivanjor television commercials and brand campaigns showcasing our stronger bonds and consumer trusted products.",
      img: "/images/about/badge-chairman.png",
    },
    "/about/market-presence": {
      desc: "View our extensive network of distributors, carpenters, and retailers making Jivanjor accessible across every corner of India.",
      img: "/images/hero.png",
    },
  };

  const currentAboutLink = hoveredAboutItem || "/about";
  const currentAboutSlug =
    currentAboutLink === "/about" ? "about" : currentAboutLink.replace("/about/", "");

  const matchedAboutPage = pages.find((p) => p.slug === currentAboutSlug);
  const matchedAboutSeo = seos.find(
    (s) =>
      s.page_type === "static" &&
      (s.page_id === currentAboutSlug ||
        (currentAboutSlug === "about" && s.page_id === "ABOUT_PAGE") ||
        (matchedAboutPage && s.page_id === matchedAboutPage.id))
  );

  const defaultAboutObj =
    defaultAboutData[currentAboutLink] || defaultAboutData["/about"];
  const aboutDescription =
    matchedAboutSeo?.meta_description ||
    matchedAboutPage?.description ||
    defaultAboutObj.desc;
  const aboutImage = matchedAboutSeo?.image || defaultAboutObj.img;

  const dynamicAboutItems =
    pages.length > 0
      ? pages
        .filter((p) => {
          try {
            const sections =
              typeof p.sections === "string"
                ? JSON.parse(p.sections)
                : p.sections;
            return p.slug === "about" || sections?.layoutType === "about";
          } catch {
            return p.slug === "about";
          }
        })
        .map((p) => {
          const sections = typeof p.sections === "string" ? JSON.parse(p.sections ?? "{}") : (p.sections ?? {});
          return {
            name: p.title,
            link: p.slug === "about" ? "/about" : `/about/${p.slug}`,
            navOrder: sections?.navOrder as number | undefined,
          };
        })
        .sort((a, b) => {
          if (a.navOrder != null && b.navOrder != null) return a.navOrder - b.navOrder;
          if (a.navOrder != null) return -1;
          if (b.navOrder != null) return 1;
          if (a.link === "/about") return -1;
          if (b.link === "/about") return 1;
          return a.name.localeCompare(b.name);
        })
      : aboutItems;

  // ── Applications ───────────────────────────────────────────────────────────
  const defaultAppData: Record<string, { desc: string; img: string }> = {
    "/applications": {
      desc: "Explore the full range of Jivanjor adhesive solutions crafted for every woodworking application — furniture, laminates, kitchens, and beyond.",
      img: "/images/applications/Rectangle 150.png",
    },
    "Furniture & Woodwork": {
      desc: "Get superior bond strength for heavy solid woods, joint assembly, framing, and general residential furniture making.",
      img: "/images/applications/Rectangle 150.png",
    },
    "Laminates & Finishing": {
      desc: "Ensure bubble-free laminate paste-ups, wood veneer bonding, and flawless decorative finish overlays.",
      img: "/images/mega-menu.png",
    },
    "Kitchen & Storage Units": {
      desc: "Assemble modular kitchens and pantry shelves utilizing adhesives resistant to steam, heat, and weight loads.",
      img: "/images/applications/Rectangle 150.png",
    },
    "Moisture-Prone Woodwork": {
      desc: "Protect bathroom cabinets, wash basin counters, and exterior gates using our D3-certified waterproof grade Watershield.",
      img: "/images/Watershield.png",
    },
    "PVC & Edge Finishing": {
      desc: "Fast-setting advanced resin glues designed specifically to bond PVC strips and acrylic edge bands with composite boards.",
      img: "/images/about/badge-chairman.png",
    },
    "Foam & Acoustic Bonding": {
      desc: "Sprayable or hand-applied specialty adhesives for foam-to-wood acoustic insulation panels and soft upholstery.",
      img: "/images/Foambond.png",
    },
  };

  const currentAppLink = hoveredAppItem || "/applications";
  const currentAppSlug =
    currentAppLink === "/applications"
      ? "applications"
      : currentAppLink.startsWith("/applications/")
        ? currentAppLink.replace("/applications/", "")
        : "";

  const matchedAppPage = pages.find((p) => p.slug === currentAppSlug);
  const matchedAppSeo = seos.find(
    (s) =>
      s.page_type === "static" &&
      (s.page_id === currentAppSlug ||
        (currentAppSlug === "applications" && s.page_id === "APPLICATIONS_PAGE") ||
        (matchedAppPage && s.page_id === matchedAppPage.id))
  );

  const appFallbackKey =
    defaultAppData[currentAppLink] != null
      ? currentAppLink
      : matchedAppPage
        ? Object.keys(defaultAppData).find(
          (k) =>
            matchedAppPage.title.toLowerCase().includes(k.toLowerCase()) ||
            k.toLowerCase().includes(matchedAppPage.title.toLowerCase())
        ) || "/applications"
        : "/applications";

  const defaultAppObj =
    defaultAppData[appFallbackKey] || defaultAppData["/applications"];
  const appDescription =
    matchedAppSeo?.meta_description ||
    matchedAppPage?.description ||
    defaultAppObj.desc;
  const appImage = matchedAppSeo?.image || defaultAppObj.img;

  const dynamicAppItems =
    pages.length > 0
      ? pages
        .filter((p) => {
          try {
            const sections =
              typeof p.sections === "string"
                ? JSON.parse(p.sections)
                : p.sections;
            return (
              p.slug === "applications" || sections?.layoutType === "applications"
            );
          } catch {
            return p.slug === "applications";
          }
        })
        .map((p) => {
          const sections = typeof p.sections === "string" ? JSON.parse(p.sections ?? "{}") : (p.sections ?? {});
          return {
            name: p.title,
            link:
              p.slug === "applications"
                ? "/applications"
                : `/applications/${p.slug}`,
            navOrder: sections?.navOrder as number | undefined,
          };
        })
        .sort((a, b) => {
          if (a.navOrder != null && b.navOrder != null) return a.navOrder - b.navOrder;
          if (a.navOrder != null) return -1;
          if (b.navOrder != null) return 1;
          if (a.link === "/applications") return -1;
          if (b.link === "/applications") return 1;
          return a.name.localeCompare(b.name);
        })
      : applicationItems;

  // ── Knowledge ──────────────────────────────────────────────────────────────
  const defaultKnowledgeData: Record<string, { desc: string; img: string }> = {
    "Choosing The Right Adhesive": {
      desc: "Answer a few simple questions in our adhesive finder to discover the perfect glue match for your specific wood type and conditions.",
      img: "/images/blog/Rectangle 142.png",
    },
    "Application Tips": {
      desc: "Pro carpenter advice on clamping times, spread rates, moisture management, and surface preparation to guarantee a perfect bond.",
      img: "/images/hero.png",
    },
    "Fix Common Issues": {
      desc: "Learn how to prevent bubble formations, joint separations, staining, and resolve gluing mishaps quickly.",
      img: "/images/about/badge-iso-14001.png",
    },
    "Latest Blogs": {
      desc: "Browse our articles on modern woodworking techniques, adhesive science advances, and carpenter guides.",
      img: "/images/blog/Rectangle 142.png",
    },
    "Technical Resources": {
      desc: "Download safety data sheets (SDS), technical datasheets (TDS), certificates, and product brochures.",
      img: "/images/about/badge-chairman.png",
    },
  };

  const dynamicKnowledgeItems = (() => {
    const knowledgeMenu = publishedMenu.find(
      (m) => m.id === "nav-knowledge" || m.title.toLowerCase() === "knowledge center"
    );

    let items: Array<{ name: string; link: string; order?: number }> = [];

    if (knowledgeMenu?.subItems) {
      items = knowledgeMenu.subItems.map((sub: any) => ({
        name: sub.title,
        link: sub.url || `/blog?category=${encodeURIComponent(sub.title)}`,
        order: sub.order ?? 0,
      }));
    } else if (blogCategories.length > 0) {
      items = blogCategories.map((cat: any, idx: number) => ({
        name: cat.name,
        link: `/blog?category=${encodeURIComponent(cat.name)}`,
        order: idx + 1,
      }));
    } else {
      items = knowledgeItems.map((k, idx) => ({ ...k, order: idx + 1 }));
    }

    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  })();

  const currentKnowledgeItem =
    hoveredKnowledgeItem || (dynamicKnowledgeItems[0]?.name || "Choosing The Right Adhesive");

  // Look up hovered blog page + its SEO record
  const currentKnowledgeLink = dynamicKnowledgeItems.find(
    (i) => i.name === currentKnowledgeItem
  )?.link ?? "/blog";
  const currentKnowledgeSlug =
    currentKnowledgeLink === "/resources"
      ? "resources"
      : "blog";

  const matchedKnowledgePage = pages.find((p) => p.slug === currentKnowledgeSlug);
  const matchedKnowledgeSeo = seos.find(
    (s) =>
      s.page_type === "static" &&
      (s.page_id === currentKnowledgeSlug ||
        (currentKnowledgeSlug === "blog" && s.page_id === "BLOG_PAGE") ||
        (matchedKnowledgePage && s.page_id === matchedKnowledgePage.id))
  );

  const knowledgeFallbackKey =
    defaultKnowledgeData[currentKnowledgeItem] != null
      ? currentKnowledgeItem
      : pages.find((p) => p.title === currentKnowledgeItem)
        ? Object.keys(defaultKnowledgeData).find(
          (k) =>
            currentKnowledgeItem.toLowerCase().includes(k.toLowerCase()) ||
            k.toLowerCase().includes(currentKnowledgeItem.toLowerCase())
        ) || "Latest Blogs"
        : "Latest Blogs";

  const defaultKnowledgeObj =
    defaultKnowledgeData[knowledgeFallbackKey] ||
    defaultKnowledgeData["Choosing The Right Adhesive"];

  const knowledgeDescription =
    matchedKnowledgeSeo?.meta_description ||
    matchedKnowledgePage?.description ||
    defaultKnowledgeObj.desc;

  const knowledgeImage = matchedKnowledgeSeo?.image || defaultKnowledgeObj.img;

  // ── Products ───────────────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState("Woodworking Adhesives");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Build dynamic product categories, respecting admin-stored order and hiding hidden categories
  const dynamicProductCategories = (() => {
    if (dbCategories.length === 0) return productCategories;

    // Filter out hidden main categories
    const mainCats = dbCategories.filter((cat) => !cat.parent_category && cat.hideInMenu !== true);

    // Check if there's a stored order in the published menu's nav-products item
    const productsMenuItem = publishedMenu.find(
      (m) => m.isStatic || m.id === "nav-products" || m.title.toLowerCase() === "products"
    );
    const storedOrder = productsMenuItem?.subItems || [];

    let orderedMainCats = mainCats;
    if (storedOrder.length > 0) {
      const orderMap = new Map(storedOrder.map((s) => [s.id, s.order]));
      orderedMainCats = [...mainCats].sort((a, b) => {
        const oa = orderMap.get(a.id) ?? 9999;
        const ob = orderMap.get(b.id) ?? 9999;
        return oa - ob;
      });
    }

    return orderedMainCats.map((cat) => {
      // Filter out hidden sub categories
      let subCats = dbCategories.filter((sub) => sub.parent_category === cat.id && sub.hideInMenu !== true);

      // Apply stored sub-category order from description JSON if available
      const storedEntry = storedOrder.find((s) => s.id === cat.id);
      if (storedEntry?.description) {
        try {
          const parsed = JSON.parse(storedEntry.description);
          const subOrderIds: string[] = parsed.subOrder || [];
          if (subOrderIds.length > 0) {
            const subOrderMap = new Map(subOrderIds.map((id, i) => [id, i]));
            subCats = [...subCats].sort((a, b) => {
              const oa = subOrderMap.has(a.id) ? subOrderMap.get(a.id)! : 9999;
              const ob = subOrderMap.has(b.id) ? subOrderMap.get(b.id)! : 9999;
              return oa - ob;
            });
          }
        } catch { /* ignore */ }
      }

      return {
        name: cat.name,
        products: subCats.map((sub) => ({
          name: sub.name,
          slug: sub.slug,
          image: "/images/Watershield.png",
          bgColor: "bg-[#0083CB]"
        })),
        categoryImage: "/images/mega-menu.png"
      };
    });
  })();

  const activeCategoryData =
    dynamicProductCategories.find((c) => c.name === activeCategory) ||
    dynamicProductCategories[0] ||
    productCategories[0];

  const handleMenuEnter = (menu: string | null) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (activeMenu !== menu) {
      setHoveredGenericSubItem(null);
      setHoveredSubItemObj(null);
    }
    setActiveMenu(menu);
  };


  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHoveredAboutItem(null);
      setHoveredAppItem(null);
      setHoveredKnowledgeItem(null);
      setHoveredGenericSubItem(null);
      setHoveredSubItemObj(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <header
      id="main-landing-header"
      className="sticky top-0 left-0 right-0 z-50 w-full h-22 bg-white backdrop-blur-md transition-all duration-300 flex items-center"
    >
      <nav className="flex items-center justify-between max-w-360 mx-auto w-full px-5 lg:px-8 hd:px-12 3xl:px-8 font-google-sans relative">
        <Link href="/" className="shrink-0">
          <Image
            className="aspect-2/1 w-30 h-auto object-contain hidden lg:block"
            src={siteSettings?.headerDesktopLogo || siteSettings?.desktopLogo || "/images/logo.png"}
            alt="Jivanjor Logo"
            loading="eager"
            width={120}
            height={72}
          />
          <Image
            className="aspect-square w-28 h-14 lg:hidden object-contain"
            src={siteSettings?.headerMobileLogo || siteSettings?.mobileLogo || "/images/logo.png"}
            alt="Jivanjor Logo"
            loading="eager"
            width={112}
            height={56}
          />
        </Link>


        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center justify-center text-lg font-medium gap-6">
          {publishedMenu
            .filter((item) => item.hideInMenu !== true)
            .map((item) => {
              const isMega = item.type === "menu";
              const menuKey = item.id;
              const isActive = activeMenu === menuKey || activeMenu === item.title.toLowerCase();
              const isProducts =
                item.isStatic ||
                item.id === "nav-products" ||
                item.title.toLowerCase() === "products";

              const activeColor = isProducts ? "text-[#FF0009]" : "text-primary";
              const hoverColor = isProducts ? "hover:text-[#FF0009]" : "hover:text-primary";
              const colorClass = isActive ? activeColor : hoverColor;

              if (isMega) {
                return (
                  <div
                    key={item.id}
                    className="relative py-4"
                    onMouseEnter={() => handleMenuEnter(menuKey)}
                    onMouseLeave={handleMenuLeave}
                  >
                    {/* Notice Rule #4: Main menu title with megamenu option does not directly link to any URL */}
                    <span
                      onClick={() => setActiveMenu(isActive ? null : menuKey)}
                      className={`cursor-pointer transition-colors ${colorClass}`}
                    >
                      {item.title}
                    </span>
                  </div>
                );
              }

              if (item.type === "external_link") {
                return (
                  <a
                    key={item.id}
                    href={item.url || "#"}
                    target={item.target || "_blank"}
                    rel="noopener noreferrer"
                    className={`cursor-pointer transition-colors py-4 ${hoverColor}`}
                  >
                    {item.title}
                  </a>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.url || "#"}
                  className={`cursor-pointer transition-colors py-4 ${hoverColor}`}
                >
                  {item.title}
                </Link>
              );
            })}

          <Link href="#" className="hover:scale-110 transition-colors py-4">
            <Image
              src="/images/whatsapp-icon.svg"
              alt="Enquire Now"
              width={34}
              height={34}
            />
          </Link>
        </div>

        {/* Backdrop Overlay with Blur */}
        <div
          className={`fixed top-22 inset-x-0 bottom-0 bg-black/30 backdrop-blur-md transition-all duration-300 z-100 ${activeMenu !== null
            ? "opacity-100 pointer-events-auto visible"
            : "opacity-0 pointer-events-none invisible hidden"
            }`}
          onMouseEnter={handleMenuLeave}
        />

        {/* Desktop Mega Dropdown Menu */}
        {activeMenu !== null && (
          <div
            className="absolute top-full right-0 mx-auto mt-2 mr-20 max-w-4xl w-full min-h-75 bg-white rounded-[20px] z-50 overflow-hidden hidden lg:flex flex-col font-google-sans transition-all duration-300 ease-out origin-top opacity-100 translate-y-8 scale-100 pointer-events-auto"
            onMouseEnter={() => handleMenuEnter(activeMenu)}
            onMouseLeave={handleMenuLeave}
          >
            {(() => {
              const activeItem = publishedMenu.find(
                (m) => m.id === activeMenu || m.title.toLowerCase() === activeMenu?.toLowerCase()
              );

              const isProductMenu =
                activeItem?.isStatic ||
                activeItem?.id === "nav-products" ||
                activeItem?.title.toLowerCase() === "products" ||
                activeMenu === "products";

              if (isProductMenu) {
                return (
                  <div className="flex">
                    {/* Left Column: Top-level Category List */}
                    <div className="flex flex-col min-w-75 p-6 pb-12 bg-surface">
                      {dynamicProductCategories.map((cat) => (
                        <button
                          key={cat.name}
                          onMouseEnter={() => setActiveCategory(cat.name)}
                          onClick={() => setActiveCategory(cat.name)}
                          className={`flex items-center justify-between group w-full text-left text-base py-0.5 transition-all duration-150 cursor-pointer border-b border-black last:border-b-0 ${activeCategory === cat.name ? "font-bold" : "font-normal hover:font-bold"
                            }`}
                        >
                          <span className="leading-[200%]!">{cat.name}</span>
                          {activeCategory === cat.name && (
                            <ChevronRight size={16} strokeWidth={2} className="text-primary" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Middle Column: Sub-products list */}
                    <div className="flex flex-col flex-1 p-8 pb-12">
                      {activeCategoryData.products.map((prod: any) => (
                        <Link
                          href={`/categories/${prod.slug || prod.name.replace(/\s/g, "-").toLowerCase()}`}
                          key={prod.name}
                          className="py-0.5 text-base leading-[150%] hover:font-bold transition-colors duration-150 cursor-pointer"
                          onClick={() => setActiveMenu(null)}
                        >
                          {prod.name}
                        </Link>
                      ))}
                    </div>

                    {/* Right Column: Category Image + View All Button */}
                    <div className="flex flex-col py-6 min-w-65 pr-8">
                      <div className="relative w-full min-h-42 rounded-2xl overflow-hidden">
                        <Image
                          src={activeCategoryData.categoryImage}
                          alt={activeCategoryData.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Link
                        href="/categories"
                        onClick={() => setActiveMenu(null)}
                        className="mt-5 px-5 py-2 rounded-full text-white text-sm font-medium bg-linear-to-br from-[#FF0009] to-[#772571] hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap max-w-fit"
                      >
                        View All Products
                      </Link>
                    </div>
                  </div>
                );
              }

              if (!activeItem) return null;

              const isKnowledgeNav = activeItem.id === "nav-knowledge" || activeItem.title.toLowerCase() === "knowledge center";
              const rawSubItems = isKnowledgeNav
                ? dynamicKnowledgeItems.map((item, idx) => ({
                  id: `sub-know-${idx}`,
                  title: item.name,
                  type: "page",
                  url: item.link,
                  order: item.order ?? (idx + 1),
                  description: undefined,
                  target: undefined,
                  hideInMenu: false,
                })).sort((a, b) => (a.order || 0) - (b.order || 0))
                : (activeItem.subItems || []).sort((a, b) => (a.order || 0) - (b.order || 0));

              const subItems = rawSubItems.filter((sub: any) => sub.hideInMenu !== true);

              const fallbackImage =
                activeItem.id === "nav-about"
                  ? aboutImage
                  : activeItem.id === "nav-applications"
                    ? appImage
                    : activeItem.id === "nav-knowledge"
                      ? knowledgeImage
                      : "/images/hero.png";

              const displayImage =
                hoveredSubItemObj?.image ||
                activeItem.image ||
                fallbackImage ||
                "/images/hero.png";

              return (
                <div className="flex">
                  {/* Left Column: Sub-item Links */}
                  <div className="flex flex-col bg-surface min-w-75 min-h-75 p-6 pb-12">
                    {subItems.length > 0 ? (
                      subItems.map((sub) => {
                        const normalizedUrl = normalizeSubItemUrl(sub.url, sub.title, activeItem);
                        if (sub.type === "external_link") {
                          return (
                            <Link
                              key={sub.id || sub.title}
                              href={normalizedUrl}
                              target={sub.target || "_blank"}
                              rel="noopener noreferrer"
                              onClick={() => setActiveMenu(null)}
                              onMouseEnter={() => {
                                if (isKnowledgeNav) setHoveredKnowledgeItem(sub.title);
                                setHoveredGenericSubItem(sub.description || sub.title);
                                setHoveredSubItemObj({ ...sub, url: normalizedUrl });
                              }}
                              className="flex items-center justify-between group w-full text-left text-base leading-[200%]! py-0.5 hover:font-bold transition-all duration-150 cursor-pointer border-b border-black last:border-b-0"
                            >
                              {sub.title}
                            </Link>
                          );
                        }
                        return (
                          <Link
                            key={sub.id || sub.title}
                            href={normalizedUrl}
                            onClick={() => setActiveMenu(null)}
                            onMouseEnter={() => {
                              if (isKnowledgeNav) setHoveredKnowledgeItem(sub.title);
                              setHoveredGenericSubItem(sub.description || sub.title);
                              setHoveredSubItemObj({ ...sub, url: normalizedUrl });
                            }}
                            className="flex items-center justify-between group w-full text-left text-base leading-[200%]! py-0.5 hover:font-bold transition-all duration-150 cursor-pointer border-b border-black last:border-b-0"
                          >
                            {sub.title}
                          </Link>
                        );
                      })
                    ) : (
                      <div className="text-xs text-foreground/50 italic py-4">No sub-items configured</div>
                    )}
                  </div>

                  {/* Middle Column: Copy */}
                  <div className="flex flex-col flex-1 p-8">
                    <p className="text-lg text-foreground">
                      {hoveredGenericSubItem ||
                        (activeItem.id === "nav-about"
                          ? aboutDescription
                          : activeItem.id === "nav-applications"
                            ? appDescription
                            : activeItem.id === "nav-knowledge"
                              ? knowledgeDescription
                              : `${activeItem.title} - Explore Jivanjor adhesive products and solutions.`)}
                    </p>
                  </div>

                  {/* Right Column: Image */}
                  <div className="flex flex-col py-6 min-w-65 pr-8">
                    <div className="relative w-full min-h-42 rounded-2xl overflow-hidden bg-surface/50">
                      <Image
                        src={displayImage}
                        alt={activeItem.title}
                        fill
                        className="object-cover transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Bottom brand gradient strip */}
            <div className="absolute bottom-0 w-full h-8 bg-linear-to-br from-[#FF0009] to-[#772571]" />
          </div>
        )}


        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden mr-2">
          <Link href="#" className="hover:scale-110 transition-colors">
            <Image
              src="/images/whatsapp-icon.svg"
              alt="Enquire Now"
              width={28}
              height={28}
            />
          </Link>
          <button
            onClick={toggleMenu}
            className="relative transition-colors z-60 cursor-pointer"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col items-end justify-between w-6 h-4.5">
              <span
                className={`block h-0.5 w-full bg-primary transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""
                  }`}
              />
              <span
                className={`block h-0.5 w-full bg-primary transition-all duration-300 ${open ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`block h-0.5 w-full bg-primary transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""
                  }`}
              />
            </div>
          </button>
        </div>

        {open ? (
          <MobileNav
            onClose={() => setOpen(false)}
            publishedMenu={publishedMenu}
            aboutItems={dynamicAboutItems}
            appItems={dynamicAppItems}
            knowledgeItems={dynamicKnowledgeItems}
            productCategories={
              dbCategories.length > 0
                ? dbCategories
                  .filter((cat) => !cat.parent_category && cat.hideInMenu !== true)
                  .map((cat) => {
                    const subCats = dbCategories.filter(
                      (sub) => sub.parent_category === cat.id && sub.hideInMenu !== true
                    );
                    return {
                      name: cat.name,
                      hideInMenu: cat.hideInMenu,
                      products: subCats.map((sub) => sub.name),
                    };
                  })
                : undefined
            }
          />
        ) : null}

      </nav>
    </header>
  );
}
