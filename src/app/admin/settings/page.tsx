"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { api, SiteSettings } from "@/lib/api";
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
} from "lucide-react";
import Image from "next/image";


export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [desktopLogo, setDesktopLogo] = useState("");
  const [mobileLogo, setMobileLogo] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    twitter: "",
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
      setSocialLinks({
        facebook: res.socialLinks?.facebook || "",
        instagram: res.socialLinks?.instagram || "",
        youtube: res.socialLinks?.youtube || "",
        linkedin: res.socialLinks?.linkedin || "",
        twitter: res.socialLinks?.twitter || "",
      });
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
        socialLinks: {
          facebook: socialLinks.facebook.trim(),
          instagram: socialLinks.instagram.trim(),
          youtube: socialLinks.youtube.trim(),
          linkedin: socialLinks.linkedin.trim(),
          twitter: socialLinks.twitter.trim(),
        },
      });

      if (updated) {
        setDesktopLogo(updated.desktopLogo || "");
        setMobileLogo(updated.mobileLogo || "");
        setSocialLinks({
          facebook: updated.socialLinks?.facebook || "",
          instagram: updated.socialLinks?.instagram || "",
          youtube: updated.socialLinks?.youtube || "",
          linkedin: updated.socialLinks?.linkedin || "",
          twitter: updated.socialLinks?.twitter || "",
        });
      }

      showToast("Branding & social media settings saved successfully!", "success");
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
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
