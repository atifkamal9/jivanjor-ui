"use client";

import Image from "next/image";

interface PromiseProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      title?: string;
      desc?: string;
      icon?: string;
    }>;
  };
}

export default function Promise({ data }: PromiseProps) {
  const title = data?.title || "The Promise of Stronger Bonds";
  const subtitle = data?.subtitle || "Jivanjor is built around the needs of woodworking professionals, channel partners and end users who look for dependable adhesive solutions.";

  const defaultCards = [
    {
      title: "Quality-Led Products",
      desc: "Adhesive solutions built around consistent performance and practical use.",
      icon: "/images/about/Ad-product.svg",
    },
    {
      title: "Woodworking Focus",
      desc: "Products designed for furniture, interiors, laminates and everyday woodwork needs.",
      icon: "/images/about/Distribute-vertically.svg",
    },
    {
      title: "Trade Understanding",
      desc: "A brand connected with the professionals and partners who shape adhesive choices.",
      icon: "/images/about/Spanner.svg",
    },
    {
      title: "Application Confidence",
      desc: "Guidance, product information and support to help users choose and apply better.",
      icon: "/images/about/Worker.svg",
    },
  ];

  const cards = data?.items && data.items.length > 0 ? data.items : defaultCards;

  return (
    <section
      id="about-jivanjor"
      className="scroll-mt-36 mt-6 md:mt-8 text-[#222]"
    >
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Header Logo Icon */}
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
        <h2 className="font-amethysta text-[34px] lg:text-[48px] text-center font-normal mb-4">
          {title}
        </h2>

        {/* Section Subtitle */}
        <p className="text-xl lg:text-[24px] text-center max-w-4xl mb-7">
          {subtitle}
        </p>

        {/* 4 Cards Grid */}
        <div className="w-full bg-surface rounded-3xl p-12 sm:p-12.5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center justify-center">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex flex-1 flex-col items-center text-center transition-all duration-300 max-w-65 lg:max-w-60.5"
              >
                <div className="flex items-center justify-center mb-2.5 md:mb-5">
                  <Image
                    src={card.icon || "/images/about/Ad-product.svg"}
                    className="aspect-square w-10 h-10"
                    height={40}
                    width={40}
                    alt="icon"
                  />
                </div>
                <h3 className="font-amethysta text-[22px] md:text-[32px] mb-2.5 md:mb-5">
                  {card.title}
                </h3>
                <p className="text-base md:text-lg max-w-60 md:max-w-full">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

