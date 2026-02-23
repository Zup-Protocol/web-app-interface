"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import { useMemo, useState } from "react";

interface AssetLogoProps {
  url?: string;
  name?: string;
  symbol?: string;
  size?: number | string;
  className?: string;
}

const FAILED_PREFIX = "zfl:"; // Zup Failed Logo (Persistent 7 days)
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const hashUrl = (url: string) => {
  let h = 0;
  for (let i = 0; i < url.length; i++)
    h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
  return h.toString(36);
};

const logoCache = {
  hasFailed: (url?: string) => {
    if (!url || typeof window === "undefined") return false;
    try {
      const entry = localStorage.getItem(FAILED_PREFIX + hashUrl(url));
      if (!entry) return false;
      if (Date.now() - parseInt(entry) > CACHE_EXPIRY_MS) {
        localStorage.removeItem(FAILED_PREFIX + hashUrl(url));
        console.log("has not failed: ", url);
        return false;
      }
      console.log("has failed: ", url);
      return true;
    } catch {
      console.log("has failed error: ", url);
      return false;
    }
  },

  markFailed: (url?: string) => {
    if (!url || typeof window === "undefined") return;
    try {
      localStorage.setItem(FAILED_PREFIX + hashUrl(url), Date.now().toString());
    } catch {}
  },

  removeFailed: (url?: string) => {
    if (!url || typeof window === "undefined") return;
    try {
      localStorage.removeItem(FAILED_PREFIX + hashUrl(url));
    } catch {}
  },
};

export function AssetLogo({
  url,
  name,
  symbol,
  size = 48,
  className,
}: AssetLogoProps) {
  // Initialize from cache to prevent "Flash" and speculative pre-fetching
  const [isLoading, setIsLoading] = useState(() => {
    if (!url) return false;
    if (typeof window === "undefined") return true;
    // It's newly loading ONLY if we haven't seen it fail yet
    return !logoCache.hasFailed(url);
  });

  const [hasError, setHasError] = useState(() => {
    if (!url || typeof window === "undefined") return false;
    return logoCache.hasFailed(url);
  });

  // Keep state in sync with URL prop changes
  useMemo(() => {
    const isFailed = logoCache.hasFailed(url);

    setIsLoading(!!url && !isFailed);
    setHasError(!!url && isFailed);
  }, [url]);

  const fallbackText = useMemo(() => {
    if (name) return name.charAt(0).toUpperCase();
    if (symbol) return symbol.charAt(0).toUpperCase();
    return "?";
  }, [name, symbol]);

  const sizeStyle =
    typeof size === "number"
      ? { width: size, height: size }
      : { width: size, height: size };

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-full bg-foreground/5 flex items-center justify-center overflow-hidden",
        className,
      )}
      style={sizeStyle}
    >
      {/* Loading Ring */}
      <AnimatePresence>
        {isLoading && !hasError && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            <m.svg
              viewBox="0 0 50 50"
              className="w-full h-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <circle
                cx="25"
                cy="25"
                r="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="30, 150"
                className="text-primary/30"
              />
            </m.svg>
          </m.div>
        )}
      </AnimatePresence>

      {/* Backdrop for Loading */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
      )}

      {/* Error / Fallback State */}
      {(hasError || !url) && (
        <m.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-xl font-bold opacity-30 select-none"
        >
          {fallbackText}
        </m.div>
      )}

      {/* Image State */}
      {url && !hasError && (
        <m.img
          src={url}
          alt={name || symbol || "Asset Logo"}
          onLoad={() => {
            setIsLoading(false);
            if (url) logoCache.removeFailed(url);
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            if (url) logoCache.markFailed(url);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "w-full h-full object-cover",
            isLoading ? "invisible" : "visible",
          )}
        />
      )}
    </div>
  );
}
