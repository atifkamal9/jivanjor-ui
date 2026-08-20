"use client";

import Image from "next/image";

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const tabs: TabItem[] = [
    {
      id: "about-jivanjor",
      label: "About Jivanjor",
      icon: (
        <Image
          src="/images/badge.svg"
          className="aspect-square"
          alt="Overview"
          width={20}
          height={20}
        />
      ),
    },
    {
      id: "research-innovation",
      label: "Research & Innovation",
      icon: (
        <Image
          src="/images/research.svg"
          className="aspect-square"
          alt="Overview"
          width={20}
          height={20}
        />
      ),
    },
    {
      id: "quality-sustainability",
      label: "Quality & Sustainability",
      icon: (
        <Image
          src="/images/Asterisk.svg"
          className="aspect-square"
          alt="Overview"
          width={20}
          height={20}
        />
      ),
    },
    {
      id: "our-presence",
      label: "Market Presence",
      icon: (
        <Image
          src="/images/Multilayer-sphere.svg"
          className="aspect-square"
          alt="Overview"
          width={20}
          height={20}
        />
      ),
    },
    {
      id: "tvcs",
      label: "TVCs",
      icon: (
        <Image
          src="/images/Application-one.svg"
          className="aspect-square"
          alt="Overview"
          width={20}
          height={20}
        />
      ),
    },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const navbarOffset = 130; // height of sticky elements
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="sticky top-20 z-40 w-full transition-all duration-300">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:flex justify-start lg:justify-center overflow-x-auto no-scrollbar scroll-smooth">
            <div
              className="flex items-center bg-white rounded-full my-4 p-px max-w-full overflow-x-auto gap-1 md:gap-2 shrink-0 scrollbar-none"
              style={{
                boxShadow: `4px 4px 12.1px 4px rgba(0, 0, 0, 0.10)`,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-base transition-all cursor-pointer select-none shrink-0 ${isActive
                      ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white shadow-[0_4px_12px_rgba(163,22,82,0.25)]"
                      : "hover:bg-surface transition-colors"
                      }`}
                  >
                    <span className={isActive ? "invert brightness-0" : ""}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Tab Bar (Visible on mobile/tablet, hidden on desktop) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center justify-around w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center self-stretch gap-1 px-2.5 py-1.25 rounded-xl transition-all duration-200 select-none cursor-pointer flex-1 max-w-20 ${isActive
                ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white shadow-[0_4px_12px_rgba(163,22,82,0.15)]"
                : "hover:text-black"
                }`}
            >
              <div
                className={`flex items-center justify-center w-5 h-5 ${isActive ? "invert brightness-0" : ""}`}
              >
                {tab.icon}
              </div>
              <span className="font-medium text-[10px] text-center leading-tight!">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
