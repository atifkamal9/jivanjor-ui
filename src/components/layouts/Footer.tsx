"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { api, Category, Page } from "@/lib/api";

const footerSections = [
  {
    id: "products",
    title: "Products",
    links: [
      {
        text: "Super Premium Adhesive",
        href: "/categories/super-premium",
      },
      { text: "Speciality Adhesive", href: "/categories/speciality" },
      { text: "Regular Adhesive", href: "/categories/regular" },
      {
        text: "Water Proof Grade Adhesive",
        href: "/categories/waterproof",
      },
      {
        text: "Wood Ancillaries",
        href: "/categories/wood-ancillaries",
      },
      { text: "ECO", href: "/categories/eco" },
      {
        text: "Wood Preservative",
        href: "/categories/wood-preservative",
      },
    ],
  },
  {
    id: "about",
    title: "About Jivanjor",
    links: [
      { text: "About Jivanjor", href: "/about" },
      { text: "Research & Innovation", href: "/about/research-and-innovation" },
      {
        text: "Quality & Performance Promise",
        href: "/about/quality-and-performance-promise",
      },
      { text: "TVCs", href: "/about/tvc" },
      { text: "Market Presence", href: "/about/market-presence" },
    ],
  },
  {
    id: "support",
    title: "Support & Compliance",
    links: [
      { text: "Technical Resources", href: "/resources" },
      { text: "Become a Dealer", href: "/partner" },
      { text: "Contractor Connect", href: "/contractor" },
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Use", href: "/privacy#terms" },
      { text: "Sitemap", href: "/" },
      { text: "Contact Us", href: "/contact" },
    ],
  },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getCategories().catch(() => []),
      api.getPages().catch(() => []),
    ]).then(([catList, pageList]) => {
      if (isMounted) {
        setCategories(catList);
        setPages(pageList);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? "" : id));
  };

  // Build Dynamic Product Links
  const subCats = categories.filter((c) => c.parent_category);
  const rootCats = categories.filter((c) => !c.parent_category);
  const displayCats = subCats.length > 0 ? subCats : rootCats;

  const dynamicProductLinks = displayCats.length > 0
    ? displayCats
        .sort((a: any, b: any) => (a.navOrder ?? 0) - (b.navOrder ?? 0))
        .map((cat) => ({
          text: cat.name,
          href: `/categories/${cat.slug}`,
        }))
    : footerSections[0].links;

  // Build Dynamic About Links
  const dynamicAboutLinks = pages.length > 0
    ? pages
        .filter((p) => {
          try {
            const sec = typeof p.sections === "string" ? JSON.parse(p.sections) : p.sections;
            return p.slug === "about" || sec?.layoutType === "about";
          } catch {
            return p.slug === "about";
          }
        })
        .map((p) => {
          const sec = typeof p.sections === "string" ? JSON.parse(p.sections ?? "{}") : (p.sections ?? {});
          return {
            text: p.title,
            href: p.slug === "about" ? "/about" : `/about/${p.slug}`,
            navOrder: sec?.navOrder as number | undefined,
          };
        })
        .sort((a, b) => {
          if (a.navOrder != null && b.navOrder != null) return a.navOrder - b.navOrder;
          if (a.navOrder != null) return -1;
          if (b.navOrder != null) return 1;
          if (a.href === "/about") return -1;
          if (b.href === "/about") return 1;
          return a.text.localeCompare(b.text);
        })
    : footerSections[1].links;

  const dynamicFooterSections = [
    {
      id: "products",
      title: "Products",
      links: dynamicProductLinks,
    },
    {
      id: "about",
      title: "About Jivanjor",
      links: dynamicAboutLinks,
    },
    footerSections[2],
  ];

  return (
    <footer className="relative overflow-hidden font-google-sans bg-white">
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
        <div className="relative z-10 max-w-360 mx-auto px-6 py-10 lg:py-12.5">
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
              {dynamicFooterSections.map((section) => (
                <div key={section.title} className="min-w-55">
                  <h3 className="font-bold text-xl mb-4">{section.title}</h3>

                  <ul className="space-y-1">
                    {section.links.map((link) => (
                      <li key={link.text}>
                        <Link
                          href={link.href}
                          className="text-lg text-foreground hover:text-primary transition"
                        >
                          {link.text}
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
          {dynamicFooterSections.map((fs) => {
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
                      <li key={item.text} className="text-lg">
                        <Link
                          href={item.href}
                          className="text-foreground hover:text-primary transition"
                        >
                          {item.text}
                        </Link>
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
