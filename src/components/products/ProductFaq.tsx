"use client";
import Image from "next/image";
import { useState } from "react";

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

interface ProductFaqProps {
  product?: any;
}

export default function ProductFaq({ product }: ProductFaqProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  const faqsList = product?.faqs && Array.isArray(product.faqs)
    ? product.faqs.filter((f: any) => f && f.question && f.question.trim() !== "")
    : [];

  if (faqsList.length === 0) {
    return null;
  }

  return (
    <section
      id="faqs"
      className="bg-surface max-w-324 mx-auto mb-4 md:mb-8 p-5 xl:p-10 space-y-16 xl:space-y-20 rounded-3xl"
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
          <h2 className="font-amethysta text-2xl sm:text-3xl lg:text-4xl font-normal leading-normal">
            {product?.faqsTitle || "FAQs"}
          </h2>
          <p className="text-base md:text-xl max-w-2xl mx-auto leading-normal">
            {product?.faqsDescription || "Find quick answers about product use, coverage, setting time, pack sizes and technical details."}
          </p>
        </div>

        {/* FAQs Container Card */}
        <div className="max-w-full mx-auto mt-6">
          <div className="w-full">
            {faqsList.map((item: any, idx: number) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={item.question}
                  className="border-t overflow-hidden first:border-t-0"
                >
                  {/* Accordion header button */}
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left py-5 flex justify-between items-center cursor-pointer group select-none gap-4 lg:px-4"
                  >
                    <span className="font-amethysta text-base sm:text-xl lg:text-2xl group-hover:text-primary transition-colors duration-200 leading-normal lg:px-2">
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
                    <p className="text-sm md:text-lg leading-normal font-normal max-w-2xl lg:px-6">
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
