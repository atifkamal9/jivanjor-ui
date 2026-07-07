"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { X, ChevronDown, Plus, Minus, CornerDownRight } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
}

interface ProductItem {
  name: string;
}

interface CategoryItem {
  name: string;
  products: string[];
}

interface MobileNavProps {
  onClose?: () => void;
}

const productCategories: CategoryItem[] = [
  {
    name: "Woodworking Adhesive",
    products: [
      "Super Premium Adhesive",
      "Specialty Adhesive",
      "Regular Adhesive",
      "Waterproof Grade Adhesive",
      "Wood Ancillaries",
      "ECO",
      "Wood Preservative",
    ],
  },
  {
    name: "Construction Chemicals",
    products: [
      "Tile Adhesive",
      "Grout",
      "Waterproofing Compound",
      "Epoxy Grout",
    ],
  },
  {
    name: "Maintenance",
    products: ["Pipe Sealant", "Thread Seal Tape", "Maintenance Spray"],
  },
  {
    name: "Wood Finish Products",
    products: ["Wood Polish", "Wood Stain", "Lacquer"],
  },
  {
    name: "Packaging Adhesives",
    products: [
      "Box Sealing Adhesive",
      "Lamination Adhesive",
      "Carton Adhesive",
    ],
  },
  {
    name: "Footwear Adhesives",
    products: [
      "Sole Bonding Adhesive",
      "Leather Adhesive",
      "Synthetic Adhesive",
    ],
  },
];

const applications = [
  "Furniture & Woodwork",
  "Laminates & Finishing",
  "Kitchen & Storage Units",
  "Moisture-Prone Woodwork",
  "PVC & Edge Finishing",
  "Home Repairs & DIY",
  "Foam & Acoustic Bonding",
  "OEM & Bulk Woodwork",
];

export default function MobileNav({ onClose }: MobileNavProps) {
  const [openSection, setOpenSection] = useState<string | null>("Products");
  const [openCategory, setOpenCategory] = useState<string | null>(
    "Woodworking Adhesive",
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const toggleCategory = (catName: string) => {
    setOpenCategory(openCategory === catName ? null : catName);
  };

  return (
    <section className="fixed inset-0 bg-white z-50 flex flex-col h-screen w-screen overflow-hidden font-google-sans animate-in fade-in duration-300">
      {/* Header bar inside Mobile Menu */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" onClick={onClose} className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Jivanjor Logo"
            width={120}
            height={72}
            priority
          />
        </Link>
      </div>

      {/* Main Nav Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* About Link / Accordion */}
        <div className="border-b">
          <Link
            href="/about"
            onClick={() => toggleSection("About")}
            className="flex items-center justify-between w-full py-2 text-xl font-bold cursor-pointer"
          >
            <span>About</span>
            <ChevronDown
              strokeWidth={2.5}
              size={20}
              className={`transition-transform duration-300 ${
                openSection === "About" ? "rotate-180" : ""
              }`}
            />
          </Link>
        </div>

        {/* Products Accordion (Expanded by default) */}
        <div className="border-b">
          <button
            onClick={() => toggleSection("Products")}
            className="flex items-center justify-between w-full py-2 text-xl font-bold cursor-pointer"
          >
            <span>Products</span>
            <ChevronDown
              strokeWidth={2.5}
              size={20}
              className={`transition-transform duration-300 ${
                openSection === "Products" ? "rotate-180" : ""
              }`}
            />
          </button>

          {openSection === "Products" && (
            <div className="bg-surface border-t px-6 py-5 space-y-1.5 transition-all duration-300">
              {productCategories.map((cat) => {
                const isCatOpen = openCategory === cat.name;
                return (
                  <div key={cat.name} className="space-y-1">
                    <Link
                      href={`/categories/${cat.name}`}
                      onClick={() => toggleCategory(cat.name)}
                      className="flex items-center justify-between w-full text-base font-medium cursor-pointer"
                    >
                      <span className="">{cat.name}</span>
                      {isCatOpen ? (
                        <Minus
                          size={18}
                          strokeWidth={2.5}
                          className="text-[#FF0009]"
                        />
                      ) : (
                        <Plus
                          size={18}
                          strokeWidth={2.5}
                          className="text-[#FF0009]"
                        />
                      )}
                    </Link>

                    {isCatOpen && (
                      <div className="space-y-1">
                        {cat.products.map((prod) => {
                          const isWaterproof =
                            prod === "Waterproof Grade Adhesive";
                          return (
                            <Link
                              key={prod}
                              href={`/categories#${prod.toLowerCase().replace(/\s+/g, "-")}`}
                              onClick={onClose}
                              className={`flex items-center gap-1 text-base leading-[150%]! cursor-pointer ${
                                isWaterproof
                                  ? "text-[#FF0009]"
                                  : "hover:text-primary"
                              }`}
                            >
                              <CornerDownRight
                                size={16}
                                strokeWidth={2.5}
                                className="text-[#FF0009] -mt-1.5"
                              />
                              <span>{prod}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Applications Accordion */}
        <div className="border-b">
          <button
            onClick={() => toggleSection("Applications")}
            className="flex items-center justify-between w-full py-2 text-xl font-bold cursor-pointer"
          >
            <span>Applications</span>
            <ChevronDown
              strokeWidth={2.5}
              size={20}
              className={`transition-transform duration-300 ${
                openSection === "Applications" ? "rotate-180" : ""
              }`}
            />
          </button>

          {openSection === "Applications" && (
            <div className="bg-surface border-t px-6 py-5 space-y-1.5 transition-all duration-300">
              {applications.map((app) => (
                <Link
                  key={app}
                  href="#"
                  onClick={onClose}
                  className="block text-base hover:text-primary cursor-pointer"
                >
                  {app}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Knowledge Hub Accordion */}
        <div className="border-b">
          <Link
            href="/resources"
            onClick={() => toggleSection("KnowledgeHub")}
            className="flex items-center justify-between w-full py-2 text-xl font-bold cursor-pointer"
          >
            <span>Knowledge Hub</span>
            <ChevronDown
              strokeWidth={2.5}
              size={20}
              className={`transition-transform duration-300 ${
                openSection === "KnowledgeHub" ? "rotate-180" : ""
              }`}
            />
          </Link>
        </div>

        {/* Partner Accordion */}
        <div className="border-b">
          <Link
            href="/partner"
            onClick={() => toggleSection("Partner")}
            className="flex items-center justify-between w-full py-2 text-xl font-bold cursor-pointer"
          >
            <span>Partner</span>
            <ChevronDown
              strokeWidth={2.5}
              size={20}
              className={`transition-transform duration-300 ${
                openSection === "Partner" ? "rotate-180" : ""
              }`}
            />
          </Link>
        </div>

        {/* Contact Pill Button (Centered at bottom of scroll area) */}
        <div className="flex justify-center pt-6 pb-4">
          <Link
            href="/contact"
            onClick={onClose}
            className="min-w-28 px-6 py-1 rounded-full text-white text-lg font-bold bg-linear-to-br from-[#FF0009] to-[#772571] hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-md whitespace-nowrap"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* Bottom Brand Gradient Strip */}
      <div className="w-full h-8 bg-linear-to-br from-[#FF0009] to-[#772571] shrink-0" />
    </section>
  );
}
