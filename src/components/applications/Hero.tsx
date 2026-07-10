import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative">
      {/* Hero container */}
      <div className="relative w-full h-71 md:h-67">
        {/* Background image */}
        <Image
          fill
          src="/images/applications/Rectangle 2.png"
          className="object-cover object-center"
          alt="Applications Hero"
          sizes="100vw"
          priority
        />

        {/* Mobile gradient overlay — Figma node 2685:4779: 33.16deg, dark bottom-left */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(33.1631deg, rgba(0,0,0,0.63) 5%, rgba(0,0,0,0.337) 30%, rgba(102,102,102,0) 90%)",
          }}
        />

        {/* Content overlay */}
        <div className="absolute inset-0 z-10">
          <div className="max-w-360 mx-auto w-full h-full flex flex-col justify-between md:justify-center px-5 py-8 md:py-0">
            {/* Breadcrumb — top on mobile (justify-between), inline on desktop */}
            <div className="flex items-center gap-1.5 text-white">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </Link>
              <ChevronRight size={16} />
              <span className="font-normal text-lg text-white/80 font-google-sans">
                Application Tips
              </span>
            </div>

            {/* Heading — bottom on mobile (justify-between), inline on desktop */}
            <h2 className="font-amethysta font-normal text-[34px] md:text-5xl text-white max-w-md md:max-w-2xl md:mt-6">
              Furniture &amp; Woodwork Adhesive Solutions
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
