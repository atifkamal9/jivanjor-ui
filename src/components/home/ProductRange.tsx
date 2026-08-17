"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProductCarousel from "./ProductCarousel";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { Heading } from "@/components/ui";
import { api, Product, Category } from "@/lib/api";

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

  // Subcategories list (Max 8 categories: 1 mandatory ALL + max 7 custom)
  const defaultCategories: ProductRangeCategory[] = [
    { id: "cat-all", categoryId: "ALL", name: "ALL", selectedProductIds: [] },
    { id: "cat-1", name: "Super Premium", selectedProductIds: [] },
    { id: "cat-2", name: "Speciality", selectedProductIds: [] },
    { id: "cat-3", name: "Regular", selectedProductIds: [] },
    { id: "cat-4", name: "Waterproof Grade", selectedProductIds: [] },
    { id: "cat-5", name: "ECO", selectedProductIds: [] },
  ];

  const rawCategories: ProductRangeCategory[] =
    data?.categories && data.categories.length > 0
      ? data.categories.slice(0, 8)
      : defaultCategories;

  const hasAll = rawCategories.some(
    (c) => (c.categoryId || "").toUpperCase() === "ALL" || c.name.trim().toUpperCase() === "ALL"
  );

  const displayCategories: ProductRangeCategory[] = hasAll
    ? rawCategories
    : [
        { id: "cat-all", categoryId: "ALL", name: "ALL", selectedProductIds: [] },
        ...rawCategories.slice(0, 7),
      ];

  const [activeCategoryName, setActiveCategoryName] = useState<string>(
    displayCategories[0]?.name || "ALL"
  );

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, cats] = await Promise.all([
          api.getProducts().catch(() => []),
          api.getCategories().catch(() => []),
        ]);
        setDbProducts(prods);
        setDbCategories(cats);
      } catch (err) {
        console.error("Failed to load data for homepage ProductRange:", err);
      }
    }
    loadData();
  }, []);

  // Update activeCategoryName if categories change and active category is invalid
  useEffect(() => {
    if (
      displayCategories.length > 0 &&
      !displayCategories.some((c) => c.name === activeCategoryName)
    ) {
      setActiveCategoryName(displayCategories[0]?.name || "ALL");
    }
  }, [data?.categories]);

  let carouselItems: Product[] = [];
  if (dbProducts.length > 0) {
    const currentCategoryObj =
      displayCategories.find((c) => c.name === activeCategoryName) || displayCategories[0];
    const activeSelectedProductIds = currentCategoryObj?.selectedProductIds || [];

    // 1. If explicit selectedProductIds are configured in CMS for this tab, render them in order
    if (activeSelectedProductIds.length > 0) {
      carouselItems = activeSelectedProductIds
        .map((idOrSlug) => dbProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug))
        .filter(Boolean)
        .slice(0, 25) as Product[];
    }

    // 2. If no explicit IDs selected for ALL tab specifically, collect selectedProductIds across all other custom categories
    if (carouselItems.length === 0 && (currentCategoryObj?.categoryId?.toUpperCase() === "ALL" || currentCategoryObj?.name?.toUpperCase() === "ALL")) {
      const allCategorySelectedIds = Array.from(
        new Set(
          displayCategories
            .filter((c) => (c.categoryId || "").toUpperCase() !== "ALL" && c.name.toUpperCase() !== "ALL")
            .flatMap((c) => c.selectedProductIds || [])
        )
      ).filter(Boolean);

      if (allCategorySelectedIds.length > 0) {
        carouselItems = allCategorySelectedIds
          .map((idOrSlug) => dbProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug))
          .filter(Boolean)
          .slice(0, 25) as Product[];
      }
    }

    // 3. If still empty, filter products matching category ID or name
    if (carouselItems.length === 0 && currentCategoryObj) {
      const targetId = (currentCategoryObj.categoryId || "").toLowerCase();
      const targetName = (currentCategoryObj.name || "").toLowerCase();

      if (targetId === "all" || targetName === "all") {
        carouselItems = dbProducts.slice(0, 25);
      } else {
        carouselItems = dbProducts
          .filter((p: any) => {
            const catIds = Array.from(
              new Set([p.category_id, ...(p.category_ids || p.categoryIds || []), p.category])
            )
              .filter(Boolean)
              .map((id: string) => (id || "").toLowerCase());

            return catIds.some(
              (id: string) => (targetId && id === targetId) || id === targetName
            );
          })
          .slice(0, 25);
      }
    }

    // 4. Fallback to first 25 dbProducts
    if (carouselItems.length === 0) {
      carouselItems = dbProducts.slice(0, 25);
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
      const activeIndex = displayCategories.findIndex((c) => c.name === activeCategoryName);
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
        <div className="max-w-full mx-auto my-6">
          <Heading className="max-w-full md:max-w-3xl mx-auto">{title}</Heading>
          {/* Categories tabs Desktop */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-4 mt-4 mb-6">
            {displayCategories.map((cat) => (
              <button
                key={cat.id || cat.name}
                onClick={() => setActiveCategoryName(cat.name)}
                className={`${cat.name === activeCategoryName
                  ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white"
                  : "bg-surface text-foreground hover:scale-105"
                  } cursor-pointer font-medium px-4 py-2 rounded-3xl text-sm transition-all duration-200 min-w-20`}
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
              {displayCategories.map((cat) => {
                const isActive = activeCategoryName === cat.name;
                return (
                  <button
                    key={cat.id || cat.name}
                    onClick={() => setActiveCategoryName(cat.name)}
                    className={`${isActive
                      ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white"
                      : "bg-surface text-foreground"
                      } cursor-pointer font-medium px-3 py-2 rounded-3xl text-xs sm:text-sm shrink-0 w-[calc(50%-4px)] text-center truncate snap-start transition-all`}
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
