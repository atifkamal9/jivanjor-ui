"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { api, Category } from "@/lib/api";

const slugify = (text: string) =>
  text
    ? text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";

export default function Hero() {
  const searchParams = useSearchParams();
  const [heroCover, setHeroCover] = useState("/images/main-category-hero.png");
  const [title, setTitle] = useState("Our Exclusive Product Range");
  const [breadcrumb, setBreadcrumb] = useState("All Products");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [settings, cats] = await Promise.all([
          api.getSettings().catch(() => null),
          api.getCategories().catch(() => []),
        ]);
        if (settings?.categoryHeroCover) {
          setHeroCover(settings.categoryHeroCover);
        }
        setCategories(cats);
      } catch (err) {
        console.error("Failed to load category hero cover from settings:", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    const sub = searchParams.get("subCategory") || searchParams.get("sub");
    const main = searchParams.get("category") || searchParams.get("mainCategory") || searchParams.get("cat");

    if (sub && categories.length > 0) {
      const match = categories.find(
        (c) =>
          c.slug.toLowerCase() === sub.toLowerCase() ||
          c.name.toLowerCase() === sub.toLowerCase() ||
          slugify(c.name) === slugify(sub)
      );
      if (match) {
        setBreadcrumb(match.name);
        setTitle(match.categoryTitle || match.name);
        if (match.heroImage) setHeroCover(match.heroImage);
        return;
      } else {
        setBreadcrumb(sub);
        setTitle(sub);
        return;
      }
    }

    if (main && categories.length > 0) {
      const match = categories.find(
        (c) =>
          c.slug.toLowerCase() === main.toLowerCase() ||
          c.name.toLowerCase() === main.toLowerCase() ||
          slugify(c.name) === slugify(main)
      );
      if (match) {
        setBreadcrumb(match.name);
        setTitle(match.categoryTitle || match.name);
        if (match.heroImage) setHeroCover(match.heroImage);
        return;
      } else {
        setBreadcrumb(main);
        setTitle(main);
        return;
      }
    }

    setBreadcrumb("All Products");
    setTitle("Our Exclusive Product Range");
  }, [searchParams, categories]);

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
        <span className="font-medium text-lg">{breadcrumb}</span>
      </div>
      <div className="block w-full h-30 md:h-67 relative">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="max-w-360 mx-auto w-full h-full px-6 flex flex-col justify-center">
            <div className="max-w-2xl text-black md:text-white pointer-events-auto">
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
                  {breadcrumb}
                </span>
              </div>
              <h2 className="font-amethysta font-normal text-5xl mt-0 md:mt-6 text-center md:text-start">
                {title}
              </h2>
            </div>
          </div>
        </div>
        <Image
          src={heroCover}
          fill
          alt={title}
          sizes="100vw"
          className="object-cover object-center hidden md:block"
          unoptimized
        />
      </div>
    </section>
  );
}
