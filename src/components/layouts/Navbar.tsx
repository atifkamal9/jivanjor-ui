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
import { api } from "@/lib/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  const [activeMenu, setActiveMenu] = useState<
    "about" | "products" | "applications" | "knowledge" | "partner" | null
  >(null);
  const [hoveredAboutItem, setHoveredAboutItem] = useState<string | null>(null);
  const [hoveredAppItem, setHoveredAppItem] = useState<string | null>(null);
  const [hoveredKnowledgeItem, setHoveredKnowledgeItem] = useState<string | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [seos, setSeos] = useState<any[]>([]);

  useEffect(() => {
    async function loadNavData() {
      try {
        const [pagesList, seosList] = await Promise.all([
          api.getPages(),
          api.getSeoMetadata()
        ]);
        setPages(pagesList);
        setSeos(seosList);
      } catch (err) {
        console.error("Failed to load dynamic nav data:", err);
      }
    }
    loadNavData();
  }, []);

  console.log("pages----------->", pages);

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
        .map((p) => ({
          name: p.title,
          link: p.slug === "about" ? "/about" : `/about/${p.slug}`,
        }))
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
        .map((p) => ({
          name: p.title,
          link:
            p.slug === "applications"
              ? "/applications"
              : `/applications/${p.slug}`,
        }))
        .sort((a, b) => {
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

  const dynamicKnowledgeItems =
    pages.length > 0
      ? [
        ...pages
          .filter((p) => {
            try {
              const sections =
                typeof p.sections === "string"
                  ? JSON.parse(p.sections)
                  : p.sections;
              return (
                p.slug === "blog" || sections?.layoutType === "blog"
              );
            } catch {
              return p.slug === "blog";
            }
          })
          .map((p) => ({
            name: p.title,
            link: p.slug === "blog" ? "/blog" : `/blog/${p.slug}`,
          }))
        ,
        { name: "Technical Resources", link: "/resources" }
      ]
      : knowledgeItems;

  const currentKnowledgeItem =
    hoveredKnowledgeItem || (dynamicKnowledgeItems[0]?.name || "Choosing The Right Adhesive");

  // Look up hovered blog page + its SEO record (mirrors About/Applications pattern)
  const currentKnowledgeLink = dynamicKnowledgeItems.find(
    (i) => i.name === currentKnowledgeItem
  )?.link ?? "/blog";
  const currentKnowledgeSlug =
    currentKnowledgeLink === "/blog"
      ? "blog"
      : currentKnowledgeLink.startsWith("/blog/")
        ? currentKnowledgeLink.replace("/blog/", "")
        : currentKnowledgeLink === "/resources"
          ? "resources"
          : "";

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

  const activeCategoryData =
    productCategories.find((c) => c.name === activeCategory) ||
    productCategories[0];

  const handleMenuEnter = (
    menu: "about" | "products" | "applications" | "knowledge" | "partner" | null
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHoveredAboutItem(null);
      setHoveredAppItem(null);
      setHoveredKnowledgeItem(null);
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
      <nav className="flex items-center justify-between max-w-360 mx-auto w-full px-6 font-google-sans relative">
        <Link href="/" className="shrink-0">
          <Image
            className="aspect-2/1 w-28 h-14 md:w-30 md:h-auto"
            src="/images/logo.png"
            alt="Jivanjor Logo"
            loading="eager"
            width={120}
            height={72}
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center justify-center text-lg font-medium gap-6">
          <div
            className="relative py-4"
            onMouseEnter={() => handleMenuEnter("about")}
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="/about"
              className={`cursor-pointer transition-colors ${activeMenu === "about" ? "text-primary" : "hover:text-primary"
                }`}
            >
              About
            </Link>
          </div>

          <div
            className="relative py-4"
            onMouseEnter={() => handleMenuEnter("products")}
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="/categories"
              className={`flex items-center gap-1 cursor-pointer transition-colors ${activeMenu === "products" ? "text-[#FF0009]" : "hover:text-[#FF0009]"
                }`}
            >
              Products
            </Link>
          </div>

          <div
            className="relative py-4"
            onMouseEnter={() => handleMenuEnter("applications")}
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="/applications"
              className={`cursor-pointer transition-colors ${activeMenu === "applications" ? "text-primary" : "hover:text-primary"
                }`}
            >
              Applications
            </Link>
          </div>

          <div
            className="relative py-4"
            onMouseEnter={() => handleMenuEnter("knowledge")}
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="/blog"
              className={`cursor-pointer transition-colors ${activeMenu === "knowledge" ? "text-primary" : "hover:text-primary"
                }`}
            >
              Knowledge Hub
            </Link>
          </div>

          <div
            className="relative py-4"
            onMouseEnter={() => handleMenuEnter("partner")}
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="/partner"
              className={`cursor-pointer transition-colors ${activeMenu === "partner" ? "text-primary" : "hover:text-primary"
                }`}
            >
              Partner
            </Link>
          </div>

          <Link href="/contact" className="hover:text-primary transition-colors py-4">
            Contact
          </Link>

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
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
            }`}
          onMouseEnter={handleMenuLeave}
        />

        {/* Desktop Mega Dropdown Menu */}
        <div
          className={`absolute top-full right-0 mx-auto mt-2 mr-20 max-w-4xl w-full min-h-75 bg-white rounded-[20px] z-50 overflow-hidden hidden lg:flex flex-col font-google-sans transition-all duration-300 ease-out origin-top ${activeMenu !== null
            ? "opacity-100 translate-y-8 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
            }`}
          onMouseEnter={() => handleMenuEnter(activeMenu)}
          onMouseLeave={handleMenuLeave}
        >
          {/* Products panel */}
          {activeMenu === "products" && (
            <div className="flex">
              {/* Left Column: Top-level Category List */}
              <div className="flex flex-col min-w-75 p-6 bg-surface">
                {productCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onMouseEnter={() => setActiveCategory(cat.name)}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center justify-between group w-full text-left text-base py-0.5 transition-all duration-150 cursor-pointer border-b border-black last:border-b-0 ${activeCategory === cat.name
                      ? "font-bold"
                      : "font-normal hover:font-bold"
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
              <div className="flex flex-col flex-1 p-8">
                {activeCategoryData.products.map((prod) => (
                  <Link
                    href={`/categories/${prod.name.replace(/\s/g, "-").toLowerCase()}`}
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
          )}

          {/* About / Applications / Knowledge / Partner panel */}
          {activeMenu !== "products" && activeMenu !== null && (
            <div className="flex">
              {/* Left Column: Links */}
              <div className="flex flex-col min-w-75 min-h-75 p-6 bg-surface">
                {(activeMenu === "about"
                  ? dynamicAboutItems
                  : activeMenu === "applications"
                    ? dynamicAppItems
                    : activeMenu === "knowledge"
                      ? dynamicKnowledgeItems
                      : partnerItems
                ).map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => {
                      setActiveMenu(null);
                      setHoveredAboutItem(null);
                      setHoveredAppItem(null);
                      setHoveredKnowledgeItem(null);
                    }}
                    onMouseEnter={() => {
                      if (activeMenu === "about") {
                        setHoveredAboutItem(item.link);
                      } else if (activeMenu === "applications") {
                        setHoveredAppItem(item.link);
                      } else if (activeMenu === "knowledge") {
                        setHoveredKnowledgeItem(item.name);
                      }
                    }}
                    className="flex items-center justify-between group w-full text-left text-base leading-[200%]! py-0.5 hover:font-bold transition-all duration-150 cursor-pointer border-b border-black last:border-b-0"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Middle Column: Copy */}
              <div className="flex flex-col flex-1 p-8">
                <p className="text-lg text-foreground">
                  {activeMenu === "about"
                    ? aboutDescription
                    : activeMenu === "applications"
                      ? appDescription
                      : activeMenu === "knowledge"
                        ? knowledgeDescription
                        : "Partner with Jivanjor, India's most trusted adhesive partner. Become a dealer, or download the Achievers Club app to access contractor rewards and tracking benefits."}
                </p>
              </div>

              {/* Right Column: Image */}
              <div className="flex flex-col py-6 min-w-65 pr-8">
                <div className="relative w-full min-h-42 rounded-2xl overflow-hidden">
                  <Image
                    src={
                      activeMenu === "about"
                        ? aboutImage
                        : activeMenu === "applications"
                          ? appImage
                          : activeMenu === "knowledge"
                            ? knowledgeImage
                            : "/images/contractor/contractor-app-promo.png"
                    }
                    alt={activeMenu ?? "menu"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom brand gradient strip */}
          <div className="absolute bottom-0 w-full h-8 bg-linear-to-br from-[#FF0009] to-[#772571]" />
        </div>

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
            aboutItems={dynamicAboutItems}
            appItems={dynamicAppItems}
            knowledgeItems={dynamicKnowledgeItems}
          />
        ) : null}
      </nav>
    </header>
  );
}
