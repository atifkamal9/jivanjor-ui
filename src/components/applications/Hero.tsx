import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative">
      <div className="flex items-center gap-1.5 md:hidden px-6 pt-4 text-xs font-medium">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          {/* Home Solid Icon */}
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        {/* Chevron separator */}
        <ChevronRight size={16} />
        <span className="font-medium text-lg">Knowledge Hub</span>
      </div>
      <div className="block w-full h-30 md:h-67 relative">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="max-w-360 mx-auto w-full h-full px-6 flex flex-col justify-center">
            <div className="max-w-90 mx-auto md:mx-0 md:max-w-2xl text-black md:text-white pointer-events-auto">
              <div className="hidden md:flex items-center gap-1.5 text-xs font-normal">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  {/* Home Solid Icon */}
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </Link>
                {/* Chevron separator */}
                <ChevronRight size={16} />
                <span className="font-normal text-lg text-white/80">
                  Application Tips
                </span>
              </div>
              <h2 className="font-amethysta font-normal text-[34px] sm:text-4xl lg:text-5xl mt-10 md:mt-12 text-center md:text-start">
                Furniture &amp; Woodwork Adhesive Solutions
              </h2>
            </div>
          </div>
        </div>
        <Image
          src="/images/applications/Rectangle 2.png"
          fill
          alt="applications Hero"
          sizes="100vw"
          className="object-cover object-center hidden md:block"
        />
      </div>
    </section>
  );
}
