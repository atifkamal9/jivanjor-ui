"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProductCarousel from "./ProductCarousel";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { Heading } from "@/components/ui";
import { api, Product } from "@/lib/api";

export interface ProductRangeCategory {
  id?: string;
  categoryId?: string;
  name: string;
  selectedProductIds?: string[];
}

interface ProductRangeProps {
  data?: {
    title?: string;
    categories?: ProductRangeCategory[];
    subtitle?: string;
    items?: any[];
    selectedProductIds?: string[];
  };
}

export default function ProductRange({ data }: ProductRangeProps) {
  const title =
    data?.title || "A Complete Adhesive Range for Modern Woodworking";

  // Categories list (Max 5 categories)
  const defaultCategories: ProductRangeCategory[] = [
    { id: "cat-1", name: "Super Premium", selectedProductIds: [] },
    { id: "cat-2", name: "Speciality", selectedProductIds: [] },
    { id: "cat-3", name: "Regular", selectedProductIds: [] },
    { id: "cat-4", name: "Waterproof Grade", selectedProductIds: [] },
    { id: "cat-5", name: "ECO", selectedProductIds: [] },
  ];

  const categories: ProductRangeCategory[] =
    data?.categories && data.categories.length > 0
      ? data.categories.slice(0, 5)
      : defaultCategories;

  const [activeCategoryName, setActiveCategoryName] = useState<string>(
    categories[0]?.name || "Super Premium"
  );

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const prods = await api.getProducts();
        setDbProducts(prods);
      } catch (err) {
        console.error("Failed to load products for homepage ProductRange:", err);
      }
    }
    fetchProducts();
  }, []);

  // Update activeCategoryName if categories change
  useEffect(() => {
    if (categories.length > 0 && !categories.some((c) => c.name === activeCategoryName)) {
      setActiveCategoryName(categories[0].name);
    }
  }, [data?.categories]);

  // Find active category configuration
  const currentCategoryObj =
    categories.find((c) => c.name === activeCategoryName) || categories[0];
  const activeSelectedProductIds = currentCategoryObj?.selectedProductIds || [];

  let carouselItems: Product[] = [];
  if (dbProducts.length > 0) {
    if (activeSelectedProductIds.length > 0) {
      carouselItems = activeSelectedProductIds
        .map((idOrSlug) => dbProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug))
        .filter(Boolean)
        .slice(0, 10) as Product[];
    }
    // Fallback if no specific products selected for this category
    if (carouselItems.length === 0) {
      carouselItems = dbProducts.filter(
        (p: any) =>
          (currentCategoryObj?.categoryId && (p.category_id === currentCategoryObj.categoryId || p.category_id?.toLowerCase() === currentCategoryObj.categoryId.toLowerCase())) ||
          p.category_id?.toLowerCase() === activeCategoryName.toLowerCase() ||
          p.category?.toLowerCase() === activeCategoryName.toLowerCase()
      ).slice(0, 10);
    }
    if (carouselItems.length === 0) {
      carouselItems = dbProducts.slice(0, 10);
    }
  }

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 1);
      setShowRightArrow(
        scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 1
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
      const activeIndex = categories.findIndex((c) => c.name === activeCategoryName);
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
  }, [activeCategoryName]);

  return (
    <section id="product-section" className="relative overflow-hidden">
      {/* watermark */}
      <div className="hidden md:block absolute aspect-175/129 -bottom-50 right-0 w-238 h-175 pointer-events-none">
        <Image
          fill
          src="/images/product-watermark.svg"
          className="w-full h-full"
          alt="watermark"
        />
      </div>
      <div className="flex flex-col items-center justify-center text-center relative mx-auto mt-8 mb-12 md:my-12 max-w-6xl px-2 lg:px-8 w-full">
        <Image src="/images/badge.png" width={40} height={40} alt="badge" />
        <div className="max-w-full md:max-w-5xl mx-auto my-6">
          <Heading className="max-w-full md:max-w-3xl">{title}</Heading>
          {/* Categories tabs Desktop */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-4 mt-4 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id || cat.name}
                onClick={() => setActiveCategoryName(cat.name)}
                className={`${cat.name === activeCategoryName
                  ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white"
                  : "bg-surface text-foreground hover:scale-105"
                  } cursor-pointer font-medium px-4 py-2 rounded-3xl text-sm transition-all duration-200`}
              >
                {cat.name}
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
              className={`cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-all duration-200 ${showLeftArrow
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
              {categories.map((cat) => {
                const isActive = activeCategoryName === cat.name;
                return (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => setActiveCategoryName(cat.name)}
                    className={`${isActive
                      ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white"
                      : "bg-surface text-foreground"
                      } cursor-pointer font-medium p-2 rounded-3xl text-xs sm:text-sm shrink-0 w-[calc(50%-4px)] text-center truncate snap-start transition-all`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
            <button
              onClick={scrollRight}
              className={`cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-all duration-200 ${showRightArrow
                ? "block pointer-events-auto"
                : "hidden pointer-events-none"
                }`}
            >
              <ChevronRightCircle size={24} className="text-[#FF0009]" />
            </button>
          </div>
        </div>
      </div>
      <ProductCarousel items={carouselItems} />
    </section>
  );
}
