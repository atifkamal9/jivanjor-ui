import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
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
      className="scroll-mt-36 pt-5 md:pt-16 bg-white"
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
        <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-[48px] text-center text-[#222] font-normal mb-4 max-w-xs md:max-w-2xl w-full mx-auto">
          Recognised for Quality. Built with Responsibility.
        </h2>

        {/* Section Subtitle */}
        <p className="text-lg sm:text-xl lg:text-[24px] text-center text-[#222] max-w-83 md:max-w-4xl mb-4 md:mb-9 mx-auto w-full">
          Jivanjor’s product promise is supported by quality-led facilities,
          recognised environmental practices and a continued focus on
          responsible manufacturing.
        </p>

        {/* 5 Badges Row */}
        <div className="hidden sm:flex w-full flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 mb-8 p-4 md:py-8">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center max-w-45"
            >
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
          ))}
        </div>

        {/* Mobile 5 Badges Slider */}
        <div className="sm:hidden w-full mb-8 py-4 px-2">
          <Swiper
            spaceBetween={16}
            slidesPerView={2}
            grabCursor={true}
            breakpoints={{
              480: {
                slidesPerView: 3,
              },
            }}
            className="w-full"
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
                  <p className="text-sm font-medium text-[#333]">
                    {badge.title}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Sustainability Inner Card */}
        <div className="w-full bg-surface rounded-[20px] p-0 md:p-10 lg:p-12">
          <div className="flex flex-col items-center text-center px-8 pt-10">
            <h3 className="font-amethysta text-[34px] md:text-[36px] text-[#222] font-normal mb-4 max-w-full md:max-w-md">
              A Responsible Approach to Manufacturing
            </h3>
            <p className="text-lg text-[#222] max-w-78 md:max-w-3xl">
              JACPL follows a long-term sustainability approach focused on
              protecting the environment, managing resources responsibly and
              reducing the impact of business operations.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-6 p-6">
            {/* Left Column: Image */}
            <div className="hidden lg:block relative w-125 h-100 rounded-2xl overflow-hidden">
              <Image
                src="/images/about/windmill.png"
                alt="Windmill representing sustainability"
                height={400}
                width={500}
                className="object-cover"
              />
            </div>

            {/* Right Column: Content list */}
            <div className="space-y-6 max-w-2xl pt-2 lg:pt-0">
              {practices.map((practice, index) => (
                <div key={index} className="flex flex-col gap-2.5">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-2.5">
                    <Image
                      src="/images/about/Leaves.svg"
                      className="mt-0.5 shrink-0"
                      alt="Leaves"
                      height={24}
                      width={24}
                    />
                    <div className="flex flex-col items-center md:items-start text-center md:text-start space-y-1 text-[#222] px-8 md:px-0">
                      <h4 className="font-amethysta text-[22px] md:text-[28px] font-medium mb-1 px-2 md:px-0">
                        {practice.title}
                      </h4>
                      <p className="text-base sm:text-lg">{practice.desc}</p>
                    </div>
                  </div>
                  <span className="hidden md:block mx-8 h-px w-full border-b border-black/60" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:hidden relative w-full min-h-100 rounded-2xl overflow-hidden mt-10">
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
