"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProductCarousel from "./ProductCarousel";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";

interface ProductRangeProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: any[];
  };
}

export default function ProductRange({ data }: ProductRangeProps) {
  const title =
    data?.title || "A Complete Adhesive Range for Modern Woodworking";
  const subtitle = data?.subtitle || "";
  const items = data?.items || [];

  const tabs = [
    "Super Premium",
    "Speciality",
    "Regular",
    "Waterproof Grade",
    "ECO",
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [activeCategory, setActiveCategory] = useState("Super Premium");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
      const tabWidth = (scrollContainerRef.current.clientWidth - 8) / 2;
      scrollContainerRef.current.scrollBy({
        left: -(tabWidth + 8),
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const tabWidth = (scrollContainerRef.current.clientWidth - 8) / 2;
      scrollContainerRef.current.scrollBy({
        left: tabWidth + 8,
        behavior: "smooth",
      });
    }
  };

  const handleNextCategory = () => {
    const currentIndex = tabs.findIndex((c) => c === activeCategory);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveCategory(tabs[nextIndex]);
  };

  const handlePrevCategory = () => {
    const currentIndex = tabs.findIndex((c) => c === activeCategory);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    setActiveCategory(tabs[prevIndex]);
  };

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
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeIndex = tabs.findIndex((c) => c === activeCategory);
      const activeElement = scrollContainerRef.current.children[
        activeIndex
      ] as HTMLElement;

      if (activeElement) {
        scrollContainerRef.current.scrollTo({
          left: activeElement.offsetLeft,
          behavior: "smooth",
        });
      }
    }
    const timer = setTimeout(checkScroll, 400);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <section id="product-section" className="relative overflow-hidden">
      {/* watermark */}
      <div className="absolute bottom-0 right-0 opacity-75 pointer-events-none">
        <Image
          src="/images/watermark.png"
          alt=""
          width={950}
          height={500}
          className="w-75 sm:w-100 lg:w-240"
        />
      </div>
      <div className="flex flex-col items-center justify-center text-center relative mx-auto my-20 max-w-6xl px-2 lg:px-8 w-full">
        <Image
          className="mb-4"
          src="/images/badge.png"
          width={40}
          height={40}
          alt="badge"
        />
        <div className="max-w-full md:max-w-5xl mx-auto my-6">
          <h2 className="font-amethysta font-normal text-4xl lg:text-6xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-xl text-foreground/85 max-w-3xl mx-auto font-google-sans">
              {subtitle}
            </p>
          )}
          {/* Categories tabs Desktop */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-4 my-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${tab === activeTab ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white" : "bg-surface"} cursor-pointer font-medium px-4 py-2 rounded-3xl text-sm`}
              >
                {tab}
              </button>
            ))}
          </div>
          {/* Mobile categories tabs */}
          <div className="flex md:hidden items-center justify-between w-full mt-4 gap-2">
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
              className={`cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-all duration-200 ${
                showLeftArrow
                  ? "block pointer-events-auto"
                  : "hidden pointer-events-none"
              }`}
            >
              <ChevronLeftCircle size={24} className="text-[#FF0009]" />
            </button>
            <div
              ref={scrollContainerRef}
              className="flex-1 flex overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory gap-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {tabs.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`${
                      isActive
                        ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white"
                        : "bg-surface text-black"
                    } cursor-pointer font-medium p-2 rounded-3xl text-xs sm:text-sm shrink-0 w-[calc(50%-4px)] text-center truncate snap-start`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <button
              onClick={scrollRight}
              className={`cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-all duration-200 ${
                showRightArrow
                  ? "block pointer-events-auto"
                  : "hidden pointer-events-none"
              }`}
            >
              <ChevronRightCircle size={24} className="text-[#FF0009]" />
            </button>
          </div>
        </div>
      </div>
      <ProductCarousel items={items} />
    </section>
  );
}
