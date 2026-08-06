"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, SiteSettings, ContactPageSettings, ContactSection, ContactDetailItem } from "@/lib/api";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  ChevronRight,
  Sliders,
  CheckCircle2,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Share2,
  Globe,
  Video,
  Link2,
  AtSign,
  Plus,
  Trash2,
  Headphones,
  PhoneCall,
  Mail,
  Clock,
  MapPin,
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

  const [desktopLogo, setDesktopLogo] = useState("");
  const [mobileLogo, setMobileLogo] = useState("");
  const [categoryHeroCover, setCategoryHeroCover] = useState("");
  const [categoryCardBg, setCategoryCardBg] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    twitter: "",
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
      setDesktopLogo(res.desktopLogo || "");
      setMobileLogo(res.mobileLogo || "");
      setCategoryHeroCover(res.categoryHeroCover || "");
      setCategoryCardBg(res.categoryCardBg || "");
      setSocialLinks({
        facebook: res.socialLinks?.facebook || "",
        instagram: res.socialLinks?.instagram || "",
        youtube: res.socialLinks?.youtube || "",
        linkedin: res.socialLinks?.linkedin || "",
        twitter: res.socialLinks?.twitter || "",
      });
      setRightChoiceBanner({
        title: res.rightChoiceBanner?.title || "",
        subtitle: res.rightChoiceBanner?.subtitle || "",
        ctaText: res.rightChoiceBanner?.ctaText || "",
        ctaLink: res.rightChoiceBanner?.ctaLink || "",
      });
      if (res.contactPage) {
        setContactPage({
          heroImage: res.contactPage.heroImage || "/images/image 24.png",
          heroTitle: res.contactPage.heroTitle || "Contact Us",
          mainHeading: res.contactPage.mainHeading || "We are always happy to assist you.",
          watermarkImage: res.contactPage.watermarkImage || "/images/watermark-contact.svg",
          sections: res.contactPage.sections || [],
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
      const updated = await api.updateSettings({
        desktopLogo: desktopLogo.trim() || undefined,
        mobileLogo: mobileLogo.trim() || undefined,
        categoryHeroCover: categoryHeroCover.trim() || undefined,
        categoryCardBg: categoryCardBg.trim() || undefined,
        socialLinks: {
          facebook: socialLinks.facebook.trim(),
          instagram: socialLinks.instagram.trim(),
          youtube: socialLinks.youtube.trim(),
          linkedin: socialLinks.linkedin.trim(),
          twitter: socialLinks.twitter.trim(),
        },
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
          sections: contactPage.sections || [],
        },
      });

      if (updated) {
        setDesktopLogo(updated.desktopLogo || "");
        setMobileLogo(updated.mobileLogo || "");
        setCategoryHeroCover(updated.categoryHeroCover || "");
        setCategoryCardBg(updated.categoryCardBg || "");
        setSocialLinks({
          facebook: updated.socialLinks?.facebook || "",
          instagram: updated.socialLinks?.instagram || "",
          youtube: updated.socialLinks?.youtube || "",
          linkedin: updated.socialLinks?.linkedin || "",
          twitter: updated.socialLinks?.twitter || "",
        });
        setRightChoiceBanner({
          title: updated.rightChoiceBanner?.title || "",
          subtitle: updated.rightChoiceBanner?.subtitle || "",
          ctaText: updated.rightChoiceBanner?.ctaText || "",
          ctaLink: updated.rightChoiceBanner?.ctaLink || "",
        });
        if (updated.contactPage) {
          setContactPage({
            heroImage: updated.contactPage.heroImage || "/images/image 24.png",
            heroTitle: updated.contactPage.heroTitle || "Contact Us",
            mainHeading: updated.contactPage.mainHeading || "We are always happy to assist you.",
            watermarkImage: updated.contactPage.watermarkImage || "/images/watermark-contact.svg",
            sections: updated.contactPage.sections || [],
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
            {/* Card 1: Logo Settings */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground">Website Logos</h2>
                  <p className="text-[11px] text-foreground/50 mt-0.5">
                    Customize logos rendered across desktop and mobile headers/footers.
                  </p>
                </div>
              </div>

              {/* Desktop Logo */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-foreground/80">Desktop Logo</label>
                <p className="text-[11px] text-foreground/50">
                  Displayed on main website header and desktop footer. (Fallback: <code>/images/logo.png</code>)
                </p>
                <ImageUpload
                  value={desktopLogo}
                  onChange={(url) => setDesktopLogo(url)}
                  size="compact"
                  folder="branding"
                />
              </div>

              <div className="border-t border-border/60 pt-4 space-y-2">
                {/* Mobile Logo */}
                <label className="block text-xs font-bold text-foreground/80">Mobile Logo</label>
                <p className="text-[11px] text-foreground/50">
                  Displayed inside mobile header drawer and small screens. (Fallback: Desktop Logo or <code>/images/logo.png</code>)
                </p>
                <ImageUpload
                  value={mobileLogo}
                  onChange={(url) => setMobileLogo(url)}
                  size="compact"
                  folder="branding"
                />
              </div>
            </div>

            {/* Card 2: Social Media Settings */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-xs space-y-6">
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

              <div className="space-y-4">
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

                {/* LinkedIn */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground/80 mb-1">
                    <Globe className="h-4 w-4 text-sky-600" />
                    <span>LinkedIn Company URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/your-company"
                    className="w-full p-2 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>

                {/* Twitter / X */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground/80 mb-1">
                    <AtSign className="h-4 w-4 text-sky-400" />
                    <span>Twitter / X Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    placeholder="https://x.com/your-handle"
                    className="w-full p-2 rounded-md bg-surface border border-border text-sm text-foreground focus:outline-hidden focus:border-primary"
                  />
                </div>
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
                  {contactPage.sections?.map((section, secIdx) => (
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
                                    className={`px-1.5 py-0.5 rounded border text-[10px] font-medium transition-colors cursor-pointer ${
                                      item.icon === preset.path
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
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
