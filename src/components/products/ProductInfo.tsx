"use client";
import Image from "next/image";
import { useState } from "react";

type TabName = "Overview" | "Tech Specs" | "USPs" | "Applications" | "FAQs";

export default function ProductInfo() {
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tabs: { name: TabName; label: string; icon: React.ReactNode }[] = [
    {
      name: "Overview",
      label: "Overview",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Tech Specs",
      label: "Tech Specs",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "USPs",
      label: "USPs",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.25.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      name: "Applications",
      label: "Applications",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      name: "FAQs",
      label: "FAQs",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10 lg:py-16">
      {/* Tab bar header pill container */}
      <div className="hidden md:flex items-center overflow-x-auto pb-4 px-6 md:mx-0 md:px-0 scrollbar-none">
        <div
          className="flex items-center bg-white rounded-full my-10 p-1.5 max-w-4xl mx-auto gap-1 md:gap-2 shrink-0"
          style={{
            boxShadow: `4px 4px 12.1px 4px rgba(0, 0, 0, 0.10)`,
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all cursor-pointer select-none shrink-0 ${
                  isActive
                    ? "bg-linear-to-tr from-[#FF0009] to-[#772571] text-white shadow-[0_4px_12px_rgba(163,22,82,0.25)]"
                    : "hover:bg-surface transition-colors"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content body container */}
      <div className="bg-surface rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-neutral-100 transition-all duration-300">
        {/* ==================== 1. OVERVIEW TAB ==================== */}
        {activeTab === "Overview" && (
          <div className="">
            {/* Centered link icon & tagline */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto p-6 sm:p-10 lg:p-12 space-y-4">
              <div className="text-[#A31652]">
                {/* Custom Interlocking Infinity Loop */}
                <Image
                  className=""
                  src="/images/badge.png"
                  width={40}
                  height={40}
                  alt="badge"
                />
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl font-normal leading-relaxed">
                Watershield provides excellent water-resistance. Its superior
                flow makes it smooth and easy to apply.
              </p>
            </div>

            {/* Split specifications grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 p-6 sm:p-10 lg:p-12">
              {/* Left Column: Technical Specifications */}
              <div>
                <h3 className="font-amethysta text-2xl lg:text-3xl pb-3 border-b border-neutral-300/80 mb-6 font-medium">
                  Technical Specifications
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-neutral-200/40">
                    <span className="text-neutral-500 font-medium text-sm sm:text-base">
                      Appearance
                    </span>
                    <span className="font-bold text-sm sm:text-base text-right">
                      Milk White
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-200/40">
                    <span className="text-neutral-500 font-medium text-sm sm:text-base">
                      Solids
                    </span>
                    <span className="font-bold text-sm sm:text-base text-right">
                      50-53%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-200/40">
                    <span className="text-neutral-500 font-medium text-sm sm:text-base">
                      Viscosity
                    </span>
                    <span className="font-bold text-sm sm:text-base text-right">
                      150-250 Poise
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-200/40">
                    <span className="text-neutral-500 font-medium text-sm sm:text-base">
                      Coverage
                    </span>
                    <span className="font-bold text-sm sm:text-base text-right">
                      60-70 Sqft/Kg
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Pack Sizes & Documentation */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-amethysta text-2xl lg:text-3xl pb-3 border-b border-neutral-300/80 mb-6 font-medium">
                    Pack Sizes & Documentation
                  </h3>

                  {/* Grid layout of sizes chips */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                    {[
                      "0.6 Kg",
                      "1 Kg",
                      "2 Kg",
                      "5 Kg",
                      "10 Kg",
                      "20 Kg",
                      "30 Kg",
                      "50 Kg",
                      "60 Kg",
                    ].map((size) => (
                      <div
                        key={size}
                        className="bg-white border border-neutral-200/50 rounded-lg py-2.5 text-center text-xs sm:text-sm font-bold text-neutral-700 shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all duration-200 cursor-default"
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PDF technical data sheet download action */}
                <button className="w-full sm:w-auto self-center md:self-start bg-linear-to-tr from-[#FF0009] to-[#772571] hover:opacity-90 text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-md transition-all active:scale-[0.98] cursor-pointer text-center">
                  Download Technical Data Sheet
                </button>
              </div>
            </div>

            {/* Bottom USP Section (Rounded Teal box) */}
            <div className="bg-[#0498AA] rounded-[28px] p-8 sm:p-10 lg:p-12 text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                {/* USP 1 */}
                <div className="text-center space-y-3">
                  <div className="text-white">
                    <svg
                      className="w-8 h-8 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      <path d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <h4 className="font-amethysta text-xl font-medium tracking-wide">
                    Faster Site Rotation
                  </h4>
                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-light max-w-xs mx-auto">
                    Fast setting time helps professionals complete work quicker
                    and move between jobs more efficiently.
                  </p>
                </div>

                {/* USP 2 */}
                <div className="text-center space-y-3">
                  <div className="text-white">
                    <svg
                      className="w-8 h-8 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <path
                        strokeLinecap="round"
                        d="M9 4L4 9M14 4L4 14M19 4L4 19M20 9L9 20M20 14L14 20"
                      />
                    </svg>
                  </div>
                  <h4 className="font-amethysta text-xl font-medium tracking-wide">
                    Smooth Spreadability
                  </h4>
                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-light max-w-xs mx-auto">
                    Superior flow and easy spreading help reduce wastage and
                    support better coverage.
                  </p>
                </div>

                {/* USP 3 */}
                <div className="text-center space-y-3">
                  <div className="text-white">
                    <svg
                      className="w-8 h-8 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path
                        strokeLinecap="round"
                        d="M12 8v8M8 12h8M9.17 9.17l5.66 5.66M9.17 14.83l5.66-5.66"
                      />
                    </svg>
                  </div>
                  <h4 className="font-amethysta text-xl font-medium tracking-wide">
                    Solvent-Free Safety
                  </h4>
                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-light max-w-xs mx-auto">
                    Water-based, non-flammable and non-toxic formulation for
                    safer handling during application.
                  </p>
                </div>

                {/* USP 4 */}
                <div className="text-center space-y-3">
                  <div className="text-white">
                    <svg
                      className="w-8 h-8 mx-auto mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                      <circle cx="17" cy="7" r="1.5" fill="currentColor" />
                      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                      <circle cx="17" cy="17" r="1.5" fill="currentColor" />
                      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                      <circle cx="7" cy="17" r="1.5" fill="currentColor" />
                      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
                      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                    </svg>
                  </div>
                  <h4 className="font-amethysta text-xl font-medium tracking-wide">
                    Clean Finish After Drying
                  </h4>
                  <p className="text-xs sm:text-sm opacity-90 leading-relaxed font-light max-w-xs mx-auto">
                    Dries into a clear transparent film, helping maintain a neat
                    finish around edges and joints.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 2. TECH SPECS TAB ==================== */}
        {activeTab === "Tech Specs" && (
          <div className="space-y-6">
            <h3 className="font-amethysta text-2xl lg:text-3xl pb-3 border-b border-neutral-300 mb-6">
              Complete Technical Specifications
            </h3>
            <div className="overflow-x-auto bg-white rounded-2xl shadow-2xs border border-neutral-200/50">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-600 font-bold uppercase tracking-wider text-xs border-b border-neutral-200">
                    <th className="p-4 sm:p-5">Parameter</th>
                    <th className="p-4 sm:p-5">Specification Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700">
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-neutral-800">
                      Appearance
                    </td>
                    <td className="p-4 sm:p-5">Milk White emulsion</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-neutral-800">
                      Solids Content
                    </td>
                    <td className="p-4 sm:p-5">50% - 53%</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-neutral-800">
                      Viscosity at 30°C
                    </td>
                    <td className="p-4 sm:p-5">150 - 250 Poise</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-neutral-800">
                      Theoretical Coverage
                    </td>
                    <td className="p-4 sm:p-5">
                      60 - 70 sq.ft per kg (depends on surface porosity)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-neutral-800">
                      Open Time
                    </td>
                    <td className="p-4 sm:p-5">
                      10 - 15 minutes at standard ambient temperature
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-neutral-800">
                      Setting Time
                    </td>
                    <td className="p-4 sm:p-5">
                      2 - 3 hours (complete curing in 24 hours)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold text-neutral-800">
                      Acid / Water Resistance
                    </td>
                    <td className="p-4 sm:p-5">
                      Excellent D3 waterproofing grade protection
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== 3. USPS TAB ==================== */}
        {activeTab === "USPs" && (
          <div className="space-y-6">
            <h3 className="font-amethysta text-2xl lg:text-3xl pb-3 border-b border-neutral-300 mb-6">
              Core Unique Selling Propositions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
                <h4 className="font-bold text-lg text-[#0498AA]">
                  1. Fast Drying & Strong Bond
                </h4>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Engineered for high initial tack, it speeds up setting times
                  to 2-3 hours. This increases rotation speed and reduces
                  structural clamping times.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
                <h4 className="font-bold text-lg text-[#0498AA]">
                  2. Excellent Moisture Resistance
                </h4>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Compliant with D3 European grade water-resistance guidelines.
                  Prevents laminate peeling in highly humid spaces like kitchens
                  and bathrooms.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
                <h4 className="font-bold text-lg text-[#0498AA]">
                  3. Superior Coverage Ratio
                </h4>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Provides a high coverage rate of up to 70 sqft/kg. Spreads
                  easily and creates a thin, ultra-strong bonding film, reducing
                  overall glue consumption.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-2xs space-y-3">
                <h4 className="font-bold text-lg text-[#0498AA]">
                  4. Safe & Odourless Application
                </h4>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  Formulated completely without hazardous organic solvents or
                  toxic compounds. Zero VOC emission, safe for both children and
                  carpentry teams.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 4. APPLICATIONS TAB ==================== */}
        {activeTab === "Applications" && (
          <div className="space-y-6">
            <h3 className="font-amethysta text-2xl lg:text-3xl pb-3 border-b border-neutral-300 mb-6">
              Recommended Applications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-2xs flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-bold text-[#A31652] text-lg">
                    Kitchen & Bathroom Units
                  </h4>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                    Perfect for modular kitchen setups, sinks, under-counter
                    cabinets, vanity frames, and other spaces exposed to
                    humidity or steam.
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-2xs flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-bold text-[#A31652] text-lg">
                    Laminate to Wood Bonding
                  </h4>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                    Bonding decorative laminates, mica layers, and wood veneers
                    to plywood, particle board, or medium-density fiberboards
                    (MDF).
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-2xs flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-bold text-[#A31652] text-lg">
                    General Carpentry Joints
                  </h4>
                  <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                    High-strength mortise & tenon joints, finger jointing,
                    dowelling, furniture assembly, and regular domestic edge
                    bonding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 5. FAQS TAB ==================== */}
        {activeTab === "FAQs" && (
          <div className="space-y-4">
            <h3 className="font-amethysta text-2xl lg:text-3xl pb-3 border-b border-neutral-300 mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* FAQ 1 */}
              <div className="bg-white rounded-2xl border border-neutral-200/50 shadow-2xs overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
                  className="w-full text-left px-6 py-4 font-bold flex justify-between items-center cursor-pointer hover:bg-neutral-50/50"
                >
                  <span>
                    What is the drying and setting time for Jivanjor
                    Watershield?
                  </span>
                  <span className="text-[#A31652] text-xl font-bold">
                    {openFaq === 0 ? "−" : "+"}
                  </span>
                </button>
                {openFaq === 0 && (
                  <div className="px-6 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100/50">
                    Jivanjor Watershield has a fast-drying profile. Clamping or
                    pressing time is usually 2 to 3 hours under standard ambient
                    conditions, while complete load-bearing strength and curing
                    is achieved after 24 hours.
                  </div>
                )}
              </div>

              {/* FAQ 2 */}
              <div className="bg-white rounded-2xl border border-neutral-200/50 shadow-2xs overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                  className="w-full text-left px-6 py-4 font-bold flex justify-between items-center cursor-pointer hover:bg-neutral-50/50"
                >
                  <span>How does Watershield achieve D3 water resistance?</span>
                  <span className="text-[#A31652] text-xl font-bold">
                    {openFaq === 1 ? "−" : "+"}
                  </span>
                </button>
                {openFaq === 1 && (
                  <div className="px-6 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100/50">
                    Jivanjor Watershield is engineered with advanced
                    cross-linking polymer technologies that resist water
                    ingress. It complies with D3 grade specifications according
                    to European Standard EN 204, making it highly effective at
                    preserving joint bonds in damp or moisture-rich zones.
                  </div>
                )}
              </div>

              {/* FAQ 3 */}
              <div className="bg-white rounded-2xl border border-neutral-200/50 shadow-2xs overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                  className="w-full text-left px-6 py-4 font-bold flex justify-between items-center cursor-pointer hover:bg-neutral-50/50"
                >
                  <span>
                    Is Jivanjor Watershield safe for indoor environments?
                  </span>
                  <span className="text-[#A31652] text-xl font-bold">
                    {openFaq === 2 ? "−" : "+"}
                  </span>
                </button>
                {openFaq === 2 && (
                  <div className="px-6 pb-5 pt-1 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100/50">
                    Yes, it is completely water-based, solvent-free, non-toxic,
                    and non-flammable. It complies with safety regulations and
                    has zero volatile organic compound (VOC) emissions, making
                    it completely safe for indoor installations and household
                    furniture.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
