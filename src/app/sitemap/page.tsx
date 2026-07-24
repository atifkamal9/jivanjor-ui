"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  getLocalSitemapConfig,
  syncSitemapConfigWithApi,
  SitemapConfig,
  SitemapSection,
} from "@/lib/sitemap-storage";
import { Search, ChevronRight, ArrowUpRight, X } from "lucide-react";

export default function SitemapPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [config, setConfig] = useState<SitemapConfig>(() =>
    getLocalSitemapConfig()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    syncSitemapConfigWithApi().then((updated) => {
      if (isMounted) {
        setConfig(updated);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleSections = useMemo(() => {
    return config.sections
      .filter((sec) => sec.isVisible)
      .sort((a, b) => a.order - b.order);
  }, [config]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return visibleSections;
    const query = searchQuery.toLowerCase();

    return visibleSections
      .map((section) => {
        const matchingLinks = section.links.filter(
          (link) =>
            link.title.toLowerCase().includes(query) ||
            link.href.toLowerCase().includes(query) ||
            (link.description &&
              link.description.toLowerCase().includes(query)) ||
            section.title.toLowerCase().includes(query)
        );

        if (matchingLinks.length === 0) return null;
        return {
          ...section,
          links: matchingLinks,
        };
      })
      .filter((sec): sec is SitemapSection => sec !== null);
  }, [visibleSections, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-surface/60 to-background border-b border-border/70 py-12 lg:py-14 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1440px] mx-auto text-left">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-foreground/70 mb-4 font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Sitemap</span>
          </nav>

          {/* Row layout on desktop, stacked on mobile/tablet */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12">
            <div className="max-w-3xl">
              <h1 className="font-amethysta text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight mb-3">
                {config.heroTitle || "Jivanjor Sitemap"}
              </h1>

              <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed font-normal">
                {config.heroDescription ||
                  "Find direct links to all main pages, product categories, editorial guides, and support resources across Jivanjor."}
              </p>
            </div>

            {/* Search Bar - Underline style matching Contact page form inputs */}
            <div className="w-full lg:w-[520px] shrink-0 relative flex items-center border-b border-foreground/30 focus-within:border-primary transition-colors py-2">
              <Search className="text-foreground/50 w-5 h-5 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 p-0 text-foreground text-base sm:text-lg focus:ring-0 focus:outline-none placeholder:text-foreground/40 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 text-sm text-foreground/60 hover:text-foreground shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Sitemap Content - Wide, spacious unboxed grid layout */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 py-14">
        {filteredSections.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
            <h2 className="font-amethysta text-2xl font-bold text-foreground mb-2">
              No pages found
            </h2>
            <p className="text-base text-foreground/60">
              No matching pages found for &quot;{searchQuery}&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-16 gap-y-14">
            {filteredSections.map((section) => (
              <div key={section.id} className="space-y-6">
                <div className="border-b-2 border-primary/30 pb-3.5">
                  <h2 className="font-amethysta text-2xl sm:text-3xl text-foreground leading-normal">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="text-sm sm:text-base text-foreground/70 mt-2 leading-relaxed">
                      {section.description}
                    </p>
                  )}
                </div>

                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.id || link.href}>
                      <Link
                        href={link.href}
                        className="group block text-foreground hover:text-primary transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-base sm:text-lg font-bold group-hover:underline">
                          <span>{link.title}</span>
                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary shrink-0" />
                        </div>
                        {link.description && (
                          <p className="text-sm sm:text-base text-foreground/70 font-normal mt-1 leading-normal">
                            {link.description}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
