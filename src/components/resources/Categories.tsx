"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  ChevronRightCircle,
  ChevronLeftCircle,
  ChevronDown,
  Plus,
} from "lucide-react";

interface ProductCard {
  title: string;
  description: string;
  mobileDesc: string;
  color: string;
  badge: string;
  image: string;
  features: string[];
}

interface SubCategoryData {
  name: string;
  title: string;
  description: string;
  icon: string;
  products: ProductCard[];
}

interface MainCategoryData {
  name: string;
  subCategories: SubCategoryData[];
}

const MAIN_CATEGORIES_DATA: MainCategoryData[] = [
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
            title: "Watershield - Technical Data Sheet",
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
            title: "Aquabond - Technical Data Sheet",
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
            title: "Aquaprotekt - Technical Data Sheet",
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
        title: "Super Premium Adhesives by Jivanjor - Technical Data Sheet",
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
            title: "Termilok - Technical Data Sheet",
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
            title: "Foambond - Technical Data Sheet",
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
            title: "Foambond Specialty - Technical Data Sheet",
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
            title: "Champion Regular - Technical Data Sheet",
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
            title: "Hero - Technical Data Sheet",
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
            title: "Tile Fix - Technical Data Sheet",
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
            title: "Premium Grout - Technical Data Sheet",
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
            title: "Kwik Waterproof - Technical Data Sheet",
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
            title: "Pipe Lock - Technical Data Sheet",
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
            title: "Kwik Spray - Technical Data Sheet",
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

export default function Categories() {
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentMainCategoryData =
    MAIN_CATEGORIES_DATA.find((c) => c.name === activeMainCategory) ||
    MAIN_CATEGORIES_DATA[0];

  const subCategories = currentMainCategoryData.subCategories;

  const currentSubCategoryData =
    subCategories.find((s) => s.name === activeSubCategory) || subCategories[0];

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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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

  const handleMainCategoryChange = (name: string) => {
    setActiveMainCategory(name);
    const categoryData =
      MAIN_CATEGORIES_DATA.find((c) => c.name === name) ||
      MAIN_CATEGORIES_DATA[0];
    const firstSubName = categoryData.subCategories[0]?.name || "";
    setActiveSubCategory(firstSubName);
    setOpenAccordionIndex(0);
    setDropdownOpen(false);
  };

  const handleSubCategoryChange = (name: string) => {
    setActiveSubCategory(name);
    setOpenAccordionIndex(0);
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
        <div className="relative" ref={dropdownRef}>
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
            <div className="absolute top-4 left-0 w-82 max-w-full bg-surface rounded-b-[20px] pt-12 pb-5 overflow-hidden z-10">
              {MAIN_CATEGORIES_DATA.map((cat) => (
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
                className={`rounded-2xl p-1 w-40 min-h-24 ${
                  isActive
                    ? "bg-linear-to-br from-[#FF0009] to-[#772571]"
                    : "bg-white"
                }`}
                style={{
                  boxShadow: `4px 4px 6.9px 4px rgba(0, 0, 0, 0.10)`,
                }}
              >
                <div className="flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 cursor-pointer text-center bg-white">
                  <div className="relative w-10 h-10 mb-2 flex items-center justify-center">
                    <Image
                      src={sub.icon}
                      alt={sub.name}
                      width={40}
                      height={40}
                      className="object-contain max-h-full max-w-full drop-shadow-sm"
                    />
                  </div>
                  <span className="font-medium text-sm leading-normal whitespace-nowrap">
                    {sub.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile categories tabs */}
      <div className="flex flex-col lg:hidden w-full gap-4 relative z-30">
        {/* Dropdown for Main Category on Mobile */}
        <div className="relative w-full" ref={dropdownRef}>
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
            <div className="absolute top-8 left-0 w-full bg-surface rounded-b-[20px] pt-6 pb-5 overflow-hidden z-10">
              {MAIN_CATEGORIES_DATA.map((cat) => (
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
            className={`cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-opacity duration-200 ${
              showLeftArrow
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
                  className={`${
                    isActive
                      ? "bg-linear-to-br from-[#FF0009] to-[#772571]"
                      : "bg-surface text-black"
                  } p-1 cursor-pointer rounded-3xl text-xs sm:text-sm shrink-0 w-[calc(50%-4px)]`}
                >
                  {/* <div className="flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 cursor-pointer text-center bg-white"> */}
                  <span className="flex flex-col items-center justify-center rounded-full transition-all duration-300 cursor-pointer font-medium text-center bg-surface truncate py-1.5">
                    {sub.name}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={scrollRight}
            className={`cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-opacity duration-200 ${
              showRightArrow
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
                  <span className="font-medium text-xl lg:text-3xl text-black font-google-sans group-hover:text-primary transition-colors max-w-60 lg:max-w-lg">
                    {product.title}
                  </span>
                  {isOpen && (
                    <div className="space-y-6 max-w-xs lg:max-w-md">
                      {/* Left Column: Description & Action */}
                      <p className="text-base lg:text-lg text-black font-normal font-google-sans leading-[120%]">
                        {product.description}
                      </p>
                      <div className="space-y-2">
                        <span className="font-medium text-base md:text-lg">
                          PDF | 1.2 MB
                        </span>
                        <Link
                          href="/products"
                          className="flex items-center justify-center font-medium min-w-25 mt-1.5 px-6 py-2 rounded-full text-sm bg-linear-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-95 shadow-md hover:shadow-lg transition-all text-center max-w-fit cursor-pointer"
                        >
                          Download
                        </Link>
                      </div>
                    </div>
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
                  <div className="flex items-center justify-end lg:justify-center relative animate-fadeIn -mt-22 lg:mt-0 w-full lg:w-106 overflow-hidden">
                    {/* <div className="absolute inset-0 bg-black/5" /> */}
                    <div className="relative mb-4 mr-4 lg:mr-0 w-50 h-58 z-10 transition-transform duration-300">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div
                      className={`${product.color} absolute bottom-0 rounded-[20px] min-h-32 w-full`}
                    >
                      <Image
                        src="/images/watermark pro.svg"
                        alt={product.title}
                        fill
                        className="object-contain rounded-[20px] scale-x-105"
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
