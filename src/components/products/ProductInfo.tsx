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
    <section className="max-w-360 mx-auto px-5 lg:px-8 pt-10 pb-24 lg:py-16">
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
      <div id="overview" className="space-y-12">
        {/* ==================== 1. OVERVIEW SECTION ==================== */}
        <div className="bg-surface rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-neutral-100 transition-all duration-300 scroll-mt-40">
          <div>
            <div className="" id="tech-specs">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 p-6 sm:p-10 lg:p-12">
                {/* Left Column: Technical Specifications */}
                <div>
                  <h3 className="font-amethysta text-2xl lg:text-3xl pb-1 border-b border-black mb-6 font-medium">
                    Technical Specifications
                  </h3>
                  <div className="space-y-2 max-w-sm text-lg md:text-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Appearance</span>
                      <span className="font-normal text-right">Milk White</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Solids</span>
                      <span className="font-normal text-right">50-53%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Viscosity</span>
                      <span className="font-normal text-right">
                        150-250 Poise
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Coverage</span>
                      <span className="font-normal text-right">
                        60-70 Sqft/Kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Pack Sizes & Documentation */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="font-amethysta text-2xl lg:text-3xl pb-1 border-b border-black mb-6 font-medium">
                      Pack Sizes & Documentation
                    </h3>

                    {/* Grid layout of sizes chips */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
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
                          className="bg-white w-24 rounded-xl p-2.5 text-center text-sm sm:text-base font-medium shadow-2xs hover:shadow-xs transition-all duration-200 cursor-default"
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
                  <div className="text-center space-y-3 max-w-60 mx-auto">
                    <div className="text-white">
                      <svg
                        className="w-8 h-8 mx-auto mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                        <path d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <h4 className="font-amethysta text-3xl font-medium tracking-wide">
                      Faster Site Rotation
                    </h4>
                    <span className="text-base sm:text-lg leading-normal font-light max-w-xs mx-auto">
                      Fast setting time helps professionals complete work
                      quicker and move between jobs more efficiently.
                    </span>
                  </div>

                  {/* USP 2 */}
                  <div className="text-center space-y-3 max-w-60 mx-auto">
                    <div className="text-white">
                      <svg
                        className="w-8 h-8 mx-auto mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                        <path
                          strokeLinecap="round"
                          d="M9 4L4 9M14 4L4 14M19 4L4 19M20 9L9 20M20 14L14 20"
                        />
                      </svg>
                    </div>
                    <h4 className="font-amethysta text-3xl font-medium tracking-wide">
                      Smooth Spreadability
                    </h4>
                    <span className="text-base sm:text-lg leading-normal font-light max-w-xs mx-auto">
                      Superior flow and easy spreading help reduce wastage and
                      support better coverage.
                    </span>
                  </div>

                  {/* USP 3 */}
                  <div className="text-center space-y-3 max-w-60 mx-auto">
                    <div className="text-white">
                      <svg
                        className="w-8 h-8 mx-auto mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path
                          strokeLinecap="round"
                          d="M12 8v8M8 12h8M9.17 9.17l5.66 5.66M9.17 14.83l5.66-5.66"
                        />
                      </svg>
                    </div>
                    <h4 className="font-amethysta text-3xl font-medium tracking-wide">
                      Solvent-Free Safety
                    </h4>
                    <span className="text-base sm:text-lg leading-normal font-light max-w-xs mx-auto">
                      Water-based, non-flammable and non-toxic formulation for
                      safer handling during application.
                    </span>
                  </div>

                  {/* USP 4 */}
                  <div className="text-center space-y-3 max-w-60 mx-auto">
                    <div className="text-white">
                      <svg
                        className="w-8 h-8 mx-auto mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                        <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                        <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                        <circle cx="17" cy="17" r="1.5" fill="currentColor" />
                        <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                        <circle cx="7" cy="17" r="1.5" fill="currentColor" />
                        <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                        <circle cx="7" cy="7" r="1.5" fill="currentColor" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                      </svg>
                    </div>
                    <h4 className="font-amethysta text-3xl font-medium tracking-wide">
                      Clean Finish After Drying
                    </h4>
                    <span className="text-base sm:text-lg leading-normal font-light max-w-xs mx-auto">
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
