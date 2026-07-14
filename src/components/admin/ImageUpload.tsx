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
}

export default function ImageUpload({
  value,
  onChange,
  folder = "general",
  label,
  size = "default",
  className = "",
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
          className={`h-11 w-11 shrink-0 rounded-xl border border-dashed border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-red-500 transition-colors ${
            dragActive ? "border-red-500 bg-red-50/10" : ""
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin text-red-600" />
          ) : value ? (
            <img src={value} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-4.5 w-4.5 text-gray-400" />
          )}
        </div>
        <div className="flex flex-col font-sans">
          {value ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-[10px] text-red-600 hover:text-red-700 font-bold uppercase tracking-wider text-left transition-colors cursor-pointer"
            >
              Clear Image
            </button>
          ) : (
            <button
              type="button"
              onClick={triggerInput}
              disabled={uploading}
              className="text-[10px] text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold uppercase tracking-wider text-left disabled:opacity-50 transition-colors cursor-pointer"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          )}
        </div>
      </div>
    );
  }

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
        className={`w-full min-h-[150px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
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
