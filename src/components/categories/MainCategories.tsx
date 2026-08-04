"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import {
  ChevronRight,
  ChevronRightCircle,
  ChevronLeftCircle,
  ChevronDown,
  Plus,
} from "lucide-react";

interface ProductCard {
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  mobileDesc: string;
  color: string;
  badge: string;
  image: string;
  backgroundImage?: string;
  features: string[];
}

interface SubCategoryData {
  name: string;
  slug?: string;
  title: string;
  description: string;
  shortDescription?: string;
  icon: string;
  products: ProductCard[];
}

interface MainCategoryData {
  name: string;
  slug?: string;
  subCategories: SubCategoryData[];
}

const slugify = (text: string) =>
  text
    ? text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
    : "";

const STATIC_MAIN_CATEGORIES_DATA: MainCategoryData[] = [
  {
    name: "Woodworking Adhesives",
    subCategories: [
      {
        name: "Waterproof Grade",
        title: "Waterproof Adhesives by Jivanjor",
        description:
          "Explore where watershield fits across furniture, laminates, plywood, boards and professional woodwork applications.",
        icon: "/images/Watershield.png",
        products: [
          {
            title: "Watershield",
            description:
              "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
            mobileDesc:
              "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
            color: "bg-[#0498AA]",
            badge: "Eco Friendly",
            image: "/images/Watershield.png",
            features: [
              "Best-in-Class Coverage",
              "D3 Grade for Water Resistance",
              "Anti-bubble Adhesive",
            ],
          },
          {
            title: "Aquabond",
            description:
              "Heatproof and waterproof adhesive. Aquabond kitchen ka specialist hai.",
            mobileDesc: "Heatproof and waterproof adhesive.",
            color: "bg-[#077937]",
            badge: "Waterproof Grade",
            image: "/images/Aquabond.png",
            features: [
              "Best-in-Class Coverage",
              "D3 Grade for Water Resistance",
              "Anti-bubble Adhesive",
            ],
          },
          {
            title: "Aquaprotekt",
            description:
              "Provides excellent water protection and moisture resistance for premium woodwork.",
            mobileDesc:
              "Provides excellent water protection and moisture resistance.",
            color: "bg-[#0498AA]",
            badge: "Eco Friendly",
            image: "/images/Watershield.png",
            features: [
              "Best-in-Class Coverage",
              "Anti-bubble Adhesive",
              "Superior Bond Strength",
            ],
          },
        ],
      },
      {
        name: "Super Premium",
        title: "Super Premium Adhesives by Jivanjor",
        description:
          "Explore where Supremo fits across furniture, laminates, plywood, boards and professional woodwork applications. Learn how our super premium adhesives provide unmatched bonding strength.",
        icon: "/images/Champion Super.png",
        products: [
          {
            title: "Champion Super",
            description:
              "Provides a superior bond and strength, while being non-hazardous.",
            mobileDesc:
              "Provides superior bond and strength, while being non-hazardous.",
            color: "bg-[#0083CB]",
            badge: "Super Premium",
            image: "/images/Champion Super.png",
            features: [
              "Best-in-Class Coverage",
              "Superior Bond Strength",
              "Non-hazardous & Safe",
            ],
          },
        ],
      },
      {
        name: "Wood Preservatives",
        title: "Wood Preservative Adhesives",
        description:
          "Special formulations that protect wood from termites, moisture damage, and fungal decay, ensuring lifelong durability for all wooden structures.",
        icon: "/images/Aquabond.png",
        products: [
          {
            title: "Termilok",
            description:
              "Protects wood from termites, moisture damage, and fungal decay, ensuring lifelong durability.",
            mobileDesc: "Protects wood from termites and moisture damage.",
            color: "bg-[#077937]",
            badge: "Preservative",
            image: "/images/Aquabond.png",
            features: [
              "Termite Protection",
              "Moisture Resistant",
              "Life Long Durability",
            ],
          },
        ],
      },
      {
        name: "Wood Ancillaries",
        title: "Wood Ancillary Adhesives",
        description:
          "Explore auxiliary solutions for high-performance edge banding, veneer bonding, and other complementary furniture-making processes.",
        icon: "/images/Foambond.png",
        products: [
          {
            title: "Foambond",
            description:
              "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
            mobileDesc:
              "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
            color: "bg-[#F57F26]",
            badge: "Speciality",
            image: "/images/Foambond.png",
            features: [
              "Best-in-Class Coverage",
              "Quick Tack & Grab",
              "Anti-bubble Adhesive",
            ],
          },
        ],
      },
      {
        name: "Speciality",
        title: "Speciality Adhesives by Jivanjor",
        description:
          "Explore our range of speciality adhesives designed for upholstery, foam, PVC, acrylic, edge banding, and other professional woodwork applications.",
        icon: "/images/Foambond.png",
        products: [
          {
            title: "Foambond Specialty",
            description:
              "Speciality adhesive for upholstery, foam, PVC, acrylic, and edge banding.",
            mobileDesc:
              "Speciality adhesive for upholstery, foam, PVC, acrylic, and edge banding.",
            color: "bg-[#F57F26]",
            badge: "Speciality",
            image: "/images/Foambond.png",
            features: [
              "Best-in-Class Coverage",
              "Quick Tack & Grab",
              "High Performance",
            ],
          },
        ],
      },
      {
        name: "Regular",
        title: "Regular Adhesives by Jivanjor",
        description:
          "Standard grade woodworking adhesives that offer consistent performance, reliability, and value for everyday professional applications.",
        icon: "/images/Champion Super.png",
        products: [
          {
            title: "Champion Regular",
            description:
              "Standard grade woodworking adhesive offering consistent performance and value.",
            mobileDesc:
              "Standard grade woodworking adhesive offering consistent performance.",
            color: "bg-[#0083CB]",
            badge: "Regular",
            image: "/images/Champion Super.png",
            features: ["Standard Coverage", "Reliable Bond", "Value for Money"],
          },
        ],
      },
      {
        name: "ECO",
        title: "Eco-Friendly Adhesives",
        description:
          "Zero-VOC, low odor, and environmentally sustainable adhesive options for modern eco-friendly homes and clean workplace environments.",
        icon: "/images/Watershield.png",
        products: [
          {
            title: "Hero",
            description:
              "Zero-VOC, low odor, and environmentally sustainable adhesive options.",
            mobileDesc:
              "Zero-VOC, low odor, and environmentally sustainable adhesive.",
            color: "bg-[#0498AA]",
            badge: "Eco Friendly",
            image: "/images/Watershield.png",
            features: ["Zero-VOC", "Eco Friendly", "Low Odor"],
          },
        ],
      },
    ],
  },
  {
    name: "Construction Chemicals",
    subCategories: [
      {
        name: "Tile Adhesive",
        title: "Premium Tile Adhesives",
        description:
          "High-strength tile adhesives for ceramic, vitrified tiles and stone cladding.",
        icon: "/images/Champion Super.png",
        products: [
          {
            title: "Tile Fix",
            description:
              "High performance adhesive for fixing tiles on walls and floors.",
            mobileDesc: "Adhesive for tiles.",
            color: "bg-[#0083CB]",
            badge: "Tile Adhesive",
            image: "/images/Champion Super.png",
            features: ["Strong Grip", "Water Resistant"],
          },
        ],
      },
      {
        name: "Grout",
        title: "Waterproof Tile Grouts",
        description:
          "Durable and color-fast tile grouts to seal joints and prevent leaks.",
        icon: "/images/Foambond.png",
        products: [
          {
            title: "Premium Grout",
            description:
              "Water-resistant cementitious grout for tile joint filling.",
            mobileDesc: "Tile joint filling grout.",
            color: "bg-[#F57F26]",
            badge: "Grout",
            image: "/images/Foambond.png",
            features: ["Stain Free", "Waterproof"],
          },
        ],
      },
      {
        name: "Waterproofing",
        title: "Advanced Waterproofing Solutions",
        description:
          "Liquid waterproofing membranes for roofs, balconies, and wet areas.",
        icon: "/images/Watershield.png",
        products: [
          {
            title: "Kwik Waterproof",
            description:
              "Advanced waterproofing liquid compound for roofs and basements.",
            mobileDesc: "Waterproofing compound.",
            color: "bg-[#0498AA]",
            badge: "Waterproofing",
            image: "/images/Watershield.png",
            features: ["Advanced Protection", "High Elasticity"],
          },
        ],
      },
    ],
  },
  {
    name: "Maintenance",
    subCategories: [
      {
        name: "Pipe Sealant",
        title: "Leak-Proof Thread Sealants",
        description:
          "Anaerobic sealants for secure metal and plastic pipe joints.",
        icon: "/images/Champion Super.png",
        products: [
          {
            title: "Pipe Lock",
            description: "Leak-proof pipe joint sealant for plumbing systems.",
            mobileDesc: "Pipe joint sealant.",
            color: "bg-[#0083CB]",
            badge: "Sealant",
            image: "/images/Champion Super.png",
            features: ["Leak Proof", "Quick Cure"],
          },
        ],
      },
      {
        name: "Lubricants",
        title: "Rust & Lubrication Sprays",
        description:
          "Multi-purpose maintenance sprays to lubricate and prevent rust.",
        icon: "/images/Watershield.png",
        products: [
          {
            title: "Kwik Spray",
            description: "Multi-purpose rust penetrant and lubrication spray.",
            mobileDesc: "Lubrication spray.",
            color: "bg-[#0498AA]",
            badge: "Lubricant",
            image: "/images/Watershield.png",
            features: ["Rust Protection", "Lubrication"],
          },
        ],
      },
    ],
  },
];

