/**
 * Video helper utilities for extracting YouTube IDs, thumbnail URLs, and identifying video formats.
 */

/**
 * Extracts a YouTube Video ID from any standard YouTube URL (watch, embed, short link, shorts) or raw ID.
 */
export function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) return cleanUrl;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = cleanUrl.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Returns the highest resolution thumbnail URL available for a given YouTube URL or video ID.
 */
export function getYouTubeThumbnail(urlOrId?: string, quality: "maxres" | "hq" = "hq"): string | null {
  const id = getYouTubeId(urlOrId);
  if (!id) return null;
  return quality === "maxres"
    ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    : `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Checks whether a URL is a video (either YouTube, HTML5 video file, or general video link).
 */
export function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  if (getYouTubeId(url)) return true;
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url) || url.includes("video");
}

import React from "react";

/**
 * YouTube brand icon SVG component.
 */
export function YouTubeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return React.createElement(
    "svg",
    { className, viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement("path", {
      d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    })
  );
}

