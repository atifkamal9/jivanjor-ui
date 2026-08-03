"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Plus, Minus, CornerDownRight } from "lucide-react";
import {
  aboutItems as staticAboutItems,
  applicationItems,
  knowledgeItems,
  partnerItems,
} from "@/lib/nav";

import { api } from "@/lib/api";
import { MenuItem, normalizeSubItemUrl } from "@/lib/menuTypes";


interface CategoryItem {
  name: string;
  products: string[];
}

interface MobileNavProps {
  onClose?: () => void;
  aboutItems?: any[];
  appItems?: any[];
  knowledgeItems?: any[];
  productCategories?: any[];
  publishedMenu?: MenuItem[];
}


const staticProductCategories: CategoryItem[] = [
  {
    name: "Woodworking Adhesive",
    products: [
      "Super Premium Adhesive",
      "Specialty Adhesive",
      "Regular Adhesive",
      "Waterproof Grade Adhesive",
      "Wood Ancillaries",
      "ECO",
      "Wood Preservative",
    ],
  },
  {
    name: "Construction Chemicals",
    products: [
      "Tile Adhesive",
      "Grout",
      "Waterproofing Compound",
      "Epoxy Grout",
    ],
  },
  {
    name: "Maintenance",
    products: ["Pipe Sealant", "Thread Seal Tape", "Maintenance Spray"],
  },
  {
    name: "Wood Finish Products",
    products: ["Wood Polish", "Wood Stain", "Lacquer"],
  },
  {
    name: "Packaging Adhesives",
    products: [
      "Box Sealing Adhesive",
      "Lamination Adhesive",
      "Carton Adhesive",
    ],
  },
  {
    name: "Footwear Adhesives",
    products: [
      "Sole Bonding Adhesive",
      "Leather Adhesive",
      "Synthetic Adhesive",
    ],
  },
];

