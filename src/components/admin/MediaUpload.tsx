"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon, Video } from "lucide-react";
import { api } from "@/lib/api";

interface MediaUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  /** If "image", only images accepted. If "video", only videos. If "any", both. */
  accept?: "image" | "video" | "any";
  size?: "default" | "compact";
  className?: string;
  aspect?: "square" | "video" | "banner" | "rectangle" | "default";
}

const ACCEPT_MAP = {
  image: "image/*",
  video: "video/mp4,video/webm,video/quicktime",
  any: "image/*,video/mp4,video/webm,video/quicktime",
};

const isVideo = (url: string) =>
  /\.(mp4|webm|mov)(\?.*)?$/i.test(url) || url.includes("video");

export default function MediaUpload({
  value,
  onChange,
  folder = "general",
  label,
  accept = "any",
  size = "default",
  className = "",
  aspect = "default",
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    const isImageFile = file.type.startsWith("image/");
    const isVideoFile = file.type.startsWith("video/");

    if (accept === "image" && !isImageFile) {
      alert("Only image files are allowed here.");
      return;
    }
    if (accept === "video" && !isVideoFile) {
      alert("Only video files are allowed here.");
      return;
    }
    if (accept === "any" && !isImageFile && !isVideoFile) {
      alert("Only image or video files are allowed.");
      return;
    }

    const maxMB = isVideoFile ? 50 : 10;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`File size should be less than ${maxMB}MB.`);
      return;
    }

    setUploading(true);
    try {
      const res = await api.uploadFile(file, folder);
      if (res && res.url) {
        onChange(res.url);
      }
    } catch (err) {
      console.error("Failed to upload media:", err);
      alert("Failed to upload file. Please check backend connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleUpload(e.target.files[0]);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerInput = () => fileInputRef.current?.click();

  const valueIsVideo = value ? isVideo(value) : false;

  const acceptStr = ACCEPT_MAP[accept];

  const labelHint =
    accept === "image"
      ? "JPG, PNG, WEBP or GIF (max 10MB)"
      : accept === "video"
      ? "MP4, WEBM or MOV (max 50MB)"
      : "Image (max 10MB) or Video (max 50MB)";

  const compactShapeClass =
    aspect === "square"
      ? "w-24 h-24"
      : aspect === "video" || accept === "video"
      ? "w-40 h-24"
      : aspect === "banner" || aspect === "rectangle"
      ? "w-44 h-24"
      : "w-36 h-24";

  // ── COMPACT SIZE ─────────────────────────────────────────────────────────────
  if (size === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptStr}
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
              {valueIsVideo ? (
                <video
                  src={value}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <img src={value} alt="Preview" className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1.5 p-1 backdrop-blur-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerInput();
                  }}
                  className="p-1.5 rounded-lg bg-white text-gray-900 shadow hover:bg-gray-100 transition-transform hover:scale-105"
                  title="Change Media"
                >
                  {valueIsVideo ? <Video className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear(e);
                  }}
                  className="p-1.5 rounded-lg bg-red-600 text-white shadow hover:bg-red-700 transition-transform hover:scale-105"
                  title="Remove Media"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : accept === "video" ? (
            <div className="flex flex-col items-center justify-center gap-1.5 p-2 text-center">
              <Video className="h-6 w-6 text-gray-400 group-hover:scale-110 group-hover:text-red-500 transition-all duration-300" />
              <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Video</span>
            </div>
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

  const defaultShapeClass =
    aspect === "banner" || aspect === "rectangle"
      ? "w-full aspect-[21/9] sm:aspect-[24/9] min-h-[160px]"
      : aspect === "video" || accept === "video"
      ? "w-full aspect-video min-h-[180px]"
      : aspect === "square"
      ? "w-52 h-52 sm:w-60 sm:h-60 aspect-square"
      : "w-full aspect-[21/9] min-h-[160px]";

  // ── DEFAULT SIZE ──────────────────────────────────────────────────────────────
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
        accept={acceptStr}
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
            {valueIsVideo ? (
              <video
                src={value}
                className="absolute inset-0 h-full w-full object-cover"
                muted
                playsInline
                loop
              />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerInput();
                }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-900 shadow-md transform hover:scale-105 transition-all text-xs font-bold cursor-pointer"
              >
                Change {valueIsVideo ? "Video" : "Image"}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transform hover:scale-105 transition-all cursor-pointer"
                title="Remove file"
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
                Drag & drop here, or{" "}
                <span className="text-red-600 hover:underline">browse</span>
              </p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
                {labelHint}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
