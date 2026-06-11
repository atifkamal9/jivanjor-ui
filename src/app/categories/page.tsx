import { Hero, ProductCategories, RightChoice } from "@/components/categories";

export default function Categories() {
  return (
    <main className="min-h-screen bg-background font-google-sans">
      <Hero />
      <ProductCategories />
      <RightChoice />
    </main>
  );
}
