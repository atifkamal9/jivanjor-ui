"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RightChoice } from "@/components/categories";

export interface RelatedArticle {
  title: string;
  desc: string;
  image: string;
  slug?: string;
}

export interface BlogContentProps {
  publishDate?: string;
  lastUpdated?: string;
  articleData?: {
    id?: string;
    title?: string;
    content?: string;
    image?: string;
    author?: string;
    author_description?: string;
    authorDescription?: string;
    author_avatar?: string;
    authorAvatar?: string;
    category?: string;
    publish_date?: string;
    tldr?: string;
  } | null;
  relatedPosts?: RelatedArticle[];
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function BlogContent({
  publishDate = "2026-07-01",
  lastUpdated,
  articleData,
  relatedPosts = [],
}: BlogContentProps) {
  const [tocSections, setTocSections] = useState<{ id: string; title: string }[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (!articleData?.content) {
      setTocSections([]);
      return;
    }

    const processHeadings = () => {
      const articleEl = document.querySelector("article .prose-content");
      if (!articleEl) return;

      const headings = Array.from(articleEl.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      if (headings.length > 0) {
        const usedIds: Record<string, number> = {};
        const items = headings.map((heading, index) => {
          const rawText = (heading.textContent || "").trim();
          let baseId = rawText
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

          if (!baseId) baseId = `section-${index + 1}`;

          let uniqueId = baseId;
          if (usedIds[baseId] !== undefined) {
            usedIds[baseId] += 1;
            uniqueId = `${baseId}-${usedIds[baseId]}`;
          } else {
            usedIds[baseId] = 0;
          }

          heading.id = uniqueId;
          return {
            id: uniqueId,
            title: rawText || `Section ${index + 1}`,
          };
        });

        setTocSections(items);
        setActiveSection(items[0]?.id || "");
      } else {
        setTocSections([]);
      }
    };

    processHeadings();
    const timer = setTimeout(processHeadings, 150);

    return () => clearTimeout(timer);
  }, [articleData?.content]);

  useEffect(() => {
    if (tocSections.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      let currentId = tocSections[0]?.id || "";

      for (const section of tocSections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            currentId = section.id;
          } else {
            break;
          }
        }
      }

      if (currentId) {
        setActiveSection(currentId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocSections]);

  const scrollToSection = (id: string, title?: string) => {
    let el = document.getElementById(id);

    if (!el) {
      const articleEl = document.querySelector("article .prose-content");
      if (articleEl) {
        const headings = Array.from(articleEl.querySelectorAll("h1, h2, h3, h4, h5, h6"));
        el = headings.find((h) => {
          return (
            h.id === id ||
            h.textContent?.trim() === title?.trim()
          );
        }) as HTMLElement | null;
      }
    }

    if (el) {
      if (!el.id) el.id = id;
      const top = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(
    articleData?.title || "Check out this blog post on Jivanjor"
  );

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  const authorName = articleData?.author || "Jivanjor Product Experts";

  if (!articleData) {
    return (
      <div className="w-full max-w-360 mx-auto px-5 py-20 text-center font-google-sans space-y-4">
        <h2 className="text-3xl font-amethysta text-[#222]">Blog Post Not Found</h2>
        <p className="text-lg text-[#666]">
          The requested blog post could not be found or is unavailable.
        </p>
        <Link
          href="/blog"
          className="inline-block mt-4 px-6 py-2 bg-[#FF0009] text-white rounded-full font-medium hover:bg-[#d00007] transition-colors"
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Image Section */}
      <section className="max-w-360 mx-auto px-5 lg:px-8 hd:px-10 3xl:px-8 mb-6">
        <div className="hidden sm:block relative w-full h-55 sm:h-87.5 md:h-105 rounded-[20px] overflow-hidden bg-surface shadow-md">
          <Image
            src={articleData.image || "/images/blog/Rectangle 125.png"}
            alt={articleData.title || "Blog Post"}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1440px) 100vw, 1295px"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="relative w-full h-47 sm:hidden rounded-[20px] overflow-hidden bg-surface shadow-md">
          <Image
            src={articleData.image || "/images/blog/Rectangle 125 (1).png"}
            alt={articleData.title || "Blog Post"}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1440px) 100vw, 1295px"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </section>

      {/* Article Metadata Strip */}
      <div className="lg:hidden bg-surface max-w-fit text-xs flex flex-wrap items-center gap-1.5 border-l-2 border-[#FF0009] p-2 m-5">
        <span>Published on: {formatDate(articleData.publish_date || publishDate)}</span>
        {lastUpdated && (
          <>
            <span>|</span>
            <span>Last updated: {formatDate(lastUpdated)}</span>
          </>
        )}
      </div>

      {/* Main Grid: Sidebar + Content */}
      <section className="flex flex-col lg:flex-row justify-between max-w-360 mx-auto px-5 lg:px-8 hd:px-10 3xl:px-8 gap-5 lg:gap-10 relative">
        {/* Table of Contents Sidebar (Desktop) */}
        {tocSections.length > 0 && (
          <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-28 space-y-4">
            <h3 className="text-2xl font-google-sans font-bold text-[#222]">
              Table of Contents
            </h3>
            <nav className="flex flex-col gap-3 font-google-sans text-xl text-[#222] max-w-3xs px-2">
              {tocSections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id, section.title)}
                    className={`text-left transition-all duration-200 cursor-pointer ${isActive
                      ? "underline underline-offset-4"
                      : "hover:font-medium"
                      }`}
                  >
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Table of Contents Accordion/Block (Mobile/Tablet) */}
        {tocSections.length > 0 && (
          <div className="block lg:hidden pl-5 mb-5 border-l">
            <div className="group">
              <div className="font-google-sans font-bold text-xl text-[#222] list-none flex items-center justify-between cursor-pointer">
                <span>Table of Contents</span>
              </div>
              <nav className="flex flex-col space-y-3 font-google-sans text-base text-[#222] mt-4 max-w-65">
                {tocSections.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        scrollToSection(section.id, section.title);
                      }}
                      className={`text-left transition-all cursor-pointer ${isActive ? "underline" : "hover:font-medium"}`}
                    >
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 space-y-6 lg:space-y-10">
          {/* Article Metadata Strip */}
          <div className="hidden bg-surface max-w-fit text-xs md:text-sm lg:flex flex-wrap items-center gap-1.5 border-l-2 border-[#FF0009] p-2 self-end">
            <span>Published on: {formatDate(articleData.publish_date || publishDate)}</span>
            {lastUpdated && (
              <>
                <span>|</span>
                <span>Last updated: {formatDate(lastUpdated)}</span>
              </>
            )}
          </div>

          {/* TLDR Summary */}
          {articleData.tldr && (
            <div className="bg-surface p-5 md:px-10 md:py-6 border-l-[5px] border-[#FF0009]">
              <h4 className="font-google-sans font-bold text-xl md:text-[22px] text-[#222] mb-3">
                TLDR :
              </h4>
              <p className="font-google-sans text-base md:text-lg lg:text-[22px] text-[#222] max-w-4xl">
                {articleData.tldr}
              </p>
            </div>
          )}

          {/* Blog Article Main Content */}
          <article className="flex-1 space-y-12 min-w-0 border-l-0 md:border-l border-[#00000099] px-0 md:px-10">
            <div className="space-y-6">
              <div
                className="font-google-sans text-base md:text-lg lg:text-xl text-[#222] leading-relaxed space-y-4 prose max-w-none prose-content"
                dangerouslySetInnerHTML={{ __html: articleData.content || "" }}
              />
            </div>

            {/* Share on Socials */}
            <div className="flex flex-col gap-2">
              <p className="text-lg text-[#222]">Share on Socials</p>
              <div className="flex items-center gap-1">
                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Facebook"
                  className="hover:scale-110 transition-transform"
                >
                  <Image
                    src="/images/blog/facebook.png"
                    alt="Facebook"
                    width={24}
                    height={24}
                    className="aspect-square w-6 h-6 object-contain"
                  />
                </a>
                <a
                  href={twitterShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on X (Twitter)"
                  className="hover:scale-110 transition-transform"
                >
                  <Image
                    src="/images/blog/x.png"
                    alt="Twitter"
                    width={24}
                    height={24}
                    className="aspect-square w-6 h-6 object-contain"
                  />
                </a>
                <a
                  href={linkedinShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on LinkedIn"
                  className="hover:scale-110 transition-transform"
                >
                  <Image
                    src="/images/blog/instagram.png"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                    className="aspect-square w-6 h-6 object-contain"
                  />
                </a>
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on WhatsApp"
                  className="hover:scale-110 transition-transform"
                >
                  <Image
                    src="/images/blog/whatsapp.png"
                    alt="WhatsApp"
                    width={24}
                    height={24}
                    className="aspect-square w-6 h-6 object-contain"
                  />
                </a>
              </div>
            </div>

            {/* Author Block */}
            <div className="space-y-4 text-[#222]">
              <h4 className="font-amethysta text-[30px] font-normal leading-tight">
                Authored By:
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-12.5 md:w-16 h-12.5 md:h-16 rounded-full bg-[#DBDBDB] overflow-hidden flex items-center justify-center shrink-0 border border-gray-200 shadow-sm relative">
                  {articleData?.author_avatar || articleData?.authorAvatar ? (
                    <Image
                      src={articleData.author_avatar || articleData.authorAvatar || ""}
                      alt={authorName}
                      fill
                      className="object-cover rounded-full"
                    />
                  ) : (
                    <Image
                      src="/images/badge.svg"
                      alt="Jivanjor Logo"
                      height={50}
                      width={50}
                      className="object-contain h-4 w-7 md:h-6 md:w-10"
                    />
                  )}
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h5 className="font-google-sans font-medium text-[22px]">
                    {authorName}
                  </h5>
                </div>
              </div>
              <p className="font-google-sans text-base md:text-lg max-w-xl leading-relaxed">
                {articleData?.author_description || articleData?.authorDescription || `Knowledge shaped by ${authorName}, bringing you expert insights into adhesive performance, application techniques, and woodworking conditions.`}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-white">
          <div className="max-w-360 mx-auto p-5 lg:px-8 hd:px-10 3xl:px-8 py-12 md:py-18 space-y-6">
            <h2 className="font-amethysta text-[34px] md:text-[56px] text-center text-[#222] font-normal leading-tight">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
              {relatedPosts.map((article, idx) => (
                <Link
                  key={idx}
                  href={`/blog/${article.slug || article.title.replace(/\s/g, "-").toLowerCase()}`}
                  className="flex flex-col items-center bg-white rounded-[20px] group overflow-hidden hover:shadow-lg transition-all duration-300 p-2"
                >
                  {/* Article Image Container */}
                  <div className="relative w-full h-61.5 rounded-[20px] overflow-hidden bg-surface">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>

                  {/* Article Info */}
                  <div className="flex flex-col items-center text-center md:items-start md:text-start flex-1 pt-6 pb-2 px-2 space-y-4">
                    <h3 className="font-amethysta text-xl lg:text-[26px] text-black font-normal hover:text-[#ff0009] transition-colors line-clamp-2 pb-0.5">
                      {article.title}
                    </h3>
                    <p className="text-base leading-normal text-[#222] line-clamp-2">
                      {article.desc}
                    </p>
                    <button className="active-gradient-border-surface text-[#ff0009] hover:bg-[#ff0009] transition-all font-google-sans font-medium text-base w-34.5 h-9 rounded-[20px] flex items-center justify-center cursor-pointer">
                      Read Post
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <RightChoice />
    </div>
  );
}
