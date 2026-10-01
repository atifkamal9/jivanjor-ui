"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, Product, Category } from "@/lib/api";
import Hero from "@/components/products/Hero";
import ProductInfo from "@/components/products/ProductInfo";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import { RightChoice } from "@/components/categories";

interface ProductClientViewProps {
  initialProduct?: Product | null;
  initialCategory?: Category | null;
  initialAllProducts?: Product[];
}

export default function ProductClientView({
  initialProduct,
  initialCategory,
  initialAllProducts,
}: ProductClientViewProps) {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [category, setCategory] = useState<Category | null>(initialCategory || null);
  const [allProducts, setAllProducts] = useState<Product[]>(initialAllProducts || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);

        const visibleCats = cats.filter((c) => c.isVisible !== false && !c.hideInMenu);
        const visibleCatIds = new Set(visibleCats.map((c) => c.id));
        const visibleProds = prods.filter((p) => p.isVisible !== false && visibleCatIds.has(p.category_id));

        setAllProducts(visibleProds);

        let selected: Product | null = null;
        if (productSlug) {
          selected =
            visibleProds.find(
              (p) =>
                p.slug === productSlug ||
                p.name.toLowerCase().replace(/\s+/g, "-") === productSlug
            ) || null;
        }

        if (!selected && visibleProds.length > 0) {
          selected = visibleProds[0];
        }

        setProduct(selected);

        if (selected) {
          const catMatch = visibleCats.find((c) => c.id === selected.category_id);
          setCategory(catMatch || null);
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    }

    // Only reload if slug changed from initial
    if (productSlug && initialProduct?.slug !== productSlug) {
      loadProductData();
    }
  }, [productSlug, initialProduct?.slug]);

  if (loading && !product) {
    return <ProductSkeleton />;
  }

  return (
    <div className="font-google-sans min-h-screen bg-background text-foreground">
      <Hero product={product} category={category} />
      <ProductInfo product={product} allProducts={allProducts} />
      <RightChoice data={product?.rightChoice} />
    </div>
  );
}
