import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative">
      <div className="max-w-360 mx-auto w-full h-full px-5 py-3 md:px-6.5 flex flex-col justify-center">
        <div className="max-w-xs md:max-w-2xl text-black pointer-events-auto">
          <div className="flex items-center gap-1.5 text-xs">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              {/* Home Solid Icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>
            {/* Chevron separator */}
            <ChevronRight size={16} />
            <span className="font-normal text-lg">Privacy Policy</span>
          </div>
          <h2 className="font-amethysta font-normal text-[34px] sm:text-4xl lg:text-5xl mt-6">
            Privacy Policy
          </h2>
        </div>
      </div>
    </section>
  );
}
