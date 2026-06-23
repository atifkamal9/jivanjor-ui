"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
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
            title: "Watershield",
            description: "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
            mobileDesc: "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
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
            description: "Heatproof and waterproof adhesive. Aquabond kitchen ka specialist hai.",
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
            description: "Provides excellent water protection and moisture resistance for premium woodwork.",
            mobileDesc: "Provides excellent water protection and moisture resistance.",
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
            description: "Provides a superior bond and strength, while being non-hazardous.",
            mobileDesc: "Provides superior bond and strength, while being non-hazardous.",
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
            description: "Protects wood from termites, moisture damage, and fungal decay, ensuring lifelong durability.",
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
            description: "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
            mobileDesc: "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
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
            description: "Speciality adhesive for upholstery, foam, PVC, acrylic, and edge banding.",
            mobileDesc: "Speciality adhesive for upholstery, foam, PVC, acrylic, and edge banding.",
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
            description: "Standard grade woodworking adhesive offering consistent performance and value.",
            mobileDesc: "Standard grade woodworking adhesive offering consistent performance.",
            color: "bg-[#0083CB]",
            badge: "Regular",
            image: "/images/Champion Super.png",
            features: [
              "Standard Coverage",
              "Reliable Bond",
              "Value for Money",
            ],
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
            description: "Zero-VOC, low odor, and environmentally sustainable adhesive options.",
            mobileDesc: "Zero-VOC, low odor, and environmentally sustainable adhesive.",
            color: "bg-[#0498AA]",
            badge: "Eco Friendly",
            image: "/images/Watershield.png",
            features: [
              "Zero-VOC",
              "Eco Friendly",
              "Low Odor",
            ],
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
        description: "High-strength tile adhesives for ceramic, vitrified tiles and stone cladding.",
        icon: "/images/Champion Super.png",
        products: [
          {
            title: "Tile Fix",
            description: "High performance adhesive for fixing tiles on walls and floors.",
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
        description: "Durable and color-fast tile grouts to seal joints and prevent leaks.",
        icon: "/images/Foambond.png",
        products: [
          {
            title: "Premium Grout",
            description: "Water-resistant cementitious grout for tile joint filling.",
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
        description: "Liquid waterproofing membranes for roofs, balconies, and wet areas.",
        icon: "/images/Watershield.png",
        products: [
          {
            title: "Kwik Waterproof",
            description: "Advanced waterproofing liquid compound for roofs and basements.",
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
        description: "Anaerobic sealants for secure metal and plastic pipe joints.",
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
        description: "Multi-purpose maintenance sprays to lubricate and prevent rust.",
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

export default function ProductCategories() {
  const [activeMainCategory, setActiveMainCategory] = useState("Woodworking Adhesives");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeSubCategory, setActiveSubCategory] = useState("Waterproof Grade");
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(0);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentMainCategoryData =
    MAIN_CATEGORIES_DATA.find((c) => c.name === activeMainCategory) ||
    MAIN_CATEGORIES_DATA[0];

  const subCategories = currentMainCategoryData.subCategories;

  const currentSubCategoryData =
    subCategories.find((s) => s.name === activeSubCategory) ||
    subCategories[0];

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    const categoryData = MAIN_CATEGORIES_DATA.find((c) => c.name === name) || MAIN_CATEGORIES_DATA[0];
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

  return (
    <section className="flex flex-col lg:flex-row justify-between max-w-360 mx-auto my-4 sm:my-6 lg:my-18 px-5 lg:px-8 gap-12 z-100">
      {/* Sidebar Categories Panel */}
      <div className="hidden lg:block space-y-6 lg:w-[320px] shrink-0 sticky top-28 self-start">
        <h2 className="text-2xl font-bold">Categories</h2>

        {/* Dropdown Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative h-[52px] w-[329px] max-w-full rounded-[21px] bg-gradient-to-r from-[#FF0009] to-[#772571] text-white flex items-center justify-between px-6 font-google-sans text-[18px] font-medium shadow-[4px_4px_6.9px_rgba(0,0,0,0.1)] hover:opacity-95 transition-all cursor-pointer"
          >
            <span>{activeMainCategory}</span>
            <ChevronDown size={20} className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-[60px] left-0 w-[329px] max-w-full bg-white rounded-[21px] shadow-[4px_4px_15px_rgba(0,0,0,0.15)] border border-gray-100 py-3 overflow-hidden z-50">
              {MAIN_CATEGORIES_DATA.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleMainCategoryChange(cat.name)}
                  className="w-full text-left px-6 py-2.5 hover:bg-gray-50 text-[16px] font-medium text-black transition-colors cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Subcategories grid */}
        <div className="grid grid-cols-2 gap-4">
          {subCategories.map((sub) => {
            const isActive = activeSubCategory === sub.name;
            return (
              <button
                key={sub.name}
                onClick={() => handleSubCategoryChange(sub.name)}
                className={`rounded-[21px] p-0.5 w-[155px] h-[90px] shadow-[4px_4px_6.9px_rgba(0,0,0,0.1)] transition-all cursor-pointer relative bg-white border-3 ${
                  isActive ? "border-[#FF0009]" : "border-transparent hover:border-gray-200"
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full p-2 text-center rounded-[19px] bg-white">
                  <div className="relative w-8 h-8 mb-1 flex items-center justify-center">
                    <Image
                      src={sub.icon}
                      alt={sub.name}
                      width={32}
                      height={32}
                      className="object-contain max-h-full max-w-full drop-shadow-sm"
                    />
                  </div>
                  <span className="font-medium text-xs leading-tight font-google-sans text-black">
                    {sub.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile categories tabs */}
      <div className="flex flex-col lg:hidden w-full gap-4">
        {/* Dropdown for Main Category on Mobile */}
        <div className="relative w-full" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full h-[52px] rounded-[21px] bg-gradient-to-r from-[#FF0009] to-[#772571] text-white flex items-center justify-between px-6 font-google-sans text-[18px] font-medium shadow-[4px_4px_6.9px_rgba(0,0,0,0.1)] cursor-pointer"
          >
            <span>{activeMainCategory}</span>
            <ChevronDown size={20} className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-[60px] left-0 w-full bg-white rounded-[21px] shadow-[4px_4px_15px_rgba(0,0,0,0.15)] border border-gray-100 py-3 overflow-hidden z-50">
              {MAIN_CATEGORIES_DATA.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleMainCategoryChange(cat.name)}
                  className="w-full text-left px-6 py-2.5 hover:bg-gray-50 text-[16px] font-medium text-black cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

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
            className="flex-1 flex gap-2 overflow-x-auto scroll-smooth scrollbar-none relative px-4 py-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {subCategories.map((sub) => {
              const isActive = activeSubCategory === sub.name;
              return (
                <button
                  key={sub.name}
                  onClick={() => handleSubCategoryChange(sub.name)}
                  className={`${
                    isActive ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white" : "bg-surface text-black"
                  } cursor-pointer font-medium p-2 rounded-3xl text-xs sm:text-sm shrink-0 w-[calc(50%-4px)] text-center truncate`}
                >
                  {sub.name}
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
      <div className="flex-1 space-y-8 min-w-0 overflow-x-clip z-10">
        {/* Category Heading & Description */}
        <div className="space-y-5 text-center md:text-start max-w-250">
          <h1 className="font-amethysta text-[34px] sm:text-5xl leading-normal text-black">
            {currentSubCategoryData.title}
          </h1>
          <p className="text-lg sm:text-2xl leading-normal font-normal text-black/80">
            {currentSubCategoryData.description}
          </p>
        </div>

        {/* Product Accordion Container */}
        <div className="bg-[#f5f5f5] rounded-[21px] p-6 lg:p-[40px] w-full min-h-[464px] flex flex-col shadow-inner">
          {currentSubCategoryData.products.map((product, idx) => {
            const isOpen = openAccordionIndex === idx;
            return (
              <div
                key={`${product.title}-${idx}`}
                className="border-b border-[#D9D9D9] last:border-b-0 flex flex-col"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleAccordion(idx)}
                  className="flex items-center justify-between py-6 cursor-pointer select-none group"
                >
                  <span className="text-[24px] lg:text-[28px] font-bold text-black font-google-sans group-hover:text-primary transition-colors">
                    {product.title}
                  </span>
                  <div className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    <Plus size={24} className="text-[#FF0009]" />
                  </div>
                </div>

                {/* Accordion Content Panel */}
                {isOpen && (
                  <div className="flex flex-col lg:flex-row justify-between items-center gap-8 pb-8 animate-fadeIn">
                    {/* Left Column: Description & Action */}
                    <div className="flex-1 flex flex-col justify-between items-start gap-6 text-left">
                      <p className="text-[16px] lg:text-[18px] text-black font-normal font-google-sans leading-relaxed">
                        {product.description}
                      </p>
                      <Link
                        href="/products"
                        className="inline-flex items-center justify-center font-medium px-6 py-2.5 rounded-full text-sm bg-linear-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-95 shadow-md hover:shadow-lg transition-all text-center max-w-fit cursor-pointer"
                      >
                        View More
                      </Link>
                    </div>

                    {/* Right Column: Styled Image Display */}
                    <div className="relative w-full lg:w-[425px] h-[213px] rounded-[21px] overflow-hidden shadow-md shrink-0 bg-white border border-gray-150 flex items-center justify-center">
                      <Image
                        src="/images/Rectangle 34.png"
                        alt="Product Backdrop"
                        fill
                        className="object-cover opacity-60"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/5" />
                      
                      <div className="relative w-36 h-36 drop-shadow-2xl z-10 transition-transform duration-300 hover:scale-105">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lower Research & Development Section */}
        <div className="space-y-4 pt-4 text-center md:text-start">
          <h1 className="font-amethysta text-[34px] md:text-5xl leading-normal text-black">
            Superior Quality Backed by Research
          </h1>
          <p className="text-lg md:text-2xl leading-normal max-w-3xl text-black/80">
            Learn how our focus on product development, quality standards and
            market reach supports India’s woodworking needs.
          </p>
          <Link
            href="#"
            className="inline-flex items-center justify-center font-medium min-w-35 px-6 py-2.5 rounded-full text-sm bg-linear-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-95 shadow-md hover:shadow-lg transition-all text-center"
          >
            Inside Our Labs
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="hidden md:block col-span-1">
              <Image
                src="/images/Rectangle 110.png"
                className="object-cover w-full h-full rounded-2xl bg-surface"
                alt="Research Laboratory"
                width={400}
                height={260}
              />
            </div>
            <div className="col-span-2">
              <Image
                src="/images/Rectangle 111.png"
                className="object-cover w-full h-full rounded-2xl bg-surface"
                alt="Adhesive Testing Laboratory"
                width={800}
                height={260}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
