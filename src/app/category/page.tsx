import { Categories, Hero, RightChoice } from "@/components/category";

export default function Category() {
  return (
    <main className="min-h-screen bg-background font-google-sans">
      <Hero />
      <Categories />
      <RightChoice />
    </main>
  );
}
