import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function BlogHero() {
  return (
    <section className="flex flex-col justify-between max-w-360 mx-auto my-4 px-5 gap-4 z-50">
      <div className="flex items-center gap-1.5 text-xs sm:text-sm md:text-lg font-medium">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          {/* Home Solid Icon */}
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        {/* Chevron separator */}
        <div className="hidden items-center md:flex">
          <ChevronRight size={16} />
          <span className="">Knowledge Hub</span>
        </div>
        <ChevronRight size={16} />
        <span className="">Application Tips</span>
        <ChevronRight size={16} />
        <span className="">Preventing Laminate Bubbling</span>
      </div>
      <h2 className="font-amethysta text-2xl sm:text-3xl max-w-80 md:max-w-188">
        Mastering Laminate Bonding: Preventing Bubbles in High-Humidity
        Environments
      </h2>
    </section>
  );
}
