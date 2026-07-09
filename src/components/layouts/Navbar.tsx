"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  aboutItems,
  knowledgeItems,
  partnerItems,
  productCategories,
} from "@/lib/nav";
import { ChevronRight } from "lucide-react";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  const [isAOpen, setIsAOpen] = useState(false);
  const [iskOpen, setIskOpen] = useState(false);
  const [isPOpen, setIsPOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Woodworking Adhesives");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const kTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsProductsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, 200);
  };

  const handleAMouseEnter = () => {
    if (aTimeoutRef.current) {
      clearTimeout(aTimeoutRef.current);
      aTimeoutRef.current = null;
    }
    setIsAOpen(true);
  };

  const handleAMouseLeave = () => {
    aTimeoutRef.current = setTimeout(() => {
      setIsAOpen(false);
    }, 200);
  };

  const handleKMouseEnter = () => {
    if (kTimeoutRef.current) {
      clearTimeout(kTimeoutRef.current);
      kTimeoutRef.current = null;
    }
    setIskOpen(true);
  };

  const handleKMouseLeave = () => {
    kTimeoutRef.current = setTimeout(() => {
      setIskOpen(false);
    }, 200);
  };

  const handlePMouseEnter = () => {
    if (pTimeoutRef.current) {
      clearTimeout(pTimeoutRef.current);
      pTimeoutRef.current = null;
    }
    setIsPOpen(true);
  };

  const handlePMouseLeave = () => {
    pTimeoutRef.current = setTimeout(() => {
      setIsPOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (aTimeoutRef.current) clearTimeout(aTimeoutRef.current);
      if (kTimeoutRef.current) clearTimeout(kTimeoutRef.current);
      if (pTimeoutRef.current) clearTimeout(pTimeoutRef.current);
    };
  }, []);

  const activeCategoryData =
    productCategories.find((c) => c.name === activeCategory) ||
    productCategories[0];

  return (
    <header
      id="main-landing-header"
      className="sticky top-0 left-0 right-0 z-50 w-full h-22 bg-white backdrop-blur-md transition-all duration-300 flex items-center"
    >
      <nav className="flex items-center justify-between max-w-360 mx-auto w-full px-6 font-google-sans relative">
        <Link href="/" className="shrink-0">
          <Image
            className="aspect-2/1 w-28 h-14 md:w-30 md:h-auto"
            src="/images/logo.png"
            alt="Jivanjor Logo"
            loading="eager"
            width={120}
            height={72}
          />
        </Link>
        <div className="hidden lg:flex items-center justify-center text-lg font-medium gap-6">
          <div
            className="relative"
            onMouseEnter={handleAMouseEnter}
            onMouseLeave={handleAMouseLeave}
          >
            <Link
              href="/about"
              className={`cursor-pointer transition-colors ${
                isAOpen ? "text-primary" : "hover:text-primary"
              }`}
            >
              About
            </Link>
            {/* About Dropdown */}
            <div
              className={`absolute top-full -left-1/2 mx-auto mt-14 min-w-80 w-full min-h-max bg-white rounded-[20px] z-50 overflow-hidden hidden lg:flex flex-col transition-all duration-300 ease-out origin-top ${
                isAOpen
                  ? "opacity-100 translate-y-2 scale-100 pointer-events-auto"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }`}
            >
              <div className="flex flex-col bg-surface p-6 space-y-1">
                {aboutItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setIsAOpen(false)}
                    className="text-base hover:font-semibold py-0.5 transition-all duration-150 cursor-pointer border-b border-black last:border-b-0"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="w-full h-8 bg-linear-to-br from-[#FF0009] to-[#772571]" />
            </div>
          </div>
          <div
            className="relative py-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/categories"
              className={`flex items-center gap-1 cursor-pointer transition-colors ${
                isProductsOpen ? "text-[#FF0009]" : "hover:text-primary"
              }`}
            >
              Products
            </Link>
          </div>
          <Link href="#" className="hover:text-primary transition-colors">
            Applications
          </Link>
          <div
            className="relative"
            onMouseEnter={handleKMouseEnter}
            onMouseLeave={handleKMouseLeave}
          >
            <Link
              href="/resources"
              className={`cursor-pointer transition-colors ${
                iskOpen ? "text-primary" : "hover:text-primary"
              }`}
            >
              Knowledge Hub
            </Link>
            {/* Knowledge Dropdown */}
            <div
              className={`absolute top-full -left-1/2 mx-auto mt-14 min-w-80 w-full min-h-max bg-white rounded-[20px] z-50 overflow-hidden hidden lg:flex flex-col transition-all duration-300 ease-out origin-top ${
                iskOpen
                  ? "opacity-100 translate-y-2 scale-100 pointer-events-auto"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }`}
            >
              <div className="flex flex-col bg-surface p-6 space-y-1">
                {knowledgeItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setIskOpen(false)}
                    className="text-base hover:font-semibold py-0.5 transition-all duration-150 cursor-pointer border-b border-black last:border-b-0"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="w-full h-8 bg-linear-to-br from-[#FF0009] to-[#772571]" />
            </div>
          </div>
          <div
            className="relative"
            onMouseEnter={handlePMouseEnter}
            onMouseLeave={handlePMouseLeave}
          >
            <Link
              href="/partner"
              className={`cursor-pointer transition-colors ${
                isPOpen ? "text-primary" : "hover:text-primary"
              }`}
            >
              Partner
            </Link>
            {/* Partner Dropdown */}
            <div
              className={`absolute top-full right-[-150%] mx-auto mt-14 min-w-80 w-full min-h-max bg-white rounded-[20px] z-50 overflow-hidden hidden lg:flex flex-col transition-all duration-300 ease-out origin-top ${
                isPOpen
                  ? "opacity-100 translate-y-2 scale-100 pointer-events-auto"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }`}
            >
              <div className="flex flex-col bg-surface p-6 space-y-1">
                {partnerItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setIsPOpen(false)}
                    className="text-base hover:font-semibold py-0.5 transition-all duration-150 cursor-pointer border-b border-black last:border-b-0"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="w-full h-8 bg-linear-to-br from-[#FF0009] to-[#772571]" />
            </div>
          </div>
          <Link
            href="/contact"
            className="hover:text-primary transition-colors"
          >
            Contact
          </Link>
          <Link href="#" className="hover:scale-110 transition-colors">
            <Image
              src="/images/whatsapp-icon.svg"
              alt="Enquire Now"
              width={34}
              height={34}
            />
          </Link>
        </div>

        {/* Backdrop Overlay with Blur */}
        <div
          className={`fixed top-22 inset-x-0 bottom-0 bg-black/10 backdrop-blur-sm transition-all duration-300 z-40 ${
            isProductsOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onMouseEnter={handleMouseLeave}
        />

        {/* Desktop Mega Dropdown Menu */}
        <div
          className={`absolute top-full right-0 mx-auto mt-2 mr-20 max-w-4xl w-full min-h-max bg-white rounded-[20px] z-50 overflow-hidden hidden lg:flex flex-col font-google-sans transition-all duration-300 ease-out origin-top ${
            isProductsOpen
              ? "opacity-100 translate-y-8 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Three-column dropdown body */}
          <div className="flex">
            {/* Left Column: Top-level Category List */}
            <div className="flex flex-col min-w-75 p-6 bg-surface">
              {productCategories.map((cat) => (
                <button
                  key={cat.name}
                  onMouseEnter={() => setActiveCategory(cat.name)}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex items-center justify-between group w-full text-left text-base py-0.5 transition-all duration-150 cursor-pointer border-b border-black last:border-b-0 ${
                    activeCategory === cat.name
                      ? "font-bold"
                      : "font-normal hover:font-bold"
                  }`}
                >
                  <span className="leading-[200%]!">{cat.name}</span>
                  {activeCategory === cat.name && (
                    <ChevronRight
                      size={16}
                      strokeWidth={2}
                      className="text-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Middle Column: Sub-products list */}
            <div className="flex flex-col flex-1 p-8">
              {activeCategoryData.products.map((prod) => (
                <Link
                  href={`/categories/${prod.name.replace(/\s/g, "-").toLowerCase()}`}
                  key={prod.name}
                  className="py-0.5 text-base leading-[150%] hover:font-bold transition-colors duration-150 cursor-pointer"
                >
                  {prod.name}
                </Link>
              ))}
            </div>

            {/* Right Column: Category Image + View All Button */}
            <div className="flex flex-col py-6 min-w-65 pr-8">
              <div className="relative w-full min-h-42 rounded-2xl overflow-hidden">
                <Image
                  src={activeCategoryData.categoryImage}
                  alt={activeCategoryData.name}
                  fill
                  className="object-cover"
                />
              </div>
              <Link
                href="/categories"
                className="mt-5 px-5 py-2 rounded-full text-white text-sm font-medium bg-linear-to-br from-[#FF0009] to-[#772571] hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap max-w-fit"
              >
                View All Products
              </Link>
            </div>
          </div>

          {/* Bottom brand gradient strip */}
          <div className="w-full h-8 bg-linear-to-br from-[#FF0009] to-[#772571]" />
        </div>
        <div className="flex items-center gap-2 lg:hidden mr-2">
          <Link href="#" className="hover:scale-110 transition-colors">
            <Image
              src="/images/whatsapp-icon.svg"
              alt="Enquire Now"
              width={28}
              height={28}
            />
          </Link>
          <button
            onClick={toggleMenu}
            className="relative transition-colors z-60 cursor-pointer"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col items-end justify-between w-6 h-4.5">
              <span
                className={`block h-0.5 w-full bg-primary transition-all duration-300 ${
                  open ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-primary transition-all duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-primary transition-all duration-300 ${
                  open ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>
        {open ? <MobileNav onClose={() => setOpen(false)} /> : null}
      </nav>
    </header>
  );
}
