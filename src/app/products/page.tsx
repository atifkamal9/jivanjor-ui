"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { api, Product, Category } from "@/lib/api";
import Hero from "@/components/products/Hero";
import ProductInfo from "@/components/products/ProductInfo";
import { RightChoice } from "@/components/categories";

function ProductPageContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProductData() {
      try {
        setLoading(true);
        const [prods, cats] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);

        setAllProducts(prods);

        let selected: Product | null = null;
        if (productSlug) {
          selected =
            prods.find(
              (p) =>
                p.slug === productSlug ||
                p.name.toLowerCase().replace(/\s+/g, "-") === productSlug
            ) || null;
        }

        // Fallback to first product if none selected
        if (!selected && prods.length > 0) {
          selected = prods[0];
        }

        setProduct(selected);

        if (selected) {
          const catMatch = cats.find((c) => c.id === selected.category_id);
          setCategory(catMatch || null);
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [productSlug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-semibold text-foreground/60">
          Loading product details...
        </p>
      </div>
    );
  }

  return (
    <div className="font-google-sans min-h-screen bg-background text-foreground">
      <Hero product={product} category={category} />
      <ProductInfo product={product} allProducts={allProducts} />
      <RightChoice data={product?.rightChoice} />
    </div>
  );
}

export default function Products() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-lg font-semibold text-foreground/60">
            Loading...
          </p>
        </div>
      }
    >
      <ProductPageContent />
    </Suspense>
  );
}
