"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { RightChoice } from "@/components/categories";
import { api } from "@/lib/api";

interface ListProps {
  description?: string;
  subtitle?: string;
  items?: any[];
  relatedArticles?: any;
  pageSlug?: string;
  pageTitle?: string;
  pageDescription?: string;
}

function ListContent({
  description,
  subtitle,
  items,
  relatedArticles,
  pageSlug,
  pageTitle,
  pageDescription,
}: ListProps) {
  const searchParams = useSearchParams();
  const articleParam = searchParams.get("article");

  const [currentPage, setCurrentPage] = useState(1);
  const [dynamicUseCases, setDynamicUseCases] = useState<any[]>([]);
  const [fetchedDescription, setFetchedDescription] = useState<string>("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, [articleParam]);

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

  // Match active article if `article` query param is present
  const activeArticle = articleParam
    ? displayItems.find((a) => {
      const paramDecoded = decodeURIComponent(articleParam).toLowerCase().trim();
      const titleNorm = (a.title || "").toLowerCase().trim();
      const slugNorm = (a.slug || "").toLowerCase().trim();
      const titleSlugNorm = titleNorm.replace(/[^a-z0-9]/g, "");
      const paramSlugNorm = paramDecoded.replace(/[^a-z0-9]/g, "");
      return (
        slugNorm === paramDecoded ||
        titleNorm === paramDecoded ||
        (paramSlugNorm.length > 0 && titleSlugNorm === paramSlugNorm)
      );
    }) ||
    dynamicUseCases.find((u) => {
      const paramDecoded = decodeURIComponent(articleParam).toLowerCase().trim();
      const titleNorm = (u.title || "").toLowerCase().trim();
      const slugNorm = (u.slug || "").toLowerCase().trim();
      const titleSlugNorm = titleNorm.replace(/[^a-z0-9]/g, "");
      const paramSlugNorm = paramDecoded.replace(/[^a-z0-9]/g, "");
      return (
        slugNorm === paramDecoded ||
        titleNorm === paramDecoded ||
        (paramSlugNorm.length > 0 && titleSlugNorm === paramSlugNorm)
      );
    })
    : null;

  // Dynamic Related Articles: sourced from application articles (useCases) set by admin or dynamically fetched
  const dynamicRelatedArticles = (() => {
    // 1. Check if admin explicitly configured related articles in page sections (data.relatedArticles)
    const relItems = relatedArticles?.items || (Array.isArray(relatedArticles) ? relatedArticles : null);
    const relIds = relatedArticles?.selectedArticleIds;

    let configuredTargetItems: any[] = [];
    if (Array.isArray(relItems) && relItems.length > 0) {
      configuredTargetItems = relItems;
    } else if (Array.isArray(relIds) && relIds.length > 0) {
      configuredTargetItems = relIds;
    }

    if (configuredTargetItems.length > 0) {
      const mapped = configuredTargetItems
        .map((item: any) => {
          if (typeof item === "string") {
            const found = dynamicUseCases.find(
              (u) => u.id === item || u.slug === item || u.title === item
            );
            return found
              ? {
                title: found.title,
                image: found.image || "/images/applications/Rectangle 150.png",
                slug: found.slug || found.title.replace(/\s+/g, "-").toLowerCase(),
              }
              : {
                title: item,
                image: "/images/applications/Rectangle 150.png",
                slug: item.replace(/\s+/g, "-").toLowerCase(),
              };
          }
          return {
            title: item.title || item.name,
            image: item.image || item.imageUrl || "/images/applications/Rectangle 150.png",
            slug: item.slug || (item.title ? item.title.replace(/\s+/g, "-").toLowerCase() : ""),
          };
        })
        .filter((art) => !activeArticle || (art.title !== activeArticle.title && art.slug !== activeArticle.slug));

      if (mapped.length > 0) return mapped;
    }

    // 2. Dynamic Fallback: Pool all available articles and exclude activeArticle currently being read
    const allAvailable = dynamicUseCases.length > 0 ? formattedDynamic : displayItems;

    const filtered = allAvailable.filter((u) => {
      if (!activeArticle) return true;
      const activeTitleNorm = (activeArticle.title || "").toLowerCase().trim();
      const activeSlugNorm = (activeArticle.slug || "").toLowerCase().trim();
      const uTitleNorm = (u.title || "").toLowerCase().trim();
      const uSlugNorm = (u.slug || "").toLowerCase().trim();

      return uTitleNorm !== activeTitleNorm && uSlugNorm !== activeSlugNorm;
    });

    if (filtered.length > 0) {
      return filtered.slice(0, 3).map((u) => ({
        title: u.title,
        image: u.image || "/images/applications/Rectangle 150.png",
        slug: u.slug || u.title.replace(/\s+/g, "-").toLowerCase(),
      }));
    }

    // 3. System Fallback from defaultApplications
    const defaultFiltered = defaultApplications.filter((u) => {
      if (!activeArticle) return true;
      const activeTitleNorm = (activeArticle.title || "").toLowerCase().trim();
      const uTitleNorm = (u.title || "").toLowerCase().trim();
      return uTitleNorm !== activeTitleNorm;
    });

    return defaultFiltered.slice(0, 3).map((u) => ({
      title: u.title,
      image: u.image || "/images/applications/Rectangle 150.png",
      slug: (u as any).slug || u.title.replace(/\s+/g, "-").toLowerCase(),
    }));
  })();

  // Social Share URLs
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(
    activeArticle?.title || "Application Guide | Jivanjor"
  );

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  return (
    <div className="w-full">
      {/* Top Header/Breadcrumb if activeArticle is present */}
      {activeArticle && (
        <>
          <section className="flex flex-col justify-between max-w-360 mx-auto my-3 md:my-5 px-5 gap-2.5 z-50 font-google-sans">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm md:text-base font-medium">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <svg className="w-4.5 h-4.5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </Link>
              <div className="hidden items-center md:flex gap-1.5">
                <ChevronRight size={16} />
                <Link href="/applications" className="hover:text-[#ff0009] transition-colors">
                  <span>Applications</span>
                </Link>
              </div>
              {pageSlug && pageSlug !== "applications" && (
                <>
                  <ChevronRight size={16} />
                  <Link href={`/applications/${pageSlug}`} className="hover:text-[#ff0009] transition-colors truncate">
                    <span>{pageTitle || pageSlug}</span>
                  </Link>
                </>
              )}
              <ChevronRight size={16} />
              <span className="text-foreground/70 line-clamp-1 max-w-50 sm:max-w-xs md:max-w-md">
                {activeArticle.title}
              </span>
            </div>
            <h1 className="font-amethysta text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-normal leading-[1.15] text-black dark:text-white max-w-none mt-2">
              {activeArticle.title}
            </h1>
          </section>

          {/* Hero Banner Image */}
          {activeArticle.image && (
            <section className="max-w-360 mx-auto px-5 mb-6 font-google-sans">
              <div className="hidden sm:block relative w-full h-55 sm:h-87.5 md:h-105 rounded-[20px] overflow-hidden bg-surface shadow-md">
                <Image
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1440px) 100vw, 1295px"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <div className="relative w-full h-47 sm:hidden rounded-[20px] overflow-hidden bg-surface shadow-md">
                <Image
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1440px) 100vw, 1295px"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </section>
          )}
        </>
      )}

      {/* Main Section Layout (Left Content + Right Sidebar if listing) */}
      <section className="max-w-360 mx-auto px-5 lg:px-8 hd:px-10 3xl:px-8 pt-4 lg:pt-8 w-full leading-normal text-[#222]">
        <div className="flex flex-col lg:flex-row justify-between gap-6 lg:gap-12 z-50">

          {/* MAIN CONTENT COLUMN (Full Width on Article Page, Flex-1 on List Page) */}
          <div className="flex flex-col flex-1 w-full">
            {activeArticle ? (
              <div className="flex flex-col flex-1 space-y-6 lg:space-y-8 font-google-sans w-full">
                {/* Category Strip */}
                <div className="bg-surface max-w-fit text-xs md:text-sm flex flex-wrap items-center gap-1.5 border-l-2 border-[#FF0009] p-2">
                  <span>Category: {activeArticle.category || pageTitle || "Applications"}</span>
                </div>

                {/* Summary / TLDR Box */}
                {activeArticle.desc && (
                  <div className="bg-surface p-5 md:px-8 md:py-5 border-l-[5px] border-[#FF0009] w-full">
                    <h4 className="font-google-sans font-bold text-lg md:text-xl text-[#222] dark:text-zinc-100 mb-2">
                      Summary:
                    </h4>
                    <p className="font-google-sans text-base md:text-lg text-[#222] dark:text-zinc-300">
                      {activeArticle.desc}
                    </p>
                  </div>
                )}

                {/* Main Article Content */}
                <article className="flex-1 space-y-8 min-w-0 w-full">
                  <div className="space-y-6 w-full">
                    <div
                      className="font-google-sans text-base md:text-lg text-[#222] dark:text-zinc-200 leading-relaxed space-y-4 prose max-w-none prose-content w-full"
                      dangerouslySetInnerHTML={{ __html: activeArticle.content || `<p>${activeArticle.desc}</p>` }}
                    />
                  </div>

                  {/* Share on Socials */}
                  <div className="flex flex-col gap-2 pt-6 border-t border-gray-200 dark:border-zinc-800">
                    <p className="text-base font-medium text-[#222] dark:text-zinc-200">Share on Socials</p>
                    <div className="flex items-center gap-2">
                      <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" title="Share on Facebook" className="hover:scale-110 transition-transform">
                        <Image src="/images/blog/facebook.png" alt="Facebook" width={24} height={24} className="w-6 h-6 object-contain" />
                      </a>
                      <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" title="Share on X" className="hover:scale-110 transition-transform">
                        <Image src="/images/blog/x.png" alt="Twitter" width={24} height={24} className="w-6 h-6 object-contain" />
                      </a>
                      <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn" className="hover:scale-110 transition-transform">
                        <Image src="/images/blog/instagram.png" alt="LinkedIn" width={24} height={24} className="w-6 h-6 object-contain" />
                      </a>
                      <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" className="hover:scale-110 transition-transform">
                        <Image src="/images/blog/whatsapp.png" alt="WhatsApp" width={24} height={24} className="w-6 h-6 object-contain" />
                      </a>
                    </div>
                  </div>

                  {/* Author Block */}
                  <div className="space-y-3 text-[#222] dark:text-zinc-200 pb-12">
                    <h4 className="font-amethysta text-2xl font-normal leading-tight">
                      Authored By:
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#DBDBDB] overflow-hidden flex items-center justify-center shrink-0 border border-gray-200 shadow-sm relative">
                        <Image src="/images/badge.svg" alt="Jivanjor Logo" height={40} width={40} className="object-contain h-5 w-8" />
                      </div>
                      <div className="text-left">
                        <h5 className="font-google-sans font-medium text-lg">
                          Jivanjor Woodworking Experts
                        </h5>
                      </div>
                    </div>
                    <p className="font-google-sans text-sm md:text-base text-gray-600 dark:text-zinc-400 leading-relaxed">
                      Knowledge shaped by Jivanjor Technical Experts, bringing you expert insights into adhesive performance, application techniques, and woodworking conditions.
                    </p>
                  </div>
                </article>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center text-center md:items-start md:text-start">
                  <p className="font-normal text-lg lg:text-2xl max-w-170">
                    {displayDescription}
                  </p>
                </div>
                <div className="flex-1 space-y-6 mt-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {currentApplications.map((app, idx) => {
                      const articleQuery = encodeURIComponent(app.slug || app.title);
                      const articleHref =
                        pageSlug && pageSlug !== "applications"
                          ? `/applications/${pageSlug}?article=${articleQuery}`
                          : `/applications?article=${articleQuery}`;

                      return (
                        <Link
                          key={idx}
                          href={articleHref}
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
                            <span className="active-gradient-border-surface text-[#ff0009] font-medium text-base p-1.5 w-34.5 rounded-[20px] flex items-center justify-center cursor-pointer transition-all mt-1">
                              Learn More
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
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
                          className={`px-3 py-1 transition-colors cursor-pointer ${currentPage === page
                            ? "underline decoration-solid underline-offset-[6px] text-black font-bold"
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
              </>
            )}
          </div>

          {!activeArticle && (
            <div className="md:hidden -mx-5">
              <RightChoice />
            </div>
          )}

          {/* RIGHT SIDEBAR - ONLY RENDERED WHEN LISTING ARTICLES (NOT ON QUERY ARTICLE PAGE) */}
          {!activeArticle && (
            <aside className="relative w-full lg:w-103 shrink-0 lg:flex lg:flex-col lg:gap-8">
              {/* CTA Card */}
              <div
                className="hidden lg:flex flex-col items-center relative rounded-[20px] overflow-hidden px-7 pt-10 pb-10 gap-5 text-white"
                style={{
                  backgroundImage:
                    "linear-gradient(126.864deg, rgb(255, 0, 9) 3.8328%, rgb(119, 37, 113) 80.651%)",
                }}
              >
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

                <Link
                  href="/contact"
                  className="relative z-10 bg-white border border-white text-[#1c1c1c] font-medium text-base min-h-10 px-6 rounded-[50px] flex items-center justify-center hover:bg-white/90 transition-colors whitespace-nowrap"
                >
                  Submit Your Query
                </Link>
              </div>

              {/* Dynamic Related Articles (Application Articles set by admin or dynamically fetched) */}
              <div className="flex flex-col gap-5 lg:sticky lg:top-24">
                <h3 className="font-amethysta font-normal text-[28px] xl:text-[34px] text-black">
                  {relatedArticles?.title || "Related Articles"}
                </h3>

                <div className="flex flex-col gap-5">
                  {dynamicRelatedArticles.map((article: any, idx: number) => {
                    const relQuery = encodeURIComponent(article.slug || article.title);
                    const relHref =
                      pageSlug && pageSlug !== "applications"
                        ? `/applications/${pageSlug}?article=${relQuery}`
                        : `/applications?article=${relQuery}`;

                    return (
                      <Link
                        key={idx}
                        href={relHref}
                        className="flex gap-4 items-start group cursor-pointer"
                      >
                        <div className="relative shrink-0 w-30 h-30 lg:w-37.5 lg:h-38.5 rounded-[20px] overflow-hidden bg-surface">
                          <Image
                            src={article.image || "/images/applications/Rectangle 150.png"}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="120px"
                          />
                        </div>
                        <div className="flex-1 flex flex-col h-full gap-3 pt-1">
                          <p className="font-amethysta font-normal text-sm xl:text-lg text-[#222] group-hover:text-[#ff0009] transition-colors">
                            {article.title}
                          </p>
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
                    );
                  })}
                </div>
                <Link
                  href="/applications"
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
          )}

        </div>
      </section>
    </div>
  );
}

export default function List(props: ListProps) {
  return (
    <Suspense fallback={<div className="min-h-40 py-10 text-center text-gray-400">Loading guide...</div>}>
      <ListContent {...props} />
    </Suspense>
  );
}
