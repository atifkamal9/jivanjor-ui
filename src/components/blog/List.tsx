"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";

export default function List() {
  const [activeList, setActiveList] = useState("Latest Blogs");
  const [currentPage, setCurrentPage] = useState(1);

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

  const Lists = [
    {
      name: "Latest Blogs",
      icon: "/images/blog/image 47.svg",
    },
    {
      name: "Application Tips",
      icon: "/images/blog/image 43.svg",
    },
    {
      name: "Choosing The Right Adhesive",
      icon: "/images/blog/Check-correct.svg",
    },
    {
      name: "Fix Common Issues",
      icon: "/images/blog/image 48.svg",
    },
  ];

  const Blogs = [
    // Category: Application Tips
    {
      title:
        "Mastering Laminate Bonding: Preventing Bubbles in High-Humidity Environments",
      desc: "Bubbles in laminate applications rarely happen by chance; they are the direct result of trapped air or moisture expanding beneath the surface.",
      image: "/images/blog/Rectangle 140.png",
      category: "Application Tips",
    },
    {
      title: "How to Properly Acclimatize Wood and Laminates Before Bonding",
      desc: "Wood and laminates are hygroscopic materials that expand and contract. Learn how proper acclimatization prevents warped panels.",
      image: "/images/blog/Rectangle 142.png",
      category: "Application Tips",
    },
    {
      title: "Choosing the Right Notched Trowel for Consistent Adhesive Spread",
      desc: "Using the correct notch size ensures an even glue film, reducing excess moisture and minimizing the risk of laminate bubbling.",
      image: "/images/blog/Rectangle 141.png",
      category: "Application Tips",
    },
    {
      title:
        "Best Practices for Center-to-Edge Pressing in Plywood Applications",
      desc: "A step-by-step guide to using J-rollers and pressing blocks to systematically force out trapped air during bonding.",
      image: "/images/blog/Rectangle 143.png",
      category: "Application Tips",
    },
    {
      title: "How Temperature Fluctuations Affect Synthetic Resin PVA Curing",
      desc: "Explore the chemical behavior of PVA adhesives under high and low temperatures and adjust your pressing times accordingly.",
      image: "/images/blog/Rectangle 140.png",
      category: "Application Tips",
    },
    {
      title: "The Importance of Pressure in Heavy-Duty Woodworking Projects",
      desc: "Under-pressing leads to weak joints, while over-pressing starves the joint. Find the perfect balance for your projects.",
      image: "/images/blog/Rectangle 142.png",
      category: "Application Tips",
    },

    // Category: Choosing The Right Adhesive
    {
      title: "Jivanjor Lamino vs. Supremo: Which Adhesive Should You Choose?",
      desc: "Compare Jivanjor’s flagship adhesives to find the right balance between open time, initial grab, and weather resistance.",
      image: "/images/blog/Rectangle 141.png",
      category: "Choosing The Right Adhesive",
    },
    {
      title:
        "Why Anti-Bubble Technology is Non-Negotiable for Premium Woodwork",
      desc: "Standard glues can trap air pockets easily. Discover how specialized formulations ensure a flat, bubble-free laminate bond.",
      image: "/images/blog/Rectangle 143.png",
      category: "Choosing The Right Adhesive",
    },
    {
      title: "Understanding Water-Resistant Adhesives for High-Moisture Zones",
      desc: "Kitchens and bathrooms demand adhesives that withstand moisture. Here is what to look for in waterproof grade adhesives.",
      image: "/images/blog/Rectangle 140.png",
      category: "Choosing The Right Adhesive",
    },
    {
      title: "The Chemistry of Wood Preservatives and Adhesive Compatibility",
      desc: "Not all glues bond well with preservative-treated timber. Learn how to prevent chemical conflicts in your wood structures.",
      image: "/images/blog/Rectangle 142.png",
      category: "Choosing The Right Adhesive",
    },
    {
      title: "Evaluating ECO-Friendly Adhesives for Indoor Air Quality",
      desc: "Eco-friendly wood glues reduce VOC emissions. Learn how they perform in strength tests compared to standard PVA glues.",
      image: "/images/blog/Rectangle 141.png",
      category: "Choosing The Right Adhesive",
    },
    {
      title: "Selecting Adhesives for Wood Ancillaries and Edge Banding",
      desc: "Edge banding requires fast-setting, high-tack adhesives. Learn how to select the right glue for clean, flush edges.",
      image: "/images/blog/Rectangle 143.png",
      category: "Choosing The Right Adhesive",
    },

    // Category: Fix Common Issues
    {
      title: "How to Fix Trapped Air Bubbles in Finished Laminates",
      desc: "Discovered a bubble after the glue has cured? Here is a professional rescue guide using heat and targeted pressure.",
      image: "/images/blog/Rectangle 140.png",
      category: "Fix Common Issues",
    },
    {
      title: "Troubleshooting Joint Failures in Monsoon Season",
      desc: "High humidity slows down water evaporation in water-based glues. Fix common joint-slipping and weak-bond problems.",
      image: "/images/blog/Rectangle 142.png",
      category: "Fix Common Issues",
    },
    {
      title: "Why Plywood Delamination Happens and How to Prevent It",
      desc: "Plywood core gaps and uneven glue distribution cause internal failure. Prevent structural delamination with these tips.",
      image: "/images/blog/Rectangle 141.png",
      category: "Fix Common Issues",
    },
    {
      title: "Resolving Telegraphing Issues in Thin Veneers and Laminates",
      desc: "Telegraphing happens when substrate imperfections show through. Learn how to prepare surfaces for a mirror-smooth finish.",
      image: "/images/blog/Rectangle 143.png",
      category: "Fix Common Issues",
    },
    {
      title: "How to Remove Dried Adhesive Squeeze-Out Wood Surfaces Safely",
      desc: "Adhesive squeeze-out is inevitable. Discover the safest scraping and wiping methods for both wet and dry glue joints.",
      image: "/images/blog/Rectangle 140.png",
      category: "Fix Common Issues",
    },
    {
      title: "Preventing Edge Lifting in Decorative Plywood Panels",
      desc: "Edge lift ruins the look of premium furniture. Ensure maximum clamp pressure and adequate glue coverage at borders.",
      image: "/images/blog/Rectangle 142.png",
      category: "Fix Common Issues",
    },
  ];

  // Filter Blogs by category
  const filteredBlogs =
    activeList === "Latest Blogs"
      ? Blogs
      : Blogs.filter((blog) => blog.category === activeList);

  // Pagination calculation
  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);
  const indexOfLastBlog = currentPage * postsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - postsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <section className="flex flex-col lg:flex-row justify-between max-w-360 mx-auto my-4 sm:my-6 lg:my-18 px-5 lg:px-18 gap-12 z-50">
      {/* Sidebar Browse By Category Panel (Desktop) */}
      <div className="hidden lg:block space-y-6 lg:w-90 shrink-0 sticky top-28 self-start">
        <h2 className="text-2xl font-google-sans font-medium text-[#222]">
          Browse By Category
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {Lists.map((list) => {
            const isActive = activeList === list.name;
            return (
              <button
                key={list.name}
                onClick={() => {
                  setActiveList(list.name);
                  setCurrentPage(1);
                }}
                className={`group rounded-[20px] w-43 min-h-23.5 flex flex-col items-center justify-center px-4 py-3 text-center transition-all duration-300 cursor-pointer shadow-[4px_4px_6.9px_4px_rgba(0,0,0,0.10)] hover:shadow-xl ${
                  isActive ? "active-gradient-border" : "bg-white"
                }`}
              >
                <div className="relative w-9 h-9 mb-2 flex items-center justify-center mix-blend-hard-light">
                  <Image
                    src={list.icon}
                    alt={list.name}
                    width={36}
                    height={36}
                    className="object-contain max-h-full max-w-full group-hover:scale-125 transition-all duration-300"
                  />
                </div>
                <span className="font-google-sans font-medium text-[16px] text-[#181818] leading-tight">
                  {list.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Panel (Mobile/Tablet) */}
      <div className="block lg:hidden space-y-4">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .scrollbar-none::-webkit-scrollbar {
                display: none;
              }
            `,
          }}
        />
        <div className="flex items-center justify-between w-full gap-2">
          <button
            onClick={scrollLeft}
            className={`cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-all duration-200 ${
              showLeftArrow
                ? "block pointer-events-auto"
                : "hidden pointer-events-none"
            }`}
          >
            <ChevronLeftCircle size={24} className="text-[#FF0009]" />
          </button>
          <div
            ref={scrollContainerRef}
            className="flex-1 flex overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory gap-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {Lists.map((list) => {
              const isActive = activeList === list.name;
              return (
                <button
                  key={list.name}
                  onClick={() => {
                    setActiveList(list.name);
                    setCurrentPage(1);
                  }}
                  className={`${
                    isActive
                      ? "bg-linear-to-br from-[#FF0009] to-[#772571] text-white"
                      : "bg-[#efefef] text-black"
                  } cursor-pointer font-medium p-2 rounded-3xl text-xs sm:text-sm shrink-0 w-[calc(50%-4px)] text-center truncate snap-start`}
                >
                  {list.name}
                </button>
              );
            })}
          </div>
          <button
            onClick={scrollRight}
            className={`cursor-pointer focus:outline-none hover:scale-105 active:scale-95 shrink-0 transition-all duration-200 ${
              showRightArrow
                ? "block pointer-events-auto"
                : "hidden pointer-events-none"
            }`}
          >
            <ChevronRightCircle size={24} className="text-[#FF0009]" />
          </button>
        </div>
      </div>

      {/* Blogs Grid and Pagination Area */}
      <div className="flex-1 space-y-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {currentBlogs.map((blog, idx) => (
            <Link
              key={idx}
              href={`/blog/${blog.title.replace(/\s/g, "-").toLowerCase() ?? ""}`}
              className="flex flex-col bg-white rounded-[21px] group"
            >
              {/* Blog Image Container */}
              <div className="relative w-full h-50 sm:h-61.5 rounded-[21px] overflow-hidden bg-surface">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              {/* Blog Info */}
              <div className="flex flex-col flex-1 pt-6 pb-2 space-y-4">
                <h3 className="font-amethysta text-xl lg:text-[26px] text-black font-normal mb-3 hover:text-[#ff0009] transition-colors cursor-pointer line-clamp-2 pb-0.5">
                  {blog.title}
                </h3>
                <p className="text-base lg:text-xl text-[#222] leading-normal line-clamp-2">
                  {blog.desc}
                </p>
                <button className="active-gradient-border text-[#ff0009] hover:bg-[#ff0009] transition-all font-google-sans font-medium text-base w-34.5 h-9 rounded-[20px] flex items-center justify-center cursor-pointer">
                  Read Post
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center md:justify-start gap-3 font-google-sans text-[20px] text-[#222]">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="hover:text-[#ff0009] disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1 cursor-pointer font-medium"
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 transition-colors cursor-pointer ${
                  currentPage === page
                    ? "font-bold underline decoration-solid underline-offset-[6px] text-black"
                    : "hover:text-[#ff0009] text-[#222]"
                }`}
              >
                {page}
              </button>
            ))}

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
        )}
      </div>
    </section>
  );
}
