import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Responsibility() {
  const badges = [
    {
      title: "GreenPro Awards 2023",
      src: "/images/about/badge-greenpro.png",
      isCustom: false,
    },
    {
      title: "EcoVadis Awards 2023",
      src: "/images/about/badge-ecovadis.png",
      isCustom: false,
    },
    {
      title: "Chairman's Annual Award 24-25",
      src: "/images/about/badge-chairman.png",
      isCustom: false,
    },
    {
      title: "ISO 9001 Compliant Facilities",
      src: "/images/about/badge-iso-sprite.png",
      isCustom: true,
      crop: "left",
    },
    {
      title: "ISO 14001 Compliant Facilities",
      src: "/images/about/badge-iso-sprite.png",
      isCustom: true,
      crop: "right",
    },
    {
      title: "EcoVadis Awards 2023 (1)",
      src: "/images/about/badge-ecovadis.png",
      isCustom: false,
    },
    {
      title: "Chairman's Annual Award 24-25 (1)",
      src: "/images/about/badge-chairman.png",
      isCustom: false,
    },
  ];

  const practices = [
    {
      title: "Use Resources Carefully",
      desc: "Practices focused on saving natural resources and energy.",
    },
    {
      title: "Reduce Waste and Pollutants",
      desc: "Efforts to reduce industrial waste and environmental pollutants from business operations.",
    },
    {
      title: "Lower Substances of Concern",
      desc: "Efforts to reduce industrial waste and environmental pollutants from business operations.",
    },
    {
      title: "Act with Environmental Awareness",
      desc: "Encouraging conversation-minded practices across the organisation.",
    },
  ];

  return (
    <section
      id="responsibility-section"
      className="scroll-mt-36 mt-6 md:mt-12 bg-white text-[#222]"
    >
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Header Icon */}
        <div className="mb-4 flex justify-center">
          <Image
            src="/images/badge.png"
            alt="Jivanjor Logo Icon"
            width={40}
            height={40}
            className="aspect-square object-contain"
          />
        </div>
        {/* Section Heading */}
        <h2 className="font-amethysta text-[34px] md:text-[48px] text-center font-normal mb-4 max-w-xs md:max-w-2xl w-full mx-auto">
          Recognised for Quality. Built with Responsibility.
        </h2>

        {/* Section Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl text-center max-w-83 md:max-w-4xl mb-4 md:mb-9 mx-auto w-full">
          Jivanjor’s product promise is supported by quality-led facilities,
          recognised environmental practices and a continued focus on
          responsible manufacturing.
        </p>

        {/* Badges Slider (Mobile & Desktop) */}
        <div
          className="w-full mb-8 pt-1 sm:p-2 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <style>{`
            .responsibility-swiper .swiper-wrapper {
              transition-timing-function: linear !important;
            }
          `}</style>
          <Swiper
            modules={[Autoplay]}
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={4000}
            spaceBetween={24}
            slidesPerView={2}
            breakpoints={{
              480: {
                slidesPerView: 2.5,
                spaceBetween: 24,
              },
              640: {
                slidesPerView: 3.5,
                spaceBetween: 32,
              },
              768: {
                slidesPerView: 4.5,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 48,
              },
            }}
            allowTouchMove={false}
            className="w-full responsibility-swiper"
          >
            {badges.map((badge, idx) => (
              <SwiperSlide key={idx} className="flex justify-center">
                <div className="flex flex-col items-center text-center max-w-45 mx-auto">
                  {/* Badge Image */}
                  <div className="relative w-22.5 h-22.5 mb-4 flex items-center justify-center">
                    {!badge.isCustom ? (
                      <Image
                        src={badge.src}
                        alt={badge.title}
                        width={90}
                        height={90}
                        className="object-contain hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="relative w-22 h-22 overflow-hidden rounded-md border border-black/5 bg-white hover:scale-110 transition-transform duration-300">
                        <img
                          src={badge.src}
                          alt={badge.title}
                          className="absolute h-full max-w-none top-0 w-[200%] object-cover"
                          style={{
                            left: badge.crop === "left" ? "0%" : "-100%",
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {/* Badge Label */}
                  <p className="text-sm md:text-base font-medium text-[#333]">
                    {badge.title}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Sustainability Inner Card */}
        <div className="w-full bg-surface rounded-[20px] p-0 md:p-10 lg:p-12">
          <div className="flex flex-col items-center text-center px-8 pt-10 md:pt-2">
            <h3 className="font-amethysta text-[34px] md:text-5xl font-normal mb-4 max-w-full md:max-w-xl">
              A Responsible Approach to Manufacturing
            </h3>
            <p className="text-lg md:text-2xl max-w-78 md:max-w-5xl">
              JACPL follows a long-term sustainability approach focused on
              protecting the environment, managing resources responsibly and
              reducing the impact of business operations.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-6 p-4 md:p-8">
            {/* Left Column: Image */}
            <div className="hidden lg:block relative w-126 h-101 rounded-2xl overflow-hidden">
              <Image
                src="/images/about/windmill.png"
                alt="Windmill representing sustainability"
                className="object-center object-contain"
                height={404}
                width={504}
              />
            </div>

            {/* Right Column: Content list */}
            <div className="space-y-6 max-w-148 pt-2">
              {practices.map((practice, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-2.5">
                    <Image
                      src="/images/about/Leaves.svg"
                      className="mt-0.5 shrink-0"
                      alt="Leaves"
                      height={24}
                      width={24}
                    />
                    <div className="flex flex-col items-center justify-center self-stretch leading-normal md:items-start text-center md:text-start px-10 md:px-0 gap-1">
                      <h3 className="font-amethysta text-[22px] md:text-[28px] font-medium">
                        {practice.title}
                      </h3>
                      <p className="text-base sm:text-lg">{practice.desc}</p>
                    </div>
                  </div>
                  {/* Border */}
                  <span className="hidden md:block mx-8 h-px w-full border-b border-black/60 pt-2" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:hidden relative w-full min-h-100 rounded-2xl overflow-hidden mt-6">
            <Image
              src="/images/about/windmill.png"
              alt="Windmill representing sustainability"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
