"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { api } from "@/lib/api";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  size?: "default" | "compact";
  className?: string;
  aspect?: "cover" | "icon" | "product" | "author" | "square" | "video" | "banner" | "rectangle" | "default";
}

export default function ImageUpload({
  value,
  onChange,
  folder = "general",
  label,
  size = "default",
  className = "",
  aspect = "default",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate file type is image
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    // Validate size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB.");
      return;
    }

    setUploading(true);
    try {
      const res = await api.uploadFile(file, folder);
      if (res && res.url) {
        onChange(res.url);
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Failed to upload image. Please check backend connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerInput = () => {
    fileInputRef.current?.click();
  };

  // Determine compact size dimensions based on aspect prop:
  // 1. Cover: Large rectangle
  // 2. Icon: Small square
  // 3. Product: A bit larger than icon square
  // 4. Author: Square
  const compactShapeClass =
    aspect === "icon"
      ? "w-16 h-16"
      : aspect === "author"
      ? "w-20 h-20"
      : aspect === "product"
      ? "w-28 h-28"
      : aspect === "square"
      ? "w-24 h-24"
      : aspect === "cover" || aspect === "banner" || aspect === "rectangle"
      ? "w-48 h-24"
      : aspect === "video"
      ? "w-40 h-24"
      : "w-36 h-24";

  if (size === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div
          onClick={triggerInput}
          className={`${compactShapeClass} shrink-0 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-red-500 transition-all ${
            dragActive ? "border-red-500 bg-red-50/10" : ""
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-1.5 p-2 text-center">
              <Loader2 className="h-5 w-5 animate-spin text-red-600" />
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider animate-pulse">Uploading...</span>
            </div>
          ) : value ? (
            <>
              <img src={value} alt="Preview" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 p-1 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerInput();
                  }}
                  className="p-1.5 rounded-lg bg-white text-gray-900 shadow hover:bg-gray-100 transition-transform hover:scale-105"
                  title="Change Image"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear(e);
                  }}
                  className="p-1.5 rounded-lg bg-red-600 text-white shadow hover:bg-red-700 transition-transform hover:scale-105"
                  title="Remove Image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 p-2 text-center">
              <UploadCloud className="h-6 w-6 text-gray-400 group-hover:scale-110 group-hover:text-red-500 transition-all duration-300" />
              <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Upload</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Determine default size shape class based on aspect prop:
  // 1. Cover: Large rectangle (21:9 or 16:9)
  // 2. Icon: Small square (1:1)
  // 3. Product: Larger square (1:1)
  // 4. Author: Square (1:1 avatar)
  const defaultShapeClass =
    aspect === "cover" || aspect === "banner" || aspect === "rectangle"
      ? "w-full aspect-[21/9] sm:aspect-[24/9] min-h-[160px]"
      : aspect === "video"
      ? "w-full aspect-video min-h-[180px]"
      : aspect === "product"
      ? "w-40 h-40 aspect-square"
      : aspect === "author"
      ? "w-32 h-32 aspect-square"
      : aspect === "icon"
      ? "w-20 h-20 aspect-square"
      : aspect === "square"
      ? "w-52 h-52 sm:w-60 sm:h-60 aspect-square"
      : "w-full aspect-[21/9] min-h-[160px]";

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`${defaultShapeClass} border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
          dragActive
            ? "border-red-500 bg-red-50/10"
            : value
            ? "border-gray-200 dark:border-zinc-800"
            : "border-gray-200 dark:border-zinc-800 hover:border-red-500 hover:bg-gray-50/30 dark:hover:bg-zinc-800/10"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-red-600" />
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider animate-pulse">
              Uploading file to storage...
            </span>
          </div>
        ) : value ? (
          <>
            <img src={value} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerInput();
                }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-900 shadow-md transform hover:scale-105 transition-all text-xs font-bold cursor-pointer"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transform hover:scale-105 transition-all cursor-pointer"
                title="Remove image"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-11 w-11 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-100 transition-all duration-300">
              <UploadCloud className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 dark:text-zinc-300">
                Drag & drop image here, or <span className="text-red-600 hover:underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
                Supports JPG, PNG, WEBP or GIF (max. 10MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
