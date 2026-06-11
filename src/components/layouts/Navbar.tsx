"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import MobileNav from "./MobileNav";

interface ProductItem {
  name: string;
  image: string;
  bgColor: string;
}

interface CategoryItem {
  name: string;
  products: ProductItem[];
}

const productCategories: CategoryItem[] = [
  {
    name: "Super Premium Adhesive",
    products: [
      {
        name: "Champion Super",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
    ],
  },
  {
    name: "Speciality Adhesive",
    products: [
      {
        name: "Foambond",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
    ],
  },
  {
    name: "Regular Adhesive",
    products: [
      {
        name: "Champion Super",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
    ],
  },
  {
    name: "Water Proof Grade Adhesive",
    products: [
      {
        name: "Watershield",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
      {
        name: "Aquaprotekt",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#5BBABF]",
      },
      {
        name: "Aquashield",
        image: "/images/Aquabond.png",
        bgColor: "bg-[#1CB6F6]",
      },
    ],
  },
  {
    name: "Wood Ancillaries",
    products: [
      {
        name: "Foambond",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
    ],
  },
  {
    name: "ECO",
    products: [
      {
        name: "Watershield",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
    ],
  },
  {
    name: "Wood Preservatives",
    products: [
      {
        name: "Aquabond",
        image: "/images/Aquabond.png",
        bgColor: "bg-[#1CB6F6]",
      },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    "Water Proof Grade Adhesive",
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const activeCategoryData =
    productCategories.find((c) => c.name === activeCategory) ||
    productCategories[3]; // default to Water Proof Grade Adhesive if not found

  return (
    <header
      id="main-landing-header"
      className="sticky top-0 left-0 right-0 z-50 w-full h-22 bg-white backdrop-blur-md transition-all duration-300 flex items-center"
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto w-full px-6 font-google-sans relative">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Jivanjor Logo"
            loading="eager"
            width={120}
            height={72}
          />
        </Link>
        <div className="hidden lg:flex items-center justify-center text-lg font-medium gap-6">
          <Link href="#" className="hover:text-primary transition-colors">
            About
          </Link>
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
          <Link href="#" className="hover:text-primary transition-colors">
            Knowledge Hub
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Partner
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
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
          className={`fixed top-22 inset-x-0 bottom-0 bg-black/10 backdrop-blur-sm transition-all duration-300 pointer-events-none overflow-hidden z-1000 ${
            isProductsOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onMouseEnter={handleMouseLeave}
        />

        {/* Desktop Mega Dropdown Menu */}
        <div
          className={`absolute top-full right-0 mx-auto mt-2 max-w-6xl w-5xl bg-white rounded-[20px] z-50 overflow-hidden hidden lg:flex flex-col font-google-sans transition-all duration-300 ease-out origin-top ${
            isProductsOpen
              ? "opacity-100 translate-y-8 scale-100 pointer-events-auto"
              : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex flex-col px-6 py-2.5">
            {/* Header: Products */}
            <div className="w-full pt-2 pb-1">
              <h3 className="text-primary text-xl font-bold tracking-wide">
                Products
              </h3>
              <hr className="w-full border-primary mt-2" />
            </div>

            {/* Inner Content Grid */}
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Categories List */}
              <div className="col-span-4 flex flex-col pt-2 pr-6">
                {productCategories.map((cat) => (
                  <Link
                    href={`/categories#${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                    key={cat.name}
                    onMouseEnter={() => setActiveCategory(cat.name)}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full text-left text-lg transition-all duration-200 cursor-pointer ${
                      activeCategory === cat.name
                        ? "font-bold"
                        : "font-medium hover:text-primary"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Right Column: Active Products Grid */}
              <div className="col-span-8 flex flex-col justify-between pt-1">
                <div className="grid grid-cols-3 gap-6">
                  {activeCategoryData.products.map((prod) => (
                    <div
                      key={prod.name}
                      className="flex flex-col items-center group"
                    >
                      <span className="font-bold text-lg mb-1 block group-hover:text-primary transition-colors text-left">
                        {prod.name}
                      </span>
                      <div
                        className={`${prod.bgColor} w-45 h-45 aspect-4/5 rounded-[20px] flex items-center justify-center relative shadow-md transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg overflow-hidden`}
                      >
                        {/* Soft background glow */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px]" />

                        <div className="relative w-45 h-45 flex items-center justify-center p-2">
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            className="absolute bottom-0 translate-y-1/4 object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover:scale-105 group-hover:rotate-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View More Button */}
                <div className="flex justify-end w-full mt-4">
                  <Link
                    href="#"
                    className="px-8 py-2.5 rounded-full text-white text-sm font-bold bg-linear-to-r from-[#FF0009] to-[#772571] hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                  >
                    View More
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom brand gradient strip */}
          <div className="w-full h-8 bg-linear-to-r from-[#FF0009] to-[#772571]" />
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
