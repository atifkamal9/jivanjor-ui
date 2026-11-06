"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Heading } from "@/components/ui";
import { getYouTubeId, getYouTubeThumbnail, isVideoUrl } from "@/lib/video";

import "swiper/css";
import "swiper/css/effect-fade";

export { getYouTubeId };

export interface HeroSlideData {
  id?: string;
  type?: "image" | "video";
  bgImage?: string;
  bgImagePhone?: string;
  videoUrl?: string;
  video?: string;
  showOverlay?: boolean;
  showTitle?: boolean;
  showCta?: boolean;
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
    showTitle?: boolean;
    showCta?: boolean;
  };
}

interface SlideItem {
  id: string;
  type: "image" | "video";
  bgImage: string;
  bgImagePhone: string;
  hasVideo: boolean;
  videoUrl?: string;
  showOverlay?: boolean;
  showTitle?: boolean;
  showCta?: boolean;
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
  const [isEnded, setIsEnded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [origin, setOrigin] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const swiperRef = useRef<any>(null);
  const endTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const slides: SlideItem[] = useMemo(() => {
    if (data?.slides && data.slides.length > 0) {
      return data.slides.map((s, idx) => {
        const vidSource = s.videoUrl || s.video || "";
        const ytId = getYouTubeId(vidSource);
        const isVid = s.type === "video" || Boolean(ytId) || isVideoUrl(vidSource);
        const ytThumb = ytId ? (getYouTubeThumbnail(ytId, "maxres") || getYouTubeThumbnail(ytId, "hq") || "") : "";
        const desktopImg = s.bgImage || ytThumb || (isVid ? "/images/video-thumbnail.png" : "/images/hero.png");
        const mobileImg = s.bgImagePhone || s.bgImage || ytThumb || (isVid ? "/images/video-thumbnail.png" : "/images/hero.png");
        return {
          id: s.id || `slide-${idx}`,
          type: (isVid ? "video" : "image") as "image" | "video",
          bgImage: desktopImg,
          bgImagePhone: mobileImg,
          hasVideo: isVid,
          videoUrl: vidSource,
          showOverlay: s.showOverlay,
          showTitle: s.showTitle,
          showCta: s.showCta,
          cta1: s.cta1,
          cta2: s.cta2,
          title: s.title,
        };
      });
    }

    if (data?.media && data.media.length > 0) {
      return data.media.map((url, idx) => {
        const ytId = getYouTubeId(url);
        const isVid = Boolean(ytId) || isVideoUrl(url);
        const ytThumb = ytId ? (getYouTubeThumbnail(ytId, "maxres") || getYouTubeThumbnail(ytId, "hq") || "") : "";
        return {
          id: `slide-${idx}`,
          type: (isVid ? "video" : "image") as "image" | "video",
          bgImage: isVid ? (ytThumb || "/images/video-thumbnail.png") : url,
          bgImagePhone: isVid ? (ytThumb || "/images/video-thumbnail.png") : url,
          hasVideo: isVid,
          videoUrl: isVid ? url : "",
        };
      });
    }

    return [
      {
        id: "slide-1",
        type: "image" as const,
        title: "Dependable Bonds for Indian Homes",
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
        type: "image" as const,
        title: "Strong Adhesion for Precision Woodwork",
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
        type: "video" as const,
        title: "Innovative Adhesives for Every Surface",
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
    ];
  }, [data]);

  const sendYouTubeCommand = (func: string, args: any[] = []) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    } catch {
      // ignore
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
    sendYouTubeCommand(nextMuted ? "mute" : "unMute");
  };

  const handlePlayVideo = () => {
    const swiper = swiperRef.current || swiperInstance;
    if (isEnded) {
      handleReplayVideo();
      return;
    }
    if (isPlayingVideo) {
      setIsPlayingVideo(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
      sendYouTubeCommand("pauseVideo");
      if (swiper && swiper.autoplay) {
        swiper.autoplay.start();
      }
    } else {
      setIsPlayingVideo(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      sendYouTubeCommand("playVideo");
      if (swiper && swiper.autoplay) {
        swiper.autoplay.stop();
      }
    }
  };

  const handleReplayVideo = () => {
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }
    setIsEnded(false);
    setIsPlayingVideo(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }

    sendYouTubeCommand("seekTo", [0, true]);
    sendYouTubeCommand("playVideo");

    const swiper = swiperRef.current || swiperInstance;
    if (swiper && swiper.autoplay) {
      swiper.autoplay.stop();
    }
  };

  const handleVideoEnded = () => {
    setIsPlayingVideo(false);
    setIsEnded(true);

    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }

    const swiper = swiperRef.current || swiperInstance;
    // If multiple slides exist, wait 4 seconds so the user can see and click Replay before auto-advancing
    if (swiper && slides.length > 1) {
      endTimerRef.current = setTimeout(() => {
        setIsEnded(false);
        swiper.slideNext();
        if (swiper.autoplay) {
          swiper.autoplay.start();
        }
      }, 4000);
    }
  };

  // Autoplay video as soon as a video slide comes into view; pause Swiper auto-rotation while video plays
  useEffect(() => {
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }
    setIsEnded(false);

    const current = slides[activeIndex];
    const swiper = swiperRef.current || swiperInstance;
    if (current?.hasVideo) {
      setIsPlayingVideo(true);
      if (swiper && swiper.autoplay) {
        swiper.autoplay.stop();
      }
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
      sendYouTubeCommand("seekTo", [0, true]);
      sendYouTubeCommand("playVideo");
    } else {
      setIsPlayingVideo(false);
      if (swiper && swiper.autoplay && !swiper.autoplay.running) {
        swiper.autoplay.start();
      }
    }
  }, [activeIndex, swiperInstance, slides]);

