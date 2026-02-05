"use client";

import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface MonitorIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface MonitorIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const MonitorIcon = forwardRef<MonitorIconHandle, MonitorIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave],
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Screen Frame */}
          <motion.rect
            animate={controls}
            height="11"
            initial="normal"
            rx="2"
            ry="2"
            variants={{
              normal: { pathLength: 1, opacity: 1 },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                transition: { duration: 0.6, ease: "easeInOut" },
              },
            }}
            width="20"
            x="2"
            y="3"
          />
          {/* Vertical Support */}
          <motion.path
            animate={controls}
            d="M12 17v4"
            initial="normal"
            variants={{
              normal: { pathLength: 1, opacity: 1 },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                transition: { duration: 0.3, delay: 0.4, ease: "easeOut" },
              },
            }}
          />
          {/* Base */}
          <motion.path
            animate={controls}
            d="M7 21h10"
            initial="normal"
            variants={{
              normal: { pathLength: 1, opacity: 1 },
              animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                transition: { duration: 0.3, delay: 0.6, ease: "easeOut" },
              },
            }}
          />
          {/* Screen highlight / shimmer */}
          <motion.path
            animate={controls}
            d="M5 6h4"
            initial="normal"
            strokeWidth="1"
            variants={{
              normal: { opacity: 0.4 },
              animate: {
                opacity: [0, 1, 0.4],
                x: [0, 2, 0],
                transition: { duration: 0.8, delay: 0.8 },
              },
            }}
          />
        </svg>
      </div>
    );
  },
);

MonitorIcon.displayName = "MonitorIcon";

export { MonitorIcon };
