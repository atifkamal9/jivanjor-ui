"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  aboutItems,
  applicationItems,
  knowledgeItems,
  partnerItems,
  productCategories,
} from "@/lib/nav";
import { ChevronRight } from "lucide-react";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  const [activeMenu, setActiveMenu] = useState<
    "about" | "products" | "applications" | "knowledge" | "partner" | null
  >(null);
  const [activeCategory, setActiveCategory] = useState("Woodworking Adhesives");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMenuEnter = (
    menu:
      | "about"
      | "products"
      | "applications"
      | "knowledge"
      | "partner"
      | null,
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
            className="relative py-4"
            onMouseEnter={() => handleMenuEnter("about")}
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="/about"
              className={`cursor-pointer transition-colors ${
                activeMenu === "about" ? "text-primary" : "hover:text-primary"
              }`}
            >
              About
            </Link>
          </div>
          <div
            className="relative py-4"
            onMouseEnter={() => handleMenuEnter("products")}
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="/categories"
              className={`flex items-center gap-1 cursor-pointer transition-colors ${
                activeMenu === "products"
                  ? "text-[#FF0009]"
                  : "hover:text-[#FF0009]"
              }`}
            >
              Products
            </Link>
          </div>
          <div
            className="relative py-4"
            onMouseEnter={() => handleMenuEnter("applications")}
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="#"
              className={`cursor-pointer transition-colors ${
                activeMenu === "applications"
                  ? "text-primary"
                  : "hover:text-primary"
              }`}
            >
              Applications
            </Link>
          </div>
          <div
            className="relative py-4"
            onMouseEnter={() => handleMenuEnter("knowledge")}
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="/resources"
              className={`cursor-pointer transition-colors ${
                activeMenu === "knowledge"
                  ? "text-primary"
                  : "hover:text-primary"
              }`}
            >
              Knowledge Hub
            </Link>
          </div>
          <div
            className="relative py-4"
            onMouseEnter={() => handleMenuEnter("partner")}
            onMouseLeave={handleMenuLeave}
          >
            <Link
              href="/partner"
              className={`cursor-pointer transition-colors ${
                activeMenu === "partner" ? "text-primary" : "hover:text-primary"
              }`}
            >
              Partner
            </Link>
          </div>
          <Link
            href="/contact"
            className="hover:text-primary transition-colors py-4"
          >
            Contact
          </Link>
          <Link href="#" className="hover:scale-110 transition-colors py-4">
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
          className={`fixed top-22 inset-x-0 bottom-0 bg-black/30 backdrop-blur-md transition-all duration-300 z-100 ${
            activeMenu !== null
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onMouseEnter={handleMenuLeave}
        />

        {/* Desktop Mega Dropdown Menu */}
        <div
          className={`absolute top-full right-0 mx-auto mt-2 mr-20 max-w-4xl w-full min-h-75 bg-white rounded-[20px] z-50 overflow-hidden hidden lg:flex flex-col font-google-sans transition-all duration-300 ease-out origin-top ${
            activeMenu !== null
              ? "opacity-100 translate-y-8 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
          }`}
          onMouseEnter={() => handleMenuEnter(activeMenu)}
          onMouseLeave={handleMenuLeave}
        >
          {activeMenu === "products" && (
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
                    onClick={() => setActiveMenu(null)}
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
                  onClick={() => setActiveMenu(null)}
                  className="mt-5 px-5 py-2 rounded-full text-white text-sm font-medium bg-linear-to-br from-[#FF0009] to-[#772571] hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap max-w-fit"
                >
                  View All Products
                </Link>
              </div>
            </div>
          )}

          {activeMenu !== "products" && activeMenu !== null && (
            <div className="flex">
              {/* Left Column: Links */}
              <div className="flex flex-col min-w-75 min-h-75 p-6 bg-surface">
                {(activeMenu === "about"
                  ? aboutItems
                  : activeMenu === "applications"
                    ? applicationItems
                    : activeMenu === "knowledge"
                      ? knowledgeItems
                      : partnerItems
                ).map((item) => (
                  <Link
                    key={item.name}
                    href={item.link}
                    onClick={() => setActiveMenu(null)}
                    className="flex items-center justify-between group w-full text-left text-base leading-[200%]! py-0.5 hover:font-bold transition-all duration-150 cursor-pointer border-b border-black last:border-b-0"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Middle Column: Copy */}
              <div className="flex flex-col flex-1 p-8">
                <p className="text-lg text-foreground">
                  {activeMenu === "about"
                    ? "Jivanjor is a leading manufacturer of premium adhesives in India, delivering unmatched bonding strength and durability for diverse woodworking and interior applications."
                    : activeMenu === "applications"
                      ? "Explore where Jivanjor fits across furniture, laminates, plywood, boards, and professional woodwork applications. Get application guidance for best results."
                      : activeMenu === "knowledge"
                        ? "Unlock expert woodworking advice, tips for choosing the right adhesive, fixing common bonding issues, and stay updated with latest Jivanjor blogs and resources."
                        : "Partner with Jivanjor, India's most trusted adhesive partner. Become a dealer, or download the Achievers Club app to access contractor rewards and tracking benefits."}
                </p>
              </div>

              {/* Right Column: Image */}
              <div className="flex flex-col py-6 min-w-65 pr-8">
                <div className="relative w-full min-h-42 rounded-2xl overflow-hidden">
                  <Image
                    src={
                      activeMenu === "about"
                        ? "/images/hero (1).png"
                        : activeMenu === "applications"
                          ? "/images/mega-menu.png"
                          : activeMenu === "knowledge"
                            ? "/images/blog/Rectangle 142.png"
                            : "/images/contractor/contractor-app-promo.png"
                    }
                    alt={activeMenu}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom brand gradient strip */}
          <div className="absolute bottom-0 w-full h-8 bg-linear-to-br from-[#FF0009] to-[#772571]" />
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
