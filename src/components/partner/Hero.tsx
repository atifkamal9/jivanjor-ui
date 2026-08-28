import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Heading } from "@/components/ui";

interface HeroProps {
  hideText?: boolean;
  data?: {
    title?: string;
    breadcrumb?: string;
    breadcrumbTitle?: string;
    label?: string;
    categoryTitle?: string;
    media?: string[];
    bgImage?: string;
    heroImage?: string;
    image?: string;
    slides?: any[];
  };
}

export default function Hero({ hideText = false, data }: HeroProps) {
  const title = data?.title || "Build Your Dealership with a Growing Distribution Network";
  const breadcrumb =
    data?.breadcrumb ||
    data?.breadcrumbTitle ||
    data?.label ||
    data?.categoryTitle ||
    "Become a Dealer";
  const bgImage =
    data?.bgImage ||
    data?.heroImage ||
    data?.image ||
    data?.media?.[0] ||
    data?.slides?.[0]?.bgImage ||
    data?.slides?.[0]?.media?.[0] ||
    data?.slides?.[0]?.image ||
    "/images/dealer/Rectangle 2.png";

  return (
    <section className="relative w-full">
      <div className="hidden md:block relative h-67 bg-black/60">
        {/* Background Image */}
        <Image
          src={bgImage}
          fill
          alt="Become a Dealer Hero"
          priority
          className="object-cover object-center pointer-events-none"
        />
        {/* Content wrapper */}
        <div className="relative max-w-360 mx-auto w-full h-full p-6 lg:p-8 lg:px-8 hd:px-12 3xl:px-8 flex flex-col justify-center text-white z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium mb-6">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity flex items-center"
            >
              {/* Home Solid Icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>
            <ChevronRight size={16} />
            <span className="font-normal text-lg opacity-85">
              {breadcrumb}
            </span>
          </div>

          {/* Title */}
          <Heading className="max-w-180 text-start text-white">
            {title}
          </Heading>
        </div>
      </div>

      {/* Mobile Content */}
      <div
        className={`flex-col justify-center relative mx-auto w-full h-full p-5 md:hidden transition-opacity duration-300 ${hideText ? "hidden pointer-events-none" : "flex"}`}
      >
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium mb-6">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity flex items-center"
          >
            {/* Home Solid Icon */}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </Link>
          <ChevronRight size={16} />
          <span className="font-normal text-lg opacity-85">
            {breadcrumb}
          </span>
        </div>

        {/* Title */}
        <Heading className="max-w-sm text-center">
          {title}
        </Heading>
      </div>
    </section>
  );
}
