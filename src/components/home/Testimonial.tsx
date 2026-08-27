"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Heading, Subtitle, Paragraph, BodyText } from "@/components/ui";

import "swiper/css";
import "swiper/css/free-mode";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

interface TestimonialItem {
  type?: "video" | "text" | string;
  name?: string;
  role?: string;
  videoUrl?: string;
  image?: string;
  quote?: string;
  showPlayButton?: boolean;
}

interface TestimonialProps {
  data?: {
    enabled?: boolean;
    hideSection?: boolean;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    items?: TestimonialItem[];
    testimonials?: TestimonialItem[];
  };
}

const defaultTestimonials: TestimonialItem[] = [
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    videoUrl: "#",
    image: "/images/2.jpeg",
    showPlayButton: true,
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/1.jpeg",
    videoUrl: "#",
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
    image: "/images/3.jpeg",
    videoUrl: "#",
    showPlayButton: true,
  },
  {
    type: "text",
    name: "Mr. Mosim Ali",
    role: "Contractor Carpenter",
    quote: "Jivanjor products are highly reliable and strong.",
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/3.jpeg",
    videoUrl: "#",
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
    image: "/images/2.jpeg",
    videoUrl: "#",
    showPlayButton: true,
  },
  {
    type: "text",
    name: "Mr. Mosim Ali",
    role: "Contractor Carpenter",
    quote: "Jivanjor products are highly reliable and strong.",
  },
  {
    type: "video",
    name: "Mr. Imran Saifi",
    role: "Contractor Carpenter",
    image: "/images/1.jpeg",
    videoUrl: "#",
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
    image: "/images/2.jpeg",
    videoUrl: "#",
    showPlayButton: true,
  },
  {
    type: "text",
    name: "Mr. Mosim Ali",
    role: "Contractor Carpenter",
    quote: "Jivanjor products are highly reliable and strong.",
    image: "/images/2.jpeg",
  },
];

export default function Testimonial({ data }: TestimonialProps) {
  if (!data || data.enabled === false || data.hideSection === true) {
    return null;
  }

  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const title = data?.title || "Trusted by People Who Know the Work";
  const subtitle =
    data?.subtitle ||
    "Hear from carpenters, contractors and dealers who rely on Jivanjor for real projects.";
  const ctaText = data?.ctaText || "Partner With Us";
  const ctaLink = data?.ctaLink || "#";

  const testimonialsList =
    data?.items && data.items.length > 0
      ? data.items
      : data?.testimonials && data.testimonials.length > 0
        ? data.testimonials
        : defaultTestimonials;

  return (
    <section className="relative overflow-hidden mt-8 md:mt-12 leading-normal">
      <div className="flex flex-col items-center justify-center text-center relative mx-auto max-w-360 w-full space-y-6">
        <div className="flex flex-col items-center justify-center text-center relative">
          <Image
            className="mb-4"
            src="/images/badge.png"
            width={40}
            height={40}
            alt="badge"
          />
          <Heading className="font-normal leading-normal max-w-md 2xl:max-w-lg">{title}</Heading>
          <Subtitle className="text-[#222] my-4 px-6 md:px-0 max-w-xl">
            {subtitle}
          </Subtitle>
          <a
            href={ctaLink}
            className="hidden md:inline-flex items-center justify-center font-medium min-w-35 px-6 py-2 rounded-3xl text-sm bg-linear-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-90 transition-opacity text-center"
          >
            {ctaText}
          </a>
        </div>

        {/* Drag-to-scroll Swiper Carousel */}
        {/* <div className="w-full relative overflow-visible cursor-grab active:cursor-grabbing"> */}
        <div className="relative mx-auto w-full px-10">
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
            className="w-full"
          >
            {testimonialsList.map((item, idx) => (
              <SwiperSlide key={idx} className="overflow-visible!">
                {item.type === "video" ? (
                  // Video Card
                  <div
                    onClick={() => setActiveVideoUrl(item.videoUrl || "#")}
                    className="relative overflow-hidden w-full max-w-78 h-85 mx-auto rounded-[20px] flex flex-col group cursor-pointer"
                  >
                    <Image
                      src={item.image || ""}
                      alt={item.name || "Testimonial"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-b from-transparent to-black/90 h-43 rounded-b-[21px]" />

                    {/* Play circle icon */}
                    {item.showPlayButton !== false && (
                      <div className="absolute top-6 right-6 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 duration-300">
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

                    <div className="absolute bottom-6 left-7.5 right-7.5 text-left z-10">
                      <Paragraph className="text-white font-bold text-[18px] leading-tight mb-1 font-google-sans">
                        {item.name}
                      </Paragraph>
                      <BodyText className="text-white/80 font-normal text-[14px] leading-none font-google-sans">
                        {item.role}
                      </BodyText>
                    </div>
                  </div>
                ) : item.type === "image" ? (
                  // Image & Quote Card
                  <div className="relative overflow-hidden w-full max-w-78 h-85 mx-auto rounded-[20px] flex flex-col justify-end p-7.5 text-left group">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.name || "Testimonial"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/25 to-black/55 rounded-[20px]" />
                    <div className="relative z-10 text-left">
                      {item.quote && (
                        <Paragraph className="text-white font-normal text-[20px] leading-[1.2] font-google-sans mb-4 drop-shadow-xs">
                          "{item.quote}"
                        </Paragraph>
                      )}
                      <Paragraph className="text-white font-bold text-[16px] leading-tight mb-1 font-google-sans">
                        {item.name}
                      </Paragraph>
                      <BodyText className="text-white/80 font-normal text-[14px] leading-none font-google-sans">
                        {item.role}
                      </BodyText>
                    </div>
                  </div>
                ) : (
                  // Text Card
                  <div className="w-full max-w-78 h-85 mx-auto bg-[#f5f5f5] rounded-[21px] flex flex-col justify-end p-7.5 text-left">
                    <Paragraph className="text-[#222] font-normal text-[24px] leading-[1.2] font-google-sans mb-6">
                      {item.quote}
                    </Paragraph>
                    <div className="text-left">
                      <Paragraph className="text-[#222] font-bold text-[16px] leading-tight mb-1 font-google-sans">
                        {item.name}
                      </Paragraph>
                      <BodyText className="text-[#222]/80 font-normal text-[14px] leading-none font-google-sans">
                        {item.role}
                      </BodyText>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Navigation */}
          <button className="rel-swiper-prev absolute left-0 lg:-left-2 top-[50%] -translate-y-1/2 z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={44} strokeWidth={2.5} />
          </button>
          <button className="rel-swiper-next absolute right-0 lg:-right-2 top-[50%] -translate-y-1/2 z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={44} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Modal View */}
      {activeVideoUrl !== null && (
        <div
          onClick={() => setActiveVideoUrl(null)}
          className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
        >
          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 hover:text-[#ed1c24] transition-all cursor-pointer shadow-md"
              title="Close Video"
            >
              <X size={24} />
            </button>

            {/* Video Player */}
            <div className="w-full h-full flex items-center justify-center">
              {getYouTubeId(activeVideoUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeVideoUrl)}?autoplay=1`}
                  className="w-full h-full border-0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  src={
                    activeVideoUrl && activeVideoUrl !== "#"
                      ? activeVideoUrl
                      : "/videos/testimonial-placeholder.mp4"
                  }
                  className="w-full h-full object-cover bg-black"
                  controls
                  autoPlay
                  playsInline
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
