"use client";

import { motion, useAnimation } from "framer-motion";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface RefreshIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface RefreshIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const RefreshIcon = forwardRef<RefreshIconHandle, RefreshIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 18, ...props }, ref) => {
    const controls = useAnimation();
    const isAnimating = useRef(false);
    const shouldAnimate = useRef(false);
    const isControlledRef = useRef(false);

    const startAnimating = useCallback(async () => {
      await controls.start("animate");
    }, [controls]);

    const stopAnimating = useCallback(async () => {
      await controls.start("normal");
    }, [controls]);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: startAnimating,
        stopAnimation: stopAnimating,
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          startAnimating();
        }
      },
      [onMouseEnter, startAnimating],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          stopAnimating();
        }
      },
      [onMouseLeave, stopAnimating],
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          variants={{
            normal: {
              rotate: 0,
              transition: {
                duration: 0.6,
                ease: "easeInOut",
              },
            },
            animate: {
              rotate: 360,
              transition: {
                duration: 1,
                ease: "linear",
                repeat: Infinity,
              },
            },
          }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </motion.svg>
      </div>
    );
  },
);

RefreshIcon.displayName = "RefreshIcon";

export { RefreshIcon };
