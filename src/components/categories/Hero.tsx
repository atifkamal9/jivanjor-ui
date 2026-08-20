"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { Heading } from "@/components/ui";

export default function Hero() {
  const [heroCover, setHeroCover] = useState("/images/main-category-hero.png");

  useEffect(() => {
    async function fetchCover() {
      try {
        const settings = await api.getSettings();
        if (settings?.categoryHeroCover) {
          setHeroCover(settings.categoryHeroCover);
        }
      } catch (err) {
        console.error("Failed to load category hero cover from settings:", err);
      }
    }
    fetchCover();
  }, []);

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
        <span className="font-medium text-lg">All Products</span>
      </div>
      <div className="block w-full h-30 md:h-67 relative">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="max-w-360 mx-auto w-full h-full px-6 lg:px-8 xd:px-10 2xl:px-8 flex flex-col justify-center">
            <div className="max-w-sm text-black md:text-white pointer-events-auto">
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
                  All Products
                </span>
              </div>
              <Heading className="mt-0 md:mt-6 text-center md:text-start text-black md:text-white">
                Our Exclusive Product Range
              </Heading>
            </div>
          </div>
        </div>
        <Image
          src={heroCover}
          fill
          alt="Category Hero"
          sizes="100vw"
          className="object-cover object-center hidden md:block"
          unoptimized
        />
      </div>
    </section>
  );
}
