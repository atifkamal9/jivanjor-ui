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

export function mapToAboutSectionId(hashOrSlug: string): string | null {
  if (!hashOrSlug) return null;
  const clean = hashOrSlug
    .replace(/^#/, "")
    .replace(/^\/about\/?/, "")
    .replace(/^\//, "")
    .toLowerCase()
    .trim();

  if (
    clean === "research-innovation" ||
    clean === "research-and-innovation" ||
    clean === "innovation" ||
    clean === "research" ||
    clean === "r-and-d"
  ) {
    return "research-innovation";
  }
  if (
    clean === "quality-sustainability" ||
    clean === "quality-and-performance-promise" ||
    clean === "quality" ||
    clean === "sustainability" ||
    clean === "responsibility"
  ) {
    return "quality-sustainability";
  }
  if (
    clean === "our-presence" ||
    clean === "market-presence" ||
    clean === "presence"
  ) {
    return "our-presence";
  }
  if (
    clean === "tvcs" ||
    clean === "tvc" ||
    clean === "videos" ||
    clean === "video"
  ) {
    return "tvcs";
  }
  if (
    clean === "about-jivanjor" ||
    clean === "about" ||
    clean === "overview" ||
    clean === "promise"
  ) {
    return "about-jivanjor";
  }

  if (typeof document !== "undefined" && document.getElementById(clean)) {
    return clean;
  }
  return null;
}

export function scrollToAboutSection(
  rawId: string,
  setActiveTab?: (tab: string) => void
) {
  const id = mapToAboutSectionId(rawId) || rawId;
  if (setActiveTab) setActiveTab(id);
  const element = document.getElementById(id);
  if (!element) return;

  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
  const navbar = document.getElementById("main-landing-header");
  const navHeight = navbar ? navbar.offsetHeight : isDesktop ? 88 : 64;
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;

  let targetY: number;
  if (id === "research-innovation") {
    // Desktop lab image has mt-12 (48px) inside the section.
    // Scroll so the lab image aligns flush right beneath the sticky navbar, with no section above showing.
    targetY = isDesktop ? elementPosition + 48 - navHeight : elementPosition - navHeight;
  } else if (id === "about-jivanjor") {
    targetY = Math.max(0, elementPosition - (isDesktop ? navHeight + 70 : navHeight + 20));
  } else {
    targetY = Math.max(0, elementPosition - (isDesktop ? navHeight + 70 : navHeight + 20));
  }

  // Lazy lead easing smooth scroll (replaces abrupt native scrolling with a gentle, momentum-eased glide)
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  window.dispatchEvent(new CustomEvent("about-tab-scroll-start"));

  let startTime: number | null = null;
  let animationFrameId: number;
  const duration = 850;

  // Lazy lead ease-in-out-cubic curve: soft launch, graceful glide, gentle deceleration
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const cleanup = () => {
    window.removeEventListener("wheel", onUserInteract);
    window.removeEventListener("touchstart", onUserInteract);
    cancelAnimationFrame(animationFrameId);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("about-tab-scroll-end"));
    }, 80);
  };

  const onUserInteract = () => {
    cleanup();
  };

  window.addEventListener("wheel", onUserInteract, { passive: true, once: true });
  window.addEventListener("touchstart", onUserInteract, { passive: true, once: true });

  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      cleanup();
    }
  };

  animationFrameId = requestAnimationFrame(step);
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
    scrollToAboutSection(id, setActiveTab);
  };

  return (
    <>
      <div className="sticky top-20 z-40 w-full transition-all duration-300">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 hd:px-12 3xl:px-8">
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
              <span className="font-medium text-[9px] xs:text-[10px] text-center leading-tight!">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
