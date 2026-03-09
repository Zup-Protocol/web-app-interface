"use client";

import { ScaleHoverAnimation } from "@/components/ui/animations/scale-hover-animation";
import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ANIMATION_DURATION_MS = 300;
const DOT_SIZE_PX = 10;
const LAYOUT_SPRING = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
  mass: 1,
};

export function PageCounter({
  totalPages,
  currentPage,
  onPageChange,
  className,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const clampedExternalPage = Math.max(0, Math.min(currentPage, Math.max(0, totalPages - 1)));
  const [internalPage, setInternalPage] = useState(clampedExternalPage);
  const clickLockRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestCurrentPageRef = useRef(clampedExternalPage);
  const prevPageRef = useRef(internalPage);

  useEffect(() => {
    latestCurrentPageRef.current = clampedExternalPage;
    if (!clickLockRef.current && clampedExternalPage !== internalPage) {
      setInternalPage(clampedExternalPage);
    }
  }, [clampedExternalPage, internalPage]);

  useEffect(() => {
    return () => {
      if (clickLockRef.current) clearTimeout(clickLockRef.current);
    };
  }, []);

  const handleDotClick = (page: number) => {
    if (page === internalPage) return;

    // Lock against parent scroll updates so the long jump has time to complete securely
    if (clickLockRef.current) clearTimeout(clickLockRef.current);
    clickLockRef.current = setTimeout(() => {
      clickLockRef.current = null;
      // Re-sync with the parent in case it moved while we were jumping
      if (latestCurrentPageRef.current !== page) {
        setInternalPage(latestCurrentPageRef.current);
      }
    }, 800); // 800ms lock to outlast the carousel transition

    setInternalPage(page);
    onPageChange(page);
  };

  const targetDotsCount = Math.min(totalPages, internalPage + 3);
  const [displayDotsCount, setDisplayDotsCount] = useState(Math.min(totalPages, clampedExternalPage + 3));
  useEffect(() => {
    setDisplayDotsCount((current) => {
      const target = Math.min(totalPages, internalPage + 3);
      if (target > current) return target;
      if (current > totalPages) return Math.min(totalPages, target);
      return current;
    });
  }, [totalPages, internalPage]);

  useEffect(() => {
    const goingRight = internalPage > prevPageRef.current;
    const prev = prevPageRef.current;
    prevPageRef.current = internalPage;

    if (goingRight) {
      setDisplayDotsCount(targetDotsCount);
    } else if (targetDotsCount < displayDotsCount) {
      const distanceDots = Math.abs(internalPage - prev);
      const isLongJump = distanceDots > 1;
      const dynamicDurationMs = isLongJump ? ANIMATION_DURATION_MS + Math.min(distanceDots * 5, 100) : ANIMATION_DURATION_MS;

      const cleanupTimer = setTimeout(() => {
        setDisplayDotsCount(targetDotsCount);
      }, dynamicDurationMs + 50);

      return () => clearTimeout(cleanupTimer);
    }
  }, [internalPage, targetDotsCount, displayDotsCount]);

  return (
    <>
      <svg className="pointer-events-none absolute hidden h-0 w-0">
        <defs>
          <filter id="slime-gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5.5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 40 -9"
            />
          </filter>
        </defs>
      </svg>

      <div className={cn("relative flex w-full flex-col items-center justify-start px-4 py-4", className)} style={{ filter: "url(#slime-gooey)" }}>
        <m.div layout transition={LAYOUT_SPRING} className="relative flex flex-wrap justify-center items-center gap-x-[6px] gap-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {Array.from({ length: displayDotsCount }).map((_, i) => {
              const isActive = i === internalPage;

              return (
                <m.div
                  key={i}
                  layout="position"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    ...LAYOUT_SPRING,
                    layout: LAYOUT_SPRING,
                    opacity: { duration: 0.2 },
                    scale: { duration: 0.2 },
                  }}
                  className="relative z-10 flex shrink-0 cursor-pointer items-center justify-center p-1.5"
                  onClick={() => handleDotClick(i)}
                  style={{
                    width: `${DOT_SIZE_PX + 12}px`,
                    height: `${DOT_SIZE_PX + 12}px`,
                  }}
                >
                  <div className="relative" style={{ width: `${DOT_SIZE_PX}px`, height: `${DOT_SIZE_PX}px` }}>
                    <ScaleHoverAnimation scale={isActive ? 1 : 1.5} className="absolute inset-0">
                      {/* Base Inactive Dot */}
                      <div className="h-full w-full rounded-full bg-page-counter-background transition-transform duration-300" />
                    </ScaleHoverAnimation>

                    {/* Slime Active Pill */}
                    {isActive && <m.div layoutId="active-slime-pill" className="absolute inset-0 z-20 rounded-full bg-primary" transition={LAYOUT_SPRING} />}
                  </div>
                </m.div>
              );
            })}
          </AnimatePresence>
        </m.div>
      </div>
    </>
  );
}
