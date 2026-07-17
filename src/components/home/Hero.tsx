"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

const isVideo = (url: string) =>
  /\.(mp4|webm|mov)(\?.*)?$/i.test(url) || url.includes("video");

interface HeroProps {
  data?: {
    title?: string;
    subtitle?: string; // fallback
    desc?: string; // user request
    badgeText?: string;
    backgroundImage?: string; // fallback
    bgImage?: string; // user request
    ctaText?: string; // fallback
    ctaLink?: string; // fallback
    video?: string;
    actionButtons?: {
      primary?: {
        text?: string;
        actionPath?: string;
      };
      secondary?: {
        text?: string;
        actionPath?: string;
      };
    };
    media?: string[];
  };
}

interface SlideItem {
  id: string;
  bgImage: string;
  bgImagePhone: string;
  hasVideo: boolean;
  videoUrl?: string;
}

export default function Hero({ data }: HeroProps) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const slides: SlideItem[] = data?.media && data.media.length > 0
    ? data.media.map((url, idx) => {
      const isVid = isVideo(url);
      return {
        id: `slide-${idx}`,
        bgImage: isVid ? "/images/video-thumbnail.png" : url,
        bgImagePhone: isVid ? "/images/video-thumbnail.png" : url,
        hasVideo: isVid,
        videoUrl: isVid ? url : "",
      };
    })
    : [
      {
        id: "slide-1",
        bgImage: data?.bgImage || data?.backgroundImage || "/images/hero.png",
        bgImagePhone:
          data?.bgImage || data?.backgroundImage || "/images/hero.png",
        hasVideo: false,
        videoUrl: "",
      },
      {
        id: "slide-2",
        bgImage: data?.bgImage || data?.backgroundImage || "/images/hero (1).png",
        bgImagePhone:
          data?.bgImage || data?.backgroundImage || "/images/hero (1) mobile.png",
        hasVideo: false,
        videoUrl: "",
      },
      {
        id: "slide-3",
        bgImage:
          data?.bgImage || data?.backgroundImage || "/images/video-thumbnail.png",
        bgImagePhone:
          data?.bgImage || data?.backgroundImage || "/images/video-thumbnail.png",
        hasVideo: true,
        videoUrl: "/videos/hero-background.mp4",
      },
    ];

  const handlePlayVideo = () => {
    if (isPlayingVideo) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlayingVideo(false);
      if (swiperInstance && swiperInstance.autoplay) {
        swiperInstance.autoplay.start();
      }
    } else {
      setIsPlayingVideo(true);
      if (swiperInstance && swiperInstance.autoplay) {
        swiperInstance.autoplay.stop();
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlayingVideo(false);
    if (swiperInstance && swiperInstance.autoplay) {
      swiperInstance.autoplay.start();
    }
  };

  const currentSlide = slides[activeIndex];
  const showPlayButton = currentSlide?.hasVideo;

  return (
    <section className="relative w-full h-146.75 xl:h-164.5 overflow-hidden bg-black text-white">
      <Swiper
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
          if (isPlayingVideo) {
            setIsPlayingVideo(false);
            if (videoRef.current) {
              videoRef.current.pause();
            }
          }
        }}
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide, idx) => {
          const isCurrentSlide = idx === activeIndex;
          const showVideo = isPlayingVideo && isCurrentSlide;

          return (
            <SwiperSlide
              key={slide.id}
              className="relative w-full h-full overflow-hidden"
            >
              {/* Background Layer */}
              {showVideo ? (
                <div className="absolute inset-0 z-0 bg-black">
                  <video
                    ref={videoRef}
                    src={slide.videoUrl || "/videos/hero-background.mp4"}
                    className="w-full h-full object-center object-fill"
                    autoPlay
                    playsInline
                    muted={isMuted}
                    onEnded={handleVideoEnded}
                  />
                  {/* Mobile Version Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none xl:hidden z-10"
                    style={{
                      background:
                        "linear-gradient(53.58deg, rgba(0, 0, 0, 0.63) 22.03%, rgba(0, 0, 0, 0.34) 56.11%, rgba(102, 102, 102, 0) 95.1%)",
                    }}
                  />
                  {/* Desktop Version Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none hidden xl:block z-10"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(0, 0, 0, 0.17) 0%, rgba(0, 0, 0, 0.17) 100%), linear-gradient(41.78deg, rgba(0, 0, 0, 0.88) 6.87%, rgba(102, 102, 102, 0) 54.68%)",
                    }}
                  />
                </div>
              ) : (
                <>
                  {/* Mobile Version Background */}
                  <div className="absolute inset-0 xl:hidden z-0">
                    <Image
                      src={slide.bgImagePhone}
                      alt="Jivanjor hero mobile background"
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(53.58deg, rgba(0, 0, 0, 0.63) 22.03%, rgba(0, 0, 0, 0.34) 56.11%, rgba(102, 102, 102, 0) 95.1%)",
                      }}
                    />
                  </div>

                  {/* Desktop Version Background */}
                  <div className="absolute inset-0 hidden xl:block z-0">
                    <Image
                      src={slide.bgImage}
                      alt="Jivanjor hero desktop background"
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(0, 0, 0, 0.17) 0%, rgba(0, 0, 0, 0.17) 100%), linear-gradient(41.78deg, rgba(0, 0, 0, 0.88) 6.87%, rgba(102, 102, 102, 0) 54.68%)",
                      }}
                    />
                  </div>
                </>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Content Wrapper - Static overlay over background slides */}
      <div className="absolute inset-0 pointer-events-none z-20 flex items-end">
        <div className="relative mx-auto max-w-360 h-full w-full">
          <div className="absolute bottom-26.5 xl:bottom-18.25 left-7 xl:left-17.25 right-7 xl:right-17.25 flex flex-col items-start pointer-events-auto">
            {/* Title */}
            <h1 className="text-[40px] xl:text-[70px] font-amethysta tracking-[0%] text-white leading-[0.95] max-w-82.25 xl:max-w-184">
              {data?.title || "Dependable Bonds for Indian Homes"}
            </h1>

            {/* Action Buttons */}
            <div className="flex items-center mt-4.25 xl:mt-1 gap-4.25 xl:gap-3.75">
              <a
                href={data?.actionButtons?.primary?.actionPath || data?.ctaLink || "#product-section"}
                className="w-37.5 h-8.5 rounded-full bg-white text-[#1c1c1c] text-sm font-medium transition hover:bg-white/90 flex items-center justify-center text-center font-google-sans"
              >
                {data?.actionButtons?.primary?.text || data?.ctaText || "Explore Products"}
              </a>
              <a
                href={data?.actionButtons?.secondary?.actionPath || "/about"}
                className="w-37.5 h-8.5 rounded-full border-[1.5px] border-white text-white text-sm font-medium transition hover:bg-white/10 flex items-center justify-center text-center font-google-sans"
              >
                {data?.actionButtons?.secondary?.text || "About Jivanjor"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Pagination (inside section, but outside Swiper so it's statically placed) */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-2.5 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (swiperInstance) {
                  swiperInstance.slideToLoop(idx);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === activeIndex
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Play Video / Audio Controls */}
      {showPlayButton && (
        <div className="absolute bottom-6.25 right-6.25 xl:bottom-18.25 xl:right-17.25 flex items-center gap-3 z-30">
          {isPlayingVideo && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-9.75 h-[40.1px] xl:w-[60.5px] xl:h-[62.2px] bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 duration-300 cursor-pointer text-[#2D2D2D]"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 xl:w-7.5 xl:h-7.5" />
              ) : (
                <Volume2 className="w-4 h-4 xl:w-7.5 xl:h-7.5" />
              )}
            </button>
          )}
          <button
            onClick={handlePlayVideo}
            className="w-9.75 h-[40.1px] xl:w-[60.5px] xl:h-[62.2px] bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 duration-300 cursor-pointer text-[#2D2D2D]"
            title={isPlayingVideo ? "Stop Video" : "Play Video"}
          >
            {isPlayingVideo ? (
              <Pause className="fill-[#2D2D2D] w-4 h-4 xl:w-7.5 xl:h-7.5" />
            ) : (
              <Play className="fill-[#2D2D2D] w-4 h-4 xl:w-7.5 xl:h-7.5" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}
