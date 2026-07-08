import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface HeroProps {
  hideText?: boolean;
}

export default function Hero({ hideText = false }: HeroProps) {
  return (
    <section className="relative w-full">
      <div className="hidden md:block relative h-67 bg-black/60">
        {/* Background Image */}
        <Image
          src="/images/contractor/Rectangle 2.png"
          fill
          alt="Contractor Connect Hero"
          priority
          className="object-cover object-center pointer-events-none"
        />
        {/* Content wrapper */}
        <div className="relative max-w-360 mx-auto w-full h-full p-6 lg:p-8 flex flex-col justify-center text-white z-10">
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
              Contractor Connect
            </span>
          </div>

          {/* Title */}
          <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-[50px] font-normal max-w-203 text-start">
            Build Your Business with India's Trusted Adhesive Partner
          </h2>
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
            Contractor Connect
          </span>
        </div>

        {/* Title */}
        <h2 className="font-amethysta text-[34px] font-normal max-w-sm text-center">
          Build Your Business with India's Trusted Adhesive Partner
        </h2>
      </div>
    </section>
  );
}
