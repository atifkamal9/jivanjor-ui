"use client";

import Image from "next/image";
import Link from "next/link";
import { Heading, Title, Subtitle, Paragraph } from "@/components/ui";

interface PresenceProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      value?: string;
      label?: string;
      icon?: string;
      width?: number;
      height?: number;
    }>;
    ctaExplore?: {
      text?: string;
      actionPath?: string;
    };
    ctaPartner?: {
      text?: string;
      actionPath?: string;
    };
  };
}

export default function Presence({ data }: PresenceProps) {
  const title = data?.title || "A Presence Built Through Trust";
  const subtitle = data?.subtitle || "Jivanjor brings together product performance and professional know-how to support the work that happens before the final finish, inside workshops, homes and everyday interiors.";

  const defaultStats = [
    {
      value: "Pan-India",
      label: "Market Presence",
      icon: "/images/about/presence.svg",
      width: 70,
      height: 69,
    },
    {
      value: "27,000+",
      label: "Distribution Touchpoints",
      icon: "/images/about/distribution.svg",
      width: 56,
      height: 54,
    },
    {
      value: "275K+",
      label: "Trusting Woodworking Professionals",
      icon: "/images/about/professionals.svg",
      width: 42,
      height: 48,
    },
    {
      value: "8 High-Tech",
      label: "Manufacturing Facilities",
      icon: "/images/about/facilities.svg",
      width: 58,
      height: 64,
    },
    {
      value: "20+",
      label: "Product Variants",
      icon: "/images/about/variants.svg",
      width: 53,
      height: 56,
    },
  ];

  const stats = data?.items && data.items.length > 0 ? data.items : defaultStats;
  const exploreText = data?.ctaExplore?.text || "Explore Products";
  const exploreLink = data?.ctaExplore?.actionPath || "/products";
  const partnerText = data?.ctaPartner?.text || "Partner With Us";
  const partnerLink = data?.ctaPartner?.actionPath || "/partner";

  return (
    <section
      id="our-presence"
      className="scroll-mt-36 my-6 md:my-12 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xd:px-10 2xl:px-8 flex flex-col items-center">
        {/* Header Icon */}
        <div className="mb-4 flex justify-center">
          <Image
            src="/images/badge.png"
            alt="Jivanjor Logo Icon"
            width={40}
            height={40}
            className="aspect-square object-contain"
          />
        </div>

        {/* Section Heading */}
        <Heading className="text-center text-[#222] mb-5">
          {title}
        </Heading>

        {/* Section Subtitle */}
        <Subtitle className="text-center text-[#222] max-w-83 md:max-w-5xl mb-4 md:mb-6">
          {subtitle}
        </Subtitle>

        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 items-stretch justify-items-center mb-0 md:mb-4">
          {stats.map((stat, idx) => {
            const isLast = idx === stats.length - 1;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-between text-center p-2 transition-shadow duration-300 text-[#222] ${isLast ? "col-span-2 md:col-span-1" : ""
                  }`}
              >
                {/* Stat Icon */}
                <div className="aspect-square h-16 flex items-center justify-center mb-2">
                  <Image
                    src={stat.icon || "/images/about/presence.svg"}
                    alt={stat.label || "stat icon"}
                    width={stat.width || 56}
                    height={stat.height || 54}
                    className="object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Stat Number & Label */}
                <div className="flex-1 flex-col space-y-1">
                  <Title className="font-google-sans! font-medium">
                    {stat.value}
                  </Title>
                  <Paragraph>{stat.label}</Paragraph>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <Link
            href={exploreLink}
            className="inline-flex items-center justify-center font-medium text-sm sm:text-base rounded-full min-w-44 px-6 py-2 bg-linear-to-r from-[#FF0009] to-[#772571] text-white hover:scale-105 transition-transform duration-200 shadow-md"
          >
            {exploreText}
          </Link>
          <Link
            href={partnerLink}
            className="hidden md:inline-flex items-center justify-center font-medium text-sm sm:text-base rounded-full min-w-44 px-6 py-2 active-gradient-border-surface text-[#FF0009] hover:bg-[#FF0009]/5 hover:scale-105 transition-all duration-200"
          >
            {partnerText}
          </Link>
        </div>
      </div>
    </section>
  );
}

