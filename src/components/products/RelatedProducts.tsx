"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Heading, Title, Paragraph } from "@/components/ui";

import "swiper/css";
import "swiper/css/navigation";

interface RelatedProduct {
  title: string;
  description: string;
  image: string;
  color: string;
}

const RELATED_PRODUCTS: RelatedProduct[] = [
  {
    title: "Champion Super",
    description:
      "Provides a superior bond and strength, while being non-hazardous.",
    image: "/images/Champion Super.png",
    color: "#0083CB",
  },
  {
    title: "Aquabond",
    description:
      "Heatproof and waterproof adhesive made with Cross Linking Polymer",
    image: "/images/Aquabond.png",
    color: "#077937",
  },
  {
    title: "Foambond",
    description:
      "Great for upholstery, it connects foam, resin, leather, fabrics and metal.",
    image: "/images/Foambond.png",
    color: "#F57F26",
  },
  {
    title: "Watershield",
    description:
      "Provides excellent water-resistance. Its superior flow makes it smooth and easy to apply.",
    image: "/images/Watershield.png",
    color: "#0498AA",
  },
];

interface RelatedProductsProps {
  product?: any;
  allProducts?: any[];
}

export default function RelatedProducts({ product, allProducts = [] }: RelatedProductsProps) {
  // Load related products from product configurations
  let displayedProducts: any[] = [];
  if (product?.relatedProducts && product.relatedProducts.length > 0 && allProducts.length > 0) {
    displayedProducts = product.relatedProducts
      .map((id: string) => allProducts.find((p) => p.id === id))
      .filter(Boolean);
  }

  // Fallback: Show other products in the database if list is empty
  if (displayedProducts.length === 0) {
    const otherProducts = allProducts.filter(p => p.id !== product?.id);
    if (otherProducts.length > 0) {
      displayedProducts = otherProducts.slice(0, 4);
    } else {
      // Map static hardcoded defaults if allProducts is empty
      displayedProducts = RELATED_PRODUCTS.map((item, idx) => ({
        id: `static-${idx}`,
        name: item.title,
        description: item.description,
        image: item.image,
        themeColor: item.color.startsWith("bg-[") ? item.color.replace("bg-[", "").replace("]", "") : item.color,
        slug: item.title.toLowerCase().replace(/\s+/g, "-"),
      }));
    }
  }

  return (
    <section id="related-products" className="relative overflow-hidden mt-6">
      <div className="flex flex-col items-center justify-center text-center relative mx-auto my-6 max-w-330 px-5 lg:px-8 w-full">
        <div className="text-center space-y-3 max-w-4xl mx-auto mb-6">
          <div className="flex justify-center">
            <Image
              className="mb-2"
              src="/images/badge.png"
              width={40}
              height={40}
              alt="badge"
            />
          </div>
          <Heading as="h2">
            {product?.relatedTitle || "Related Products"}
          </Heading>
        </div>
        <div className="w-full mt-20">
          <Swiper
            key={displayedProducts.map((p) => p.title).join("-")}
            modules={[Navigation]}
            observer={true}
            observeParents={true}
            watchOverflow={false}
            centerInsufficientSlides={true}
            loop={false}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              prevEl: ".rel-swiper-prev",
              nextEl: ".rel-swiper-next",
              disabledClass: "swiper-button-disabled",
            }}
            breakpoints={{
              480: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 4,
              },
            }}
            className="w-full [overflow-x:clip]! [overflow-y:visible]!"
          >
            {displayedProducts.map((card, idx) => (
              <SwiperSlide
                key={`${card.name}-${idx}`}
                className="overflow-visible! px-1"
              >
                <Link
                  href={`/products?product=${card.slug}`}
                  className="flex flex-col items-center relative px-4"
                >
                  <div className="absolute aspect-44/51 group -top-1/4 w-41 h-48 xl:w-55 xl:h-63 object-contain transition-opacity duration-300 ease-out z-100">
                    {/* Floating image */}
                    {card.image && (
                      <Image
                        fill
                        priority
                        src={card.image}
                        alt={card.name}
                        className="object-contain z-10 group-hover:-translate-y-1 transition-all duration-300"
                      />
                    )}
                  </div>
                  {/* Card */}
                  <div
                    className="rounded-[28px] p-5 pt-32 lg:pt-44 flex flex-1 flex-col items-center text-white w-69 min-h-68 lg:w-69 lg:h-93 lg:min-h-88"
                    style={{ backgroundColor: card.themeColor || "whitesmoke" }}
                  >
                    <Title className="font-google-sans text-2xl! font-semibold text-center mb-2">
                      {card.name}
                    </Title>
                    <div className="w-full h-px bg-white my-3" />
                    <Paragraph className="text-center text-base! leading-normal max-w-60">
                      {card.shortDescription || card.description}
                    </Paragraph>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Navigation */}
          <button className="rel-swiper-prev absolute -left-2 top-[60%] -translate-y-1/2 z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={44} strokeWidth={2.5} />
          </button>
          <button className="rel-swiper-next absolute -right-2 top-[60%] -translate-y-1/2 z-10 text-[#ed1c24] cursor-pointer hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight size={44} strokeWidth={2.5} />
          </button>
        </div>
        {/* <Link
          href="/categories"
          className="inline-flex items-center justify-center font-medium min-w-40 my-7 md:my-10 px-6 py-2 rounded-3xl text-sm bg-linear-to-br from-[#FF0009] to-[#772571] text-white hover:opacity-90 transition-opacity text-center"
        >
          View all
        </Link> */}
      </div>
    </section>
  );
}
