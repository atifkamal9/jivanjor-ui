"use client";

import Image from "next/image";
import { Package, Layers, Wrench, HardHat } from "lucide-react";

export default function Promise() {
  const cards = [
    {
      title: "Quality-Led Products",
      desc: "Adhesive solutions built around consistent performance and practical use.",
      icon: <Package className="w-10 h-10" />,
    },
    {
      title: "Woodworking Focus",
      desc: "Products designed for furniture, interiors, laminates and everyday woodwork needs.",
      icon: <Layers className="w-10 h-10" />,
    },
    {
      title: "Trade Understanding",
      desc: "A brand connected with the professionals and partners who shape adhesive choices.",
      icon: <Wrench className="w-10 h-10" />,
    },
    {
      title: "Application Confidence",
      desc: "Guidance, product information and support to help users choose and apply better.",
      icon: <HardHat className="w-10 h-10" />,
    },
  ];

  return (
    <section id="promise-section" className="scroll-mt-36 py-4 md:py-12">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Header Logo Icon */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/badge.png"
            alt="Jivanjor Logo Icon"
            width={40}
            height={40}
            className="aspect-square object-contain"
          />
        </div>
        {/* Section Heading */}
        <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-[48px] text-center text-[#222] font-normal mb-6">
          The Promise of Stronger Bonds
        </h2>

        {/* Section Subtitle */}
        <p className="font-google-sans text-lg sm:text-xl lg:text-[24px] text-center text-[#222] max-w-4xl mb-12 leading-relaxed">
          Jivanjor is built around the needs of woodworking professionals,
          channel partners and end users who look for dependable adhesive
          solutions.
        </p>

        {/* 4 Cards Grid */}
        <div className="w-full bg-surface rounded-3xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="rounded-2xl p-4 mb-5 flex items-center justify-center">
                  {card.icon}
                </div>
                <h3 className="font-amethysta text-xl sm:text-2xl text-[#222] font-medium mb-3">
                  {card.title}
                </h3>
                <p className="font-google-sans text-sm sm:text-base text-[#222] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
