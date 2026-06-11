"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ChevronRightCircle,
  ThumbsUp,
} from "lucide-react";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

interface ProductCard {
  title: string;
  description: string;
  color: string;
  badge: string;
  image: string;
  features: string[];
}

interface CategoryData {
  name: string;
  title: string;
  description: string;
  icon: string;
  products: ProductCard[];
}

const CATEGORIES_DATA: CategoryData[] = [
  {
    name: "Super Premium Adhesive",
    title: "Super Premium Adhesives by Jivanjor",
    description:
      "Explore where Supremo fits across furniture, laminates, plywood, boards and professional woodwork applications. Learn how our super premium adhesives provide unmatched bonding strength.",
    icon: "/images/Champion Super.png",
    products: [
      {
        title: "Champion Super",
        description:
          "Provides a superior bond and strength, while being non-hazardous.",
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
    name: "Speciality Adhesive",
    title: "Speciality Adhesives by Jivanjor",
    description:
      "Explore our range of speciality adhesives designed for upholstery, foam, PVC, acrylic, edge banding, and other professional woodwork applications.",
    icon: "/images/Foambond.png",
    products: [
      {
        title: "Foambond",
        description:
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
        color: "bg-[#0083CB]",
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
    name: "Water Proof Grade Adhesive",
    title: "Waterproof Adhesives by Jivanjor",
    description:
      "Explore where Supremo fits across furniture, laminates, plywood, boards and professional woodwork applications. Explore where Supremo fits across furniture, laminates, plywood, boards and professional woodwork applications. Explore where Supremo fits across furniture, laminates, plywood, boards and professional woodwork applications.",
    icon: "/images/Watershield.png",
    products: [
      {
        title: "Watershield",
        description: "Provides excellent water-resistance.",
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
        description: "Heatproof and waterproof adhesive.",
        color: "bg-[#077937]",
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
    name: "ECO",
    title: "Eco-Friendly Adhesives",
    description:
      "Zero-VOC, low odor, and environmentally sustainable adhesive options for modern eco-friendly homes and clean workplace environments.",
    icon: "/images/Watershield.png",
    products: [
      {
        title: "Watershield",
        description: "Provides excellent water-resistance.",
        color: "bg-[#0498AA]",
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
        color: "bg-[#077937]",
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

export default function ProductCategories() {
  const [activeCategory, setActiveCategory] = useState(
    "Water Proof Grade Adhesive",
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleNextCategory = () => {
    const currentIndex = CATEGORIES_DATA.findIndex(
      (c) => c.name === activeCategory,
    );
    const nextIndex = (currentIndex + 1) % CATEGORIES_DATA.length;
    setActiveCategory(CATEGORIES_DATA[nextIndex].name);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeIndex = CATEGORIES_DATA.findIndex(
        (c) => c.name === activeCategory,
      );
      const activeElement = scrollContainerRef.current.children[
        activeIndex
      ] as HTMLElement;

      if (activeElement) {
        scrollContainerRef.current.scrollTo({
          left:
            activeElement.offsetLeft - scrollContainerRef.current.offsetLeft,
          behavior: "smooth",
        });
      }
    }
  }, [activeCategory]);

  const currentCategoryData =
    CATEGORIES_DATA.find((c) => c.name === activeCategory) ||
    CATEGORIES_DATA[3];

  return (
    <section className="flex flex-col lg:flex-row justify-between max-w-7xl mx-auto my-4 sm:my-6 lg:my-18 px-6 lg:px-8 gap-12 overflow-hidden z-10">
      {/* Sidebar Categories Panel */}
      <div className="hidden lg:block space-y-6 lg:w-[320px] shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
          {CATEGORIES_DATA.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 cursor-pointer text-center ${
                  isActive
                    ? "border-2 border-primary scale-[1.03] shadow-md"
                    : "bg-white shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
                }`}
              >
                <div className="relative w-12 h-14 mb-2 flex items-center justify-center">
                  <Image
                    src={cat.icon}
                    alt={cat.name}
                    width={40}
                    height={48}
                    className="object-contain max-h-full max-w-full drop-shadow-sm"
                  />
                </div>
                <span className="font-semibold text-sm">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Mobile categories tabs */}
      <div className="flex lg:hidden items-center gap-3 my-4 w-full">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .scrollbar-none::-webkit-scrollbar {
            display: none;
          }
        `,
          }}
        />
        <div
          ref={scrollContainerRef}
          className="flex-1 flex gap-3 overflow-x-auto scroll-smooth scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES_DATA.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`${isActive ? "bg-linear-to-tr from-[#FF0009] to-[#772571] text-white" : "bg-surface"} cursor-pointer font-medium px-2 py-2 rounded-3xl text-xs sm:text-sm shrink-0 w-[calc(50%-6px)] text-center truncate`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
        <button
          onClick={handleNextCategory}
          className="cursor-pointer focus:outline-none hover:scale-105 active:scale-95 transition-all shrink-0"
        >
          <ChevronRightCircle size={24} className="text-[#FF0009]" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        {/* Category Heading & Description */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl sm:text-5xl tracking-tight leading-tight">
            {currentCategoryData.title}
          </h1>
          <p className="text-lg sm:text-xl leading-relaxed font-light">
            {currentCategoryData.description}
          </p>
        </div>

        {/* Swiper Slider Wrapper with Absolute Navigation Arrows */}
        <div className="relative px-12 overflow-visible">
          <Swiper
            modules={[Navigation]}
            watchOverflow={false}
            loop={false}
            spaceBetween={24}
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
              1024: {
                slidesPerView: Math.min(2, currentCategoryData.products.length),
              },
            }}
            className="overflow-visible!"
          >
            {currentCategoryData.products.map((card, idx) => (
              <SwiperSlide
                key={`${card.title}-${idx}`}
                className="overflow-visible! py-1"
              >
                {/* Responsive Design: Floating 3D card layout */}
                <div className="relative pt-16 w-full max-w-60 md:max-w-105 mx-auto lg:mx-0">
                  {/* Card Main Body */}
                  <Link
                    href={`/products`}
                    className={`${card.color} rounded-3xl p-6 lg:p-8 text-white flex flex-col justify-between gap-4 shadow-[0_15px_30px_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.01] duration-300`}
                  >
                    {/* Top Row: Floating image & Text info side-by-side */}
                    <div className="flex flex-col relative xl:flex-row gap-3 items-center xl:items-start">
                      {/* Floating image wrapper */}
                      <div className="absolute top-0 left-1/2 xl:left-1/6 -translate-x-1/2 -translate-y-1/2 w-40 h-40 xl:w-34 xl:h-34 object-contain z-100">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-contain z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
                          priority
                        />
                      </div>

                      {/* Header content */}
                      <div className="flex flex-1 flex-col items-center xl:items-end xl:ml-auto max-w-54 w-full gap-2 pt-24 xl:pt-2">
                        <h3 className="text-2xl lg:text-3xl font-bold tracking-wide xl:text-right">
                          {card.title}
                        </h3>
                        {/* Custom White Divider */}
                        <div className="w-full max-w-34 h-px bg-white mx-auto xl:mr-0 xl:ml-auto my-1 opacity-90" />
                        <p className="text-center xl:text-right text-xs sm:text-sm opacity-90 leading-snug font-normal">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Feature Bullet points */}
                    <div className="space-y-3.5">
                      {card.features.map((feature, fIdx) => (
                        <div
                          key={fIdx}
                          className="hidden xl:flex items-center gap-3"
                        >
                          {/* Premium SVG Custom Icons */}
                          <div className="shrink-0 text-white opacity-95">
                            {fIdx === 0 && (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <rect
                                  x="4"
                                  y="4"
                                  width="16"
                                  height="16"
                                  rx="3"
                                />
                                <line x1="20" y1="4" x2="4" y2="20" />
                              </svg>
                            )}
                            {fIdx === 1 && (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <circle cx="14" cy="12" r="6" />
                                <path d="M14 9v3l2 1" />
                                <path
                                  strokeLinecap="round"
                                  d="M2 9h4M2 12h4M2 15h4"
                                />
                              </svg>
                            )}
                            {fIdx === 2 && (
                              <ThumbsUp size={16} strokeWidth={2.5} />
                            )}
                          </div>
                          <span className="text-sm sm:text-base opacity-95 tracking-wide leading-none">
                            {feature}
                          </span>
                        </div>
                      ))}
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

        {/* Lower Research & Development Section */}
        <div className="space-y-4 pt-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900">
            Superior Quality Backed by Research
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed font-light">
            Learn how our focus on product development, quality standards and
            market reach supports India’s woodworking needs.
          </p>
          <Link
            href="#"
            className="inline-flex items-center justify-center font-bold min-w-35 px-6 py-2.5 rounded-full text-sm bg-linear-to-tr from-[#FF0009] to-[#772571] text-white hover:opacity-95 shadow-md hover:shadow-lg transition-all text-center"
          >
            Inside Our Labs
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="hidden md:block col-span-1">
              <Image
                src="/images/Rectangle 110.png"
                className="object-cover w-full h-full rounded-2xl shadow-sm"
                alt="Research Laboratory"
                width={400}
                height={260}
              />
            </div>
            <div className="col-span-2">
              <Image
                src="/images/Rectangle 111.png"
                className="object-cover w-full h-full rounded-2xl shadow-sm"
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
