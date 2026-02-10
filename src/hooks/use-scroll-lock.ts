"use client";

import { useEffect } from "react";

/**
 * A global counter to keep track of how many components are requesting a scroll lock.
 * This prevents nested components (like a modal inside a fixed drawer) from
 * prematurely unlocking the body scroll.
 */
let lockCount = 0;

interface UseScrollLockOptions {
  enabled?: boolean;
}

export function useScrollLock({ enabled = true }: UseScrollLockOptions = {}) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const body = document.body;
    const html = document.documentElement;
    if (!body || !html) return;

    if (lockCount === 0) body.style.overflow = "hidden";

    lockCount++;

    return () => {
      lockCount--;
      if (lockCount === 0) body.style.overflow = "unset";
    };
  }, [enabled]);
}
