"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

interface RelatedProduct {
  title: string;
  description: string;
  image: string;
  color: string;
}

const RELATED_PRODUCTS: RelatedProduct[] = [
  {
    title: "Champion Super",
    description:
      "Provides a superior bond and strength, while being non-hazardous.",
    image: "/images/Champion Super.png",
    color: "bg-[#0083CB]",
  },
  {
    title: "Aquabond",
    description:
      "Heatproof and waterproof adhesive made with Cross Linking Polymer",
    image: "/images/Aquabond.png",
    color: "bg-[#077937]",
  },
  {
    title: "Foambond",
    description:
      "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
    image: "/images/Foambond.png",
    color: "bg-[#F57F26]",
  },
  {
    title: "Watershield",
    description:
      "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
    image: "/images/Watershield.png",
    color: "bg-[#007B8A]",
  },
];

{
  /* Header section with link icon */
}
{
  /* <div className="text-center space-y-3 max-w-2xl mx-auto">
//   <div className="text-neutral-800 flex justify-center">
//     {/* Custom Link icon */
}
//     <svg
//       className="w-7 h-7"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//       strokeWidth="2.5"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
//       />
//     </svg>
//   </div>
//   <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-800 leading-tight">
//     Related Products
//   </h2>
// </div> */}

export default function RelatedProducts() {
  return (
    <section id="related-products" className="relative overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center relative mx-auto my-20 max-w-7xl px-6 lg:px-8 w-full">
        <div className="w-full">
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
            {RELATED_PRODUCTS.map((card, idx) => (
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
                    <p className="text-center text-base leading-relaxed max-w-60">
                      {card.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Navigation */}
          <button className="rel-swiper-prev lg:hidden absolute left-0 top-[60%] -translate-y-1/2 z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={44} strokeWidth={2} />
          </button>
          <button className="rel-swiper-next lg:hidden absolute right-0 top-[60%] -translate-y-1/2 z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={44} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
