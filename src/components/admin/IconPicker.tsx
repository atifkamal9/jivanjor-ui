"use client";

import React, { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Search, X, Check, Smile } from "lucide-react";

// ── Platform Icon Registry ──────────────────────────────────────────────────
// Curated set of icons relevant to adhesives, construction, and maintenance.
// The `key` matches the Lucide export name exactly — this is what gets stored in DB.
export const PLATFORM_ICONS: { key: string; label: string }[] = [
  // Adhesives & Woodworking
  { key: "Droplets",        label: "Waterproof" },
  { key: "Layers",          label: "Layers / Laminate" },
  { key: "TreePine",        label: "Wood / Timber" },
  { key: "Package",         label: "Product / Pack" },
  { key: "FlaskConical",    label: "Chemical / Formula" },
  { key: "TestTubes",       label: "Lab / Testing" },
  { key: "Flame",           label: "Heat / Temperature" },
  { key: "Snowflake",       label: "Cold / Freeze" },
  { key: "Wind",            label: "Ventilation / Low Odor" },
  { key: "Leaf",            label: "Eco Friendly" },
  { key: "Recycle",         label: "Recyclable / Sustainable" },
  { key: "ShieldCheck",     label: "Shield / Protection" },
  { key: "Shield",          label: "Protective Coating" },
  { key: "Star",            label: "Premium / Quality" },
  { key: "Sparkles",        label: "Super Premium" },
  { key: "Award",           label: "Award / Certified" },
  { key: "Zap",             label: "Fast Cure / Quick Grab" },
  { key: "Bolt",            label: "High Strength" },
  // Construction & Tiles
  { key: "Hammer",          label: "Construction / Hammer" },
  { key: "Wrench",          label: "Maintenance / Tool" },
  { key: "HardHat",         label: "Safety / Worksite" },
  { key: "Building2",       label: "Building / Structure" },
  { key: "Home",            label: "Home / Interior" },
  { key: "Brick",           label: "Tile / Brick" },
  { key: "Grid3x3",         label: "Grid / Tiles" },
  { key: "Layers3",         label: "Layered / Stacked" },
  // Waterproofing & Sealants
  { key: "CloudRain",       label: "Waterproofing / Rain" },
  { key: "Umbrella",        label: "Weather Resistance" },
  { key: "Waves",           label: "Water / Fluid" },
  { key: "Droplet",         label: "Liquid / Adhesive" },
  { key: "Filter",          label: "Sealant / Filter" },
  { key: "CircleDot",       label: "Pipe Sealant" },
  // Foam & Upholstery
  { key: "Sofa",            label: "Upholstery / Foam" },
  { key: "Armchair",        label: "Furniture" },
  { key: "LayoutGrid",      label: "Panel / Board" },
  // Maintenance & Lubrication
  { key: "Settings",        label: "Settings / Mechanical" },
  { key: "Settings2",       label: "Fine Tuning" },
  { key: "Cog",             label: "Machine / Industrial" },
  { key: "Gauge",           label: "Performance" },
  { key: "BarChart2",       label: "Grade / Spec" },
  // General / Misc
  { key: "Tag",             label: "Label / Badge" },
  { key: "Tags",            label: "Multi-category" },
  { key: "Boxes",           label: "Boxes / Batch" },
  { key: "Box",             label: "Single Product" },
  { key: "PaintBucket",     label: "Paint / Coating" },
  { key: "Palette",         label: "Color / Palette" },
  { key: "Ruler",           label: "Precision / Measure" },
  { key: "Scissors",        label: "Cutting / Trim" },
  { key: "Pipette",         label: "Applicator / Dropper" },
  { key: "Microscope",      label: "Quality / Lab Test" },
];

// ── Dynamic renderer ─────────────────────────────────────────────────────────
export function DynamicIcon({
  iconKey,
  className = "h-5 w-5",
}: {
  iconKey: string;
  className?: string;
}) {
  const Icon = (LucideIcons as any)[iconKey] as
    | React.ComponentType<{ className?: string }>
    | undefined;
  if (!Icon) return <Smile className={className} />;
  return <Icon className={className} />;
}

// ── IconPicker Component ─────────────────────────────────────────────────────
interface IconPickerProps {
  value: string;
  onChange: (iconKey: string) => void;
  label?: string;
}

export default function IconPicker({ value, onChange, label = "Category Icon" }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return PLATFORM_ICONS;
    return PLATFORM_ICONS.filter(
      (ic) =>
        ic.label.toLowerCase().includes(q) ||
        ic.key.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedIcon = PLATFORM_ICONS.find((ic) => ic.key === value);

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
        {label}
      </label>

      {/* Trigger Button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-red-400 hover:bg-red-50/30 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-red-500 dark:hover:bg-red-950/10 transition-all cursor-pointer text-sm font-medium text-gray-700 dark:text-zinc-300 min-w-[200px]"
        >
          {value ? (
            <>
              <span className="h-9 w-9 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <DynamicIcon iconKey={value} className="h-5 w-5" />
              </span>
              <div className="text-left">
                <p className="text-xs font-extrabold text-gray-900 dark:text-zinc-50">
                  {selectedIcon?.label || value}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono">{value}</p>
              </div>
            </>
          ) : (
            <>
              <span className="h-9 w-9 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-gray-400 dark:text-zinc-500">
                <Smile className="h-5 w-5" />
              </span>
              <span className="text-gray-400 dark:text-zinc-500 text-sm">No icon selected</span>
            </>
          )}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer border border-gray-200 dark:border-zinc-800"
            title="Clear icon"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
        >
          Browse Icons
        </button>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] animate-[modalShow_0.15s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-zinc-50">
                  Select a Platform Icon
                </h3>
                <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium mt-0.5">
                  {PLATFORM_ICONS.length} icons available · Search by name or type
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-3 border-b border-gray-100 dark:border-zinc-800 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search icons by name or type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Icon Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400 dark:text-zinc-500">
                  <Search className="h-8 w-8 opacity-40" />
                  <p className="text-sm font-semibold">No icons match &quot;{search}&quot;</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                  {filtered.map((icon) => {
                    const isSelected = value === icon.key;
                    return (
                      <button
                        key={icon.key}
                        type="button"
                        onClick={() => {
                          onChange(icon.key);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        title={icon.label}
                        className={`relative group flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border transition-all duration-200 cursor-pointer aspect-square ${
                          isSelected
                            ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20"
                            : "bg-gray-50/50 border-gray-100 hover:border-red-300 hover:bg-red-50/50 text-gray-600 dark:bg-zinc-800/50 dark:border-zinc-800 dark:hover:border-red-600/50 dark:hover:bg-red-950/20 dark:text-zinc-400"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5">
                            <Check className="h-3 w-3 text-white" />
                          </span>
                        )}
                        <DynamicIcon
                          iconKey={icon.key}
                          className={`h-6 w-6 transition-transform group-hover:scale-110 ${
                            isSelected ? "text-white" : ""
                          }`}
                        />
                        <span className="text-[9px] font-bold text-center leading-tight line-clamp-2 max-w-full">
                          {icon.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/50 shrink-0 flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
                {filtered.length} of {PLATFORM_ICONS.length} icons shown
              </span>
              <button
                type="button"
                onClick={() => { setIsOpen(false); setSearch(""); }}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
