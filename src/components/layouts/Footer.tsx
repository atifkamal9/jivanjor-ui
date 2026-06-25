"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Plus, X } from "lucide-react";

const footerSections = [
  {
    id: "products",
    title: "Products",
    links: [
      "Super Premium Adhesive",
      "Speciality Adhesive",
      "Regular Adhesive",
      "Water Proof Grade Adhesive",
      "Wood Ancillaries",
      "ECO",
      "Wood Preservative",
    ],
  },
  {
    id: "about",
    title: "About Jivanjor",
    links: [
      "About Jivanjor",
      "Research & Innovation",
      "Quality & Performance Promise",
      "TVCs",
      "Market Presence",
    ],
  },
  {
    id: "support",
    title: "Support & Compliance",
    links: [
      "Technical Resources",
      "Become a Dealer",
      "Contractor Connect",
      "Privacy Policy",
      "Terms of Use",
      "Sitemap",
      "Contact Us",
    ],
  },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState("products");

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? "" : id));
  };

  return (
    <footer className="relative overflow-hidden font-google-sans">
      <section className="hidden md:block">
        {/* watermark */}
        <div className="absolute bottom-0 right-0 opacity-50 pointer-events-none">
          <Image
            src="/images/watermark.png"
            alt="watermark"
            width={900}
            height={450}
            className="h-95 w-210"
          />
        </div>
        <div className="relative z-10 max-w-360 mx-auto px-6 py-10">
          <div className="flex flex-wrap justify-between gap-12">
            {/* Left section */}
            <div className="shrink-0">
              <Image
                src="/images/logo.png"
                alt="Jivanjor"
                width={260}
                height={120}
                className="w-55 md:w-65"
              />
              {/* Social Icons */}
              <div className="flex items-center justify-center gap-2.5 mt-8">
                <Link href="/">
                  <Image
                    src="/images/facebook.svg"
                    width={20}
                    height={20}
                    alt="Social Media"
                    className="aspect-square transition"
                  />
                </Link>

                <Link href="/">
                  <Image
                    src="/images/instagram.svg"
                    width={20}
                    height={20}
                    alt="Social Media"
                    className="aspect-square transition"
                  />
                </Link>

                <Link href="/">
                  <Image
                    src="/images/youtube.svg"
                    width={30}
                    height={30}
                    alt="Social Media"
                    className="aspect-square transition"
                  />
                </Link>
              </div>
            </div>

            {/* Right columns */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-12 lg:gap-20">
              {footerSections.map((section) => (
                <div key={section.title} className="min-w-55">
                  <h3 className="font-bold text-xl mb-4">{section.title}</h3>

                  <ul className="space-y-1">
                    {section.links.map((link) => (
                      <li key={link}>
                        <Link
                          href="/"
                          className="text-lg text-foreground hover:text-primary transition"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 border-b border-[#2E3192]" />
        </div>
      </section>
      {/* Mobilr footer */}
      <section className="flex flex-col gap-8 px-6 py-12 md:hidden">
        {/* watermark */}
        <div className="absolute inset-0 bottom-0 opacity-50 pointer-events-none">
          <Image
            src="/images/watermark-mobile.png"
            className="object-cover"
            alt="watermark"
            fill
          />
        </div>
        <div className="self-center">
          <Image
            src="/images/logo.png"
            alt="Jivanjor"
            width={260}
            height={120}
            className="w-55 md:w-65"
          />
        </div>
        <div className="p-2 w-full space-y-2">
          {footerSections.map((fs) => {
            const isOpen = openSection === fs.id;

            return (
              <div key={fs.id}>
                <button
                  onClick={() => toggleSection(fs.id)}
                  className="flex items-center justify-between w-full"
                >
                  <h2 className="font-semibold text-xl">{fs.title}</h2>
                  {isOpen ? <X size={24} /> : <Plus size={24} />}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "max-h-125 opacity-100 pt-2 pb-10"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="space-y-1">
                    {fs.links.map((item) => (
                      <li key={item} className="text-lg">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-start gap-2.5">
          <Link href="/">
            <Image
              src="/images/facebook.svg"
              width={24}
              height={40}
              alt="Social Media"
              className="aspect-square transition"
            />
          </Link>

          <Link href="/">
            <Image
              src="/images/instagram.svg"
              width={24}
              height={40}
              alt="Social Media"
              className="aspect-square transition"
            />
          </Link>

          <Link href="/">
            <Image
              src="/images/youtube.svg"
              width={36}
              height={40}
              alt="Social Media"
              className="aspect-square transition"
            />
          </Link>
        </div>
        <hr className="border-black mt-4 w-full" />
      </section>
    </footer>
  );
}
