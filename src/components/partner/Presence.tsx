import Link from "next/link";
import Image from "next/image";

const stats = [
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

interface PresenceProps {
  data?: {
    title?: string;
    items?: { value: string; label: string; icon: string; width?: number; height?: number }[];
  };
}

export default function Presence({ data }: PresenceProps = {}) {
  const title = data?.title || "A Presence Built Through Trust";
  const displayStats = data?.items || stats;

  return (
    <section className="w-full">
      <div className="flex flex-col items-center md:items-start text-center md:text-start max-w-4xl px-5 space-y-5">
        {/* Title */}
        <h2 className="font-amethysta text-[36px] sm:text-4xl lg:text-[48px] font-normal text-[#222] leading-tight">
          {title}
        </h2>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-6 mb-4">
          {displayStats.map((stat, idx) => {
            const isLast = idx === displayStats.length - 1;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center md:items-start justify-between text-center md:text-start p-2 transition-shadow duration-300 text-[#222] ${
                  isLast ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                {/* Stat Icon */}
                <div className="aspect-square h-16 flex items-center justify-center mb-2">
                  <Image
                    src={stat.icon}
                    alt={stat.label}
                    width={stat.width || 60}
                    height={stat.height || 60}
                    className="object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {/* Stat Number & Label */}
                <div className="flex-1 flex-col space-y-1">
                  <div className="text-[26px] text-3xl xl:text-[34px] font-medium">
                    {stat.value}
                  </div>
                  <div className="text-base md:text-xl">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <div className="pt-4 text-left">
          <Link
            href="/products"
            className="inline-flex items-center justify-center font-google-sans font-medium text-base rounded-full px-8 py-3 bg-linear-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-90 transition-opacity shadow-md cursor-pointer"
          >
            Explore Products
          </Link>
        </div>
      </div>
    </section>
  );
}
