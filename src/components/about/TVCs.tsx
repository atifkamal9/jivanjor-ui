"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId: string;
}

export default function TVCs() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videos: VideoItem[] = [
    {
      id: "allrounder",
      title: "Jivanjor AllRounder - Jud Gaya Toh Jud Gaya",
      thumbnail: "/images/about/tvc-video-1.png",
      youtubeId: "5F7y8l18Nrc",
    },
    {
      id: "champion",
      title: "Jivanjor Champion - Multi-purpose Adhesive",
      thumbnail: "/images/about/tvc-video-2.png",
      youtubeId: "11mQhW3Zntk",
    },
    {
      id: "allrounder",
      title: "Jivanjor AllRounder - Jud Gaya Toh Jud Gaya",
      thumbnail: "/images/about/tvc-video-1.png",
      youtubeId: "5F7y8l18Nrc",
    },
    {
      id: "champion",
      title: "Jivanjor Champion - Multi-purpose Adhesive",
      thumbnail: "/images/about/tvc-video-2.png",
      youtubeId: "11mQhW3Zntk",
    },
  ];

  const handleOpenVideo = (youtubeId: string) => {
    setActiveVideo(youtubeId);
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
  };

  return (
    <section
      id="tvcs-section"
      className="scroll-mt-36 py-4 md:py-16 bg-surface overflow-visible relative"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex justify-end items-center">
        <img
          src="/images/watermark-footer.png"
          alt="Jivanjor Watermark"
          className="w-1/2 h-full object-contain object-right"
        />
      </div>

      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        {/* Header Icon */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/badge.png"
            alt="Jivanjor Logo Icon"
            width={40}
            height={40}
            className="aspect-square object-contain"
          />
        </div>

        {/* Section Heading */}
        <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-[48px] text-center text-[#222] font-normal mb-6">
          A Brand That Holds It All Together
        </h2>

        {/* Section Subtitle */}
        <p className="font-google-sans text-lg sm:text-xl lg:text-[24px] text-center text-[#222] max-w-4xl mb-12 leading-relaxed">
          Jivanjor brings together product performance and professional know-how
          to support the work that happens before the final finish, inside
          workshops, homes and everyday interiors.
        </p>

        {/* Swiper Slider */}
        <div className="relative w-full max-w-5xl px-8">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
            }}
            navigation={{
              prevEl: ".tvc-swiper-prev",
              nextEl: ".tvc-swiper-next",
            }}
            className="w-full rounded-2xl"
          >
            {videos.map((video) => (
              <SwiperSlide>
                <div
                  key={video.id}
                  onClick={() => handleOpenVideo(video.youtubeId)}
                  className="group relative aspect-620/437 w-full rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border border-black/5 bg-black"
                >
                  {/* Thumbnail */}
                  <Image
                    fill
                    alt={video.title}
                    src={video.thumbnail}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Play className="w-8 h-8 fill-current translate-x-0.5" />
                    </div>
                  </div>

                  {/* Title overlay bottom */}
                  <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 to-transparent p-6 text-white">
                    <p className="font-google-sans text-lg font-medium group-hover:text-primary transition-colors">
                      {video.title}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Carousel Arrows */}
          <button className="tvc-swiper-prev absolute left-0 top-[50%] -translate-y-1/2 z-10 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft className="w-6 h-6 text-[#FF0009]" strokeWidth={2.5} />
          </button>
          <button className="tvc-swiper-next absolute right-0 top-[50%] -translate-y-1/2 z-10 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight
              className="w-6 h-6 text-[#FF0009]"
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in">
          <button
            onClick={handleCloseVideo}
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors cursor-pointer p-2 bg-white/10 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </section>
  );
}
