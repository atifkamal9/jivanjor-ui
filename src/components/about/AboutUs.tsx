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

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("about-jivanjor");

  useEffect(() => {
    const sections = [
      { id: "promise-section", tabId: "about-jivanjor" },
      { id: "innovation-section", tabId: "research-innovation" },
      { id: "responsibility-section", tabId: "quality-sustainability" },
      { id: "presence-section", tabId: "our-presence" },
      { id: "tvcs-section", tabId: "tvcs" },
    ];

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // Trigger when section occupies the active scroll viewport area
      threshold: 0.05,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const matchingTab = sections.find((s) => s.id === entry.target.id);
          if (matchingTab) {
            setActiveTab(matchingTab.tabId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div
      id="about-jivanjor"
      className="flex flex-col min-h-screen bg-background font-google-sans text-foreground"
    >
      <Hero />
      {/* Navigation Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Page Sections */}
      <Promise />
      <Innovation />
      <Responsibility />
      <Presence />
      <TVCs />
      {/* CTA Footer Section */}
      <div id="about-query-section">
        <RightChoice />
      </div>
    </div>
  );
}