export default function MobileNav({
  onClose,
  aboutItems = staticAboutItems,
  appItems = applicationItems,
  knowledgeItems: propKnowledgeItems = knowledgeItems,
  productCategories: incomingProductCategories,
  publishedMenu,
}: MobileNavProps) {
  const pathname = usePathname();
  const productCategories = incomingProductCategories || staticProductCategories;

  // Determine initial open section based on current path
  const getInitialSection = () => {
    if (pathname?.includes("/about")) return "About";
    if (pathname?.includes("/categories")) return "Products";
    if (pathname?.includes("/resources")) return "KnowledgeHub";
    if (pathname?.includes("/blog")) return "KnowledgeHub";
    if (pathname?.includes("/partner")) return "Partner";
    if (pathname?.includes("/contractor")) return "Partner";
    return "Products";
  };

  // Determine initial open category based on current path
  const getInitialCategory = () => {
    for (const cat of productCategories) {
      const match = cat.products.some((prod: string) => {
        const productLink = `/categories/${prod.replace(/\s/g, "-").toLowerCase()}`;
        return pathname === productLink;
      });
      if (match) return cat.name;
    }
    return "Woodworking Adhesive";
  };

  const [openSection, setOpenSection] = useState<string | null>(
    getInitialSection(),
  );
  const [openCategory, setOpenCategory] = useState<string | null>(
    getInitialCategory(),
  );
  const [mobileLogoSrc, setMobileLogoSrc] = useState<string>("/images/logo.png");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    api.getSettings().then((s) => {
      if (s?.mobileLogo || s?.desktopLogo) {
        setMobileLogoSrc(s.mobileLogo || s.desktopLogo || "/images/logo.png");
      }
    }).catch(() => {});

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const toggleCategory = (catName: string) => {
    setOpenCategory(openCategory === catName ? null : catName);
  };

  return (
    <section className="fixed inset-0 bg-white z-50 flex flex-col h-dvh w-screen overflow-hidden font-google-sans animate-in fade-in duration-300">
      {/* Header bar inside Mobile Menu */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" onClick={onClose} className="shrink-0">
          <Image
            className="aspect-2/1 w-28 h-14 md:w-30 md:h-auto object-contain"
            src={mobileLogoSrc}
            alt="Jivanjor Logo"
            width={112}
            height={56}
          />
        </Link>
      </div>

      {/* Main Nav Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {publishedMenu && publishedMenu.length > 0 ? (
          publishedMenu.map((item) => {
            const isMega = item.type === "menu";
            const sectionKey = item.id;
            const isOpen = openSection === sectionKey || openSection === item.title;
            const isProductMenu =
              item.isStatic ||
              item.id === "nav-products" ||
              item.title.toLowerCase() === "products";

            if (isMega) {
              return (
                <div key={item.id} className="border-b">
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className="flex items-center justify-between w-full py-2 text-xl font-bold cursor-pointer"
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      strokeWidth={2.5}
                      size={20}
                      className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""
                        }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="bg-surface border-t p-5 space-y-1.5 transition-all duration-300">
                      {isProductMenu ? (
                        productCategories.map((cat) => {
                          const isCatOpen = openCategory === cat.name;
                          return (
                            <div key={cat.name} className="space-y-1">
                              <button
                                onClick={() => toggleCategory(cat.name)}
                                className="flex items-center justify-between w-full text-base font-medium cursor-pointer text-left focus:outline-none"
                              >
                                <span>{cat.name}</span>
                                {isCatOpen ? (
                                  <Minus size={18} strokeWidth={2.5} className="text-[#FF0009]" />
                                ) : (
                                  <Plus size={18} strokeWidth={2.5} className="text-[#FF0009]" />
                                )}
                              </button>

                              {isCatOpen && (
                                <div className="space-y-1">
                                  {cat.products.map((prod: string) => {
                                    const productLink = `/categories/${prod.replace(/\s/g, "-").toLowerCase()}`;
                                    const isActive = pathname === productLink;
                                    return (
                                      <Link
                                        key={prod}
                                        href={productLink}
                                        onClick={onClose}
                                        className={`flex items-center gap-1 text-base leading-[150%]! cursor-pointer ${isActive ? "text-[#FF0009] font-bold" : "hover:text-primary"
                                          }`}
                                      >
                                        <CornerDownRight size={16} strokeWidth={2.5} className="text-[#FF0009]" />
                                        <span>{prod}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : item.subItems && item.subItems.length > 0 ? (
                        item.subItems.map((sub) => {
                          const normalizedUrl = normalizeSubItemUrl(sub.url, sub.title, item);
                          if (sub.type === "external_link") {
                            return (
                              <a
                                key={sub.id || sub.title}
                                href={normalizedUrl}
                                target={sub.target || "_blank"}
                                rel="noopener noreferrer"
                                onClick={onClose}
                                className="block text-base hover:text-primary cursor-pointer py-1"
                              >
                                {sub.title}
                              </a>
                            );
                          }
                          const isActive = pathname === normalizedUrl;
                          return (
                            <Link
                              key={sub.id || sub.title}
                              href={normalizedUrl}
                              onClick={onClose}
                              className={`block text-base cursor-pointer py-1 ${isActive ? "text-[#FF0009] font-bold" : "hover:text-primary"
                                }`}
                            >
                              {sub.title}
                            </Link>
                          );
                        })
                      ) : (
                        <div className="text-xs text-foreground/50 italic">No items</div>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            if (item.type === "external_link") {
              return (
                <div key={item.id} className="border-b">
                  <a
                    href={item.url || "#"}
                    target={item.target || "_blank"}
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="block py-3 text-xl font-bold hover:text-primary cursor-pointer"
                  >
                    {item.title}
                  </a>
                </div>
              );
            }

            return (
              <div key={item.id} className="border-b">
                <Link
                  href={item.url || "#"}
                  onClick={onClose}
                  className={`block py-3 text-xl font-bold cursor-pointer ${pathname === item.url ? "text-[#FF0009]" : "hover:text-primary"
                    }`}
                >
                  {item.title}
                </Link>
              </div>
            );
          })
        ) : (
          /* Fallback static rendering if publishedMenu is empty */
          <>
            <div className="border-b">
              <button
                onClick={() => toggleSection("About")}
                className="flex items-center justify-between w-full py-2 text-xl font-bold cursor-pointer"
              >
                <span>About</span>
                <ChevronDown
                  strokeWidth={2.5}
                  size={20}
                  className={`transition-transform duration-300 ${openSection === "About" ? "rotate-180" : ""
                    }`}
                />
              </button>

              {openSection === "About" && (
                <div className="bg-surface border-t px-6 py-5 space-y-2 transition-all duration-300">
                  {aboutItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.link}
                      onClick={onClose}
                      className="block text-base hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="border-b">
              <button
                onClick={() => toggleSection("Products")}
                className="flex items-center justify-between w-full py-2 text-xl font-bold cursor-pointer"
              >
                <span>Products</span>
                <ChevronDown
                  strokeWidth={2.5}
                  size={20}
                  className={`transition-transform duration-300 ${openSection === "Products" ? "rotate-180" : ""
                    }`}
                />
              </button>

              {openSection === "Products" && (
                <div className="bg-surface border-t px-6 py-5 space-y-1.5 transition-all duration-300">
                  {productCategories.map((cat) => (
                    <div key={cat.name} className="space-y-1">
                      <button
                        onClick={() => toggleCategory(cat.name)}
                        className="flex items-center justify-between w-full text-base font-medium cursor-pointer"
                      >
                        <span>{cat.name}</span>
                        {openCategory === cat.name ? <Minus size={18} /> : <Plus size={18} />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Contact Pill Button */}
        <div className="flex justify-center pt-6 pb-4">
          <Link
            href="/contact"
            onClick={onClose}
            className="min-w-28 px-6 py-1 rounded-full text-white text-lg font-bold bg-linear-to-br from-[#FF0009] to-[#772571] hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md whitespace-nowrap"
          >
            Contact
          </Link>
        </div>
      </div>


      {/* Bottom Brand Gradient Strip */}
      <div className="w-full h-8 bg-linear-to-br from-[#FF0009] to-[#772571] shrink-0" />
    </section>
  );
}
