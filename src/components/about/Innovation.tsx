"use client";

import Image from "next/image";
import Link from "next/link";

interface InnovationProps {
  data?: {
    title?: string;
    bgImage?: string;
    mobileBgImage?: string;
    mobileImage?: string;
    items?: Array<{
      title?: string;
      desc?: string;
    }>;
    ctaText?: string;
    ctaLink?: string;
  };
}

export default function Innovation({ data }: InnovationProps) {
  const title = data?.title || "Built on Innovation That Drives Performance";
  const bgImage = data?.bgImage || "/images/about/about-innovation-bg.png";
  const mobileBgImage = data?.mobileBgImage || data?.mobileImage || bgImage;
  const defaultCards = [
    {
      title: "Equipped R&D",
      desc: "A dedicated facility focused on adhesive development and product improvement.",
    },
    {
      title: "Application Testing",
      desc: "Testing-led developments to support practical bonding and usage needs.",
    },
    {
      title: "Advanced Chemistries",
      desc: "Research across adhesive technologies, wood finishes and performance-led formulations.",
    },
  ];
  const cards = data?.items && data.items.length > 0 ? data.items : defaultCards;
  const ctaText = data?.ctaText || "Explore Applications";
  const ctaLink = data?.ctaLink || "/applications";

  return (
    <section
      id="research-innovation"
      className="scroll-mt-36 relative w-full overflow-hidden min-h-153.75 flex items-center pt-6 md:pt-10"
    >
      {/* Background Image with Overlay */}
      <div className="hidden md:block absolute inset-0 z-0 mt-12">
        <Image
          src={bgImage}
          alt="R&D Lab background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradients to darken and style as shown in Figma */}
        <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/30 to-black/15 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-br from-[#772571]/20 to-black/40 mix-blend-color-burn" />
      </div>

      <div className="flex flex-col items-center lg:items-start bg-surface md:bg-transparent relative w-full z-10 pb-4 md:pb-0">
        <div className="relative md:hidden min-h-116 min-w-100 w-full h-full">
          <Image
            src={mobileBgImage}
            alt="R&D Lab background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradients to darken and style as shown in Figma */}
        </div>
        <div className="px-5 lg:px-20">
          {/* Title */}
          <h2 className="font-amethysta text-center md:text-start text-[28px] sm:text-3xl lg:text-[38px] mx-auto md:mx-0 md:px-0 max-w-80.5 md:max-w-lg font-normal my-6 sm:my-7 text-foreground md:text-white">
            {title}
          </h2>

          {/* Cards Desktop */}
          <div className="hidden md:grid grid-cols-3 gap-4 w-full mb-8 max-w-3xl">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col justify-between transition-all duration-300 bg-surface min-h-64 w-61 rounded-[20px] px-5 py-7 hover:bg-white"
              >
                <div>
                  <h2 className="font-amethysta text-[21px] mb-3 pb-3 border-b max-w-43">
                    {card.title}
                  </h2>
                  <p className="text-lg max-w-48">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Cards Mobile */}
          <div className="flex flex-col gap-4 text-foreground md:hidden w-full">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col justify-between transition-all duration-300 bg-white p-6 rounded-[20px]"
              >
                <div>
                  <h2 className="font-amethysta text-2xl mb-3 pb-3 border-b">
                    {card.title}
                  </h2>
                  <p className="text-base">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Explore Applications Button */}
          <div className="p-5 md:p-0 text-center md:text-start">
            <Link
              href={ctaLink}
              className="inline-flex items-center justify-center font-medium text-base md:text-lg rounded-full px-8 py-2 bg-linear-to-r from-[#FF0009] to-[#772571] text-white hover:scale-105 transition-transform duration-200"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

