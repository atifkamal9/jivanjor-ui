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

export interface HeroSlideData {
  id?: string;
  type?: "image" | "video";
  bgImage?: string;
  bgImagePhone?: string;
  videoUrl?: string;
  video?: string;
  cta1?: {
    text?: string;
    link?: string;
  };
  cta2?: {
    text?: string;
    link?: string;
  };
  title?: string;
}

interface HeroProps {
  data?: {
    title?: string;
    subtitle?: string;
    badgeText?: string;
    backgroundImage?: string;
    bgImage?: string;
    ctaText?: string;
    ctaLink?: string;
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
    slides?: HeroSlideData[];
  };
}

interface SlideItem {
  id: string;
  type: "image" | "video";
  bgImage: string;
  bgImagePhone: string;
  hasVideo: boolean;
  videoUrl?: string;
  cta1?: {
    text?: string;
    link?: string;
  };
  cta2?: {
    text?: string;
    link?: string;
  };
  title?: string;
}

export default function Hero({ data }: HeroProps) {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const slides: SlideItem[] = data?.slides && data.slides.length > 0
    ? data.slides.map((s, idx) => {
      const isVid = s.type === "video" || isVideo(s.videoUrl || s.video || "");
      const desktopImg = s.bgImage || (isVid ? "/images/video-thumbnail.png" : "/images/hero.png");
      const mobileImg = s.bgImagePhone || s.bgImage || (isVid ? "/images/video-thumbnail.png" : "/images/hero.png");
      return {
        id: s.id || `slide-${idx}`,
        type: isVid ? "video" : "image",
        bgImage: desktopImg,
        bgImagePhone: mobileImg,
        hasVideo: isVid,
        videoUrl: s.videoUrl || s.video || "",
        cta1: s.cta1,
        cta2: s.cta2,
        title: s.title,
      };
    })
    : (data?.media && data.media.length > 0
      ? data.media.map((url, idx) => {
        const isVid = isVideo(url);
        return {
          id: `slide-${idx}`,
          type: isVid ? "video" : "image",
          bgImage: isVid ? "/images/video-thumbnail.png" : url,
          bgImagePhone: isVid ? "/images/video-thumbnail.png" : url,
          hasVideo: isVid,
          videoUrl: isVid ? url : "",
        };
      })
      : [
        {
          id: "slide-1",
          type: "image",
          bgImage: data?.bgImage || data?.backgroundImage || "/images/hero.png",
          bgImagePhone: data?.bgImage || data?.backgroundImage || "/images/hero.png",
          hasVideo: false,
          videoUrl: "",
          cta1: {
            text: data?.actionButtons?.primary?.text || data?.ctaText || "Explore Products",
            link: data?.actionButtons?.primary?.actionPath || data?.ctaLink || "#product-section",
          },
          cta2: {
            text: data?.actionButtons?.secondary?.text || "About Jivanjor",
            link: data?.actionButtons?.secondary?.actionPath || "/about",
          },
        },
        {
          id: "slide-2",
          type: "image",
          bgImage: data?.bgImage || data?.backgroundImage || "/images/hero (1).png",
          bgImagePhone: data?.bgImage || data?.backgroundImage || "/images/hero (1) mobile.png",
          hasVideo: false,
          videoUrl: "",
          cta1: {
            text: data?.actionButtons?.primary?.text || data?.ctaText || "Explore Products",
            link: data?.actionButtons?.primary?.actionPath || data?.ctaLink || "#product-section",
          },
          cta2: {
            text: data?.actionButtons?.secondary?.text || "About Jivanjor",
            link: data?.actionButtons?.secondary?.actionPath || "/about",
          },
        },
        {
          id: "slide-3",
          type: "video",
          bgImage: data?.bgImage || data?.backgroundImage || "/images/video-thumbnail.png",
          bgImagePhone: data?.bgImage || data?.backgroundImage || "/images/video-thumbnail.png",
          hasVideo: true,
          videoUrl: "/videos/hero-background.mp4",
          cta1: {
            text: data?.actionButtons?.primary?.text || data?.ctaText || "Explore Products",
            link: data?.actionButtons?.primary?.actionPath || data?.ctaLink || "#product-section",
          },
          cta2: {
            text: data?.actionButtons?.secondary?.text || "About Jivanjor",
            link: data?.actionButtons?.secondary?.actionPath || "/about",
          },
        },
      ]
    );

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

  const activeTitle = currentSlide?.title || data?.title || "Dependable Bonds for Indian Homes";
  const activeCta1Text = currentSlide?.cta1?.text || data?.actionButtons?.primary?.text || data?.ctaText || "Explore Products";
  const activeCta1Link = currentSlide?.cta1?.link || data?.actionButtons?.primary?.actionPath || data?.ctaLink || "#product-section";
  const activeCta2Text = currentSlide?.cta2?.text || data?.actionButtons?.secondary?.text || "About Jivanjor";
  const activeCta2Link = currentSlide?.cta2?.link || data?.actionButtons?.secondary?.actionPath || "/about";

  return (
    <section className="relative w-full h-146 lg:h-130 2xl:h-164.5 overflow-hidden bg-black text-white">
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
                    className="w-full h-full object-center object-cover"
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
                      fill
                      unoptimized
                      src={slide.bgImagePhone}
                      alt="Jivanjor hero mobile background"
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
                      fill
                      unoptimized
                      src={slide.bgImage}
                      alt="Jivanjor hero desktop background"
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
          <div className="absolute bottom-20 lg:bottom-14.5 2xl:bottom-18.25 left-7 xl:left-17.25 right-7 xl:right-17.25 flex flex-col items-start pointer-events-auto max-w-60 sm:max-w-94 xl:max-w-100">
            {/* Title */}
            <h1 className="text-[24px] sm:text-[32px] lg:text-[42px] font-amethysta tracking-[0%] text-white leading-[0.95]">
              {activeTitle}
            </h1>

            {/* Action Buttons */}
            <div className="flex items-center mt-4.25 xl:mt-2 gap-4.25 xl:gap-3.75">
              {activeCta1Text && (
                <a
                  href={activeCta1Link}
                  className="w-37.5 h-8.5 rounded-full bg-white text-[#1c1c1c] text-sm font-medium transition hover:bg-white/90 flex items-center justify-center text-center font-google-sans"
                >
                  {activeCta1Text}
                </a>
              )}
              {activeCta2Text && (
                <a
                  href={activeCta2Link}
                  className="w-37.5 h-8.5 rounded-full border-[1.5px] border-white text-white text-sm font-medium transition hover:bg-white/10 flex items-center justify-center text-center font-google-sans"
                >
                  {activeCta2Text}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Pagination (inside section, but outside Swiper so it's statically placed) */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-2.5 z-30">
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
        <div className="absolute bottom-5 right-6.25 lg:bottom-14.5 2xl:bottom-18.25 flex items-center gap-3 z-30">
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
