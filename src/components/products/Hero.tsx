import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="overview">
      {/* 1. MOBILE BREADCRUMBS (Only visible on mobile/tablet, hidden on desktop) */}
      <div className="md:hidden flex items-center gap-1.5 px-6 py-2.5 border-b border-neutral-100 text-sm font-medium">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          {/* Home Solid Icon */}
          <Image
            src="/icons/home.svg"
            alt="home"
            width={18}
            height={18}
            className="invert"
          />
        </Link>
        {/* Chevron separator */}
        <ChevronRight size={16} />
        <span className="text-foreground/80 font-normal">Waterproof Grade</span>
        {/* Chevron separator */}
        <ChevronRight size={16} />
        <span className="">Watershield</span>
      </div>

      {/* 2. RESPONSIVE LAYOUT CONTAINER */}
      <div className="w-full relative flex flex-col lg:flex-row lg:h-140 overflow-hidden">
        {/* ========================================================================= */}
        {/* DESKTOP VIEW: LEFT PANEL (TEAL BOX) - MOBILE VIEW: BOTTOM PANEL (TEAL BOX) */}
        {/* ========================================================================= */}
        <div
          className="relative order-2 lg:order-1 w-full lg:w-2/5 bg-[#0498AA] text-white py-5 lg:py-16 pr-6 sm:pr-12 lg:pr-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-4 sm:gap-6 lg:gap-8"
          style={{
            paddingLeft: "max(24px, calc((100vw - 1440px) / 2 + 24px))",
          }}
        >
          <div className="absolute bottom-0 right-0 pointer-events-none">
            <Image
              src="/images/watermark pro.png"
              alt="watermark"
              width={500}
              height={320}
              className="object-contain"
            />
          </div>
          <div className="space-y-1 max-w-xs sm:max-w-md">
            {/* Product Title using Serif Amethysta font */}
            <h1 className="font-amethysta text-[40px] sm:text-5xl lg:text-6xl font-normal leading-normal">
              Watershield
            </h1>
            {/* Product Tagline */}
            <p className="font-amethysta text-xl lg:text-3xl leading-[120%] max-w-3xs sm:max-w-md">
              Apke furniture ko paani se bachane wali shield.
            </p>
          </div>
          {/* Product Bullet Features list */}
          <div className="space-y-1">
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5">
              <div className="shrink-0 text-white">
                <Image
                  src="/icons/image 18.svg"
                  className="aspect-square"
                  alt="waterproof Grade"
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-lg lg:text-2xl font-normal leading-normal">
                Best-in-Class Coverage
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5">
              <div className="shrink-0 text-white">
                <Image
                  src="/icons/image 19.svg"
                  className="aspect-square"
                  alt="waterproof Grade"
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-lg lg:text-2xl font-normal leading-normal">
                D3 Grade for Water Resistance
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5">
              <div className="shrink-0 text-white">
                <Image
                  src="/icons/image 20.svg"
                  className="aspect-square"
                  alt="waterproof Grade"
                  width={20}
                  height={20}
                />
              </div>
              <span className="text-lg lg:text-2xl font-normal leading-normal">
                Anti-bubble Adhesive
              </span>
            </div>
          </div>

          {/* Enquire Now pill button */}
          <Link
            href="#"
            className="min-w-32 bg-white text-foreground text-center font-medium px-8 py-2 rounded-full hover:bg-white/95 hover:shadow-md transition-all active:scale-[0.98] text-sm z-10"
          >
            Enquire Now
          </Link>
        </div>

        {/* =========================================================================== */}
        {/* DESKTOP VIEW: RIGHT PANEL (KITCHEN) - MOBILE VIEW: TOP PANEL (KITCHEN) */}
        {/* =========================================================================== */}
        <div className="order-1 lg:order-2 w-full lg:w-[60%] relative h-72 sm:h-100 lg:h-full overflow-hidden">
          {/* Desktop Kitchen Backdrop Image */}
          <Image
            src="/images/Rectangle 149.png"
            alt="Kitchen background"
            fill
            priority
            className="hidden lg:block object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />

          {/* Mobile Kitchen Backdrop Image */}
          <Image
            src="/images/Rectangle 149 (1).png"
            alt="Kitchen background mobile"
            fill
            priority
            className="block lg:hidden object-cover"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
