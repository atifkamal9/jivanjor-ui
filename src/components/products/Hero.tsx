import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface HeroProps {
  product?: any;
  category?: any;
}

export default function Hero({ product, category }: HeroProps) {
  const categoryName = category?.name || "Premium Grade";
  const productName = product?.name || "Watershield";
  const productDescription = product?.shortDescription || "Apke furniture ko paani se bachane wali shield.";

  // Extract features from product metadata
  let featuresList = ["Best-in-Class Coverage", "D3 Grade for Water Resistance", "Anti-bubble Adhesive"];
  if (product?.overviewBullets && product.overviewBullets.length > 0) {
    featuresList = product.overviewBullets;
  } else if (product?.metadata) {
    const cleaned = product.metadata.split(",").map((f: string) => f.trim()).filter(Boolean);
    if (cleaned.length > 0) {
      featuresList = cleaned;
    }
  }

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
        <span className="text-foreground/70 font-normal">{categoryName}</span>
        {/* Chevron separator */}
        <ChevronRight size={16} />
        <span className="">{productName}</span>
      </div>

      {/* 2. RESPONSIVE LAYOUT CONTAINER */}
      <div className="w-full relative flex flex-col lg:flex-row lg:h-140 overflow-hidden">
        {/* ========================================================================= */}
        {/* DESKTOP VIEW: LEFT PANEL (TEAL BOX) - MOBILE VIEW: BOTTOM PANEL (TEAL BOX) */}
        {/* ========================================================================= */}
        <div
          className="relative order-2 lg:order-1 w-full lg:w-2/5 text-white py-5 lg:py-16 pr-6 sm:pr-12 lg:pr-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left gap-4 sm:gap-6 lg:gap-8"
          style={{
            paddingLeft: "max(24px, calc((100vw - 1440px) / 2 + 24px))",
            backgroundColor: product?.themeColor || "#0498AA",
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
              {productName}
            </h1>
            {/* Product Tagline */}
            <p className="font-amethysta text-xl lg:text-3xl leading-[120%]! max-w-3xs sm:max-w-md">
              {productDescription}
            </p>
          </div>
          {/* Product Bullet Features list */}
          <div className="space-y-1">
            {featuresList.map((feature: any, fIdx) => {
              const text = typeof feature === "string" ? feature : (feature?.text || "");
              const iconName = typeof feature === "string"
                ? `image ${18 + (fIdx % 3)}.svg`
                : (feature?.icon || `image ${18 + (fIdx % 3)}.svg`);

              return (
                <div key={fIdx} className="flex items-center gap-3.5">
                  <div className="shrink-0 text-white flex items-center justify-center">
                    <Image
                      src={`/icons/${iconName}`}
                      className="aspect-square object-contain"
                      alt={text}
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-lg lg:text-2xl font-normal leading-normal">
                    {text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Enquire Now pill button */}
          <Link
            href={product?.enquireLink || product?.enquire_link || product?.ctaLink || product?.cta_link || "/contact"}
            className="min-w-32 bg-white text-foreground text-center font-medium px-8 py-2 rounded-full hover:bg-white/95 hover:shadow-md transition-all active:scale-[0.98] text-sm z-10"
          >
            {product?.enquireText || product?.enquire_text || product?.ctaText || product?.cta_text || "Enquire Now"}
          </Link>
        </div>

        {/* =========================================================================== */}
        {/* DESKTOP VIEW: RIGHT PANEL (KITCHEN) - MOBILE VIEW: TOP PANEL (KITCHEN) */}
        {/* =========================================================================== */}
        <div className="order-1 lg:order-2 w-full lg:w-[60%] relative h-72 sm:h-100 lg:h-full overflow-hidden">
          {/* Desktop Kitchen Backdrop Image */}
          <Image
            src={product?.backgroundImage || product?.bgImage || "/images/products-cover.png"}
            alt={`${productName} background`}
            fill
            priority
            className="hidden lg:block object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />

          {/* Mobile Kitchen Backdrop Image */}
          <Image
            src={product?.backgroundImage || product?.bgImage || "/images/products-cover.png"}
            alt={`${productName} background mobile`}
            fill
            priority
            className="block lg:hidden object-cover"
            sizes="100vw"
          />

          {/* Dynamic Product Image placed on the counter table */}
          {product?.image && (
            <div className="absolute bottom-[1%] left-1/2 -translate-y-[40%] sm:-translate-y-[35%] md:-translate-y-[35%] lg:-translate-y-1/2 -translate-x-1/2 w-44 sm:w-56 lg:w-72 h-44 sm:h-56 lg:h-72 z-20 drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-105">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
