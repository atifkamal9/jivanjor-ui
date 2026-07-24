"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getLocalSitemapConfig,
  saveLocalSitemapConfig,
  resetLocalSitemapConfig,
  syncSitemapConfigWithApi,
  SitemapConfig,
  SitemapSection,
  SitemapLink,
} from "@/lib/sitemap-storage";
import {
  Compass,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  RefreshCw,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  ExternalLink,
  CheckCircle2,
  Globe,
  Edit3,
  Filter,
  Search,
} from "lucide-react";

export default function AdminSitemapManagerPage() {
  const [config, setConfig] = useState<SitemapConfig>(() =>
    getLocalSitemapConfig()
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState("");

  // New Section form state
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDesc, setNewSectionDesc] = useState("");
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);

  // New Link form state per section (sectionId -> { title, href, description })
  const [newLinkData, setNewLinkData] = useState<{
    [sectionId: string]: { title: string; href: string; description: string };
  }>({});

  useEffect(() => {
    // Initial sync with live API data
    syncSitemapConfigWithApi().then((synced) => {
      setConfig(synced);
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    saveLocalSitemapConfig(config);
    setTimeout(() => {
      setIsSaving(false);
      showToast("Sitemap configuration saved successfully!");
    }, 400);
  };

  const handleSyncApi = async () => {
    setIsSyncing(true);
    const synced = await syncSitemapConfigWithApi(config);
    setConfig(synced);
    setIsSyncing(false);
    showToast("Dynamic routes successfully synced from backend API!");
  };

  const handleReset = () => {
    if (
      confirm("Are you sure you want to reset sitemap to default settings?")
    ) {
      const def = resetLocalSitemapConfig();
      setConfig(def);
      showToast("Sitemap reset to default layout.");
    }
  };

  const toggleSectionVisibility = (sectionId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, isVisible: !sec.isVisible } : sec
      ),
    }));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= config.sections.length) return;

    const newSections = [...config.sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    const ordered = newSections.map((sec, idx) => ({ ...sec, order: idx + 1 }));
    setConfig((prev) => ({ ...prev, sections: ordered }));
  };

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    const newSec: SitemapSection = {
      id: `sec-${Date.now()}`,
      title: newSectionTitle.trim(),
      description: newSectionDesc.trim() || undefined,
      isVisible: true,
      order: config.sections.length + 1,
      links: [],
    };

    setConfig((prev) => ({
      ...prev,
      sections: [...prev.sections, newSec],
    }));

    setNewSectionTitle("");
    setNewSectionDesc("");
    setShowAddSectionForm(false);
    showToast("New section created.");
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm("Are you sure you want to delete this sitemap section?")) {
      setConfig((prev) => ({
        ...prev,
        sections: prev.sections.filter((sec) => sec.id !== sectionId),
      }));
      showToast("Section removed.");
    }
  };

  const handleUpdateSectionHeader = (
    sectionId: string,
    title: string,
    description: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, title, description } : sec
      ),
    }));
  };

  const handleAddLinkToSection = (sectionId: string) => {
    const data = newLinkData[sectionId];
    if (!data || !data.title.trim() || !data.href.trim()) return;

    const newLink: SitemapLink = {
      id: `link-${Date.now()}`,
      title: data.title.trim(),
      href: data.href.trim(),
      description: data.description.trim() || undefined,
      isCustom: true,
    };

    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, links: [...sec.links, newLink] } : sec
      ),
    }));

    setNewLinkData((prev) => ({
      ...prev,
      [sectionId]: { title: "", href: "", description: "" },
    }));
    showToast("Link added to section.");
  };

  const handleUpdateLink = (
    sectionId: string,
    linkId: string,
    updates: Partial<SitemapLink>
  ) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          links: sec.links.map((l) =>
            l.id === linkId ? { ...l, ...updates } : l
          ),
        };
      }),
    }));
  };

  const handleMoveLink = (
    sectionId: string,
    linkIndex: number,
    direction: "up" | "down"
  ) => {
    const targetIdx = direction === "up" ? linkIndex - 1 : linkIndex + 1;

    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        if (targetIdx < 0 || targetIdx >= sec.links.length) return sec;

        const newLinks = [...sec.links];
        const temp = newLinks[linkIndex];
        newLinks[linkIndex] = newLinks[targetIdx];
        newLinks[targetIdx] = temp;

        return { ...sec, links: newLinks };
      }),
    }));
  };

  const handleDeleteLink = (sectionId: string, linkId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId
          ? { ...sec, links: sec.links.filter((l) => l.id !== linkId) }
          : sec
      ),
    }));
  };

  const filteredSections = useMemo(() => {
    return config.sections.filter((sec) => {
      const matchesFilter =
        activeSectionFilter === "all" || sec.id === activeSectionFilter;
      if (!matchesFilter) return false;

      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        sec.title.toLowerCase().includes(q) ||
        (sec.description && sec.description.toLowerCase().includes(q)) ||
        sec.links.some(
          (l) =>
            l.title.toLowerCase().includes(q) ||
            l.href.toLowerCase().includes(q) ||
            (l.description && l.description.toLowerCase().includes(q))
        )
      );
    });
  }, [config.sections, activeSectionFilter, searchFilter]);

  return (
    <AdminLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Sitemap Manager</span>
            </div>
            <h1 className="font-amethysta text-2xl sm:text-3xl text-foreground tracking-tight">
              Manage Sitemap Content
            </h1>
            <p className="text-sm text-foreground/60 mt-1">
              Directly edit and customize Main Pages, Brand & Corporate, Product Categories, Editorial Guides, Support, or custom sections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sitemap"
              target="_blank"
              className="inline-flex items-center gap-2 p-2.5 rounded-xl bg-surface border border-border text-foreground font-semibold text-xs sm:text-sm hover:border-primary/50 hover:text-primary transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>Preview</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {toastMessage && (
          <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-semibold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Sitemap Hero Header Settings Card */}
        <div className="p-6 bg-surface/60 border border-border rounded-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Edit3 className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">
              Public Sitemap Header Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1">
                Sitemap Hero Title
              </label>
              <input
                type="text"
                value={config.heroTitle || ""}
                placeholder="e.g. Jivanjor Sitemap"
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, heroTitle: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1">
                Sitemap Hero Description
              </label>
              <input
                type="text"
                value={config.heroDescription || ""}
                placeholder="e.g. Find direct links to all main pages..."
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    heroDescription: e.target.value,
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section Quick Jump Filter Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground/70 uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5 text-primary" />
              <span>Jump to Section Editor</span>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-foreground/40" />
              <input
                type="text"
                placeholder="Filter links or titles..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveSectionFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSectionFilter === "all"
                ? "bg-primary text-white shadow-xs"
                : "bg-surface border border-border text-foreground/70 hover:text-foreground"
                }`}
            >
              All Sections ({config.sections.length})
            </button>

            {config.sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionFilter(sec.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeSectionFilter === sec.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface border border-border text-foreground/70 hover:text-foreground"
                  }`}
              >
                {sec.title} ({sec.links.length})
              </button>
            ))}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface/60 border border-border rounded-2xl">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncApi}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border text-foreground font-semibold text-xs hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 ${isSyncing ? "animate-spin text-primary" : ""}`}
              />
              <span>{isSyncing ? "Syncing API..." : "Sync Dynamic API Routes"}</span>
            </button>

            <button
              onClick={() => setShowAddSectionForm(!showAddSectionForm)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 font-semibold text-xs hover:bg-primary/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Section</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-foreground/50 hover:text-red-500 hover:bg-red-500/10 text-xs font-medium transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>
        </div>

        {/* Add Section Form */}
        {showAddSectionForm && (
          <form
            onSubmit={handleAddSection}
            className="p-6 bg-surface border border-primary/30 rounded-2xl space-y-4 animate-fade-in"
          >
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Create New Sitemap Section
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Specialized Solutions"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground/70 mb-1">
                  Section Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Custom application guides & bonding solutions."
                  value={newSectionDesc}
                  onChange={(e) => setNewSectionDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddSectionForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-foreground/60 hover:bg-background"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary/90 cursor-pointer"
              >
                Create Section
              </button>
            </div>
          </form>
        )}

        {/* Sections List */}
        <div className="space-y-6">
          {filteredSections.map((section) => {
            const originalIndex = config.sections.findIndex(
              (s) => s.id === section.id
            );

            return (
              <div
                key={section.id}
                className={`bg-surface/50 border rounded-2xl p-6 transition-all ${section.isVisible
                  ? "border-border"
                  : "border-border/40 opacity-60"
                  }`}
              >
                {/* Section Header Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-border">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) =>
                          handleUpdateSectionHeader(
                            section.id,
                            e.target.value,
                            section.description || ""
                          )
                        }
                        className="font-bold text-base sm:text-lg bg-transparent border-b border-transparent hover:border-border focus:border-primary text-foreground focus:outline-none transition-colors px-1"
                      />
                      <span className="text-xs text-foreground/40 font-mono">
                        ({section.links.length} links)
                      </span>
                    </div>

                    <input
                      type="text"
                      value={section.description || ""}
                      placeholder="Add section description..."
                      onChange={(e) =>
                        handleUpdateSectionHeader(
                          section.id,
                          section.title,
                          e.target.value
                        )
                      }
                      className="text-xs text-foreground/60 bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-colors w-full px-1"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => moveSection(originalIndex, "up")}
                      disabled={originalIndex === 0}
                      title="Move section up"
                      className="p-2 rounded-xl bg-background border border-border text-foreground/70 hover:text-primary disabled:opacity-30 cursor-pointer"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => moveSection(originalIndex, "down")}
                      disabled={originalIndex === config.sections.length - 1}
                      title="Move section down"
                      className="p-2 rounded-xl bg-background border border-border text-foreground/70 hover:text-primary disabled:opacity-30 cursor-pointer"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleSectionVisibility(section.id)}
                      title={
                        section.isVisible
                          ? "Hide section on public sitemap"
                          : "Show section on public sitemap"
                      }
                      className={`p-2 rounded-xl border text-xs font-semibold cursor-pointer ${section.isVisible
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                    >
                      {section.isVisible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      title="Delete section"
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Editable Links List */}
                <div className="space-y-3 mb-6">
                  {section.links.length === 0 ? (
                    <p className="text-xs text-foreground/40 italic">
                      No links in this section. Add one below.
                    </p>
                  ) : (
                    section.links.map((link, lIdx) => (
                      <div
                        key={`${link.id || 'link'}-${lIdx}`}
                        className="p-3.5 rounded-xl bg-background border border-border/80 space-y-2"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                            <div>
                              <label className="text-[10px] font-semibold text-foreground/50 uppercase">
                                Link Title
                              </label>
                              <input
                                type="text"
                                value={link.title}
                                onChange={(e) =>
                                  handleUpdateLink(section.id, link.id, {
                                    title: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold text-foreground/50 uppercase">
                                URL Path
                              </label>
                              <input
                                type="text"
                                value={link.href}
                                onChange={(e) =>
                                  handleUpdateLink(section.id, link.id, {
                                    href: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-semibold text-foreground/50 uppercase">
                                Description (Optional)
                              </label>
                              <input
                                type="text"
                                value={link.description || ""}
                                placeholder="Brief page description..."
                                onChange={(e) =>
                                  handleUpdateLink(section.id, link.id, {
                                    description: e.target.value,
                                  })
                                }
                                className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleMoveLink(section.id, lIdx, "up")
                              }
                              disabled={lIdx === 0}
                              title="Move link up"
                              className="p-1.5 rounded-lg bg-surface border border-border text-foreground/60 hover:text-primary disabled:opacity-30 cursor-pointer"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleMoveLink(section.id, lIdx, "down")
                              }
                              disabled={lIdx === section.links.length - 1}
                              title="Move link down"
                              className="p-1.5 rounded-lg bg-surface border border-border text-foreground/60 hover:text-primary disabled:opacity-30 cursor-pointer"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteLink(section.id, link.id)
                              }
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 cursor-pointer"
                              title="Delete link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Link Form inside Section */}
                <div className="p-3.5 bg-background/60 border border-border/50 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-foreground/70 uppercase tracking-wider">
                    Add Link to &quot;{section.title}&quot;
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Link Title (e.g. Quality Policy)"
                      value={newLinkData[section.id]?.title || ""}
                      onChange={(e) =>
                        setNewLinkData((prev) => ({
                          ...prev,
                          [section.id]: {
                            ...prev[section.id],
                            title: e.target.value,
                            href: prev[section.id]?.href || "",
                            description: prev[section.id]?.description || "",
                          },
                        }))
                      }
                      className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="text"
                      placeholder="Target URL (e.g. /about/quality)"
                      value={newLinkData[section.id]?.href || ""}
                      onChange={(e) =>
                        setNewLinkData((prev) => ({
                          ...prev,
                          [section.id]: {
                            ...prev[section.id],
                            title: prev[section.id]?.title || "",
                            href: e.target.value,
                            description: prev[section.id]?.description || "",
                          },
                        }))
                      }
                      className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Description (Optional)"
                        value={newLinkData[section.id]?.description || ""}
                        onChange={(e) =>
                          setNewLinkData((prev) => ({
                            ...prev,
                            [section.id]: {
                              ...prev[section.id],
                              title: prev[section.id]?.title || "",
                              href: prev[section.id]?.href || "",
                              description: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddLinkToSection(section.id)}
                        className="px-3 py-1.5 bg-primary text-white font-bold rounded-lg text-xs hover:bg-primary/90 shrink-0 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
