"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RightChoice } from "@/components/categories";

const sections = [
  { id: "science", title: "The Science of Air Entrapment" },
  { id: "humidity", title: "How Humidity Affects Curing Time" },
  { id: "rules", title: "Three Application Rules for Flawless Laminates" },
  { id: "formulation", title: "The Role of Adhesive Formulation" },
];

const relatedArticles = [
  {
    title: "How to Properly Acclimatize Wood and Laminates Before Bonding",
    desc: "Wood and laminates are hygroscopic materials that expand and contract. Learn how proper acclimatization prevents warped panels.",
    image: "/images/blog/Rectangle 142.png",
  },
  {
    title: "Choosing the Right Notched Trowel for Consistent Adhesive Spread",
    desc: "Using the correct notch size ensures an even glue film, reducing excess moisture and minimizing the risk of laminate bubbling.",
    image: "/images/blog/Rectangle 141.png",
  },
  {
    title: "Best Practices for Center-to-Edge Pressing in Plywood Applications",
    desc: "A step-by-step guide to using J-rollers and pressing blocks to systematically force out trapped air during bonding.",
    image: "/images/blog/Rectangle 143.png",
  },
];

export default function BlogContent() {
  const [activeSection, setActiveSection] = useState("science");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({
        top,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Image Section */}
      <section className="max-w-360 mx-auto px-5 mb-10 md:mb-16">
        <div className="hidden sm:block relative w-full h-55 sm:h-87.5 md:h-106.25 rounded-[20px] overflow-hidden bg-surface shadow-md">
          <Image
            src="/images/blog/Rectangle 125.png"
            alt="Mastering Laminate Bonding"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1440px) 100vw, 1295px"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="relative w-full h-47 sm:hidden rounded-[20px] overflow-hidden bg-surface shadow-md">
          <Image
            src="/images/blog/Rectangle 125 (1).png"
            alt="Mastering Laminate Bonding"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1440px) 100vw, 1295px"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </section>

      {/* Main Grid: Sidebar + Content */}
      <section className="flex flex-col lg:flex-row justify-between max-w-360 mx-auto px-5 gap-5 lg:gap-10 relative">
        {/* Table of Contents Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0 self-start sticky top-28 space-y-4">
          <h3 className="text-2xl font-google-sans font-bold text-[#222]">
            Table of Contents
          </h3>
          <nav className="flex flex-col gap-3 font-google-sans text-lg text-[#222] max-w-3xs px-2">
            {sections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`text-left transition-all duration-200 cursor-pointer ${
                    isActive
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

        {/* Table of Contents Accordion/Block (Mobile/Tablet) */}
        <div className="block lg:hidden pl-5 mb-5 border-l">
          <div className="group">
            <div className="font-google-sans font-bold text-xl text-[#222] list-none flex items-center justify-between cursor-pointer">
              <span>Table of Contents</span>
            </div>
            <nav className="flex flex-col gap-2 font-google-sans text-base text-[#222] mt-4">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      scrollToSection(section.id);
                    }}
                    className={`text-left py-1 transition-all cursor-pointer ${
                      isActive ? "underline" : "hover:font-medium"
                    }`}
                  >
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="flex flex-col space-y-6 md:space-y-10">
          {/* TLDR Summary */}
          <div className="hidden md:block bg-surface p-5 md:p-10 border-l-[5px] border-[#FF0009]">
            <h4 className="font-google-sans font-bold text-xl md:text-[22px] text-[#222] mb-3">
              TLDR :
            </h4>
            <p className="font-google-sans text-base md:text-lg lg:text-[22px] text-[#222] max-w-4xl">
              Laminate bubbling is a common failure point in coastal or
              high-humidity interior woodwork. This guide covers how varying
              moisture levels affect synthetic resins and how selecting an
              anti-bubble formulation, combined with proper pressure techniques,
              guarantees a flawless, long-lasting finish.
            </p>
          </div>

          {/* Blog Article Main Content */}
          <article className="flex-1 space-y-12 min-w-0 border-l-0 md:border-l border-[#00000099] px-0 md:px-10">
            {/* Section 1: The Science of Air Entrapment */}
            <div id="science" className="space-y-6 scroll-mt-28">
              <p className="font-google-sans text-base md:text-lg lg:text-[22px] text-[#222]">
                Bubbles in laminate applications rarely happen by chance; they
                are the direct result of trapped air or moisture expanding
                beneath the surface. When pressing decorative laminates onto MDF
                or commercial ply, microscopic pockets of air can become trapped
                if the adhesive is spread unevenly.
              </p>
              <p className="font-google-sans text-base md:text-lg lg:text-[22px] text-[#222]">
                In standard environments, a high-quality adhesive can sometimes
                absorb minor imperfections. However, when working in
                environments with fluctuating temperatures, the air within these
                trapped pockets expands, creating enough upward pressure to lift
                the laminate from the substrate, resulting in visible bubbles.
              </p>
            </div>

            {/* TLDR Summary */}
            <div className="md:hidden bg-surface p-5 md:p-10 border-l-[5px] border-[#FF0009]">
              <h4 className="font-google-sans font-bold text-xl md:text-[22px] text-[#222] mb-3">
                TLDR :
              </h4>
              <p className="font-google-sans text-lg text-[#222] max-w-76">
                Laminate bubbling is a common failure point in coastal or
                high-humidity interior woodwork. This guide covers how varying
                moisture levels affect synthetic resins and how selecting an
                anti-bubble formulation, combined with proper pressure
                techniques, guarantees a flawless, long-lasting finish.
              </p>
            </div>

            {/* Section 2: How Humidity Affects Curing Time */}
            <div id="humidity" className="space-y-6 scroll-mt-28">
              <h3 className="font-amethysta text-2xl md:text-[36px] text-[#222] leading-tight font-normal">
                How Humidity Affects Curing Time
              </h3>
              <p className="font-google-sans text-base md:text-lg lg:text-[22px] text-[#222]">
                Wood and laminates are hygroscopic, meaning they naturally
                absorb and release moisture based on the surrounding
                environment. During monsoon seasons or in coastal regions, the
                moisture content in commercial plywood can spike significantly.
                When a water-based synthetic resin (PVA) is applied to damp
                wood, the curing process slows down.
              </p>
              <p className="font-google-sans text-base md:text-lg lg:text-[22px] text-[#222]">
                The water within the adhesive takes longer to evaporate,
                extending the open time but weakening the initial grab. If
                pressure is released too early, the laminate can shift or lift,
                allowing air to enter the joint before the bond reaches its full
                structural integrity.
              </p>
            </div>

            {/* Section 3: Three Application Rules for Flawless Laminates */}
            <div id="rules" className="space-y-6 scroll-mt-28">
              <h3 className="font-amethysta text-2xl md:text-[36px] text-[#222] leading-tight font-normal">
                Three Application Rules for Flawless Laminates
              </h3>
              <p className="font-google-sans text-base md:text-lg lg:text-[22px] text-[#222]">
                To achieve a perfectly flat, secure bond on every project,
                contractors should standardize the following practices:
              </p>
              <ul className="list-disc pl-5 space-y-4 font-google-sans leading-normal text-base md:text-lg lg:text-[22px] text-[#222]">
                <li>
                  Substrate Acclimatization: Never apply laminates to plywood
                  that has just been brought in from the rain or high humidity.
                  Allow both the substrate and the laminate to acclimatize in
                  the working environment for at least 24 to 48 hours before
                  bonding.
                </li>
                <li>
                  The Right Spread Rate: Using a finely notched trowel is
                  non-negotiable. A notched trowel ensures an even, consistent
                  film of adhesive. Applying too much glue &quot;just to be
                  safe&quot; actually increases the risk of bubbling, as excess
                  moisture becomes trapped under the impermeable laminate.
                </li>
                <li>
                  Center-to-Edge Pressing: Once the laminate is placed, use a
                  J-roller or a firm block. Always apply heavy pressure starting
                  from the absolute center of the board and work your way
                  outward to the edges. This systematically forces any trapped
                  air out before the edges are sealed.
                </li>
              </ul>
            </div>

            {/* Section 4: The Role of Adhesive Formulation */}
            <div id="formulation" className="space-y-6 scroll-mt-28">
              <h3 className="font-amethysta text-2xl md:text-[36px] text-[#222] leading-tight font-normal">
                The Role of Adhesive Formulation
              </h3>
              <p className="font-google-sans text-base md:text-lg lg:text-[22px] text-[#222]">
                Technique can only take you so far; the chemical makeup of your
                adhesive dictates your margin of error.
              </p>
              <p className="font-google-sans text-base md:text-lg lg:text-[22px] text-[#222]">
                For high-stakes decorative surfaces, professionals should rely
                on specialist formulations rather than generic woodworking
                glues. Products like Jivanjor Lamino are specifically engineered
                with anti-bubble technology and water-resistant properties. Its
                specific viscosity prevents the easy entrapment of air during
                the spreading process, ensuring a smooth, premium finish every
                time.
              </p>
              <p className="font-google-sans text-base md:text-lg lg:text-[22px] text-[#222]">
                For projects requiring rapid turnarounds without sacrificing
                coverage, stepping up to Jivanjor Supremo ensures a
                high-strength bond that sets rapidly, mitigating the risks
                associated with extended curing times in unpredictable weather.
              </p>
            </div>

            {/* Share on Socials */}
            <div className="flex flex-col gap-4">
              <p className="font-google-sans font-medium text-[18px] text-[#222]">
                Share on Socials
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-[#e4e4e7] transition-colors cursor-pointer"
                >
                  <Image
                    src="/images/facebook.svg"
                    alt="Facebook"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-[#e4e4e7] transition-colors cursor-pointer"
                >
                  <Image
                    src="/images/instagram.svg"
                    alt="Instagram"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-surface hover:bg-[#e4e4e7] transition-colors cursor-pointer"
                >
                  <Image
                    src="/images/youtube.svg"
                    alt="YouTube"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
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
                <div className="aspect-27/16 md:aspect-39/23 w-12.5 md:w-18.5 h-12.5 md:h-18.5 rounded-full bg-[#DBDBDB] flex items-center justify-center shrink-0 p-2">
                  <Image
                    src="/images/badge.svg"
                    alt="Jivanjor Logo"
                    height={50}
                    width={50}
                    className="object-contain h-4 w-7 md:h-6 md:w-10"
                  />
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <h5 className="font-google-sans font-medium text-[22px]">
                    Jivanjor Product Experts
                  </h5>
                </div>
              </div>
              <p className="font-google-sans text-base md:text-lg max-w-xl">
                Knowledge shaped by Jivanjor’s team of product specialists,
                woodworking experts and professionals who understand adhesive
                performance, application needs and real woodwork conditions.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Related Articles Section */}
      <section className="bg-white">
        <div className="max-w-360 mx-auto p-5 py-12 md:py-18 space-y-6">
          <h2 className="font-amethysta text-3xl md:text-[56px] text-center text-[#222] font-normal leading-tight">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((article, idx) => (
              <Link
                key={idx}
                href={`/blog/${article.title.replace(/\s/g, "-").toLowerCase()}`}
                className="flex flex-col bg-white rounded-[20px] group overflow-hidden hover:shadow-lg transition-all duration-300 p-2"
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
                <div className="flex flex-col flex-1 pt-6 pb-2 px-2 space-y-4">
                  <h3 className="font-amethysta text-xl lg:text-[26px] text-black font-normal hover:text-[#ff0009] transition-colors line-clamp-2 pb-0.5">
                    {article.title}
                  </h3>
                  <p className="text-base leading-normal text-[#222] line-clamp-2">
                    {article.desc}
                  </p>
                  <button className="border-2 border-[#ff0009] text-[#ff0009] hover:bg-[#ff0009] hover:text-white transition-all font-google-sans font-medium text-base w-34.5 h-9 rounded-[20px] flex items-center justify-center cursor-pointer">
                    Read Post
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <RightChoice />
    </div>
  );
}
