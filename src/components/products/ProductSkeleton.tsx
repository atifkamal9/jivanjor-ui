import React from "react";

export default function ProductSkeleton() {
  return (
    <div className="font-google-sans min-h-screen bg-background text-foreground animate-pulse">
      {/* 1. HERO SKELETON */}
      <section id="overview-skeleton">
        {/* Mobile Breadcrumbs Skeleton */}
        <div className="md:hidden flex items-center gap-2 px-5 py-3 border-b border-neutral-100">
          <div className="w-4 h-4 bg-neutral-200 rounded shrink-0" />
          <div className="w-3 h-3 bg-neutral-200 rounded shrink-0" />
          <div className="w-20 h-3.5 bg-neutral-200 rounded" />
          <div className="w-3 h-3 bg-neutral-200 rounded shrink-0" />
          <div className="w-24 h-3.5 bg-neutral-200 rounded" />
        </div>

        {/* Responsive Layout Container */}
        <div className="w-full relative flex flex-col lg:flex-row h-128 lg:h-104 xd:h-136 overflow-hidden">
          {/* Left / Bottom Panel (Hero Info Box) */}
          <div
            className="relative order-2 lg:order-1 w-full lg:w-2/5 bg-neutral-200/80 py-5 lg:py-8 xl:py-10 pr-6 sm:pr-12 lg:pr-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-4 sm:gap-5 xl:gap-6 2xl:gap-8"
            style={{
              paddingLeft: "max(40px, calc((100vw - 1440px) / 2 + 40px))",
            }}
          >
            <div className="space-y-2 max-w-xs sm:max-w-md w-full flex flex-col items-center lg:items-start">
              {/* Product Title Skeleton */}
              <div className="h-8 lg:h-10 w-48 sm:w-60 bg-neutral-300/90 rounded-lg" />
              {/* Product Tagline Skeleton */}
              <div className="h-4 w-56 sm:w-72 bg-neutral-300/70 rounded" />
            </div>

            {/* Product Bullet Features list Skeleton */}
            <div className="space-y-2.5 w-full flex flex-col items-center lg:items-start">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-300/90 shrink-0" />
                  <div className="h-4 w-44 sm:w-52 bg-neutral-300/70 rounded" />
                </div>
              ))}
            </div>

            {/* Enquire Now button skeleton */}
            <div className="h-9 w-32 bg-neutral-300/90 rounded-full mt-1" />
          </div>

          {/* Right / Top Panel (Hero Cover Placeholder) */}
          <div className="order-1 lg:order-2 w-full lg:w-[60%] relative h-72 sm:h-100 lg:h-full bg-neutral-200/50" />
        </div>
      </section>

      {/* 2. PRODUCT INFO SKELETON CONTAINER */}
      <section className="max-w-360 mx-auto p-4 xs:p-5 lg:px-8 hd:px-12 3xl:px-8 mt-2 space-y-12">
        {/* Desktop Sticky Tab Bar Skeleton */}
        <div className="hidden lg:flex sticky top-18 z-40 py-2 items-center justify-center w-full">
          <div className="flex items-center bg-white rounded-full p-1.5 shadow-[4px_4px_12px_4px_rgba(0,0,0,0.06)] gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-28 rounded-full bg-neutral-200/80"
              />
            ))}
          </div>
        </div>

        {/* Technical Specifications Container Skeleton */}
        <div className="lg:bg-surface rounded-3xl p-6 sm:p-10 lg:p-12">
          {/* Centered Badge & Description Skeleton */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-neutral-200/90" />
            <div className="h-4 w-72 sm:w-96 bg-neutral-200/80 rounded" />
            <div className="h-4 w-48 sm:w-64 bg-neutral-200/70 rounded" />
          </div>

          {/* Split Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 text-center lg:text-start">
            {/* Left Column: Technical Specifications */}
            <div>
              <div className="h-7 w-52 bg-neutral-200/90 rounded mb-6 mx-auto lg:mx-0" />
              <div className="space-y-3 max-w-sm mx-auto lg:mx-0">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-neutral-200/50"
                  >
                    <div className="h-4 w-24 bg-neutral-200/80 rounded" />
                    <div className="h-4 w-28 bg-neutral-200/70 rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Pack Sizes */}
            <div>
              <div className="h-7 w-60 bg-neutral-200/90 rounded mb-6 mx-auto lg:mx-0" />
              {/* Chips Grid */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6 max-w-lg">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-24 h-12 rounded-xl bg-white/90 shadow-xs"
                  />
                ))}
              </div>
              {/* Download TDS Button Skeleton */}
              <div className="h-11 w-64 bg-neutral-200/90 rounded-full mx-auto lg:mx-0" />
            </div>
          </div>

          {/* USPs Section Skeleton */}
          <div className="mt-12 rounded-[28px] p-8 sm:p-10 lg:p-12 bg-neutral-200/80">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center space-y-3 max-w-60 mx-auto"
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-300/80" />
                  <div className="h-5 w-32 bg-neutral-300/80 rounded" />
                  <div className="space-y-1.5 w-full">
                    <div className="h-3.5 w-44 bg-neutral-300/60 rounded mx-auto" />
                    <div className="h-3.5 w-36 bg-neutral-300/60 rounded mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Applications Accordion Section Skeleton */}
        <div className="pt-6 space-y-8">
          <div className="text-center space-y-3 max-w-sm md:max-w-4xl mx-auto">
            <div className="w-10 h-10 rounded-full bg-neutral-200/90 mx-auto" />
            <div className="h-7 w-64 sm:w-80 bg-neutral-200/90 rounded mx-auto" />
            <div className="h-4 w-72 sm:w-96 bg-neutral-200/70 rounded mx-auto" />
          </div>

          {/* Open Accordion Skeleton Card */}
          <div className="w-full max-w-7xl mx-auto rounded-3xl bg-surface p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-200/50 pb-4">
              <div className="h-6 w-56 bg-neutral-200/90 rounded" />
              <div className="w-6 h-6 rounded-full bg-neutral-200/90" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="space-y-3">
                <div className="h-4 w-full bg-neutral-200/70 rounded" />
                <div className="h-4 w-4/5 bg-neutral-200/70 rounded" />
                <div className="h-4 w-3/4 bg-neutral-200/70 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-36 rounded-2xl bg-neutral-200/80" />
                <div className="h-36 rounded-2xl bg-neutral-200/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div className="pt-8 space-y-8">
          <div className="text-center space-y-3 max-w-sm md:max-w-4xl mx-auto">
            <div className="w-10 h-10 rounded-full bg-neutral-200/90 mx-auto" />
            <div className="h-7 w-52 bg-neutral-200/90 rounded mx-auto" />
          </div>

          {/* Product Cards Row Skeleton */}
          <div className="w-full relative px-6 sm:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className={`relative pt-20 flex justify-center ${
                    idx > 0 ? "hidden sm:flex" : "flex"
                  } ${idx > 1 ? "sm:hidden lg:flex" : ""} ${
                    idx > 2 ? "lg:hidden xl:flex" : ""
                  }`}
                >
                  <div className="rounded-[28px] p-6 pt-32 flex flex-1 flex-col items-center bg-neutral-200/70 w-69 min-h-68 shadow-xs border border-neutral-200/40">
                    <div className="absolute aspect-44/51 top-0 -translate-y-1/4 w-41 h-48 rounded-2xl bg-neutral-300/80 shadow-xs" />
                    <div className="h-6 w-32 bg-white/60 rounded mb-2" />
                    <div className="w-full h-px bg-white/30 my-3" />
                    <div className="space-y-1.5 w-full flex flex-col items-center">
                      <div className="h-3.5 w-44 bg-white/50 rounded" />
                      <div className="h-3.5 w-36 bg-white/50 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
