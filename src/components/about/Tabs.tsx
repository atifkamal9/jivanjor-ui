"use client";

import Image from "next/image";

interface TabItem {
  id: string;
  label: string;
  targetId: string;
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
      targetId: "promise-section",
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
      targetId: "innovation-section",
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
      targetId: "responsibility-section",
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
      label: "Our Presence",
      targetId: "presence-section",
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
      targetId: "tvcs-section",
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

  const handleTabClick = (targetId: string, id: string) => {
    setActiveTab(id);
    const element = document.getElementById(targetId);
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
    <div className="sticky top-20 md:top-28 z-40 w-full transition-all duration-300">
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
                  onClick={() => handleTabClick(tab.targetId, tab.id)}
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
      </div>
    </div>
  );
}