  // Listen to YouTube player state changes to detect when video finishes (YT.PlayerState.ENDED = 0)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      let msgData: any = event.data;
      if (typeof msgData === "string") {
        try {
          msgData = JSON.parse(msgData);
        } catch {
          return;
        }
      }

      let playerState: number | undefined;
      if (msgData?.event === "onStateChange" && typeof msgData?.info === "number") {
        playerState = msgData.info;
      } else if (
        msgData?.event === "infoDelivery" &&
        typeof msgData?.info?.playerState === "number"
      ) {
        playerState = msgData.info.playerState;
      }

      if (playerState === 0) {
        handleVideoEnded();
      } else if (playerState === 1) {
        setIsPlayingVideo(true);
        setIsEnded(false);
      } else if (playerState === 2) {
        setIsPlayingVideo(false);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      if (endTimerRef.current) {
        clearTimeout(endTimerRef.current);
      }
    };
  }, [swiperInstance, slides.length]);

  const currentSlide = slides[activeIndex];
  const showPlayButton = currentSlide?.hasVideo;

  return (
    <section className="relative w-full h-130 xd:h-142 2xl:h-164.5 overflow-hidden bg-black text-white">
      <Swiper
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          if (endTimerRef.current) {
            clearTimeout(endTimerRef.current);
            endTimerRef.current = null;
          }
          setIsEnded(false);
          setActiveIndex(swiper.realIndex);
          if (videoRef.current) {
            videoRef.current.pause();
          }
          sendYouTubeCommand("pauseVideo");
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
          const showVideo = isCurrentSlide && slide.hasVideo;
          const shouldShowTitle = slide.showTitle !== false && data?.showTitle !== false;
          const shouldShowCta = slide.showCta !== false && data?.showCta !== false;
          const slideTitle = slide.title || data?.title || "Dependable Bonds for Indian Homes";
          const slideCta1Text = slide.cta1?.text || data?.actionButtons?.primary?.text || data?.ctaText || "Explore Products";
          const slideCta1Link = slide.cta1?.link || data?.actionButtons?.primary?.actionPath || data?.ctaLink || "#product-section";
          const slideCta2Text = slide.cta2?.text || data?.actionButtons?.secondary?.text || "About Jivanjor";
          const slideCta2Link = slide.cta2?.link || data?.actionButtons?.secondary?.actionPath || "/about";

          return (
            <SwiperSlide
              key={slide.id}
              className="relative w-full h-full overflow-hidden"
            >
              {/* Background Layer */}
              {showVideo ? (
                <div className="absolute inset-0 z-0 bg-black overflow-hidden">
                  {getYouTubeId(slide.videoUrl) ? (
                    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black">
                      <iframe
                        ref={iframeRef}
                        onLoad={() => {
                          try {
                            iframeRef.current?.contentWindow?.postMessage(
                              JSON.stringify({ event: "listening" }),
                              "*"
                            );
                          } catch {}
                          sendYouTubeCommand("addEventListener", ["onStateChange"]);
                          if (isMuted) {
                            sendYouTubeCommand("mute");
                          } else {
                            sendYouTubeCommand("unMute");
                          }
                          sendYouTubeCommand("playVideo");
                        }}
                        src={`https://www.youtube.com/embed/${getYouTubeId(slide.videoUrl)}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&playsinline=1&enablejsapi=1${origin ? `&origin=${encodeURIComponent(origin)}` : ""}`}
                        className="absolute top-1/2 left-1/2 pointer-events-none border-0"
                        style={{
                          width: "max(100%, 177.78vh)",
                          height: "max(100%, 56.25vw)",
                          minWidth: "100%",
                          minHeight: "100%",
                          transform: "translate(-50%, -50%) scale(1.08)",
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        title={slideTitle}
                      />
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      src={slide.videoUrl || "/videos/hero-background.mp4"}
                      className="w-full h-full object-center object-cover"
                      autoPlay
                      playsInline
                      muted={isMuted}
                      onEnded={handleVideoEnded}
                    />
                  )}
                  {/* Mobile & Desktop Version Overlays */}
                  {slide.showOverlay !== false && (
                    <>
                      <div
                        className="absolute inset-0 pointer-events-none xl:hidden z-10"
                        style={{
                          background:
                            "linear-gradient(53.58deg, rgba(0, 0, 0, 0.63) 22.03%, rgba(0, 0, 0, 0.34) 56.11%, rgba(102, 102, 102, 0) 95.1%)",
                        }}
                      />
                      <div
                        className="absolute inset-0 pointer-events-none hidden xl:block z-10"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(0, 0, 0, 0.17) 0%, rgba(0, 0, 0, 0.17) 100%), linear-gradient(41.78deg, rgba(0, 0, 0, 0.88) 6.87%, rgba(102, 102, 102, 0) 54.68%)",
                        }}
                      />
                    </>
                  )}
                  {/* Center Replay Button Overlay */}
                  {isEnded && (
                    <div className="absolute inset-0 z-25 flex flex-col items-center justify-center pointer-events-auto">
                      <button
                        onClick={handleReplayVideo}
                        className="group flex flex-col items-center gap-3 p-4 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/25 text-white shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                        title="Replay"
                        aria-label="Replay"
                      >
                        <div className="w-13 h-13 xl:w-16 xl:h-16 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                          <RotateCcw className="w-6.5 h-6.5 xl:w-8 xl:h-8 text-white transition-transform duration-500 group-hover:-rotate-180" />
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Mobile Version Background */}
                  <div className="absolute inset-0 xl:hidden z-0">
                    <Image
                      fill
                      src={slide.bgImagePhone}
                      alt="Jivanjor hero mobile background"
                      className="object-cover"
                      priority={idx === 0}
                    />
                    {slide.showOverlay !== false && (
                      <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          background:
                            "linear-gradient(53.58deg, rgba(0, 0, 0, 0.63) 22.03%, rgba(0, 0, 0, 0.34) 56.11%, rgba(102, 102, 102, 0) 95.1%)",
                        }}
                      />
                    )}
                  </div>

                  {/* Desktop Version Background */}
                  <div className="absolute inset-0 hidden xl:block z-0">
                    <Image
                      fill
                      src={slide.bgImage}
                      alt="Jivanjor hero desktop background"
                      className="object-cover"
                      priority={idx === 0}
                    />
                    {slide.showOverlay !== false && (
                      <div
                        className="absolute inset-0 pointer-events-none z-10"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(0, 0, 0, 0.17) 0%, rgba(0, 0, 0, 0.17) 100%), linear-gradient(41.78deg, rgba(0, 0, 0, 0.88) 6.87%, rgba(102, 102, 102, 0) 54.68%)",
                        }}
                      />
                    )}
                  </div>
                </>
              )}

              {/* Content Wrapper for this slide */}
              {(shouldShowTitle || shouldShowCta) && (
                <div className="absolute inset-0 pointer-events-none z-20 flex items-end">
                  <div className="relative mx-auto max-w-360 h-full w-full">
                    <div className="absolute bottom-20 lg:bottom-14 2xl:bottom-18 left-7 xl:left-10 right-7 xl:right-10 flex flex-col items-start pointer-events-auto max-w-82 md:max-w-92 xd:max-w-110">
                      {/* Title */}
                      {shouldShowTitle && slideTitle && (
                        <Heading className="text-[32px]! sm:text-[36px]! xd:text-[44px]! tracking-[0%] text-white leading-[0.95]">
                          {slideTitle}
                        </Heading>
                      )}

                      {/* Action Buttons */}
                      {shouldShowCta && (slideCta1Text || slideCta2Text) && (
                        <div className="flex items-center mt-4.25 xl:mt-2 gap-4.25 xl:gap-3.75">
                          {slideCta1Text && (
                            <Link
                              href={slideCta1Link}
                              className="w-37.5 h-8.5 rounded-full bg-white text-[#1c1c1c] text-sm font-medium transition hover:bg-white/90 flex items-center justify-center text-center font-google-sans"
                            >
                              {slideCta1Text}
                            </Link>
                          )}
                          {slideCta2Text && (
                            <Link
                              href={slideCta2Link}
                              className="w-37.5 h-8.5 rounded-full border-[1.5px] border-white text-white text-sm font-medium transition hover:bg-white/10 flex items-center justify-center text-center font-google-sans"
                            >
                              {slideCta2Text}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

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
          <button
            onClick={handleToggleMute}
            className="w-9.75 h-[40.1px] xl:w-[60.5px] xl:h-[62.2px] bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 duration-300 cursor-pointer text-[#2D2D2D]"
            title={isMuted ? "Unmute" : "Mute"}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 xl:w-7.5 xl:h-7.5" />
            ) : (
              <Volume2 className="w-4 h-4 xl:w-7.5 xl:h-7.5" />
            )}
          </button>
          <button
            onClick={isEnded ? handleReplayVideo : handlePlayVideo}
            className="w-9.75 h-[40.1px] xl:w-[60.5px] xl:h-[62.2px] bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 duration-300 cursor-pointer text-[#2D2D2D]"
            title={isEnded ? "Replay Video" : isPlayingVideo ? "Pause Video" : "Play Video"}
            aria-label={isEnded ? "Replay video" : isPlayingVideo ? "Pause video" : "Play video"}
          >
            {isEnded ? (
              <RotateCcw className="w-4 h-4 xl:w-7.5 xl:h-7.5 text-[#2D2D2D]" />
            ) : isPlayingVideo ? (
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
