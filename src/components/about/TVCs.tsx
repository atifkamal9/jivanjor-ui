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

interface TVCsProps {
  data?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      id: string;
      title: string;
      thumbnail: string;
      youtubeId: string;
    }>;
  };
}

export default function TVCs({ data }: TVCsProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const title = data?.title || "A Brand That Holds It All Together";
  const subtitle = data?.subtitle || "Jivanjor brings together product performance and professional know-how to support the work that happens before the final finish, inside workshops, homes and everyday interiors.";

  const defaultVideos: VideoItem[] = [
    {
      id: "allrounder",
      title: "Jivanjor AllRounder - Jud Gaya Toh Jud Gaya",
      thumbnail: "/images/about/about-video-1.png",
      youtubeId: "5F7y8l18Nrc",
    },
    {
      id: "champion",
      title: "Jivanjor Champion - Multi-purpose Adhesive",
      thumbnail: "/images/about/about-video-2.png",
      youtubeId: "11mQhW3Zntk",
    },
    {
      id: "allrounder",
      title: "Jivanjor AllRounder - Jud Gaya Toh Jud Gaya",
      thumbnail: "/images/about/about-video-1.png",
      youtubeId: "5F7y8l18Nrc",
    },
    {
      id: "champion",
      title: "Jivanjor Champion - Multi-purpose Adhesive",
      thumbnail: "/images/about/about-video-2.png",
      youtubeId: "11mQhW3Zntk",
    },
  ];

  const videos = data?.items && data.items.length > 0 ? data.items : defaultVideos;

  const handleOpenVideo = (youtubeId: string) => {
    setActiveVideo(youtubeId);
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
  };

  return (
    <section
      id="tvcs-section"
      className="scroll-mt-36 mt-4 py-10 md:py-12 bg-surface overflow-visible relative text-[#222]"
    >
      {/* Decorative Background Elements */}
      {/* <div className="absolute inset-0 pointer-events-none opacity-5 flex justify-end items-center">
        <img
          src="/images/watermark-footer.png"
          alt="Jivanjor Watermark"
          className="w-1/2 h-full object-contain object-right"
        />
      </div> */}

      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        {/* Section Heading */}
        <h2 className="font-amethysta text-[34px] sm:text-4xl lg:text-5xl text-center font-normal mb-6 max-w-87.5 md:max-w-5xl">
          {title}
        </h2>

        {/* Section Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-center max-w-82.5 md:max-w-5xl mb-8">
          {subtitle}
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
                    <div className="w-8 md:w-16 h-8 md:h-16 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Play className="w-4 md:w-8 h-4 md:h-8 fill-current" />
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
