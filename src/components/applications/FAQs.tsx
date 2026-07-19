"use client";
import Image from "next/image";
import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Which adhesive should I use for furniture and woodwork?",
    answer:
      "The right adhesive depends on the surface, type of furniture work, expected strength and application condition. For furniture assembly, plywood work, lamination, veneering and joinery, choose a Jivanjor product based on the specific use case and performance need.",
  },
  {
    question: "Can Jivanjor adhesives be used for plywood and boards?",
    answer:
      "Yes, Jivanjor offers a range of adhesives specifically formulated for plywood, MDF and boards. Products like Supremo and Watershield provide excellent bonding strength for lamination, veneering and surface bonding on boards.",
  },
  {
    question: "What should I check before applying adhesive on wood?",
    answer:
      "Ensure the surface is clean, dry and free from dust, oil or moisture. Wood should be properly acclimatized to room temperature. For best results, lightly sand the surface before application to improve adhesion.",
  },
  {
    question: "How can I avoid bubbles or weak bonding in furniture work?",
    answer:
      "Apply adhesive evenly using a notched trowel, press from the center outward to expel trapped air, and apply adequate clamping pressure during the open time. Avoid applying on humid surfaces or in extreme temperatures.",
  },
];
interface FAQsProps {
  title?: string;
  subtitle?: string;
  items?: FaqItem[];
}

export default function FQAs({ title, subtitle, items }: FAQsProps) {
  const displayTitle = title || "FAQs";
  const displaySubtitle = subtitle || "Find quick answers about product use, coverage, setting time, pack sizes and technical details.";
  const displayItems = items || FAQ_ITEMS;
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section
      id="faqs"
      className="bg-surface max-w-324 mx-5 xl:mx-auto mb-12 p-5 xl:p-10 space-y-16 xl:space-y-20 rounded-3xl"
    >
      {/* ========================================== */}
      {/* 1. FAQS ACCORDION SECTION */}
      {/* ========================================== */}
      <div className="">
        {/* Header content with link icon */}
        <div className="text-center space-y-3 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <Image
              className="mb-2"
              src="/images/badge.png"
              width={40}
              height={40}
              alt="badge"
            />
          </div>
          <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-5xl font-normal leading-normal">
            {displayTitle}
          </h2>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto leading-normal">
            {displaySubtitle}
          </p>
        </div>

        {/* FAQs Container Card */}
        <div className="max-w-full mx-auto mt-6">
          <div className="w-full">
            {displayItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.question}
                  className="border-t overflow-hidden first:border-t-0"
                >
                  {/* Accordion header button */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left py-6 flex justify-between items-center cursor-pointer group select-none gap-4 lg:px-4"
                  >
                    <span className="font-amethysta text-lg sm:text-2xl lg:text-[32px] group-hover:text-primary transition-colors duration-200 leading-normal lg:px-2">
                      {item.question}
                    </span>

                    {/* Toggle Icon */}
                    {isOpen ? (
                      <span className="text-[#FF0009] text-2xl font-light select-none pr-1">
                        &times;
                      </span>
                    ) : (
                      <span className="text-black group-hover:text-neutral-600 text-2xl font-light select-none pr-1">
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
                    <p className="text-sm md:text-lg leading-normal font-normal max-w-4xl lg:px-6">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
