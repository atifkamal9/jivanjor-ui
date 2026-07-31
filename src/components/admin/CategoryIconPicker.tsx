"use client";

import React, { useState } from "react";
import Image from "next/image";
import ImageUpload from "./ImageUpload";
import { Upload, Check } from "lucide-react";

export const PRESET_CATEGORY_ICONS = [
  { label: "Document / Publication", url: "/images/blog/image 47.svg" },
  { label: "Lightbulb / Tips", url: "/images/blog/image 43.svg" },
  { label: "Checkmark / Choice", url: "/images/blog/Check-correct.svg" },
  { label: "Puzzle / Solutions", url: "/images/blog/image 48.svg" },
];

interface CategoryIconPickerProps {
  value: string;
  onChange: (iconUrl: string) => void;
}

export default function CategoryIconPicker({ value, onChange }: CategoryIconPickerProps) {
  const [showUploader, setShowUploader] = useState(false);

  return (
    <div className="space-y-2 font-sans">
      <div className="flex items-center justify-between">
        <span className="block text-[10px] font-bold text-foreground/50 uppercase tracking-wider">
          Category Icon
        </span>
        <button
          type="button"
          onClick={() => setShowUploader(!showUploader)}
          className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Upload className="h-3 w-3" />
          {showUploader ? "Use Presets" : "Upload Icon"}
        </button>
      </div>

      {showUploader ? (
        <ImageUpload
          value={value}
          onChange={(url) => onChange(url)}
          folder="category-icons"
          size="compact"
        />
      ) : (
        <div className="space-y-2">
          {/* Preset icons grid */}
          <div className="grid grid-cols-4 gap-2">
            {PRESET_CATEGORY_ICONS.map((preset) => {
              const isSelected = value === preset.url;
              return (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => onChange(preset.url)}
                  title={preset.label}
                  className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-red-50 dark:bg-red-950/30 border-red-500 shadow-xs ring-2 ring-red-500/20"
                      : "bg-background hover:bg-surface border-border"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 shadow-xs">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                  )}
                  <div className="relative w-7 h-7 flex items-center justify-center">
                    <Image
                      src={preset.url}
                      alt={preset.label}
                      width={28}
                      height={28}
                      className="object-contain max-h-full max-w-full drop-shadow-xs group-hover:scale-110 transition-transform"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Selection Preview */}
          {value && !PRESET_CATEGORY_ICONS.some((p) => p.url === value) && (
            <div className="flex items-center gap-2 p-2 bg-surface rounded-xl border border-border">
              <div className="relative w-6 h-6 shrink-0">
                <Image
                  src={value}
                  alt="Custom icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-[11px] font-semibold text-foreground/70 truncate flex-1">
                Custom Icon Selected
              </span>
              <button
                type="button"
                onClick={() => onChange(PRESET_CATEGORY_ICONS[0].url)}
                className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
