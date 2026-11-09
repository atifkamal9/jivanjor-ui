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

/**
 * Formats rich article/blog HTML content so that YouTube URLs (pasted plain text,
 * anchor links, bracket syntax, or bare iframes) are automatically converted into
 * responsive 16:9 embedded player blocks on public blog pages and case studies.
 */
export function formatContentWithYouTubeEmbeds(html?: string): string {
  if (!html || typeof html !== "string") return "";

  const createEmbedHtml = (ytId: string) =>
    `<div data-youtube-video data-video-id="${ytId}" class="youtube-video-container my-6 ml-0 mr-auto relative w-full max-w-[640px] aspect-video rounded-2xl overflow-hidden shadow-md bg-black"><iframe src="https://www.youtube.com/embed/${ytId}?rel=0" class="absolute inset-0 w-full h-full border-0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>`;

  // 1. Convert <p><a href="...youtube...">...</a></p> where the link is the only content in the paragraph
  let result = html.replace(
    /<p(?:\s+[^>]*)?>[\s\n]*(?:<br\s*\/?>[\s\n]*)*<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>[\s\n]*(?:<br\s*\/?>[\s\n]*)*<\/p>/gi,
    (match, href) => {
      const ytId = getYouTubeId(href);
      if (ytId) {
        return createEmbedHtml(ytId);
      }
      return match;
    }
  );

  // 2. Convert <p>https://...youtube... or youtu.be...</p>
  result = result.replace(
    /<p(?:\s+[^>]*)?>[\s\n]*(?:<br\s*\/?>[\s\n]*)*(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[^\s<]+)[\s\n]*(?:<br\s*\/?>[\s\n]*)*<\/p>/gi,
    (match, url) => {
      const ytId = getYouTubeId(url);
      if (ytId) {
        return createEmbedHtml(ytId);
      }
      return match;
    }
  );

  // 3. Convert markdown/bracket syntax [youtube:URL] or [video:URL]
  result = result.replace(
    /\[(?:youtube|video):\s*(https?:\/\/[^\s\]]+)\s*\]/gi,
    (match, url) => {
      const ytId = getYouTubeId(url);
      if (ytId) {
        return createEmbedHtml(ytId);
      }
      return match;
    }
  );

  // 4. Wrap any bare/unwrapped YouTube iframes in responsive container
  result = result.replace(
    /(<iframe\s+[^>]*src=["']https?:\/\/(?:www\.)?(?:youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([^"'?]+)[^"']*["'][^>]*>(?:<\/iframe>)?)/gi,
    (match, iframeTag, rawVideoId) => {
      const ytId = getYouTubeId(rawVideoId) || rawVideoId;
      return createEmbedHtml(ytId);
    }
  );

  // 5. Clean up any accidental double-wrapping from step 4 if iframe was already inside data-youtube-video
  result = result.replace(
    /<div[^>]*data-youtube-video[^>]*>\s*<div[^>]*data-youtube-video[^>]*>(.*?)<\/div>\s*<\/div>/gi,
    '<div data-youtube-video class="youtube-video-container my-6 ml-0 mr-auto relative w-full max-w-[640px] aspect-video rounded-2xl overflow-hidden shadow-md bg-black">$1</div>'
  );

  return result;
}

