"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useFileMetadata } from "@/lib/useFileMetadata";

interface ProductResourcesProps {
  product?: any;
}

export default function ProductResources({ product }: ProductResourcesProps) {
  const [isOpen, setIsOpen] = useState(true);
  const productName = product?.name || "Product";

  const resourceTitle = product?.techResourceTitle || `${productName} - Technical Data Sheet`;
  const resourceDescription = product?.techResourceDescription || "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.";
  const resourceUrl = (product?.techResourceFileUrl || product?.documentUrl || "").trim();
  const themeColor = product?.themeColor || "#0498AA";

  const fileMeta = useFileMetadata(resourceUrl);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  if (!resourceUrl || resourceUrl === "#") {
    return null;
  }

  return (
    <section id="resources" className="w-full py-16 lg:py-24 border-t border-neutral-100 scroll-mt-20">
      {/* Header section */}
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-4 mb-12 sm:mb-16">
        <div className="text-[#A31652]">
          <Image
            src="/images/Watermark pro icon.png"
            width={40}
            height={40}
            alt="badge"
          />
        </div>
        <h2 className="font-amethysta text-2xl sm:text-3xl lg:text-4xl font-normal leading-normal">
          Technical Resources
        </h2>
        <p className="text-base md:text-xl max-w-2xl mx-auto leading-normal text-neutral-600 dark:text-neutral-400">
          Download Technical Data Sheets (TDS), safety manuals, and documentation.
        </p>
      </div>

      {/* Accordion container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col bg-[#F9F9F9] dark:bg-zinc-900/40 rounded-[20px] p-4 lg:p-8 w-full border border-neutral-100 dark:border-zinc-800">
          <div
            onClick={toggleAccordion}
            className={`flex flex-col lg:flex-row justify-between cursor-pointer select-none group gap-4 relative ${isOpen ? "items-start py-6 lg:py-9" : "py-4.5"
              }`}
          >
            {/* Left Content Panel */}
            <div className="flex flex-col animate-fadeIn gap-1.5 relative flex-1 pr-8 lg:pr-0">
              <span className="font-medium text-lg lg:text-2xl text-black dark:text-white font-google-sans group-hover:text-red-600 transition-colors max-w-60 lg:max-w-lg">
                {resourceTitle}
              </span>
              {isOpen && (
                <div className="space-y-6 max-w-xs lg:max-w-md pt-2">
                  <p className="text-base lg:text-lg text-neutral-600 dark:text-neutral-300 font-normal font-google-sans leading-[120%]">
                    {resourceDescription}
                  </p>
                  <div className="space-y-2">
                    <span className="block font-medium text-xs md:text-sm text-neutral-400 uppercase tracking-wider">
                      {fileMeta.label}
                    </span>
                    <a
                      href={resourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center font-medium min-w-25 mt-1.5 px-6 py-2.5 rounded-full text-sm bg-gradient-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-95 shadow-md hover:shadow-lg transition-all text-center max-w-fit cursor-pointer"
                    >
                      Download
                    </a>
                  </div>
                </div>
              )}
              {/* Toggle icon for mobile */}
              <div
                className={`absolute top-0 right-0 lg:hidden transition-transform duration-300 ${isOpen ? "rotate-45 text-[#FF0009]" : ""
                  }`}
              >
                <Plus size={24} strokeWidth={2} />
              </div>
            </div>

            {/* Right Packaging Display */}
            {isOpen && (
              <div className="flex items-center justify-end lg:justify-center relative animate-fadeIn -mt-16 lg:mt-0 w-full lg:w-96 overflow-hidden min-h-[220px]">
                <div className="relative mb-4 mr-4 lg:mr-0 w-44 h-48 z-10 transition-transform duration-300">
                  <Image
                    src={product?.image || "/images/Watershield.png"}
                    alt={resourceTitle}
                    fill
                    className="object-contain"
                  />
                </div>
                <div
                  className="absolute bottom-0 rounded-[20px] min-h-[140px] w-full"
                  style={{ backgroundColor: themeColor }}
                >
                  <Image
                    src="/images/watermark pro.svg"
                    alt={resourceTitle}
                    fill
                    className="object-contain rounded-[20px] scale-x-105 opacity-10"
                  />
                </div>
              </div>
            )}

            {/* Toggle icon for desktop */}
            <div
              className={`hidden lg:block transition-transform duration-300 ${isOpen ? "rotate-45 text-[#FF0009]" : ""
                }`}
            >
              <Plus size={24} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
