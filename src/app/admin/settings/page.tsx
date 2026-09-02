"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, SiteSettings, ContactPageSettings, ContactSection, ContactDetailItem } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
import { DEFAULT_HEAD_SCRIPTS, DEFAULT_BODY_SCRIPTS } from "@/components/common/SsrHeadRenderer";
import {
  Sliders,
  CheckCircle2,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Share2,
  Plus,
  Trash2,
  Headphones,
  PhoneCall,
  Mail,
  Clock,
  MapPin,
  PanelTop,
  PanelBottom,
  Laptop,
  Smartphone,
  Code2,
  Info,
} from "lucide-react";
import Image from "next/image";


export default function AdminSettingsPage() {
  const renderAdminIconPreview = (iconStr: string) => {
    if (!iconStr) {
      return <PhoneCall className="h-4 w-4 text-primary" />;
    }
    if (iconStr.startsWith("/") || iconStr.startsWith("http")) {
      return (
        <img
          src={iconStr}
          alt="icon preview"
          className="w-5 h-5 object-contain"
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      );
    }
    const lower = iconStr.toLowerCase();
    if (lower.includes("phone")) return <PhoneCall className="h-4 w-4 text-primary" />;
    if (lower.includes("mail") || lower.includes("email")) return <Mail className="h-4 w-4 text-primary" />;
    if (lower.includes("clock") || lower.includes("hour") || lower.includes("time")) return <Clock className="h-4 w-4 text-primary" />;
    if (lower.includes("pin") || lower.includes("address") || lower.includes("map")) return <MapPin className="h-4 w-4 text-primary" />;
    return <PhoneCall className="h-4 w-4 text-primary" />;
  };
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [headerDesktopLogo, setHeaderDesktopLogo] = useState("");
  const [headerMobileLogo, setHeaderMobileLogo] = useState("");
  const [footerDesktopLogo, setFooterDesktopLogo] = useState("");
  const [footerMobileLogo, setFooterMobileLogo] = useState("");
  const [categoryHeroCover, setCategoryHeroCover] = useState("");
  const [categoryCardBg, setCategoryCardBg] = useState("");
  const [showWhatsappInHeader, setShowWhatsappInHeader] = useState(true);
  const [scriptConfig, setScriptConfig] = useState({
    headScripts: DEFAULT_HEAD_SCRIPTS,
    bodyScripts: DEFAULT_BODY_SCRIPTS,
    footerScripts: "",
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    youtube: "",
    whatsappNumber: ""
  });
  const [rightChoiceBanner, setRightChoiceBanner] = useState({
    title: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
  });
  const [contactPage, setContactPage] = useState<ContactPageSettings>({
    heroImage: "/images/image 24.png",
    heroTitle: "Contact Us",
    mainHeading: "We are always happy to assist you.",
    watermarkImage: "/images/watermark-contact.svg",
    sections: [
      {
        title: "Customer Support",
        details: [
          { label: "Phone", value: "1800-XXX-XXX", icon: "/images/Phone-call.svg" },
          { label: "Email", value: "support@jivanjor.com", icon: "/images/Mail-one.svg" },
          { label: "Hours", value: "Mon-Sat, 9:00 AM – 6:00 PM", icon: "/images/Alarm-clock.svg" },
        ],
      },
      {
        title: "Corporate Headquarters",
        details: [
          { label: "Address", value: "1234, Address Street", icon: "/images/Pin.svg" },
          { label: "Hours", value: "Mon-Sat, 9:00 AM – 6:00 PM", icon: "/images/Alarm-clock.svg" },
        ],
      },
    ],
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await api.getSettings();
      setHeaderDesktopLogo(res.headerDesktopLogo || res.desktopLogo || "");
      setHeaderMobileLogo(res.headerMobileLogo || res.mobileLogo || res.headerDesktopLogo || res.desktopLogo || "");
      setFooterDesktopLogo(res.footerDesktopLogo || res.desktopLogo || res.headerDesktopLogo || "");
      setFooterMobileLogo(res.footerMobileLogo || res.footerDesktopLogo || res.mobileLogo || res.desktopLogo || "");
      setCategoryHeroCover(res.categoryHeroCover || "");
      setCategoryCardBg(res.categoryCardBg || "");

      // Load exact script configuration from server
      setScriptConfig({
        headScripts: res.scriptConfig?.headScripts !== undefined ? res.scriptConfig.headScripts : DEFAULT_HEAD_SCRIPTS,
        bodyScripts: res.scriptConfig?.bodyScripts !== undefined ? res.scriptConfig.bodyScripts : DEFAULT_BODY_SCRIPTS,
        footerScripts: res.scriptConfig?.footerScripts || "",
      });

      const whatsappSec = (res.contactPage?.sections || []).find((s: any) => s.title === "_whatsapp_config");
      const whatsappNumberVal = whatsappSec?.whatsappNumber !== undefined
        ? whatsappSec.whatsappNumber
        : (res.socialLinks?.whatsappNumber || res.whatsappNumber || "");

      const showWhatsappVal = whatsappSec?.showWhatsappInHeader !== undefined
        ? Boolean(whatsappSec.showWhatsappInHeader)
        : (res.showWhatsappInHeader !== false && res.hideWhatsappInHeader !== true);

      setSocialLinks({
        facebook: res.socialLinks?.facebook || "",
        instagram: socialLinks.instagram || res.socialLinks?.instagram || "",
        youtube: socialLinks.youtube || res.socialLinks?.youtube || "",
        whatsappNumber: whatsappNumberVal,
      });
      setShowWhatsappInHeader(showWhatsappVal);
      setRightChoiceBanner({
        title: res.rightChoiceBanner?.title || "",
        subtitle: res.rightChoiceBanner?.subtitle || "",
        ctaText: res.rightChoiceBanner?.ctaText || "",
        ctaLink: res.rightChoiceBanner?.ctaLink || "",
      });
      if (res.contactPage) {
        const visibleSections = (res.contactPage.sections || []).filter(
          (s: any) => s.title !== "_whatsapp_config" && s.title !== "_script_config"
        );
        setContactPage({
          heroImage: res.contactPage.heroImage || "/images/image 24.png",
          heroTitle: res.contactPage.heroTitle || "Contact Us",
          mainHeading: res.contactPage.mainHeading || "We are always happy to assist you.",
          watermarkImage: res.contactPage.watermarkImage || "/images/watermark-contact.svg",
          sections: visibleSections,
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      showToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (text: string, type: "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userSections = (contactPage.sections || []).filter(
        (s: any) => s.title !== "_whatsapp_config" && s.title !== "_script_config"
      );
      const whatsappMetaSection = {
        title: "_whatsapp_config",
        whatsappNumber: socialLinks.whatsappNumber.trim(),
        showWhatsappInHeader: showWhatsappInHeader,
        details: [],
      };
      const scriptMetaSection = {
        title: "_script_config",
        headScripts: scriptConfig.headScripts,
        bodyScripts: scriptConfig.bodyScripts,
        footerScripts: scriptConfig.footerScripts,
        details: [],
      };
      const updatedSections = [...userSections, whatsappMetaSection, scriptMetaSection];

      const updated = await api.updateSettings({
        headerDesktopLogo: headerDesktopLogo.trim() || undefined,
        headerMobileLogo: headerMobileLogo.trim() || undefined,
        footerDesktopLogo: footerDesktopLogo.trim() || undefined,
        footerMobileLogo: footerMobileLogo.trim() || undefined,
        desktopLogo: headerDesktopLogo.trim() || undefined,
        mobileLogo: headerMobileLogo.trim() || undefined,
        categoryHeroCover: categoryHeroCover.trim() || undefined,
        categoryCardBg: categoryCardBg.trim() || undefined,
        socialLinks: {
          facebook: socialLinks.facebook.trim(),
          instagram: socialLinks.instagram.trim(),
          youtube: socialLinks.youtube.trim(),
          whatsappNumber: socialLinks.whatsappNumber.trim(),
        },
        whatsappNumber: socialLinks.whatsappNumber.trim(),
        showWhatsappInHeader: showWhatsappInHeader,
        hideWhatsappInHeader: !showWhatsappInHeader,
        rightChoiceBanner: {
          title: rightChoiceBanner.title.trim(),
          subtitle: rightChoiceBanner.subtitle.trim(),
          ctaText: rightChoiceBanner.ctaText.trim(),
          ctaLink: rightChoiceBanner.ctaLink.trim(),
        },
        contactPage: {
          heroImage: contactPage.heroImage?.trim() || undefined,
          heroTitle: contactPage.heroTitle?.trim() || undefined,
          mainHeading: contactPage.mainHeading?.trim() || undefined,
          watermarkImage: contactPage.watermarkImage?.trim() || undefined,
          sections: updatedSections,
        },
        scriptConfig: {
          headScripts: scriptConfig.headScripts,
          bodyScripts: scriptConfig.bodyScripts,
          footerScripts: scriptConfig.footerScripts,
        },
      });

      if (updated) {
        setHeaderDesktopLogo(updated.headerDesktopLogo || updated.desktopLogo || "");
        setHeaderMobileLogo(updated.headerMobileLogo || updated.mobileLogo || "");
        setFooterDesktopLogo(updated.footerDesktopLogo || updated.desktopLogo || "");
        setFooterMobileLogo(updated.footerMobileLogo || updated.mobileLogo || "");
        setCategoryHeroCover(updated.categoryHeroCover || "");
        setCategoryCardBg(updated.categoryCardBg || "");

        if (updated.scriptConfig) {
          setScriptConfig({
            headScripts: updated.scriptConfig.headScripts || "",
            bodyScripts: updated.scriptConfig.bodyScripts || "",
            footerScripts: updated.scriptConfig.footerScripts || "",
          });
        }

        const updatedWhatsappSec = (updated.contactPage?.sections || updatedSections).find((s: any) => s.title === "_whatsapp_config") as any;
        const updatedWhatsappNum = updatedWhatsappSec?.whatsappNumber !== undefined
          ? updatedWhatsappSec.whatsappNumber
          : (updated.socialLinks?.whatsappNumber || updated.whatsappNumber || socialLinks.whatsappNumber);

        const updatedShowWhatsapp = updatedWhatsappSec?.showWhatsappInHeader !== undefined
          ? Boolean(updatedWhatsappSec.showWhatsappInHeader)
          : (updated.showWhatsappInHeader !== false && updated.hideWhatsappInHeader !== true);

        setSocialLinks({
          facebook: updated.socialLinks?.facebook || "",
          instagram: updated.socialLinks?.instagram || "",
          youtube: updated.socialLinks?.youtube || "",
          whatsappNumber: updatedWhatsappNum,
        });
        setShowWhatsappInHeader(updatedShowWhatsapp);
        setRightChoiceBanner({
          title: updated.rightChoiceBanner?.title || "",
          subtitle: updated.rightChoiceBanner?.subtitle || "",
          ctaText: updated.rightChoiceBanner?.ctaText || "",
          ctaLink: updated.rightChoiceBanner?.ctaLink || "",
        });
        if (updated.contactPage) {
          const visibleSections = (updated.contactPage.sections || []).filter(
            (s: any) => s.title !== "_whatsapp_config" && s.title !== "_script_config"
          );
          setContactPage({
            heroImage: updated.contactPage.heroImage || "/images/image 24.png",
            heroTitle: updated.contactPage.heroTitle || "Contact Us",
            mainHeading: updated.contactPage.mainHeading || "We are always happy to assist you.",
            watermarkImage: updated.contactPage.watermarkImage || "/images/watermark-contact.svg",
            sections: visibleSections,
          });
        }
      }

      showToast("Branding & settings saved successfully!", "success");
    } catch (err) {
      console.error("Failed to save settings:", err);
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-bold animate-[slideIn_0.2s_ease-out] ${toastMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-background backdrop-blur-md"
              : "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400 bg-background backdrop-blur-md"
              }`}
          >
            <Sparkles className="h-5 w-5 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-zinc-50">
              General & Branding Settings
            </h1>
            <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Configure site logos for mobile and desktop views, plus official social media profiles.
            </p>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving || loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-black hover:opacity-90 transition-all shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center bg-background rounded-2xl border border-border">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            <p className="text-xs font-bold text-foreground/60 mt-3">Loading...</p>
          </div>
        ) : (
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card 1: Logo Settings (Single Row / Full Width with Header & Footer side-by-side) */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-xs space-y-6 lg:col-span-2">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground">Website Logos</h2>
                  <p className="text-[11px] text-foreground/50 mt-0.5">
                    Customize desktop and mobile logos categorized by Header and Footer.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category 1: Header Logos */}
                <div className="space-y-4 p-5 rounded-2xl bg-surface/50 border border-border/70">
                  <div className="flex items-center justify-between bg-primary/5 px-3.5 py-2 rounded-xl border border-primary/15">
                    <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-wider">
                      <PanelTop className="h-4 w-4" />
                      <span>Header Logos</span>
                    </div>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                      Header Category
                    </span>
                  </div>

                  {/* Header Desktop Logo */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
                      <Laptop className="h-3.5 w-3.5 text-foreground/60" />
                      <span>Header Desktop Logo</span>
                    </div>
                    <p className="text-[11px] text-foreground/50">
                      Displayed on main website header for desktop and wide screens. (Fallback: <code>/images/logo.png</code>)
                    </p>
                    <ImageUpload
                      value={headerDesktopLogo}
                      onChange={(url) => setHeaderDesktopLogo(url)}
                      size="compact"
                      folder="branding"
                    />
                  </div>

                  {/* Header Mobile Logo */}
                  <div className="space-y-2 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
                      <Smartphone className="h-3.5 w-3.5 text-foreground/60" />
                      <span>Header Mobile Logo</span>
                    </div>
                    <p className="text-[11px] text-foreground/50">
                      Displayed inside mobile navigation drawer and small screens. (Fallback: Header Desktop Logo or <code>/images/logo.png</code>)
                    </p>
                    <ImageUpload
                      value={headerMobileLogo}
                      onChange={(url) => setHeaderMobileLogo(url)}
                      size="compact"
                      folder="branding"
                    />
                  </div>
                </div>

                {/* Category 2: Footer Logos */}
                <div className="space-y-4 p-5 rounded-2xl bg-surface/50 border border-border/70">
                  <div className="flex items-center justify-between bg-indigo-500/5 px-3.5 py-2 rounded-xl border border-indigo-500/15">
                    <div className="flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      <PanelBottom className="h-4 w-4" />
                      <span>Footer Logos</span>
                    </div>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                      Footer Category
                    </span>
                  </div>

                  {/* Footer Desktop Logo */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
                      <Laptop className="h-3.5 w-3.5 text-foreground/60" />
                      <span>Footer Desktop Logo</span>
                    </div>
                    <p className="text-[11px] text-foreground/50">
                      Displayed on the website footer for desktop screens. (Fallback: Header Desktop Logo or <code>/images/logo.png</code>)
                    </p>
                    <ImageUpload
                      value={footerDesktopLogo}
                      onChange={(url) => setFooterDesktopLogo(url)}
                      size="compact"
                      folder="branding"
                    />
                  </div>

                  {/* Footer Mobile Logo */}
                  <div className="space-y-2 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
                      <Smartphone className="h-3.5 w-3.5 text-foreground/60" />
                      <span>Footer Mobile Logo</span>
                    </div>
                    <p className="text-[11px] text-foreground/50">
                      Displayed on the website footer for mobile screens. (Fallback: Footer Desktop Logo or <code>/images/logo.png</code>)
                    </p>
                    <ImageUpload
                      value={footerMobileLogo}
                      onChange={(url) => setFooterMobileLogo(url)}
                      size="compact"
                      folder="branding"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Social Media Settings (Full Row Below Logos) */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-xs space-y-6 lg:col-span-2">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground">Social Media Links</h2>
                  <p className="text-[11px] text-foreground/50 mt-0.5">
                    Connect your official social channels shown in website footer and contact sections.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Facebook */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground/80 mb-1">
                    <Image
                      src="/images/facebook.svg"
                      className="aspect-square"
                      width={16}
                      height={16}
                      alt="Facebook"
                    />
                    <span>Facebook URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    placeholder="https://facebook.com/your-page"
                    className="w-full p-2 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground/80 mb-1">
                    <Image
                      src="/images/instagram.svg"
                      className="aspect-square"
                      width={16}
                      height={16}
                      alt="Instagram"
                    />
                    <span>Instagram URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.instagram}
                    onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                    placeholder="https://instagram.com/your-handle"
                    className="w-full p-2 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>

                {/* YouTube */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground/80 mb-1">
                    <Image
                      src="/images/youtube.svg"
                      className="aspect-square"
                      width={20}
                      height={20}
                      alt="YouTube"
                    />
                    <span>YouTube Channel URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    placeholder="https://youtube.com/@your-channel"
                    className="w-full p-2 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground/80 mb-1">
                    <Image
                      src="/images/whatsapp-icon.svg"
                      className="aspect-square"
                      width={18}
                      height={18}
                      alt="WhatsApp"
                    />
                    <span>WhatsApp Number / Link</span>
                  </label>
                  <input
                    type="text"
                    value={socialLinks.whatsappNumber}
                    onChange={(e) => setSocialLinks({ ...socialLinks, whatsappNumber: e.target.value })}
                    placeholder="e.g. +91 9876543210 or wa.me/..."
                    className="w-full p-2 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>
              </div>

              {/* Navbar WhatsApp Icon Display Toggle */}
              <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-foreground">Header Navbar WhatsApp Icon Visibility</h3>
                  <p className="text-[11px] text-foreground/50">
                    Control whether the quick enquiry WhatsApp icon is displayed in the main website header.
                  </p>
                </div>
                <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-surface/50 cursor-pointer select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={showWhatsappInHeader}
                    onChange={(e) => setShowWhatsappInHeader(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-xs font-bold text-foreground">
                    {showWhatsappInHeader ? "Icon Visible on Navbar" : "Icon Hidden from Navbar"}
                  </span>
                </label>
              </div>
            </div>

            {/* Card 3: Category Page Branding & Background Images */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-xs space-y-6 lg:col-span-2">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground">Category Page Cover & Card Backgrounds</h2>
                  <p className="text-[11px] text-foreground/50 mt-0.5">
                    Customize top hero banners and default product card backdrops for the main Category page.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Page Hero Cover */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-foreground/80">Category Page Hero Cover Banner</label>
                  <p className="text-[11px] text-foreground/50">
                    Top hero backdrop image rendered at the top of <code>/categories</code> page. (Fallback: <code>/images/main-category-hero.png</code>)
                  </p>
                  <ImageUpload
                    value={categoryHeroCover}
                    onChange={(url) => setCategoryHeroCover(url)}
                    folder="branding"
                    aspect="cover"
                  />
                </div>

                {/* Category Card Background Image */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-foreground/80">Category Product Card Backdrop Image</label>
                  <p className="text-[11px] text-foreground/50">
                    Default room/closet backdrop image displayed behind product cans on category cards. (Fallback: <code>/images/placeholder.png</code>)
                  </p>
                  <ImageUpload
                    value={categoryCardBg}
                    onChange={(url) => setCategoryCardBg(url)}
                    folder="branding"
                    aspect="square"
                  />
                </div>
              </div>
            </div>

            {/* Card 4: Right Choice Adhesive Banner Settings */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-xs space-y-6 lg:col-span-2">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground">Right Choice Adhesive Banner Settings</h2>
                  <p className="text-[11px] text-foreground/50 mt-0.5">
                    Configure global content texts and CTA button for the &quot;Need Help Choosing the Right Adhesive?&quot; banner across category and application pages.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Banner Title / Heading</label>
                  <input
                    type="text"
                    value={rightChoiceBanner.title}
                    onChange={(e) => setRightChoiceBanner({ ...rightChoiceBanner, title: e.target.value })}
                    placeholder="Need Help Choosing the Right Adhesive?"
                    className="w-full p-2.5 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary font-medium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-foreground/80 mb-1">Banner Description / Subtitle</label>
                  <textarea
                    rows={2}
                    value={rightChoiceBanner.subtitle}
                    onChange={(e) => setRightChoiceBanner({ ...rightChoiceBanner, subtitle: e.target.value })}
                    placeholder="Share your woodwork needs, product query or application concerns. Our team will help you find the right Jivanjor solution."
                    className="w-full p-2.5 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={rightChoiceBanner.ctaText}
                    onChange={(e) => setRightChoiceBanner({ ...rightChoiceBanner, ctaText: e.target.value })}
                    placeholder="Submit Your Query"
                    className="w-full p-2.5 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground/80 mb-1">CTA Button Target Link</label>
                  <input
                    type="text"
                    value={rightChoiceBanner.ctaLink}
                    onChange={(e) => setRightChoiceBanner({ ...rightChoiceBanner, ctaLink: e.target.value })}
                    placeholder="/contact"
                    className="w-full p-2.5 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Card 5: Contact Page Content & Dynamic Sections */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-xs space-y-6 lg:col-span-2">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-foreground">Contact Page Content & Sections</h2>
                    <p className="text-[11px] text-foreground/50 mt-0.5">
                      Configure Hero image, main title, heading, watermark, and dynamic contact info sections rendered on <code>/contact</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Main Banner & Heading Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-foreground/80">Contact Page Hero Cover Image</label>
                  <p className="text-[11px] text-foreground/50">
                    Hero background banner displayed at the top of <code>/contact</code>. (Default: <code>/images/image 24.png</code>)
                  </p>
                  <ImageUpload
                    value={contactPage.heroImage || ""}
                    onChange={(url) => setContactPage({ ...contactPage, heroImage: url })}
                    folder="contact"
                    aspect="cover"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground/80 mb-1">Hero Title (Breadcrumb)</label>
                    <input
                      type="text"
                      value={contactPage.heroTitle || ""}
                      onChange={(e) => setContactPage({ ...contactPage, heroTitle: e.target.value })}
                      placeholder="Contact Us"
                      className="w-full p-2.5 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground/80 mb-1">Main Heading</label>
                    <input
                      type="text"
                      value={contactPage.mainHeading || ""}
                      onChange={(e) => setContactPage({ ...contactPage, mainHeading: e.target.value })}
                      placeholder="We are always happy to assist you."
                      className="w-full p-2.5 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary font-medium"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <label className="block text-xs font-bold text-foreground/80">Watermark Image</label>
                    <p className="text-[11px] text-foreground/50">
                      Bottom left background watermark on desktop view. (Default: <code>/images/watermark-contact.svg</code>)
                    </p>
                    <ImageUpload
                      value={contactPage.watermarkImage || ""}
                      onChange={(url) => setContactPage({ ...contactPage, watermarkImage: url })}
                      folder="contact"
                      size="compact"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Contact Sections Manager */}
              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-foreground/70">
                      Contact Information Sections ({contactPage.sections?.length || 0})
                    </h3>
                    <p className="text-[11px] text-foreground/50 mt-0.5">
                      Add, edit or reorder sections such as Customer Support, HQ, Toll-Free numbers, Addresses, and Timings.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSections = [
                        ...(contactPage.sections || []),
                        {
                          title: "New Contact Section",
                          details: [
                            { label: "Phone", value: "+91 1800-XXX-XXX", icon: "/images/Phone-call.svg" },
                          ],
                        },
                      ];
                      setContactPage({ ...contactPage, sections: newSections });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Section</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(contactPage.sections || [])
                    .filter((section) => section.title !== "_whatsapp_config")
                    .map((section, secIdx) => (
                      <div
                        key={secIdx}
                        className="p-4 rounded-xl border border-border/80 bg-surface/50 space-y-4 relative"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <label className="block text-[11px] font-bold text-foreground/60 uppercase mb-1">
                              Section Title #{secIdx + 1}
                            </label>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => {
                                const updatedSecs = [...(contactPage.sections || [])];
                                updatedSecs[secIdx].title = e.target.value;
                                setContactPage({ ...contactPage, sections: updatedSecs });
                              }}
                              placeholder="e.g. Customer Support"
                              className="w-full p-2 rounded-md bg-background border border-border text-sm font-bold text-foreground focus:outline-hidden focus:border-primary"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedSecs = (contactPage.sections || []).filter((_, i) => i !== secIdx);
                              setContactPage({ ...contactPage, sections: updatedSecs });
                            }}
                            className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer self-end mb-0.5"
                            title="Delete Section"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Detail Items List */}
                        <div className="space-y-2 pt-2 border-t border-border/60">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-foreground/50 uppercase">
                              Detail Items
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedSecs = [...(contactPage.sections || [])];
                                updatedSecs[secIdx].details = [
                                  ...(updatedSecs[secIdx].details || []),
                                  { label: "Label", value: "Value", icon: "/images/Phone-call.svg" },
                                ];
                                setContactPage({ ...contactPage, sections: updatedSecs });
                              }}
                              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Item</span>
                            </button>
                          </div>

                          {section.details?.map((item, itemIdx) => (
                            <div
                              key={itemIdx}
                              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-background border border-border/70 shadow-2xs"
                            >
                              {/* Icon Preview Box */}
                              <div className="flex items-center gap-2 shrink-0">
                                <div
                                  className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center shadow-inner overflow-hidden shrink-0"
                                  title="Icon Preview"
                                >
                                  {renderAdminIconPreview(item.icon)}
                                </div>
                              </div>

                              {/* Label Input */}
                              <div className="flex-1 w-full sm:w-auto">
                                <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-0.5 sm:hidden">
                                  Label
                                </label>
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={(e) => {
                                    const updatedSecs = [...(contactPage.sections || [])];
                                    updatedSecs[secIdx].details[itemIdx].label = e.target.value;
                                    setContactPage({ ...contactPage, sections: updatedSecs });
                                  }}
                                  placeholder="Label (e.g. Phone)"
                                  className="w-full p-2 rounded-md bg-surface border border-border text-xs text-foreground focus:outline-hidden focus:border-primary font-medium"
                                />
                              </div>

                              {/* Value Input */}
                              <div className="flex-2 w-full sm:w-auto">
                                <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-0.5 sm:hidden">
                                  Value
                                </label>
                                <input
                                  type="text"
                                  value={item.value}
                                  onChange={(e) => {
                                    const updatedSecs = [...(contactPage.sections || [])];
                                    updatedSecs[secIdx].details[itemIdx].value = e.target.value;
                                    setContactPage({ ...contactPage, sections: updatedSecs });
                                  }}
                                  placeholder="Value (e.g. 1800-XXX-XXX)"
                                  className="w-full p-2 rounded-md bg-surface border border-border text-xs text-foreground focus:outline-hidden focus:border-primary font-medium"
                                />
                              </div>

                              {/* Icon Path Input + Quick Presets */}
                              <div className="flex-2 w-full sm:w-auto flex flex-col gap-1">
                                <label className="block text-[10px] font-bold text-foreground/50 uppercase mb-0.5 sm:hidden">
                                  Icon Path / Preset
                                </label>
                                <input
                                  type="text"
                                  value={item.icon}
                                  onChange={(e) => {
                                    const updatedSecs = [...(contactPage.sections || [])];
                                    updatedSecs[secIdx].details[itemIdx].icon = e.target.value;
                                    setContactPage({ ...contactPage, sections: updatedSecs });
                                  }}
                                  placeholder="Icon path or keyword"
                                  className="w-full p-2 rounded-md bg-surface border border-border text-xs text-foreground focus:outline-hidden focus:border-primary font-mono text-[11px]"
                                />
                                {/* Quick Presets */}
                                <div className="flex items-center gap-1 text-[10px]">
                                  <span className="text-foreground/40 font-semibold">Presets:</span>
                                  {[
                                    { name: "Phone", path: "/images/Phone-call.svg" },
                                    { name: "Email", path: "/images/Mail-one.svg" },
                                    { name: "Hours", path: "/images/Alarm-clock.svg" },
                                    { name: "Pin", path: "/images/Pin.svg" },
                                  ].map((preset) => (
                                    <button
                                      key={preset.name}
                                      type="button"
                                      onClick={() => {
                                        const updatedSecs = [...(contactPage.sections || [])];
                                        updatedSecs[secIdx].details[itemIdx].icon = preset.path;
                                        setContactPage({ ...contactPage, sections: updatedSecs });
                                      }}
                                      className={`px-1.5 py-0.5 rounded border text-[10px] font-medium transition-colors cursor-pointer ${item.icon === preset.path
                                        ? "bg-primary text-white border-primary"
                                        : "bg-surface text-foreground/70 border-border hover:bg-border/50"
                                        }`}
                                    >
                                      {preset.name}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Delete Item Button */}
                              <div className="shrink-0 self-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedSecs = [...(contactPage.sections || [])];
                                    updatedSecs[secIdx].details = updatedSecs[secIdx].details.filter((_, i) => i !== itemIdx);
                                    setContactPage({ ...contactPage, sections: updatedSecs });
                                  }}
                                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                  title="Remove Detail Item"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Card: Script Configuration (Head, Body, Footer Scripts) */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-xs space-y-6 lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-foreground">Script &amp; Meta Tags Configuration (SSR)</h2>
                      <p className="text-[11px] text-foreground/50 mt-0.5">
                        Configure site verification meta tags (Google, Bing, etc.) and custom tracking scripts (Google Analytics, GTM, Meta Pixel).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 1. Head Scripts */}
                  <div className="space-y-2 flex flex-col">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground/90">
                        Head meta tags &amp; scripts
                      </label>
                      <span className="text-[10px] text-foreground/40 font-mono font-medium">
                        &lt;head&gt; (SSR)
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/50 leading-relaxed min-h-[32px]">
                      Server-side rendered directly in &lt;head&gt;. Ideal for Google &amp; Bing site verification tags, Google Analytics (gtag.js), GTM, and custom meta tags.
                    </p>
                    <textarea
                      rows={9}
                      value={scriptConfig.headScripts}
                      onChange={(e) =>
                        setScriptConfig({ ...scriptConfig, headScripts: e.target.value })
                      }
                      placeholder="<!-- Google Tag Manager -->\n<meta name=&quot;google-site-verification&quot; content=&quot;...&quot; />\n<script>(function(w,d,s,l,i){w[l]=w[l]||..."
                      className="w-full p-3 rounded-xl bg-surface border border-border text-xs text-foreground font-mono leading-relaxed focus:outline-hidden focus:border-primary resize-y transition-colors"
                      spellCheck={false}
                    />
                  </div>

                  {/* 2. Body Scripts */}
                  <div className="space-y-2 flex flex-col">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground/90">
                        Body scripts
                      </label>
                      <span className="text-[10px] text-foreground/40 font-mono font-medium">
                        &lt;body&gt; (top)
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/50 leading-relaxed min-h-[32px]">
                      Injected immediately after opening &lt;body&gt;. Required for Google Tag Manager (noscript) iframe code.
                    </p>
                    <textarea
                      rows={9}
                      value={scriptConfig.bodyScripts}
                      onChange={(e) =>
                        setScriptConfig({ ...scriptConfig, bodyScripts: e.target.value })
                      }
                      placeholder="<!-- Google Tag Manager (noscript) -->\n<noscript><iframe src=&quot;https://www.googletagmanager.com/ns.html?id=GTM-XXXX&quot;..."
                      className="w-full p-3 rounded-xl bg-surface border border-border text-xs text-foreground font-mono leading-relaxed focus:outline-hidden focus:border-primary resize-y transition-colors"
                      spellCheck={false}
                    />
                  </div>

                  {/* 3. Footer Scripts */}
                  <div className="space-y-2 flex flex-col">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground/90">
                        Footer scripts
                      </label>
                      <span className="text-[10px] text-foreground/40 font-mono font-medium">
                        &lt;/body&gt; (bottom)
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/50 leading-relaxed min-h-[32px]">
                      Injected right before closing &lt;/body&gt;. Ideal for live chat widgets, affiliate pixels, or conversion scripts.
                    </p>
                    <textarea
                      rows={9}
                      value={scriptConfig.footerScripts}
                      onChange={(e) =>
                        setScriptConfig({ ...scriptConfig, footerScripts: e.target.value })
                      }
                      placeholder="<!-- Additional tracking or live chat scripts -->\n<script>...</script>"
                      className="w-full p-3 rounded-xl bg-surface border border-border text-xs text-foreground font-mono leading-relaxed focus:outline-hidden focus:border-primary resize-y transition-colors"
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Helpful Instructions Box */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 flex items-start gap-3 text-xs text-foreground/70">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1 text-[11px]">
                    <p className="font-bold text-foreground">
                      Site Verification &amp; Head Tags (SSR) Guidance
                    </p>
                    <p>
                      Any <code>&lt;meta&gt;</code> tags (e.g. Google Search Console <code>google-site-verification</code>, Bing <code>msvalidate.01</code>, Pinterest, Facebook verification) and <code>&lt;script&gt;</code> tags pasted here are automatically parsed and rendered server-side (SSR) directly inside the <code>&lt;head&gt;</code> tag on every page. Search engines and verification crawlers can immediately verify them without modifying the frontend codebase.
                    </p>
                  </div>
                </div>
              </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
