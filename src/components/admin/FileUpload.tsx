"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Loader2, FileText, Download } from "lucide-react";
import { api } from "@/lib/api";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export default function FileUpload({
  value,
  onChange,
  folder = "documents",
  label,
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file) return;

    // Validate size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      alert("File size should be less than 25MB.");
      return;
    }

    setUploading(true);
    try {
      const res = await api.uploadFile(file, folder);
      if (res && res.url) {
        onChange(res.url);
      }
    } catch (err) {
      console.error("Failed to upload file:", err);
      alert("Failed to upload file. Please check backend connection and try again.");
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

  // Get filename from URL
  const getFilename = (url: string) => {
    if (!url) return "";
    try {
      const decoded = decodeURIComponent(url);
      return decoded.substring(decoded.lastIndexOf("/") + 1);
    } catch {
      return url;
    }
  };

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
        accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
        className="hidden"
      />
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`w-full min-h-[120px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all duration-300 relative overflow-hidden group ${
          dragActive
            ? "border-red-500 bg-red-50/10"
            : value
            ? "border-gray-200 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-955/20"
            : "border-gray-200 dark:border-zinc-800 hover:border-red-500 hover:bg-gray-50/30 dark:hover:bg-zinc-800/10"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-red-600" />
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider animate-pulse">
              Uploading file...
            </span>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center text-center space-y-2 w-full px-4">
            <div className="h-11 w-11 rounded-xl bg-red-50 dark:bg-red-955/25 text-red-600 dark:text-red-400 flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <div className="w-full">
              <p className="text-xs font-bold text-gray-700 dark:text-zinc-300 truncate max-w-xs mx-auto">
                {getFilename(value)}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 truncate max-w-xs mx-auto">
                {value}
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Download className="h-3 w-3" />
                View File
              </a>
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-955/20 dark:hover:bg-red-955/30 text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-11 w-11 rounded-xl bg-red-50 dark:bg-red-955/20 text-red-600 dark:text-red-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-100 transition-all duration-300">
              <UploadCloud className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                Drag & drop document here, or <span className="text-red-600 hover:underline">browse</span>
              </p>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">
                Supports PDF, DOC, DOCX, XLS, XLSX or ZIP (max. 25MB)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
