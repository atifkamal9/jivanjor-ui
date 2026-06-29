"use client";

import Image from "next/image";
import { Play } from "lucide-react";

interface HeroProps {
  data?: {
    title?: string;
    subtitle?: string; // fallback
    desc?: string; // user request
    badgeText?: string;
    backgroundImage?: string; // fallback
    bgImage?: string; // user request
    ctaText?: string; // fallback
    ctaLink?: string; // fallback
    video?: string;
    actionButtons?: {
      primary?: {
        text?: string;
        actionPath?: string;
      };
      secondary?: {
        text?: string;
        actionPath?: string;
      };
    };
  };
}

export default function Hero({ data }: HeroProps) {
  const title = data?.title || "Dependable Bonds for Indian Homes";
  const subtitle = data?.desc || data?.subtitle || "";
  const bgImage = data?.bgImage || data?.backgroundImage || "/images/hero.png";
  const bgImagePhone =
    data?.bgImage || data?.backgroundImage || "/images/hero.png";

  const primaryText =
    data?.actionButtons?.primary?.text || data?.ctaText || "Explore Products";
  const primaryLink =
    data?.actionButtons?.primary?.actionPath ||
    data?.ctaLink ||
    "#product-section";

  const secondaryText =
    data?.actionButtons?.secondary?.text || "About Jivanjor";
  const secondaryLink =
    data?.actionButtons?.secondary?.actionPath || "/about";

  return (
    <section className="relative w-full h-146.75 xl:h-164.5 overflow-hidden bg-black text-white">
      {/* Mobile Version Background */}
      <div className="absolute inset-0 xl:hidden">
        <Image
          src={bgImagePhone}
          alt="Jivanjor hero mobile background"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(53.58deg, rgba(0, 0, 0, 0.63) 22.03%, rgba(0, 0, 0, 0.34) 56.11%, rgba(102, 102, 102, 0) 95.1%)",
          }}
        />
      </div>

      {/* Desktop Version Background */}
      <div className="absolute inset-0 hidden xl:block">
        <Image
          src={bgImage}
          alt="Jivanjor hero desktop background"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(0, 0, 0, 0.17) 0%, rgba(0, 0, 0, 0.17) 100%), linear-gradient(41.78deg, rgba(0, 0, 0, 0.88) 6.87%, rgba(102, 102, 102, 0) 54.68%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-360 h-full w-full">
        {/* Content Wrapper */}
        <div className="absolute bottom-26.5 xl:bottom-18.25 left-7 xl:left-17.25 right-7 xl:right-17.25 flex flex-col items-start">
          {/* Title */}
          <h1 className="text-[40px] xl:text-[70px] font-amethysta tracking-[0%] text-white leading-[0.95] max-w-82.25 xl:max-w-184">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-4 xl:mt-5 text-[15px] xl:text-[18px] text-white/80 font-google-sans leading-normal max-w-82.25 xl:max-w-184">
              {subtitle}
            </p>
          )}

          {/* Action Buttons */}
          <div
            className={`${subtitle ? "mt-5" : "mt-4.25 xl:mt-1"} flex items-center gap-4.25 xl:gap-3.75`}
          >
            <a
              href={primaryLink}
              className="w-37.25 h-8.25 rounded-full bg-white text-[#1c1c1c] text-[14px] font-medium transition hover:bg-white/90 flex items-center justify-center text-center font-google-sans"
            >
              {primaryText}
            </a>
            <a
              href={secondaryLink}
              className="w-37.25 xl:w-40.5 h-8.25 rounded-full border-[1.5px] border-white text-white text-[14px] font-medium transition hover:bg-white/10 flex items-center justify-center text-center font-google-sans"
            >
              {secondaryText}
            </a>
          </div>
        </div>

        {/* Play Video Button */}
        <div className="absolute bottom-6.25 right-6.25 xl:bottom-18.25 xl:right-17.25 w-9.75 h-[40.1px] xl:w-[60.5px] xl:h-[62.2px] bg-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 duration-300 cursor-pointer">
          <Play className="text-[#2D2D2D] fill-[#2D2D2D] w-4 h-4 xl:w-7.5 xl:h-7.5" />
        </div>
      </div>
    </section>
  );
}
