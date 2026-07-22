"use client";

import { useEffect, useState } from "react";

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getFileExtension(fileUrl?: string): string {
  if (!fileUrl) return "PDF";
  try {
    const cleanUrl = fileUrl.split("?")[0].split("#")[0];
    const ext = cleanUrl.substring(cleanUrl.lastIndexOf(".") + 1).toUpperCase();
    if (ext && ext.length <= 6 && !ext.includes("/")) {
      return ext;
    }
  } catch {
    // Fallback
  }
  return "PDF";
}

export function useFileMetadata(fileUrl?: string, initialSize?: string | number) {
  const defaultSize = "1.2 MB";

  const [fileMeta, setFileMeta] = useState<{ ext: string; sizeStr: string; label: string }>(() => {
    const ext = getFileExtension(fileUrl);
    const size = initialSize ? (typeof initialSize === "number" ? formatBytes(initialSize) : String(initialSize)) : defaultSize;
    return {
      ext,
      sizeStr: size,
      label: `${ext} | ${size}`,
    };
  });

  useEffect(() => {
    const ext = getFileExtension(fileUrl);

    if (initialSize) {
      const formatted = typeof initialSize === "number" ? formatBytes(initialSize) : String(initialSize);
      const sizeStr = formatted || defaultSize;
      setFileMeta({
        ext,
        sizeStr,
        label: `${ext} | ${sizeStr}`,
      });
      return;
    }

    if (!fileUrl) {
      setFileMeta({
        ext: "PDF",
        sizeStr: defaultSize,
        label: `PDF | ${defaultSize}`,
      });
      return;
    }

    let isMounted = true;
    fetch(fileUrl, { method: "HEAD" })
      .then((res) => {
        const length = res.headers.get("content-length");
        if (length && isMounted) {
          const bytes = parseInt(length, 10);
          if (!isNaN(bytes) && bytes > 0) {
            const formatted = formatBytes(bytes);
            setFileMeta({
              ext,
              sizeStr: formatted,
              label: `${ext} | ${formatted}`,
            });
            return;
          }
        }
        if (isMounted) {
          setFileMeta({
            ext,
            sizeStr: defaultSize,
            label: `${ext} | ${defaultSize}`,
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          setFileMeta({
            ext,
            sizeStr: defaultSize,
            label: `${ext} | ${defaultSize}`,
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fileUrl, initialSize]);

  return fileMeta;
}
