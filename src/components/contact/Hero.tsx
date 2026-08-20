import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface HeroProps {
  heroImage?: string;
  heroTitle?: string;
}

export default function Hero({
  heroImage = "/images/image 24.png",
  heroTitle = "Contact Us",
}: HeroProps) {
  return (
    <section className="relative w-full">
      <div className="hidden md:block relative h-67 bg-black/60">
        {/* Background Image */}
        <Image
          src={heroImage || "/images/image 24.png"}
          fill
          alt={heroTitle || "Contact Us Hero"}
          priority
          className="object-cover object-center pointer-events-none"
        />
        {/* Content wrapper */}
        <div className="relative max-w-360 mx-auto w-full h-full p-6 lg:p-8 xd:px-10 2xl:px-8 flex flex-col text-white z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium mt-5">
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
            <span className="font-normal text-lg opacity-85">{heroTitle || "Contact Us"}</span>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="flex flex-col justify-center relative mx-auto w-full h-full p-5 md:hidden">
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
          <span className="font-normal text-lg opacity-85">{heroTitle || "Contact Us"}</span>
        </div>
      </div>
    </section>
  );
}
