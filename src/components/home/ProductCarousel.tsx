"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Title, Paragraph } from "@/components/ui";

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
  if (fallbackUrl && fallbackUrl.trim() !== "") return fallbackUrl;
  const n = (name || "").toLowerCase();
  if (n.includes("champion") || n.includes("super"))
    return "/images/Champion Super.png";
  if (n.includes("aquabond") || n.includes("aqua"))
    return "/images/Aquabond.png";
  if (n.includes("foambond") || n.includes("foam"))
    return "/images/Foambond.png";
  if (n.includes("watershield") || n.includes("water") || n.includes("shield"))
    return "/images/Watershield.png";
  return "/images/Champion Super.png";
}

export default function ProductCarousel({ items }: ProductCarouselProps) {
  const colors = [
    "#0083CB",
    "#077937",
    "#F57F26",
    "#0498AA",
  ];

  const defaultProductCards = [
    {
      title: "Champion Super",
      description:
        "Provides a superior bond and strength, while being non-hazardous.",
      color: "#0083CB",
      badge: "Super Premium",
      image: "/images/Champion Super.png",
      ctaText: "",
      ctaLink: "/products",
    },
    {
      title: "Aquabond",
      description:
        "Heatproof and waterproof adhesive made with Cross Linking Polymer.",
      color: "#077937",
      badge: "Waterproof Grade",
      image: "/images/Aquabond.png",
      ctaText: "",
      ctaLink: "/products",
    },
    {
      title: "Foambond",
      description:
        "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
      color: "#F57F26",
      badge: "Speciality",
      image: "/images/Foambond.png",
      ctaText: "",
      ctaLink: "/products",
    },
    {
      title: "Watershield",
      description:
        "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
      color: "#0498AA",
      badge: "Eco Friendly",
      image: "/images/Watershield.png",
      ctaText: "",
      ctaLink: "/products",
    },
  ];

  const cards =
    items && items.length > 0
      ? items.map((item: any, idx: number) => ({
        title: item.title || item.name || "",
        description: item.shortDescription || item.description || "",
        color: item.color || item.themeColor || colors[idx % colors.length],
        badge: item.tag || item.badge || "",
        image: mapProductImage(
          item.title || item.name || "",
          item.image || item.imageUrl,
        ),
        ctaText: item.cta?.text || "Learn More",
        ctaLink: item.cta?.actionPath || (item.slug ? `/products?product=${item.slug}` : "/products"),
      }))
      : defaultProductCards;

  return (
    <section className="relative leading-normal mx-auto max-w-7xl w-full px-10 pt-6 pb-12">
      <Swiper
        key={cards.map((c) => c.title).join("-")}
        modules={[Navigation]}
        observer={true}
        observeParents={true}
        watchOverflow={false}
        centerInsufficientSlides={true}
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
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="w-full overflow-x-clip! overflow-y-visible!"
      >
        {cards.map((card, idx) => (
          <SwiperSlide
            key={`${card.title}-${idx}`}
            className="overflow-visible! px-1"
          >
            <Link
              href={card.ctaLink || "/products"}
              className="flex flex-col items-center relative px-4 group"
            >
              <div className="absolute aspect-44/51 group -top-1/4 w-41 h-48 lg:w-55 lg:h-63 object-contain transition-opacity duration-300 ease-out z-100">
                {/* Floating image */}
                {card.image && (
                  <Image
                    fill
                    priority
                    src={card.image}
                    alt={card.title}
                    className="object-contain group-hover:-translate-y-1 transition-all duration-300 z-100"
                  />
                )}
              </div>
              {/* Card */}
              <div
                className="rounded-[28px] p-6 pt-32 lg:pt-44 flex flex-1 flex-col items-center text-white w-69 min-h-68 lg:w-69 lg:h-93 lg:min-h-88"
                style={{ backgroundColor: card.color || "whitesmoke" }}
              >
                <Title className="font-google-sans text-2xl! font-semibold text-center mb-2">
                  {card.title}
                </Title>
                <div className="w-full h-px bg-white my-4" />
                <Paragraph className="text-center text-base! leading-normal max-w-60">
                  {card.description}
                </Paragraph>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Navigation */}
      <button className="rel-swiper-prev absolute left-1.5 xl:left-0 top-[45%] z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
        <ChevronLeft size={44} strokeWidth={2.5} />
      </button>
      <button className="rel-swiper-next absolute right-1.5 xl:right-0 top-[45%] z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
        <ChevronRight size={44} strokeWidth={2.5} />
      </button>
    </section>
  );
}
