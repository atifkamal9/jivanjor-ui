import type { Metadata } from "next";
import {
  Hero,
  ProductInfo,
  ProductFeatures,
  RelatedProducts,
  ProductFaq,
} from "@/components/products";

export const metadata: Metadata = {
  title: "Watershield | Jivanjor Adhesives",
  description: `Watershield: Apke furniture ko paani se bachane wali shield. Discover Best-in-Class Coverage, D3 Water Resistance, and Anti-bubble Adhesive.`,
};

export default function Products() {
  return (
    <div className="font-google-sans min-h-screen bg-background text-foreground">
      <Hero />
      <ProductInfo />
      <ProductFeatures />
      <RelatedProducts />
      <ProductFaq />
    </div>
  );
}
