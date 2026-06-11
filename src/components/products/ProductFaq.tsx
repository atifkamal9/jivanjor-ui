"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RightChoice } from "../category";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How long does Supremo take to set?",
    answer:
      "Supremo boasts a superfast setting time of just 1 hour, though this may vary slightly depending on environmental temperature and humidity.",
  },
  {
    question: "What is the coverage area for 1 Kg of Supremo?",
    answer:
      "Jivanjor Supremo provides coverage of approximately 60-70 sq.ft per kg, depending on the thickness of application and porosity of the substrate.",
  },
  {
    question: "Is Supremo waterproof?",
    answer:
      "Supremo is standard premium white adhesive offering excellent heat and general moisture resistance. For high exposure water areas, Jivanjor Watershield or Aquabond is recommended.",
  },
  {
    question: "What pack sizes are available for commercial use?",
    answer:
      "Supremo is available in various packaging formats including 1 Kg, 2 Kg, 5 Kg, 10 Kg, 20 Kg, 30 Kg, 50 Kg, and 60 Kg to meet diverse commercial project requirements.",
  },
];

export default function ProductFaq() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <>
      <section className="bg-surface max-w-7xl mx-6 xl:mx-auto p-12 xl:p-16 space-y-16 xl:space-y-20 rounded-3xl">
        {/* ========================================== */}
        {/* 1. FAQS ACCORDION SECTION */}
        {/* ========================================== */}
        <div className="space-y-8">
          {/* Header content with link icon */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="text-neutral-800 flex justify-center">
              {/* Custom Link icon */}
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-5xl font-normal text-neutral-800 leading-tight">
              FAQs
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
              Find quick answers about product use, coverage, setting time, pack
              sizes and technical details.
            </p>
          </div>

          {/* FAQs Container Card */}
          <div className="border border-neutral-100/50 shadow-2xs max-w-4xl mx-auto">
            <div className="w-full border-b border-neutral-300">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={item.question}
                    className="border-t border-neutral-300 overflow-hidden"
                  >
                    {/* Accordion header button */}
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full text-left py-5 flex justify-between items-center cursor-pointer group select-none gap-4"
                    >
                      <span className="font-amethysta text-lg sm:text-xl lg:text-2xl text-neutral-800 group-hover:text-primary transition-colors duration-200">
                        {item.question}
                      </span>

                      {/* Toggle Icon */}
                      {isOpen ? (
                        <span className="text-[#ed1c24] text-xl sm:text-2xl font-light select-none pr-1">
                          &times;
                        </span>
                      ) : (
                        <span className="text-neutral-400 group-hover:text-neutral-600 text-xl sm:text-2xl font-light select-none pr-1">
                          +
                        </span>
                      )}
                    </button>

                    {/* Expandable answer panel */}
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "max-h-75 opacity-100 pb-5"
                          : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-light">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 2. BOTTOM GRADIENT CTA BANNER */}
        {/* ========================================== */}
        {/* <div className="relative bg-linear-to-r from-[#FF0009] to-[#772571] text-white rounded-[28px] overflow-hidden shadow-md p-8 sm:p-12 max-w-6xl mx-auto">
        <div className="absolute inset-y-0 left-0 w-full md:w-[60%] pointer-events-none opacity-20 z-0">
          <Image
            src="/images/watermark-1.png"
            alt="Jivanjor watermark logo"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10">
          <div className="text-center md:text-left space-y-2 max-w-xl">
            <h3 className="font-amethysta text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight">
              Need Help Choosing the Right Adhesive?
            </h3>
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-light">
              Share your woodwork needs, product query or application concerns.
              Our team will help you find the right Jivanjor solution.
            </p>
          </div>

          <Link
            href="#"
            className="w-full sm:w-auto bg-white hover:bg-white/95 hover:shadow-lg text-[#A31652] font-bold text-center px-8 py-3.5 rounded-full transition-all active:scale-[0.98] shrink-0 text-sm"
          >
            Submit Your Query
          </Link>
        </div>
      </div> */}
      </section>
      <RightChoice />
    </>
  );
}
