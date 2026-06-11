import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <>
      {/* 1. MOBILE BREADCRUMBS (Only visible on mobile/tablet, hidden on desktop) */}
      <div className="md:hidden flex items-center gap-1.5 px-6 py-4 border-b border-neutral-100 text-sm font-medium">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          {/* Home Solid Icon */}
          <svg
            className="w-4 h-4 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        {/* Chevron separator */}
        <ChevronRight size={16} />
        <span className="text-foreground/80 font-normal">Waterproof Grade</span>
        {/* Chevron separator */}
        <ChevronRight size={16} />
        <span className="">Watershield</span>
      </div>

      {/* 2. RESPONSIVE LAYOUT CONTAINER */}
      <div className="w-full relative flex flex-col md:flex-row md:h-150 lg:h-162.5 overflow-hidden">
        <div className="absolute bottom-0 right-0 pointer-events-none">
          <Image
            src="/images/watermark-blog.png"
            alt="watermark"
            width={500}
            height={320}
            className="object-cover"
          />
        </div>
        {/* ========================================================================= */}
        {/* DESKTOP VIEW: LEFT PANEL (TEAL BOX) - MOBILE VIEW: BOTTOM PANEL (TEAL BOX) */}
        {/* ========================================================================= */}
        <div className="order-2 md:order-1 w-full md:w-2/5 bg-[#0498AA] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center md:items-start text-center md:text-left gap-6 sm:gap-8">
          {/* Product Title using Serif Amethysta font */}
          <h1 className="font-amethysta text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight tracking-wide">
            Watershield
          </h1>

          {/* Product Tagline */}
          <p className="text-lg sm:text-xl lg:text-2xl font-light opacity-90 leading-relaxed max-w-sm sm:max-w-md">
            Apke furniture ko paani se bachane wali shield.
          </p>

          {/* Product Bullet Features list */}
          <div className="space-y-4 self-center md:self-auto w-full max-w-xs md:max-w-none pl-4 md:pl-0">
            {/* Feature 1 */}
            <div className="flex items-center gap-3.5">
              <div className="shrink-0 text-white opacity-95">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </div>
              <span className="text-base sm:text-lg font-medium tracking-wide">
                Best-in-Class Coverage
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3.5">
              <div className="shrink-0 text-white opacity-95">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="14" cy="12" r="6" />
                  <path d="M14 9v3l2 1" />
                  <path strokeLinecap="round" d="M2 9h4M2 12h4M2 15h4" />
                </svg>
              </div>
              <span className="text-base sm:text-lg font-medium tracking-wide">
                D3 Grade for Water Resistance
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3.5">
              <div className="shrink-0 text-white opacity-95">
                {/* Thumbs Up SVG */}
                <svg
                  className="w-5 h-5 fill-white stroke-none"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 10h3v10H2zm4 0h11.28c.84 0 1.57-.53 1.83-1.33l1.83-5.5a2 2 0 0 0-1.83-2.67h-5.61l.85-2.54a1.5 1.5 0 0 0-2.83-.95L7.4 9.1A2 2 0 0 0 6 11v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5" />
                </svg>
              </div>
              <span className="text-base sm:text-lg font-medium tracking-wide">
                Anti-bubble Adhesive
              </span>
            </div>
          </div>

          {/* Enquire Now pill button */}
          <Link
            href="#"
            className="w-full max-w-xs md:w-auto bg-white text-[#0498AA] font-bold text-center px-8 py-3 rounded-full hover:bg-white/95 hover:shadow-md transition-all active:scale-[0.98] text-base"
          >
            Enquire Now
          </Link>
        </div>

        {/* =========================================================================== */}
        {/* DESKTOP VIEW: RIGHT PANEL (KITCHEN) - MOBILE VIEW: TOP PANEL (KITCHEN) */}
        {/* =========================================================================== */}
        <div className="order-1 md:order-2 w-full md:w-[60%] relative h-95 sm:h-112.5 md:h-full overflow-hidden">
          {/* Desktop Kitchen Backdrop Image */}
          <Image
            src="/images/Rectangle 149.png"
            alt="Kitchen background"
            fill
            priority
            className="hidden md:block object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />

          {/* Mobile Kitchen Backdrop Image */}
          <Image
            src="/images/Rectangle 149 (1).png"
            alt="Kitchen background mobile"
            fill
            priority
            className="block md:hidden object-cover"
            sizes="100vw"
          />
        </div>
      </div>
    </>
  );
}
