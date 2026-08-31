"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Heading, Subtitle, Title, Paragraph } from "@/components/ui";

interface AccordionItem {
  title: string;
  description: string;
  imageA: string;
  imageB: string;
  link?: string;
  url?: string;
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

interface ProductFeaturesProps {
  product?: any;
}

export default function ProductFeatures({ product }: ProductFeaturesProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const applicationsList = product?.applications && product.applications.length > 0
    ? product.applications
    : ACCORDION_ITEMS;

  const productName = product?.name || "Supremo";

  return (
    <section id="applications" className="max-w-360 mx-auto pt-12 space-y-10">
      {/* ========================================== */}
      {/* 1. ACCORDION SECTION (TASK AT HAND) */}
      {/* ========================================== */}
      <div className="space-y-8">
        {/* Header content with link icon */}
        <div className="text-center space-y-3 max-w-sm md:max-w-4xl mx-auto">
          <div className="flex justify-center">
            <Image
              className="mb-4"
              src="/images/badge.png"
              width={40}
              height={40}
              alt="badge"
            />
          </div>
          <Heading as="h2" className="max-w-75 lg:max-w-full mx-auto">
            {product?.appsTitle || "Engineered for the Task at Hand"}
          </Heading>
          <Subtitle className="max-w-85 lg:max-w-full mx-auto">
            {product?.appsDescription ? product.appsDescription.replace("{productName}", productName) : `Explore where ${productName} fits across furniture, laminates, plywood, boards and professional woodwork applications.`}
          </Subtitle>
        </div>

        {/* Accordion List */}
        <div className="w-full max-w-7xl mx-auto">
          {applicationsList.map((item: any, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={item.title}
                className="border-t overflow-hidden first:border-t-0"
              >
                {/* Header row click button */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left py-5 flex justify-between items-center cursor-pointer group gap-20 select-none"
                >
                  <Title className="group-hover:text-primary leading-normal transition-colors duration-200 lg:text-[28px]! xd:text-[30px]!">
                    {item.title}
                  </Title>

                  {/* Indicator Toggle icon */}
                  {isOpen ? (
                    <span className="text-[#ed1c24] text-2xl lg:text-3xl font-light select-none leading-none pr-1">
                      &times;
                    </span>
                  ) : (
                    <span className="group-hover text-2xl lg:text-3xl font-light select-none leading-none pr-1 transition-colors">
                      +
                    </span>
                  )}
                </button>

                {/* Animated expandable content block */}
                <div
                  className={`transition-all duration-300 ease-in-out ${isOpen
                    ? "max-h-150 opacity-100 pb-6"
                    : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-10 items-start">
                    {/* Left: Text & explore link */}
                    <div className="flex-1 space-y-4 max-w-lg">
                      <Paragraph className="leading-normal">
                        {item.description}
                      </Paragraph>
                      {/* Explore Link */}
                      {(() => {
                        const exploreLinkUrl = (item.link || item.url || "").trim();
                        if (!exploreLinkUrl || exploreLinkUrl === "#") return null;
                        return (
                          <Link
                            href={exploreLinkUrl}
                            className="inline-flex items-center gap-1.5 underline text-base sm:text-lg hover:text-primary transition-colors group/link cursor-pointer"
                          >
                            <span>Explore More</span>
                            {/* Red circular arrow */}
                            <span className="w-5 h-5 lg:w-7 lg:h-7 rounded-full bg-linear-to-r from-[#FF0009] to-[#772571] flex items-center justify-center group-hover/link:bg-[#FF0009] transition-colors">
                              <ArrowRight className="text-white w-4 h-4 lg:w-5 lg:h-5" />
                            </span>
                          </Link>
                        );
                      })()}
                    </div>

                    {/* Right: Two side-by-side images */}
                    <div className="grid grid-cols-3 gap-1.5 lg:gap-5 shrink-0 items-center justify-center lg:justify-end pr-0 lg:pr-12 w-full md:w-fit">
                      <div className="col-span-1 relative min-w-24 xs:min-w-28 sm:min-w-30 lg:min-w-49 lg:min-h-60 min-h-36 xs:min-h-40 w-full rounded-2xl overflow-hidden">
                        <Image
                          fill
                          src={item.imageA}
                          alt={`${item.title} detail layout`}
                          className="object-cover"
                          sizes="(max-width: 768px) 130px, 180px"
                        />
                      </div>
                      <div className="col-span-2 relative min-w-44 xs:min-w-48 sm:min-w-50 lg:min-w-80 min-h-36 xs:min-h-40 lg:min-h-60 w-full rounded-2xl overflow-hidden">
                        <Image
                          fill
                          src={item.imageB}
                          alt={`${item.title} bonding application`}
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
      {/* On Mobile: text goes top. On Desktop: text goes right */}
      {/* Text Details Column */}
    </section>
  );
}
