import { Suspense } from "react";
import { Hero, MainCategories, RightChoice } from "@/components/categories";

export default function Categories() {
  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Suspense fallback={<div className="min-h-[350px]" />}>
        <Hero />
        <MainCategories />
      </Suspense>
      <RightChoice />
    </main>
  );
}
