"use client";

import Image from "next/image";
import Link from "next/link";

export default function Presence() {
  const stats = [
    {
      value: "Pan-India",
      label: "Market Presence",
      icon: "/images/about/icon-market-presence.png",
      width: 70,
      height: 69,
    },
    {
      value: "27,000+",
      label: "Distribution Touchpoints",
      icon: "/images/about/icon-distribution.png",
      width: 56,
      height: 54,
    },
    {
      value: "275K+",
      label: "Trusting Woodworking Professionals",
      icon: "/images/about/icon-professionals.png",
      width: 42,
      height: 48,
    },
    {
      value: "8 High-Tech",
      label: "Manufacturing Facilities",
      icon: "/images/about/icon-facilities.png",
      width: 58,
      height: 64,
    },
    {
      value: "20+",
      label: "Product Variants",
      icon: "/images/about/icon-variants.png",
      width: 53,
      height: 56,
    },
  ];

  return (
    <section id="presence-section" className="scroll-mt-36 py-16 bg-white">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Header Icon */}
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
          A Presence Built Through Trust
        </h2>

        {/* Section Subtitle */}
        <p className="font-google-sans text-lg sm:text-xl lg:text-[24px] text-center text-[#222] max-w-4xl mb-12 leading-relaxed">
          Jivanjor brings together product performance and professional know-how
          to support the work that happens before the final finish, inside
          workshops, homes and everyday interiors.
        </p>

        {/* Stats Row */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-stretch mb-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-between text-center p-6 transition-shadow duration-300"
            >
              {/* Stat Icon */}
              <div className="h-16 flex items-center justify-center mb-4 mix-blend-multiply">
                <Image
                  src={stat.icon}
                  alt=""
                  width={stat.width}
                  height={stat.height}
                  className="object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Stat Number & Label */}
              <div className="space-y-1">
                <div className="font-google-sans text-xl sm:text-2xl lg:text-[28px] font-bold text-[#222]">
                  {stat.value}
                </div>
                <div className="font-google-sans text-sm sm:text-base text-[#222] leading-snug">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center font-google-sans font-medium text-sm sm:text-base rounded-full min-w-44 px-6 py-2 bg-linear-to-r from-[#FF0009] to-[#772571] text-white hover:scale-105 transition-transform duration-200 shadow-md"
          >
            Explore Products
          </Link>
          <Link
            href="/partner"
            className="inline-flex items-center justify-center font-google-sans font-medium text-sm sm:text-base rounded-full min-w-44 px-6 py-2 border-2 border-[#FF0009] text-[#FF0009] hover:bg-[#FF0009]/5 hover:scale-105 transition-all duration-200"
          >
            Partner With Us
          </Link>
        </div>
      </div>
    </section>
  );
}
