"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";

interface TestimonialProps {
  data?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  };
}

const defaultTestimonials = [
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    videoUrl: "#",
    image: "/images/3.jpeg"
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/1.jpeg",
    videoUrl: "#"
  },
  {
    type: "text",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    quote: "Aquabond kitchen ka specialist hai."
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/2.jpeg",
    videoUrl: "#"
  },
  {
    type: "text",
    name: "Mr. Mosim Ali",
    role: "Contractor Carpenter",
    quote: "Jivanjor products are highly reliable and strong."
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/3.jpeg",
    videoUrl: "#"
  },
  {
    type: "text",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    quote: "Aquabond kitchen ka specialist hai."
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/2.jpeg",
    videoUrl: "#"
  },
  {
    type: "text",
    name: "Mr. Mosim Ali",
    role: "Contractor Carpenter",
    quote: "Jivanjor products are highly reliable and strong."
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/1.jpeg",
    videoUrl: "#"
  },
  {
    type: "text",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    quote: "Aquabond kitchen ka specialist hai."
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/2.jpeg",
    videoUrl: "#"
  },
  {
    type: "text",
    name: "Mr. Mosim Ali",
    role: "Contractor Carpenter",
    quote: "Jivanjor products are highly reliable and strong.",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=500&q=80"
  }
];

export default function Testimonial({ data }: TestimonialProps) {
  const title = data?.title || "Trusted by People Who Know the Work";
  const subtitle = data?.subtitle || "Hear from carpenters, contractors and dealers who rely on Jivanjor for real projects.";
  const ctaText = data?.ctaText || "Partner With Us";
  const ctaLink = data?.ctaLink || "#";

  return (
    <section className="relative overflow-hidden my-20">
      <div className="flex flex-col items-center justify-center text-center relative mx-auto max-w-360 px-6 lg:px-8 w-full space-y-6">
        <div className="flex flex-col items-center justify-center text-center relative max-w-180">
          <Image
            className="mb-4"
            src="/images/badge.png"
            width={40}
            height={40}
            alt="badge"
          />
          <h2 className="font-amethysta text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="text-2xl font-google-sans leading-relaxed text-foreground/80 my-4">
            {subtitle}
          </p>
          <a href={ctaLink} className="inline-flex items-center justify-center font-medium min-w-35 px-6 py-2 rounded-3xl text-sm bg-linear-to-tr from-[#FF0009] to-[#772571] text-white hover:opacity-90 transition-opacity text-center">
            {ctaText}
          </a>
        </div>

        {/* Drag-to-scroll Swiper Carousel */}
        <div className="w-full relative overflow-visible cursor-grab active:cursor-grabbing">
          <Swiper
            modules={[FreeMode]}
            freeMode={true}
            watchOverflow={false}
            loop={true}
            spaceBetween={16}
            slidesPerView={"auto"}
            className="overflow-visible!"
          >
            {defaultTestimonials.map((item, idx) => (
              <SwiperSlide key={idx} className="w-[280px]!">
                {item.type === "video" ? (
                  // Video Card
                  <div className="relative overflow-hidden w-[280px] h-[340px] rounded-[28px] flex flex-col group border border-border shadow-md bg-zinc-900">
                    <Image
                      src={item.image || ""}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                    {/* Play circle icon */}
                    <div className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300">
                      <span className="text-black text-sm pl-0.5">▶</span>
                    </div>

                    <div className="absolute bottom-6 left-6 text-left space-y-1">
                      <p className="text-white font-extrabold text-lg tracking-tight">{item.name}</p>
                      <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider font-google-sans">{item.role}</p>
                    </div>
                  </div>
                ) : (
                  // Text Card
                  <div className="w-[280px] h-[340px] bg-surface border border-border rounded-[28px] flex flex-col justify-between p-6 shadow-md text-left">
                    <div className="flex-1 flex items-center">
                      <p className="text-foreground font-amethysta text-2xl leading-normal font-normal">
                        “{item.quote}”
                      </p>
                    </div>
                    <div className="space-y-1 pt-4 border-t border-border/10">
                      <p className="text-foreground font-extrabold text-base tracking-tight">{item.name}</p>
                      <p className="text-foreground/45 text-[10px] font-bold uppercase tracking-wider font-google-sans">{item.role}</p>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
