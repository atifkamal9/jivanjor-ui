import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface BlogHeroProps {
  title?: string;
  subtitle?: string;
  desktopImage?: string;
}

export default function Hero({
  title = "Practical Guidance for Woodwork and Adhesives",
  subtitle = "Knowledge Hub",
  desktopImage = "/images/blog/blog-hero.png",
}: BlogHeroProps) {
  return (
    <section className="relative">
      <div className="flex items-center gap-1.5 md:hidden px-6 pt-4 text-xs font-medium">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        <ChevronRight size={16} />
        <span className="font-medium text-lg">{subtitle}</span>
      </div>
      <div className="block w-full h-30 md:h-67 relative">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="max-w-360 mx-auto w-full h-full px-5 lg:px-8 hd:px-12 3xl:px-8 flex flex-col justify-center">
            <div className="max-w-xs mx-auto md:mx-0 md:max-w-lg text-black md:text-white pointer-events-auto">
              <div className="hidden md:flex items-center gap-1.5 text-xs font-normal">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </Link>
                <ChevronRight size={16} />
                <span className="font-normal text-lg text-white/80">{subtitle}</span>
              </div>
              <h2 className="font-amethysta font-normal text-[28px] sm:text-3xl lg:text-4xl mt-6 py-6 md:py-0 text-center md:text-start">
                {title}
              </h2>
            </div>
          </div>
        </div>
        <Image
          src={desktopImage}
          fill
          alt={title}
          sizes="100vw"
          className="object-cover object-center hidden md:block"
        />
      </div>
    </section>
  );
}
