"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

interface CarouselItem {
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  color?: string;
  badge?: string;
  tag?: string;
  image?: string;
  imageUrl?: string;
  cta?: {
    text?: string;
    actionPath?: string;
  };
}

interface ProductCarouselProps {
  items?: CarouselItem[];
}

function mapProductImage(name: string, fallbackUrl?: string) {
  const n = name.toLowerCase();
  if (n.includes("champion") || n.includes("super"))
    return "/images/Champion Super.png";
  if (n.includes("aquabond") || n.includes("aqua"))
    return "/images/Aquabond.png";
  if (n.includes("foambond") || n.includes("foam"))
    return "/images/Foambond.png";
  if (n.includes("watershield") || n.includes("water") || n.includes("shield"))
    return "/images/Watershield.png";
  return fallbackUrl || "/images/Champion Super.png";
}

export default function ProductCarousel({ items }: ProductCarouselProps) {
  const colors = [
    "bg-[#0083CB]",
    "bg-[#077937]",
    "bg-[#F57F26]",
    "bg-[#0498AA]",
  ];

  const defaultProductCards = [
    {
      title: "Champion Super",
      description:
        "Provides a superior bond and strength, while being non-hazardous.",
      color: "bg-[#0083CB]",
      badge: "Super Premium",
      image: "/images/Champion Super.png",
      ctaText: "",
      ctaLink: "",
    },
    {
      title: "Aquabond",
      description:
        "Heatproof and waterproof adhesive made with Cross Linking Polymer.",
      color: "bg-[#077937]",
      badge: "Waterproof Grade",
      image: "/images/Aquabond.png",
      ctaText: "",
      ctaLink: "",
    },
    {
      title: "Foambond",
      description:
        "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
      color: "bg-[#F57F26]",
      badge: "Speciality",
      image: "/images/Foambond.png",
      ctaText: "",
      ctaLink: "",
    },
    {
      title: "Watershield",
      description:
        "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
      color: "bg-[#0498AA]",
      badge: "Eco Friendly",
      image: "/images/Watershield.png",
      ctaText: "",
      ctaLink: "",
    },
  ];

  const cards =
    items && items.length > 0
      ? items.map((item, idx) => ({
          title: item.title || item.name || "",
          description: item.description || "",
          color: item.color || colors[idx % colors.length],
          badge: item.tag || item.badge || "",
          image: mapProductImage(
            item.title || item.name || "",
            item.imageUrl || item.image,
          ),
          ctaText: item.cta?.text || "",
          ctaLink: item.cta?.actionPath || "",
        }))
      : defaultProductCards;

  return (
    <section className="relative leading-normal mx-auto max-w-7xl w-full px-10 pb-12">
      <Swiper
        modules={[Navigation]}
        watchOverflow={false}
        loop={false}
        spaceBetween={16}
        slidesPerView={1}
        navigation={{
          prevEl: ".rel-swiper-prev",
          nextEl: ".rel-swiper-next",
          disabledClass: "swiper-button-disabled",
        }}
        breakpoints={{
          480: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="overflow-visible!"
      >
        {defaultProductCards.map((card, idx) => (
          <SwiperSlide
            key={`${card.title}-${idx}`}
            className="overflow-visible! px-1"
          >
            <div className="flex flex-col items-center relative px-4 mt-8">
              <div className="absolute aspect-44/51 top-[-30%] w-41 h-48 xl:w-55 xl:h-63 object-contain z-100">
                {/* Floating image */}
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain z-10"
                  priority
                  // className="absolute aspect-44/51 top-[-28%] w-60 h-65 object-contain z-100"
                />
              </div>
              {/* Card */}
              <div
                className={`${card.color} relative rounded-[28px] flex-1 w-69 min-h-68 lg:w-69 lg:h-93 lg:min-h-88`}
              >
                <div className="absolute bottom-2.5 flex flex-col items-center justify-stretch p-6 text-white">
                  <h3 className="text-2xl font-semibold text-center my-4 pb-4 px-12 border-b">
                    {card.title}
                  </h3>
                  <p className="text-center text-base max-w-50">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Navigation */}
      <button className="rel-swiper-prev absolute left-1.5 xl:left-0 top-[50%] -translate-y-1/2 z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
        <ChevronLeft size={44} strokeWidth={2.5} />
      </button>
      <button className="rel-swiper-next absolute right-1.5 xl:right-0 top-[50%] -translate-y-1/2 z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
        <ChevronRight size={44} strokeWidth={2.5} />
      </button>
    </section>
  );
}