export default function MainCategories() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMainCategory, setActiveMainCategory] = useState(
    "Woodworking Adhesives",
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubCategory, setActiveSubCategory] =
    useState("Waterproof Grade");
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(
    0,
  );

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const [defaultCardBg, setDefaultCardBg] = useState("/images/placeholder.png");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, prods, settings] = await Promise.all([
          api.getCategories(),
          api.getProducts(),
          api.getSettings().catch(() => null),
        ]);
        setCategories(cats);
        setProducts(prods);
        if (settings?.categoryCardBg) {
          setDefaultCardBg(settings.categoryCardBg);
        }
      } catch (err) {
        console.error("Failed to load category/product data, falling back to static content:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const mainCategoriesData: MainCategoryData[] = categories.length > 0
    ? categories
      .filter((cat) => !cat.parent_category)
      .map((cat) => {
        const subCats = categories.filter((sub) => sub.parent_category === cat.id);
        return {
          name: cat.name,
          slug: cat.slug,
          subCategories: subCats.map((sub) => {
            const subProducts = products.filter((p) => {
              const catIds = Array.from(new Set([p.category_id, ...(p.category_ids || p.categoryIds || [])])).filter(Boolean);
              return catIds.some(
                (id) =>
                  id === sub.id ||
                  id.toLowerCase() === sub.id.toLowerCase() ||
                  id.toLowerCase() === sub.name.toLowerCase() ||
                  (sub.slug && id.toLowerCase() === sub.slug.toLowerCase())
              );
            });
            return {
              name: sub.name,
              slug: sub.slug,
              title: sub.name + " Adhesives by Jivanjor",
              description: sub.description || `Explore our high quality ${sub.name} solutions.`,
              icon: subProducts[0]?.image || "/images/Watershield.png",
              products: subProducts.map((p) => {
                let featuresList = ["Best-in-Class Coverage", "Superior Bond Strength", "High Performance"];
                if (p.metadata) {
                  const cleaned = p.metadata.split(",").map((f: string) => f.trim()).filter(Boolean);
                  if (cleaned.length > 0) {
                    featuresList = cleaned;
                  }
                }
                return {
                  title: p.name,
                  slug: p.slug,
                  description: p.description,
                  shortDescription: p.short_description || p.shortDescription || p.description,
                  mobileDesc: p.description,
                  color: p.name.toLowerCase().includes("aquabond")
                    ? "bg-[#077937]"
                    : p.name.toLowerCase().includes("foambond")
                      ? "bg-[#F57F26]"
                      : "bg-[#0498AA]",
                  badge: sub.name,
                  image: p.image || "/images/Watershield.png",
                  backgroundImage: p.backgroundImage || "",
                  features: featuresList,
                };
              }),
            };
          }),
        };
      })
    : [];

  const mainCategoriesToUse = mainCategoriesData.length > 0 ? mainCategoriesData : STATIC_MAIN_CATEGORIES_DATA;

  // Sync state from URL search params
  useEffect(() => {
    if (loading) return;

    const paramCat = searchParams.get("category") || searchParams.get("mainCategory") || searchParams.get("cat");
    const paramSub = searchParams.get("subCategory") || searchParams.get("sub");

    if (paramCat) {
      const matchedMain = mainCategoriesToUse.find(
        (c) =>
          (c.slug && c.slug.toLowerCase() === paramCat.toLowerCase()) ||
          c.name.toLowerCase() === paramCat.toLowerCase() ||
          slugify(c.name) === slugify(paramCat)
      );

      if (matchedMain) {
        setActiveMainCategory(matchedMain.name);
        if (paramSub) {
          const matchedSub = matchedMain.subCategories.find(
            (s) =>
              (s.slug && s.slug.toLowerCase() === paramSub.toLowerCase()) ||
              s.name.toLowerCase() === paramSub.toLowerCase() ||
              slugify(s.name) === slugify(paramSub)
          );
          if (matchedSub) {
            setActiveSubCategory(matchedSub.name);
          } else if (matchedMain.subCategories[0]?.name) {
            setActiveSubCategory(matchedMain.subCategories[0].name);
          }
        } else if (matchedMain.subCategories[0]?.name) {
          setActiveSubCategory(matchedMain.subCategories[0].name);
        }
      }
    } else {
      // Default to first main category and subcategory if no URL params
      const firstMain = mainCategoriesToUse[0];
      if (firstMain) {
        setActiveMainCategory(firstMain.name);
        if (firstMain.subCategories[0]?.name) {
          setActiveSubCategory(firstMain.subCategories[0].name);
        }
      }
    }
  }, [searchParams, loading, categories]);

  const updateUrlParams = (mainCatName: string, subCatName: string) => {
    const mainObj = mainCategoriesToUse.find((c) => c.name === mainCatName);
    const subObj = mainObj?.subCategories.find((s) => s.name === subCatName);

    const mainSlug = mainObj?.slug || slugify(mainCatName);
    const subSlug = subObj?.slug || slugify(subCatName);

    const params = new URLSearchParams(searchParams.toString());
    if (mainSlug) params.set("category", mainSlug);
    if (subSlug) params.set("subCategory", subSlug);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const currentMainCategoryData =
    mainCategoriesToUse.find((c) => c.name === activeMainCategory) ||
    mainCategoriesToUse[0];

  const subCategories = currentMainCategoryData?.subCategories || [];

  const currentSubCategoryData =
    subCategories.find((s) => s.name === activeSubCategory) || subCategories[0] || { name: "", title: "", description: "", shortDescription: "", icon: "", products: [] };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 1);
      setShowRightArrow(
        scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 1,
      );
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const clickedOutsideDesktop =
        !desktopDropdownRef.current ||
        !desktopDropdownRef.current.contains(event.target as Node);
      const clickedOutsideMobile =
        !mobileDropdownRef.current ||
        !mobileDropdownRef.current.contains(event.target as Node);

      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      const timer = setTimeout(checkScroll, 100);

      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);

      return () => {
        clearTimeout(timer);
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [activeMainCategory]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeIndex = subCategories.findIndex(
        (s) => s.name === activeSubCategory,
      );
      const activeElement = scrollContainerRef.current.children[
        activeIndex
      ] as HTMLElement;

      if (activeElement) {
        scrollContainerRef.current.scrollTo({
          left: activeElement.offsetLeft - 16,
          behavior: "smooth",
        });
      }
    }
    const timer = setTimeout(checkScroll, 400);
    return () => clearTimeout(timer);
  }, [activeSubCategory, subCategories]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] py-16 bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-semibold text-foreground/60 font-google-sans">
          Loading categories...
        </p>
      </div>
    );
  }

  const handleMainCategoryChange = (name: string) => {
    setActiveMainCategory(name);
    const categoryData =
      mainCategoriesToUse.find((c) => c.name === name) ||
      mainCategoriesToUse[0];
    const firstSubName = categoryData?.subCategories[0]?.name || "";
    setActiveSubCategory(firstSubName);
    setOpenAccordionIndex(0);
    setDropdownOpen(false);

    updateUrlParams(name, firstSubName);
  };

  const handleSubCategoryChange = (name: string) => {
    setActiveSubCategory(name);
    setOpenAccordionIndex(0);

    updateUrlParams(activeMainCategory, name);
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <section className="flex flex-col lg:flex-row justify-between leading-normal max-w-360 mx-auto my-4 sm:my-6 lg:my-9 px-5 lg:px-8 gap-4 lg:gap-12 z-100">
      {/* Sidebar Categories Panel */}
      <div className="hidden lg:block space-y-4 lg:w-[320px] shrink-0 sticky top-28 self-start z-30">
        <h2 className="text-2xl ">Categories</h2>
        {/* Dropdown Selector */}
        <div className="relative" ref={desktopDropdownRef}>
          <button
            onClick={toggleDropdown}
            className="relative w-82 max-w-full rounded-[20px] bg-linear-to-r from-[#FF0009] to-[#772571] text-white flex items-center justify-between px-4.5 py-3.5 font-google-sans text-lg shadow-[4px_4px_6.9px_rgba(0,0,0,0.1)] hover:opacity-95 transition-all cursor-pointer z-20"
          >
            <span>{activeMainCategory}</span>
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute top-4 left-0 w-82 max-w-full bg-surface rounded-b-[20px] pt-12 pb-5 overflow-hidden space-y-1.5 z-10">
              {mainCategoriesToUse.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleMainCategoryChange(cat.name)}
                  className="flex items-center justify-between w-full px-4.5 gap-2 hover:font-bold text-base text-black transition-colors cursor-pointer"
                >
                  <span>{cat.name}</span>
                  <ChevronRight
                    size={16}
                    className="text-primary transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Divider */}
        <div className="mx-auto max-w-43 border-t-[1.5px] border-[#C4C4C4] my-5" />
        {/* Subcategories grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
          {subCategories.map((sub) => {
            const isActive = activeSubCategory === sub.name;
            return (
              <button
                key={sub.name}
                onClick={() => handleSubCategoryChange(sub.name)}
                className={`group rounded-2xl w-40 min-h-24 flex flex-col items-center justify-center p-3 text-center transition-all duration-300 cursor-pointer shadow-[4px_4px_6.9px_4px_rgba(0,0,0,0.10)] hover:shadow-xl ${isActive ? "active-gradient-border" : "bg-white"
                  }`}
              >
                <div className="relative w-10 h-10 mb-2 flex items-center justify-center">
                  <Image
                    src={sub.icon}
                    alt={sub.name}
                    width={40}
                    height={40}
                    className="object-contain max-h-full max-w-full drop-shadow-sm group-hover:scale-125 transition-all duration-300"
                  />
                </div>
                <span className="font-medium text-sm">
                  {sub.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile categories tabs */}
      <div className="flex flex-col lg:hidden w-full gap-4 relative z-30">
        {/* Dropdown for Main Category on Mobile */}
        <div className="relative w-full" ref={mobileDropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative w-full h-13 rounded-[20px] bg-linear-to-r from-[#FF0009] to-[#772571] text-white flex items-center justify-between px-4.5 font-google-sans text-lg shadow-[4px_4px_6.9px_rgba(0,0,0,0.1)] cursor-pointer overflow-hidden z-20"
          >
            <span>{activeMainCategory}</span>
            <ChevronDown
              size={20}
              className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute top-8 left-0 w-full bg-surface rounded-b-[20px] pt-8 pb-5 overflow-hidden space-y-1.5 z-10">
              {mainCategoriesToUse.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleMainCategoryChange(cat.name)}
                  className="flex items-center justify-between w-full text-left px-6 py-0.5 hover:bg-gray-50 text-base font-medium text-black cursor-pointer"
                >
                  <span>{cat.name}</span>
                  <ChevronRight
                    size={16}
                    className="text-primary transition-transform duration-300"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Divider */}
        <div className="border-t w-full border-[#C4C4C4] mx-auto max-w-43" />
        {/* Subcategories Horizontal Tabs */}
        <div className="flex items-center gap-2 w-full">
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .scrollbar-none::-webkit-scrollbar {
              display: none;
            }
          `,
            }}
          />
          <button
            onClick={scrollLeft}
            className={`cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-opacity duration-200 ${showLeftArrow
              ? "block pointer-events-auto"
              : "hidden pointer-events-none"
              }`}
          >
            <ChevronLeftCircle size={24} className="text-[#FF0009]" />
          </button>
          <div
            ref={scrollContainerRef}
            className="flex-1 flex gap-2 overflow-x-auto scroll-smooth scrollbar-none relative px-4 py-1.5"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {subCategories.map((sub) => {
              const isActive = activeSubCategory === sub.name;
              return (
                <button
                  key={sub.name}
                  onClick={() => handleSubCategoryChange(sub.name)}
                  className={`cursor-pointer rounded-3xl text-xs sm:text-sm shrink-0 w-[calc(50%-4px)] text-center py-2 px-1.5 font-medium transition-all duration-300 truncate ${isActive
                    ? "active-gradient-border-surface"
                    : "bg-surface text-black"
                    }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
          <button
            onClick={scrollRight}
            className={`cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-opacity duration-200 ${showRightArrow
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
              }`}
          >
            <ChevronRightCircle size={24} className="text-[#FF0009]" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 mt-0 lg:mt-12 overflow-x-clip space-y-8 z-10">
        {/* Product Accordion Container */}
        <div className="flex flex-col bg-surface rounded-[20px] p-4 lg:p-8 w-full">
          {currentSubCategoryData.products.map((product, idx) => {
            const isOpen = openAccordionIndex === idx;
            return (
              <div
                key={`${product.title}-${idx}`}
                onClick={() => !isOpen && toggleAccordion(idx)}
                className={`flex flex-col lg:flex-row justify-between cursor-pointer select-none group border-b last:border-b-0 gap-4 ${isOpen ? "items-start py-6 lg:py-9" : "py-4.5"}`}
              >
                {/* Accordion Content Panel */}
                <div className="flex flex-col animate-fadeIn gap-1.5 relative">
                  <span className="font-medium text-xl lg:text-3xl text-black font-google-sans group-hover:text-primary transition-colors">
                    {product.title}
                  </span>
                  {isOpen && (
                    <>
                      {/* Left Column: Description & Action */}
                      <p className="text-base lg:text-lg text-black font-normal font-google-sans">
                        {product.description}
                      </p>
                      <Link
                        href={`/products?product=${product.slug || product.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="inline-flex items-center justify-center font-medium min-w-25 mt-1.5 px-6 py-2 rounded-full text-sm bg-linear-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-95 shadow-md hover:shadow-lg transition-all text-center max-w-fit cursor-pointer"
                      >
                        View More
                      </Link>
                    </>
                  )}
                  {/* Cross button for mobiles */}
                  <div
                    onClick={() => toggleAccordion(idx)}
                    className={`absolute top-0 right-0 lg:hidden transition-transform duration-300 ${isOpen ? "rotate-45 text-[#FF0009]" : ""}`}
                  >
                    <Plus size={24} strokeWidth={2} />
                  </div>
                </div>
                {/* Right Column: Styled Image Display */}
                {isOpen && (
                  <div className="flex items-center justify-center relative animate-fadeIn w-full lg:w-106 h-53 rounded-[20px] overflow-hidden">
                    <Image
                      fill
                      priority
                      alt="Product Backdrop"
                      className="object-cover object-center"
                      src={defaultCardBg || "/images/placeholder.png"}
                      unoptimized
                    />
                    {/* <div className="absolute inset-0 bg-black/5" /> */}
                    <div className="relative aspect-video w-36 md:w-40 h-36 md:h-40 drop-shadow-2xl z-10 transition-transform duration-300 hover:scale-105">
                      <Image
                        fill
                        src={product.image}
                        alt={product.title}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
                <div
                  onClick={() => toggleAccordion(idx)}
                  className={`hidden lg:block transition-transform duration-300 ${isOpen ? "rotate-45 text-[#FF0009]" : ""}`}
                >
                  <Plus size={24} strokeWidth={2} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
