"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AccordionItem {
  title: string;
  description: string;
  imageA: string;
  imageB: string;
}

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    title: "Laminate to Plywood Bonding",
    description:
      "Supremo is suitable for bonding laminate and plywood where strong adhesion, smooth spreadability and anti-bubble performance are important.",
    imageA: "/images/Rectangle 34.png",
    imageB: "/images/Rectangle 34 (1).png",
  },
  {
    title: "Wood to Wood Joinery",
    description:
      "Designed for finger jointing, structural dowelling, and solid wood frames. Ensures high tensile strength and durable bonding.",
    imageA: "/images/Rectangle 35.png",
    imageB: "/images/Rectangle 30.png",
  },
  {
    title: "Plywood, Veneer & Boards",
    description:
      "Ideal for cold pressing veneers and decorative laminates on MDF, HDF, and blockboards. Minimizes warp and swelling.",
    imageA: "/images/Rectangle 37.png",
    imageB: "/images/Rectangle 79.png",
  },
  {
    title: "Furniture Manufacturing",
    description:
      "Preferred by OEM factories for commercial assemblies, dining sets, premium tables, and modern office desks.",
    imageA: "/images/Rectangle 110.png",
    imageB: "/images/Rectangle 111.png",
  },
  {
    title: "Wooden Cabinets & Boxes",
    description:
      "Perfect for modular cabinets, wardrobes, kitchen shelves, drawer joints, and premium storage boxes.",
    imageA: "/images/Rectangle 34.png",
    imageB: "/images/Rectangle 35.png",
  },
];

export default function ProductFeatures() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section
      id="applications"
      className="max-w-360 mx-auto px-6 lg:px-8 py-12 space-y-16 lg:space-y-24"
    >
      {/* ========================================== */}
      {/* 1. ACCORDION SECTION (TASK AT HAND) */}
      {/* ========================================== */}
      <div className="space-y-8">
        {/* Header content with link icon */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <Image
              className="mb-4"
              src="/images/badge.png"
              width={40}
              height={40}
              alt="badge"
            />
          </div>
          <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
            Engineered for the Task at Hand
          </h2>
          <p className="text-2xl">
            Explore where Supremo fits across furniture, laminates, plywood,
            boards and professional woodwork applications.
          </p>
        </div>

        {/* Accordion List */}
        <div className="w-full max-w-7xl mx-auto border-b border-neutral-300">
          {ACCORDION_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.title}
                className="border-t border-neutral-300 overflow-hidden"
              >
                {/* Header row click button */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left py-5 flex justify-between items-center cursor-pointer group select-none"
                >
                  <span className="font-amethysta text-xl sm:text-2xl lg:text-4xl group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </span>

                  {/* Indicator Toggle icon */}
                  {isOpen ? (
                    <span className="text-[#ed1c24] text-2xl lg:text-3xl font-light select-none leading-none pr-1">
                      &times;
                    </span>
                  ) : (
                    <span className="text-neutral-400 group-hover text-2xl lg:text-3xl font-light select-none leading-none pr-1 transition-colors">
                      +
                    </span>
                  )}
                </button>

                {/* Animated expandable content block */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "max-h-150 opacity-100 pb-6"
                      : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-10 items-start">
                    {/* Left: Text & explore link */}
                    <div className="flex-1 space-y-4 max-w-lg">
                      <p className="text-sm sm:text-lg">{item.description}</p>
                      {/* Explore Link */}
                      <Link
                        href="#"
                        className="inline-flex items-center gap-1.5 underline text-base sm:text-lg hover:text-primary transition-colors group/link cursor-pointer"
                      >
                        <span>Explore More</span>
                        {/* Red circular arrow */}
                        <span className="w-10 h-10 rounded-full bg-linear-to-r from-[#FF0009] to-[#772571] flex items-center justify-center group-hover/link:bg-[#FF0009] transition-colors">
                          <ArrowRight className="text-white w-7 h-7" />
                        </span>
                      </Link>
                    </div>

                    {/* Right: Two side-by-side images */}
                    <div className="flex gap-4 w-full md:w-auto shrink-0 justify-center md:justify-end">
                      <div className="relative w-32.5 h-32.5 sm:w-37.5 sm:h-37.5 lg:w-45 lg:h-45 rounded-2xl overflow-hidden shadow-xs border border-neutral-100/50">
                        <Image
                          src={item.imageA}
                          alt={`${item.title} detail layout`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 130px, 180px"
                        />
                      </div>
                      <div className="relative w-32.5 h-32.5 sm:w-37.5 sm:h-37.5 lg:w-45 lg:h-45 rounded-2xl overflow-hidden shadow-xs border border-neutral-100/50">
                        <Image
                          src={item.imageB}
                          alt={`${item.title} bonding application`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 130px, 180px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. VIDEO ACTION SECTION (SUPREMO IN ACTION) */}
      {/* ========================================== */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-16 max-w-7xl mx-auto pt-6 border-t border-neutral-100">
        {/* On Mobile: text goes top. On Desktop: text goes right */}
        {/* Text Details Column */}
        <div className="order-1 md:order-2 flex-1 text-center md:text-left space-y-4 min-w-xs max-w-3xl">
          <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
            See Supremo in Action
          </h2>
          <p className="text-lg sm:text-2xl font-light">
            Watch how trade professionals achieve flawless, high-coverage
            laminate bonding in record time.
          </p>
          <Link
            href="#"
            className="inline-flex items-center justify-center font-medium min-w-35 px-6 py-2 rounded-3xl text-sm bg-linear-to-tr from-[#FF0009] to-[#772571] text-white hover:opacity-90 transition-opacity text-center"
          >
            Partner With Us
          </Link>
        </div>

        {/* Video Column (On Mobile: goes bottom. On Desktop: goes left) */}
        <div className="order-2 md:order-1 w-full md:w-auto shrink-0 flex justify-center">
          <div className="relative w-full max-w-2xl aspect-video sm:aspect-16/10 md:aspect-video rounded-3xl overflow-hidden shadow-lg border border-neutral-100 hover:shadow-xl transition-all duration-300">
            {/* Background image mockup for video */}
            <Image
              src="/images/Rectangle 4.png"
              alt="Supremo wood bonding video"
              width={800}
              height={450}
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 630px"
            />
            {/* Center play icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <button
                className="w-14 h-14 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Play video"
              >
                {/* Play Triangle SVG */}
                <svg
                  className="w-5 h-5 ml-0.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
