"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full max-w-360 mx-auto px-5 lg:px-8 pt-2 sm:pt-9 pb-0.5 overflow-visible">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 md:gap-2 mb-6 text-sm md:text-base">
        <Link href="/" className="hover:text-primary transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-sm md:text-lg">About Us</span>
      </div>

      {/* Banner Card */}
      <div className="flex flex-col items-center text-center p-6 text-white relative rounded-3xl overflow-hidden min-h-95 md:min-h-102 bg-linear-to-r from-[#E00921] to-[#772571]">
        {/* Background Logo Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-0 lg:opacity-100 select-none flex items-end justify-center -mt-18 xl:mt-0">
          <Image
            src="/images/about/about-hero-waterwark.svg"
            alt="watermark"
            fill
            className="w-full h-full object-contain object-center"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center relative max-w-2xs md:max-w-5xl text-white gap-4 mt-4 md:mt-6 z-10">
          <h1 className="font-amethysta text-[40px] md:text-5xl leading-[95%]!">
            A Trusted Name in Woodworking Adhesives
          </h1>
          <p className="font-google-sans text-lg md:text-2xl max-w-3xl">
            Engineered for consistency. Built for the contractors and carpenters
            who shape India's woodwork.
          </p>
          <div>
            <Link
              href="#about-query-section"
              className="inline-flex items-center justify-center font-google-sans font-medium text-sm rounded-full px-6 py-1.5 bg-white text-black hover:scale-105 transition-transform duration-200"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      </div>

      {/* Overlapping Product Range Image */}
      <div className="relative -mt-12 md:-mt-32 xl:-mt-42 max-w-full mx-auto scale-110 z-20">
        <div className="aspect-1426/316 hidden md:block w-full relative">
          <Image
            src="/images/about/about-hero.png"
            alt="Jivanjor Product Range"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="md:hidden aspect-101/63 w-full relative">
          <Image
            src="/images/about/about-hero-1.png"
            alt="Jivanjor Product Range"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </section>
  );
}
