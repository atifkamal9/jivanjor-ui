import Image from "next/image";
import {
  HeroCategory,
  ProductCategories,
  RightChoice,
} from "@/components/categories";

export default function Categories() {
  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <HeroCategory />
      <div className="relative w-full">
        {/* Watermark */}
        <Image
          src="/images/Watermark 9.png"
          alt="watermark"
          width={580}
          height={682}
          className="hidden lg:block absolute top-[22%] -right-2 pointer-events-none"
        />
        <ProductCategories />
      </div>
      <RightChoice />
    </main>
  );
}
