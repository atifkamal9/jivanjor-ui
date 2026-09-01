"use client";

import { useState, useEffect } from "react";
import Hero from "./Hero";
import Tabs from "./Tabs";
import Promise from "./Promise";
import Innovation from "./Innovation";
import Responsibility from "./Responsibility";
import Presence from "./Presence";
import TVCs from "./TVCs";
import { RightChoice } from "@/components/categories";

interface AboutUsProps {
  data?: any;
  subpageTitle?: string;
}

export default function AboutUs({ data = {}, subpageTitle }: AboutUsProps) {
  const [activeTab, setActiveTab] = useState("about-jivanjor");

  useEffect(() => {
    let isManualScrolling = false;

    const onScrollStart = () => {
      isManualScrolling = true;
    };
    const onScrollEnd = () => {
      isManualScrolling = false;
    };

    window.addEventListener("about-tab-scroll-start", onScrollStart);
    window.addEventListener("about-tab-scroll-end", onScrollEnd);

    const sectionIds = [
      "about-jivanjor",
      "research-innovation",
      "quality-sustainability",
      "our-presence",
      "tvcs",
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0.05,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isManualScrolling) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("about-tab-scroll-start", onScrollStart);
      window.removeEventListener("about-tab-scroll-end", onScrollEnd);
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background font-google-sans text-foreground overflow-x-clip">
      <Hero data={data.hero} subpageTitle={subpageTitle} />
      {/* Navigation Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Page Sections */}
      <Promise data={data.promise} />
      <Innovation data={data.innovation} />
      <Responsibility data={data.responsibility} />
      <Presence data={data.presence} />
      <TVCs data={data.tvcs} />
      {/* CTA Footer Section */}
      <div id="about-query-section">
        <RightChoice />
      </div>
    </div>
  );
}

