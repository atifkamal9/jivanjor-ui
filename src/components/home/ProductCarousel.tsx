"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    <section className="w-full">
      <Swiper
        modules={[Navigation]}
        watchOverflow={false}
        loop={false}
        spaceBetween={16}
        slidesPerView={1}
        navigation={{
          prevEl: ".product-prev",
          nextEl: ".product-next",
          disabledClass: "swiper-button-disabled",
        }}
        breakpoints={{
          480: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
        className="overflow-visible!"
      >
        {cards.map((card, idx) => (
          <SwiperSlide
            key={`${card.title}-${idx}`}
            className="overflow-visible! px-1"
          >
            <div className="relative pt-24">
              {/* Floating image */}
              <Image
                src={card.image}
                alt={card.title}
                width={300}
                height={300}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-60 object-contain z-100"
              />
              {/* Card */}
              <div
                className={`${card.color} rounded-[28px] p-6 flex flex-col justify-end items-center text-white shadow-xl min-h-90 w-full`}
              >
                <h3 className="text-2xl font-semibold text-center">
                  {card.title}
                </h3>
                <div className="w-full h-px bg-white my-4" />
                <p className="text-center text-base leading-normal max-w-60">
                  {card.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-12">
        <button className="cursor-pointer product-prev w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center transition-all hover:bg-primary hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <button className="cursor-pointer product-next w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center transition-all hover:bg-primary hover:text-white">
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}
