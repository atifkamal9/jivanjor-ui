import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative">
      <div className="flex items-center gap-1.5 md:hidden px-6 py-4 text-xs font-medium">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          {/* Home Solid Icon */}
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        {/* Chevron separator */}
        <ChevronRight size={16} />
        <span className="font-medium text-lg">Premium Adhesives</span>
      </div>
      <div className="w-full h-67 relative hidden md:block">
        <div className="absolute top-12 left-12 max-w-3xl px-6 py-4 text-white z-10">
          <div className="flex items-center gap-1.5 text-xs font-normal">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              {/* Home Solid Icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>
            {/* Chevron separator */}
            <ChevronRight size={16} />
            <span className="font-normal text-lg text-white/80">Premium Adhesives</span>
          </div>
          <h2 className="font-amethysta text-5xl mt-6">
            A Complete Adhesive Range for Modern Woodworking
          </h2>
        </div>
        <Image
          src="/images/category-hero.png"
          fill
          alt="Category Hero"
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </section>
  );
}
