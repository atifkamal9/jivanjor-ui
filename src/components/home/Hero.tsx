"use client";

import Image from "next/image";

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
    data?.bgImage || data?.backgroundImage || "/images/hero-1.png";

  const primaryText =
    data?.actionButtons?.primary?.text || data?.ctaText || "Explore Products";
  const primaryLink =
    data?.actionButtons?.primary?.actionPath ||
    data?.ctaLink ||
    "#product-section";

  const secondaryText =
    data?.actionButtons?.secondary?.text || "About Jivanjor";
  const secondaryLink =
    data?.actionButtons?.secondary?.actionPath || "#about-section";

  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Desktop Version */}
      <div className="absolute hidden xl:block inset-0 w-full min-h-160">
        <Image
          src={bgImage}
          alt="Jivanjor hero thumbnail"
          fill
          className="object-cover"
          priority
        />
        {/* <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/30 to-black/90" /> */}
      </div>
      {/* Mobile Version */}
      <div className="absolute aspect-50/73 xl:hidden inset-0 w-full">
        <Image
          src={bgImagePhone}
          alt="Jivanjor hero thumbnail"
          fill
          className="object-contain"
          priority
        />
        {/* <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/30 to-black/90" /> */}
      </div>
      <div className="relative mx-auto flex min-h-[calc(100vh-320px)] md:min-h-[calc(100vh-88px)] max-w-360 items-center p-5 lg:px-8">
        <div className="absolute bottom-6 md:bottom-18 flex flex-col max-w-xs md:max-w-md space-y-8">
          <h1 className="text-4xl font-amethysta tracking-[0%] text-white sm:text-5xl max-w-xs md:max-w-fit">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-white/80 leading-normal font-google-sans">
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={primaryLink}
              className="min-w-36 rounded-full bg-white px-6 py-2 text-sm font-medium text-black shadow-lg shadow-black/20 transition hover:bg-white/90 text-center"
            >
              {primaryText}
            </a>
            <a
              href={secondaryLink}
              className="min-w-36 rounded-full border-2 border-white px-6 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-white/5 text-center"
            >
              {secondaryText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
