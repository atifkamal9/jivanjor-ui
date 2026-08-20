"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { api, Category, Page } from "@/lib/api";
import { FooterSectionItem, DEFAULT_FOOTER_MENU } from "@/lib/menuTypes";

const fallbackFooterSections = [
  {
    id: "products",
    title: "Products",
    links: [
      { text: "Super Premium Adhesive", href: "/categories/super-premium", target: "_self" },
      { text: "Speciality Adhesive", href: "/categories/speciality", target: "_self" },
      { text: "Regular Adhesive", href: "/categories/regular", target: "_self" },
      { text: "Water Proof Grade Adhesive", href: "/categories/waterproof", target: "_self" },
      { text: "Wood Ancillaries", href: "/categories/wood-ancillaries", target: "_self" },
      { text: "ECO", href: "/categories/eco", target: "_self" },
      { text: "Wood Preservative", href: "/categories/wood-preservative", target: "_self" },
    ],
  },
  {
    id: "about",
    title: "About Jivanjor",
    links: [
      { text: "About Jivanjor", href: "/about", target: "_self" },
      { text: "Research & Innovation", href: "/about/research-and-innovation", target: "_self" },
      { text: "Quality & Performance Promise", href: "/about/quality-and-performance-promise", target: "_self" },
      { text: "TVCs", href: "/about/tvc", target: "_self" },
      { text: "Market Presence", href: "/about/market-presence", target: "_self" },
    ],
  },
  {
    id: "support",
    title: "Support & Compliance",
    links: [
      { text: "Technical Resources", href: "/resources", target: "_self" },
      { text: "Become a Dealer", href: "/partner", target: "_self" },
      { text: "Contractor Connect", href: "/contractor", target: "_self" },
      { text: "Privacy Policy", href: "/privacy", target: "_self" },
      { text: "Terms of Use", href: "/privacy#terms", target: "_self" },
      { text: "Sitemap", href: "/sitemap", target: "_self" },
      { text: "Contact Us", href: "/contact", target: "_self" },
    ],
  },
];

