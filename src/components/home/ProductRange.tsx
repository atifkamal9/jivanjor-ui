"use client";
import Image from "next/image";
import { useState } from "react";
import ProductCarousel from "./ProductCarousel";

interface ProductRangeProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: any[];
  };
}

export default function ProductRange({ data }: ProductRangeProps) {
  const title = data?.title || "A Complete Adhesive Range for Modern Woodworking";
  const subtitle = data?.subtitle || "";
  const items = data?.items || [];

  const tabs = [
    "Super Premium",
    "Speciality",
    "Regular",
    "Waterproof Grade",
    "ECO",
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section id="product-section" className="relative overflow-hidden">
      {/* watermark */}
      <div className="absolute bottom-0 right-0 opacity-75 pointer-events-none">
        <Image
          src="/images/watermark.png"
          alt=""
          width={950}
          height={500}
          className="w-75 sm:w-100 lg:w-240"
        />
      </div>
      <div className="flex flex-col items-center justify-center text-center relative mx-auto my-20 max-w-6xl px-6 lg:px-8 w-full">
        <Image
          className="mb-4"
          src="/images/badge.png"
          width={40}
          height={40}
          alt="badge"
        />
        <div className="max-w-5xl my-6">
          <h2 className="font-amethysta font-normal text-5xl lg:text-6xl xl:text-7xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-xl text-foreground/85 max-w-3xl mx-auto font-google-sans">
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-4 my-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${tab === activeTab ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white" : "bg-surface"} cursor-pointer font-medium px-4 py-2 rounded-3xl text-sm`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <ProductCarousel items={items} />
      </div>
    </section>
  );
}
