"use client";
import Image from "next/image";
import { useState } from "react";
import { RightChoice } from "../categories";

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
      <section className="bg-surface max-w-324 mx-6 xl:mx-auto p-12 xl:p-16 space-y-16 xl:space-y-20 rounded-3xl">
        {/* ========================================== */}
        {/* 1. FAQS ACCORDION SECTION */}
        {/* ========================================== */}
        <div className="space-y-8">
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
            <h2 className="font-amethysta text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
              FAQs
            </h2>
            <p className="text-lg md:text-2xl max-w-2xl mx-auto">
              Find quick answers about product use, coverage, setting time, pack
              sizes and technical details.
            </p>
          </div>

          {/* FAQs Container Card */}
          <div className="max-w-full mx-auto mt-20">
            <div className="w-full">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={item.question} className="border-t overflow-hidden">
                    {/* Accordion header button */}
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full text-left py-6 flex justify-between items-center cursor-pointer group select-none gap-4"
                    >
                      <span className="font-amethysta text-lg sm:text-2xl lg:text-3xl group-hover:text-primary transition-colors duration-200">
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
                      <p className="text-sm md:text-lg leading-relaxed font-normal max-w-2xl">
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
      <RightChoice />
    </>
  );
}
