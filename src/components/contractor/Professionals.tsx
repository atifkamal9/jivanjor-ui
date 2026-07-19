"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/contractor/testimonial-1.png",
    showPlayButton: true,
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/contractor/testimonial-2.png",
    showPlayButton: true,
  },
  {
    type: "text",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    quote: "Aquabond kitchen ka specialist hai.",
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/contractor/testimonial-1.png",
    showPlayButton: true,
  },
  {
    type: "text",
    name: "Mr. Mosim Ali",
    role: "Contractor Carpenter",
    quote: "Jivanjor products are highly reliable and strong.",
  },
];

interface ProfessionalsProps {
  data?: {
    title?: string;
    desc?: string;
    testimonials?: {
      type: "video" | "text";
      name: string;
      role: string;
      quote?: string;
      image?: string;
      showPlayButton?: boolean;
    }[];
  };
}

export default function Professionals({ data }: ProfessionalsProps = {}) {
  const title = data?.title || "Built Around India’s Woodworking Professionals";
  const desc = data?.desc || "Jivanjor continues to grow through the trust of carpenters, contractors, dealers and channel partners across India’s woodworking ecosystem.";
  const displayTestimonials = data?.testimonials || testimonials;

  return (
    <section className="relative w-full text-[#222] overflow-hidden">
      <div className="flex flex-col items-center md:items-start text-center md:text-start max-w-4xl px-5 space-y-5">
        {/* Header Title and Subtitle */}
        <div className="flex flex-col space-y-4 max-w-3xl text-center md:text-left">
          <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="text-lg lg:text-2xl">
            {desc}
          </p>
        </div>

        {/* Carousel Container with Navigation */}
        <div className="relative w-full max-w-4xl px-1 md:px-6">
          <Swiper
            modules={[Navigation]}
            watchOverflow={false}
            loop={false}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              prevEl: ".prof-swiper-prev",
              nextEl: ".prof-swiper-next",
              disabledClass: "swiper-button-disabled",
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="w-full"
          >
            {displayTestimonials.map((item, idx) => (
              <SwiperSlide key={idx} className="h-full py-4">
                {item.type === "video" ? (
                  /* Video Card */
                  <div className="relative overflow-hidden w-full max-w-2xs h-85 mx-auto rounded-[20px] flex flex-col group">
                    <Image
                      fill
                      alt={item.name}
                      src={item.image || ""}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Bottom gradient shadow */}
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-b from-transparent to-black/90 h-43 rounded-b-[20px]" />

                    {/* Play circle icon top-right */}
                    {item.showPlayButton && (
                      <div className="absolute top-6 right-6 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 duration-300 cursor-pointer">
                        <svg
                          width="12"
                          height="14"
                          viewBox="0 0 12 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-0.5"
                        >
                          <path d="M12 7L0 14V0L12 7Z" fill="black" />
                        </svg>
                      </div>
                    )}

                    {/* Overlay info */}
                    <div className="absolute bottom-6 left-6 right-6 text-left z-10">
                      <p className="text-white font-bold text-[18px] leading-tight mb-1">
                        {item.name}
                      </p>
                      <p className="text-white/80 font-normal text-[14px] leading-none">
                        {item.role}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Text Card */
                  <div className="w-full max-w-2xs h-85 mx-auto bg-surface rounded-[20px] flex flex-col justify-end p-5 text-left shadow-xs">
                    <p className="font-normal text-[24px] mb-8">
                      "{item.quote}"
                    </p>
                    <div className="text-left">
                      <p className="font-bold text-[16px] leading-tight mb-1">
                        {item.name}
                      </p>
                      <p className="font-normal text-[14px] leading-none">
                        {item.role}
                      </p>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Controls */}
          <button className="prof-swiper-prev absolute -left-6 top-1/2 -translate-y-1/2 z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={44} strokeWidth={2.5} />
          </button>
          <button className="prof-swiper-next absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={44} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
