"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import MobileNav from "./MobileNav";
import { ChevronRight } from "lucide-react";

interface ProductItem {
  name: string;
  image: string;
  bgColor: string;
}

interface CategoryItem {
  name: string;
  products: ProductItem[];
  categoryImage: string;
}

const productCategories: CategoryItem[] = [
  {
    name: "Woodworking Adhesives",
    products: [
      {
        name: "Super Premium Adhesive",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Specialty Adhesive",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "Regular Adhesive",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Waterproof Grade Adhesive",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
      {
        name: "Wood Ancillaries",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "ECO",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
      {
        name: "Wood Preservative",
        image: "/images/Aquabond.png",
        bgColor: "bg-[#1CB6F6]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
  {
    name: "Construction Chemicals",
    products: [
      {
        name: "Tile Adhesive",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      { name: "Grout", image: "/images/Foambond.png", bgColor: "bg-[#F57F26]" },
      {
        name: "Waterproofing Compound",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
      {
        name: "Epoxy Grout",
        image: "/images/Aquabond.png",
        bgColor: "bg-[#1CB6F6]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
  {
    name: "Maintenance",
    products: [
      {
        name: "Pipe Sealant",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Thread Seal Tape",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "Maintenance Spray",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
  {
    name: "Wood Finish Products",
    products: [
      {
        name: "Wood Polish",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Wood Stain",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "Lacquer",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
  {
    name: "Packaging Adhesives",
    products: [
      {
        name: "Box Sealing Adhesive",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Lamination Adhesive",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "Carton Adhesive",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
  {
    name: "Footwear Adhesives",
    products: [
      {
        name: "Sole Bonding Adhesive",
        image: "/images/Champion Super.png",
        bgColor: "bg-[#0083CB]",
      },
      {
        name: "Leather Adhesive",
        image: "/images/Foambond.png",
        bgColor: "bg-[#F57F26]",
      },
      {
        name: "Synthetic Adhesive",
        image: "/images/Watershield.png",
        bgColor: "bg-[#3190A5]",
      },
    ],
    categoryImage: "/images/mega-menu.png",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Woodworking Adhesives");
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
    productCategories[0];

  return (
    <header
      id="main-landing-header"
      className="sticky top-0 left-0 right-0 z-50 w-full h-22 bg-white backdrop-blur-md transition-all duration-300 flex items-center"
    >
      <nav className="flex items-center justify-between max-w-360 mx-auto w-full px-6 font-google-sans relative">
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
                    <ChevronRight size={16} strokeWidth={2} className="text-primary" />
                  )}
                </button>
              ))}
            </div>

            {/* Middle Column: Sub-products list */}
            <div className="flex flex-col flex-1 p-8">
              {activeCategoryData.products.map((prod) => (
                <Link
                  href={`/categories#${prod.name.toLowerCase().replace(/\s+/g, "-")}`}
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
