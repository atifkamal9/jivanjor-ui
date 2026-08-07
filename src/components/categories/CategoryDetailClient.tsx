"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeroCategory from "./HeroCategory";
import ProductCategories from "./ProductCategories";
import { api } from "@/lib/api";

interface CategoryDetailClientProps {
  initialCategory?: any;
  initialParentCategory?: any;
  slug: string;
  data?: any;
}

export default function CategoryDetailClient({
  initialCategory,
  initialParentCategory,
  slug,
  data,
}: CategoryDetailClientProps) {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState<any>(initialCategory);
  const [parentCategory, setParentCategory] = useState<any>(initialParentCategory);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await api.getCategories();
        setAllCategories(cats);
        if (slug) {
          const match = cats.find((c) => c.slug === slug);
          if (match) {
            setCurrentCategory(match);
            if (match.parent_category) {
              const parentMatch = cats.find((c) => c.id === match.parent_category);
              setParentCategory(parentMatch || null);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching categories in client:", err);
      }
    }
    loadCategories();
  }, [slug]);

  useEffect(() => {
    if (initialCategory) {
      setCurrentCategory(initialCategory);
    }
    if (initialParentCategory) {
      setParentCategory(initialParentCategory);
    }
  }, [initialCategory, initialParentCategory]);

  const handleCategoryChange = (catObj: any) => {
    if (!catObj) return;
    setCurrentCategory(catObj);

    if (catObj.parent_category && allCategories.length > 0) {
      const parentMatch = allCategories.find((c) => c.id === catObj.parent_category);
      if (parentMatch) {
        setParentCategory(parentMatch);
      }
    }

    if (catObj.slug && catObj.slug !== slug) {
      router.push(`/categories/${catObj.slug}`, { scroll: false });
    }
  };

  return (
    <>
      <HeroCategory category={currentCategory} parentCategory={parentCategory} />
      <div className="relative w-full">
        {/* Watermark */}
        <Image
          src="/images/Watermark 9.png"
          alt="watermark"
          width={580}
          height={682}
          className="hidden lg:block absolute top-[22%] -right-2 pointer-events-none"
        />
        <ProductCategories
          category={slug}
          data={data}
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </>
  );
}