export default function Footer() {
  const [openSection, setOpenSection] = useState("products");
  const [publishedFooter, setPublishedFooter] = useState<FooterSectionItem[]>(DEFAULT_FOOTER_MENU);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.getFooterMenu().catch(() => ({ draftItems: [], publishedItems: [] })),
      api.getSettings().catch(() => null),
    ]).then(([res, settings]) => {
      if (isMounted) {
        if (res?.publishedItems && res.publishedItems.length > 0) {
          setPublishedFooter(res.publishedItems);
          setOpenSection(res.publishedItems[0]?.id || "products");
        }
        if (settings) {
          setSiteSettings(settings);
        }
      }
    }).catch((err) => {
      console.error("Failed to load footer data:", err);
    });

    return () => {
      isMounted = false;
    };
  }, []);


  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? "" : id));
  };

  const dynamicFooterSections = publishedFooter.length > 0
    ? publishedFooter
      .filter((sec) => sec.hideInMenu !== true)
      .map((sec) => ({
        id: sec.id,
        title: sec.title,
        links: (sec.subItems || [])
          .filter((sub) => sub.hideInMenu !== true)
          .map((sub) => ({
            text: sub.title,
            href: sub.url,
            target: sub.target || "_self",
          })),
      }))
    : fallbackFooterSections;

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
        <div className="relative z-10 max-w-360 mx-auto px-6 lg:px-8 py-10 lg:py-12.5">
          <div className="flex flex-wrap justify-between gap-12">
            {/* Left section */}
            <div className="shrink-0">
              <Image
                src={siteSettings?.footerDesktopLogo || siteSettings?.headerDesktopLogo || siteSettings?.desktopLogo || "/images/logo.png"}
                alt="Jivanjor"
                width={260}
                height={120}
                className="w-50 md:w-65 object-contain"
              />
              {/* Social Icons */}
              <div className="flex items-center justify-center gap-3 mt-8">
                <Link
                  href={siteSettings?.socialLinks?.facebook || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/facebook.svg"
                    width={20}
                    height={20}
                    alt="Facebook"
                    className="aspect-square transition hover:scale-110"
                  />
                </Link>

                <Link
                  href={siteSettings?.socialLinks?.instagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/instagram.svg"
                    width={20}
                    height={20}
                    alt="Instagram"
                    className="aspect-square transition hover:scale-110"
                  />
                </Link>

                <Link
                  href={siteSettings?.socialLinks?.youtube || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/images/youtube.svg"
                    width={30}
                    height={30}
                    alt="YouTube"
                    className="aspect-square transition hover:scale-110"
                  />
                </Link>
              </div>
            </div>


            {/* Right columns */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-12 lg:gap-20">
              {dynamicFooterSections.map((section) => (
                <div key={section.id || section.title} className="min-w-55">
                  <h3 className="font-bold text-xl mb-4">{section.title}</h3>

                  <ul className="space-y-1">
                    {section.links.map((link) => (
                      <li key={link.text}>
                        {link.target === "_blank" || link.href.startsWith("http") ? (
                          <Link
                            href={link.href}
                            target={link.target || "_blank"}
                            rel="noopener noreferrer"
                            className="text-lg text-foreground hover:text-primary transition cursor-pointer"
                          >
                            {link.text}
                          </Link>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-lg text-foreground hover:text-primary transition"
                          >
                            {link.text}
                          </Link>
                        )}
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

      {/* Mobile footer */}
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
            src={siteSettings?.footerMobileLogo || siteSettings?.footerDesktopLogo || siteSettings?.mobileLogo || siteSettings?.desktopLogo || "/images/logo.png"}
            alt="Jivanjor"
            width={200}
            height={120}
            className="w-50 md:w-65 object-contain"
          />
        </div>
        <div className="p-2 w-full space-y-2">
          {dynamicFooterSections.map((fs) => {
            const isOpen = openSection === fs.id;

            return (
              <div key={fs.id || fs.title}>
                <button
                  onClick={() => toggleSection(fs.id)}
                  className="flex items-center justify-between w-full"
                >
                  <h2 className="font-semibold text-xl">{fs.title}</h2>
                  {isOpen ? <X size={24} /> : <Plus size={24} />}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen
                    ? "max-h-125 opacity-100 pt-2 pb-10"
                    : "max-h-0 opacity-0"
                    }`}
                >
                  <ul className="space-y-1">
                    {fs.links.map((item) => (
                      <li key={item.text} className="text-lg">
                        {item.target === "_blank" || item.href.startsWith("http") ? (
                          <Link
                            href={item.href}
                            target={item.target || "_blank"}
                            rel="noopener noreferrer"
                            className="text-foreground hover:text-primary transition cursor-pointer"
                          >
                            {item.text}
                          </Link>
                        ) : (
                          <Link
                            href={item.href}
                            className="text-foreground hover:text-primary transition"
                          >
                            {item.text}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-start gap-3">
          <Link
            href={siteSettings?.socialLinks?.facebook || "https://facebook.com"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/facebook.svg"
              width={24}
              height={40}
              alt="Facebook"
              className="aspect-square transition hover:scale-110"
            />
          </Link>

          <Link
            href={siteSettings?.socialLinks?.instagram || "https://instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/instagram.svg"
              width={24}
              height={40}
              alt="Instagram"
              className="aspect-square transition hover:scale-110"
            />
          </Link>

          <Link
            href={siteSettings?.socialLinks?.youtube || "https://youtube.com"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/images/youtube.svg"
              width={36}
              height={40}
              alt="YouTube"
              className="aspect-square transition hover:scale-110"
            />
          </Link>
        </div>
        <hr className="border-black mt-4 w-full" />
      </section>
    </footer>
  );
}

