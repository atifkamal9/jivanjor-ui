"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { RightChoice } from "@/components/categories";
import { api } from "@/lib/api";

interface ListProps {
  description?: string;
  subtitle?: string;
  items?: any[];
  pageSlug?: string;
  pageTitle?: string;
  pageDescription?: string;
}

export default function List({
  description,
  subtitle,
  items,
  pageSlug,
  pageTitle,
  pageDescription,
}: ListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dynamicUseCases, setDynamicUseCases] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [fetchedDescription, setFetchedDescription] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [ucs, pages] = await Promise.all([
          api.getUseCases().catch(() => []),
          api.getPages().catch(() => []),
        ]);

        if (pageSlug) {
          const matched = pages.find((p: any) => p.slug === pageSlug);
          if (matched?.description) {
            setFetchedDescription(matched.description);
          }
        }

        if (Array.isArray(ucs) && ucs.length > 0) {
          let filtered = ucs;
          if (pageSlug && pageSlug !== "applications") {
            const normalizedSlug = pageSlug.toLowerCase().replace(/[^a-z0-9]/g, "");
            const normalizedTitle = (pageTitle || "").toLowerCase().replace(/[^a-z0-9]/g, "");
            
            const subpageMatches = ucs.filter((u) => {
              const catNorm = (u.category || "").toLowerCase().replace(/[^a-z0-9]/g, "");
              return (
                catNorm === normalizedSlug ||
                catNorm === normalizedTitle ||
                (normalizedSlug && catNorm.includes(normalizedSlug)) ||
                (normalizedTitle && catNorm.includes(normalizedTitle))
              );
            });

            if (subpageMatches.length > 0) {
              filtered = subpageMatches;
            }
          }
          setDynamicUseCases(filtered);
        }
      } catch (err) {
        console.error("Failed to load dynamic use cases or page description in Applications list:", err);
      }
    }
    fetchData();
  }, [pageSlug, pageTitle]);

  const displayDescription =
    description ||
    subtitle ||
    pageDescription ||
    fetchedDescription ||
    "Explore Jivanjor adhesives for furniture assembly, plywood work, joinery, cabinets, tables, chairs, boards and everyday wood bonding needs.";

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 1);
      setShowRightArrow(
        scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 1,
      );
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const tabWidth = (scrollContainerRef.current.clientWidth - 8) / 2;
      scrollContainerRef.current.scrollBy({
        left: -(tabWidth + 8),
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const tabWidth = (scrollContainerRef.current.clientWidth - 8) / 2;
      scrollContainerRef.current.scrollBy({
        left: tabWidth + 8,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const defaultApplications = [
    {
      title: "Furniture Assembly & Joinery",
      desc: "For tables, chairs, cabinets, frames and other wood-to-wood bonding needs.",
      image: "/images/applications/Rectangle 150.png",
    },
    {
      title: "Lamination & Veneering",
      desc: "For bonding laminates, veneers and decorative surfaces to plywood, MDF or boards.",
      image: "/images/applications/Rectangle 151.png",
    },
    {
      title: "Edge Banding & Finishing",
      desc: "For clean edges, surface finishing and exposed board sides.",
      image: "/images/applications/Rectangle 152.png",
    },
    {
      title: "Wooden Cabinets & Storage Units",
      desc: "For wardrobes, shelves, drawers, modular storage and daily-use furniture.",
      image: "/images/applications/Rectangle 153.png",
    },
    {
      title: "Repair & Restoration",
      desc: "For fixing gaps, loose joints, damaged parts and small woodwork repairs.",
      image: "/images/applications/Rectangle 154.png",
    },
    {
      title: "Small Assembly & Detail Work",
      desc: "For quick fixes, smaller wooden parts and intricate woodwork applications.",
      image: "/images/applications/Rectangle 155.png",
    },
  ];

  const formattedDynamic = dynamicUseCases.map((u) => ({
    title: u.title,
    desc: u.description,
    image: u.image || "/images/applications/Rectangle 150.png",
    slug: u.slug || u.title.replace(/\s+/g, "-").toLowerCase(),
    category: u.category,
    content: u.content,
  }));

  const displayItems = dynamicUseCases.length > 0 ? formattedDynamic : (items || defaultApplications);

  // Pagination calculation
  const postsPerPage = 6;
  const totalPages = Math.ceil(displayItems.length / postsPerPage);
  const indexOfLastBlog = currentPage * postsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - postsPerPage;
  const currentApplications = displayItems.slice(
    indexOfFirstBlog,
    indexOfLastBlog,
  );

  // Related Articles data
  const relatedArticles = [
    {
      title:
        "Mastering Laminate Bonding: Preventing Bubbles in High-Humidity Environments",
      image: "/images/blog/Rectangle 140.png",
    },
    {
      title:
        "Mastering Laminate Bonding: Preventing Bubbles in High-Humidity Environments",
      image: "/images/applications/Rectangle 141.png",
    },
    {
      title:
        "Mastering Laminate Bonding: Preventing Bubbles in High-Humidity Environments",
      image: "/images/blog/Rectangle 142.png",
    },
  ];

  return (
    <section className="max-w-360 mx-auto px-5 pt-8 lg:pt-14 w-full leading-normal text-[#222]">
      <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-12 z-50">
        <div className="flex flex-col">
          <div className="flex flex-col items-center text-center md:items-start md:text-start">
            <p className="font-normal text-lg lg:text-2xl max-w-170">
              {displayDescription}
            </p>
          </div>
          <div className="flex-1 space-y-6 mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentApplications.map((app, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedArticle(app)}
                  className="flex flex-col group cursor-pointer"
                >
                  <div className="relative w-full h-45 sm:h-60 rounded-[20px] overflow-hidden bg-surface">
                    <Image
                      src={app.image}
                      alt={app.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 410px"
                    />
                  </div>
                  <div className="flex flex-col items-center text-center md:items-start md:text-start pr-0 lg:pr-24 pt-5 pb-3 gap-3">
                    <h3 className="font-amethysta font-normal text-xl lg:text-[26px] group-hover:text-[#ff0009] transition-colors">
                      {app.title}
                    </h3>
                    <p className="font-normal text-sm lg:text-lg">{app.desc}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedArticle(app);
                      }}
                      className="active-gradient-border-surface text-[#ff0009] font-medium text-base p-1.5 w-34.5 rounded-[20px] flex items-center justify-center cursor-pointer hover:bg-[#ff0009] transition-all mt-1"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center md:justify-start gap-3 text-xl">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="hover:text-[#ff0009] disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 cursor-pointer font-medium"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 transition-colors cursor-pointer ${
                      currentPage === page
                        ? "underline decoration-solid underline-offset-[6px] text-black"
                        : "hover:text-[#ff0009]"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="hover:text-[#ff0009] disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 cursor-pointer font-medium"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
        <div className="md:hidden -mx-5">
          <RightChoice />
        </div>
        {/* ── Right Sticky Sidebar */}
        <aside className="relative w-full lg:w-103 shrink-0 lg:flex lg:flex-col lg:gap-8">
          {/* CTA Card  */}
          <div
            className="hidden lg:flex flex-col items-center relative rounded-[20px] overflow-hidden px-7 pt-10 pb-10 gap-5 text-white"
            style={{
              backgroundImage:
                "linear-gradient(126.864deg, rgb(255, 0, 9) 3.8328%, rgb(119, 37, 113) 80.651%)",
            }}
          >
            {/* Jivanjor watermark  */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[70%] pointer-events-none select-none">
              <Image
                src="/images/watermark.png"
                fill
                alt=""
                aria-hidden
                className="object-contain object-bottom opacity-100"
                sizes="340px"
              />
            </div>

            <h3 className="font-amethysta font-normal text-[28px] xl:text-[34px] text-center text-white relative z-10">
              Need Help Choosing the Right Adhesive?
            </h3>
            <p className="font-normal text-sm xl:text-lg text-center text-white/90 relative z-10">
              Share your woodwork needs, product query or application concerns.
              Our team will help you find the right Jivanjor solution.
            </p>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="relative z-10 bg-white border border-white text-[#1c1c1c] font-medium text-base min-h-10 px-6 rounded-[50px] flex items-center justify-center hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Submit Your Query
            </Link>
          </div>

          {/* Related Articles */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">
            <h3 className="font-amethysta font-normal text-[28px] xl:text-[34px] text-black">
              Related Articles
            </h3>

            {/* Article rows */}
            <div className="flex flex-col gap-5">
              {relatedArticles.map((article, idx) => (
                <Link
                  key={idx}
                  href={`/blog/${article.title.replace(/\s+/g, "-").toLowerCase()}`}
                  className="flex gap-4 items-start group"
                >
                  {/* Thumbnail */}
                  <div className="relative shrink-0 w-30 h-30 lg:w-37.5 lg:h-38.5 rounded-[20px] overflow-hidden bg-surface">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="120px"
                    />
                  </div>
                  {/* Title */}
                  <div className="flex-1 flex flex-col h-full gap-3 pt-1">
                    <p className="font-amethysta font-normal text-sm xl:text-lg text-black group-hover:text-[#ff0009] transition-colors">
                      {article.title}
                    </p>
                    {/* Gradient arrow circle */}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(94.9359deg, rgb(255, 0, 9) 2.7536%, rgb(119, 37, 113) 105.91%)",
                      }}
                    >
                      <ArrowRight size={16} className="text-white" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* View All button */}
            <Link
              href="/blog"
              className="self-center sm:self-start min-w-37 p-1.5 rounded-[20px] flex items-center justify-center font-medium text-lg text-white hover:opacity-90 transition-opacity"
              style={{
                backgroundImage:
                  "linear-gradient(106.993deg, rgb(255, 0, 9) 2.7536%, rgb(119, 37, 113) 105.91%)",
              }}
            >
              View All
            </Link>
          </div>
        </aside>
      </div>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 w-full max-w-3xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col font-google-sans">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800 shrink-0">
              <div className="space-y-1">
                {selectedArticle.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    {selectedArticle.category}
                  </span>
                )}
                <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50 font-amethysta">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {selectedArticle.image && (
                <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-surface">
                  <Image
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <p className="text-base text-gray-600 dark:text-zinc-300 font-medium leading-relaxed">
                {selectedArticle.desc}
              </p>

              {selectedArticle.content ? (
                <div
                  className="prose dark:prose-invert max-w-none text-gray-800 dark:text-zinc-200 border-t border-gray-100 dark:border-zinc-800 pt-4"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              ) : null}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
