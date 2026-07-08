"use client";

import { useState } from "react";
import {
  Hero,
  ReachLeft,
  ReachForm,
  Presence,
  Gallery,
} from "@/components/partner";
import { RightChoice } from "@/components/categories";

export default function PartnerPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSticky, setIsSticky] = useState(false);

  return (
    <main className="min-h-screen relative bg-background font-google-sans overflow-x-clip">
      <Hero hideText={isSticky || !isOpen} />
      <div className="xl:hidden md:mt-10">
        <ReachForm
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isSticky={isSticky}
          setIsSticky={setIsSticky}
        />
      </div>
      {/* Main Grid Wrapper */}
      <div className="max-w-360 mx-auto w-full px-5 lg:px-8 py-10 lg:py-13">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-14 items-start">
          {/* Left Column (App, Stats, Testimonials) */}
          <div className="xl:col-span-8 flex flex-col space-y-12 xl:space-y-18">
            <ReachLeft />
            <Presence />
            <Gallery />
          </div>

          {/* Right Column (Sticky Form) */}
          <div className="hidden xl:block xl:col-span-4 w-full xl:sticky xl:top-22 xl:self-start z-30">
            <ReachForm />
          </div>
        </div>
      </div>
      <RightChoice />
    </main>
  );
}
