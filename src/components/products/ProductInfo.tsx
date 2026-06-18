"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ProductFeatures from "./ProductFeatures";
import RelatedProducts from "./RelatedProducts";
import ProductFaq from "./ProductFaq";

type TabName = "Overview" | "Tech Specs" | "USPs" | "Applications" | "FAQs";

export default function ProductInfo() {
  const [activeTab, setActiveTab] = useState<TabName>("Overview");
  const [isManualScroll, setIsManualScroll] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const tabs: { name: TabName; label: string; icon: React.ReactNode }[] = [
    {
      name: "Overview",
      label: "Overview",
      icon: (
        <Image
          src="/icons/overview.svg"
          className="aspect-square"
          alt="Overview"
          width={20}
          height={20}
        />
      ),
    },
    {
      name: "Tech Specs",
      label: "Tech Specs",
      icon: (
        <Image
          src="/icons/Table-report.svg"
          className="aspect-square"
          alt="Tech Specs"
          width={20}
          height={20}
        />
      ),
    },
    {
      name: "USPs",
      label: "USPs",
      icon: (
        <Image
          src="/icons/Star.svg"
          className="aspect-square"
          alt="USPs"
          width={20}
          height={20}
        />
      ),
    },
    {
      name: "Applications",
      label: "Applications",
      icon: (
        <Image
          src="/icons/Blocks-and-arrows.svg"
          className="aspect-square"
          alt="Applications"
          width={20}
          height={20}
        />
      ),
    },
    {
      name: "FAQs",
      label: "FAQs",
      icon: (
        <Image
          src="/icons/File-question.svg"
          className="aspect-square"
          alt="FAQs"
          width={20}
          height={20}
        />
      ),
    },
  ];

  const handleTabClick = (tabName: TabName) => {
    setActiveTab(tabName);
    const elementId = tabName.toLowerCase().replace(" ", "-");
    const el = document.getElementById(elementId);
    if (el) {
      setIsManualScroll(true);
      // Offset: mobile (innerWidth < 1024) has only top header (~90px offset), desktop has top header + top sticky tab bar (~180px offset)
      const isMobile =
        typeof window !== "undefined" && window.innerWidth < 1024;
      const yOffset = isMobile ? -90 : -180;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setTimeout(() => {
        setIsManualScroll(false);
      }, 800);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isManualScroll) return;

      const sections: TabName[] = [
        "Overview",
        "Tech Specs",
        "USPs",
        "Applications",
        "FAQs",
      ];
      // Offset buffer: 95px on mobile, 185px on desktop
      const isMobile =
        typeof window !== "undefined" && window.innerWidth < 1024;
      const offset = isMobile ? 95 : 185;
      const scrollPosition = window.scrollY + offset;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const elementId = section.toLowerCase().replace(" ", "-");
        const el = document.getElementById(elementId);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.pageYOffset;
          if (scrollPosition >= top) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isManualScroll]);

  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeIndex = tabs.findIndex((t) => t.name === activeTab);
      const activeElement = tabsContainerRef.current.children[
        activeIndex
      ] as HTMLElement;
      if (activeElement) {
        const container = tabsContainerRef.current;
        const targetScrollLeft =
          activeElement.offsetLeft -
          container.clientWidth / 2 +
          activeElement.clientWidth / 2;
        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [activeTab]);

  return (
    <section className="max-w-360 mx-auto p-5 lg:px-8">
      {/* Desktop Tab bar header pill container - Sticky with Scroll Spy */}
      <div className="hidden lg:flex sticky top-22 z-40 py-2 -mx-6 px-6 md:mx-0 md:px-0 items-center justify-center w-full">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .scrollbar-none::-webkit-scrollbar {
              display: none;
            }`,
          }}
        />
        <div
          ref={tabsContainerRef}
          className="flex items-center bg-white rounded-full my-4 p-px max-w-full overflow-x-auto gap-1 md:gap-2 shrink-0 scrollbar-none"
          style={{
            boxShadow: `4px 4px 12.1px 4px rgba(0, 0, 0, 0.10)`,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-base transition-all cursor-pointer select-none shrink-0 ${
                  isActive
                    ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white shadow-[0_4px_12px_rgba(163,22,82,0.25)]"
                    : "hover:bg-surface transition-colors"
                }`}
              >
                <span className={isActive ? "invert" : ""}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Sticky Bottom Tab Bar (Visible on mobile/tablet, hidden on desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center justify-around w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className={`flex flex-col items-center justify-center gap-1 p-1.5 rounded-xl transition-all duration-200 select-none cursor-pointer flex-1 max-w-20 ${
                isActive
                  ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white shadow-[0_4px_12px_rgba(163,22,82,0.15)]"
                  : "hover:text-black"
              }`}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center ${isActive ? "invert" : ""}`}
              >
                {tab.icon}
              </div>
              <span className="text-[10px] text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main content body container */}
      <div id="tech-specs" className="space-y-12">
        {/* ==================== Technical Specifications ==================== */}
        <div className="lg:bg-surface rounded-3xl transition-all duration-300 scroll-mt-40">
          <div>
            <div className="">
              {/* Centered link icon & tagline */}
              <div className="flex flex-col items-center text-center max-w-3xl mx-auto p-6 sm:p-10 lg:p-12 space-y-4">
                <div className="text-[#A31652]">
                  {/* Custom Interlocking Infinity Loop */}
                  <Image
                    className=""
                    src="/images/badge.png"
                    width={40}
                    height={40}
                    alt="badge"
                  />
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl font-normal leading-normal">
                  Watershield provides excellent water-resistance. Its superior
                  flow makes it smooth and easy to apply.
                </p>
              </div>

              {/* Split specifications grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 p-6 sm:p-10 lg:p-12 text-center lg:text-start">
                {/* Left Column: Technical Specifications */}
                <div>
                  <h3 className="font-amethysta text-2xl lg:text-3xl pb-1 border-b border-black mb-6 font-medium">
                    Technical Specifications
                  </h3>
                  <div className="space-y-2 max-w-sm text-lg md:text-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Appearance</span>
                      <span className="font-normal text-start">Milk White</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Solids</span>
                      <span className="font-normal text-start">50-53%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Viscosity</span>
                      <span className="font-normal text-start">
                        150-250 Poise
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Coverage</span>
                      <span className="font-normal text-start">
                        60-70 Sqft/Kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Pack Sizes & Documentation */}
                <div className="">
                  <div>
                    <h3 className="font-amethysta text-2xl lg:text-3xl pb-1 border-b border-black mb-6 font-medium">
                      Pack Sizes & Documentation
                    </h3>

                    {/* Grid layout of sizes chips */}
                    <div className="flex flex-wrap justify-center lg:justify-start gap-1.5 mb-5 max-w-lg">
                      {[
                        "0.6 Kg",
                        "1 Kg",
                        "2 Kg",
                        "5 Kg",
                        "10 Kg",
                        "20 Kg",
                        "30 Kg",
                        "50 Kg",
                        "60 Kg",
                      ].map((size) => (
                        <div
                          key={size}
                          className="bg-surface lg:bg-white w-24 rounded-xl p-3 text-center text-base sm:text-xl font-medium leading-normal transition-all duration-200 cursor-default"
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PDF technical data sheet download action */}
                  <button className="w-full sm:w-auto self-center md:self-start bg-linear-to-br from-[#FF0009] to-[#772571] hover:opacity-90 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-all active:scale-[0.98] cursor-pointer text-center">
                    Download Technical Data Sheet
                  </button>
                </div>
              </div>
            </div>
            {/* Bottom USP Section (Rounded Teal box) */}
            <div id="usps" className="">
              <div className="bg-[#0498AA] rounded-[28px] p-8 sm:p-10 lg:p-12 text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                  {/* USP 1 */}
                  <div className="flex flex-col items-center text-center space-y-3 max-w-60 mx-auto">
                    <div className="text-white">
                      <Image
                        src="/icons/Cycle-arrow.svg"
                        alt="USP1"
                        className="aspect-square"
                        width={40}
                        height={40}
                      />
                    </div>
                    <h4 className="font-amethysta text-2xl md:text-3xl font-medium leading-normal">
                      Faster Site Rotation
                    </h4>
                    <span className="text-base md:text-lg leading-normal font-light max-w-xs mx-auto">
                      Fast setting time helps professionals complete work
                      quicker and move between jobs more efficiently.
                    </span>
                  </div>

                  {/* USP 2 */}
                  <div className="flex flex-col items-center text-center space-y-3 max-w-60 mx-auto">
                    <div className="text-white">
                      <Image
                        src="/icons/Texture.svg"
                        alt="USP2"
                        className="aspect-square"
                        width={40}
                        height={40}
                      />
                    </div>
                    <h4 className="font-amethysta text-2xl md:text-3xl font-medium leading-normal">
                      Smooth Spreadability
                    </h4>
                    <span className="text-base md:text-lg leading-normal font-light max-w-xs mx-auto">
                      Superior flow and easy spreading help reduce wastage and
                      support better coverage.
                    </span>
                  </div>

                  {/* USP 3 */}
                  <div className="flex flex-col items-center text-center space-y-3 max-w-60 mx-auto">
                    <div className="text-white">
                      <Image
                        src="/icons/Asterisk.svg"
                        alt="USP3"
                        className="aspect-square"
                        width={40}
                        height={40}
                      />
                    </div>
                    <h4 className="font-amethysta text-2xl md:text-3xl font-medium leading-normal">
                      Solvent-Free Safety
                    </h4>
                    <span className="text-base md:text-lg leading-normal font-light max-w-xs mx-auto">
                      Water-based, non-flammable and non-toxic formulation for
                      safer handling during application.
                    </span>
                  </div>

                  {/* USP 4 */}
                  <div className="flex flex-col items-center text-center space-y-3 max-w-60 mx-auto">
                    <div className="text-white">
                      <Image
                        src="/icons/Circles-seven.svg"
                        alt="USP4"
                        className="aspect-square"
                        width={40}
                        height={40}
                      />
                    </div>
                    <h4 className="font-amethysta text-2xl md:text-3xl font-medium leading-normal">
                      Clean Finish After Drying
                    </h4>
                    <span className="text-base md:text-lg leading-normal font-light max-w-xs mx-auto">
                      Dries into a clear transparent film, helping maintain a
                      neat finish around edges and joints.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductFeatures />
      <RelatedProducts />
      <ProductFaq />
    </section>
  );
}
