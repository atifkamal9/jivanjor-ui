"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Heading, Subtitle } from "@/components/ui";

interface HeroProps {
  data?: {
    title?: string;
    subtitle?: string;
    desc?: string;
    actionButtons?: {
      primary?: {
        text?: string;
        actionPath?: string;
      };
    };
    media?: string[];
  };
  subpageTitle?: string;
}

export default function Hero({ data, subpageTitle }: HeroProps) {
  const title = data?.title || "A Trusted Name in Woodworking Adhesives";
  const desc = data?.subtitle || data?.desc || "Engineered for consistency. Built for the contractors and carpenters who shape India's woodwork.";
  const ctaText = data?.actionButtons?.primary?.text || "Enquire Now";
  const ctaLink = data?.actionButtons?.primary?.actionPath || "#about-query-section";

  const watermarkImg = "/images/about/about-hero-waterwark.svg";
  const desktopImg = data?.media?.[0] || "/images/about/about-hero.png";
  const mobileImg = data?.media?.[1] || data?.media?.[0] || "/images/about/about-hero-1.png";

  return (
    <section id="about-jivanjor" className="relative w-full max-w-360 mx-auto px-0 sm:px-8 hd:px-12 3xl:px-8 pt-2 sm:pt-6 pb-0.5 overflow-hidden">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 md:gap-2 mb-6 text-sm md:text-base mx-5 sm:mx-0">
        <Link href="/" className="hover:text-primary transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        <ChevronRight className="w-4 h-4" />
        {subpageTitle ? (
          <>
            <Link href="/about" className="hover:text-primary transition-colors">
              <span className="font-medium text-sm md:text-lg">About Us</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground/70 font-medium text-sm md:text-lg">{subpageTitle}</span>
          </>
        ) : (
          <span className="font-medium text-sm md:text-lg">About Us</span>
        )}
      </div>

      {/* Banner Card */}
      <div className="flex flex-col items-center text-center p-6 text-white relative rounded-3xl overflow-hidden min-h-95 md:min-h-102 bg-linear-to-r from-[#E00921] to-[#772571] mx-5 sm:mx-0">
        {/* Background Logo Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-0 lg:opacity-100 select-none flex items-end justify-center -mt-18 xl:mt-0">
          <Image
            src={watermarkImg}
            alt="watermark"
            fill
            className="w-full h-full object-contain object-center"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center relative max-w-2xs md:max-w-5xl text-white gap-4 mt-4 md:mt-6 z-10">
          <Heading className="text-[36px]! xs:text-[40px]! xd:text-[44px]! tracking-[0%] text-white leading-[95%]">
            {title}
          </Heading>
          <Subtitle className="max-w-xl text-white/90">
            {desc}
          </Subtitle>
          <div>
            <Link
              href={ctaLink}
              className="inline-flex items-center justify-center font-medium text-sm rounded-full px-6 py-1.5 bg-white text-black hover:scale-105 transition-transform duration-200"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>

      {/* Overlapping Product Range Image */}
      <div className="relative -mt-8 md:-mt-32 xl:-mt-42 max-w-full mx-auto scale-110 z-20">
        <div className="aspect-1426/316 hidden md:block w-full relative">
          <Image
            src={desktopImg}
            alt="Jivanjor Product Range"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="md:hidden aspect-101/63 w-full relative">
          <Image
            src={mobileImg}
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

