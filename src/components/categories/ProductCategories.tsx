"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRightCircle,
  ChevronLeftCircle,
} from "lucide-react";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Heading, Subtitle } from "@/components/ui";

import "swiper/css";
import "swiper/css/navigation";

interface Props {
  category?: string;
  data?: any;
  onCategoryChange?: (categoryObj: any) => void;
}

interface ProductCard {
  title: string;
  slug?: string;
  description: string;
  mobileDesc: string;
  color: string;
  badge: string;
  image: string;
  features: string[];
}

interface CategoryData {
  name: string;
  tagline?: string;
  title: string;
  description: string;
  icon: string;
  products: ProductCard[];
}

const STATIC_CATEGORIES_DATA: CategoryData[] = [
  {
    name: "Waterproof Grade",
    tagline: "Super Premium Adhesives by Jivanjor",
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
        color: "#0083CB",
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
    name: "Speciality Adhesive",
    tagline: "Speciality Adhesives by Jivanjor",
    title: "Speciality Adhesives by Jivanjor",
    description:
      "Explore our range of speciality adhesives designed for upholstery, foam, PVC, acrylic, edge banding, and other professional woodwork applications.",
    icon: "/images/Foambond.png",
    products: [
      {
        title: "Foambond",
        description:
          "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
        mobileDesc:
          "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
        color: "#F57F26",
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
    name: "Regular Adhesive",
    title: "Regular Adhesives by Jivanjor",
    description:
      "Standard grade woodworking adhesives that offer consistent performance, reliability, and value for everyday professional applications.",
    icon: "/images/Champion Super.png",
    products: [
      {
        title: "Champion Super",
        description:
          "Provides a superior bond and strength, while being non-hazardous.",
        mobileDesc:
          "Provides superior bond and strength, while being non-hazardous.",
        color: "#0083CB",
        badge: "Premium Regular",
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
    name: "Regular",
    title: "Waterproof Adhesives by Jivanjor",
    description:
      "Explore where watershield fits across furniture, laminates, plywood, boards and professional woodwork applications.",
    icon: "/images/Watershield.png",
    products: [
      {
        title: "Watershield",
        description: "Provides excellent water-resistance.",
        mobileDesc:
          "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
        color: "#0498AA",
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
        description: "Heatproof and waterproof adhesive.",
        mobileDesc: "Heatproof and waterproof adhesive.",
        color: "#077937",
        badge: "Waterproof Grade",
        image: "/images/Aquabond.png",
        features: [
          "Best-in-Class Coverage",
          "D3 Grade for Water Resistance",
          "Anti-bubble Adhesive",
        ],
      },
      {
        title: "Watershield",
        description: "Provides excellent water-resistance.",
        mobileDesc:
          "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
        color: "#0498AA",
        badge: "Eco Friendly",
        image: "/images/Watershield.png",
        features: [
          "Best-in-Class Coverage",
          "D3 Grade for Water Resistance",
          "Anti-bubble Adhesive",
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
        color: "#F57F26",
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
    name: "ECO",
    title: "Eco-Friendly Adhesives",
    description:
      "Zero-VOC, low odor, and environmentally sustainable adhesive options for modern eco-friendly homes and clean workplace environments.",
    icon: "/images/Watershield.png",
    products: [
      {
        title: "Watershield",
        description: "Provides excellent water-resistance.",
        mobileDesc:
          "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
        color: "#0498AA",
        badge: "Eco Friendly",
        image: "/images/Watershield.png",
        features: [
          "Best-in-Class Coverage",
          "D3 Grade for Water Resistance",
          "Anti-bubble Adhesive",
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
        title: "Aquabond",
        description: "Heatproof and waterproof adhesive.",
        mobileDesc: "Heatproof and waterproof adhesive.",
        color: "#077937",
        badge: "Waterproof Grade",
        image: "/images/Aquabond.png",
        features: [
          "Best-in-Class Coverage",
          "D3 Grade for Water Resistance",
          "Anti-bubble Adhesive",
        ],
      },
    ],
  },
];

export default function ProductCategories({ category, data, onCategoryChange }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Waterproof Grade");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  const prevActiveCategoryRef = useRef(activeCategory);

  const updateArrows = (swiper: SwiperType) => {
    setShowLeftArrow(!swiper.isBeginning);
    setShowRightArrow(!swiper.isEnd);
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleCategorySelect = (catName: string, index?: number) => {
    setActiveCategory(catName);
    prevActiveCategoryRef.current = catName;
    if (swiperRef.current && typeof index === "number") {
      const swiper = swiperRef.current;
      const current = swiper.activeIndex;
      if (index < current || index >= current + 2) {
        swiper.slideTo(index);
      }
    }
    const catMatch = categories.find(
      (c) => c.name === catName || (c.slug && c.slug === catName)
    );
    if (catMatch && onCategoryChange) {
      onCategoryChange(catMatch);
    } else if (onCategoryChange) {
      const staticMatch = categoriesToUse.find((c) => c.name === catName);
      if (staticMatch) {
        onCategoryChange({
          name: staticMatch.name,
          categoryTitle: staticMatch.title,
          description: staticMatch.description,
        });
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        if (categories.length === 0) {
          setLoading(true);
        }
        const [cats, prods] = await Promise.all([
          api.getCategories(),
          api.getProducts(),
        ]);
        if (!isMounted) return;
        setCategories(cats);
        setProducts(prods);

        // Auto-select activeCategory matching parameter category slug
        if (category) {
          const match = cats.find((c) => c.slug === category);
          if (match) {
            if (!match.parent_category) {
              const firstChild = cats.find((c) => c.parent_category === match.id && c.isVisible !== false && !c.hideInMenu);
              if (firstChild) {
                setActiveCategory(firstChild.name);
                if (onCategoryChange) {
                  onCategoryChange(firstChild);
                }
              } else {
                setActiveCategory(match.name);
                if (onCategoryChange) {
                  onCategoryChange(match);
                }
              }
            } else {
              setActiveCategory(match.name);
              if (onCategoryChange) {
                onCategoryChange(match);
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load category/product data, falling back to static content:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync activeCategory when category slug prop changes from URL navigation without re-fetching
  useEffect(() => {
    if (category && categories.length > 0) {
      const match = categories.find((c) => c.slug === category);
      if (match) {
        const targetName = !match.parent_category
          ? (categories.find((c) => c.parent_category === match.id && c.isVisible !== false && !c.hideInMenu)?.name || match.name)
          : match.name;
        if (targetName && targetName !== activeCategory) {
          setActiveCategory(targetName);
        }
      }
    }
  }, [category, categories, activeCategory]);

  // Find subcategory matching the slug, find parent and its siblings
  const matchedCategory = categories.find((c) => c.slug === category);
  const isParent = matchedCategory && !matchedCategory.parent_category;
  const parentId = isParent
    ? matchedCategory.id
    : (matchedCategory?.parent_category || null);

  const siblingSubcategories = (parentId
    ? categories.filter((c) => c.parent_category === parentId)
    : categories.filter((c) => c.parent_category)
  ).filter((c) => c.isVisible !== false && !c.hideInMenu)
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const categoriesData = categories.length > 0 && (matchedCategory || siblingSubcategories.length > 0)
    ? siblingSubcategories.map((sub) => {
      const subProducts = products.filter((p) => {
        if (p.isVisible === false) return false;
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
        tagline: sub.tagline || "",
        title: sub.name || "Adhesives by Jivanjor",
        description: sub.description || `Explore our high quality ${sub.name} solutions.`,
        icon: subProducts[0]?.image || "/images/Watershield.png",
        products: subProducts.map((p) => {
          let featuresList = ["Best-in-Class Coverage", "Superior Bond Strength", "High Performance"];
          if (p?.overviewBullets && p.overviewBullets.length > 0) {
            featuresList = p?.overviewBullets;
          } else if (p?.metadata) {
            const cleaned = p.metadata.split(",").map((f: string) => f.trim()).filter(Boolean);
            if (cleaned.length > 0) {
              featuresList = cleaned;
            }
          }
          return {
            title: p.name,
            slug: p.slug,
            description: p.shortDescription || p.description,
            mobileDesc: p.shortDescription || p.description,
            color: p.themeColor ?? "#0498AA",
            badge: sub.name,
            image: p.image || "/images/Watershield.png",
            features: featuresList,
          };
        }),
      };
    })
    : [];

  const categoriesToUse = categoriesData.length > 0 ? categoriesData : STATIC_CATEGORIES_DATA;

  useEffect(() => {
    if (prevActiveCategoryRef.current !== activeCategory) {
      prevActiveCategoryRef.current = activeCategory;
      if (swiperRef.current) {
        const activeIndex = categoriesToUse.findIndex(
          (c) => c.name === activeCategory
        );
        if (activeIndex !== -1) {
          const swiper = swiperRef.current;
          const current = swiper.activeIndex;
          if (activeIndex < current || activeIndex >= current + 2) {
            swiper.slideTo(activeIndex);
          }
        }
      }
    }
  }, [activeCategory, categoriesToUse]);

  const currentCategoryData =
    categoriesToUse.find((c) => c.name === activeCategory) ||
    categoriesToUse[0] || {
      name: "",
      tagline: "",
      title: "",
      description: "",
      icon: "",
      products: [],
    };

  return (
    <section className="flex flex-col lg:flex-row justify-between max-w-360 mx-auto my-4 sm:my-6 lg:my-12 xd:my-18 px-5 lg:px-8 hd:px-12 3xl:px-8 gap-12 z-100">
      {/* Sidebar Categories Panel */}
      <div className="hidden lg:block space-y-6 lg:w-[320px] shrink-0 sticky top-28 self-start">
        <h2 className="text-2xl">Categories</h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl w-40 min-h-24 flex flex-col items-center justify-center p-3 text-center bg-white shadow-[4px_4px_6.9px_4px_rgba(0,0,0,0.06)] border border-neutral-100/60 animate-pulse"
              >
                <div className="w-10 h-10 mb-2 rounded-full bg-neutral-200/80" />
                <div className="h-3.5 w-20 rounded bg-neutral-200/80" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
            {categoriesToUse.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`group rounded-2xl w-40 min-h-24 flex flex-col items-center justify-center p-3 text-center transition-all duration-300 cursor-pointer shadow-[4px_4px_6.9px_4px_rgba(0,0,0,0.10)] hover:shadow-xl ${isActive ? "active-gradient-border" : "bg-white"
                    }`}
                >
                  <div className="relative w-10 h-10 mb-2 flex items-center justify-center">
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      width={40}
                      height={40}
                      className="object-contain max-h-full max-w-full drop-shadow-sm group-hover:scale-125 transition-all duration-300"
                    />
                  </div>
                  <span className="font-medium text-sm leading-normal">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile categories tabs */}
      {loading ? (
        <div className="flex lg:hidden items-center justify-between w-full gap-2 py-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex-1 h-9 rounded-3xl bg-neutral-200/80 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex lg:hidden items-center justify-between w-full gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous categories"
            className={`flex items-center justify-center w-6 h-6 cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-all duration-200 ${showLeftArrow
              ? "block pointer-events-auto"
              : "hidden pointer-events-none invisible"
              }`}
          >
            <ChevronLeftCircle size={16} className="text-[#FF0009]" />
          </button>
          <div className="flex-1 min-w-0 overflow-hidden">
            <Swiper
              modules={[Navigation]}
              slidesPerView={2}
              spaceBetween={6}
              watchOverflow={true}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                updateArrows(swiper);
              }}
              onSlideChange={updateArrows}
              onReachBeginning={updateArrows}
              onReachEnd={updateArrows}
              onToEdge={updateArrows}
              onFromEdge={updateArrows}
              className="w-full"
            >
              {categoriesToUse.map((cat, idx) => {
                const isActive = activeCategory === cat.name;
                return (
                  <SwiperSlide key={cat.name} className="h-auto flex">
                    <button
                      onClick={() => handleCategorySelect(cat.name, idx)}
                      className={`${isActive
                        ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white"
                        : "bg-surface text-black"
                        } w-full cursor-pointer font-medium px-2.5 py-2 rounded-3xl text-[10px] sm:text-sm text-nowrap text-center flex items-center justify-center transition-all leading-tight`}
                    >
                      {cat.name}
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <button
            onClick={handleNext}
            aria-label="Next categories"
            className={`flex items-center justify-center w-6 h-6 cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-all duration-200 ${showRightArrow
              ? "block pointer-events-auto"
              : "hidden pointer-events-none invisible"
              }`}
          >
            <ChevronRightCircle size={16} className="text-[#FF0009]" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0 overflow-x-clip z-10">
        {/* Category Heading & Description */}
        {loading ? (
          <div className="space-y-4 text-center md:text-start max-w-250 animate-pulse">
            <div className="h-8 md:h-10 w-3/4 max-w-md bg-neutral-200/80 rounded-lg mx-auto md:mx-0" />
            <div className="space-y-2 pt-1">
              <div className="h-4 w-full max-w-xl bg-neutral-200/70 rounded mx-auto md:mx-0" />
              <div className="h-4 w-4/5 max-w-lg bg-neutral-200/70 rounded mx-auto md:mx-0" />
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center md:text-start max-w-250">
            <Heading>
              {currentCategoryData.tagline || currentCategoryData.title}
            </Heading>
            <Subtitle>
              {currentCategoryData.description}
            </Subtitle>
          </div>
        )}

        {/* Product Cards Swiper / Grid Area */}
        {loading ? (
          <div className="relative px-12 overflow-visible">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {[...Array(2)].map((_, idx) => (
                <div
                  key={idx}
                  className={`relative pt-21 xl:pt-12 mx-auto lg:mx-0 w-full flex justify-center lg:justify-start ${idx > 0 ? "hidden sm:flex" : "flex"
                    }`}
                >
                  <div className="rounded-3xl px-10 py-6 bg-linear-to-br from-neutral-200/70 to-neutral-300/70 flex flex-col gap-4 w-full max-w-68 xl:max-w-108 min-h-78 xl:min-h-64 shadow-md border border-neutral-200/50 animate-pulse mx-auto lg:mx-0">
                    <div className="flex flex-col relative xl:flex-row gap-2 items-center xl:items-start">
                      {/* Floating Image Skeleton */}
                      <div className="absolute top-0 left-1/2 xl:left-1/5 -translate-x-1/2 -translate-y-1/2 xl:translate-y-[-36%] aspect-44/51 xl:aspect-69/80 w-40 h-48 xl:w-44 xl:h-52 rounded-2xl bg-neutral-300/80 z-10 shadow-sm" />
                      {/* Content Skeleton */}
                      <div className="flex flex-1 flex-col text-center xl:text-start xl:ml-auto max-w-54 w-full gap-2 pt-30 xl:pt-0 xl:pl-20 xd:pl-18! hd:pl-12! 2xl:pl-10!">
                        <div className="h-6 w-32 bg-white/50 rounded mx-auto xl:mx-0" />
                        <div className="w-full h-px bg-white/30 my-1" />
                        <div className="space-y-1.5 hidden xl:block">
                          <div className="h-3.5 w-full bg-white/40 rounded" />
                          <div className="h-3.5 w-4/5 bg-white/40 rounded" />
                        </div>
                        <div className="h-3.5 w-36 bg-white/40 rounded xl:hidden mx-auto" />
                      </div>
                    </div>
                    {/* Bullet Points Skeleton */}
                    <div className="hidden absolute bottom-6 xl:block space-y-2">
                      {[...Array(3)].map((_, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-white/50 shrink-0" />
                          <div className="h-3.5 w-32 bg-white/40 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : currentCategoryData.products.length > 0 ? (
          <div className="relative px-12 overflow-visible">
            <Swiper
              modules={[Navigation]}
              watchOverflow={false}
              loop={false}
              observer={true}
              observeParents={true}
              // centerInsufficientSlides={true}
              spaceBetween={16}
              slidesPerView={1}
              navigation={{
                prevEl: ".cat-swiper-prev",
                nextEl: ".cat-swiper-next",
                disabledClass: "swiper-button-disabled",
              }}
              breakpoints={{
                480: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 2,
                },
                860: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 2,
                },
              }}
              className="overflow-visible"
            >
              {currentCategoryData.products.map((card, idx) => (
                <SwiperSlide
                  key={`${card.title}-${idx}`}
                  className="overflow-visible! pt-2 md:pt-4"
                >
                  {/* Responsive Design: Floating 3D card layout */}
                  <div className="relative pt-21 xl:pt-12 mx-auto lg:mx-0">
                    {/* Card Main Body */}
                    <Link
                      href={`/products?product=${card.slug || card.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="group rounded-3xl px-10 py-6 text-white flex flex-col gap-4 transition-transform duration-300 ease-in-out w-full max-w-69 xl:max-w-108 min-h-68 xl:min-h-64"
                      style={{ backgroundColor: `${card.color}` }}
                    >
                      {/* Top Row: Floating image & Text info side-by-side */}
                      <div className="flex flex-col relative xl:flex-row gap-2 items-center xl:items-start">
                        {/* Floating image wrapper */}
                        <div className="absolute top-0 left-1/2 xl:left-1/5 -translate-x-1/2 -translate-y-1/2 xl:translate-y-[-36%] aspect-44/51 xl:aspect-69/80 w-49 h-56 xl:w-46 xl:h-54 object-contain z-100">
                          <Image
                            src={card.image}
                            alt={card.title}
                            fill
                            className="object-contain z-10 group-hover:scale-95 transition-all duration-300"
                            priority
                          />
                        </div>
                        {/* Header content */}
                        <div className="flex flex-1 flex-col text-center xl:text-start xl:ml-auto max-w-54 w-full gap-2 pt-30 xl:pt-0 xl:pl-20 xd:pl-18! hd:pl-12! 2xl:pl-10!">
                          <h3 className="text-xl xl:text-2xl font-bold leading-normal">
                            {card.title}
                          </h3>
                          {/* Custom White Divider */}
                          <div className="w-full h-px bg-white mx-auto xl:mr-0 xl:ml-auto my-1 opacity-90" />
                          <p className="hidden xl:block text-sm leading-normal font-normal">
                            {card.description}
                          </p>
                          <p className="xl:hidden text-center text-base leading-[100%] font-normal">
                            {card.mobileDesc}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Row: Feature Bullet points */}
                      <div className="hidden absolute bottom-6 xl:block space-y-1">
                        {card.features.map((feature: any, fIdx) => {
                          const text = typeof feature === "string" ? feature : (feature?.text || "");
                          const iconName = typeof feature === "string"
                            ? `image ${18 + (fIdx % 3)}.svg`
                            : (feature?.icon || `image ${18 + (fIdx % 3)}.svg`);

                          return (
                            <div key={fIdx} className="flex items-center gap-3">
                              {/* Premium SVG Custom Icons */}
                              <div className="flex items-center justify-center shrink-0 text-white">
                                <Image
                                  src={`/icons/${iconName}`}
                                  className="aspect-square object-contain"
                                  alt={text}
                                  width={16}
                                  height={16}
                                />
                              </div>
                              <span className="capitalize font-extralight text-sm sm:text-base opacity-95 tracking-wide leading-normal">
                                {text}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Absolute Red Arrow Navigation Controls */}
            <button className="cat-swiper-prev absolute left-0 top-[60%] -translate-y-1/2 z-10 text-primary cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft size={48} strokeWidth={2.5} />
            </button>
            <button className="cat-swiper-next absolute right-0 top-[60%] -translate-y-1/2 z-10 text-primary cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight size={48} strokeWidth={2.5} />
            </button>
          </div>
        ) : (
          <div className="py-12 px-6 text-center text-muted-foreground bg-surface/50 rounded-2xl">
            No products found in this category.
          </div>
        )}

        {/* Lower Research & Development Section */}
        <div className="space-y-4 pt-4 text-center md:text-start">
          <Heading>
            {data?.title || "Superior Quality Backed by Research"}
          </Heading>
          <Subtitle className="max-w-3xl">
            {data?.desc || data?.description || "Learn how our focus on product development, quality standards and market reach supports India’s woodworking needs."}
          </Subtitle>
          <Link
            href={data?.ctaLink || data?.buttonLink || data?.actionButtons?.primary?.actionPath || "/about/research-and-innovation"}
            className="inline-flex items-center justify-center font-medium min-w-35 px-6 py-2.5 rounded-full text-sm bg-linear-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-95 shadow-md hover:shadow-lg transition-all text-center"
          >
            {data?.ctaText || data?.buttonText || data?.actionButtons?.primary?.text || "Inside Our Labs"}
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="hidden md:block col-span-1">
              <Image
                src={data?.image1 || data?.images?.[0] || data?.media?.[0] || "/images/Rectangle 110.png"}
                className="object-cover w-full h-full max-h-51 md:max-h-70 rounded-2xl bg-surface"
                alt={data?.title || "Research Laboratory"}
                width={400}
                height={260}
              />
            </div>
            <div className="col-span-2">
              <Image
                src={data?.image2 || data?.images?.[1] || data?.media?.[1] || "/images/Rectangle 111.png"}
                className="object-cover w-full h-full max-h-51 md:max-h-70 rounded-2xl bg-surface"
                alt={data?.title || "Adhesive Testing Laboratory"}
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
